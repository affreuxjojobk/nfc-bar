import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSales } from '../firebase/firestoreService';

// Création du contexte des ventes
const SalesContext = createContext();

// Provider pour encapsuler les pages qui doivent partager l'état des ventes
export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);

  // Chargement des ventes depuis Firestore
  const loadSales = async () => {
    const allSales = await fetchSales();
    setSales(allSales);
  };

  // Mettre à jour les ventes après l'ajout d'une vente
  const addSaleToContext = (sale) => {
    setSales((prevSales) => [sale, ...prevSales]);  // Ajouter la nouvelle vente au début
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <SalesContext.Provider value={{ sales, addSaleToContext }}>
      {children}
    </SalesContext.Provider>
  );
};

// Custom hook pour utiliser le contexte des ventes
export const useSales = () => {
  return useContext(SalesContext);
};
