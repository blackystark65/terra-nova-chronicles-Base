import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, RotateCcw, Lightbulb, Shuffle, BookOpen } from 'lucide-react';
import { SECTEURS, ECO_PAIRS_ALL, getPairsBySecteur } from '../data/ecoPairsData';
import PaireFicheDetail from '../components/mahjong/PaireFicheDetail';
import { base44 } from '@/api/base44Client';

// Enrichit les paires avec les photos sauvegardées (depuis DB)
function enrichPairsWithPhotos(pairs, savedPhotos) {
  return pairs.map(pair => ({
    ...pair,
    ravageur: {
      ...pair.ravageur,
      photo: savedPhotos[`${pair.id}__ravageur`] || pair.ravageur.photo,
    },
    predateur: {
      ...pair.predateur,
      photo: savedPhotos[`${pair.id}__predateur`] || pair.predateur.photo,
    },
  }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Grille simple en rangées : toutes les tuiles sont sur le même layer (layer=0)
// Seules les tuiles tout à gauche ou tout à droite de leur rangée sont libres
// OU on utilise un layout en grille ouverte où chaque tuile n'a qu'une tuile à gauche max
function buildLevel(pairs) {
  // On prend jusqu'à 8 paires (16 tuiles ravageur+prédateur = 16 cases)
  const selected = shuffle([...pairs]).slice(0, 8);

  // Liste de tiles : pour chaque paire, 1 ravageur + 1 prédateur
  const pairTiles = [];
  selected.forEach(pair => {
    pairTiles.push({ pairId: pair.id, type: 'ravageur', data: pair.ravageur });
    pairTiles.push({ pairId: pair.id, type: 'predateur', data: pair.predateur });
  });

  // Mélanger puis placer en grille 4 colonnes × N rangées, layer=0
  // Toutes les tuiles sont accessibles (pas de blocage par dessus)
  // Seules les tuiles encadrées gauche+droite sont bloquées => on veut éviter ça
  // Solution: layout en 2 colonnes séparées (gauche = ravageurs, droite = prédateurs)
  // Mais mélangé, pour que le joueur doive les trouver
  const shuffled = shuffle(pairTiles);

  // 4 colonnes, chaque tuile accessible (pas de layer au-dessus)
  const tiles = shuffled.map((d, i) => ({
    id: i,
    pairId: d.pairId,
    type: d.type,
    data: d.data,
    row: Math.floor(i / COLS),
    col: i % COLS,
    layer: 0,
    removed: false,
  }));

  return tiles;
}

// Avec un layout en grille pure layer=0, isBlocked vérifie col-1 ET col+1
// Pour garantir qu'il y a toujours des tuiles accessibles : les tuiles en col 0 et col 3 sont toujours libres

// Dans notre grille plate (layer=0), aucune tuile n'est bloquée par dessus.
// On considère une tuile bloquée uniquement si elle a une tuile directement à gauche ET à droite
// sur la même rangée (même row, même layer).
function isBlocked(tile, allTiles) {
  if (tile.removed) return false;
  const sameRow = allTiles.filter(t => !t.removed && t.layer === tile.layer && t.row === tile.row && t.id !== tile.id);
  const hasLeft  = sameRow.some(t => t.col === tile.col - 1);
  const hasRight = sameRow.some(t => t.col === tile.col + 1);
  return hasLeft && hasRight;
}

function hasPairAvailable(allTiles) {
  const free = allTiles.filter(t => !t.removed && !isBlocked(t, allTiles));
  for (const t1 of free) {
    if (free.some(t2 => t2.id !== t1.id && t2.pairId === t1.pairId && t2.type !== t1.type)) return true;
  }
  return false;
}

// Remélange les données des tuiles actives pour débloquer la situation
function reshuffleTileData(tiles) {
  const active = tiles.filter(t => !t.removed);
  const data = shuffle(active.map(t => ({ pairId: t.pairId, type: t.type, data: t.data })));
  return tiles.map(t => {
    if (t.removed) return t;
    const idx = active.findIndex(a => a.id === t.id);
    return { ...t, ...data[idx] };
  });
}

function isMatch(t1, t2) {
  return t1.pairId === t2.pairId && t1.type !== t2.type;
}

// Taille des tuiles adaptée dynamiquement à l'écran (voir getTileSize)
const COLS = 4;
const LAYER_OFFSET = 5;

const SECTEUR_COLORS = {
  maraichage:    { bg: 'from-green-900 to-emerald-900',   btn: 'bg-green-600 hover:bg-green-500',   badge: 'bg-green-500/20 text-green-300 border-green-400/30' },
  arboriculture: { bg: 'from-red-900 to-orange-900',      btn: 'bg-red-600 hover:bg-red-500',       badge: 'bg-red-500/20 text-red-300 border-red-400/30' },
  viticulture:   { bg: 'from-purple-900 to-violet-900',   btn: 'bg-purple-600 hover:bg-purple-500', badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30' },
  pepiniere:     { bg: 'from-teal-900 to-cyan-900',       btn: 'bg-teal-600 hover:bg-teal-500',     badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30' },
};

// PaireFiche est maintenant importée comme PaireFicheDetail

// ─── ÉCRAN DE SÉLECTION DE SECTEUR ───────────────────────────────────────────
function SecteurSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 60%, #1b4332 100%)' }}>
      <Link to={createPageUrl('Home')} className="absolute top-4 left-4">
        <button className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center border border-white/20">
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
      </Link>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="text-6xl mb-3">🌿</div>
        <h1 className="text-4xl font-black text-amber-300 mb-2" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>Éco-Mahjong</h1>
        <p className="text-emerald-200/80 text-sm max-w-xs mx-auto">
          Associe chaque ravageur à son prédateur naturel pour débloquer le plateau !
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
        {Object.values(SECTEURS).map((s, i) => {
          const colors = SECTEUR_COLORS[s.id];
          const count = ECO_PAIRS_ALL.filter(p => p.secteur === s.id).length;
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(s.id)}
              className={`p-5 rounded-2xl border border-white/10 text-left shadow-xl ${colors.btn} transition-all`}
            >
              <div className="text-4xl mb-2">{s.emoji}</div>
              <div className="text-white font-black text-base leading-tight">{s.nom}</div>
              <div className="text-white/60 text-xs mt-1">{s.description}</div>
              <div className="mt-2 text-white/40 text-xs">{count} duos</div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => onSelect('all')}
        className="w-full max-w-sm py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-lg shadow-xl border border-amber-400/30 transition-all"
      >
        🌍 Tous les secteurs
      </motion.button>

      <p className="text-white/30 text-xs mt-4 text-center max-w-xs">
        {ECO_PAIRS_ALL.length} duos ravageur/auxiliaire au total
      </p>
    </div>
  );
}

// Calcule la taille des tuiles selon la largeur de l'écran
function getTileSize() {
  const screenW = window.innerWidth;
  const padding = 32; // px de marge totale
  const gap = 8 * (COLS - 1); // espaces entre tuiles
  const tileW = Math.floor((Math.min(screenW, 600) - padding - gap) / COLS);
  const tileH = Math.floor(tileW * 1.22);
  return { tileW, tileH };
}

// ─── JEU PRINCIPAL ────────────────────────────────────────────────────────────
function GameBoard({ secteurId, savedPhotos, onBack }) {
  const secteur = secteurId === 'all' ? null : SECTEURS[secteurId];
  const colors = SECTEUR_COLORS[secteurId] || SECTEUR_COLORS.maraichage;

  const pairs = useMemo(() => {
    const raw = secteurId === 'all' ? ECO_PAIRS_ALL : getPairsBySecteur(secteurId);
    return enrichPairsWithPhotos(shuffle(raw), savedPhotos);
  }, [secteurId, savedPhotos]);

  const [tiles, setTiles] = useState(() => buildLevel(pairs));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(5);
  const [hintPair, setHintPair] = useState(null);
  const [shuffles, setShuffles] = useState(5);
  const [message, setMessage] = useState(null);
  const [won, setWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastMatch, setLastMatch] = useState(null);
  const [fichePair, setFichePair] = useState(null);
  const [wonPairs, setWonPairs] = useState([]);
  const [tileSize, setTileSize] = useState(getTileSize);

  // Responsive: recalculer à chaque resize
  useEffect(() => {
    const onResize = () => setTileSize(getTileSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const TILE_W = tileSize.tileW + 8; // inclure gap
  const TILE_H = tileSize.tileH + 8;

  // Détection deadlock : aucune paire libre → auto-shuffle silencieux
  useEffect(() => {
    if (won || tiles.filter(t => !t.removed).length === 0) return;
    if (!hasPairAvailable(tiles)) {
      const timer = setTimeout(() => {
        setTiles(t => reshuffleTileData(t));
        setSelected(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [tiles, won]);

  const activeTiles = tiles.filter(t => !t.removed);
  const freeList = activeTiles.filter(t => !isBlocked(t, activeTiles));

  const showMessage = (msg, duration = 1800) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

  const handleTileClick = (tile) => {
    if (tile.removed || isBlocked(tile, activeTiles)) return;
    if (selected?.id === tile.id) { setSelected(null); return; }

    if (!selected) { setSelected(tile); return; }

    if (isMatch(selected, tile)) {
      const pair = pairs.find(p => p.id === tile.pairId);
      let newTiles = tiles.map(t =>
        t.id === selected.id || t.id === tile.id ? { ...t, removed: true } : t
      );
      setSelected(null);
      setHintPair(null);
      const newCombo = combo + 1;
      setCombo(newCombo);
      const pts = 100 * newCombo;
      setScore(s => s + pts);
      setLastMatch(pair);
      setWonPairs(prev => [...prev, pair]);

      const remaining = newTiles.filter(t => !t.removed);
      if (remaining.length === 0) {
        setTiles(newTiles);
        setWon(true);
        return;
      }

      // Auto-remélange si aucune paire accessible après le match
      if (!hasPairAvailable(newTiles)) {
        newTiles = reshuffleTileData(newTiles);
        showMessage(`✅ +${pts} pts — 🔀 Mélange auto !`, 2000);
      } else {
        showMessage(`✅ ${pair.predateur.emoji} élimine le ${pair.ravageur.nom} ! +${pts} pts`, 2000);
      }
      setTiles(newTiles);
    } else {
      setCombo(0);
      // Clear selection immediately so both tiles visually deselect — no ambiguous state
      setSelected(null);
      setMessage(null);
      setTimeout(() => showMessage('❌ Ce n\'est pas le bon auxiliaire !', 1400), 0);
    }
  };

  const handleHint = () => {
    if (hints <= 0) return;
    setHints(h => h - 1);
    for (const t1 of freeList) {
      const t2 = freeList.find(t => t.id !== t1.id && isMatch(t1, t));
      if (t2) { setHintPair([t1.id, t2.id]); setTimeout(() => setHintPair(null), 2500); return; }
    }
    showMessage('Aucune paire disponible !', 1500);
  };

  const handleShuffle = () => {
    if (shuffles <= 0) return;
    setShuffles(s => s - 1);
    setCombo(0);
    setTiles(t => reshuffleTileData(t));
    setSelected(null);
    setHintPair(null);
    showMessage('🔀 Tuiles mélangées !', 1500);
  };

  const handleRestart = () => {
    setTiles(buildLevel(pairs));
    setSelected(null);
    setScore(0);
    setHints(5);
    setShuffles(5);
    setCombo(0);
    setHintPair(null);
    setWon(false);
    setLastMatch(null);
    setWonPairs([]);
  };

  const maxRow = Math.max(...tiles.map(t => t.row)) + 1;
  const maxCol = Math.max(...tiles.map(t => t.col)) + 1;
  const boardW = maxCol * (tileSize.tileW + 8);
  const boardH = maxRow * (tileSize.tileH + 8) + 16;
  const sortedTiles = [...tiles].sort((a, b) => a.layer - b.layer || a.row - b.row || a.col - b.col);

  const bgClass = colors.bg;

  return (
    <div className={`min-h-screen flex flex-col items-center bg-gradient-to-br ${bgClass}`}>
      {/* Header */}
      <div className="w-full max-w-lg px-4 pt-4 pb-2 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/30 border border-white/20 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black text-amber-300">🌿 Éco-Mahjong</h1>
          <p className="text-white/50 text-xs">{secteur ? `${secteur.emoji} ${secteur.nom}` : '🌍 Tous secteurs'}</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-black/30 border border-white/20">
          <span className="text-amber-300 font-black text-sm">{score} pts</span>
        </div>
      </div>

      {/* Combo */}
      {combo > 1 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="mb-1 px-4 py-1 rounded-full bg-orange-500/30 border border-orange-400/50">
          <span className="text-orange-300 text-sm font-bold">🔥 Combo ×{combo}</span>
        </motion.div>
      )}

      {/* Dernier match */}
      <AnimatePresence>
        {lastMatch && (
          <motion.div
            key={lastMatch.id}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-1 px-4 py-1.5 rounded-xl bg-black/30 border border-white/10 text-center flex items-center gap-2"
          >
            <span className="text-sm">{lastMatch.predateur.emoji}</span>
            <span className="text-green-300 font-bold text-xs">{lastMatch.predateur.nom}</span>
            <span className="text-white/30 text-xs">→</span>
            <span className="text-sm">{lastMatch.ravageur.emoji}</span>
            <span className="text-red-300 text-xs">{lastMatch.ravageur.nom}</span>
            <button onClick={() => setFichePair(lastMatch)} className="ml-1 p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              <BookOpen className="w-3 h-3 text-white/60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message flash */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 px-6 py-3 rounded-2xl bg-black/85 backdrop-blur-sm border border-white/20 text-white font-bold text-base text-center shadow-2xl pointer-events-none"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plateau */}
      <div className="flex-1 flex items-center justify-center w-full px-4 py-2 overflow-auto">
        <div className="relative" style={{ width: boardW, height: boardH }}>
          {sortedTiles.map(tile => {
            if (tile.removed) return null;
            const blocked = isBlocked(tile, activeTiles);
            const isSelected = selected?.id === tile.id;
            const isHinted = hintPair?.includes(tile.id);
            const tw = tileSize.tileW;
            const th = tileSize.tileH;
            const x = tile.col * (tw + 8) + tile.layer * LAYER_OFFSET;
            const y = tile.row * (th + 8) - tile.layer * LAYER_OFFSET;
            // Taille du texte adaptée à la largeur de la tuile
            const nameFontSize = tw < 80 ? '9px' : tw < 100 ? '11px' : '13px';
            const maxChars = tw < 80 ? 9 : tw < 100 ? 12 : 15;

            return (
              <motion.div
                key={tile.id}
                animate={{ scale: 1, opacity: blocked ? 0.5 : 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleTileClick(tile)}
                style={{
                  position: 'absolute', left: x, top: y,
                  width: tw, height: th,
                  zIndex: tile.layer * 10 + (isSelected ? 100 : 0),
                  cursor: blocked ? 'not-allowed' : 'pointer',
                }}
              >
                <div className={`
                  w-full h-full rounded-xl flex flex-col items-stretch
                  border-2 shadow-lg transition-all duration-150 select-none relative overflow-hidden
                  ${blocked
                    ? 'bg-slate-700/70 border-slate-600/40'
                    : isSelected
                      ? 'bg-yellow-50 border-yellow-400 shadow-yellow-400/50 shadow-xl'
                      : isHinted
                        ? 'bg-cyan-50 border-cyan-400 shadow-cyan-400/60 shadow-xl animate-pulse'
                        : tile.type === 'ravageur'
                          ? 'bg-red-50 border-red-300 hover:bg-red-100 active:scale-95'
                          : 'bg-emerald-50 border-emerald-400 hover:bg-emerald-100 active:scale-95'
                  }
                `}>
                  {/* Photo en haut */}
                  <div className="flex-1 relative overflow-hidden rounded-t-xl">
                    {blocked ? (
                      <div className="w-full h-full bg-slate-600/50 flex items-center justify-center">
                        <span className="text-xl">🔒</span>
                      </div>
                    ) : tile.data.photo ? (
                      <img
                        src={tile.data.photo}
                        alt={tile.data.nomFr}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                      />
                    ) : null}
                    {!blocked && (
                      <div className="w-full h-full hidden items-center justify-center bg-slate-200">
                        <span style={{ fontSize: tw < 80 ? '1.5rem' : '2rem' }}>{tile.data.emoji}</span>
                      </div>
                    )}
                  </div>
                  {/* Noms en bas */}
                  {!blocked && (
                    <div className={`px-1 py-1 text-center border-t ${tile.type === 'ravageur' ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
                      <div style={{ fontSize: nameFontSize }} className={`font-bold leading-tight ${tile.type === 'ravageur' ? 'text-red-700' : 'text-emerald-800'}`}>
                        {tile.data.nomFr.length > maxChars ? tile.data.nomFr.slice(0, maxChars - 1) + '…' : tile.data.nomFr}
                      </div>
                    </div>
                  )}
                  {/* Point couleur type */}
                  {!blocked && (
                    <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${tile.type === 'ravageur' ? 'bg-red-400' : 'bg-emerald-500'}`} />
                  )}
                  {/* Indicateur parasitoïde */}
                  {!blocked && tile.type === 'predateur' && tile.data.type === 'parasitoide' && (
                    <div className="absolute top-1 left-1 text-[9px] text-violet-500 font-bold">🔬</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="flex gap-3 mb-2 text-xs flex-wrap justify-center px-4">
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><span className="text-red-200">Ravageur</span></div>
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-emerald-200">Prédateur</span></div>
        <div className="flex items-center gap-1"><span className="text-violet-300">🔬</span><span className="text-violet-200">Parasitoïde</span></div>
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-slate-500 opacity-60" /><span className="text-slate-300">Bloqué</span></div>
      </div>

      {/* Boutons actions */}
      <div className="flex gap-4 pb-5">
        {[
          { icon: <Shuffle className="w-6 h-6 text-amber-200" />, count: shuffles, label: 'Mélanger', action: handleShuffle },
          { icon: <Lightbulb className="w-6 h-6 text-yellow-300" />, count: hints, label: 'Indice', action: handleHint },
          { icon: <RotateCcw className="w-6 h-6 text-amber-200" />, count: null, label: 'Rejouer', action: handleRestart },
        ].map((btn, i) => (
          <button key={i} onClick={btn.action} disabled={btn.count === 0}
            className="flex flex-col items-center gap-1 disabled:opacity-40 touch-manipulation">
            <div className="w-14 h-14 rounded-full bg-black/40 border-2 border-white/20 flex items-center justify-center shadow-lg relative">
              {btn.icon}
              {btn.count !== null && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">{btn.count}</span>
              )}
            </div>
            <span className="text-white/50 text-xs">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Fiche paire détaillée */}
      <AnimatePresence>
        {fichePair && <PaireFicheDetail pair={fichePair} onClose={() => setFichePair(null)} />}
      </AnimatePresence>

      {/* Modal victoire */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl border border-emerald-400/20 p-6 text-center shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="text-5xl mb-3">🌿🏆🌿</div>
              <h2 className="text-3xl font-black text-amber-300 mb-1">Bravo !</h2>
              <p className="text-emerald-200/80 text-sm mb-2">Tu as trouvé tous les auxiliaires naturels !</p>
              <p className="text-4xl font-black text-yellow-300 mb-4">{score} pts</p>

              <div className="mb-4 p-3 rounded-2xl bg-black/30 text-left space-y-2">
                <p className="text-emerald-300 font-bold text-xs mb-2 uppercase tracking-wider">🔬 Les duos découverts — clique pour en savoir plus :</p>
                {wonPairs.map(p => (
                  <button key={p.id} onClick={() => setFichePair(p)}
                    className="w-full flex items-center gap-2 text-xs hover:bg-white/10 active:bg-white/15 rounded-xl p-2.5 transition-all text-left border border-white/5 hover:border-white/20 group">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-red-900/50 border border-red-500/30 shrink-0">
                      {p.ravageur.photo ? <img src={p.ravageur.photo} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center">{p.ravageur.emoji}</span>}
                    </div>
                    <span className="text-red-300 font-semibold truncate">{p.ravageur.nomFr || p.ravageur.nom}</span>
                    <span className="text-white/30 shrink-0">→</span>
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-emerald-900/50 border border-emerald-500/30 shrink-0">
                      {p.predateur.photo ? <img src={p.predateur.photo} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center">{p.predateur.emoji}</span>}
                    </div>
                    <span className="text-emerald-300 font-semibold truncate flex-1">{p.predateur.nomFr || p.predateur.nom}</span>
                    <div className="shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center group-hover:bg-amber-500/40 transition-all">
                      <span className="text-amber-400 text-[10px] font-black">ℹ</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={handleRestart}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-lg">
                  🔄 Rejouer
                </button>
                <button onClick={onBack}
                  className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-black border border-white/20">
                  ← Secteurs
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function MahjongEco() {
  const [secteur, setSecteur] = useState(null);
  const [savedPhotos, setSavedPhotos] = useState(null);

  useEffect(() => {
    base44.entities.EcoPairsPhotos.list().then(records => {
      setSavedPhotos(records.length > 0 ? (records[0].photos || {}) : {});
    }).catch(() => setSavedPhotos({}));
  }, []);

  if (savedPhotos === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 60%, #1b4332 100%)' }}>
        <div className="w-10 h-10 border-4 border-white/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!secteur) return <SecteurSelector onSelect={setSecteur} />;
  return <GameBoard key={secteur} secteurId={secteur} savedPhotos={savedPhotos} onBack={() => setSecteur(null)} />;
}