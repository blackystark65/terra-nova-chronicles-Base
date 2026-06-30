import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Camera, CheckCircle, Lock } from 'lucide-react';
import { RALLYE_DEFIS, RALLYE_TEAMS, calcRallyeScore } from '@/data/rallyeData';

// Identité élève stockée en localStorage
const STORAGE_KEY = 'tn_rallye_eleve_identity';
export function getRallyeEleveIdentity() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function setRallyeEleveIdentity(eleve) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eleve));
}

// ─── JOIN SCREEN ──────────────────────────────────────────────────────────────
export function RallyeStudentJoin({ sessions, onJoined }) {
  const qc = useQueryClient();
  const [step, setStep] = useState('identity');
  const [identityMode, setIdentityMode] = useState('numero');
  const [numeroInput, setNumeroInput] = useState('');
  const [prenomInput, setPrenomInput] = useState('');
  const [nomInput, setNomInput] = useState('');
  const [eleveFound, setEleveFound] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdentify = async () => {
    setError(''); setLoading(true);
    try {
      let results = [];
      if (identityMode === 'numero') {
        const num = numeroInput.trim().toUpperCase();
        results = await base44.entities.Eleve.filter({ numero: num });
      } else {
        const allEleves = await base44.entities.Eleve.list('-created_date', 500);
        results = allEleves.filter(e =>
          e.prenom?.toLowerCase() === prenomInput.trim().toLowerCase() &&
          e.nom?.toLowerCase() === nomInput.trim().toLowerCase()
        );
      }
      if (!results || results.length === 0) {
        setError("Élève non trouvé. Vérifiez votre numéro ou nom/prénom avec votre enseignant(e).");
        setLoading(false); return;
      }
      const eleve = results[0];
      setRallyeEleveIdentity(eleve);
      setEleveFound(eleve);
      setStep('team');
    } catch {
      setError("Erreur de connexion. Réessayez.");
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    setError(''); setLoading(true);
    const codeUp = code.toUpperCase().trim();
    const eleve = eleveFound;
    let foundSession = null, foundTeam = null;
    for (const session of sessions) {
      if (session.status !== 'en_cours') continue;
      if (session.code_team1 === codeUp) { foundSession = session; foundTeam = 'team1'; break; }
      if (session.code_team2 === codeUp) { foundSession = session; foundTeam = 'team2'; break; }
    }
    if (!foundSession) { setError('Code invalide ou session terminée.'); setLoading(false); return; }

    const key = `members_${foundTeam}`;
    const allMembers = [...(foundSession.members_team1 || []), ...(foundSession.members_team2 || [])];
    if (allMembers.some(m => m.eleve_numero === eleve.numero)) {
      setError('Vous êtes déjà inscrit dans cette session.');
      setLoading(false); return;
    }
    const newMember = {
      eleve_id: eleve.id,
      eleve_numero: eleve.numero,
      user_name: `${eleve.prenom} ${eleve.nom}`,
    };
    await base44.entities.RallyeSession.update(foundSession.id, {
      [key]: [...(foundSession[key] || []), newMember]
    });
    qc.invalidateQueries(['rallye-sessions']);
    onJoined?.({ session: foundSession, team: foundTeam, eleve });
    setLoading(false);
  };

  if (step === 'identity') return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🎒</div>
        <h2 className="text-2xl font-black text-white mb-1">Qui es-tu ?</h2>
        <p className="text-white/50 text-sm">Identifie-toi pour rejoindre le Rallye</p>
      </div>
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => { setIdentityMode('numero'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${identityMode === 'numero' ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
            🔢 Mon numéro
          </button>
          <button onClick={() => { setIdentityMode('nom'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${identityMode === 'nom' ? 'bg-blue-500/20 border-blue-400/50 text-blue-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
            👤 Mon nom
          </button>
        </div>

        {identityMode === 'numero' ? (
          <div>
            <label className="text-white/60 text-xs mb-1 block">Numéro élève (sur ta carte ou liste de classe)</label>
            <input value={numeroInput} onChange={e => { setNumeroInput(e.target.value.toUpperCase()); setError(''); }}
              placeholder="TN-G042 ou TN-F017"
              className="w-full text-center text-xl font-black tracking-widest rounded-xl bg-black/30 border border-white/20 text-white px-4 py-4 focus:outline-none focus:border-emerald-400/50 uppercase"
              autoCapitalize="characters" />
          </div>
        ) : (
          <div className="space-y-3">
            <input value={prenomInput} onChange={e => { setPrenomInput(e.target.value); setError(''); }}
              placeholder="Ton prénom"
              className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none" />
            <input value={nomInput} onChange={e => { setNomInput(e.target.value); setError(''); }}
              placeholder="Ton nom de famille"
              className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none" />
          </div>
        )}

        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm text-center">⚠️ {error}</div>}

        <button onClick={handleIdentify}
          disabled={loading || (identityMode === 'numero' ? numeroInput.length < 5 : !prenomInput.trim() || !nomInput.trim())}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black disabled:opacity-40 transition-all">
          {loading ? '⏳ Recherche…' : '✅ Continuer'}
        </button>
      </div>
      <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/5 text-white/30 text-xs text-center">
        Tu ne te souviens pas de ton numéro ? Demande à ton enseignant(e). Les garçons ont TN-G…, les filles TN-F…
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔑</div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 mb-3">
          <span className="text-emerald-300 font-bold text-sm">👤 {eleveFound.prenom} {eleveFound.nom}</span>
          <span className="text-emerald-400/50 font-mono text-xs">{eleveFound.numero}</span>
        </div>
        <h2 className="text-xl font-black text-white mb-1">Code équipe</h2>
        <p className="text-white/50 text-sm">Entre le code donné par ton enseignant(e)</p>
      </div>
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <input type="text" value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          placeholder="ABC123" maxLength={6}
          className="w-full text-center text-2xl font-black tracking-widest rounded-xl bg-black/30 border border-white/20 text-white px-4 py-4 focus:outline-none uppercase" />
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm text-center">⚠️ {error}</div>}
        <button onClick={handleJoin} disabled={code.length < 4 || loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black disabled:opacity-40 transition-all">
          {loading ? '⏳…' : '🚀 Rejoindre l\'équipe'}
        </button>
        <button onClick={() => { setStep('identity'); setCode(''); setError(''); }}
          className="w-full py-2 text-white/30 text-sm hover:text-white/60 transition-colors">← Changer d'identité</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {RALLYE_TEAMS.map(t => (
          <div key={t.id} className={`p-3 rounded-xl border ${t.border} ${t.bg} text-center`}>
            <div className="text-2xl mb-1">{t.emoji}</div>
            <div className="text-white/80 text-xs font-bold">{t.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MINI-JEUX INTÉRIEURS ─────────────────────────────────────────────────────

function JeuSelectionMultiple({ defi, onValidate }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const toggle = (id) => { if (!submitted) setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); };
  const correctIds = defi.items.filter(i => i.correct).map(i => i.id);
  const ok = correctIds.length === selected.length && correctIds.every(id => selected.includes(id));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {defi.items.map(item => {
          const isSel = selected.includes(item.id);
          let cls = 'bg-white/10 border-white/20 hover:bg-white/20';
          if (submitted) cls = item.correct ? 'bg-green-500/30 border-green-400' : (isSel ? 'bg-red-500/30 border-red-400' : 'bg-white/5 border-white/10');
          else if (isSel) cls = 'bg-yellow-500/30 border-yellow-400';
          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${cls}`}>
              {submitted && item.correct && '✅ '}{submitted && isSel && !item.correct && '❌ '}{item.label}
            </button>
          );
        })}
      </div>
      {!submitted
        ? <button onClick={() => setSubmitted(true)} disabled={!selected.length}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black disabled:opacity-40">Valider</button>
        : <div className={`p-3 rounded-xl text-center font-bold ${ok ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
            {ok ? '🎉 Parfait !' : '⚠️ Pas tout à fait — les cases vertes sont les bonnes réponses.'}
            <button onClick={() => onValidate(ok ? defi.points : Math.floor(defi.points * 0.5))}
              className="block w-full mt-2 py-2 rounded-xl bg-white/20 text-white font-black">Continuer →</button>
          </div>
      }
    </div>
  );
}

function JeuAssociation({ defi, onValidate }) {
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState({});
  const [errors, setErrors] = useState([]);
  const allDone = Object.keys(matched).length === defi.paires.length;
  const [shuffledValeurs] = useState(() => [...defi.paires].sort(() => Math.random() - 0.5));

  const clickAction = (action) => { if (!matched[action]) setSelected(action); };
  const clickValeur = (valeur) => {
    if (!selected) return;
    const correct = defi.paires.find(p => p.action === selected)?.valeur === valeur;
    if (correct) setMatched(m => ({ ...m, [selected]: valeur }));
    else { setErrors(e => [...e, selected]); setTimeout(() => setErrors(e => e.filter(x => x !== selected)), 800); }
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-xs text-white/50 font-bold uppercase text-center">Actions</p>
          {defi.paires.map(({ action }) => (
            <button key={action} onClick={() => clickAction(action)}
              className={`w-full p-2.5 rounded-xl border text-xs font-medium text-left transition-all
                ${matched[action] ? 'bg-green-500/20 border-green-400/40 text-green-300' :
                  errors.includes(action) ? 'bg-red-500/30 border-red-400/60 animate-pulse' :
                  selected === action ? 'bg-yellow-400/30 border-yellow-400/60' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}>
              {action} {matched[action] && <span className="font-black text-green-400">→ {matched[action]}</span>}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs text-white/50 font-bold uppercase text-center">Volumes</p>
          {shuffledValeurs.map(({ valeur }) => {
            const used = Object.values(matched).includes(valeur);
            return (
              <button key={valeur} onClick={() => clickValeur(valeur)} disabled={used || !selected}
                className={`w-full p-2.5 rounded-xl border text-sm font-black transition-all
                  ${used ? 'opacity-40 bg-green-500/20 border-green-400/40' :
                    selected ? 'bg-blue-500/20 border-blue-400/40 hover:bg-blue-400/30' : 'bg-white/10 border-white/20 opacity-60'}`}>
                {valeur}
              </button>
            );
          })}
        </div>
      </div>
      {allDone && (
        <div className="p-3 rounded-xl bg-green-500/20 text-green-300 text-center font-bold">
          🎉 Toutes les associations sont correctes !
          <button onClick={() => onValidate(defi.points)} className="block w-full mt-2 py-2 rounded-xl bg-white/20 text-white font-black">Continuer →</button>
        </div>
      )}
      {!allDone && <p className="text-center text-white/40 text-xs">Clique sur une action, puis sur le bon volume</p>}
    </div>
  );
}

function JeuQuizSequentiel({ defi, onValidate }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const q = defi.questions[current];

  const handleChoose = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    setTimeout(() => {
      const newA = [...answers, idx === q.correct];
      setAnswers(newA);
      if (current + 1 < defi.questions.length) { setCurrent(c => c + 1); setChosen(null); }
      else {
        const score = newA.filter(Boolean).length;
        setTimeout(() => onValidate(score >= 2 ? defi.points : Math.floor(defi.points * 0.5)), 1000);
      }
    }, 1200);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1">{defi.questions.map((_, i) => (
        <div key={i} className={`flex-1 h-1.5 rounded-full ${i < current ? 'bg-green-400' : i === current ? 'bg-amber-400' : 'bg-white/20'}`} />
      ))}</div>
      <div className="p-3 rounded-xl bg-white/10 text-center">
        <p className="font-bold text-white">{q.situation}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, idx) => {
          let cls = 'bg-white/10 border-white/20 hover:bg-white/20';
          if (chosen !== null) cls = idx === q.correct ? 'bg-green-500/40 border-green-400' : (idx === chosen ? 'bg-red-500/40 border-red-400' : cls);
          return <button key={idx} onClick={() => handleChoose(idx)} className={`p-3 rounded-xl border text-sm font-medium transition-all ${cls}`}>{opt}</button>;
        })}
      </div>
      {chosen !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`p-3 rounded-xl text-center text-sm font-medium ${chosen === q.correct ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
          {q.explication}
        </motion.div>
      )}
    </div>
  );
}

function JeuAttribution({ defi, onValidate }) {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const allAnswered = defi.items.every(i => choices[i.id] !== undefined);
  const score = defi.items.filter(i => choices[i.id] === i.correct).length;

  return (
    <div className="space-y-3">
      {defi.items.map(item => (
        <div key={item.id} className="p-3 rounded-xl bg-white/10 border border-white/20">
          <p className="text-sm font-bold text-white mb-2">{item.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.options.map((opt, idx) => {
              let cls = 'bg-white/10 border-white/15 hover:bg-white/20';
              if (submitted) cls = idx === item.correct ? 'bg-green-500/40 border-green-400 text-green-200' : (choices[item.id] === idx ? 'bg-red-500/40 border-red-400 text-red-200' : cls);
              else if (choices[item.id] === idx) cls = 'bg-amber-400/30 border-amber-400 text-amber-200';
              return (
                <button key={idx} onClick={() => { if (!submitted) setChoices(c => ({ ...c, [item.id]: idx })); }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${cls}`}>{opt}</button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted
        ? <button onClick={() => setSubmitted(true)} disabled={!allAnswered}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black disabled:opacity-40">Valider</button>
        : <div className="p-3 rounded-xl text-center font-bold bg-white/10 text-white">
            {score}/{defi.items.length} bonnes réponses !
            <button onClick={() => onValidate(score >= 3 ? defi.points : Math.floor(defi.points * 0.5))}
              className="block w-full mt-2 py-2 rounded-xl bg-white/20 text-white font-black">Continuer →</button>
          </div>
      }
    </div>
  );
}

// ─── DÉFI TERRAIN (PHOTO UPLOAD) ─────────────────────────────────────────────

function DefiTerrain({ defi, session, teamId, eleve, onPhotosSubmitted }) {
  const [photos, setPhotos] = useState({}); // objectifId -> url
  const [uploading, setUploading] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleUpload = async (objectifId, file) => {
    setUploading(objectifId);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPhotos(p => ({ ...p, [objectifId]: file_url }));
    setUploading(null);
  };

  const allPhotos = defi.objectifs.every(o => photos[o.id]);

  const handleSubmit = async () => {
    setSubmitted(true);
    await onPhotosSubmitted(Object.values(photos));
  };

  if (submitted) return (
    <div className="text-center py-6 space-y-3">
      <div className="text-5xl">📤</div>
      <h3 className="text-xl font-black text-white">Preuves envoyées !</h3>
      <p className="text-white/60 text-sm">Ton enseignant va valider tes photos. Passe au défi suivant pendant ce temps !</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
        📍 <strong>Mode Terrain</strong> — Sors dehors et photographie les 3 éléments ci-dessous. Ton enseignant validera tes preuves.
      </div>
      {defi.objectifs.map(obj => (
        <div key={obj.id} className="p-3 rounded-xl bg-white/10 border border-white/20">
          <p className="text-white font-bold text-sm mb-1">{obj.label}</p>
          <p className="text-white/50 text-xs mb-2">Ex: {obj.exemples}</p>
          {photos[obj.id]
            ? <div className="relative">
                <img src={photos[obj.id]} alt="" className="w-full h-28 object-cover rounded-lg border border-green-400/40" />
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            : <label className="block">
                <input type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={e => e.target.files?.[0] && handleUpload(obj.id, e.target.files[0])} />
                <div className={`w-full h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all
                  ${uploading === obj.id ? 'border-blue-400/60 bg-blue-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                  {uploading === obj.id
                    ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span className="text-white/50 text-xs">Upload…</span></>
                    : <><Camera className="w-5 h-5 text-white/40" /><span className="text-white/40 text-xs">Photographier</span></>
                  }
                </div>
              </label>
          }
        </div>
      ))}
      <button onClick={handleSubmit} disabled={!allPhotos}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black disabled:opacity-40 transition-all">
        📤 Envoyer mes preuves
      </button>
    </div>
  );
}

// ─── VUE ÉLÈVE — PLATEAU DE JEU ──────────────────────────────────────────────

export function RallyeGameView({ session, teamId, eleve }) {
  const qc = useQueryClient();
  const [activeDefi, setActiveDefi] = useState(null);
  const [phase, setPhase] = useState('intro'); // intro | jeu | victoire

  const team = RALLYE_TEAMS.find(t => t.id === teamId);
  const defisEtat = session[team.defisKey] || {};
  const score = calcRallyeScore(defisEtat);
  const validated = Object.values(defisEtat).filter(d => d?.validated).length;
  const pending = Object.values(defisEtat).filter(d => d?.preuves?.length > 0 && !d?.validated).length;

  const openDefi = (defi) => { setActiveDefi(defi); setPhase('intro'); };
  const closeDefi = () => { setActiveDefi(null); setPhase('intro'); };

  const saveDefiResult = async (score, extra = {}) => {
    const updated = {
      ...defisEtat,
      [activeDefi.id]: { validated: true, score, timestamp: new Date().toISOString(), ...extra }
    };
    await base44.entities.RallyeSession.update(session.id, { [team.defisKey]: updated });
    qc.invalidateQueries(['rallye-sessions']);
    setPhase('victoire');
  };

  const saveTerrainPending = async (preuves) => {
    const updated = {
      ...defisEtat,
      [activeDefi.id]: { validated: false, score: 0, preuves, timestamp: new Date().toISOString() }
    };
    await base44.entities.RallyeSession.update(session.id, { [team.defisKey]: updated });
    qc.invalidateQueries(['rallye-sessions']);
    setPhase('victoire');
  };

  // Vue détail d'un défi
  if (activeDefi) {
    const etat = defisEtat[activeDefi.id];
    return (
      <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        className={`rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${activeDefi.couleur}`}>
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <button onClick={closeDefi} className="w-9 h-9 rounded-full bg-black/30 border border-white/20 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeDefi.emoji}</span>
              <span className="text-white font-black">{activeDefi.titre}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${activeDefi.mode === 'terrain' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'}`}>
                {activeDefi.mode === 'terrain' ? '🌿 Terrain' : '🖥️ Intérieur'}
              </span>
            </div>
            <p className="text-white/50 text-xs">{activeDefi.sousTitre}</p>
          </div>
          <span className="text-amber-300 font-black text-sm">{activeDefi.points} pts</span>
        </div>

        <div className="p-4 space-y-4">
          {phase === 'intro' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="text-center py-2"><div className="text-5xl mb-2">{activeDefi.emoji}</div></div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/10">
                <p className="text-white/50 text-xs font-bold uppercase mb-1">📋 Mission</p>
                <p className="text-white text-sm">{activeDefi.consigne}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/15 border border-white/10">
                <p className="text-white/50 text-xs font-bold uppercase mb-1">💡 Geste appris</p>
                <p className="text-white/80 text-sm">{activeDefi.geste}</p>
              </div>
              <button onClick={() => setPhase('jeu')}
                className="w-full py-4 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-black text-lg transition-all">
                🚀 Commencer !
              </button>
            </motion.div>
          )}

          {phase === 'jeu' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {activeDefi.type === 'selection_multiple' && <JeuSelectionMultiple defi={activeDefi} onValidate={saveDefiResult} />}
              {activeDefi.type === 'association' && <JeuAssociation defi={activeDefi} onValidate={saveDefiResult} />}
              {activeDefi.type === 'quiz_sequentiel' && <JeuQuizSequentiel defi={activeDefi} onValidate={saveDefiResult} />}
              {activeDefi.type === 'attribution' && <JeuAttribution defi={activeDefi} onValidate={saveDefiResult} />}
              {activeDefi.type === 'photo_terrain' && (
                <DefiTerrain defi={activeDefi} session={session} teamId={teamId} eleve={eleve}
                  onPhotosSubmitted={saveTerrainPending} />
              )}
            </motion.div>
          )}

          {phase === 'victoire' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 py-4">
              <div className="text-5xl">{activeDefi.mode === 'terrain' ? '📤' : '🗝️'}</div>
              <h3 className="text-2xl font-black text-white">
                {activeDefi.mode === 'terrain' ? 'Preuves envoyées !' : 'Défi validé !'}
              </h3>
              {activeDefi.mode === 'terrain'
                ? <p className="text-white/60 text-sm">Ton enseignant va valider tes photos. Continue les autres défis !</p>
                : <div className="px-6 py-3 rounded-2xl bg-black/30 border-2 border-amber-400/40 inline-block">
                    <span className="text-amber-300 font-black text-2xl tracking-wider">🗝️ {activeDefi.motCle}</span>
                  </div>
              }
              <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-left">
                <p className="text-white/50 text-xs font-bold uppercase mb-1">💡 À retenir</p>
                <p className="text-white/80 text-sm">{activeDefi.geste}</p>
              </div>
              <button onClick={closeDefi}
                className="w-full py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black transition-all">
                ← Retour au plateau
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Vue plateau principal
  return (
    <div className="space-y-4">
      {/* Header équipe */}
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${team.couleur} border border-white/10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{team.emoji}</span>
            <div>
              <p className="text-white font-black">{team.name}</p>
              <p className="text-white/60 text-xs">👤 {eleve.prenom} {eleve.nom}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-amber-300 font-black text-xl">{score} pts</p>
            <p className="text-white/50 text-xs">{validated}/7 défis</p>
          </div>
        </div>
        {/* Barre de progression */}
        <div className="mt-3 flex gap-1">
          {RALLYE_DEFIS.map(d => (
            <div key={d.id} title={d.titre}
              className={`flex-1 h-2 rounded-full transition-all ${defisEtat[d.id]?.validated ? 'bg-amber-400' : defisEtat[d.id]?.preuves?.length > 0 ? 'bg-blue-400 animate-pulse' : 'bg-white/15'}`} />
          ))}
        </div>
        {pending > 0 && <p className="text-blue-300 text-xs mt-1">⏳ {pending} défi(s) terrain en attente de validation</p>}
      </div>

      {/* Code secret partiel */}
      {validated > 0 && (
        <div className="p-3 rounded-2xl bg-black/30 border border-amber-400/20">
          <p className="text-amber-300/70 text-xs font-bold uppercase mb-2">🗝️ Clés obtenues</p>
          <div className="flex flex-wrap gap-2">
            {RALLYE_DEFIS.map(d => (
              defisEtat[d.id]?.validated
                ? <span key={d.id} className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">{d.motCle}</span>
                : defisEtat[d.id]?.preuves?.length > 0
                  ? <span key={d.id} className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs">⏳ {d.emoji}</span>
                  : <span key={d.id} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/20 text-xs">???</span>
            ))}
          </div>
        </div>
      )}

      {/* Liste des défis */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-blue-400" />
          <span className="text-white/50 text-xs">Intérieur</span>
          <span className="w-3 h-3 rounded-full bg-amber-400 ml-2" />
          <span className="text-white/50 text-xs">Terrain</span>
        </div>
        {RALLYE_DEFIS.map(defi => {
          const etat = defisEtat[defi.id];
          const isDone = etat?.validated;
          const isPending = etat?.preuves?.length > 0 && !isDone;
          return (
            <motion.button key={defi.id} onClick={() => openDefi(defi)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-2xl border text-left transition-all
                ${isDone ? `bg-gradient-to-r ${defi.couleur} border-white/20` :
                  isPending ? 'bg-blue-500/10 border-blue-400/30' :
                  'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-black/20">
                  {isDone ? '✅' : isPending ? '⏳' : defi.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-black text-sm">{defi.titre}</span>
                    {isDone && <span className="text-amber-300 text-xs font-black px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">🗝️ {defi.motCle}</span>}
                    {isPending && <span className="text-blue-300 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">⏳ En attente</span>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${defi.mode === 'terrain' ? 'bg-amber-500/15 text-amber-400 border-amber-400/20' : 'bg-blue-500/15 text-blue-400 border-blue-400/20'}`}>
                      {defi.mode === 'terrain' ? '🌿 Terrain' : '🖥️ Intérieur'}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs">{defi.sousTitre}</p>
                </div>
                <span className="text-white/40 font-bold text-xs">{defi.points} pts</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Victoire finale */}
      {validated === 7 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-700 to-yellow-800 border-2 border-amber-400/40 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-xl font-black text-amber-300 mb-1">Tous les défis validés !</h3>
          <p className="text-white/70 text-sm mb-3">Code secret du Coffre de la Planète :</p>
          <p className="text-amber-300 font-black text-base tracking-wider">
            {RALLYE_DEFIS.map(d => d.motCle).join(' · ')}
          </p>
        </motion.div>
      )}
    </div>
  );
}