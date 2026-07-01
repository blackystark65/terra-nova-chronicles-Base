import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Copy, CheckCircle, X, Trash2, Flag, UserPlus, Search, ChevronDown } from 'lucide-react';
import { RALLYE_TEAMS, RALLYE_DEFIS, generateCode, calcRallyeScore } from '@/data/rallyeData';

// ─── Onglet "Vue d'ensemble d'un défi" pour l'enseignant ─────────────────────
function DefiTeacherDetail({ defi, session }) {
  const qc = useQueryClient();
  const [showReferentiel, setShowReferentiel] = useState(false);
  // Pour chaque équipe : quels items du référentiel sont cochés
  const [validatedItems, setValidatedItems] = useState({});

  const handleValidate = async (teamId, score) => {
    const team = RALLYE_TEAMS.find(t => t.id === teamId);
    const defis = session[team.defisKey] || {};
    const updated = { ...defis, [defi.id]: { ...defis[defi.id], validated: true, score, timestamp: new Date().toISOString() } };
    await base44.entities.RallyeSession.update(session.id, { [team.defisKey]: updated });
    qc.invalidateQueries(['rallye-sessions']);
  };

  const handleInvalidate = async (teamId) => {
    const team = RALLYE_TEAMS.find(t => t.id === teamId);
    const defis = session[team.defisKey] || {};
    const updated = { ...defis };
    delete updated[defi.id];
    await base44.entities.RallyeSession.update(session.id, { [team.defisKey]: updated });
    qc.invalidateQueries(['rallye-sessions']);
  };

  const toggleItem = (teamId, itemId) => {
    setValidatedItems(prev => {
      const key = `${teamId}-${itemId}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const countValidated = (teamId) =>
    (defi.referentiel_enseignant || []).filter(item => validatedItems[`${teamId}-${item.id}`]).length;

  // Calculer les scores comparatifs entre les deux équipes
  const computeComparativeScores = () => {
    const c1 = countValidated('team1');
    const c2 = countValidated('team2');
    const pts_gagnant = defi.points_gagnant || defi.points;
    const pts_perdant = defi.points_perdant || Math.floor(defi.points * 0.5);
    if (c1 > c2) return { team1: pts_gagnant, team2: pts_perdant, winner: 'team1' };
    if (c2 > c1) return { team1: pts_perdant, team2: pts_gagnant, winner: 'team2' };
    return { team1: Math.floor((pts_gagnant + pts_perdant) / 2), team2: Math.floor((pts_gagnant + pts_perdant) / 2), winner: 'egalite' };
  };

  const canInteract = session.status === 'en_cours';
  const isListeCollab = defi.type === 'liste_collaborative';

  return (
    <div className="space-y-4">
      {/* En-tête du défi */}
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${defi.couleur} border border-white/10`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{defi.emoji}</span>
          <div className="flex-1">
            <h3 className="text-white font-black text-base">{defi.titre}</h3>
            <p className="text-white/60 text-xs">{defi.sousTitre}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${defi.mode === 'terrain' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'}`}>
            {defi.mode === 'terrain' ? '🌿 Terrain' : '🖥️ Intérieur'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/20 border border-white/10 mb-2">
          <p className="text-white/50 text-[10px] font-bold uppercase mb-1">📋 Mission des élèves</p>
          <p className="text-white/90 text-sm">{defi.consigne_eleves || defi.consigne}</p>
        </div>

        {isListeCollab && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 mb-2">
            <p className="text-amber-200/70 text-[10px] font-bold uppercase mb-1">🏆 Barème comparatif</p>
            <p className="text-amber-100 text-xs">{defi.criteres_validation}</p>
          </div>
        )}

        {defi.mode === 'terrain' && defi.objectifs && (
          <div className="p-3 rounded-xl bg-black/15 border border-white/10 mb-2">
            <p className="text-white/50 text-[10px] font-bold uppercase mb-2">📷 Photos attendues</p>
            <div className="space-y-1.5">
              {defi.objectifs.map(obj => (
                <div key={obj.id} className="flex items-start gap-2">
                  <span className="text-sm leading-tight mt-0.5">{obj.label.split(' ')[0]}</span>
                  <div>
                    <p className="text-white/80 text-xs font-semibold">{obj.label.replace(obj.label.split(' ')[0] + ' ', '')}</p>
                    <p className="text-white/40 text-xs">Ex : {obj.exemples}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-black/15 border border-white/10">
          <p className="text-white/50 text-[10px] font-bold uppercase mb-1">💡 Geste à retenir</p>
          <p className="text-white/80 text-sm">{defi.geste}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-amber-300 font-black text-sm">
            🏅 {isListeCollab ? `${defi.points_gagnant || defi.points} / ${defi.points_perdant || Math.floor(defi.points * 0.5)} pts` : `${defi.points} pts`}
          </span>
          <span className="text-white/40 text-xs font-mono">Mot-clé : {defi.motCle}</span>
        </div>
      </div>

      {/* RÉFÉRENTIEL ENSEIGNANT (liste collaborative uniquement) */}
      {isListeCollab && defi.referentiel_enseignant && (
        <div className="rounded-xl border border-violet-400/20 bg-violet-500/5 overflow-hidden">
          <button onClick={() => setShowReferentiel(!showReferentiel)}
            className="w-full p-3 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <span className="text-violet-300 text-sm font-black">📚 Référentiel enseignant</span>
              <span className="text-violet-400/60 text-xs">({defi.referentiel_enseignant.length} réponses acceptables)</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-violet-400/60 transition-transform ${showReferentiel ? 'rotate-180' : ''}`} />
          </button>
          {showReferentiel && (
            <div className="px-3 pb-3 space-y-1.5 max-h-64 overflow-y-auto">
              {defi.referentiel_enseignant.map(item => (
                <div key={item.id} className="p-2.5 rounded-xl bg-black/20 border border-violet-400/10">
                  <p className="text-violet-200 text-xs font-bold">{item.label}</p>
                  <p className="text-white/40 text-[11px] mt-0.5 leading-relaxed">{item.explication}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ÉTAT PAR ÉQUIPE */}
      <div className="space-y-4">
        {RALLYE_TEAMS.map(team => {
          const defis = session[team.defisKey] || {};
          const etat = defis[defi.id];
          const isDone = etat?.validated;
          const hasList = etat?.liste_items?.length > 0;
          const hasPhotos = etat?.preuves?.length > 0;
          const isPending = (hasList || hasPhotos) && !isDone;
          const nItems = countValidated(team.id);

          return (
            <div key={team.id} className={`rounded-xl border overflow-hidden ${isDone ? 'border-green-400/20' : isPending ? 'border-amber-400/20' : 'border-white/10'}`}>
              {/* Header équipe */}
              <div className={`p-3 flex items-center justify-between ${isDone ? 'bg-green-500/10' : isPending ? 'bg-amber-500/10' : 'bg-white/5'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{team.emoji}</span>
                  <span className="text-white font-bold text-sm">{team.name}</span>
                  <span className="text-white/40 text-xs">({(session[team.membersKey] || []).length} élèves)</span>
                </div>
                <div className="flex items-center gap-2">
                  {isDone && <span className="text-green-400 text-xs font-black px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/30">✅ {etat.score} pts</span>}
                  {isPending && !isDone && <span className="text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">⏳ Liste soumise</span>}
                  {!isDone && !isPending && <span className="text-white/30 text-xs">En attente</span>}
                </div>
              </div>

              <div className="p-3 space-y-3">
                {/* Liste soumise par l'équipe */}
                {isListeCollab && hasList && (
                  <div>
                    <p className="text-white/60 text-xs font-bold mb-2">
                      📋 Liste soumise ({etat.liste_items.length} réponse{etat.liste_items.length > 1 ? 's' : ''}) — Cochez les réponses valides :
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {etat.liste_items.map((item, idx) => {
                        const key = `${team.id}-item${idx}`;
                        const isValid = validatedItems[key];
                        return (
                          <button key={idx} onClick={() => setValidatedItems(prev => ({ ...prev, [key]: !prev[key] }))}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all
                              ${isValid ? 'bg-green-500/20 border-green-400/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
                              ${isValid ? 'bg-green-500 border-green-400' : 'border-white/30'}`}>
                              {isValid && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${isValid ? 'text-green-200 font-semibold' : 'text-white/70'}`}>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-white/40">{nItems} / {etat.liste_items.length} réponse{nItems > 1 ? 's' : ''} validée{nItems > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}

                {/* Photos terrain */}
                {hasPhotos && (
                  <div>
                    <p className="text-amber-200 text-xs font-bold mb-2">📷 Photos soumises :</p>
                    <div className="flex gap-2 flex-wrap">
                      {etat.preuves.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative group">
                          <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-amber-400/30 hover:border-amber-400/70 transition-all" />
                          <span className="absolute bottom-1 right-1 text-[10px] text-white/70 bg-black/50 rounded px-1">Photo {i + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boutons de validation */}
                {canInteract && !isDone && (isListeCollab && hasList) && (
                  <div className="space-y-2">
                    {/* Score comparatif calculé automatiquement */}
                    {(() => {
                      const scores = computeComparativeScores();
                      const myScore = scores[team.id];
                      return (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 flex items-center justify-between">
                          <span>Score calculé : <strong className="text-white/80">{nItems} réponses valides</strong></span>
                          <span className={`font-black ${scores.winner === team.id ? 'text-amber-300' : scores.winner === 'egalite' ? 'text-white/60' : 'text-white/40'}`}>
                            → {myScore} pts {scores.winner === team.id ? '🏆' : scores.winner === 'egalite' ? '=' : ''}
                          </span>
                        </div>
                      );
                    })()}
                    <div className="flex gap-2">
                      <button onClick={() => { const s = computeComparativeScores(); handleValidate(team.id, s[team.id]); }}
                        className="flex-1 py-2 rounded-xl bg-green-500/30 hover:bg-green-500/50 text-green-300 text-xs font-black border border-green-400/30 transition-all">
                        ✅ Valider avec score calculé
                      </button>
                      <button onClick={() => handleValidate(team.id, defi.points)}
                        className="flex-shrink-0 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/60 text-xs font-bold border border-white/10 transition-all">
                        Max
                      </button>
                    </div>
                  </div>
                )}

                {/* Validation terrain ou manuelle */}
                {canInteract && !isDone && !isListeCollab && (hasPhotos || !hasList) && (
                  <div className="flex gap-2">
                    <button onClick={() => handleValidate(team.id, defi.points)}
                      className="flex-1 py-2 rounded-xl bg-green-500/30 hover:bg-green-500/50 text-green-300 text-xs font-black border border-green-400/30 transition-all">
                      ✅ Valider ({defi.points} pts)
                    </button>
                    <button onClick={() => handleValidate(team.id, Math.floor(defi.points * 0.5))}
                      className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-400/20 transition-all">
                      ½ Partiel
                    </button>
                    {hasPhotos && (
                      <button onClick={() => handleInvalidate(team.id)}
                        className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-400/20 transition-all">✗</button>
                    )}
                  </div>
                )}

                {/* Annuler */}
                {isDone && canInteract && (
                  <button onClick={() => handleInvalidate(team.id)}
                    className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-400 text-xs border border-white/10 hover:border-red-400/20 transition-all">
                    Annuler la validation
                  </button>
                )}

                {/* Pas encore soumis */}
                {!isPending && !isDone && canInteract && (
                  <p className="text-white/30 text-xs text-center italic">L'équipe n'a pas encore soumis ce défi.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function RallyeTeacherPanel({ sessions, user }) {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [nomClasse, setNomClasse] = useState('');
  const [dateSession, setDateSession] = useState('');
  const [copied, setCopied] = useState(null);
  // activeTab: null | 'equipes' | defi.id
  const [activeTab, setActiveTab] = useState({});

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.RallyeSession.create(data),
    onSuccess: () => { qc.invalidateQueries(['rallye-sessions']); setShowCreate(false); setNomClasse(''); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RallyeSession.update(id, data),
    onSuccess: () => qc.invalidateQueries(['rallye-sessions']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.RallyeSession.delete(id),
    onSuccess: () => qc.invalidateQueries(['rallye-sessions']),
  });

  const handleCreate = () => {
    if (!nomClasse.trim()) return;
    createMutation.mutate({
      nom_classe: nomClasse.trim(),
      enseignant_email: user.email,
      code_team1: generateCode(),
      code_team2: generateCode(),
      date_session: dateSession || new Date().toISOString().split('T')[0],
      status: 'preparation',
      defis_team1: {},
      defis_team2: {},
    });
  };

  const handleLancer = (session) => updateMutation.mutate({ id: session.id, data: { status: 'en_cours' } });
  const handleCloture = (session) => {
    const s1 = calcRallyeScore(session.defis_team1 || {});
    const s2 = calcRallyeScore(session.defis_team2 || {});
    const winner = s1 > s2 ? 'team1' : s2 > s1 ? 'team2' : 'egalite';
    updateMutation.mutate({ id: session.id, data: { status: 'termine', winner_team: winner, score_team1: s1, score_team2: s2 } });
  };

  const copyCode = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const setTab = (sessionId, tab) => {
    setActiveTab(prev => ({ ...prev, [sessionId]: prev[sessionId] === tab ? null : tab }));
  };

  // Gestion formation d'équipes
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearchEleve = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true); setSearchError(''); setSearchResults([]);
    const q = searchQuery.trim().toUpperCase();
    const all = await base44.entities.Eleve.list('-created_date', 500);
    const found = all.filter(e =>
      e.numero?.toUpperCase() === q ||
      `${e.prenom} ${e.nom}`.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      `${e.nom} ${e.prenom}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    if (found.length === 0) setSearchError('Aucun élève trouvé.');
    setSearchResults(found);
    setSearchLoading(false);
  };

  const handleAddToTeam = async (session, eleve, teamId) => {
    const allMembers = [...(session.members_team1 || []), ...(session.members_team2 || [])];
    if (allMembers.some(m => m.eleve_numero === eleve.numero)) {
      setSearchError(`${eleve.prenom} ${eleve.nom} est déjà dans une équipe.`); return;
    }
    const key = `members_${teamId}`;
    await base44.entities.RallyeSession.update(session.id, {
      [key]: [...(session[key] || []), { eleve_id: eleve.id, eleve_numero: eleve.numero, user_name: `${eleve.prenom} ${eleve.nom}` }]
    });
    qc.invalidateQueries(['rallye-sessions']);
    setSearchResults([]); setSearchQuery(''); setSearchError('');
  };

  const handleRemoveFromTeam = async (session, teamId, indexToRemove) => {
    const key = `members_${teamId}`;
    await base44.entities.RallyeSession.update(session.id, { [key]: (session[key] || []).filter((_, i) => i !== indexToRemove) });
    qc.invalidateQueries(['rallye-sessions']);
  };

  const mySessions = sessions.filter(s => s.enseignant_email === user.email);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">👩‍🏫 Mes Sessions Rallye</h2>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-sm font-bold transition-all">
          + Nouvelle session
        </button>
      </div>

      {mySessions.length === 0 && (
        <div className="text-center py-10 text-white/40 text-sm">
          Aucune session créée. Créez-en une pour générer les codes équipes.
        </div>
      )}

      {mySessions.map(session => {
        const s1 = calcRallyeScore(session.defis_team1 || {});
        const s2 = calcRallyeScore(session.defis_team2 || {});
        const d1 = Object.values(session.defis_team1 || {}).filter(d => d?.validated).length;
        const d2 = Object.values(session.defis_team2 || {}).filter(d => d?.validated).length;
        const currentTab = activeTab[session.id] || null;

        // Nombre de preuves en attente
        const pendingCount = RALLYE_TEAMS.reduce((acc, team) => {
          const defis = session[team.defisKey] || {};
          return acc + Object.values(defis).filter(d => d?.preuves?.length > 0 && !d?.validated).length;
        }, 0);

        return (
          <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {/* ── Header session ── */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-black text-white">{session.nom_classe}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    session.status === 'preparation' ? 'bg-blue-500/20 text-blue-300' :
                    session.status === 'en_cours' ? 'bg-green-500/20 text-green-300' :
                    'bg-amber-500/20 text-amber-300'}`}>
                    {session.status === 'preparation' ? '🔧 Préparation' : session.status === 'en_cours' ? '🟢 En cours' : '🏁 Terminé'}
                  </span>
                  {pendingCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/30 text-amber-300 border border-amber-400/30 animate-pulse">
                      📷 {pendingCount} photo{pendingCount > 1 ? 's' : ''} à valider
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-xs">{session.date_session}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {session.status === 'preparation' && (
                  <button onClick={() => handleLancer(session)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 border border-emerald-400/40 font-bold transition-all">
                    🚀 Lancer le rallye
                  </button>
                )}
                {session.status === 'en_cours' && (
                  <button onClick={() => handleCloture(session)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 font-bold transition-all">
                    <Flag className="w-3 h-3" /> Clôturer
                  </button>
                )}
                <button onClick={() => { if (window.confirm('Supprimer cette session ?')) deleteMutation.mutate(session.id); }}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400/50 hover:text-red-400 border border-red-400/20 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Codes équipes ── */}
            {(session.status === 'preparation' || session.status === 'en_cours') && (
              <div className="p-4 grid grid-cols-2 gap-3 border-b border-white/10">
                {RALLYE_TEAMS.map(team => (
                  <div key={team.id} className={`p-3 rounded-xl border ${team.border} ${team.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{team.emoji}</span>
                      <span className="text-white/80 text-xs font-bold">{team.name}</span>
                      <span className="text-white/50 text-xs">({(session[team.membersKey] || []).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-center text-lg font-black text-white tracking-widest bg-black/30 rounded-lg py-1">
                        {session[team.codeKey]}
                      </code>
                      <button onClick={() => copyCode(session[team.codeKey], `${session.id}-${team.id}`)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                        {copied === `${session.id}-${team.id}` ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {(session[team.membersKey] || []).length > 0 && (
                      <div className="mt-2 space-y-0.5">
                        {(session[team.membersKey] || []).map((m, i) => (
                          <div key={i} className="text-xs text-white/50">
                            <span className="font-mono text-white/30 text-[10px] mr-1">{m.eleve_numero || '—'}</span>{m.user_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Bannière préparation ── */}
            {session.status === 'preparation' && (
              <div className="mx-4 my-3 p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs flex items-start gap-2">
                <span className="text-lg">ℹ️</span>
                <div>
                  <strong>Phase de préparation</strong> — Constituez vos équipes ci-dessous, puis cliquez sur <strong>🚀 Lancer le rallye</strong>. Une fois lancée, les élèves pourront rejoindre avec leur code.
                </div>
              </div>
            )}

            {/* ── Scores rapides ── */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="grid grid-cols-2 gap-3">
                {RALLYE_TEAMS.map(team => {
                  const score = team.id === 'team1' ? s1 : s2;
                  const validated = team.id === 'team1' ? d1 : d2;
                  const isWinner = session.status === 'termine' && session.winner_team === team.id;
                  return (
                    <div key={team.id} className={`p-3 rounded-xl border ${isWinner ? team.border + ' ' + team.bg : 'border-white/10 bg-white/5'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {isWinner && <span>🏆</span>}
                        <span>{team.emoji}</span>
                        <span className="text-white/70 text-xs font-bold">{team.name}</span>
                      </div>
                      <div className="text-xl font-black text-white">{score} pts</div>
                      {/* Barre progression */}
                      <div className="flex gap-0.5 mt-1.5">
                        {RALLYE_DEFIS.map(d => {
                          const defis = session[team.defisKey] || {};
                          const etat = defis[d.id];
                          return (
                            <button key={d.id} title={d.titre}
                              onClick={() => setTab(session.id, d.id)}
                              className={`flex-1 h-2 rounded-full transition-all cursor-pointer hover:opacity-80
                                ${etat?.validated ? 'bg-green-400' : etat?.preuves?.length > 0 ? 'bg-amber-400 animate-pulse' : 'bg-white/15'}`} />
                          );
                        })}
                      </div>
                      <div className="text-white/40 text-[10px] mt-1">{validated}/7 défis</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── ONGLETS ── */}
            <div className="border-b border-white/10">
              <div className="flex overflow-x-auto scrollbar-hide">
                {/* Onglet Équipes */}
                <button
                  onClick={() => setTab(session.id, 'equipes')}
                  className={`flex-shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap
                    ${currentTab === 'equipes' ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10' : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                  <UserPlus className="w-3.5 h-3.5 inline mr-1.5" />Équipes
                </button>
                {/* Un onglet par défi */}
                {RALLYE_DEFIS.map(defi => {
                  const hasPending = RALLYE_TEAMS.some(team => {
                    const defis = session[team.defisKey] || {};
                    return defis[defi.id]?.preuves?.length > 0 && !defis[defi.id]?.validated;
                  });
                  const allDone = RALLYE_TEAMS.every(team => {
                    const defis = session[team.defisKey] || {};
                    return defis[defi.id]?.validated;
                  });
                  return (
                    <button key={defi.id}
                      onClick={() => setTab(session.id, defi.id)}
                      className={`flex-shrink-0 px-3 py-2 text-xs font-bold border-b-2 transition-all flex flex-col items-center gap-0.5 min-w-[52px] max-w-[72px] text-center
                        ${currentTab === defi.id ? 'border-blue-400 text-blue-300 bg-blue-500/10' : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                      <span>{defi.emoji}</span>
                      <span className="leading-tight break-words w-full" style={{wordBreak:'break-word'}}>{defi.titre}</span>
                      {hasPending && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                      {allDone && <span className="text-green-400 text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Contenu onglet actif ── */}
            <AnimatePresence mode="wait">
              {currentTab && (
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="p-4"
                >
                  {/* Onglet Équipes */}
                  {currentTab === 'equipes' && (session.status === 'preparation' || session.status === 'en_cours') && (
                    <div className="space-y-4">
                      {/* Ratio équipes */}
                      {(() => {
                        const m1 = (session.members_team1 || []).length;
                        const m2 = (session.members_team2 || []).length;
                        const total = m1 + m2;
                        const diff = Math.abs(m1 - m2);
                        return total > 0 && (
                          <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${diff > 2 ? 'bg-amber-500/10 border-amber-400/20 text-amber-300' : 'bg-emerald-500/10 border-emerald-400/20 text-emerald-300'}`}>
                            {diff > 2 ? '⚠️' : '✅'} Équipe 1 : {m1} élève{m1 !== 1 ? 's' : ''} — Équipe 2 : {m2} élève{m2 !== 1 ? 's' : ''}
                            {diff > 2 && <span className="ml-1 text-amber-400/70">(déséquilibre de {diff})</span>}
                          </div>
                        );
                      })()}

                      {/* Recherche */}
                      <div>
                        <label className="text-white/60 text-xs mb-1.5 block">Chercher un élève par numéro TN, prénom ou nom</label>
                        <div className="flex gap-2">
                          <input type="text" value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setSearchError(''); }}
                            onKeyDown={e => e.key === 'Enter' && handleSearchEleve()}
                            placeholder="TN-G042 ou Martin Dupont…"
                            className="flex-1 rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50" />
                          <button onClick={handleSearchEleve} disabled={searchLoading || !searchQuery.trim()}
                            className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-all disabled:opacity-40">
                            {searchLoading ? '⏳' : <Search className="w-4 h-4" />}
                          </button>
                        </div>
                        {searchError && <p className="text-red-300 text-xs mt-1.5">⚠️ {searchError}</p>}
                      </div>

                      {/* Résultats */}
                      {searchResults.length > 0 && (
                        <div className="space-y-2">
                          {searchResults.map(eleve => {
                            const alreadyIn = [...(session.members_team1 || []), ...(session.members_team2 || [])].some(m => m.eleve_numero === eleve.numero);
                            return (
                              <div key={eleve.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 border-white/10 bg-white/5 ${alreadyIn ? 'opacity-50' : ''}`}>
                                <div>
                                  <div className="text-white text-sm font-bold">{eleve.prenom} {eleve.nom}</div>
                                  <div className="text-white/40 text-xs font-mono">{eleve.numero}</div>
                                  {alreadyIn && <div className="text-amber-400 text-xs">Déjà dans une équipe</div>}
                                </div>
                                {!alreadyIn && (
                                  <div className="flex gap-2">
                                    {RALLYE_TEAMS.map(team => (
                                      <button key={team.id} onClick={() => handleAddToTeam(session, eleve, team.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${team.bg} ${team.border} text-white hover:opacity-80`}>
                                        {team.emoji} {team.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Listes équipes avec suppression */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {RALLYE_TEAMS.map(team => {
                          const members = session[team.membersKey] || [];
                          return (
                            <div key={team.id} className={`p-3 rounded-xl border ${team.border} ${team.bg}`}>
                              <div className="flex items-center gap-1.5 mb-2">
                                <span>{team.emoji}</span>
                                <span className="text-white/80 text-xs font-bold">{team.name}</span>
                                <span className="text-white/40 text-xs">({members.length})</span>
                              </div>
                              {members.length === 0
                                ? <p className="text-white/30 text-xs italic">Aucun élève</p>
                                : <div className="space-y-1">
                                    {members.map((m, i) => (
                                      <div key={i} className="flex items-center justify-between gap-1">
                                        <div>
                                          <span className="text-xs text-white/70">{m.user_name}</span>
                                          {m.eleve_numero && <span className="text-[10px] text-white/30 font-mono ml-1">{m.eleve_numero}</span>}
                                        </div>
                                        <button onClick={() => handleRemoveFromTeam(session, team.id, i)}
                                          className="flex-shrink-0 p-0.5 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                              }
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Onglet défi */}
                  {RALLYE_DEFIS.map(defi => currentTab === defi.id && (
                    <DefiTeacherDetail key={defi.id} defi={defi} session={session} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Modal création */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 rounded-3xl border border-emerald-400/20 p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-black text-white">🌍 Nouvelle session Rallye</h3>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl bg-white/10 text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm font-semibold mb-1 block">Nom de la classe</label>
                  <input type="text" value={nomClasse} onChange={e => setNomClasse(e.target.value)}
                    placeholder="Ex : 6B, CM2, 8H…"
                    className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none" />
                </div>
                <div>
                  <label className="text-white/70 text-sm font-semibold mb-1 block">Date du rallye</label>
                  <input type="date" value={dateSession} onChange={e => setDateSession(e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-3 py-2 text-sm" />
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
                  💡 Deux codes seront générés : un par équipe. Les défis terrain nécessitent une validation manuelle par l'enseignant.
                </div>
                <button onClick={handleCreate} disabled={!nomClasse.trim() || createMutation.isPending}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black disabled:opacity-40 transition-all">
                  {createMutation.isPending ? '⏳ Création…' : '✅ Créer la session'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}