// ─── CONFIG DES 7 DÉFIS DU RALLYE ────────────────────────────────────────────
// mode: 'interieur' | 'terrain'
// type intérieur: 'liste_collaborative' = équipe rédige une liste soumise à l'enseignant
// type terrain: 'photo_terrain' = photos prises in situ validées par l'enseignant
//
// BARÈME LISTE_COLLABORATIVE :
//   L'équipe avec le plus de réponses valides => 100 pts (points_gagnant)
//   L'autre équipe                             =>  50 pts (points_perdant)
//   En cas d'égalité                           =>  75 pts chacune
//
// referentiel_enseignant : liste des réponses acceptables (avec explication pédagogique)
// consigne_eleves : texte affiché aux élèves

export const RALLYE_DEFIS = [
  // ─── DÉFI 1 : ÉNERGIE ────────────────────────────────────────────────────────
  {
    id: 'energie',
    numero: 1,
    emoji: '⚡',
    titre: 'Énergie',
    sousTitre: 'La Chasse aux Veilles',
    mode: 'interieur',
    couleur: 'from-yellow-700 to-orange-800',
    couleurLight: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    motCle: 'SOLEIL',
    points: 100,
    points_gagnant: 100,
    points_perdant: 50,
    type: 'liste_collaborative',
    consigne_eleves: 'En équipe, faites la liste la plus complète possible des appareils électriques qui consomment inutilement de l\'énergie en mode veille ou quand ils sont branchés sans être utilisés. Pensez à tous les appareils de la maison, de l\'école, des transports… Plus votre liste est longue et précise, plus vous marquez de points !',
    hint_eleves: '💡 Pensez aux appareils qui restent branchés après utilisation, ceux avec un voyant lumineux, ceux qui rechargent une batterie…',
    placeholder_eleves: 'Exemples : télévision en veille, chargeur de téléphone branché à vide, ordinateur en veille...',
    referentiel_enseignant: [
      { id: 'tv', label: 'Télévision en veille', explication: 'Une TV en veille consomme 1 à 5W en permanence — jusqu\'à 44 kWh/an.', points: 1 },
      { id: 'tel_charge', label: 'Téléphone portable : charger puis débrancher', explication: 'Laisser le chargeur branché après la charge complète gaspille de l\'énergie. Il faut retirer le téléphone et débrancher le chargeur.', points: 1 },
      { id: 'chargeur_vide', label: 'Chargeur branché sans appareil', explication: 'Un chargeur branché à vide consomme 0,1 à 0,5W. Multiplié par des millions de chargeurs, c\'est colossal.', points: 1 },
      { id: 'ordi_veille', label: 'Ordinateur en veille', explication: 'Un PC en veille consomme 1 à 10W. Mieux vaut l\'éteindre complètement.', points: 1 },
      { id: 'ecouteurs', label: 'Écouteurs / casque audio rechargeable', explication: 'Une fois chargés à 100%, continuer à les laisser sur le chargeur use la batterie et gaspille de l\'énergie.', points: 1 },
      { id: 'batterie_secours', label: 'Batterie de recharge (powerbank)', explication: 'Une powerbank laissée branchée après chargement complet continue de consommer.', points: 1 },
      { id: 'montre_connectee', label: 'Montre connectée / bracelet fitness', explication: 'Petite batterie, petite consommation — mais le geste est le même : débrancher après charge.', points: 1 },
      { id: 'tablette', label: 'Tablette laissée en charge', explication: 'Même comportement que le téléphone. Débrancher une fois à 100%.', points: 1 },
      { id: 'lampe_led', label: 'Lumière allumée dans une pièce vide', explication: 'Même une ampoule LED consomme si personne ne s\'en sert.', points: 1 },
      { id: 'box_internet', label: 'Box internet / routeur Wi-Fi la nuit', explication: 'La box consomme ~10W en permanence. L\'éteindre la nuit économise ~5 kWh/mois.', points: 1 },
      { id: 'imprimante', label: 'Imprimante en veille', explication: 'Une imprimante en veille consomme jusqu\'à 5W. La débrancher quand on ne l\'utilise pas.', points: 1 },
      { id: 'ampli_hifi', label: 'Amplificateur / barre de son en veille', explication: 'Les équipements hifi en veille sont parmi les plus gourmands : jusqu\'à 15W.', points: 1 },
      { id: 'console', label: 'Console de jeu en veille', explication: 'Une PS4/PS5 en veille peut consommer jusqu\'à 8W. À éteindre complètement.', points: 1 },
      { id: 'lave_vaisselle', label: 'Lave-vaisselle / lave-linge en fin de cycle non éteint', explication: 'Ces appareils restent en veille après le cycle. Le bouton "off" est important.', points: 1 },
      { id: 'four_micro', label: 'Micro-ondes avec affichage de l\'heure', explication: 'L\'horloge du micro-ondes consomme en permanence. Débrancher quand non utilisé.', points: 1 },
      { id: 'multiprises', label: 'Multiprise avec interrupteur à utiliser', explication: 'Une multiprise avec interrupteur permet de couper plusieurs appareils d\'un geste.', points: 1 },
      { id: 'seche_serviette', label: 'Sèche-serviettes / radiateur électrique laissé allumé', explication: 'Très énergivores. À éteindre dès que la pièce est chauffée.', points: 1 },
      { id: 'frigo_reglage', label: 'Réfrigérateur mal réglé (trop froid)', explication: '7°C au réfrigérateur et -18°C au congélateur est suffisant. Trop froid = surconsommation.', points: 1 },
    ],
    criteres_validation: 'Comptez 1 point par appareil valide cité. L\'équipe avec le plus de réponses valides reçoit 100 pts, l\'autre 50 pts. En cas d\'égalité : 75 pts chacune.',
    geste: '🔌 Débrancher les appareils après usage, utiliser des multiprises avec interrupteur.',
  },

  // ─── DÉFI 2 : EAU ────────────────────────────────────────────────────────────
  {
    id: 'eau',
    numero: 2,
    emoji: '💧',
    titre: 'Eau',
    sousTitre: 'La Brigade des Gouttes',
    mode: 'interieur',
    couleur: 'from-blue-700 to-cyan-800',
    couleurLight: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    motCle: 'RIVIÈRE',
    points: 100,
    points_gagnant: 100,
    points_perdant: 50,
    type: 'liste_collaborative',
    consigne_eleves: 'En équipe, faites la liste la plus complète possible des gestes du quotidien qui permettent d\'économiser l\'eau. Pensez à tous les moments de la journée où l\'on utilise de l\'eau — matin, repas, sport, jardinage, toilettes… Plus votre liste est précise et détaillée, plus vous marquez de points !',
    hint_eleves: '💡 Pensez au matin (toilettes, douche), aux repas (vaisselle, boisson), au jardin, aux toilettes, à la voiture…',
    placeholder_eleves: 'Exemples : fermer le robinet quand on se brosse les dents, prendre une douche plutôt qu\'un bain, boire l\'eau du robinet...',
    referentiel_enseignant: [
      { id: 'brossage', label: 'Fermer le robinet quand on se brosse les dents', explication: 'Un robinet ouvert = 12 litres/min. 2 minutes de brossage = 24 L gaspillés si ouvert.', points: 1 },
      { id: 'douche_bain', label: 'Prendre une douche (50-80 L) plutôt qu\'un bain (150-200 L)', explication: 'Un bain consomme 2 à 3 fois plus d\'eau qu\'une douche courte.', points: 1 },
      { id: 'douche_courte', label: 'Réduire la durée de la douche à 5 minutes max', explication: 'Chaque minute économisée = 10 à 15 L en moins.', points: 1 },
      { id: 'robinet_main', label: 'Fermer le robinet en se savonnant les mains', explication: 'Savonnage = 30 secondes minimum. Robinet ouvert = 6 L gaspillés.', points: 1 },
      { id: 'chasse_eco', label: 'Utiliser le petit bouton de la chasse d\'eau (3 L vs 6-9 L)', explication: 'Les toilettes à double chasse permettent d\'économiser jusqu\'à 50% d\'eau.', points: 1 },
      { id: 'robinet_eau', label: 'Boire l\'eau du robinet plutôt que de l\'eau en bouteille', explication: 'L\'eau en bouteille nécessite 6 L d\'eau pour produire 1 L (emballage inclus). En Suisse, l\'eau du robinet est excellente.', points: 1 },
      { id: 'vaisselle_pleine', label: 'Ne lancer le lave-vaisselle que plein', explication: 'Un lave-vaisselle plein consomme autant qu\'un à moitié plein : 12 à 15 L. Toujours attendre qu\'il soit plein.', points: 1 },
      { id: 'lessive_pleine', label: 'Ne lancer la machine à laver que pleine', explication: 'Même principe : 50 L par cycle, qu\'elle soit pleine ou à moitié.', points: 1 },
      { id: 'robinet_vaisselle', label: 'Couper l\'eau entre le rinçage de chaque assiette', explication: 'Faire la vaisselle à la main avec un bac d\'eau savonneuse économise 50% d\'eau.', points: 1 },
      { id: 'fuite', label: 'Réparer les fuites (robinet qui goutte)', explication: 'Un robinet qui goutte = 35 L/jour = 12 000 L/an gaspillés.', points: 1 },
      { id: 'pluie_jardin', label: 'Utiliser l\'eau de pluie pour arroser le jardin', explication: 'Récupérer l\'eau de pluie dans une cuve est gratuit et économise l\'eau potable.', points: 1 },
      { id: 'arrosage_soir', label: 'Arroser le jardin le soir ou le matin (pas en plein soleil)', explication: 'En plein soleil, jusqu\'à 50% de l\'eau s\'évapore avant d\'atteindre les racines.', points: 1 },
      { id: 'voiture_seau', label: 'Laver la voiture avec un seau plutôt qu\'au jet d\'eau', explication: 'Un tuyau d\'arrosage consomme 300 L en 30 minutes. Un seau = 10 L.', points: 1 },
      { id: 'thermos', label: 'Utiliser une gourde / thermos plutôt qu\'une bouteille plastique', explication: 'Évite la production de bouteilles plastiques et économise l\'eau industrielle nécessaire à leur fabrication.', points: 1 },
      { id: 'eau_cuisson', label: 'Réutiliser l\'eau de cuisson des légumes (pour arroser, soupe…)', explication: 'L\'eau de cuisson est riche en minéraux. Elle peut nourrir les plantes ou servir de base de soupe.', points: 1 },
      { id: 'piscine', label: 'Couvrir la piscine pour limiter l\'évaporation', explication: 'Une piscine non couverte perd 1 à 2 cm d\'eau par jour par évaporation en été.', points: 1 },
    ],
    criteres_validation: 'Comptez 1 point par geste valide cité. L\'équipe avec le plus de réponses valides reçoit 100 pts, l\'autre 50 pts. En cas d\'égalité : 75 pts chacune.',
    geste: '🚿 Chaque geste compte : fermer le robinet, douche courte, petit bouton, eau du robinet.',
  },

  // ─── DÉFI 3 : ALIMENTATION ───────────────────────────────────────────────────
  {
    id: 'alimentation',
    numero: 3,
    emoji: '🥗',
    titre: 'Alimentation',
    sousTitre: 'Le Juste Poids — Mission Terrain',
    mode: 'terrain',
    couleur: 'from-green-700 to-emerald-800',
    couleurLight: 'bg-green-500/20 text-green-300 border-green-400/30',
    motCle: 'COMPOST',
    points: 150,
    type: 'photo_terrain',
    consigne_eleves: 'Dehors : photographiez 3 exemples de pratiques alimentaires durables ou de gaspillage alimentaire dans votre environnement proche (cantine, jardin, marché, cuisine de l\'école…)',
    geste: '🌱 Doser ses portions, composter les déchets organiques, choisir des produits locaux de saison.',
    objectifs: [
      { id: 'gaspillage', label: '🗑️ Gaspillage alimentaire observé', exemples: 'Plateau de cantine avec des restes, poubelle pleine, aliment jeté encore emballé...' },
      { id: 'compostage', label: '🌱 Compostage ou valorisation des déchets organiques', exemples: 'Bac à compost, lombricomposteur, panneau de tri bio...' },
      { id: 'local', label: '🥕 Produit local ou de saison identifié', exemples: 'Légume du potager, étal de marché avec étiquette région, ardoise avec produits de saison...' },
    ],
    referentiel_enseignant: [
      { id: 'g1', label: 'Photo 1 - Gaspillage', explication: 'L\'élève doit identifier une situation réelle de gaspillage alimentaire avec explication.' },
      { id: 'g2', label: 'Photo 2 - Compostage', explication: 'La photo doit montrer un dispositif de compostage ou de valorisation réel.' },
      { id: 'g3', label: 'Photo 3 - Produit local', explication: 'La photo doit clairement identifier l\'origine locale ou la saisonnalité du produit.' },
    ],
  },

  // ─── DÉFI 4 : MOBILITÉ ───────────────────────────────────────────────────────
  {
    id: 'mobilite',
    numero: 4,
    emoji: '🚲',
    titre: 'Mobilité Douce',
    sousTitre: 'Les Trajets Éco-Responsables',
    mode: 'interieur',
    couleur: 'from-teal-700 to-cyan-900',
    couleurLight: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    motCle: 'PÉDALE',
    points: 100,
    points_gagnant: 100,
    points_perdant: 50,
    type: 'liste_collaborative',
    consigne_eleves: 'En équipe, faites la liste la plus complète possible de situations du quotidien où l\'on peut remplacer la voiture par un moyen de transport moins polluant. Pour chaque situation, précisez le trajet ET l\'alternative proposée. Plus c\'est précis et réaliste, mieux c\'est !',
    hint_eleves: '🚲 Pensez aux trajets courts (école, boulangerie, amis), aux activités sportives, aux courses, aux loisirs du week-end…',
    placeholder_eleves: 'Exemples : aller à l\'école à vélo au lieu d\'en voiture, prendre le bus pour aller à la piscine, marcher jusqu\'à la boulangerie...',
    referentiel_enseignant: [
      { id: 'ecole_velo', label: 'Aller à l\'école à vélo / trottinette / marche', explication: 'Pour moins de 3 km, le vélo ou la marche sont plus rapides que la voiture aux heures de pointe.', points: 1 },
      { id: 'bus_scolaire', label: 'Prendre le bus scolaire ou le car', explication: 'Un bus scolaire remplace 40 voitures = 40× moins d\'émissions par élève.', points: 1 },
      { id: 'covoiturage', label: 'Organiser un covoiturage', explication: '4 personnes dans une voiture = 4× moins d\'émissions par personne.', points: 1 },
      { id: 'train_vacances', label: 'Prendre le train pour les vacances', explication: 'Le train émet 14× moins de CO₂ que l\'avion et 8× moins que la voiture par km.', points: 1 },
      { id: 'courses_velo', label: 'Faire les courses avec un vélo cargo / sac à dos', explication: 'Pour les achats du quotidien dans un rayon de 5 km, le vélo cargo est idéal.', points: 1 },
      { id: 'trotinette_electrique', label: 'Trottinette électrique pour les petits trajets urbains', explication: 'Zéro émission directe, très peu d\'espace, idéale pour 1-5 km.', points: 1 },
      { id: 'sport_pied', label: 'Aller aux entraînements sportifs à pied / vélo', explication: 'La plupart des clubs de sport sont accessibles sans voiture dans un rayon de 3 km.', points: 1 },
      { id: 'sortie_transport', label: 'Privilégier les sorties accessibles en transport en commun', explication: 'Choisir ses destinations de loisirs en fonction de leur accessibilité en transports.', points: 1 },
      { id: 'train_vs_avion', label: 'Préférer le train à l\'avion pour les voyages en Europe', explication: 'Paris-Barcelone en train : 6h30, -90% de CO₂ vs l\'avion.', points: 1 },
      { id: 'marche_500m', label: 'Marcher pour tout trajet inférieur à 500 m', explication: 'Le "problème du dernier kilomètre" : on prend la voiture pour 300 m. À proscrire.', points: 1 },
      { id: 'velo_electrique', label: 'Utiliser un vélo électrique pour les côtes ou longues distances', explication: 'Le VAE permet de remplacer la voiture sur des trajets jusqu\'à 20-30 km.', points: 1 },
      { id: 'livraison_pied', label: 'Regrouper ses livraisons pour réduire les camionnettes', explication: 'Éviter la livraison express individuelle, préférer les points-relais ou regrouper les commandes.', points: 1 },
    ],
    criteres_validation: 'Comptez 1 point par alternative valide et réaliste. L\'équipe avec le plus de réponses reçoit 100 pts, l\'autre 50 pts.',
    geste: '🚲 Chaque trajet sans voiture compte : marche, vélo, bus, train. Penser "est-ce que je peux y aller sans voiture ?"',
  },

  // ─── DÉFI 5 : VOYAGES LOCAUX ─────────────────────────────────────────────────
  {
    id: 'voyages',
    numero: 5,
    emoji: '🌍',
    titre: 'Voyages Locaux',
    sousTitre: 'Explorateurs de Proximité — Mission Terrain',
    mode: 'terrain',
    couleur: 'from-indigo-700 to-violet-800',
    couleurLight: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    motCle: 'NATURE',
    points: 150,
    type: 'photo_terrain',
    consigne_eleves: 'Dehors : photographiez 3 richesses naturelles ou culturelles de votre région que vous pourriez découvrir sans prendre l\'avion. Montrez que votre région regorge de trésors à explorer !',
    geste: '🏕️ Découvrir les richesses de sa région pour limiter l\'usage de l\'avion et le tourisme de masse.',
    objectifs: [
      { id: 'paysage', label: '🏔️ Paysage naturel local remarquable', exemples: 'Vue, forêt, rivière, montagne, lac, prairie fleurie...' },
      { id: 'culture', label: '🏛️ Patrimoine culturel ou historique proche', exemples: 'Monument, musée, vieille ville, fontaine historique, château...' },
      { id: 'activite', label: '🎒 Lieu d\'activité de plein air accessible', exemples: 'Sentier balisé, piste cyclable, lieu de baignade, voie d\'escalade...' },
    ],
    referentiel_enseignant: [
      { id: 'v1', label: 'Photo 1 - Paysage naturel', explication: 'La photo doit montrer un espace naturel local et l\'équipe doit pouvoir nommer le lieu.' },
      { id: 'v2', label: 'Photo 2 - Patrimoine culturel', explication: 'Le lieu photographié doit être réel, identifiable et accessible localement.' },
      { id: 'v3', label: 'Photo 3 - Activité de plein air', explication: 'L\'activité proposée doit être réellement praticable localement sans voiture ou en transport.' },
    ],
  },

  // ─── DÉFI 6 : CIRCUITS COURTS ────────────────────────────────────────────────
  {
    id: 'circuits',
    numero: 6,
    emoji: '🥕',
    titre: 'Circuits Courts',
    sousTitre: 'Le Marché Local — Mission Terrain',
    mode: 'terrain',
    couleur: 'from-orange-700 to-red-800',
    couleurLight: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    motCle: 'SAISON',
    points: 150,
    type: 'photo_terrain',
    consigne_eleves: 'Dehors : photographiez des preuves de circuits courts dans votre environnement (marché local, jardin partagé, producteur direct, panneaux d\'information…)',
    geste: '🛒 Consommer local et de saison : moins de transport, plus de fraîcheur, moins d\'emballage.',
    objectifs: [
      { id: 'marche', label: '🛒 Marché local ou producteur en vente directe', exemples: 'Stand de marché avec étiquette région, ferme avec vente à la ferme, AMAP...' },
      { id: 'saison', label: '📅 Produit de saison clairement identifié', exemples: 'Ardoise avec légumes de saison, étiquette "récolté ce matin", calendrier des saisons...' },
      { id: 'jardin', label: '🌿 Jardin ou potager communautaire / scolaire', exemples: 'Jardin partagé, carré potager de l\'école, compost collectif, ruche urbaine...' },
    ],
    referentiel_enseignant: [
      { id: 'c1', label: 'Photo 1 - Circuit court', explication: 'La photo doit clairement montrer un circuit court (nom du producteur, région, "direct producteur"…).' },
      { id: 'c2', label: 'Photo 2 - Produit de saison', explication: 'L\'identification de la saisonnalité doit être visible sur la photo (étiquette, ardoise, panneau…).' },
      { id: 'c3', label: 'Photo 3 - Jardin / potager', explication: 'Le potager ou jardin doit être local et réel. L\'équipe doit savoir l\'expliquer.' },
    ],
  },

  // ─── DÉFI 7 : ÉCONOMIE CIRCULAIRE ────────────────────────────────────────────
  {
    id: 'circulaire',
    numero: 7,
    emoji: '♻️',
    titre: 'Économie Circulaire',
    sousTitre: 'La Seconde Vie des Objets',
    mode: 'interieur',
    couleur: 'from-emerald-700 to-teal-800',
    couleurLight: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    motCle: 'RÉPARE',
    points: 100,
    points_gagnant: 100,
    points_perdant: 50,
    type: 'liste_collaborative',
    consigne_eleves: 'En équipe, faites la liste la plus complète possible d\'objets du quotidien que l\'on jette souvent trop vite, et pour chacun proposez une alternative (réparer, donner, réutiliser, recycler). Plus votre liste est longue et créative, plus vous marquez de points !',
    hint_eleves: '♻️ Pensez aux vêtements, jouets, électronique, livres, meubles, emballages, nourriture, outils…',
    placeholder_eleves: 'Exemples : vêtement troué → réparer ou emmener en friperie, bocal en verre → réutiliser pour ranger, téléphone cassé → réparer ou rapporter en déchetterie...',
    referentiel_enseignant: [
      { id: 'vetement_repare', label: 'Vêtement troué ou usé → Réparer (coudre, rapiécer)', explication: 'La fast-fashion génère 92 millions de tonnes de déchets/an. Apprendre à coudre ou aller dans un repair café.', points: 1 },
      { id: 'vetement_donne', label: 'Vêtement trop petit → Donner (friperie, vente, ami)', explication: 'En Suisse, 60 000 tonnes de textiles sont jetées chaque année. La plupart sont encore portables.', points: 1 },
      { id: 'bocal', label: 'Bocal en verre → Réutiliser pour conserver, ranger, décorer', explication: 'Le verre peut être réutilisé des centaines de fois avant d\'être recyclé.', points: 1 },
      { id: 'jouet', label: 'Jouet cassé → Réparer ou donner à une association', explication: 'Les jouets représentent 7 kg de plastique/an/enfant. Repair café, ressourceries, troc.', points: 1 },
      { id: 'livre', label: 'Livre lu → Donner à une bibliothèque, un ami, un bazar', explication: 'Un livre produit 2,7 kg de CO₂. Le faire circuler maximise son utilité.', points: 1 },
      { id: 'telephone', label: 'Téléphone cassé → Réparer (batterie, écran) plutôt qu\'acheter neuf', explication: 'Réparer son téléphone évite l\'extraction de métaux rares et réduit les déchets électroniques.', points: 1 },
      { id: 'emballage_carton', label: 'Boîte en carton → Réutiliser pour ranger, déménager, jeux enfants', explication: 'Le carton réutilisé retarde son entrée dans le recyclage et économise de l\'énergie.', points: 1 },
      { id: 'huile', label: 'Huile de cuisson usagée → Rapporter en déchetterie (biodiesel)', explication: 'Verser l\'huile dans l\'évier bouche les canalisations. Les déchetteries la transforment en carburant.', points: 1 },
      { id: 'piles', label: 'Piles / batteries → Rapporter au point de collecte', explication: 'Les piles contiennent du lithium, nickel, manganèse — matières premières rares et toxiques.', points: 1 },
      { id: 'meuble', label: 'Meuble abîmé → Relooker, peindre, réparer plutôt que jeter', explication: 'Le mobilier représente 14% des déchets en déchetterie. La peinture et les réparations simples prolongent leur vie.', points: 1 },
      { id: 'nourriture', label: 'Restes de repas → Cuisiner autrement (soupe, gratin…)', explication: 'Le gaspillage alimentaire représente 1/3 de la production mondiale. Cuisiner les restes est un acte éco-responsable.', points: 1 },
      { id: 'papier', label: 'Feuilles imprimées d\'un côté → Utiliser l\'autre côté comme brouillon', explication: 'Un ramette de papier A4 = 1 arbre. Utiliser les deux côtés divise la consommation par deux.', points: 1 },
      { id: 'cartouche', label: 'Cartouche d\'imprimante → Faire recharger plutôt qu\'acheter neuve', explication: 'Une cartouche rechargée coûte 50% moins cher et évite 500g de déchets plastiques.', points: 1 },
      { id: 'sac_plastique', label: 'Sac plastique de courses → Remplacer par sac tissu réutilisable', explication: 'Un sac tissu remplace 700 sacs plastiques sur sa durée de vie.', points: 1 },
      { id: 'compost_dechets', label: 'Épluchures de légumes → Composter ou faire un bouillon', explication: 'Les épluchures propres font d\'excellents bouillons. Le reste va au compost.', points: 1 },
    ],
    criteres_validation: 'Comptez 1 point par objet + alternative valide. L\'équipe avec le plus de réponses reçoit 100 pts, l\'autre 50 pts.',
    geste: '🔧 Avant de jeter : Réparer, Réutiliser, Donner, Recycler. Dans cet ordre !',
  },
];

export const RALLYE_TEAMS = [
  {
    id: 'team1',
    name: 'Les Pionniers Verts',
    emoji: '🌱',
    couleur: 'from-emerald-700 to-green-800',
    border: 'border-emerald-400/40',
    bg: 'bg-emerald-500/20',
    btn: 'bg-emerald-500/30 text-emerald-200 hover:bg-emerald-500/50',
    codeKey: 'code_team1',
    membersKey: 'members_team1',
    defisKey: 'defis_team1',
    scoreKey: 'score_team1',
  },
  {
    id: 'team2',
    name: 'Les Éco-Explorateurs',
    emoji: '🦋',
    couleur: 'from-amber-700 to-orange-800',
    border: 'border-amber-400/40',
    bg: 'bg-amber-500/20',
    btn: 'bg-amber-500/30 text-amber-200 hover:bg-amber-500/50',
    codeKey: 'code_team2',
    membersKey: 'members_team2',
    defisKey: 'defis_team2',
    scoreKey: 'score_team2',
  },
];

export function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function calcRallyeScore(defis = {}) {
  return Object.values(defis).reduce((sum, d) => sum + (d?.score || 0), 0);
}