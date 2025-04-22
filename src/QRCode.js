import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeGenerator = ({ data }) => {
  return (
    <div>
      <QRCode value={data} />
    </div>
  );
};

export default QRCodeGenerator;
