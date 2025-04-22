import React, { useEffect } from 'react';

const NFCScanner = () => {
  useEffect(() => {
    // Ici tu pourrais ajouter la logique pour scanner la carte NFC
    console.log("Scanner NFC prêt !");
  }, []);

  return (
    <div>
      <button onClick={() => alert('Scanner NFC activé !')}>
        Activer le Scanner NFC
      </button>
    </div>
  );
};

export default NFCScanner;
