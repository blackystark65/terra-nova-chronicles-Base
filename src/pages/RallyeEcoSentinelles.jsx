import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Lock, Trophy, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// ─── DONNÉES DES 7 DÉFIS ─────────────────────────────────────────────────────

const DEFIS = [
  {
    id: 1,
    emoji: '⚡',
    titre: 'Énergie',
    sousTitre: 'Chasse aux Veilles',
    couleur: 'from-yellow-600 to-orange-700',
    couleurBadge: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    motCle: 'SOLEIL',
    description: 'Repère les appareils qui gaspillent de l\'énergie inutilement.',
    geste: 'Éteindre complètement les appareils électriques.',
    type: 'selection',
    question: 'Dans cette maison, quels appareils gaspillent de l\'énergie ? Sélectionne tous les coupables !',
    items: [
      { id: 'tv', label: '📺 TV en veille', correct: true },
      { id: 'chargeur', label: '🔌 Chargeur branché sans téléphone', correct: true },
      { id: 'lumiere', label: '💡 Lumière allumée dans une pièce vide', correct: true },
      { id: 'frigo', label: '🧊 Réfrigérateur branché', correct: false },
      { id: 'ordi', label: '💻 Ordinateur en veille', correct: true },
      { id: 'four', label: '🍳 Four éteint', correct: false },
    ],
  },
  {
    id: 2,
    emoji: '💧',
    titre: 'Eau',
    sousTitre: 'La Brigade des Gouttes',
    couleur: 'from-blue-600 to-cyan-700',
    couleurBadge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    motCle: 'RIVIÈRE',
    description: 'Associe chaque action à sa consommation en eau.',
    geste: 'Couper l\'eau pendant le savonnage et privilégier les douches courtes.',
    type: 'association',
    question: 'Relie chaque action à sa consommation en eau. Clique sur une action, puis sur la bonne valeur !',
    paires: [
      { action: '🚿 Douche 5 min', valeur: '60 L' },
      { action: '🛁 Bain', valeur: '150 L' },
      { action: '🦷 Robinet ouvert pendant le brossage', valeur: '12 L' },
      { action: '🍽️ Vaisselle à la main', valeur: '15 L' },
    ],
  },
  {
    id: 3,
    emoji: '🥗',
    titre: 'Alimentation',
    sousTitre: 'Le Juste Poids',
    couleur: 'from-green-600 to-emerald-700',
    couleurBadge: 'bg-green-500/20 text-green-300 border-green-400/30',
    motCle: 'COMPOST',
    description: 'Compose une assiette idéale sans gaspillage.',
    geste: 'Doser ses portions et composter les déchets organiques.',
    type: 'tri',
    question: 'Trie ces déchets : place-les dans la bonne poubelle (compost ou recyclage) !',
    items: [
      { id: 'pelure', label: '🍌 Pelure de banane', correct: 'compost' },
      { id: 'boite', label: '📦 Boîte en carton', correct: 'recyclage' },
      { id: 'marc', label: '☕ Marc de café', correct: 'compost' },
      { id: 'bouteille', label: '🧴 Bouteille plastique', correct: 'recyclage' },
      { id: 'salade', label: '🥬 Restes de salade', correct: 'compost' },
      { id: 'canette', label: '🥤 Canette aluminium', correct: 'recyclage' },
    ],
  },
  {
    id: 4,
    emoji: '🚲',
    titre: 'Mobilité Douce',
    sousTitre: 'Le Bon Trajet',
    couleur: 'from-teal-600 to-cyan-800',
    couleurBadge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    motCle: 'PÉDALE',
    description: 'Choisis le transport le moins polluant selon les situations.',
    geste: 'Préférer le vélo et la marche pour les trajets courts.',
    type: 'quiz',
    question: 'Pour chaque trajet, quel est le meilleur choix écologique ?',
    questions: [
      { situation: '🏫 Aller à l\'école (500 m)', options: ['🚶 Marche', '🚲 Vélo', '🚌 Bus', '🚗 Voiture'], correct: 0, explication: 'À 500 m, la marche est parfaite !' },
      { situation: '🥖 Aller à la boulangerie (1 km)', options: ['🚶 Marche', '🚲 Vélo', '🚌 Bus', '🚗 Voiture'], correct: 1, explication: 'Le vélo est idéal pour 1 km !' },
      { situation: '⚽ Sport à 10 km', options: ['🚶 Marche', '🚲 Vélo', '🚌 Bus', '🚗 Voiture'], correct: 2, explication: 'Le bus collectif pollue bien moins que la voiture !' },
    ],
  },
  {
    id: 5,
    emoji: '🌍',
    titre: 'Voyages Locaux',
    sousTitre: 'Explorateurs de Proximité',
    couleur: 'from-indigo-600 to-violet-700',
    couleurBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    motCle: 'NATURE',
    description: 'Compare l\'impact carbone de deux types de vacances.',
    geste: 'Découvrir sa région pour limiter l\'usage de l\'avion.',
    type: 'comparaison',
    question: 'Compare ces deux vacances et réponds aux questions.',
    vacanceA: { label: '✈️ Plage à l\'autre bout du monde', co2: '2500 kg CO₂', emoji: '✈️' },
    vacanceB: { label: '🏕️ Randonnée en région en train', co2: '18 kg CO₂', emoji: '🚂' },
    questionsCompa: [
      { texte: 'Quel choix émet le moins de CO₂ ?', correct: 'B' },
      { texte: 'Quel choix permet de découvrir des paysages locaux ?', correct: 'B' },
      { texte: 'Quel choix est le plus accessible financièrement ?', correct: 'B' },
    ],
  },
  {
    id: 6,
    emoji: '🥕',
    titre: 'Circuits Courts',
    sousTitre: 'Le Marché Local',
    couleur: 'from-orange-600 to-red-700',
    couleurBadge: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    motCle: 'SAISON',
    description: 'Élimine les intrus du panier : garde uniquement les produits locaux et de saison.',
    geste: 'Consommer local et de saison.',
    type: 'selection',
    question: 'Nous sommes en hiver. Élimine les produits qui NE sont PAS de saison ou qui viennent de trop loin !',
    items: [
      { id: 'fraises', label: '🍓 Fraises (importées en hiver)', correct: true },
      { id: 'poireaux', label: '🥬 Poireaux locaux', correct: false },
      { id: 'ananas', label: '🍍 Ananas tropical', correct: true },
      { id: 'pommes', label: '🍎 Pommes de la région', correct: false },
      { id: 'tomates', label: '🍅 Tomates sous serre (hiver)', correct: true },
      { id: 'carottes', label: '🥕 Carottes locales', correct: false },
    ],
  },
  {
    id: 7,
    emoji: '♻️',
    titre: 'Économie Circulaire',
    sousTitre: 'La Seconde Vie',
    couleur: 'from-emerald-600 to-teal-700',
    couleurBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    motCle: 'RÉPARE',
    description: 'Applique la règle des 3R : Réduire, Réutiliser, Recycler.',
    geste: 'Prolonger la durée de vie des objets.',
    type: 'attribution',
    question: 'Pour chaque objet, quelle est la meilleure action ?',
    items: [
      { id: 'vetement', label: '👕 Vêtement troué', options: ['Donner', 'Réparer', 'Recycler', 'Jeter'], correct: 1 },
      { id: 'bocal', label: '🫙 Bocal en verre vide', options: ['Donner', 'Réutiliser', 'Recycler', 'Jeter'], correct: 1 },
      { id: 'jouet', label: '🧸 Jouet cassé réparable', options: ['Donner', 'Réparer', 'Recycler', 'Jeter'], correct: 1 },
      { id: 'livre', label: '📚 Livre déjà lu', options: ['Donner', 'Réparer', 'Recycler', 'Jeter'], correct: 0 },
    ],
  },
];

