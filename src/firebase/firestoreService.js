// src/firebase/firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Références de collections
const salesCollection = collection(db, 'Sales');
const clientsCollection = collection(db, 'clients');
const productsCollection = collection(db, 'products');

// ✅ Ajouter une vente
export const addSale = async ({ product, price, quantity, total, date, remise, points_gagnes, clientEmail }) => {
  try {
    if (!product || !price || !quantity || !total) {
      throw new Error("Champs manquants pour l'ajout d'une vente");
    }

    const payload = {
      nom_produit: product,
      prix: price,
      quantite: quantity,
      total,
      date: date instanceof Date ? Timestamp.fromDate(date) : Timestamp.now(),
      remise,
      points_gagnes,
      client_email: clientEmail || null
    };

    const docRef = await addDoc(salesCollection, payload);
    console.log('✅ Vente ajoutée avec ID:', docRef.id);

    // Mise à jour automatique des points client
    if (clientEmail && points_gagnes) {
      await updateClientPoints(clientEmail, points_gagnes, true);
    }

    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout de la vente :', error);
    throw error;
  }
};

// 📤 Ajouter plusieurs ventes (ex: panier complet)
export const saveSalesToFirestore = async (salesList, clientEmail = null) => {
  try {
    let totalPoints = 0;

    for (const sale of salesList) {
      const { product, price, quantity, total, date, remise, points_gagnes } = sale;
      await addSale({ product, price, quantity, total, date, remise, points_gagnes, clientEmail });
      if (points_gagnes) {
        totalPoints += points_gagnes;
      }
    }

    if (clientEmail && totalPoints > 0) {
      await updateClientPoints(clientEmail, totalPoints, true);
    }

    console.log('✅ Toutes les ventes ont été enregistrées');
  } catch (error) {
    console.error('❌ Erreur lors de l’enregistrement des ventes groupées :', error);
  }
};

// 📈 Récupérer les ventes
export const fetchSales = async () => {
  try {
    const q = query(salesCollection, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const s = d.data();
      let formattedDate = 'Date non valide';
      if (s.date instanceof Timestamp) {
        formattedDate = s.date.toDate().toLocaleString();
      }
      return {
        id: d.id,
        nom_produit: s.nom_produit,
        prix: s.prix,
        quantite: s.quantite,
        total: s.total,
        remise: s.remise,
        points_gagnes: s.points_gagnes,
        client_email: s.client_email,
        formattedDate
      };
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des ventes :', error);
    return [];
  }
};

// 🧑‍💼 Ajouter ou mettre à jour les points d’un client
export const updateClientPoints = async (email, points, increment = false) => {
  try {
    const q = query(clientsCollection, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const clientDoc = snapshot.docs[0];
      const existingPoints = clientDoc.data().points || 0;
      const newPoints = increment ? existingPoints + points : points;
      await updateDoc(clientDoc.ref, { points: newPoints });
      console.log('✅ Points client mis à jour');
    } else {
      await addDoc(clientsCollection, {
        email,
        points,
        created_at: Timestamp.now()
      });
      console.log('✅ Nouveau client créé avec points');
    }
  } catch (error) {
    console.error('❌ Erreur mise à jour points client :', error);
  }
};

// 📋 Récupérer la liste des clients
export const fetchClients = async () => {
  try {
    const snapshot = await getDocs(clientsCollection);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('❌ Erreur récupération clients :', error);
    return [];
  }
};

// 📦 Ajouter un produit
export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...product,
      created_at: Timestamp.now()
    });
    console.log('✅ Produit ajouté avec ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur ajout produit :', error);
    throw error;
  }
};

// 📦 Récupérer la liste des produits
export const fetchProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('❌ Erreur récupération produits :', error);
    return [];
  }
};
