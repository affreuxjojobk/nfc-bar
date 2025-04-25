import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return <div className={`${className} p-4`}>{children}</div>;
};

export { Card, CardContent };
