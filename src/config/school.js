/**
 * CONFIGURATION DE L'ÉCOLE
 * ========================
 * Ce fichier est le SEUL à modifier pour personnaliser cette instance.
 * Tous les autres fichiers sont identiques entre les différentes écoles.
 */

const schoolConfig = {
  // Identité
  name: "Institut Le Rosey",
  shortName: "Le Rosey",
  logoUrl: null, // URL vers le logo de l'école (null = logo Terra Nova par défaut)
  
  // Couleurs du menu / interface (valeurs CSS valides)
  colors: {
    primary: "#10b981",       // emerald-500 — couleur principale
    primaryDark: "#059669",   // emerald-600 — hover
    accent: "#0d9488",        // teal-600 — accent secondaire
    menuBg: "rgba(2, 20, 15, 0.95)", // fond du header
  },

  // Modules activés (mettre false pour masquer un module dans le menu)
  modules: {
    atlas: true,
    missions: true,
    biofocus: true,
    microferme: true,
    ecosphere: true,
    pollinisation: true,
    recyclage: true,
    agenda: true,
    abonnement: true,
  },

  // Textes personnalisables
  welcomeMessage: "Bienvenue dans les Chroniques de Terra-Nova",
  contactEmail: "contact@terra-nova.ch",
};

export default schoolConfig;