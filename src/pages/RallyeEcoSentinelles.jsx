import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import RallyeTeacherPanel from '@/components/rallye/RallyeTeacherPanel';
import { RallyeStudentJoin, RallyeGameView } from '@/components/rallye/RallyeStudentView';
import { RALLYE_DEFIS } from '@/data/rallyeData';

const STORAGE_KEY = 'tn_rallye_session';

function ReglesModal({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-emerald-400/20 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-black text-white">📋 Règles — Rallye des Éco-Sentinelles</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4 text-sm text-white/80">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20">
            <h3 className="font-bold text-amber-300 mb-2">🎯 Objectif</h3>
            <p>Deux équipes s'affrontent pour valider les 7 défis écologiques et obtenir les 7 clés du <strong className="text-amber-300">Coffre de la Planète</strong>. L'équipe avec le score le plus élevé gagne !</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20">
            <h3 className="font-bold text-blue-300 mb-2">🖥️ Défis Intérieurs (4 défis — 100 pts chacun)</h3>
            <p className="text-white/60 mb-2">Mini-jeux directement dans l'app :</p>
            <div className="grid grid-cols-2 gap-2">
              {RALLYE_DEFIS.filter(d => d.mode === 'interieur').map(d => (
                <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span>{d.emoji}</span><span className="text-xs">{d.titre}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20">
            <h3 className="font-bold text-amber-300 mb-2">🌿 Défis Terrain (3 défis — 150 pts chacun)</h3>
            <p className="text-white/60 mb-2">Sortez dehors, photographiez des preuves réelles, l'enseignant valide :</p>
            <div className="grid grid-cols-1 gap-2">
              {RALLYE_DEFIS.filter(d => d.mode === 'terrain').map(d => (
                <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span>{d.emoji}</span>
                  <div><p className="text-xs font-bold">{d.titre}</p><p className="text-[10px] text-white/40">{d.consigne.slice(0, 60)}…</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/20">
            <h3 className="font-bold text-sky-300 mb-2">👩‍🏫 Rôle de l'enseignant</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-white/70">
              <li>Créer une session et distribuer un code par équipe</li>
              <li>Lancer les défis (intérieurs et terrain en parallèle)</li>
              <li>Valider les <strong className="text-amber-300">preuves photos terrain</strong> depuis le panneau enseignant</li>
              <li>Clôturer la session et annoncer le gagnant</li>
            </ol>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-white mb-2">🎒 Rôle des élèves</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-white/70">
              <li>Rejoindre avec son prénom/nom + code équipe</li>
              <li>Alterner défis intérieurs (app) et terrain (photos)</li>
              <li>Les défis terrain = sortir dehors photographier des preuves réelles</li>
              <li>Collecter les 7 clés → assembler le code secret !</li>
            </ol>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-400/20">
              <p className="font-bold text-green-300">Score max</p>
              <p className="text-white/60">4×100 + 3×150 = <strong className="text-white">850 pts</strong></p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
              <p className="font-bold text-purple-300">Durée</p>
              <p className="text-white/60">~45 min à 1h30 selon le groupe</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20">
              <p className="font-bold text-amber-300">Récompense</p>
              <p className="text-white/60">Code secret + 🏆 badge équipe</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TABS = [
  { id: 'jeu', label: 'Jeu', icon: '🎮' },
  { id: 'classement', label: 'Classement', icon: '🏆' },
  { id: 'regles', label: 'Règles', icon: '📋' },
];

export default function RallyeEcoSentinelles() {
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [activeTab, setActiveTab] = useState('jeu');
  const [showRules, setShowRules] = useState(false);

  const [mySessionId, setMySessionId] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.sessionId || null; } catch { return null; }
  });
  const [myTeam, setMyTeam] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.team || null; } catch { return null; }
  });
  const [myEleve, setMyEleve] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.eleve || null; } catch { return null; }
  });

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setIsTeacher(u?.role === 'admin'); }).catch(() => {});
  }, []);

  const { data: sessions = [], refetch } = useQuery({
    queryKey: ['rallye-sessions'],
    queryFn: () => base44.entities.RallyeSession.list('-created_date', 100),
    enabled: !!user,
    refetchInterval: 8000,
  });

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-emerald-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  const currentSession = mySessionId ? sessions.find(s => s.id === mySessionId) || null : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-emerald-950">
      <BiolumiHeader currentPage="RallyeEcoSentinelles" />

      <main className="pt-20 pb-32 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-400/20 mb-3">
            <span className="text-amber-300 font-semibold text-sm">🌿 Jeu Hybride Intérieur + Terrain</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">
            🌍 Le Rallye des Éco-Sentinelles
          </h1>
          <p className="text-white/50 text-sm">7 défis • 2 équipes • Intérieur & Terrain</p>
        </motion.div>

        {/* Onglets */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => tab.id === 'regles' ? setShowRules(true) : setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                activeTab === tab.id && tab.id !== 'regles'
                  ? 'bg-amber-500/20 border-amber-400/30 text-amber-300'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
              }`}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'jeu' && (
          <div>
            {/* VUE ENSEIGNANT */}
            {isTeacher && <RallyeTeacherPanel sessions={sessions} user={user} />}

            {/* VUE ÉLÈVE */}
            {!isTeacher && (
              <>
                {mySessionId && myTeam && myEleve ? (
                  currentSession
                    ? <RallyeGameView session={currentSession} teamId={myTeam} eleve={myEleve} />
                    : <div className="text-center text-white/50 py-10">⏳ Chargement de la session…</div>
                ) : (
                  <RallyeStudentJoin sessions={sessions} onJoined={({ session, team, eleve }) => {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId: session.id, team, eleve }));
                    setMySessionId(session.id); setMyTeam(team); setMyEleve(eleve);
                    refetch();
                  }} />
                )}
                {mySessionId && (
                  <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setMySessionId(null); setMyTeam(null); setMyEleve(null); }}
                    className="mt-4 w-full py-2 text-white/30 text-xs hover:text-white/60 transition-colors">
                    ← Changer de session
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'classement' && (
          <div className="space-y-3">
            <h2 className="text-lg font-black text-white mb-4">🏆 Classement des sessions</h2>
            {sessions.length === 0 && <p className="text-center text-white/40 py-8">Aucune session active.</p>}
            {sessions.map(session => {
              const s1 = Object.values(session.defis_team1 || {}).reduce((s, d) => s + (d?.score || 0), 0);
              const s2 = Object.values(session.defis_team2 || {}).reduce((s, d) => s + (d?.score || 0), 0);
              return (
                <div key={session.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-black">{session.nom_classe}</p>
                      <p className="text-white/40 text-xs">{session.date_session}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${session.status === 'en_cours' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {session.status === 'en_cours' ? '🟢 En cours' : '🏁 Terminé'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ key: 'team1', score: s1, name: '🌱 Les Pionniers Verts' }, { key: 'team2', score: s2, name: '🦋 Les Éco-Explorateurs' }].map(t => (
                      <div key={t.key} className={`p-3 rounded-xl border text-center ${session.winner_team === t.key ? 'border-amber-400/60 bg-amber-500/15' : 'border-white/10 bg-white/5'}`}>
                        {session.winner_team === t.key && <p className="text-amber-400 text-xs font-bold mb-1">🏆 Gagnant</p>}
                        <p className="text-white text-xs font-bold mb-1">{t.name}</p>
                        <p className="text-2xl font-black text-white">{t.score}</p>
                        <p className="text-white/40 text-xs">pts</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-center text-emerald-200/70 text-xs">
          🌿 <strong className="text-emerald-300">Score max :</strong> 4 défis intérieurs (100 pts) + 3 défis terrain (150 pts) = <strong className="text-emerald-200">850 pts</strong>
        </div>
      </main>

      <AnimatePresence>
        {showRules && <ReglesModal onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </div>
  );
}