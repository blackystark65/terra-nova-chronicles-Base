import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, RotateCcw, Lightbulb, Shuffle } from 'lucide-react';

// Paires ravageur <-> prédateur
const ECO_PAIRS = [
  { id: 'puceron',    ravageur: { emoji: '🐛', nom: 'Puceron' },      predateur: { emoji: '🐞', nom: 'Coccinelle' } },
  { id: 'limace',     ravageur: { emoji: '🐌', nom: 'Limace' },        predateur: { emoji: '🦔', nom: 'Hérisson' } },
  { id: 'chenille',   ravageur: { emoji: '🐛', nom: 'Chenille' },      predateur: { emoji: '🐦', nom: 'Mésange' } },
  { id: 'mouche',     ravageur: { emoji: '🪰', nom: 'Mouche' },        predateur: { emoji: '🕷️', nom: 'Araignée' } },
  { id: 'rat',        ravageur: { emoji: '🐀', nom: 'Rat' },           predateur: { emoji: '🦉', nom: 'Chouette' } },
  { id: 'sauterelle', ravageur: { emoji: '🦗', nom: 'Criquet' },       predateur: { emoji: '🦎', nom: 'Lézard' } },
  { id: 'taupe',      ravageur: { emoji: '🦫', nom: 'Campagnol' },     predateur: { emoji: '🦅', nom: 'Buse' } },
  { id: 'hanneton',   ravageur: { emoji: '🪲', nom: 'Hanneton' },      predateur: { emoji: '🦇', nom: 'Chauve-souris' } },
];

// Génère les tuiles du plateau (layout type Mahjong pyramidal)
// Chaque tuile : { id, pairId, type: 'ravageur'|'predateur', row, col, layer, blocked }
function buildLevel() {
  // On crée un layout en couches (layer 0 = bas, layer 2 = haut)
  // Couche 0 : 4x4 grille
  // Couche 1 : 3x3 au centre
  // Couche 2 : 2x2 au centre
  const placements = [
    // Couche 0 (16 tuiles)
    ...[0,1,2,3].flatMap(r => [0,1,2,3].map(c => ({ row: r, col: c, layer: 0 }))),
    // Couche 1 (9 tuiles)
    ...[0,1,2].flatMap(r => [0,1,2].map(c => ({ row: r + 0.5, col: c + 0.5, layer: 1 }))),
    // Couche 2 (4 tuiles)
    ...[0,1].flatMap(r => [0,1].map(c => ({ row: r + 1, col: c + 1, layer: 2 }))),
  ];
  // 29 emplacements → on prend 28 (14 paires)
  // On utilise 7 paires × 2 (ravageur + prédateur) × 2 exemplaires = 28 tuiles
  const tiles = [];
  let tid = 0;
  // 14 paires de tuiles (chaque paire eco répétée 2 fois)
  const pairList = [];
  for (let i = 0; i < 7; i++) {
    const pair = ECO_PAIRS[i % ECO_PAIRS.length];
    pairList.push({ pairId: pair.id, type: 'ravageur', data: pair.ravageur });
    pairList.push({ pairId: pair.id, type: 'predateur', data: pair.predateur });
    pairList.push({ pairId: pair.id, type: 'ravageur', data: pair.ravageur });
    pairList.push({ pairId: pair.id, type: 'predateur', data: pair.predateur });
  }
  // Mélange
  for (let i = pairList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairList[i], pairList[j]] = [pairList[j], pairList[i]];
  }

  const shuffledPlacements = [...placements].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(pairList.length, shuffledPlacements.length); i++) {
    const p = shuffledPlacements[i];
    const d = pairList[i];
    tiles.push({
      id: tid++,
      pairId: d.pairId,
      type: d.type,
      data: d.data,
      row: p.row,
      col: p.col,
      layer: p.layer,
      removed: false,
    });
  }
  return tiles;
}

function isBlocked(tile, allTiles) {
  if (tile.removed) return false;
  // Bloqué si une tuile est dessus (layer supérieur et chevauchement)
  const above = allTiles.filter(t =>
    !t.removed &&
    t.layer === tile.layer + 1 &&
    Math.abs(t.row - tile.row) < 1 &&
    Math.abs(t.col - tile.col) < 1
  );
  if (above.length > 0) return true;
  // Bloqué si tuiles à gauche ET à droite (libre si au moins un côté libre)
  const left = allTiles.filter(t =>
    !t.removed &&
    t.layer === tile.layer &&
    Math.abs(t.row - tile.row) < 1 &&
    t.col === tile.col - 1
  );
  const right = allTiles.filter(t =>
    !t.removed &&
    t.layer === tile.layer &&
    Math.abs(t.row - tile.row) < 1 &&
    t.col === tile.col + 1
  );
  return left.length > 0 && right.length > 0;
}

function isMatch(t1, t2) {
  return t1.pairId === t2.pairId && t1.type !== t2.type;
}

const TILE_W = 68;
const TILE_H = 80;
const LAYER_OFFSET = 5;

