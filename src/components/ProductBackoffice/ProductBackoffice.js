import React, { useState } from 'react';

const ProductBackoffice = ({ addProduct }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');

  const handleAddProduct = () => {
    if (productName && productPrice && productStock) {
      addProduct(productName, productPrice, productStock);
      setProductName('');
      setProductPrice('');
      setProductStock('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un produit</h1>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="border-2 border-gray-300 p-2 mb-2 w-full"
        placeholder="Nom du produit"
      />
      <input
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        className="border-2 border-gray-300 p-2 mb-2 w-full"
        placeholder="Prix du produit"
      />
      <input
        type="number"
        value={productStock}
        onChange={(e) => setProductStock(e.target.value)}
        className="border-2 border-gray-300 p-2 mb-4 w-full"
        placeholder="Stock disponible"
      />
      <button
        onClick={handleAddProduct}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
      >
        Ajouter
      </button>
    </div>
  );
};

export default ProductBackoffice;
