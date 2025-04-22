import React from 'react';
import Papa from 'papaparse';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function ImportCSV() {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;

        // Log pour debug : montre les clés des colonnes du premier objet
        console.log("🔍 En-têtes détectées :", Object.keys(data[0]));

        const produitsCollection = collection(db, 'products');
        let count = 0;

        for (const ligne of data) {
          const produit = ligne["Produit"]?.trim();
          const categorie = ligne["Catégorie"]?.trim();

          if (produit && categorie) {
            try {
              await addDoc(produitsCollection, {
                name: produit,
                category: categorie,
                price: Number(ligne["Prix"]),
                stock: Number(ligne["Stock"]),
                sales: Number(ligne["Ventes"]),
                remainingStock: Number(ligne["Stock restant"]),
              });

              console.log(`✅ Produit importé : ${produit}`);
              count++;
            } catch (error) {
              console.error(`❌ Erreur pour ${produit} :`, error);
            }
          } else {
            console.warn("⚠️ Ligne ignorée (champ manquant) :", ligne);
          }
        }

        toast.success(`${count} produits importés avec succès !`);
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Importer les produits via CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="border p-2 rounded"
      />
    </div>
  );
}

export default ImportCSV;
