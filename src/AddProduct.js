// src/AddProduct.js
import React, { useState } from 'react';
import { db, collection, addDoc } from './firebaseConfig'; // Assure-toi d'importer Firestore correctement

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const addProduct = async () => {
    try {
      // Définir la collection 'products'
      const productsCollection = collection(db, 'products'); // 'products' est le nom de ta collection Firestore

      // Ajouter un nouveau produit
      const docRef = await addDoc(productsCollection, {
        name: productName,
        category: category,
        price: parseFloat(price),
        stock: parseInt(stock),
        sales: 0,
        remainingStock: parseInt(stock)
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding product: ", e);
    }
  };

  return (
    <div>
      <h2>Ajouter un Produit</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addProduct();
        }}
      >
        <input
          type="text"
          placeholder="Nom du produit"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button type="submit">Ajouter le Produit</button>
      </form>
    </div>
  );
};

export default AddProduct;
