import React, { useState } from "react";
import {
  addSale,
  fetchSales,
  updateClientPoints,
  fetchClients
} from "./firestoreService";

const FirebaseTest = () => {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [email, setEmail] = useState("");
  const [points, setPoints] = useState(0);

  const handleAddSale = async () => {
    const sale = {
      product: "Cocktail Mojito",
      price: 8,
      date: new Date().toISOString(),
    };
    await addSale(sale);
    alert("✅ Vente ajoutée !");
  };

  const handleFetchSales = async () => {
    const salesList = await fetchSales();
    setSales(salesList);
  };

  const handleUpdatePoints = async () => {
    await updateClientPoints(email, Number(points));
    alert("✅ Points mis à jour !");
  };

  const handleFetchClients = async () => {
    const clientsList = await fetchClients();
    setClients(clientsList);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔥 Tests Firebase</h2>

      {/* Ajouter une vente */}
      <button onClick={handleAddSale} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Ajouter une vente
      </button>

      {/* Voir les ventes */}
      <button onClick={handleFetchSales} className="bg-green-600 text-white px-4 py-2 rounded ml-2">
        Charger ventes
      </button>

      <ul className="mt-4">
        {sales.map((sale, idx) => (
          <li key={idx}>
            {sale.product} - {sale.price}€ - {sale.date}
          </li>
        ))}
      </ul>

      <hr className="my-6" />

      {/* Ajouter/MàJ points client */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email du client"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Points à ajouter"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleUpdatePoints} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Ajouter/MàJ points
        </button>
      </div>

      {/* Voir clients */}
      <button onClick={handleFetchClients} className="bg-purple-700 text-white px-4 py-2 rounded">
        Charger clients
      </button>

      <ul className="mt-4">
        {clients.map((client, idx) => (
          <li key={idx}>
            {client.email} — {client.points} pts
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FirebaseTest;
