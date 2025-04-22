// Calculer les points de fidélité pour une commande
export const calculerPointsDeFidelite = (commande) => {
  let total = 0;
  commande.produits.forEach((produit) => {
    total += produit.prix * produit.quantite;  // Multiplie le prix du produit par la quantité
  });
  return total;  // Le total en euros sera équivalent au nombre de points
};
