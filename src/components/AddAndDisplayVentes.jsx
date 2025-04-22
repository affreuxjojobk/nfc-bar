// src/components/AddAndDisplayVentes.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, Timestamp } from "firebase/firestore";

const AddAndDisplayVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [client, setClient] = useState({ id: "", nom: "", prenom: "" });

  const ventesCollection = collection(db, "ventes");

  // 🔄 Afficher les ventes en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(ventesCollection, (snapshot) => {
      const ventesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVentes(ventesArray);
    });

    return () => unsubscribe();
  }, []);

  // ➕ Ajouter une vente
  const ajouterVente = async (produit, prix) => {
    try {
      await addDoc(ventesCollection, {
        produit,
        prix,
        date: Timestamp.now(),
        barman: "NomDuBarman", // Tu peux changer ça plus tard
        client: {
          id: client.id,
          nom: client.nom,
          prenom: client.prenom,
        },
      });
      console.log("Vente ajoutée !");
    } catch (e) {
      console.error("Erreur lors de l'ajout :", e);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ajouter une vente</h2>

      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="ID client"
          value={client.id}
          onChange={(e) => setClient({ ...client, id: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Nom"
          value={client.nom}
          onChange={(e) => setClient({ ...client, nom: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Prénom"
          value={client.prenom}
          onChange={(e) => setClient({ ...client, prenom: e.target.value })}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="space-x-2 mb-8">
        <button
          onClick={() => ajouterVente("Ti Punch", 6)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Vendre Ti Punch (6€)
        </button>
        <button
          onClick={() => ajouterVente("Planteur", 5)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Vendre Planteur (5€)
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Historique des ventes (temps réel)</h2>
      <ul className="space-y-2">
        {ventes.map((vente) => (
          <li key={vente.id} className="border p-2 rounded shadow">
            <strong>{vente.produit}</strong> - {vente.prix}€
            <br />
            Client : {vente.client.nom} {vente.client.prenom} ({vente.client.id})
            <br />
            Barman : {vente.barman}
            <br />
            Date : {vente.date?.toDate().toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddAndDisplayVentes;
