import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Copy, CheckCircle, X, Trash2, Flag, UserPlus, Search, ClipboardList } from 'lucide-react';
import { RALLYE_TEAMS, RALLYE_DEFIS, generateCode, calcRallyeScore } from '@/data/rallyeData';

export default function RallyeTeacherPanel({ sessions, user }) {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [nomClasse, setNomClasse] = useState('');
  const [dateSession, setDateSession] = useState('');
  const [copied, setCopied] = useState(null);

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

  const handleLancer = (session) => {
    updateMutation.mutate({ id: session.id, data: { status: 'en_cours' } });
  };

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

  // --- Gestion formation d'équipes ---
  const [managingSession, setManagingSession] = useState(null);
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

  const [saisieSession, setSaisieSession] = useState(null); // sessionId-teamId

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

        return (
          <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {/* Header session */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-white">{session.nom_classe}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    session.status === 'preparation' ? 'bg-blue-500/20 text-blue-300' :
                    session.status === 'en_cours' ? 'bg-green-500/20 text-green-300' :
                    'bg-amber-500/20 text-amber-300'}`}>
                    {session.status === 'preparation' ? '🔧 Préparation' : session.status === 'en_cours' ? '🟢 En cours' : '🏁 Terminé'}
                  </span>
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

            {/* Codes équipes */}
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
                    {/* Liste des membres */}
                    {(session[team.membersKey] || []).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {(session[team.membersKey] || []).map((m, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-white/60">
                            <span className="font-mono text-white/40 text-[10px]">{m.eleve_numero || '—'}</span>
                            <span>{m.user_name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Formation d'équipes par l'enseignant */}
            {(session.status === 'preparation' || session.status === 'en_cours') && (
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
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="mt-4 space-y-4">
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
                            <input
                              type="text" value={searchQuery}
                              onChange={e => { setSearchQuery(e.target.value); setSearchError(''); }}
                              onKeyDown={e => e.key === 'Enter' && handleSearchEleve()}
                              placeholder="TN-G042 ou Martin Dupont…"
                              className="flex-1 rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50"
                            />
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Bannière préparation */}
            {session.status === 'preparation' && (
              <div className="mx-4 mb-2 p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs flex items-start gap-2">
                <span className="text-lg">ℹ️</span>
                <div>
                  <strong>Phase de préparation</strong> — Constituez vos équipes ci-dessus, puis cliquez sur <strong>🚀 Lancer le rallye</strong> pour démarrer la session. Une fois lancée, les élèves pourront rejoindre avec leur code et vous pourrez saisir leurs résultats.
                </div>
              </div>
            )}

            {/* Progression des défis */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {RALLYE_TEAMS.map(team => {
                const defis = session[team.defisKey] || {};
                const validated = Object.values(defis).filter(d => d?.validated).length;
                const score = team.id === 'team1' ? s1 : s2;
                const isWinner = session.status === 'termine' && session.winner_team === team.id;
                return (
                  <div key={team.id} className={`p-3 rounded-xl border ${isWinner ? team.border : 'border-white/10'} ${isWinner ? team.bg : 'bg-white/5'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isWinner && <span className="text-amber-400">🏆</span>}
                      <span>{team.emoji}</span>
                      <span className="text-white/80 text-xs font-bold">{team.name}</span>
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{score} pts</div>
                    <div className="flex gap-1 mb-1">
                      {RALLYE_DEFIS.map(d => (
                        <div key={d.id} title={d.titre}
                          className={`flex-1 h-2 rounded-full ${defis[d.id]?.validated ? 'bg-green-400' : 'bg-white/15'}`} />
                      ))}
                    </div>
                    <div className="text-white/50 text-xs">{validated}/7 défis validés</div>
                    {/* Preuves terrain en attente */}
                    {Object.entries(defis).filter(([, d]) => d?.preuves?.length > 0 && !d?.validated).map(([did, d]) => (
                      <div key={did} className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-400/20">
                        <p className="text-amber-300 text-xs font-bold mb-1">📷 Preuves terrain à valider — {RALLYE_DEFIS.find(x => x.id === did)?.titre}</p>
                        <div className="flex gap-1 flex-wrap">
                          {d.preuves.map((url, i) => (
                            <img key={i} src={url} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/20" />
                          ))}
                        </div>
                        <button onClick={async () => {
                          const updated = { ...defis, [did]: { ...d, validated: true, score: RALLYE_DEFIS.find(x => x.id === did)?.points || 150 } };
                          await base44.entities.RallyeSession.update(session.id, { [team.defisKey]: updated });
                          qc.invalidateQueries(['rallye-sessions']);
                        }} className="mt-1.5 w-full py-1 rounded-lg bg-green-500/30 hover:bg-green-500/50 text-green-300 text-xs font-bold border border-green-400/30 transition-all">
                          ✅ Valider les preuves
                        </button>
                      </div>
                    ))}

                    {/* Saisie manuelle des défis */}
                    {session.status === 'en_cours' && (
                      <>
                        <button onClick={() => setSaisieSession(saisieSession === `${session.id}-${team.id}` ? null : `${session.id}-${team.id}`)}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs font-bold border border-white/10 transition-all">
                          <ClipboardList className="w-3.5 h-3.5" />
                          {saisieSession === `${session.id}-${team.id}` ? 'Fermer saisie manuelle' : 'Saisie manuelle des défis'}
                        </button>
                        <AnimatePresence>
                          {saisieSession === `${session.id}-${team.id}` && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <div className="mt-2 space-y-1.5">
                                {RALLYE_DEFIS.map(defi => {
                                  const etat = defis[defi.id];
                                  const isDone = etat?.validated;
                                  return (
                                    <div key={defi.id} className={`flex items-center justify-between gap-2 p-2 rounded-lg border ${isDone ? 'bg-green-500/10 border-green-400/20' : 'bg-white/5 border-white/10'}`}>
                                      <span className="text-xs text-white/70 flex-1">{defi.emoji} {defi.titre}</span>
                                      <span className="text-xs text-white/40">{defi.points} pts</span>
                                      {isDone
                                        ? <span className="text-green-400 text-xs font-bold">✅ {etat.score} pts</span>
                                        : <button onClick={async () => {
                                            const updated = { ...defis, [defi.id]: { validated: true, score: defi.points, timestamp: new Date().toISOString() } };
                                            await base44.entities.RallyeSession.update(session.id, { [team.defisKey]: updated });
                                            qc.invalidateQueries(['rallye-sessions']);
                                          }} className="px-2 py-0.5 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-300 text-xs font-bold border border-emerald-400/30 transition-all">
                                            Valider
                                          </button>
                                      }
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
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