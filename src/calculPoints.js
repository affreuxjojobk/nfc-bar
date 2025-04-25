/**
 * Calcule le total de la commande et les points de fidélité gagnés.
 * 1€ dépensé = 1 point.
 *
 * @param {Array} produitsAchetes - Liste des produits avec prix, quantite, remise_manuelle
 * @returns {Object} { totalCommande, points }
 */
const calculerPoints = (produitsAchetes) => {
  let totalCommande = 0;

  produitsAchetes.forEach(produit => {
    const prix = parseFloat(produit.prix) || 0;
    const quantite = parseInt(produit.quantite) || 0;
    const remise = parseFloat(produit.remise_manuelle) || 0;

    const prixFinal = Math.max(prix - remise, 0); // Pour éviter un prix négatif
    totalCommande += prixFinal * quantite;
  });

  const points = Math.floor(totalCommande); // 1 point par € entier

  return {
    totalCommande: parseFloat(totalCommande.toFixed(2)), // pour l'affichage propre
    points
  };
};

module.exports = calculerPoints;
