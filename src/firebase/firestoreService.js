import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from 'firebase/firestore';

// Définition des collections
const salesCollection = collection(db, "ventes");
const clientsCollection = collection(db, "clients");
const productsCollection = collection(db, "products"); // Collection des produits

// ✅ Ajouter une vente
export const addSale = async (sale) => {
  try {
    const docRef = await addDoc(salesCollection, sale);
    console.log("✅ Vente ajoutée avec ID:", docRef.id);
  } catch (error) {
    console.error("❌ Erreur lors de l’ajout de la vente:", error);
  }
};

// 📊 Récupérer les ventes
export const fetchSales = async () => {
  const snapshot = await getDocs(collection(db, "ventes"));
  return snapshot.docs.map(doc => {
    const sale = doc.data();
    
    let formattedDate = "";
    if (sale.date instanceof Date) {
      formattedDate = sale.date.toLocaleString();
    } else if (sale.date && sale.date.seconds) {
      const saleDate = new Date(sale.date.seconds * 1000);
      formattedDate = saleDate.toLocaleString();
    } else {
      formattedDate = "Date non valide";
    }

    return {
      ...sale,
      formattedDate,
    };
  });
};

// 🧑‍💼 Ajouter ou mettre à jour les points d’un client
export const updateClientPoints = async (email, points) => {
  try {
    const q = query(collection(db, "clients"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { points });
      console.log("✅ Points mis à jour");
    } else {
      await addDoc(collection(db, "clients"), { email, points });
      console.log("✅ Nouveau client ajouté avec points");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des points:", error);
  }
};

// 📋 Récupérer la liste des clients
export const fetchClients = async () => {
  try {
    const snapshot = await getDocs(clientsCollection);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des clients:", error);
    return [];
  }
};

// 📦 Ajouter un produit
export const addProductToFirebase = async (product) => {
  try {
    const docRef = await addDoc(productsCollection, product);
    console.log("✅ Produit ajouté avec ID:", docRef.id);
  } catch (error) {
    console.error("❌ Erreur lors de l’ajout du produit:", error);
  }
};

// 📦 Récupérer la liste des produits
export const fetchProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des produits:", error);
    return [];
  }
};
