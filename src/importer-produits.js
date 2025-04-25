const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const importerProduits = () => {
  const produits = [];

  fs.createReadStream('produits.csv')
    .pipe(csv())
    .on('data', (row) => {
      const produit = {
        nom: row.nom?.trim(),
        categorie: row.categorie?.trim(),
        prix: parseFloat(row.prix) || 0,
        stock: parseInt(row.stock) || 0,
        ventes: parseInt(row.ventes) || 0,
        stock_restant: parseInt(row.stock_restant) || 0,
        points_necessaires: parseInt(row.points_necessaires) || 0,
        remise_manuelle: parseFloat(row.remise_manuelle) || 0,
      };

      if (produit.nom) {
        produits.push(produit);
      } else {
        console.warn(`⛔ Produit invalide (nom manquant) : ${JSON.stringify(produit)}`);
      }
    })
    .on('end', async () => {
      try {
        const batch = db.batch();

        produits.forEach(produit => {
          // Créer un ID unique pour chaque produit basé sur le nom
          const produitId = produit.nom
            .toLowerCase()
            .normalize('NFD') // Enlève les accents
            .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
            .replace(/\s+/g, '_') // Remplace les espaces par des underscores
            .replace(/[^a-z0-9_]/g, ''); // Supprime les caractères spéciaux

          // Référence vers le document du produit dans la collection 'products'
          const produitRef = db.collection('products').doc(produitId);

          // Ajouter le produit à la collection avec un merge pour éviter de dupliquer les produits existants
          batch.set(produitRef, produit, { merge: true });
        });

        // Commencer l'opération de batch commit
        await batch.commit();
        console.log('✅ Produits importés avec succès dans Firestore !');
      } catch (error) {
        console.error('❌ Erreur lors de l\'importation :', error);
      }
    });
};

// Appeler la fonction pour importer les produits
importerProduits();
