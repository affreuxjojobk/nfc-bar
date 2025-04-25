// src/BarInterface.jsx
import React, { useState, useEffect } from 'react';
import {
  db,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc
} from '../firebase/firebaseConfig';  // Ici on exporte tous depuis firebaseConfig

const BarInterface = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelected] = useState([]); // {id,name,price,quantity,discount,isOffered,loyaltyPoints,stock}
  const [salesHistory, setSalesHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  // 1️⃣ Chargement temps réel + tri catégories
  useEffect(() => {
    const ref = collection(db, 'products');
    const unsub = onSnapshot(ref, snap => {
      const data = snap.docs.map(d => {
        const o = d.data();
        return {
          id: d.id,
          name: o.nom,
          price: o.prix,
          stock: o.stock,
          discount: o.remise_manuelle,
          isOffered: o.remise_manuelle > 0,
          loyaltyPoints: o.points_necessaires,
          category: o.categorie
        };
      });
      setProducts(data);

      const desiredOrder = [
        'Bouteilles',
        'Alcool à la verse (standard)',
        'Alcool à la verse (Supérieur)',
        'Bières',
        'Jus',
        'Conso avec entrée',
        'Snacking',
        'Goodies'
      ];
      const cats = [...new Set(data.map(p => p.category))];
      cats.sort((a,b) => {
        const ia = desiredOrder.indexOf(a),
              ib = desiredOrder.indexOf(b);
        if (ia!==-1||ib!==-1) return (ia===-1?Infinity:ia) - (ib===-1?Infinity:ib);
        return a.localeCompare(b);
      });
      setCategories(cats);
    });
    return () => unsub();
  }, []);

  // 2️⃣ Ajouter au panier (avec quantité)
  const selectProduct = p => {
    if (p.stock <= 0) return alert(`${p.name} en rupture.`);
    setProducts(ps => ps.map(x =>
      x.id === p.id
        ? { ...x, stock: x.stock - 1 }
        : x
    ));
    setSelected(sp => {
      const exists = sp.find(x => x.id === p.id);
      if (exists) {
        return sp.map(x =>
          x.id === p.id
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }
      return [...sp, { ...p, quantity: 1 }];
    });
  };

  // 3️⃣ Retirer un article du panier (décrémenter la quantité)
  const decreaseProductQuantity = id => {
    setSelected(sp => sp.map(x =>
      x.id === id
        ? { ...x, quantity: Math.max(x.quantity - 1, 0) } // Décrémenter la quantité, ne pas descendre en dessous de 0
        : x
    ));
  };

  // 4️⃣ Calcul total & points
  const calculateTotal = () =>
    selectedProducts.reduce((sum,p) => {
      let line = p.isOffered ? 0 : p.price * p.quantity;
      if (!p.isOffered && p.discount > 0) line *= 1 - p.discount / 100;
      return sum + line;
    }, 0);

  const calculatePoints = () =>
    selectedProducts.reduce((sum,p) => sum + p.loyaltyPoints * p.quantity, 0);

const validateOrder = async () => {
  const total = calculateTotal();
  const now = new Date().toLocaleString();
  const earned = calculatePoints();

  // Historique local
  setSalesHistory(sh => [
    ...sh,
    ...selectedProducts.map(p => ({
      product: p.name,
      quantity: p.quantity,
      totalSales: p.isOffered ? 0 : p.price * p.quantity,
      date: now,
    }))
  ]);
  setUserPoints(up => up + earned);

  try {
    const salesRef = collection(db, 'ventes');
    for (const p of selectedProducts) {
      // Ajouter la vente dans la base de données
      await addDoc(salesRef, {
        nom_produit: p.name,
        quantite: p.quantity,
        total: p.isOffered ? 0 : p.price * p.quantity,
        date: now,
        remise: p.discount,
        points_gagnes: p.loyaltyPoints * p.quantity,
      });

      // Mettre à jour le stock du produit dans Firestore
      const prodRef = doc(db, 'products', p.id);
      await updateDoc(prodRef, { stock: p.stock - p.quantity }); // Décrémenter le stock en fonction de la quantité vendue
    }
    alert(`Vente enregistrée ! Points gagnés : ${earned}`);
  } catch (e) {
    console.error(e);
    alert('Erreur en base');
  }

  setSelected([]); // vider panier
};


  const confirmSale = () => {
    if (!selectedProducts.length) return alert('Panier vide');
    if (window.confirm(`Total ${calculateTotal()}€ ?`)) validateOrder();
  };

  // Filtrage
  const filtered = categoryFilter
    ? products.filter(p => p.category === categoryFilter)
    : products;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-[#F9DC5C] mb-4">Interface du Bar</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(false)}
            className={`px-3 py-1 rounded-full ${
              !showHistory ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`px-3 py-1 rounded-full ${
              showHistory ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700'
            }`}
          >
            Historique
          </button>
        </div>
        <div>Points fidélité : <b>{userPoints}</b></div>
      </div>

      {showHistory ? (
        <div className="bg-white text-black rounded-xl p-4">
          <h2 className="text-2xl mb-4">Historique des ventes</h2>
          {salesHistory.length === 0
            ? <p>Aucune vente.</p>
            : <ul className="space-y-2">
                {salesHistory.map((s, i) => (
                  <li key={i} className="flex justify-between text-sm border-b pb-1">
                    <span>{s.product} x{s.quantity}</span>
                    <span>{s.totalSales}€</span>
                    <span className="italic">{s.date}</span>
                  </li>
                ))}
              </ul>
          }
        </div>
      ) : (
        <>
          {/* Catégories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-3 py-1 rounded-full ${
                !categoryFilter ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700'
              }`}
            >
              Tous
            </button>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full ${
                  categoryFilter === cat ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grille produits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-gray-800 p-4 rounded-xl flex flex-col">
                <h3 className="text-[#F9DC5C] font-semibold">{p.name}</h3>
                <p className="text-sm">Prix : {p.price}€</p>
                <p className="text-sm">Stock : {p.stock}</p>
                {p.loyaltyPoints > 0 && <p className="text-sm text-green-400">+{p.loyaltyPoints} pts</p>}
                {p.discount > 0 && <p className="text-sm text-red-400">-{p.discount}% remise</p>}
                <button
                  onClick={() => selectProduct(p)}
                  disabled={p.stock <= 0}
                  className="mt-auto bg-blue-600 hover:bg-blue-700 py-2 rounded-xl"
                >
                  {p.stock > 0 ? 'Ajouter' : 'Rupture'}
                </button>
              </div>
            ))}
          </div>

          {/* Panier */}
          {selectedProducts.length > 0 && (
            <div className="mt-8 bg-gray-900 p-4 rounded-xl">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl text-[#F9DC5C]">Panier</h2>
                <span>Total : {calculateTotal()}€</span>
              </div>
              <ul className="space-y-2 mb-4">
                {selectedProducts.map(p => (
                  <li key={p.id} className="flex justify-between items-center">
                    <span>{p.name} x{p.quantity}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => decreaseProductQuantity(p.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded-full"
                      >
                        -
                      </button>
                      <button
                        onClick={() => selectProduct(p)}
                        className="bg-green-600 text-white px-2 py-1 rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={confirmSale}
                className="bg-[#F9DC5C] text-black px-6 py-3 rounded-full w-full"
              >
                Confirmer la commande
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BarInterface;
