// src/components/SalesHistory/SalesHistory.jsx
import React, { useEffect, useState } from 'react';
import { addSale, fetchSales, updateClientPoints } from '../../firebase/firestoreService';

const SalesHistory = () => {
  const [sales, setSales] = useState([]); // État des ventes
  const [loading, setLoading] = useState(false); // Indicateur de chargement

  // Charge et formate les ventes depuis Firestore
  const loadSales = async () => {
    setLoading(true); // Démarre le chargement
    try {
      const all = await fetchSales(); // Récupère toutes les ventes
      const formattedSales = all.map(sale => ({
        ...sale,
        formattedDate: sale.date
          ? new Date(sale.date.seconds * 1000).toLocaleString() // Formate la date
          : 'Date non disponible',
      }));
      setSales(formattedSales); // Met à jour les ventes
    } catch (err) {
      console.error("Erreur lors du chargement des ventes :", err); // Gère les erreurs
    }
    setLoading(false); // Arrête le chargement
  };

  // Charge les ventes au premier rendu du composant
  useEffect(() => {
    loadSales();
  }, []);

  // Ajoute une vente fictive et met à jour les points du client
  const handleAddSale = async () => {
    console.log("Test de clic sur le bouton");
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

    try {
      await addSale(example); // Ajoute la vente à Firestore
      await updateClientPoints(example.clientEmail, example.points_gagnes); // Met à jour les points du client
      await loadSales(); // Recharge les ventes
    } catch (err) {
      console.error("Erreur lors de l'ajout de la vente :", err); // Gère les erreurs
    }
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
        {loading ? (
          <p>Chargement...</p> // Affiche un message de chargement pendant la récupération des données
        ) : sales.length === 0 ? (
          <p>Aucune vente enregistrée.</p> // Affiche un message si aucune vente n'est trouvée
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default SalesHistory;
