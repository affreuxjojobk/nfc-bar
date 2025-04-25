import React, { useEffect, useState } from 'react';
import { addSale, fetchSales, updateClientPoints } from '../../firebase/firestoreService';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);

  const loadSales = async () => {
    const all = await fetchSales();
    const formattedSales = all.map(sale => ({
      ...sale,
      formattedDate: sale.date
        ? new Date(sale.date.seconds * 1000).toLocaleString()
        : '',
    }));
    setSales(formattedSales);
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleAddSale = async () => {
    const example = {
      produits: [
        { nom: 'CIROC / BELVEDERE', prix: 130, quantite: 1 },
        { nom: 'Accras', prix: 10, quantite: 2 },
      ],
      total: 150,
      remise: 0,
      points_gagnes: 3,
      clientEmail: 'client@example.com',
      date: new Date(),
    };

    await addSale(example);
    await updateClientPoints(example.clientEmail, example.points_gagnes);
    await loadSales();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">🧾 Historique des ventes</h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleAddSale}
          className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg shadow"
        >
          ➕ Ajouter vente fictive
        </button>
        <button
          onClick={loadSales}
          className="bg-gray-500 hover:bg-gray-600 transition text-white px-4 py-2 rounded-lg shadow"
        >
          🔄 Recharger
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-4 py-2">Produits</th>
              <th className="text-left px-4 py-2">Total</th>
              <th className="text-left px-4 py-2">Remise</th>
              <th className="text-left px-4 py-2">Points</th>
              <th className="text-left px-4 py-2">Client</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, i) => (
              <tr key={i} className="border-b align-top">
                <td className="px-4 py-2">
                  {sale.produits?.map((p, idx) => (
                    <div key={idx}>
                      {p.nom} x{p.quantite} — {p.prix}€
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 font-bold">{sale.total}€</td>
                <td className="px-4 py-2">{sale.remise || 0}€</td>
                <td className="px-4 py-2">{sale.points_gagnes || 0}</td>
                <td className="px-4 py-2">{sale.clientEmail || '-'}</td>
                <td className="px-4 py-2 text-sm">{sale.formattedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistory;
