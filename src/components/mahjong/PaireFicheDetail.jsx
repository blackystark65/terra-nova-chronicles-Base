import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Shield, Microscope, Leaf, BookOpen } from 'lucide-react';

// Données pédagogiques enrichies par paire
const ENRICHED_DATA = {
  // ─── MARAÎCHAGE ───
  puceron_coccinelle: {
    ravageur: {
      degats: ["Succion de la sève des jeunes pousses", "Transmission de virus (CMV, PVY...)", "Excrétions sucrées (miellat) qui favorisent la fumagine", "Déformation et recroquevillement des feuilles"],
      cycle: "Une femelle peut produire jusqu'à 80 pucerons par semaine sans accouplement (parthénogenèse). En été, les colonies peuvent doubler en 24h.",
    },
    auxiliaire: {
      mecanisme: "La coccinelle adulte et sa larve (encore plus vorace) dévorent pucerons, larves et œufs. La larve ressemble à un petit dragon noir et orange.",
      pourquoi_bio: "Utiliser des insecticides tuerait aussi les coccinelles et détruirait l'équilibre naturel. La lutte biologique restaure cet équilibre sans résidu chimique sur les légumes.",
      fun_fact: "Une larve de coccinelle mange jusqu'à 400 pucerons avant de se métamorphoser !"
    }
  },
  puceron_chrysope: {
    ravageur: {
      degats: ["Succion de la sève affaiblissant les plantes", "Transmission de virus phytopathogènes", "Production de miellat favorisant les champignons"],
      cycle: "Cycle rapide en conditions chaudes. Plusieurs générations par an (jusqu'à 20 en serre).",
    },
    auxiliaire: {
      mecanisme: "Les larves de chrysope sont surnommées 'lions des pucerons'. Elles aspirent le contenu de leurs proies grâce à des mandibules creuses. L'adulte est un insecte vert délicat aux grandes ailes transparentes.",
      pourquoi_bio: "La chrysope est polyvalente : elle s'attaque aussi aux aleurodes, aux acariens et aux œufs de nombreux ravageurs.",
      fun_fact: "La chrysope adulte se nourrit de pollen et de nectar — elle est aussi pollinisatrice !"
    }
  },
  puceron_cecido: {
    ravageur: {
      degats: ["Succion intense de la sève en serre", "Colonies denses sous les feuilles", "Virus transmis lors de la piqûre"],
      cycle: "Multiplication explosive sous serre où les conditions sont toujours favorables.",
    },
    auxiliaire: {
      mecanisme: "Les larves orangées de la cécidomyie paralysent les pucerons et les vident de leur contenu. Une larve peut tuer jusqu'à 80 pucerons sans les manger complètement.",
      pourquoi_bio: "Parfaitement adaptée aux serres, elle se déplace facilement entre les plants pour trouver ses proies.",
      fun_fact: "La femelle pond ses œufs directement au cœur des colonies de pucerons pour que les larves soient entourées de nourriture dès leur naissance !"
    }
  },
  aleurode_macrolophus: {
    ravageur: {
      degats: ["Succion de la sève des feuilles", "Transmission du virus TYLCV sur tomate", "Fumagine sur les excrétions sucrées"],
      cycle: "Se développe essentiellement sous serre (tomate, concombre, poivron). Résistante à de nombreux insecticides.",
    },
    auxiliaire: {
      mecanisme: "Le Macrolophus est omnivore : il pique et vide les larves d'aleurodes, les œufs et les jeunes thrips. Sa longévité (plusieurs semaines) en fait un auxiliaire durable.",
      pourquoi_bio: "Il est capable de survivre à faible densité de ravageurs en se nourrissant ponctuellement de sève — ce qui lui permet de rester présent même quand les populations sont basses.",
      fun_fact: "Le Macrolophus peut réguler simultanément les aleurodes ET les thrips ET les pucerons — un auxiliaire multi-cibles !"
    }
  },
  aleurode_encarsia: {
    ravageur: {
      degats: ["Affaiblissement des plantes en serre", "Fumagine noire sur les feuilles", "Réduction de la photosynthèse"],
      cycle: "Se reproduit très vite en serre. Très résistante aux pesticides classiques.",
    },
    auxiliaire: {
      mecanisme: "L'Encarsia formosa pond un œuf dans chaque larve d'aleurode au 3e-4e stade. La pupe devient noire (parasitée) au lieu de rester jaune. La guêpe adulte émerge et recommence.",
      pourquoi_bio: "Ce parasitoïde est l'un des premiers insectes jamais utilisés commercialement en lutte biologique (dès les années 1920 en Angleterre).",
      fun_fact: "On peut inspecter les feuilles : si les pupes d'aleurodes sont noires, l'Encarsia a bien travaillé !"
    }
  },
  thrips_orius: {
    ravageur: {
      degats: ["Taches argentées et déformations sur les feuilles", "Transmission du virus TSWV (une des pires maladies végétales)", "Dégâts sur fleurs et fruits (poivron, fraise, tomate)"],
      cycle: "Se faufile dans les fleurs pour se nourrir et pondre. Très résistant aux insecticides.",
    },
    auxiliaire: {
      mecanisme: "La punaise Orius pique et suce le contenu des thrips adultes et larvaires. Elle traque activement ses proies dans les fleurs et les replis des feuilles.",
      pourquoi_bio: "Orius est capable de réguler les thrips même à forte pression. Elle hiverne dans la végétation et est prête à intervenir tôt au printemps.",
      fun_fact: "Orius peut consommer 5 à 20 thrips par jour, et en l'absence de proies, se nourrit de pollen pour survivre !"
    }
  },
  thrips_swirskii: {
    ravageur: {
      degats: ["Piqûres sur feuilles et fleurs", "Transmission virale TSWV et TCSV", "Pertes de rendement importantes en poivron et concombre"],
      cycle: "Plusieurs générations par an. Se dissimule dans les calices des fleurs.",
    },
    auxiliaire: {
      mecanisme: "L'Amblyseius swirskii est un acarien prédateur qui se nourrit préférentiellement de larves de thrips et d'œufs d'aleurodes. Il se reproduit plus vite que ses proies en conditions chaudes.",
      pourquoi_bio: "Peut être introduit préventivement avant même l'apparition des ravageurs, ce qui est impossible avec les pesticides.",
      fun_fact: "Cet acarien est si petit qu'il faut une loupe pour le voir — mais il peut sauver une récolte entière !"
    }
  },
  acarien_phytoseiulus: {
    ravageur: {
      degats: ["Jaunissement et bronzage des feuilles", "Tissage de toiles fines sur les plantes", "Dessèchement et chute prématurée des feuilles", "Pertes de rendement en tomate, concombre, fraise"],
      cycle: "Se développe très vite par temps chaud et sec. Une femelle pond 3-5 œufs/jour.",
    },
    auxiliaire: {
      mecanisme: "Phytoseiulus persimilis est plus rapide que l'araignée rouge et s'en nourrit exclusivement. Il peut consommer 5 adultes ou 20 œufs par jour. Il suit l'odeur des plantes attaquées pour localiser ses proies.",
      pourquoi_bio: "Spécialiste absolu : il disparaît naturellement une fois les araignées rouges éliminées, sans perturber l'écosystème.",
      fun_fact: "Phytoseiulus est rose-orange, deux fois plus grand que sa proie, et peut réduire une population d'araignées rouges de 90% en 2 semaines !"
    }
  },
  noctuelle_trichogramme: {
    ravageur: {
      degats: ["Chenilles défoliatrices (tomate, chou, maïs...)", "Galeries dans les tiges et les fruits", "Un seul papillon peut pondre 1000 œufs"],
      cycle: "Cycle complet en 4 semaines. Les chenilles causent les dégâts, le papillon est inoffensif.",
    },
    auxiliaire: {
      mecanisme: "Le Trichogramme pond son propre œuf à l'intérieur de l'œuf de noctuelle. La larve de guêpe se développe à la place de la chenille et détruit l'œuf hôte avant même l'éclosion.",
      pourquoi_bio: "Zéro dommage au végétal car l'intervention a lieu au stade œuf, avant toute destruction. Solution 100% naturelle et ciblée.",
      fun_fact: "Le Trichogramme est 10 fois plus petit qu'une tête d'épingle et pourtant il protège des cultures entières !"
    }
  },
  limace_herisson: {
    ravageur: {
      degats: ["Destruction des jeunes plants et semis", "Attaques nocturnes sur feuilles et racines", "Dégâts importants par temps humide"],
      cycle: "Active la nuit et après la pluie. Pond des œufs gélatineux dans le sol humide.",
    },
    auxiliaire: {
      mecanisme: "Le hérisson est un prédateur nocturne généraliste qui consomme limaces, escargots, insectes et vers. Sa peau épaisse le protège du mucus des limaces.",
      pourquoi_bio: "Accueillir des hérissons (tas de bois, haies, passages) suffit à réduire naturellement les limaces sans aucun produit chimique.",
      fun_fact: "Un hérisson peut manger 200g d'invertébrés par nuit — soit des centaines de limaces en une saison !"
    }
  },
  limace_nematode: {
    ravageur: {
      degats: ["Destruction des semis de salades, épinards et carottes", "Active sous terre sur les tubercules (pomme de terre)"],
      cycle: "Ponte dans le sol. Les juvéniles passent leur vie sous terre.",
    },
    auxiliaire: {
      mecanisme: "Ce nématode microscopique pénètre dans le manteau de la limace et libère des bactéries qui causent une septicémie fatale. Il se vend en jardinerie sous forme de granulés à dissoudre dans l'eau.",
      pourquoi_bio: "Totalement invisible, non-toxique pour les humains, les animaux et les autres insectes. Efficace jusqu'à 6 semaines après application.",
      fun_fact: "Ces minuscules vers sont des chasseurs autonomes : ils suivent les traces chimiques laissées par les limaces dans le sol !"
    }
  },

  // ─── ARBORICULTURE ───
  carpocapse_trichogramme: {
    ravageur: {
      degats: ["Galeries creusées dans les pommes et poires", "Fruits invendables et pourrissants", "Jusqu'à 80% de perte de récolte sans protection"],
      cycle: "2 générations par an. Les chenilles hivernent sous l'écorce des arbres.",
    },
    auxiliaire: {
      mecanisme: "Trichogramma cacoeciae parasite spécifiquement les œufs de carpocapse. Il est lâché par capsules biodégradables accrochées dans les branches, libérant des guêpes adultes.",
      pourquoi_bio: "Zéro résidu sur les fruits. Les consommateurs peuvent manger des pommes traitées aux Trichogrammes sans aucun risque.",
      fun_fact: "En Suisse et en France, des milliers de vergers utilisent déjà les Trichogrammes au lieu des pesticides !"
    }
  },
  carpocapse_mesange: {
    ravageur: {
      degats: ["Larves forantes dans les fruits", "Pommes et poires criblées de galeries", "Contamination secondaire par champignons"],
      cycle: "Hiverne dans les crevasses de l'écorce. 1 à 2 générations par an selon le climat.",
    },
    auxiliaire: {
      mecanisme: "Les mésanges consomment d'énormes quantités de larves et chenilles au printemps, surtout pour nourrir leurs oisillons. Elles inspectent l'écorce pour trouver les larves hivernantes.",
      pourquoi_bio: "Poser des nichoirs dans le verger attire les mésanges et crée un service de lutte biologique gratuit et permanent.",
      fun_fact: "Un couple de mésanges peut capturer jusqu'à 10 000 chenilles pour nourrir une nichée de 10 oisillons !"
    }
  },
  puceron_lanigere_aphelinus: {
    ravageur: {
      degats: ["Colonies sous duvet blanc sur les rameaux de pommier", "Affaiblissement des jeunes rameaux", "Favorise les maladies cryptogamiques"],
      cycle: "Parasite spécifique du pommier. Prolifère dans les zones mal aérées.",
    },
    auxiliaire: {
      mecanisme: "L'Aphelinus mali est une petite guêpe noire qui parasite les pucerons lanigères. La pupe devient noire sous la carapace du puceron. Spécifiquement importé d'Amérique du Nord pour lutter contre ce ravageur introduit.",
      pourquoi_bio: "C'est un exemple classique de lutte biologique par introduction : on a introduit le prédateur naturel du pays d'origine du ravageur.",
      fun_fact: "L'Aphelinus a été introduit en Europe dans les années 1920 et il a quasiment éliminé le problème dans les vergers biologiques !"
    }
  },
  psylle_anthocoris: {
    ravageur: {
      degats: ["Jaunissement des feuilles ('grillure')", "Miellat collant favorable à la fumagine noire", "Dépérissement des rameaux de poirier"],
      cycle: "Hiverne sur les conifères et revient au poirier au printemps. Plusieurs générations.",
    },
    auxiliaire: {
      mecanisme: "Anthocoris nemoralis est une punaise prédatrice qui consomme tous les stades du psylle (œufs, nymphes, adultes). Elle est naturellement présente dans les vergers diversifiés.",
      pourquoi_bio: "Favoriser les haies et la diversité végétale autour des vergers permet à l'Anthocoris de se maintenir naturellement sans lâchers.",
      fun_fact: "L'Anthocoris utilise ses pièces buccales pour aspirer ses proies comme un aspirateur miniature !"
    }
  },
  acarien_typhlodromus_arbo: {
    ravageur: {
      degats: ["Bronzage et chute précoce des feuilles", "Réduction de la photosynthèse et du rendement", "Dommages importants sur pommier et poirier"],
      cycle: "Hiverne sous l'écorce. 6 à 8 générations en saison. Explose par temps chaud et sec.",
    },
    auxiliaire: {
      mecanisme: "Typhlodromus pyri est un acarien auxiliaire indigène présent naturellement dans les vergers. Il se nourrit de tous les stades de l'acarien rouge et peut contrôler complètement les populations.",
      pourquoi_bio: "Les traitements insecticides détruisent souvent le Typhlodromus, provoquant les explosions d'acariens rouges. Réduire les pesticides permet à ce régulateur naturel de reprendre son rôle.",
      fun_fact: "En verger biologique non traité, le Typhlodromus maintient l'acarien rouge sous le seuil de nuisibilité depuis des décennies !"
    }
  },
  cochenille_chilocorus: {
    ravageur: {
      degats: ["Épuisement de l'arbre par succion continue", "Taches rouges sur les fruits (pommier)", "Dépérissement progressif des rameaux"],
      cycle: "Hiverne sous son bouclier sur l'écorce. Résistante aux pesticides classiques.",
    },
    auxiliaire: {
      mecanisme: "Chilocorus nigritus est une coccinelle noire à deux points rouges spécialisée dans la prédation des cochenilles à carapace. Elle ronge le bouclier protecteur pour atteindre l'insecte.",
      pourquoi_bio: "Là où les pesticides ne peuvent pas pénétrer sous le bouclier de la cochenille, le Chilocorus y accède parfaitement.",
      fun_fact: "La forme ronde du Chilocorus l'empêche de se faire saisir par les fourmis qui protègent parfois les cochenilles !"
    }
  },

  // ─── VITICULTURE ───
  tordeuse_trichogramme: {
    ravageur: {
      degats: ["Perforation des baies favorisant Botrytis (pourriture grise)", "Perte de qualité du raisin et du vin", "Jusqu'à 30% de perte en année d'épidémie"],
      cycle: "3 générations par an en viticulture. Détecté par pièges à phéromones.",
    },
    auxiliaire: {
      mecanisme: "Trichogramma evanescens parasite les œufs de tordeuse sur les grappes et les feuilles. Les capsules à Trichogrammes se placent dans le feuillage au moment des pontes.",
      pourquoi_bio: "Méthode homologuée en viticulture biologique et biodynamique. Aucun résidu chimique sur les raisins et dans le vin.",
      fun_fact: "Cette technique est utilisée dans les grands vignobles alsaciens et bourguignons depuis plus de 30 ans !"
    }
  },
  tordeuse_chauve_souris: {
    ravageur: {
      degats: ["Papillons nocturnes pondant sur les grappes", "Larves perforant les baies de raisin", "Favorise les champignons pathogènes"],
      cycle: "Très actif la nuit. Détecté par comptage sur pièges lumineux.",
    },
    auxiliaire: {
      mecanisme: "Les chauves-souris chassent exclusivement la nuit et localisent les insectes volants par écholocation ultrasonique avec une précision redoutable. Elles gobent les papillons de tordeuse en plein vol.",
      pourquoi_bio: "Installer des nichoirs à chauves-souris dans et autour des vignes crée un service de lutte permanente et totalement gratuit.",
      fun_fact: "Une pipistrelle commune (la plus petite chauve-souris) peut capturer 3000 insectes en une seule nuit !"
    }
  },
  acarien_typhlodromus_viti: {
    ravageur: {
      degats: ["Grillure et bronzage des feuilles de vigne", "Chute des feuilles et éclaircissement", "Perte de maturité des raisins"],
      cycle: "Hiverne sous les écailles des bourgeons. Explose par temps chaud et après certains traitements.",
    },
    auxiliaire: {
      mecanisme: "Typhlodromus pyri est l'auxiliaire clé de la viticulture durable. Il hiverne dans les mêmes endroits que son ravageur et est prêt à intervenir dès le débourrement.",
      pourquoi_bio: "En viticulture biologique et raisonnée, on évite les pesticides à large spectre qui tuent le Typhlodromus. Sa présence indique un vignoble sain.",
      fun_fact: "Certains viticulteurs transplantent des sarments d'une parcelle riche en Typhlodromus pour coloniser une nouvelle vigne !"
    }
  },
  cicadelle_anagrus: {
    ravageur: {
      degats: ["Grillure cicadellienne (feuilles jaunissantes avec bord brûlé)", "Perte de vigueur et de qualité des raisins", "Favorise d'autres maladies secondaires"],
      cycle: "Hiverne dans les haies et vignes sauvages. 2 à 3 générations sur vigne.",
    },
    auxiliaire: {
      mecanisme: "Anagrus atomus parasite les œufs de cicadelle pondus à l'intérieur des nervures des feuilles. La guêpe introduit son propre œuf qui remplace et détruit l'œuf de cicadelle.",
      pourquoi_bio: "Favoriser les haies fleuries et la flore sauvage à proximité du vignoble héberge les populations naturelles d'Anagrus.",
      fun_fact: "L'Anagrus est si petit qu'il mesure 0.2mm — il est pratiquement invisible à l'œil nu mais dévaste les pontes de cicadelles !"
    }
  },
  cochenille_vigne_cryptolaemus: {
    ravageur: {
      degats: ["Affaiblissement des rameaux et grappes", "Miellat et fumagine réduisant la photosynthèse", "Transmission possible de viroses"],
      cycle: "Protégée par ses filaments cireux. Difficile à atteindre avec les pesticides.",
    },
    auxiliaire: {
      mecanisme: "Le Cryptolaemus est surnommé 'cochenille dévorante' car sa larve mimétique (blanche et laineuse) se glisse dans les colonies pour les dévorer de l'intérieur.",
      pourquoi_bio: "Sa larve ressemble à sa proie — ce camouflage lui permet de s'introduire dans les colonies sans être repoussé.",
      fun_fact: "Le Cryptolaemus vient d'Australie — il a été importé en Europe au XIXe siècle et sauvé de nombreux vignobles méditerranéens !"
    }
  },
  cochenille_vigne_anagyrus: {
    ravageur: {
      degats: ["Contamination des grappes et réduction de la récolte", "Transmission du virus GLRaV lié au court-noué", "Affaiblissement pluriannuel de la vigne"],
      cycle: "Produit jusqu'à 4 générations par an en zone méditerranéenne.",
    },
    auxiliaire: {
      mecanisme: "Anagyrus vladimiri est une guêpe parasitoïde ultra-spécialisée sur la cochenille farineuse de la vigne. Elle pond à l'intérieur de la cochenille, la larve la consomme de l'intérieur.",
      pourquoi_bio: "Cette spécificité garantit qu'elle n'attaque aucune autre espèce — une lutte chirurgicale sans effet secondaire.",
      fun_fact: "Son nom 'vladimiri' rend hommage au chercheur russe Vladimir Trjapitzin qui l'a décrite !"
    }
  },

  // ─── PÉPINIÈRE ───
  otiorhynque_heterorhabditis: {
    ravageur: {
      degats: ["Larves rongeant les racines dans le sol", "Adultes découpant les feuilles en demi-lunes la nuit", "Dépérissement brutal des plantes ornementales"],
      cycle: "Les larves vivent dans le sol de septembre à mai. Invisibles et difficiles à cibler.",
    },
    auxiliaire: {
      mecanisme: "Heterorhabditis bacteriophora est un nématode qui pénètre dans la larve via les orifices naturels. Il y libère des bactéries luminescentes (Photorhabdus) qui tuent la larve en 48h.",
      pourquoi_bio: "C'est la seule solution efficace contre les larves dans le sol. Les insecticides classiques ne peuvent pas y pénétrer. Les nématodes, eux, cherchent activement les larves.",
      fun_fact: "La larve infectée brille légèrement dans le noir à cause des bactéries bioluminescentes libérées par le nématode !"
    }
  },
  sciaride_hypoaspis: {
    ravageur: {
      degats: ["Larves détruisant les jeunes racines dans le substrat", "Champignons pathogènes attirés par les galeries", "Pertes importantes en production en godets"],
      cycle: "Très commun dans les terreaux riches. 3 à 4 générations par an en serre.",
    },
    auxiliaire: {
      mecanisme: "Stratiolaelaps scimitus (anciennement Hypoaspis) est un petit acarien brun qui vit dans le sol et chasse les larves de sciarides. Il s'incorpore dans le substrat et reste actif plusieurs semaines.",
      pourquoi_bio: "Une seule application préventive au début de culture suffit souvent à protéger toute la production.",
      fun_fact: "Cet acarien peut également s'attaquer aux pupes de thrips qui tombent dans le sol pour se métamorphoser !"
    }
  },
  sciaride_steinernema: {
    ravageur: {
      degats: ["Galeries dans les racines des semis", "Portes d'entrée aux maladies fongiques", "Mortalité des jeunes plants en pépinière"],
      cycle: "Les adultes volent autour des plants et pondent dans le substrat humide.",
    },
    auxiliaire: {
      mecanisme: "Steinernema feltiae pénètre dans les larves de sciarides via les orifices naturels et libère une bactérie (Xenorhabdus) qui tue la larve. Il s'applique simplement en arrosage.",
      pourquoi_bio: "Approuvé en agriculture biologique. Inoffensif pour les humains, les animaux, les vers de terre et les insectes adultes utiles.",
      fun_fact: "Ces nématodes survivent jusqu'à 14 jours au réfrigérateur et s'appliquent comme un arrosage ordinaire !"
    }
  },
  taupin_carabe: {
    ravageur: {
      degats: ["Larves 'fil-de-fer' rongeant racines et tubercules", "Semis détruits en pépinière", "Dégâts invisibles jusqu'à l'arrachage"],
      cycle: "Cycle de 3 à 5 ans dans le sol. Adulte volant en mai-juin.",
    },
    auxiliaire: {
      mecanisme: "Le carabe doré est un coléoptère prédateur terrestre qui chasse activement les larves de taupins et autres insectes du sol. Nocturne, il court vite et est très vorace.",
      pourquoi_bio: "Favoriser les bandes enherbées et les haies permet aux carabes de se reproduire et de coloniser les zones cultivées.",
      fun_fact: "Le carabe doré à l'iridescence verte et or — c'est l'un des insectes les plus beaux de nos jardins, et l'un des plus utiles !"
    }
  },
  taupin_beauveria: {
    ravageur: {
      degats: ["Perforation des semences dans le sol", "Galeries dans les tubercules de pomme de terre", "Dommages coûteux en maraîchage et grandes cultures"],
      cycle: "La larve passe 3 à 5 ans dans le sol avant de devenir adulte.",
    },
    auxiliaire: {
      mecanisme: "Beauveria bassiana est un champignon naturellement présent dans le sol. Ses spores germent sur la cuticule de la larve, pénètrent et la parasitent. L'insecte meurt en 5 à 10 jours, recouvert d'un mycélium blanc.",
      pourquoi_bio: "Le champignon se multiplie dans le sol et peut persister pour protéger les cultures suivantes.",
      fun_fact: "Beauveria bassiana est aussi utilisé contre les punaises de lit, les termites et les moustiques — un champignon révolutionnaire !"
    }
  },
};

