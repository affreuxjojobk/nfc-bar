import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BarInterface from './BarInterface';
import ProductsList from './ProductsList';

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });
  const [salesHistory, setSalesHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [userPoints, setUserPoints] = useState(0); // Points utilisateur
  const [nfcData, setNfcData] = useState(null);
  const [showHistory, setShowHistory] = useState(false); // Affichage de l'historique des ventes
  const [showOffered, setShowOffered] = useState(false); // Affichage des produits offerts
  const [showDiscounted, setShowDiscounted] = useState(false); // Affichage des produits avec remise
  const [showLoyaltyPoints, setShowLoyaltyPoints] = useState(false); // Affichage des produits avec points de fidélité

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
    const storedSalesHistory = localStorage.getItem('salesHistory');
    if (storedSalesHistory) {
      setSalesHistory(JSON.parse(storedSalesHistory));
    }
    loadCSVProducts();
    initNFC();
  }, []);

  const loadCSVProducts = () => {
    Papa.parse('/produits_bar.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const productsFromCSV = result.data.map(product => ({
          name: product['Produit'].trim(),
          price: parseFloat(product['Prix']) || 0,
          stock: parseInt(product['Stock'], 10) || 0,
          category: product['Catégorie'],
          sales: product['Ventes'] ? parseInt(product['Ventes'], 10) : 0,
          remainingStock: parseInt(product['Stock restant'], 10) || 0,
          loyaltyPoints: product['Points fidélité'] ? parseInt(product['Points fidélité'], 10) : 0,
          isOffered: product['Offert'] === 'Oui', // Ajout de la gestion des produits offerts
          discount: product['Remise'] ? parseFloat(product['Remise']) : 0, // Ajout de la gestion des remises
        }));

        setProducts(productsFromCSV);

        const uniqueCategories = [...new Set(result.data.map(product => product['Catégorie']))];
        setCategories(uniqueCategories);
      },
      skipEmptyLines: true,
    });
  };

  const initNFC = () => {
    if ('NDEFReader' in window) {
      const reader = new window.NDEFReader();
      reader.scan().then(() => {
        reader.onreading = event => {
          const message = event.message;
          for (const record of message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder();
              const nfcText = textDecoder.decode(record.data);
              setNfcData(nfcText);
              alert(`Carte détectée : ${nfcText}`);
            }
          }
        };
      }).catch(error => {
        console.error("Erreur NFC:", error);
      });
    } else {
      console.warn("Le navigateur ne supporte pas le NFC Web");
    }
  };

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
  }, [products, salesHistory]);

  const selectProduct = (product) => {
    if (product.stock > 0) {
      const updatedProducts = products.map(p =>
        p.name === product.name ? { ...p, stock: p.stock - 1 } : p
      );
      setProducts(updatedProducts);
      setSelectedProducts([...selectedProducts, product]);
    } else {
      alert(`Le produit ${product.name} est en rupture de stock.`);
    }
  };

  const removeProduct = (productName) => {
    const product = selectedProducts.find(p => p.name === productName);
    setSelectedProducts(selectedProducts.filter(product => product.name !== productName));

    const updatedProducts = products.map(p =>
      p.name === productName ? { ...p, stock: p.stock + 1 } : p
    );
    setProducts(updatedProducts);
  };

  const calculateTotalSales = () => {
    return selectedProducts.reduce((total, product) => {
      let price = product.price;
      if (product.isOffered) {
        price = 0; // Produit offert
      } else if (product.discount > 0) {
        price -= price * (product.discount / 100); // Appliquer la remise
      }
      return total + price;
    }, 0);
  };

  const confirmSale = () => {
    const confirmation = window.confirm(`Êtes-vous sûr de vouloir valider cette commande ? Total : ${calculateTotalSales()}€`);
    if (confirmation) {
      validateOrder();
    }
  };

  const validateOrder = () => {
    const total = calculateTotalSales();
    setSalesHistory([...salesHistory, ...selectedProducts.map(product => ({
      product: product.name,
      price: product.price,
      date: new Date().toLocaleString(),
      totalSales: total
    }))]);

    setSelectedProducts([]);
  };

  const filteredProducts = categoryFilter
    ? products.filter(product => product.category === categoryFilter)
    : products;

  const simulateNFCScan = () => {
    const simulatedData = "Client123"; // Donnée fictive à adapter
    setNfcData(simulatedData);
    
    // Incrémenter les points
    const pointsGagnes = 10; // Exemple, tu peux ajuster ça selon les règles
    setUserPoints(prevPoints => prevPoints + pointsGagnes);

    alert(`(Simulation) Carte détectée : ${simulatedData}\nPoints gagnés : ${pointsGagnes}\nTotal des points : ${userPoints + pointsGagnes}`);
  };
  
  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-[#F9DC5C] mb-4">Interface du Bar</h1>

      {/* Boutons pour basculer entre l'interface du bar et l'historique */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowHistory(false)}
          className={`px-3 py-1 rounded-full ${!showHistory ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700 text-white'}`}
        >
          Interface du Bar
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`px-3 py-1 rounded-full ${showHistory ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700 text-white'}`}
        >
          Historique des Ventes
        </button>
      </div>

      {/* Affichage de l'interface du bar ou de l'historique des ventes selon l'état */}
      {showHistory ? (
        <div className="bg-white text-black rounded-xl p-4">
          <h2 className="text-2xl font-bold mb-4">Historique des Ventes</h2>
          {salesHistory.length === 0 ? (
            <p>Aucune vente enregistrée.</p>
          ) : (
            <ul>
              {salesHistory.map((sale, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{sale.product}</span>
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
          {/* Interface du bar */}
          {nfcData && (
            <div className="mb-4 text-lg text-green-400">
              Carte détectée : {nfcData}
            </div>
          )}
          
          {/* Affichage des points de l'utilisateur */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#F9DC5C]">
              Points Utilisateur : {userPoints}
            </h3>
          </div>

          {/* Bouton de simulation NFC */}
          <div className="mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
              onClick={simulateNFCScan}
            >
              🎴 Simuler scan NFC / QR Code
            </button>
          </div>

          {/* Filtre par catégorie */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`px-3 py-1 rounded-full ${categoryFilter === '' ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700 text-white'}`}
              onClick={() => setCategoryFilter('')}
            >
              Tout
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-full ${categoryFilter === category ? 'bg-[#F9DC5C] text-black' : 'bg-gray-700 text-white'}`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Liste des produits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.name} className="bg-gray-800 p-4 rounded-xl">
                <h3 className="text-lg text-[#F9DC5C]">{product.name}</h3>
                <p className="text-sm">Prix : {product.price}€</p>
                <p className="text-sm">Stock : {product.stock}</p>
                <p className="text-sm">Catégorie : {product.category}</p>

                {/* Remise et points fidélité */}
                {product.discount > 0 && (
                  <p className="text-sm text-red-400">Remise : {product.discount}%</p>
                )}
                {product.loyaltyPoints > 0 && (
                  <p className="text-sm text-green-400">Points fidélité : {product.loyaltyPoints}</p>
                )}

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl mt-2"
                  onClick={() => selectProduct(product)}
                >
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="mt-8 text-xl font-semibold text-[#F9DC5C]">
            <h2>Total des ventes : {calculateTotalSales()}€</h2>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl mt-4"
              onClick={confirmSale}
            >
              Confirmer la vente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
