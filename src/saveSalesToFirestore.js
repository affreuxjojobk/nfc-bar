// src/helpers/saveSalesToFirestore.js
import { addSale } from '../firebase/firestoreService';

const saveSalesToFirestore = async (items, clientEmail, remise, points_gagnes) => {
  const salesData = items.map(item => ({
    product: item.name,        // Nom du produit
    price: item.price,         // Prix unitaire
    quantity: item.qty,        // Quantité achetée
  }));

  const date = new Date(); // Date actuelle de la vente

  try {
    await addSale({
      items: salesData,
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