// Fallback générique si pas de données enrichies
function getEnrichedData(pairId) {
  return ENRICHED_DATA[pairId] || {
    ravageur: {
      degats: ["Dommages directs sur les végétaux", "Transmission possible de maladies", "Réduction des rendements agricoles"],
      cycle: "Cycle de vie adapté aux conditions locales de culture.",
    },
    auxiliaire: {
      mecanisme: "Prédateur ou parasitoïde naturel qui régule la population du ravageur.",
      pourquoi_bio: "La lutte biologique préserve l'équilibre des écosystèmes et évite les résidus de pesticides.",
      fun_fact: "Les insectes auxiliaires sont les alliés invisibles de l'agriculture durable !"
    }
  };
}

export default function PaireFicheDetail({ pair, onClose }) {
  if (!pair) return null;
  const enriched = getEnrichedData(pair.id);
  const isParasitoide = pair.predateur.type === 'parasitoide';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-black text-sm uppercase tracking-wider">Fiche pédagogique</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 pb-6 space-y-4">

          {/* ─── RAVAGEUR ─────────────────────────────── */}
          <div className="rounded-2xl bg-red-950/60 border border-red-500/30 overflow-hidden">
            {/* Header ravageur */}
            <div className="p-4 bg-red-900/50 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-red-400/50 bg-slate-800 shrink-0">
                {pair.ravageur.photo ? (
                  <img src={pair.ravageur.photo} alt={pair.ravageur.nomFr} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{pair.ravageur.emoji}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-red-200 font-black text-lg leading-tight">{pair.ravageur.nomFr || pair.ravageur.nom}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 text-xs border border-red-400/40 font-bold">⚠️ Ravageur</span>
                </div>
                <span className="text-red-300/50 text-xs italic">{pair.ravageur.nomScientifique}</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Dégâts */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-red-300 font-bold text-xs uppercase tracking-wider">Dégâts causés</span>
                </div>
                <ul className="space-y-1">
                  {enriched.ravageur.degats.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-100/80 text-sm">
                      <span className="text-red-400 mt-0.5 shrink-0">•</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cycle / prolifération */}
              {enriched.ravageur.cycle && (
                <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/20">
                  <span className="text-red-400 font-bold text-xs block mb-1">🔄 Cycle & prolifération</span>
                  <p className="text-red-100/75 text-sm leading-relaxed">{enriched.ravageur.cycle}</p>
                </div>
              )}

              {/* Impact original */}
              <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/20">
                <p className="text-red-200/80 text-sm italic">💥 {pair.ravageur.impact}</p>
              </div>
            </div>
          </div>

          {/* Flèche */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl">⬇️</span>
              <span className="text-white/40 text-xs font-bold">combattu par</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>

          {/* ─── AUXILIAIRE ────────────────────────────── */}
          <div className={`rounded-2xl border overflow-hidden ${isParasitoide ? 'bg-violet-950/60 border-violet-500/30' : 'bg-emerald-950/60 border-emerald-500/30'}`}>
            {/* Header auxiliaire */}
            <div className={`p-4 flex items-center gap-3 ${isParasitoide ? 'bg-violet-900/50' : 'bg-emerald-900/50'}`}>
              <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-800 ${isParasitoide ? 'border-violet-400/50' : 'border-emerald-400/50'}`}>
                {pair.predateur.photo ? (
                  <img src={pair.predateur.photo} alt={pair.predateur.nomFr} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{pair.predateur.emoji}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-black text-lg leading-tight ${isParasitoide ? 'text-violet-200' : 'text-emerald-200'}`}>
                    {pair.predateur.nomFr || pair.predateur.nom}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border font-bold ${isParasitoide ? 'bg-violet-500/30 text-violet-300 border-violet-400/40' : 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40'}`}>
                    {isParasitoide ? '🔬 Parasitoïde' : '🦁 Prédateur'}
                  </span>
                </div>
                <span className={`text-xs italic ${isParasitoide ? 'text-violet-300/50' : 'text-emerald-300/50'}`}>{pair.predateur.nomScientifique}</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Mécanisme */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Microscope className="w-3.5 h-3.5 text-emerald-400" />
                  <span className={`font-bold text-xs uppercase tracking-wider ${isParasitoide ? 'text-violet-300' : 'text-emerald-300'}`}>Comment il agit</span>
                </div>
                <p className={`text-sm leading-relaxed ${isParasitoide ? 'text-violet-100/80' : 'text-emerald-100/80'}`}>{enriched.auxiliaire.mecanisme}</p>
              </div>

              {/* Explication originale */}
              <div className={`p-3 rounded-xl border ${isParasitoide ? 'bg-violet-900/40 border-violet-500/20' : 'bg-emerald-900/40 border-emerald-500/20'}`}>
                <p className={`text-sm italic ${isParasitoide ? 'text-violet-200/80' : 'text-emerald-200/80'}`}>✅ {pair.predateur.explication}</p>
              </div>
            </div>
          </div>

          {/* ─── POURQUOI LA LUTTE BIOLOGIQUE ─────────── */}
          <div className="rounded-2xl bg-amber-950/50 border border-amber-500/30 p-4 space-y-3">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-black text-sm uppercase tracking-wider">Pourquoi la lutte biologique ?</span>
            </div>
            <p className="text-amber-100/80 text-sm leading-relaxed">{enriched.auxiliaire.pourquoi_bio}</p>

            {/* Les 3 avantages clés */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { icon: '🌿', label: 'Zéro résidu', sub: 'sur les aliments' },
                { icon: '🐝', label: 'Biodiversité', sub: 'préservée' },
                { icon: '♻️', label: 'Durable', sub: 'et autonome' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-amber-900/40 border border-amber-500/20 p-2.5 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-amber-300 font-bold text-xs leading-tight">{item.label}</div>
                  <div className="text-amber-400/50 text-[10px]">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── FUN FACT ─────────────────────────────── */}
          <div className="rounded-2xl bg-cyan-950/50 border border-cyan-500/30 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🤩</span>
              <div>
                <span className="text-cyan-400 font-black text-sm block mb-1">Le sais-tu ?</span>
                <p className="text-cyan-100/80 text-sm leading-relaxed">{enriched.auxiliaire.fun_fact}</p>
              </div>
            </div>
          </div>

          {/* ─── SHIELD AGROÉCOLOGIE ──────────────────── */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-white/50" />
              <span className="text-white/50 font-bold text-xs uppercase tracking-wider">Agroécologie</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              La lutte biologique est un pilier de l'agroécologie : au lieu de combattre la nature avec des produits chimiques,
              on utilise les relations naturelles entre les espèces pour protéger les cultures durablement.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 shrink-0 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all"
          >
            Fermer la fiche
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}