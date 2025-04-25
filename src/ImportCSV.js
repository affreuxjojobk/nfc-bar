import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, doc, updateDoc } from './firebase/firebaseConfig';
import { onSnapshot } from 'firebase/firestore';

const BarInterface = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [nfcData, setNfcData] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, snapshot => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.nom,
          price: data.prix,
          stock: data.stock,
          category: data.categorie,
          sales: data.ventes,
          remainingStock: data.stock_restant,
          loyaltyPoints: data.points_necessaires,
          isOffered: data.remise_manuelle > 0,
          discount: data.remise_manuelle,
        };
      });
      setProducts(productsData);
      const uniqueCategories = [...new Set(productsData.map(p => p.category))];
      setCategories(uniqueCategories);
    });
    return () => unsubscribe();
  }, []);

  const selectProduct = (product) => {
    const existing = selectedProducts.find(p => p.name === product.name);
    if (product.stock > 0) {
      if (existing) {
        const updatedSelection = selectedProducts.map(p =>
          p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p
        );
        setSelectedProducts(updatedSelection);
      } else {
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
      }
    } else {
      alert(`Le produit ${product.name} est en rupture de stock.`);
    }
  };

  const removeProduct = (product) => {
    const updated = selectedProducts.map(p => {
      if (p.name === product.name) {
        const qty = p.quantity - 1;
        return qty > 0 ? { ...p, quantity: qty } : null;
      }
      return p;
    }).filter(Boolean);
    setSelectedProducts(updated);
  };

  const calculateTotalSales = () => {
    return selectedProducts.reduce((total, p) => {
      let price = p.isOffered ? 0 : p.discount > 0 ? p.price - (p.price * p.discount / 100) : p.price;
      return total + price * p.quantity;
    }, 0);
  };

  const confirmSale = () => {
    const confirmation = window.confirm(`Valider cette commande ? Total : ${calculateTotalSales()}€`);
    if (confirmation) validateOrder();
  };

  const validateOrder = async () => {
  const total = calculateTotalSales();
  const now = new Date().toLocaleString();

  // Mise à jour de l'historique des ventes
  setSalesHistory([
    ...salesHistory,
    ...selectedProducts.map(product => ({
      produit: product.name,  // Correspond à 'nom' dans Firebase
      prix: product.price,    // Correspond à 'prix' dans Firebase
      quantite: product.quantity,  // Ajoute la quantité vendue
      date: now,
      totalVentes: total  // Correspond au 'total' de la vente
    }))
  ]);

  try {
    const salesRef = collection(db, 'sales');
    const productsRef = collection(db, 'products');

    for (const product of selectedProducts) {
      // 🔹 1. Ajouter la vente avec le client
      await addDoc(salesRef, {
        produit: product.name,  // Enregistre le nom du produit en français
        prix: product.price,    // Enregistre le prix en français
        quantite: product.quantity,  // Ajoute la quantité vendue
        date: now,
        total: total,
        offert: product.isOffered || false,  // Ajoute si le produit est offert
        remise: product.discount || 0,       // Ajoute la remise
        clientId: clientInfo?.id,
        clientName: clientInfo?.name
      });

      // 🔹 2. Mettre à jour le stock dans la collection 'products'
      const snapshot = await getDocs(productsRef);
      const productDoc = snapshot.docs.find(doc => doc.data().nom === product.name); // Recherche par 'nom' dans Firestore

      if (productDoc) {
        const docRef = productDoc.ref;
        const newStock = (productDoc.data().stock || 0) - product.quantity;  // Soustraction en fonction de la quantité
        const remainingStock = (productDoc.data().stock_restant || newStock);

        await docRef.update({
          stock: newStock >= 0 ? newStock : 0,
          stock_restant: remainingStock
        });
      }
    }

    console.log("Commande validée pour le client :", clientInfo?.name);
  } catch (error) {
    console.error("Erreur lors de la validation de la commande :", error);
  }

  // Réinitialisation après la commande
  setSelectedProducts([]);
  setClientInfo(null); // Réinitialiser pour le prochain client
  setNfcData(null); // Réinitialiser les données NFC
};


  const filteredProducts = categoryFilter
    ? products.filter(product => product.category === categoryFilter)
    : products;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-[#F9DC5C] mb-4">Interface du Bar</h1>
      {showHistory ? (
        <div className="bg-white text-black rounded-xl p-4">
          <h2 className="text-2xl font-bold mb-4">Historique des Ventes</h2>
          {salesHistory.length === 0 ? (
            <p>Aucune vente enregistrée.</p>
          ) : (
            <ul>
              {salesHistory.map((sale, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{sale.product} x{sale.quantity}</span>
                  <div className="flex items-center gap-2">
                    <span>{sale.price}€</span>
                    <span>{sale.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          {nfcData && (
            <div className="mb-4 text-lg text-green-400">
              Carte détectée : {nfcData}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.length === 0 ? (
              <p>Aucun produit disponible</p>
            ) : (
              filteredProducts.map(product => (
                <div key={product.name} className="bg-gray-800 p-4 rounded-xl">
                  <h3 className="text-lg text-[#F9DC5C]">{product.name}</h3>
                  <p className="text-sm">Prix : {product.price}€</p>
                  <p className="text-sm">Stock : {product.stock}</p>
                  <p className="text-sm">Catégorie : {product.category}</p>
                  {product.discount > 0 && (
                    <p className="text-sm text-red-400">Remise : {product.discount}%</p>
                  )}
                  {product.loyaltyPoints > 0 && (
                    <p className="text-sm text-green-400">Points fidélité : {product.loyaltyPoints}</p>
                  )}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl mt-2" onClick={() => selectProduct(product)}>Ajouter</button>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 text-xl font-semibold text-[#F9DC5C]">
            <h2>Commande en cours :</h2>
            <ul>
              {selectedProducts.map((product, index) => (
                <li key={index} className="flex justify-between items-center my-2">
                  <span>{product.name} x{product.quantity}</span>
                  <button className="text-red-500 text-sm ml-4" onClick={() => removeProduct(product)}>Retirer</button>
                </li>
              ))}
            </ul>
            <h2 className="mt-4">Total : {calculateTotalSales()}€</h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl mt-4" onClick={confirmSale}>Confirmer la vente</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BarInterface;
