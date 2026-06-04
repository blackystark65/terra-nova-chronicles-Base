import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Search, ChevronDown, ChevronUp, Image, Check, X } from 'lucide-react';
import { ECO_PAIRS_ALL, SECTEURS } from '../data/ecoPairsData';
import { base44 } from '@/api/base44Client';

const SECTEUR_COLORS = {
  maraichage:    'from-green-900 to-emerald-900',
  arboriculture: 'from-red-900 to-orange-900',
  viticulture:   'from-purple-900 to-violet-900',
  pepiniere:     'from-teal-900 to-cyan-900',
};

function photoKey(pairId, role) {
  return `${pairId}__${role}`;
}

// Composant prévisualisation d'image avec gestion d'erreur
function PhotoPreview({ url, fallbackEmoji, label }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [url]);

  if (!url) {
    return (
      <div className="w-20 h-20 rounded-xl bg-slate-700 flex flex-col items-center justify-center border border-white/10">
        <span className="text-2xl">{fallbackEmoji}</span>
        <span className="text-white/30 text-[9px] mt-1">Sans photo</span>
      </div>
    );
  }

  return (
    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-slate-700">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/50">
          <X className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-[9px] mt-1">URL invalide</span>
        </div>
      ) : (
        <img
          src={url}
          alt={label}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

// Éditeur d'une ligne (ravageur ou prédateur)
function PhotoEditor({ pairId, role, data, savedUrl, onSave }) {
  const [url, setUrl] = useState(savedUrl || data.photo || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUrl(savedUrl || data.photo || '');
  }, [savedUrl]);

  const handleSave = () => {
    onSave(pairId, role, url.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const label = data.nomFr || data.nom;
  const color = role === 'ravageur' ? 'red' : 'emerald';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-${color}-900/20 border border-${color}-500/20`}>
      <PhotoPreview url={url} fallbackEmoji={data.emoji} label={label} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-${color}-300 font-bold text-sm truncate`}>{label}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-${color}-500/20 text-${color}-400 border border-${color}-400/30`}>
            {role === 'ravageur' ? '🐛 Ravageur' : '🌿 Auxiliaire'}
          </span>
        </div>
        <p className="text-white/30 text-[10px] italic mb-2">{data.nomScientifique}</p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); setSaved(false); }}
            placeholder="https://... URL de la photo"
            className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-white/20 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handleSave}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 whitespace-nowrap
              ${saved ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
          >
            {saved ? <><Check className="w-3 h-3" /> Sauvé</> : <><Save className="w-3 h-3" /> Enregistrer</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// Carte d'une paire (collapsible)
function PairCard({ pair, savedPhotos, onSave }) {
  const [open, setOpen] = useState(false);
  const rvKey = photoKey(pair.id, 'ravageur');
  const prKey = photoKey(pair.id, 'predateur');
  const bothDone = !!savedPhotos[rvKey] && !!savedPhotos[prKey];

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-all"
      >
        <div className="flex -space-x-2 shrink-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-red-400/40 bg-slate-700 z-10">
            {(savedPhotos[rvKey] || pair.ravageur.photo) ? (
              <img src={savedPhotos[rvKey] || pair.ravageur.photo} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">{pair.ravageur.emoji}</div>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-emerald-400/40 bg-slate-700">
            {(savedPhotos[prKey] || pair.predateur.photo) ? (
              <img src={savedPhotos[prKey] || pair.predateur.photo} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">{pair.predateur.emoji}</div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-red-300 font-semibold text-sm truncate">{pair.ravageur.nomFr || pair.ravageur.nom}</span>
            <span className="text-white/20">→</span>
            <span className="text-emerald-300 font-semibold text-sm truncate">{pair.predateur.nomFr || pair.predateur.nom}</span>
          </div>
          <p className="text-white/30 text-[10px]">ID : {pair.id}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {bothDone && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[9px] font-bold border border-green-400/30">
              ✓ Complet
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
              <PhotoEditor pairId={pair.id} role="ravageur" data={pair.ravageur} savedUrl={savedPhotos[rvKey]} onSave={onSave} />
              <PhotoEditor pairId={pair.id} role="predateur" data={pair.predateur} savedUrl={savedPhotos[prKey]} onSave={onSave} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminEcoPairs() {
  const [savedPhotos, setSavedPhotos] = useState({});
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [secteurFilter, setSecteurFilter] = useState('all');
  const [showExport, setShowExport] = useState(false);

  const [migrating, setMigrating] = useState(false);
  const [localCount, setLocalCount] = useState(0);

  // Chargement depuis la DB au démarrage
  useEffect(() => {
    base44.entities.EcoPairsPhotos.list().then(records => {
      if (records.length > 0) {
        setRecordId(records[0].id);
        setSavedPhotos(records[0].photos || {});
      }
      setLoading(false);
    });
    // Vérifier si localStorage contient des photos
    try {
      const local = JSON.parse(localStorage.getItem('ecoPairsPhotos') || '{}');
      setLocalCount(Object.values(local).filter(v => v).length);
    } catch {}
  }, []);

  const handleMigrateFromLocalStorage = async () => {
    setMigrating(true);
    try {
      const local = JSON.parse(localStorage.getItem('ecoPairsPhotos') || '{}');
      const merged = { ...local, ...savedPhotos }; // DB a priorité
      if (recordId) {
        await base44.entities.EcoPairsPhotos.update(recordId, { photos: merged });
      } else {
        const created = await base44.entities.EcoPairsPhotos.create({ photos: merged });
        setRecordId(created.id);
      }
      setSavedPhotos(merged);
      setLocalCount(0);
      alert(`✅ Migration réussie ! ${Object.values(merged).filter(v => v).length} photos synchronisées.`);
    } catch (e) {
      alert('❌ Erreur lors de la migration : ' + e.message);
    }
    setMigrating(false);
  };

  const handleSave = async (pairId, role, url) => {
    const key = `${pairId}__${role}`;
    const updated = { ...savedPhotos, [key]: url };
    setSavedPhotos(updated);

    if (recordId) {
      await base44.entities.EcoPairsPhotos.update(recordId, { photos: updated });
    } else {
      const created = await base44.entities.EcoPairsPhotos.create({ photos: updated });
      setRecordId(created.id);
    }
  };

  const filtered = ECO_PAIRS_ALL.filter(pair => {
    const matchSecteur = secteurFilter === 'all' || pair.secteur === secteurFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      pair.ravageur.nom.toLowerCase().includes(q) ||
      pair.predateur.nom.toLowerCase().includes(q) ||
      pair.id.toLowerCase().includes(q);
    return matchSecteur && matchSearch;
  });

  const total = ECO_PAIRS_ALL.length * 2;
  const done = ECO_PAIRS_ALL.filter(p =>
    savedPhotos[`${p.id}__ravageur`] && savedPhotos[`${p.id}__predateur`]
  ).length * 2;

  const exportData = () => {
    const result = Object.fromEntries(Object.entries(savedPhotos).filter(([, v]) => v));
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ecoPairsPhotos.json';
    a.click();
  };

  const exportCode = () => {
    const lines = ['// Photos personnalisées pour ecoPairsData.js', ''];
    ECO_PAIRS_ALL.forEach(pair => {
      const rvUrl = savedPhotos[`${pair.id}__ravageur`];
      const prUrl = savedPhotos[`${pair.id}__predateur`];
      if (rvUrl || prUrl) {
        lines.push(`// --- ${pair.id} ---`);
        if (rvUrl) lines.push(`// ravageur.photo: '${rvUrl}'`);
        if (prUrl) lines.push(`// predateur.photo: '${prUrl}'`);
        lines.push('');
      }
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ecoPairsPhotos_code.txt';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white/70 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/MahjongEco">
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
              <ArrowLeft className="w-4 h-4 text-white/70" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-white font-black text-lg">📸 Photos Éco-Mahjong</h1>
            <p className="text-white/40 text-xs">Photos synchronisées sur tous les appareils</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-400 font-bold text-sm">{done}/{total}</p>
            <p className="text-white/30 text-[10px]">photos</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-2">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
          <select
            value={secteurFilter}
            onChange={e => setSecteurFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
          >
            <option value="all">Tous les secteurs</option>
            {Object.values(SECTEURS).map(s => (
              <option key={s.id} value={s.id}>{s.emoji} {s.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={exportData} className="flex-1 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all">
            ⬇️ Exporter JSON
          </button>
          <button onClick={exportCode} className="flex-1 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all">
            📋 Exporter Code
          </button>
          <button onClick={() => setShowExport(v => !v)} className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-xs font-bold transition-all">
            👁 Aperçu JSON
          </button>
        </div>

        <AnimatePresence>
          {showExport && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <pre className="p-3 rounded-xl bg-black/40 border border-white/10 text-green-400 text-[10px] overflow-auto max-h-48">
                {JSON.stringify(Object.fromEntries(Object.entries(savedPhotos).filter(([, v]) => v)), null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {localCount > 0 && (
          <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs">
            <p className="font-bold text-orange-300 mb-2">⚠️ {localCount} photos détectées dans le stockage local de CE navigateur (non synchronisées)</p>
            <button
              onClick={handleMigrateFromLocalStorage}
              disabled={migrating}
              className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm transition-all disabled:opacity-50"
            >
              {migrating ? '⏳ Migration en cours...' : '🔄 Migrer vers la base de données (synchroniser)'}
            </button>
          </div>
        )}

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200/80 text-xs leading-relaxed">
          <p className="font-bold text-amber-300 mb-1">💡 Comment ça marche ?</p>
          <p>1. Trouvez des photos sur <strong>Unsplash</strong>, <strong>Wikipedia</strong> ou toute autre source libre.</p>
          <p>2. Copiez l'URL directe de l'image.</p>
          <p>3. Collez l'URL et cliquez <strong>Enregistrer</strong> — la photo est synchronisée sur tous les appareils.</p>
        </div>

        {Object.entries(
          filtered.reduce((acc, pair) => {
            if (!acc[pair.secteur]) acc[pair.secteur] = [];
            acc[pair.secteur].push(pair);
            return acc;
          }, {})
        ).map(([secteurId, pairs]) => {
          const secteur = SECTEURS[secteurId];
          const bgClass = SECTEUR_COLORS[secteurId];
          return (
            <div key={secteurId}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${bgClass} mb-2`}>
                <span className="text-xl">{secteur.emoji}</span>
                <span className="text-white font-black">{secteur.nom}</span>
                <span className="ml-auto text-white/40 text-xs">{pairs.length} paires</span>
              </div>
              <div className="space-y-2">
                {pairs.map(pair => (
                  <PairCard key={pair.id} pair={pair} savedPhotos={savedPhotos} onSave={handleSave} />
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune paire trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}