export default function MahjongEco() {
  const [tiles, setTiles] = useState(() => buildLevel());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(3);
  const [hintPair, setHintPair] = useState(null);
  const [shuffles, setShuffles] = useState(3);
  const [message, setMessage] = useState(null);
  const [won, setWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastMatch, setLastMatch] = useState(null); // { ravageur, predateur }

  const activeTiles = tiles.filter(t => !t.removed);

  const freeList = activeTiles.filter(t => !isBlocked(t, activeTiles));

  const showMessage = (msg, duration = 1800) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

  const handleTileClick = (tile) => {
    if (tile.removed) return;
    if (isBlocked(tile, activeTiles)) return;
    if (selected?.id === tile.id) { setSelected(null); return; }

    if (!selected) {
      setSelected(tile);
      return;
    }

    if (isMatch(selected, tile)) {
      const pair = ECO_PAIRS.find(p => p.id === tile.pairId);
      const newTiles = tiles.map(t =>
        t.id === selected.id || t.id === tile.id ? { ...t, removed: true } : t
      );
      setTiles(newTiles);
      setSelected(null);
      setHintPair(null);
      const newCombo = combo + 1;
      setCombo(newCombo);
      const pts = 100 * newCombo;
      setScore(s => s + pts);
      setLastMatch({ ravageur: pair.ravageur, predateur: pair.predateur });
      showMessage(`✅ ${pair.predateur.emoji} élimine le ${pair.ravageur.nom} ! +${pts} pts`, 2000);

      const remaining = newTiles.filter(t => !t.removed);
      if (remaining.length === 0) setWon(true);
    } else {
      setCombo(0);
      showMessage('❌ Ce n\'est pas le bon prédateur !', 1200);
      setSelected(tile);
    }
  };

  const handleHint = () => {
    if (hints <= 0) return;
    setHints(h => h - 1);
    // Trouve une paire libre
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
    // Re-mélange les données des tuiles actives en gardant les positions
    const active = tiles.filter(t => !t.removed);
    const data = active.map(t => ({ pairId: t.pairId, type: t.type, data: t.data }));
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
    const newTiles = tiles.map(t => {
      if (t.removed) return t;
      const idx = active.findIndex(a => a.id === t.id);
      return { ...t, ...data[idx] };
    });
    setTiles(newTiles);
    setSelected(null);
    setHintPair(null);
    showMessage('🔀 Tuiles mélangées !', 1500);
  };

  const handleRestart = () => {
    setTiles(buildLevel());
    setSelected(null);
    setScore(0);
    setHints(3);
    setShuffles(3);
    setCombo(0);
    setHintPair(null);
    setWon(false);
    setLastMatch(null);
  };

  // Calcul dimensions du plateau
  const maxRow = Math.max(...tiles.map(t => t.row)) + 1;
  const maxCol = Math.max(...tiles.map(t => t.col)) + 1;
  const boardW = (maxCol + 1) * TILE_W + 40;
  const boardH = (maxRow + 1) * TILE_H + 40;

  const sortedTiles = [...tiles].sort((a, b) => a.layer - b.layer || a.row - b.row || a.col - b.col);

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #1b4332 100%)' }}>
      {/* Header */}
      <div className="w-full max-w-lg px-4 pt-4 pb-2 flex items-center justify-between">
        <Link to={createPageUrl('Home')}>
          <button className="w-10 h-10 rounded-full bg-amber-800/80 flex items-center justify-center shadow-lg">
            <ArrowLeft className="w-5 h-5 text-amber-200" />
          </button>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-amber-300" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>🌿 Éco-Mahjong</h1>
          <p className="text-amber-200/70 text-xs">Associe prédateur & ravageur</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-amber-800/80 flex items-center justify-center shadow-lg">
          <span className="text-amber-200 font-black text-sm">{score}</span>
        </div>
      </div>

      {/* Score & combo */}
      <div className="flex gap-4 mb-2">
        <div className="px-4 py-1.5 rounded-full bg-black/30 border border-amber-500/30">
          <span className="text-amber-300 text-sm font-bold">Score : {score}</span>
        </div>
        {combo > 1 && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-orange-500/30 border border-orange-400/50"
          >
            <span className="text-orange-300 text-sm font-bold">🔥 Combo ×{combo}</span>
          </motion.div>
        )}
      </div>

      {/* Dernier match */}
      <AnimatePresence>
        {lastMatch && (
          <motion.div
            key={lastMatch.predateur.nom + lastMatch.ravageur.nom}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-2 px-5 py-2 rounded-2xl bg-emerald-900/60 border border-emerald-400/30 text-center"
          >
            <span className="text-emerald-200 text-sm">
              {lastMatch.predateur.emoji} <span className="font-bold text-emerald-300">{lastMatch.predateur.nom}</span>
              <span className="text-white/50 mx-2">mange le</span>
              {lastMatch.ravageur.emoji} <span className="font-bold text-red-300">{lastMatch.ravageur.nom}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message flash */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-3 rounded-2xl bg-black/80 backdrop-blur-sm border border-white/20 text-white font-bold text-lg text-center shadow-2xl"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plateau de jeu */}
      <div className="flex-1 flex items-center justify-center w-full px-2 overflow-auto">
        <div
          className="relative"
          style={{ width: boardW, height: boardH }}
        >
          {sortedTiles.map(tile => {
            if (tile.removed) return null;
            const blocked = isBlocked(tile, activeTiles);
            const isSelected = selected?.id === tile.id;
            const isHinted = hintPair?.includes(tile.id);
            const x = tile.col * TILE_W + tile.layer * LAYER_OFFSET + 20;
            const y = tile.row * TILE_H - tile.layer * LAYER_OFFSET + 20;

            return (
              <motion.div
                key={tile.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: blocked ? 0.55 : 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleTileClick(tile)}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: TILE_W - 4,
                  height: TILE_H - 4,
                  zIndex: tile.layer * 10 + (isSelected ? 100 : 0),
                  cursor: blocked ? 'not-allowed' : 'pointer',
                }}
              >
                <div
                  className={`
                    w-full h-full rounded-xl flex flex-col items-center justify-center gap-1
                    border-2 shadow-lg transition-all duration-150 select-none
                    ${blocked
                      ? 'bg-slate-600/80 border-slate-500/50'
                      : isSelected
                        ? 'bg-yellow-200 border-yellow-400 shadow-yellow-400/50 shadow-xl scale-105'
                        : isHinted
                          ? 'bg-cyan-100 border-cyan-400 shadow-cyan-400/50 shadow-xl animate-pulse'
                          : tile.type === 'ravageur'
                            ? 'bg-red-50 border-red-300 hover:bg-red-100'
                            : 'bg-green-50 border-green-400 hover:bg-green-100'
                    }
                  `}
                >
                  {/* Ombre 3D */}
                  {!blocked && (
                    <div className="absolute inset-0 rounded-xl"
                      style={{ boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(0,0,0,0.15)' }}
                    />
                  )}
                  <span className="text-2xl relative z-10">{tile.data.emoji}</span>
                  <span className={`text-[9px] font-bold relative z-10 px-1 text-center leading-tight
                    ${tile.type === 'ravageur' ? 'text-red-600' : 'text-green-700'}
                    ${blocked ? 'text-slate-400' : ''}
                  `}>
                    {tile.data.nom}
                  </span>
                  {tile.type === 'ravageur' && !blocked && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400" />
                  )}
                  {tile.type === 'predateur' && !blocked && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="flex gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-red-200">Ravageur</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-green-200">Prédateur naturel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-500 opacity-60" />
          <span className="text-slate-300">Bloqué</span>
        </div>
      </div>

      {/* Boutons actions */}
      <div className="flex gap-4 pb-6">
        <button onClick={handleShuffle} disabled={shuffles <= 0}
          className="flex flex-col items-center gap-1 disabled:opacity-40 touch-manipulation">
          <div className="w-14 h-14 rounded-full bg-amber-800/80 border-2 border-amber-600/50 flex items-center justify-center shadow-lg relative">
            <Shuffle className="w-6 h-6 text-amber-200" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">{shuffles}</span>
          </div>
          <span className="text-amber-300/70 text-xs">Mélanger</span>
        </button>

        <button onClick={handleHint} disabled={hints <= 0}
          className="flex flex-col items-center gap-1 disabled:opacity-40 touch-manipulation">
          <div className="w-14 h-14 rounded-full bg-amber-800/80 border-2 border-amber-600/50 flex items-center justify-center shadow-lg relative">
            <Lightbulb className="w-6 h-6 text-yellow-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">{hints}</span>
          </div>
          <span className="text-amber-300/70 text-xs">Indice</span>
        </button>

        <button onClick={handleRestart}
          className="flex flex-col items-center gap-1 touch-manipulation">
          <div className="w-14 h-14 rounded-full bg-amber-800/80 border-2 border-amber-600/50 flex items-center justify-center shadow-lg">
            <RotateCcw className="w-6 h-6 text-amber-200" />
          </div>
          <span className="text-amber-300/70 text-xs">Rejouer</span>
        </button>
      </div>

      {/* Modal victoire */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl border border-emerald-400/30 p-8 text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">🌿🏆🌿</div>
              <h2 className="text-3xl font-black text-amber-300 mb-2">Bravo !</h2>
              <p className="text-emerald-200 mb-2">Tu as trouvé tous les prédateurs naturels !</p>
              <p className="text-4xl font-black text-yellow-300 mb-6">{score} pts</p>

              <div className="mb-6 p-4 rounded-2xl bg-black/30 text-left space-y-2">
                <p className="text-emerald-300 font-bold text-sm mb-2">🔬 Les duos de la nature :</p>
                {ECO_PAIRS.slice(0, 7).map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-sm">
                    <span>{p.predateur.emoji}</span>
                    <span className="text-green-300 font-semibold">{p.predateur.nom}</span>
                    <span className="text-white/40 text-xs">→ élimine →</span>
                    <span>{p.ravageur.emoji}</span>
                    <span className="text-red-300">{p.ravageur.nom}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleRestart}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg shadow-lg">
                🔄 Rejouer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}