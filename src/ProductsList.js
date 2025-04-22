import React, { useEffect, useState } from 'react';
import { app, db } from './firebase/firebaseConfig';

const ProductsList = ({ userPoints }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection('produits')
      .get()
      .then((snapshot) => {
        const productList = snapshot.docs.map(doc => doc.data());
        setProducts(productList);
      });
  }, []);

  return (
    <div className="products-list">
      {products.map((product) => (
        <div
          key={product.id}
          className={`product-card ${userPoints >= product.points_necessaires ? '' : 'disabled'}`}
        >
          <h3>{product.nom}</h3>
          <p>Prix: {product.prix}€</p>
          <p>Points nécessaires: {product.points_necessaires}</p>
          <button disabled={userPoints < product.points_necessaires}>
            {userPoints >= product.points_necessaires ? 'Obtenir avec mes points' : 'Pas assez de points'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
