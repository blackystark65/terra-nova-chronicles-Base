// Base de données complète ravageurs <-> auxiliaires de culture
// Organisée par secteur d'activité

export const SECTEURS = {
  maraichage: {
    id: 'maraichage',
    nom: 'Maraichage',
    emoji: '🥦',
    couleur: 'green',
    description: 'Cultures legumières plein champ & sous serre',
  },
  arboriculture: {
    id: 'arboriculture',
    nom: 'Arboriculture',
    emoji: '🍎',
    couleur: 'red',
    description: 'Vergers & production fruitière',
  },
  viticulture: {
    id: 'viticulture',
    nom: 'Viticulture',
    emoji: '🍇',
    couleur: 'purple',
    description: 'Culture de la vigne',
  },
  pepiniere: {
    id: 'pepiniere',
    nom: 'Pepinière',
    emoji: '🌱',
    couleur: 'teal',
    description: 'Plantes ornementales & jeunes plants',
  },
};

export const ECO_PAIRS_ALL = [
  // MARAICHAGE
  {
    id: 'puceron_coccinelle',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🐛',
      nom: 'Puceron',
      nomScientifique: 'Aphidoidea',
      impact: 'Sucent la sève, affaiblissent la plante et transmettent des virus.',
    },
    predateur: {
      emoji: '🐞',
      nom: 'Coccinelle',
      nomScientifique: 'Coccinellidae',
      type: 'predateur',
      explication: "Une seule larve de coccinelle devore jusqu'a 150 pucerons par jour grace a sa mobilite et sa voracite.",
    },
  },
  {
    id: 'puceron_chrysope',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🐛',
      nom: 'Puceron',
      nomScientifique: 'Aphidoidea',
      impact: 'Sucent la sève, affaiblissent la plante et transmettent des virus.',
    },
    predateur: {
      emoji: '🦟',
      nom: 'Chrysope',
      nomScientifique: 'Chrysoperla carnea',
      type: 'predateur',
      explication: 'Surnommee "lion des pucerons", ses larves devorent une grande variete de proies mobiles.',
    },
  },
  {
    id: 'puceron_cecido',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🐛',
      nom: 'Puceron',
      nomScientifique: 'Aphidoidea',
      impact: 'Sucent la sève, affaiblissent la plante et transmettent des virus.',
    },
    predateur: {
      emoji: '🪰',
      nom: 'Cecidomyie',
      nomScientifique: 'Aphidoletes aphidimyza',
      type: 'parasitoide',
      explication: 'Petite mouche dont les larves sont de redoutables predatrices de pucerons en serre.',
    },
  },
  {
    id: 'aleurode_macrolophus',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🪲',
      nom: 'Aleurode',
      nomScientifique: 'Bemisia tabaci / Trialeurodes vaporariorum',
      impact: 'Mouche blanche qui affaiblit les plantes et transmet des virus.',
    },
    predateur: {
      emoji: '🦂',
      nom: 'Macrolophus',
      nomScientifique: 'Macrolophus pygmaeus',
      type: 'predateur',
      explication: 'Punaise predatrice tres utilisee sur la tomate sous serre contre les mouches blanches.',
    },
  },
  {
    id: 'aleurode_encarsia',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🪲',
      nom: 'Aleurode',
      nomScientifique: 'Trialeurodes vaporariorum',
      impact: 'Mouche blanche qui affaiblit les plantes en serre.',
    },
    predateur: {
      emoji: '🐝',
      nom: 'Encarsia formosa',
      nomScientifique: 'Encarsia formosa',
      type: 'parasitoide',
      explication: "Micro-guêpe parasitoire qui pond dans les larves d'aleurodes et les detruit de l'interieur.",
    },
  },
  {
    id: 'thrips_orius',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🦠',
      nom: 'Thrips',
      nomScientifique: 'Frankliniella occidentalis',
      impact: 'Vident les cellules vegetales, laissent des taches argentees et deforment les fleurs.',
    },
    predateur: {
      emoji: '🐜',
      nom: 'Punaise Orius',
      nomScientifique: 'Orius spp.',
      type: 'predateur',
      explication: 'Traque activement adultes et larves de thrips dans les moindres recoins des fleurs.',
    },
  },
  {
    id: 'thrips_swirskii',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🦠',
      nom: 'Thrips',
      nomScientifique: 'Frankliniella occidentalis',
      impact: 'Deforment les fleurs et transmettent des virus.',
    },
    predateur: {
      emoji: '🕷️',
      nom: 'Amblyseius swirskii',
      nomScientifique: 'Amblyseius swirskii',
      type: 'predateur',
      explication: 'Acarien predateur specialise contre les thrips et les acariens ravageurs.',
    },
  },
  {
    id: 'acarien_phytoseiulus',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🕷️',
      nom: 'Araignee rouge',
      nomScientifique: 'Tetranychus urticae',
      impact: 'Pique les cellules des feuilles, provoquant leur jaunissement et leur dessechement.',
    },
    predateur: {
      emoji: '🔬',
      nom: 'Phytoseiulus persimilis',
      nomScientifique: 'Phytoseiulus persimilis',
      type: 'predateur',
      explication: "Se deplace plus vite que sa proie et s'en nourrit exclusivement. Ennemi numero 1 des araignees rouges.",
    },
  },
  {
    id: 'noctuelle_trichogramme',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🦋',
      nom: 'Noctuelle',
      nomScientifique: 'Noctuidae',
      impact: 'Chenilles defoliatrices qui percent et devorent feuilles et fruits.',
    },
    predateur: {
      emoji: '🐝',
      nom: 'Trichogramme',
      nomScientifique: 'Trichogramma spp.',
      type: 'parasitoide',
      explication: "Micro-guêpe parasitoire qui pond dans les oeufs de noctuelles et les detruit avant l'eclosion.",
    },
  },
  {
    id: 'limace_herisson',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🐌',
      nom: 'Limace',
      nomScientifique: 'Gastropoda',
      impact: 'Devore les jeunes pousses, feuilles et semis durant la nuit.',
    },
    predateur: {
      emoji: '🦔',
      nom: 'Herisson',
      nomScientifique: 'Erinaceus europaeus',
      type: 'predateur',
      explication: 'Nocturne et immunise contre les toxines de nombreux invertebres, il consomme de grandes quantites de limaces.',
    },
  },
  {
    id: 'limace_nematode',
    secteur: 'maraichage',
    ravageur: {
      emoji: '🐌',
      nom: 'Limace',
      nomScientifique: 'Gastropoda',
      impact: 'Devore les jeunes pousses et semis.',
    },
    predateur: {
      emoji: '🔬',
      nom: 'Nematode Phasmarhabditis',
      nomScientifique: 'Phasmarhabditis hermaphrodita',
      type: 'parasitoide',
      explication: 'Nematode entomopathogene applique en lutte biologique directement dans le sol contre les limaces.',
    },
  },

  // ARBORICULTURE
  {
    id: 'carpocapse_trichogramme',
    secteur: 'arboriculture',
    ravageur: {
      emoji: '🍎',
      nom: 'Carpocapse',
      nomScientifique: 'Cydia pomonella',
      impact: 'Larves qui creusent les pommes et les poires, rendant les fruits invendables.',
    },
    predateur: {
      emoji: '🐝',
      nom: 'Trichogramme',
      nomScientifique: 'Trichogramma cacoeciae',
      type: 'parasitoide',
      explication: "Detruit les oeufs de carpocapse avant l'eclosion des larves.",
    },
  },
  {
    id: 'carpocapse_mesange',
    secteur: 'arboriculture',
    ravageur: {
      emoji: '🍎',
      nom: 'Carpocapse',
      nomScientifique: 'Cydia pomonella',
      impact: 'Les larves creusent les fruits et les rendent impropres a la consommation.',
    },
    predateur: {
      emoji: '🐦',
      nom: 'Mesange',
      nomScientifique: 'Parus spp.',
      type: 'predateur',
      explication: 'Capture des milliers de chenilles au printemps pour nourrir ses oisillons. Essentielle en verger.',
    },
  },
  {
    id: 'puceron_lanigere_aphelinus',
    secteur: 'arboriculture',
    ravageur: {
      emoji: '🐛',
      nom: 'Puceron lanigere',
      nomScientifique: 'Eriosoma lanigerum',
      impact: 'Affaiblit les pommiers en formant des colonies sous un duvet blanc sur les rameaux.',
    },
    predateur: {
      emoji: '🐝',
      nom: 'Aphelinus mali',
      nomScientifique: 'Aphelinus mali',
      type: 'parasitoide',
      explication: 'Minuscule guêpe noire specialisee dans le parasitisme du puceron lanigere du pommier.',
    },
  },
  {
    id: 'psylle_anthocoris',
    secteur: 'arboriculture',
    ravageur: {
      emoji: '🦟',
      nom: 'Psylle du poirier',
      nomScientifique: 'Cacopsylla pyri',
      impact: 'Secretee du miellat qui favorise la fumagine et affaiblit les poiriers.',
    },
    predateur: {
      emoji: '🐜',
      nom: 'Anthocoris nemoralis',
      nomScientifique: 'Anthocoris nemoralis',
      type: 'predateur',
      explication: 'Punaise anthocoride qui regule les psylles du poirier au printemps dans les vergers.',
    },
  },
  {
    id: 'acarien_typhlodromus_arbo',
    secteur: 'arboriculture',
    ravageur: {
      emoji: '🕷️',
      nom: 'Acarien rouge',
      nomScientifique: 'Panonychus ulmi',
      impact: 'Provoque le bronzage et la chute precoce des feuilles en verger.',
    },
    predateur: {
      emoji: '🔬',
      nom: 'Typhlodromus pyri',
      nomScientifique: 'Typhlodromus pyri',
      type: 'predateur',
      explication: 'Acarien auxiliaire indigene de la famille des Phytoseiides, regulateur naturel incontournable.',
    },
  },
  {
    id: 'cochenille_chilocorus',
    secteur: 'arboriculture',
    ravageur: {
      emoji: '🪲',
      nom: 'Cochenille',
      nomScientifique: 'Quadraspidiotus perniciosus',
      impact: "S'installe sur le bois et les fruits, affaiblissant progressivement l'arbre.",
    },
    predateur: {
      emoji: '🐞',
      nom: 'Chilocorus nigritus',
      nomScientifique: 'Chilocorus nigritus',
      type: 'predateur',
      explication: 'Coccinelle specialisee dans la predation des cochenilles boucliers sur arbres fruitiers.',
    },
  },

  // VITICULTURE
  {
    id: 'tordeuse_trichogramme',
    secteur: 'viticulture',
    ravageur: {
      emoji: '🍇',
      nom: 'Tordeuse de la grappe',
      nomScientifique: 'Lobesia botrana / Eupoecilia ambiguella',
      impact: 'Les chenilles perforent les baies, favorisant la pourriture grise (Botrytis).',
    },
    predateur: {
      emoji: '🐝',
      nom: 'Trichogramme',
      nomScientifique: 'Trichogramma evanescens',
      type: 'parasitoide',
      explication: "Parasite les oeufs des tordeuses de la grappe, stoppant l'infestation avant eclosion.",
    },
  },
  {
    id: 'tordeuse_chauve_souris',
    secteur: 'viticulture',
    ravageur: {
      emoji: '🍇',
      nom: 'Tordeuse de la grappe',
      nomScientifique: 'Lobesia botrana',
      impact: 'Les papillons de nuit pondent sur les grappes, les larves perforent les baies.',
    },
    predateur: {
      emoji: '🦇',
      nom: 'Chauve-souris',
      nomScientifique: 'Chiroptera',
      type: 'predateur',
      explication: "Intercepte les papillons de nuit par echolocalisation. Un seul individu consomme des milliers d'insectes par nuit.",
    },
  },
  {
    id: 'acarien_typhlodromus_viti',
    secteur: 'viticulture',
    ravageur: {
      emoji: '🕷️',
      nom: 'Acarien des grillures',
      nomScientifique: 'Panonychus ulmi / Eotetranychus carpini',
      impact: 'Provoque grillures et brunissement des feuilles de vigne, reduisant la photosynthese.',
    },
    predateur: {
      emoji: '🔬',
      nom: 'Typhlodromus pyri',
      nomScientifique: 'Typhlodromus pyri',
      type: 'predateur',
      explication: 'Acarien auxiliaire indigene indispensable en viticulture durable. Regule totalement les acariens phytophages.',
    },
  },
  {
    id: 'cicadelle_anagrus',
    secteur: 'viticulture',
    ravageur: {
      emoji: '🦗',
      nom: 'Cicadelle verte',
      nomScientifique: 'Empoasca vitis',
      impact: 'Pique les feuilles et provoque un jaunissement dit "grillure cicadellienne".',
    },
    predateur: {
      emoji: '🐝',
      nom: 'Anagrus atomus',
      nomScientifique: 'Anagrus atomus',
      type: 'parasitoide',
      explication: 'Petite guêpe qui parasite activement les oeufs de cicadelles pondus dans les nervures des feuilles.',
    },
  },
  {
    id: 'cochenille_vigne_cryptolaemus',
    secteur: 'viticulture',
    ravageur: {
      emoji: '🪲',
      nom: 'Cochenille farineuse',
      nomScientifique: 'Planococcus ficus',
      impact: "S'installe sur les rameaux et les grappes, secretee du miellat favorisant la fumagine.",
    },
    predateur: {
      emoji: '🐞',
      nom: 'Cryptolaemus montrouzieri',
      nomScientifique: 'Cryptolaemus montrouzieri',
      type: 'predateur',
      explication: 'Coccinelle predatrice specialisee dans la regulation des cochenilles farineuses de la vigne.',
    },
  },
  {
    id: 'cochenille_vigne_anagyrus',
    secteur: 'viticulture',
    ravageur: {
      emoji: '🪲',
      nom: 'Cochenille farineuse',
      nomScientifique: 'Planococcus ficus',
      impact: 'Affaiblit la vigne et contamine les grappes par ses secretions cireuses.',
    },
    predateur: {
      emoji: '🐝',
      nom: 'Anagyrus vladimiri',
      nomScientifique: 'Anagyrus vladimiri',
      type: 'parasitoide',
      explication: 'Guêpe parasitoire tres specifique de la cochenille farineuse de la vigne.',
    },
  },

  // PEPINIERE
  {
    id: 'otiorhynque_heterorhabditis',
    secteur: 'pepiniere',
    ravageur: {
      emoji: '🪲',
      nom: 'Otiorhynque',
      nomScientifique: 'Otiorhynchus spp.',
      impact: 'Les larves rongent les racines sous terre, causant le deperissement des plantes.',
    },
    predateur: {
      emoji: '🔬',
      nom: 'Heterorhabditis bacteriophora',
      nomScientifique: 'Heterorhabditis bacteriophora',
      type: 'parasitoide',
      explication: "Nematode predateur applique dans le sol pour eliminer les larves souterraines d'otiorhynques.",
    },
  },
  {
    id: 'sciaride_hypoaspis',
    secteur: 'pepiniere',
    ravageur: {
      emoji: '🪰',
      nom: 'Sciaride',
      nomScientifique: 'Bradysia spp.',
      impact: 'Les larves detruisent les racines dans les substrats de rempotage des pepinieres.',
    },
    predateur: {
      emoji: '🕷️',
      nom: 'Stratiolaelaps scimitus',
      nomScientifique: 'Stratiolaelaps scimitus (Hypoaspis miles)',
      type: 'predateur',
      explication: 'Acarien predateur du sol qui detruit les larves de sciarides dans les substrats de culture.',
    },
  },
  {
    id: 'sciaride_steinernema',
    secteur: 'pepiniere',
    ravageur: {
      emoji: '🪰',
      nom: 'Sciaride',
      nomScientifique: 'Bradysia spp.',
      impact: 'Attaque les racines des jeunes plants en pepiniere et serre.',
    },
    predateur: {
      emoji: '🔬',
      nom: 'Steinernema feltiae',
      nomScientifique: 'Steinernema feltiae',
      type: 'parasitoide',
      explication: 'Nematode entomopathogene tres efficace contre les larves de mouches des terreaux.',
    },
  },
  {
    id: 'taupin_carabe',
    secteur: 'pepiniere',
    ravageur: {
      emoji: '🪱',
      nom: 'Taupin (ver fil de fer)',
      nomScientifique: 'Agriotes spp.',
      impact: 'Larves terricoles qui rongent les racines et les tubercules, causant des pertes importantes.',
    },
    predateur: {
      emoji: '🪲',
      nom: 'Carabe dore',
      nomScientifique: 'Carabus auratus',
      type: 'predateur',
      explication: 'Carabe de grande taille qui chasse activement les larves terricoles de taupins.',
    },
  },
  {
    id: 'taupin_beauveria',
    secteur: 'pepiniere',
    ravageur: {
      emoji: '🪱',
      nom: 'Taupin (ver fil de fer)',
      nomScientifique: 'Agriotes spp.',
      impact: 'Perfore les semences et les racines en plein champ et grandes cultures.',
    },
    predateur: {
      emoji: '🍄',
      nom: 'Beauveria bassiana',
      nomScientifique: 'Beauveria bassiana',
      type: 'parasitoide',
      explication: 'Champignon entomopathogene qui infecte naturellement les larves de taupins dans le sol.',
    },
  },
];

export function getPairsBySecteur(secteurId) {
  return ECO_PAIRS_ALL.filter(p => p.secteur === secteurId);
}

export function getAllPairs() {
  return ECO_PAIRS_ALL;
}