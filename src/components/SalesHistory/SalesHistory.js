// /components/sales/SalesHistory.js
import React, { useEffect, useState } from 'react';
import { addSale, fetchSales, updateClientPoints } from '../../firebase/firestoreService';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const loadSales = async () => {
      const data = await fetchSales();
      setSales(data);
    };
    loadSales();
  }, []);

  const handleAddSale = async (product, price, clientEmail) => {
    const newSale = {
      product,
      price,
      email: clientEmail,
      date: new Date().toISOString()
    };

    await addSale(newSale);
    await updateClientPoints(clientEmail, price);
    const updatedSales = await fetchSales();
    setSales(updatedSales);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Historique des ventes</h2>
      <button onClick={() => handleAddSale('T-shirt', 20, 'client@example.com')}>
        Ajouter une vente (T-shirt 20€)
      </button>
      <ul className="mt-4 space-y-2">
        {sales.map((sale, index) => (
          <li key={index} className="border p-2 rounded shadow-sm">
            {sale.product} - {sale.price}€ - {new Date(sale.date).toLocaleString()} - {sale.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesHistory;
