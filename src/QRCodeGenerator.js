import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeGenerator = () => {
  const value = "https://beautifulkreyol.com"; // Remplace par ce que tu veux encoder

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <QRCode value={value} size={128} />
        <p className="mt-2 text-sm text-gray-500">Scanne ce code pour accéder</p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
