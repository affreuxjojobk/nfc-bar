import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

const NFCScanner = ({ addSale }) => {
  const [scannedData, setScannedData] = useState(null);
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate(); // Utilisation de useNavigate pour redirection

  const startScan = () => {
    setIsScanning(true);
    setMessage('Scan en cours...');
    setTimeout(() => {
      const scannedID = Date.now(); // Simuler un ID unique
      const userData = JSON.parse(localStorage.getItem(scannedID));

      if (userData) {
        setScannedData(userData);
        setMessage(`Bienvenue, ${userData.name} ${userData.lastName}!`);
      } else {
        setMessage('Utilisateur non inscrit. Veuillez vous inscrire pour débloquer les récompenses.');
        navigate('/signup'); // Redirection vers la page d'inscription
      }
      setIsScanning(false);
    }, 2000);
  };

  const handleAddSale = () => {
    if (scannedData) {
      addSale('T-shirt', 20); // Exemple d'ajout d'une vente
      setMessage('Vente réussie ! Vous avez une réduction de 10% sur votre prochain achat.');
    } else {
      setMessage('Veuillez scanner un NFC ou QR Code valide.');
    }
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Scanner NFC / QR Code</h2>
      <div className="mb-4">
        <button 
          onClick={startScan} 
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800"
        >
          Démarrer le scan
        </button>
      </div>
      {isScanning ? (
        <div className="text-xl text-blue-600">{message}</div>
      ) : (
        <div className="text-lg text-gray-700">
          {scannedData ? (
            <div>
              <h3 className="font-semibold">Bienvenue, {scannedData.name}!</h3>
              <p>Vous êtes enregistré. Profitez de votre récompense !</p>
            </div>
          ) : (
            <p>{message}</p>
          )}
        </div>
      )}
      <div className="mt-6">
        <button 
          onClick={handleAddSale} 
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
        >
          Valider la vente
        </button>
      </div>
    </div>
  );
};

export default NFCScanner;
