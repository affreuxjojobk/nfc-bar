import React from 'react';

const StyledComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Scanner NFC</h2>
      <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
        Scanner une carte NFC
      </button>
      <p className="mt-4 text-xl">Carte scannée : ABC123</p>
    </div>
  );
};

export default StyledComponent;
