import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  increment
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Références de collections
const salesCollection = collection(db, 'sales');
const clientsCollection = collection(db, 'clients');
const productsCollection = collection(db, 'products');

// 📊 Ajouter une vente
export const addSale = async ({ produits, total, date, remise = 0, points_gagnes = 0, clientEmail }) => {
  try {
    // Vérifier si les paramètres requis sont présents et valides
    if (!Array.isArray(produits) || produits.length === 0) {
      throw new Error("Les produits sont requis et doivent être un tableau non vide.");
    }
    if (typeof total !== 'number' || total <= 0) {
      throw new Error("Le total doit être un nombre positif.");
    }

    // Créer le payload pour la vente
    const payload = {
      produits,
      total,
      date: date instanceof Date ? Timestamp.fromDate(date) : Timestamp.now(),  // Assurer que la date est correcte
      remise,
      points_gagnes,
      clientEmail,
    };

    // Ajouter la vente dans Firestore
    const docRef = await addDoc(salesCollection, payload);
    console.log('✅ Vente ajoutée avec ID:', docRef.id);

    // Si des points sont gagnés, mettre à jour les points du client
    if (clientEmail && points_gagnes) {
      await updateClientPoints(clientEmail, points_gagnes, true);
    }

    return docRef.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout de la vente :', error);
    throw error;
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

      // Si plusieurs produits sont stockés dans une vente
      const produits = s.produits?.map(p => ({
        nom: p.nom_produit,
        prix: p.prix,
        quantite: p.quantite,
      })) || [];

      return {
        id: d.id,
        produits,
        total: s.total,
        remise: s.remise,
        points_gagnes: s.points_gagnes,
        client_email: s.client_email,
        formattedDate,
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
      // Si le client n'existe pas, le créer avec les points
      await addDoc(clientsCollection, {
        email,
        points,
        created_at: Timestamp.now(),
      });
      console.log('✅ Nouveau client créé avec points');
    }
  } catch (error) {
    console.error('❌ Erreur mise à jour points client :', error);
  }
};

// 📦 Ajouter un produit
export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...product,
      created_at: Timestamp.now(),
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