const CODE_SECRET = DEFIS.map(d => d.motCle).join('-');

// ─── COMPOSANTS DE JEU ────────────────────────────────────────────────────────

function DefiSelection({ defi, onValidate }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => {
    if (submitted) return;
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const handleSubmit = () => setSubmitted(true);

  const allCorrect = () => {
    const correctIds = defi.items.filter(i => i.correct).map(i => i.id);
    return correctIds.length === selected.length && correctIds.every(id => selected.includes(id));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {defi.items.map(item => {
          const isSelected = selected.includes(item.id);
          const isCorrect = item.correct;
          let bgClass = 'bg-white/10 border-white/20 hover:bg-white/20';
          if (submitted) {
            if (isCorrect) bgClass = 'bg-green-500/30 border-green-400/60';
            else if (isSelected && !isCorrect) bgClass = 'bg-red-500/30 border-red-400/60';
            else bgClass = 'bg-white/5 border-white/10';
          } else if (isSelected) {
            bgClass = 'bg-yellow-500/30 border-yellow-400/60';
          }
          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${bgClass}`}>
              {submitted && isCorrect && <span className="mr-1">✅</span>}
              {submitted && isSelected && !isCorrect && <span className="mr-1">❌</span>}
              {item.label}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={selected.length === 0}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black disabled:opacity-40 transition-all">
          Valider mes réponses
        </button>
      ) : (
        <div className={`p-3 rounded-xl text-center font-bold ${allCorrect() ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
          {allCorrect() ? '🎉 Parfait ! Tu as trouvé tous les coupables !' : '⚠️ Pas tout à fait… Les cases vertes sont les bonnes réponses.'}
          <button onClick={() => onValidate(allCorrect())} className="block w-full mt-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black transition-all">
            Continuer →
          </button>
        </div>
      )}
    </div>
  );
}

function DefiAssociation({ defi, onValidate }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [matched, setMatched] = useState({});
  const [errors, setErrors] = useState([]);

  const valeurs = [...defi.paires].sort(() => Math.random() - 0.5);
  const actions = defi.paires.map(p => p.action);

  const handleActionClick = (action) => {
    if (Object.keys(matched).includes(action)) return;
    setSelectedAction(action);
  };

  const handleValeurClick = (valeur) => {
    if (!selectedAction) return;
    const correctPaire = defi.paires.find(p => p.action === selectedAction);
    if (correctPaire.valeur === valeur) {
      setMatched(m => ({ ...m, [selectedAction]: valeur }));
    } else {
      setErrors(e => [...e, selectedAction]);
      setTimeout(() => setErrors(e => e.filter(x => x !== selectedAction)), 800);
    }
    setSelectedAction(null);
  };

  const allDone = Object.keys(matched).length === defi.paires.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-xs text-white/50 font-bold uppercase tracking-wider text-center">Actions</p>
          {actions.map(action => {
            const isMatched = Object.keys(matched).includes(action);
            const isSelected = selectedAction === action;
            const isError = errors.includes(action);
            return (
              <button key={action} onClick={() => handleActionClick(action)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium transition-all text-left
                  ${isMatched ? 'bg-green-500/20 border-green-400/40 text-green-300' :
                    isError ? 'bg-red-500/30 border-red-400/60 animate-pulse' :
                    isSelected ? 'bg-yellow-400/30 border-yellow-400/60 text-yellow-200' :
                    'bg-white/10 border-white/20 hover:bg-white/20 text-white'}`}>
                {action} {isMatched && <span className="text-green-400 font-black">→ {matched[action]}</span>}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <p className="text-xs text-white/50 font-bold uppercase tracking-wider text-center">Volumes</p>
          {valeurs.map(({ valeur }) => {
            const isUsed = Object.values(matched).includes(valeur);
            return (
              <button key={valeur} onClick={() => handleValeurClick(valeur)}
                disabled={isUsed || !selectedAction}
                className={`w-full p-2.5 rounded-xl border text-sm font-black transition-all
                  ${isUsed ? 'bg-green-500/20 border-green-400/40 text-green-300 opacity-50' :
                    selectedAction ? 'bg-blue-500/20 border-blue-400/40 text-blue-200 hover:bg-blue-400/30' :
                    'bg-white/10 border-white/20 text-white opacity-60'}`}>
                {valeur}
              </button>
            );
          })}
        </div>
      </div>
      {allDone && (
        <div className="p-3 rounded-xl bg-green-500/20 text-green-300 text-center font-bold">
          🎉 Toutes les associations sont correctes !
          <button onClick={() => onValidate(true)} className="block w-full mt-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black">
            Continuer →
          </button>
        </div>
      )}
      {!allDone && <p className="text-center text-white/40 text-xs">Clique sur une action, puis sur le bon volume</p>}
    </div>
  );
}

function DefiTri({ defi, onValidate }) {
  const [placements, setPlacements] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const place = (id, poubelle) => {
    if (submitted) return;
    setPlacements(p => ({ ...p, [id]: poubelle }));
  };

  const allPlaced = defi.items.every(i => placements[i.id]);
  const score = defi.items.filter(i => placements[i.id] === i.correct).length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {defi.items.map(item => {
          const placed = placements[item.id];
          let border = 'border-white/20 bg-white/10';
          if (submitted) {
            border = placements[item.id] === item.correct ? 'border-green-400/60 bg-green-500/20' : 'border-red-400/60 bg-red-500/20';
          } else if (placed === 'compost') border = 'border-yellow-400/60 bg-yellow-500/20';
          else if (placed === 'recyclage') border = 'border-blue-400/60 bg-blue-500/20';

          return (
            <div key={item.id} className={`rounded-xl border p-2 text-center ${border}`}>
              <div className="text-xl mb-1">{item.label.split(' ')[0]}</div>
              <div className="text-[10px] text-white/70 mb-2 leading-tight">{item.label.split(' ').slice(1).join(' ')}</div>
              {!submitted && (
                <div className="flex gap-1">
                  <button onClick={() => place(item.id, 'compost')}
                    className={`flex-1 text-[10px] py-1 rounded-lg font-bold transition-all ${placed === 'compost' ? 'bg-yellow-500 text-black' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40'}`}>
                    🌱
                  </button>
                  <button onClick={() => place(item.id, 'recyclage')}
                    className={`flex-1 text-[10px] py-1 rounded-lg font-bold transition-all ${placed === 'recyclage' ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/40'}`}>
                    ♻️
                  </button>
                </div>
              )}
              {submitted && (
                <div className="text-xs font-bold">{placements[item.id] === item.correct ? '✅' : `❌ ${item.correct}`}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 text-xs text-white/50 justify-center">
        <span>🌱 Compost</span><span>♻️ Recyclage</span>
      </div>
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={!allPlaced}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black disabled:opacity-40 transition-all">
          Valider
        </button>
      ) : (
        <div className="p-3 rounded-xl text-center font-bold bg-white/10">
          <span className="text-lg">{score === 6 ? '🎉' : score >= 4 ? '👍' : '💪'}</span>
          <span className="ml-2 text-white">{score}/6 bons tris !</span>
          <button onClick={() => onValidate(score >= 4)} className="block w-full mt-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black">
            Continuer →
          </button>
        </div>
      )}
    </div>
  );
}

function DefiQuiz({ defi, onValidate }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);

  const q = defi.questions[current];

  const handleChoose = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    setTimeout(() => {
      const newAnswers = [...answers, idx === q.correct];
      setAnswers(newAnswers);
      if (current + 1 < defi.questions.length) {
        setCurrent(c => c + 1);
        setChosen(null);
      } else {
        const score = newAnswers.filter(Boolean).length;
        setTimeout(() => onValidate(score >= 2), 1200);
      }
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 mb-2">
        {defi.questions.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < current ? 'bg-green-400' : i === current ? 'bg-amber-400' : 'bg-white/20'}`} />
        ))}
      </div>
      <div className="p-3 rounded-xl bg-white/10 text-center">
        <p className="text-base font-bold text-white">{q.situation}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, idx) => {
          let bg = 'bg-white/10 border-white/20 hover:bg-white/20';
          if (chosen !== null) {
            if (idx === q.correct) bg = 'bg-green-500/40 border-green-400/60';
            else if (idx === chosen && idx !== q.correct) bg = 'bg-red-500/40 border-red-400/60';
          }
          return (
            <button key={idx} onClick={() => handleChoose(idx)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${bg}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-center text-sm font-medium ${chosen === q.correct ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
          {q.explication}
        </motion.div>
      )}
    </div>
  );
}

function DefiComparaison({ defi, onValidate }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const choose = (idx, val) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [idx]: val }));
  };

  const score = defi.questionsCompa.filter((q, i) => answers[i] === q.correct).length;
  const allAnswered = defi.questionsCompa.every((_, i) => answers[i]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 mb-2">
        {[defi.vacanceA, defi.vacanceB].map((v, i) => (
          <div key={i} className={`p-3 rounded-xl border text-center ${i === 0 ? 'border-red-400/30 bg-red-500/10' : 'border-green-400/30 bg-green-500/10'}`}>
            <div className="text-2xl mb-1">{v.emoji}</div>
            <div className="text-xs font-bold text-white leading-tight">{v.label}</div>
            <div className={`text-xs mt-1 font-black ${i === 0 ? 'text-red-300' : 'text-green-300'}`}>{v.co2}</div>
          </div>
        ))}
      </div>
      {defi.questionsCompa.map((q, i) => (
        <div key={i} className="space-y-1">
          <p className="text-sm text-white/80 font-medium">{q.texte}</p>
          <div className="flex gap-2">
            {['A', 'B'].map(opt => {
              let bg = 'bg-white/10 border-white/20 hover:bg-white/20';
              if (submitted) {
                if (opt === q.correct) bg = 'bg-green-500/30 border-green-400/60';
                else if (answers[i] === opt && opt !== q.correct) bg = 'bg-red-500/30 border-red-400/60';
              } else if (answers[i] === opt) bg = 'bg-amber-500/30 border-amber-400/60';
              return (
                <button key={opt} onClick={() => choose(i, opt)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-black transition-all ${bg}`}>
                  {opt === 'A' ? '✈️ Option A' : '🚂 Option B'}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={!allAnswered}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black disabled:opacity-40 transition-all">
          Valider
        </button>
      ) : (
        <div className="p-3 rounded-xl text-center font-bold bg-white/10 text-white">
          {score}/3 bonnes réponses !
          <button onClick={() => onValidate(score >= 2)} className="block w-full mt-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black">
            Continuer →
          </button>
        </div>
      )}
    </div>
  );
}

function DefiAttribution({ defi, onValidate }) {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const choose = (id, idx) => {
    if (submitted) return;
    setChoices(c => ({ ...c, [id]: idx }));
  };

  const score = defi.items.filter(i => choices[i.id] === i.correct).length;
  const allAnswered = defi.items.every(i => choices[i.id] !== undefined);

  return (
    <div className="space-y-3">
      {defi.items.map(item => (
        <div key={item.id} className="p-3 rounded-xl bg-white/10 border border-white/20">
          <p className="text-sm font-bold text-white mb-2">{item.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.options.map((opt, idx) => {
              let bg = 'bg-white/10 border-white/15 hover:bg-white/20';
              if (submitted) {
                if (idx === item.correct) bg = 'bg-green-500/40 border-green-400/60 text-green-200';
                else if (choices[item.id] === idx && idx !== item.correct) bg = 'bg-red-500/40 border-red-400/60 text-red-200';
              } else if (choices[item.id] === idx) bg = 'bg-amber-400/30 border-amber-400/60 text-amber-200';
              return (
                <button key={idx} onClick={() => choose(item.id, idx)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${bg}`}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={!allAnswered}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black disabled:opacity-40 transition-all">
          Valider
        </button>
      ) : (
        <div className="p-3 rounded-xl text-center font-bold bg-white/10 text-white">
          {score}/{defi.items.length} bonnes réponses !
          <button onClick={() => onValidate(score >= 3)} className="block w-full mt-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black">
            Continuer →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ÉCRAN D'UN DÉFI ─────────────────────────────────────────────────────────

function DefiScreen({ defi, onComplete, onBack }) {
  const [phase, setPhase] = useState('intro'); // intro | jeu | victoire
  const [success, setSuccess] = useState(false);

  const handleValidate = (ok) => {
    setSuccess(ok);
    setPhase('victoire');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className={`min-h-screen flex flex-col bg-gradient-to-br ${defi.couleur}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-black/30 border border-white/20 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{defi.emoji}</span>
            <span className="text-white font-black text-lg">{defi.titre}</span>
          </div>
          <p className="text-white/60 text-xs">{defi.sousTitre}</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full bg-black/30 border border-white/20">
          <span className="text-white/70 text-xs font-bold">Défi {defi.id}/7</span>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        {phase === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4">
            <div className="text-center">
              <div className="text-7xl mb-3">{defi.emoji}</div>
              <h2 className="text-2xl font-black text-white mb-1">{defi.sousTitre}</h2>
              <p className="text-white/70 text-sm">{defi.description}</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/25 border border-white/15">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">📋 Mission</p>
              <p className="text-white text-sm">{defi.question}</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/20 border border-white/10">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">💡 Geste appris</p>
              <p className="text-white/80 text-sm">{defi.geste}</p>
            </div>
            <button onClick={() => setPhase('jeu')}
              className="w-full py-4 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-black text-lg transition-all">
              🚀 Commencer le défi !
            </button>
          </motion.div>
        )}

        {phase === 'jeu' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-3">
            <div className="p-3 rounded-xl bg-black/20 border border-white/15">
              <p className="text-white text-sm font-medium">{defi.question}</p>
            </div>
            {defi.type === 'selection' && <DefiSelection defi={defi} onValidate={handleValidate} />}
            {defi.type === 'association' && <DefiAssociation defi={defi} onValidate={handleValidate} />}
            {defi.type === 'tri' && <DefiTri defi={defi} onValidate={handleValidate} />}
            {defi.type === 'quiz' && <DefiQuiz defi={defi} onValidate={handleValidate} />}
            {defi.type === 'comparaison' && <DefiComparaison defi={defi} onValidate={handleValidate} />}
            {defi.type === 'attribution' && <DefiAttribution defi={defi} onValidate={handleValidate} />}
          </motion.div>
        )}

        {phase === 'victoire' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="pt-8 text-center space-y-5">
            <div className="text-6xl">{success ? '🗝️' : '💪'}</div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1">
                {success ? 'Clé obtenue !' : 'Défi relevé !'}
              </h2>
              <p className="text-white/70 text-sm">
                {success ? `Tu as gagné le mot-clé :` : 'Tu continues avec le mot-clé :'}
              </p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-black/30 border-2 border-amber-400/60 inline-block mx-auto">
              <span className="text-amber-300 font-black text-2xl tracking-widest">{defi.motCle}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/15 text-left">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">💡 À retenir</p>
              <p className="text-white/80 text-sm">{defi.geste}</p>
            </div>
            <button onClick={() => onComplete(defi.motCle)}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-lg transition-all">
              Défi suivant →
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── CARTE DU DÉFI ───────────────────────────────────────────────────────────

function DefiCard({ defi, unlocked, completed, motCle, onClick }) {
  return (
    <motion.button
      whileHover={unlocked ? { scale: 1.03 } : {}}
      whileTap={unlocked ? { scale: 0.97 } : {}}
      onClick={unlocked ? onClick : undefined}
      className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden
        ${completed ? 'bg-gradient-to-br ' + defi.couleur + ' border-white/20 shadow-lg' :
          unlocked ? 'bg-white/10 border-white/20 hover:bg-white/15' :
          'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
          ${completed ? 'bg-white/20' : unlocked ? 'bg-white/10' : 'bg-white/5'}`}>
          {completed ? '✅' : unlocked ? defi.emoji : '🔒'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-sm">{defi.titre}</span>
            {completed && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${defi.couleurBadge}`}>
                🗝️ {motCle}
              </span>
            )}
          </div>
          <p className="text-white/50 text-xs truncate">{defi.sousTitre}</p>
        </div>
        {unlocked && !completed && <ArrowRight className="w-4 h-4 text-white/40 shrink-0" />}
        {!unlocked && <Lock className="w-4 h-4 text-white/30 shrink-0" />}
      </div>
    </motion.button>
  );
}

// ─── ÉCRAN FINAL — CODE SECRET ────────────────────────────────────────────────

function EcranFinal({ motsCles, onRestart }) {
  const code = motsCles.join('-');
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-900 to-yellow-900 text-center">
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }} className="text-8xl mb-4">
        🏆
      </motion.div>
      <h1 className="text-3xl font-black text-amber-300 mb-2">Félicitations !</h1>
      <p className="text-white/70 mb-6 text-sm max-w-sm">
        Tu as obtenu les 7 clés de la transition écologique. Voici le code secret du <strong className="text-amber-300">Coffre de la Planète</strong> :
      </p>
      <div className="p-5 rounded-3xl bg-black/40 border-2 border-amber-400/60 mb-6 w-full max-w-sm">
        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">🔐 Code Secret</p>
        <p className="text-amber-300 font-black text-lg tracking-wider break-all">{code}</p>
      </div>
      <div className="w-full max-w-sm space-y-2 mb-6">
        {DEFIS.map((d, i) => (
          <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-black/20 border border-white/10">
            <span className="text-lg">{d.emoji}</span>
            <span className="text-white/70 text-sm flex-1">{d.titre}</span>
            <span className="text-amber-300 font-black text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
              🗝️ {motsCles[i]}
            </span>
          </div>
        ))}
      </div>
      <button onClick={onRestart}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-black transition-all">
        <RotateCcw className="w-4 h-4" />
        Recommencer
      </button>
    </motion.div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function RallyeEcoSentinelles() {
  const [currentDefi, setCurrentDefi] = useState(null); // index 0-6 ou null
  const [motsCles, setMotsCles] = useState([]); // mots-clés gagnés
  const [finished, setFinished] = useState(false);

  const handleComplete = (motCle) => {
    const newMotsCles = [...motsCles, motCle];
    setMotsCles(newMotsCles);
    setCurrentDefi(null);
    if (newMotsCles.length === DEFIS.length) {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setMotsCles([]);
    setCurrentDefi(null);
    setFinished(false);
  };

  if (finished) return <EcranFinal motsCles={motsCles} onRestart={handleRestart} />;

  if (currentDefi !== null) {
    return (
      <AnimatePresence mode="wait">
        <DefiScreen
          key={currentDefi}
          defi={DEFIS[currentDefi]}
          onComplete={handleComplete}
          onBack={() => setCurrentDefi(null)}
        />
      </AnimatePresence>
    );
  }

  // Carte principale — liste des défis
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #1a472a 0%, #2d5016 60%, #1b4332 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <Link to={createPageUrl('Home')}>
          <button className="w-9 h-9 rounded-full bg-black/30 border border-white/20 flex items-center justify-center mb-4">
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </button>
        </Link>
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">🌍</div>
          <h1 className="text-2xl font-black text-amber-300">Le Rallye des Éco-Sentinelles</h1>
          <p className="text-white/60 text-sm mt-1 max-w-xs mx-auto">
            Valide les 7 défis pour assembler le code secret du Coffre de la Planète !
          </p>
        </div>

        {/* Progression */}
        <div className="mt-4 p-3 rounded-2xl bg-black/25 border border-white/15">
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span>Progression</span>
            <span className="font-bold text-amber-300">{motsCles.length}/7 défis</span>
          </div>
          <div className="flex gap-1">
            {DEFIS.map((d, i) => (
              <div key={d.id} className={`flex-1 h-2 rounded-full transition-all ${i < motsCles.length ? 'bg-amber-400' : 'bg-white/15'}`} />
            ))}
          </div>
        </div>

        {/* Mots-clés collectés */}
        {motsCles.length > 0 && (
          <div className="mt-3 p-3 rounded-2xl bg-black/20 border border-amber-400/20">
            <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider mb-2">🗝️ Clés obtenues</p>
            <div className="flex flex-wrap gap-1.5">
              {motsCles.map((mk, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
                  {mk}
                </span>
              ))}
              {DEFIS.slice(motsCles.length).map((_, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/20 text-xs font-black">
                  ???
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Liste des défis */}
      <div className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
        {DEFIS.map((defi, i) => (
          <DefiCard
            key={defi.id}
            defi={defi}
            unlocked={i <= motsCles.length}
            completed={i < motsCles.length}
            motCle={motsCles[i]}
            onClick={() => setCurrentDefi(i)}
          />
        ))}
      </div>
    </div>
  );
}