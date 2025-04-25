import { addSale } from '../firebase/firestoreService';

const saveSalesToFirestore = async (items, clientEmail, remise, points_gagnes) => {
  const salesData = items.map(item => ({
    nom_produit: item.name,  // Optionnel : cohérence avec Firestore
    prix: item.price,
    quantite: item.qty,
  }));

  const date = new Date();

  try {
    await addSale({
      produits: salesData,    // ✅ Corrigé ici
      date,
      remise,
      points_gagnes,
      clientEmail
    });
    console.log('✅ Vente(s) ajoutée(s) avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout des ventes :', error);
  }
};

export default saveSalesToFirestore;
