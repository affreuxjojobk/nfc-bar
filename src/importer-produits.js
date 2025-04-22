const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://console.firebase.google.com/u/0/project/projet-nfc/firestore/databases/-default-/data/~2Fproducts~2FpRDwaQf5tNUKP9jg0UsX' // Remplace par ton URL Firestore
});

const db = admin.firestore();

const importCSVToFirestore = () => {
  const produits = [];

  fs.createReadStream('produits.csv')  // Remplace par le chemin vers ton fichier CSV
    .pipe(csv())
    .on('data', (row) => {
      // Nettoyer les clés (propriétés de l'objet) et les valeurs
      const cleanedRow = {};
      Object.keys(row).forEach(key => {
        // Enlever les espaces avant et après les clés et les valeurs
        const cleanedKey = key.trim();
        const cleanedValue = (row[key] || '').trim();
        cleanedRow[cleanedKey] = cleanedValue;
      });

      console.log('Ligne lue:', cleanedRow); // Afficher la ligne nettoyée
      console.log('ID du produit:', cleanedRow.id); // Afficher l'ID nettoyé
      
      if (!cleanedRow.id) {
        console.log(`ID manquant pour le produit: ${cleanedRow.nom}`); // Si l'ID est manquant
      }
      
      produits.push(cleanedRow);  // Ajouter la ligne nettoyée au tableau produits
    })
    .on('end', () => {
      produits.forEach(async (produit) => {
        if (produit.id) {
          const produitRef = db.collection('produits').doc(produit.id);
          console.log(`Insertion du produit avec l'ID: ${produit.id}`); // Log de l'insertion
          await produitRef.set({
            nom: produit.nom,
            catégorie: produit.catégorie,
            prix: parseFloat(produit.prix),
            stock: parseInt(produit.stock),
            ventes: parseInt(produit.ventes),
            stock_restant: parseInt(produit.stock_restant),
            points_necessaires: parseInt(produit.points_necessaires),
            remise_manuelle: parseFloat(produit.remise_manuelle)
          });
        }
      });

      console.log('Importation terminée');
    });
};

importCSVToFirestore();
