import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Users, Copy, CheckCircle, X, Star, Coins, Award, UserPlus, Search, Trash2, Pencil } from 'lucide-react';
import { TEAMS_CONFIG, calcScore, generateCode, WINNER_REWARDS, PARTICIPANT_REWARDS } from './BioFocusData';

function ScoreBadge({ label, value, color }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${color}-500/20 text-${color}-300 border border-${color}-400/30`}>
      {label} +{value}
    </span>
  );
}

export default function TeacherPanel({ sessions, user, onSessionCreated }) {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [nomClasse, setNomClasse] = useState('');
  const [degre, setDegre] = useState('');
  const [dateSession, setDateSession] = useState('');
  const [distributing, setDistributing] = useState(null);
  const [distributed, setDistributed] = useState({});

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BioFocusSession.create(data),
    onSuccess: () => { qc.invalidateQueries(['biofocus-sessions']); setShowCreate(false); onSessionCreated?.(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BioFocusSession.update(id, data),
    onSuccess: () => qc.invalidateQueries(['biofocus-sessions']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BioFocusSession.delete(id),
    onSuccess: () => qc.invalidateQueries(['biofocus-sessions']),
  });

  const handleDelete = (session) => {
    if (!window.confirm(`Supprimer la session "${session.nom_classe}" du ${session.date_session} ? Les récompenses déjà distribuées aux élèves ne seront pas affectées.`)) return;
    deleteMutation.mutate(session.id);
  };

  const handleCreate = () => {
    if (!nomClasse.trim()) return;
    const label = degre.trim() ? `${nomClasse.trim()} — ${degre.trim()}` : nomClasse.trim();
    createMutation.mutate({
      classe_id: '',
      nom_classe: label,
      enseignant_email: user.email,
      code_team1: generateCode(),
      code_team2: generateCode(),
      date_session: dateSession || new Date().toISOString().split('T')[0],
      annee_scolaire: '2025-2026',
      status: 'en_cours',
    });
  };

  const handleCloture = (session) => {
    const s1 = calcScore(session.captures_team1 || {}).score;
    const s2 = calcScore(session.captures_team2 || {}).score;
    const winner = s1 > s2 ? 'team1' : s2 > s1 ? 'team2' : 'egalite';
    updateMutation.mutate({ id: session.id, data: { status: 'termine', winner_team: winner, score_team1: s1, score_team2: s2 } });
  };

  const handleDistributeRewards = async (session) => {
    setDistributing(session.id);
    const s1 = calcScore(session.captures_team1 || {}).score;
    const s2 = calcScore(session.captures_team2 || {}).score;
    const winner = s1 > s2 ? 'team1' : s2 > s1 ? 'team2' : 'egalite';

    const allMembers = [
      ...(session.members_team1 || []).map(m => ({ ...m, team: 'team1' })),
      ...(session.members_team2 || []).map(m => ({ ...m, team: 'team2' })),
    ];

    for (const member of allMembers) {
      const isWinner = winner === 'egalite' || member.team === winner;
      const rewards = isWinner ? WINNER_REWARDS : PARTICIPANT_REWARDS;

      if (!member.eco_profile_id) continue;
      const profiles = await base44.entities.EcoProfile.filter({ created_by: member.user_email });
      if (!profiles.length) continue;
      const profile = profiles[0];

      const existingBadges = profile.badges || [];
      const badgeExists = existingBadges.some(b => b.badge_id === rewards.badge.badge_id);
      const newBadges = badgeExists ? existingBadges : [...existingBadges, { ...rewards.badge, unlocked_at: new Date().toISOString() }];

      await base44.entities.EcoProfile.update(profile.id, {
        experience_points: (profile.experience_points || 0) + rewards.xp,
        credits: (profile.credits || 0) + rewards.credits,
        total_impact_score: (profile.total_impact_score || 0) + rewards.xp,
        badges: newBadges,
      });
    }

    updateMutation.mutate({ id: session.id, data: { status: 'recompenses_distribuees' } });
    setDistributed(prev => ({ ...prev, [session.id]: true }));
    setDistributing(null);
  };

  const [copied, setCopied] = useState(null);
  const copyCode = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // --- Gestion formation d'équipes par l'enseignant ---
  const [managingSession, setManagingSession] = useState(null); // session en cours de gestion
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearchEleve = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);
    const q = searchQuery.trim().toUpperCase();
    // Cherche par numéro TN ou par prénom/nom
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
      setSearchError(`${eleve.prenom} ${eleve.nom} est déjà dans une équipe.`);
      return;
    }
    const newMember = {
      eleve_id: eleve.id,
      eleve_numero: eleve.numero,
      user_name: `${eleve.prenom} ${eleve.nom}`,
      user_email: eleve.numero,
      eco_profile_id: '',
    };
    const key = `members_${teamId}`;
    const updated = [...(session[key] || []), newMember];
    await base44.entities.BioFocusSession.update(session.id, { [key]: updated });
    qc.invalidateQueries(['biofocus-sessions']);
    setSearchResults([]);
    setSearchQuery('');
    setSearchError('');
  };

  const handleRemoveFromTeam = async (session, teamId, indexToRemove) => {
    const key = `members_${teamId}`;
    const updated = (session[key] || []).filter((_, i) => i !== indexToRemove);
    await base44.entities.BioFocusSession.update(session.id, { [key]: updated });
    qc.invalidateQueries(['biofocus-sessions']);
  };

  const handleDeduplicateTeam = async (session, teamId) => {
    const key = `members_${teamId}`;
    const members = session[key] || [];
    const seen = new Set();
    const deduped = members.filter(m => {
      const identifier = m.eleve_numero || m.user_name;
      if (seen.has(identifier)) return false;
      seen.add(identifier);
      return true;
    });
    if (deduped.length === members.length) return; // pas de doublon
    await base44.entities.BioFocusSession.update(session.id, { [key]: deduped });
    qc.invalidateQueries(['biofocus-sessions']);
  };

  const handleDeduplicateSession = async (session) => {
    await handleDeduplicateTeam(session, 'team1');
    await handleDeduplicateTeam(session, 'team2');
  };

  const countDuplicates = (session) => {
    let count = 0;
    for (const teamId of ['team1', 'team2']) {
      const members = session[`members_${teamId}`] || [];
      const seen = new Set();
      for (const m of members) {
        const id = m.eleve_numero || m.user_name;
        if (seen.has(id)) count++;
        else seen.add(id);
      }
    }
    return count;
  };

  const [renamingSession, setRenamingSession] = useState(null); // session.id en cours de renommage
  const [renameValue, setRenameValue] = useState('');

  const handleRenameStart = (session) => {
    setRenamingSession(session.id);
    setRenameValue(session.nom_classe);
  };

  const handleRenameConfirm = async (session) => {
    if (!renameValue.trim() || renameValue.trim() === session.nom_classe) {
      setRenamingSession(null);
      return;
    }
    await base44.entities.BioFocusSession.update(session.id, { nom_classe: renameValue.trim() });
    qc.invalidateQueries(['biofocus-sessions']);
    setRenamingSession(null);
  };

  const mySessions = sessions.filter(s => s.enseignant_email === user.email);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">👩‍🏫 Mes Sessions Bio-Focus</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-sm font-bold transition-all"
        >
          + Nouvelle session
        </button>
      </div>

      {mySessions.length === 0 && (
        <div className="text-center py-10 text-white/40 text-sm">
          Aucune session créée. Créez-en une pour générer les codes équipes.
        </div>
      )}

      {mySessions.map(session => {
        const s1 = calcScore(session.captures_team1 || {}).score;
        const s2 = calcScore(session.captures_team2 || {}).score;
        const winner = s1 > s2 ? 'team1' : s2 > s1 ? 'team2' : 'egalite';
        const m1 = (session.members_team1 || []).length;
        const m2 = (session.members_team2 || []).length;

        return (
          <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {renamingSession === session.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleRenameConfirm(session); if (e.key === 'Escape') setRenamingSession(null); }}
                          className="rounded-lg bg-black/40 border border-emerald-400/50 text-white font-black px-2 py-0.5 text-sm focus:outline-none w-48"
                        />
                        <button onClick={() => handleRenameConfirm(session)} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => setRenamingSession(null)} className="text-white/40 hover:text-white/60 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white">{session.nom_classe}</span>
                        <button onClick={() => handleRenameStart(session)} className="text-white/20 hover:text-white/60 transition-colors" title="Renommer la session">
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      session.status === 'en_cours' ? 'bg-green-500/20 text-green-300' :
                      session.status === 'termine' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {session.status === 'en_cours' ? '🟢 En cours' : session.status === 'termine' ? '🏁 Terminé' : '✅ Récompenses distribuées'}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs">{session.date_session}</p>
                </div>
                {session.status === 'en_cours' && countDuplicates(session) > 0 && (
                  <button
                    onClick={() => handleDeduplicateSession(session)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-400/30 font-bold transition-all"
                    title="Supprimer les noms en double dans les équipes"
                  >
                    🧹 {countDuplicates(session)} doublon{countDuplicates(session) > 1 ? 's' : ''}
                  </button>
                )}
                {session.status === 'en_cours' && (
                  <button onClick={() => handleCloture(session)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 font-bold transition-all">
                    🏁 Clôturer
                  </button>
                )}
                {session.status === 'termine' && !distributed[session.id] && (
                  <button
                    onClick={() => handleDistributeRewards(session)}
                    disabled={distributing === session.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 font-bold transition-all disabled:opacity-50"
                  >
                    {distributing === session.id ? '⏳ Distribution…' : '🎁 Distribuer récompenses'}
                  </button>
                )}
                {(session.status === 'recompenses_distribuees' || distributed[session.id]) && (
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 border border-green-400/30 font-bold">
                    ✅ Récompenses distribuées
                  </span>
                )}
                <button
                  onClick={() => handleDelete(session)}
                  title="Supprimer cette session"
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400/50 hover:text-red-400 border border-red-400/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Codes équipes */}
            {session.status === 'en_cours' && (
              <div className="p-4 grid grid-cols-2 gap-3 border-b border-white/10">
                {TEAMS_CONFIG.map(team => (
                  <div key={team.id} className={`p-3 rounded-xl border ${team.border} ${team.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{team.emoji}</span>
                      <span className="text-white/80 text-xs font-bold">{team.name}</span>
                      <span className="text-white/50 text-xs">({team.id === 'team1' ? m1 : m2} élèves)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-center text-lg font-black text-white tracking-widest bg-black/30 rounded-lg py-1">
                        {session[team.codeKey]}
                      </code>
                      <button
                        onClick={() => copyCode(session[team.codeKey], `${session.id}-${team.id}`)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                      >
                        {copied === `${session.id}-${team.id}` ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formation d'équipes par l'enseignant */}
            {session.status === 'en_cours' && (
              <div className="p-4 border-b border-white/10">
                <button
                  onClick={() => { setManagingSession(managingSession === session.id ? null : session.id); setSearchQuery(''); setSearchResults([]); setSearchError(''); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 text-emerald-300 text-sm font-bold transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  {managingSession === session.id ? 'Fermer la gestion des équipes' : '👥 Former les équipes (ajouter des élèves)'}
                </button>

                <AnimatePresence>
                  {managingSession === session.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4">
                        {/* Recherche d'élève */}
                        <div>
                          <label className="text-white/60 text-xs mb-1.5 block">Chercher un élève par numéro TN, prénom ou nom</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={e => { setSearchQuery(e.target.value); setSearchError(''); }}
                              onKeyDown={e => e.key === 'Enter' && handleSearchEleve()}
                              placeholder="TN-G042 ou Martin Dupont…"
                              className="flex-1 rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50"
                            />
                            <button
                              onClick={handleSearchEleve}
                              disabled={searchLoading || !searchQuery.trim()}
                              className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-all disabled:opacity-40"
                            >
                              {searchLoading ? '⏳' : <Search className="w-4 h-4" />}
                            </button>
                          </div>
                          {searchError && <p className="text-red-300 text-xs mt-1.5">⚠️ {searchError}</p>}
                        </div>

                        {/* Résultats de recherche */}
                        {searchResults.length > 0 && (
                          <div className="space-y-2">
                            {searchResults.map(eleve => {
                              const alreadyIn = [...(session.members_team1 || []), ...(session.members_team2 || [])].some(m => m.eleve_numero === eleve.numero);
                              return (
                                <div key={eleve.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${alreadyIn ? 'border-white/10 bg-white/5 opacity-50' : 'border-white/10 bg-white/5'}`}>
                                  <div>
                                    <div className="text-white text-sm font-bold">{eleve.prenom} {eleve.nom}</div>
                                    <div className="text-white/40 text-xs font-mono">{eleve.numero}</div>
                                    {alreadyIn && <div className="text-amber-400 text-xs">Déjà dans une équipe</div>}
                                  </div>
                                  {!alreadyIn && (
                                    <div className="flex gap-2">
                                      {TEAMS_CONFIG.map(team => (
                                        <button
                                          key={team.id}
                                          onClick={() => handleAddToTeam(session, eleve, team.id)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${team.btn} ${team.border}`}
                                        >
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

                        {/* Liste actuelle des équipes avec suppression */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {TEAMS_CONFIG.map(team => {
                            const members = team.id === 'team1' ? (session.members_team1 || []) : (session.members_team2 || []);
                            return (
                              <div key={team.id} className={`p-3 rounded-xl border ${team.border} ${team.bg}`}>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <span>{team.emoji}</span>
                                  <span className="text-white/80 text-xs font-bold">{team.name}</span>
                                  <span className="text-white/40 text-xs">({members.length})</span>
                                </div>
                                {members.length === 0 ? (
                                  <p className="text-white/30 text-xs italic">Aucun élève</p>
                                ) : (
                                  <div className="space-y-1">
                                   {members.map((m, i) => (
                                     <div key={i} className="flex items-center justify-between gap-1">
                                       <span className="text-xs text-white/70 truncate">{m.user_name}</span>
                                       <button
                                         onClick={() => handleRemoveFromTeam(session, team.id, i)}
                                         className="flex-shrink-0 p-0.5 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all"
                                       >
                                         <X className="w-3 h-3" />
                                       </button>
                                     </div>
                                   ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Scores */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {TEAMS_CONFIG.map(team => {
                const score = team.id === 'team1' ? s1 : s2;
                const members = team.id === 'team1' ? (session.members_team1 || []) : (session.members_team2 || []);
                const isWinner = session.status !== 'en_cours' && winner === team.id;
                return (
                  <div key={team.id} className={`p-3 rounded-xl border ${isWinner ? team.border : 'border-white/10'} ${isWinner ? team.bg : 'bg-white/5'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isWinner && <Trophy className="w-4 h-4 text-amber-400" />}
                      <span>{team.emoji}</span>
                      <span className="text-white/80 text-xs font-bold">{team.name}</span>
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{score} pts</div>
                    <div className="text-white/50 text-xs mb-1">{members.length} élève{members.length !== 1 ? 's' : ''}</div>
                    <div className="space-y-0.5">
                      {members.map((m, i) => (
                        <div key={i} className="text-xs text-white/60">{m.user_name}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Modal création */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 rounded-3xl border border-emerald-400/20 p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-black text-white">🆕 Nouvelle session Bio-Focus</h3>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm font-semibold mb-1 block">Nom de la classe</label>
                  <input
                    type="text"
                    value={nomClasse}
                    onChange={e => setNomClasse(e.target.value)}
                    placeholder="Ex : 6B, CM2, 3ème, Year 5…"
                    className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-3 py-2 text-sm placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm font-semibold mb-1 block">Degré / niveau <span className="font-normal text-white/40">(optionnel)</span></label>
                  <input
                    type="text"
                    value={degre}
                    onChange={e => setDegre(e.target.value)}
                    placeholder="Ex : primaire, 6H, collège, lycée…"
                    className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-3 py-2 text-sm placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm font-semibold mb-1 block">Date de la session terrain</label>
                  <input
                    type="date"
                    value={dateSession}
                    onChange={e => setDateSession(e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-3 py-2 text-sm"
                  />
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
                  💡 Deux codes uniques seront générés automatiquement. Distribuez-les à vos élèves pour qu'ils rejoignent leur équipe.
                </div>
                <button
                  onClick={handleCreate}
                  disabled={!nomClasse.trim() || createMutation.isPending}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 transition-all"
                >
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