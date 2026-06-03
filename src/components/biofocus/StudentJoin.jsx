import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { TEAMS_CONFIG } from './BioFocusData';

// Identité élève stockée en localStorage (pas de compte nécessaire)
const STORAGE_KEY = 'tn_eleve_identity';

export function getEleveIdentity() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

export function setEleveIdentity(eleve) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eleve));
}

export default function StudentJoin({ sessions, onJoined }) {
  const qc = useQueryClient();
  const [step, setStep] = useState('identity'); // 'identity' | 'team'
  const [identityMode, setIdentityMode] = useState('numero'); // 'numero' | 'nom'
  const [numeroInput, setNumeroInput] = useState('');
  const [prenomInput, setPrenomInput] = useState('');
  const [nomInput, setNomInput] = useState('');
  const [eleveFound, setEleveFound] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Étape 1 : Identifier l'élève
  const handleIdentify = async () => {
    setError('');
    setLoading(true);
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
        setLoading(false);
        return;
      }
      const eleve = results[0];
      setEleveIdentity(eleve);
      setEleveFound(eleve);
      setStep('team');
    } catch (e) {
      setError("Erreur de connexion. Réessayez.");
    }
    setLoading(false);
  };

  // Étape 2 : Rejoindre une équipe
  const handleJoin = async () => {
    setError('');
    setLoading(true);
    const codeUp = code.toUpperCase().trim();
    const eleve = eleveFound;

    let foundSession = null;
    let foundTeam = null;
    for (const session of sessions) {
      if (session.status !== 'en_cours') continue;
      if (session.code_team1 === codeUp) { foundSession = session; foundTeam = 'team1'; break; }
      if (session.code_team2 === codeUp) { foundSession = session; foundTeam = 'team2'; break; }
    }

    if (!foundSession) {
      setError('Code équipe invalide ou session déjà terminée.');
      setLoading(false);
      return;
    }

    // Vérifier si déjà inscrit (par numéro élève)
    const allMembers = [...(foundSession.members_team1 || []), ...(foundSession.members_team2 || [])];
    if (allMembers.some(m => m.eleve_numero === eleve.numero)) {
      setError('Vous êtes déjà inscrit dans cette session.');
      setLoading(false);
      return;
    }

    const newMember = {
      eleve_id: eleve.id,
      eleve_numero: eleve.numero,
      user_name: `${eleve.prenom} ${eleve.nom}`,
      user_email: eleve.numero, // fallback pour compatibilité
      eco_profile_id: '',
    };

    const updatedMembers = [...(foundSession[`members_${foundTeam}`] || []), newMember];
    await base44.entities.BioFocusSession.update(foundSession.id, { [`members_${foundTeam}`]: updatedMembers });

    qc.invalidateQueries(['biofocus-sessions']);
    onJoined?.({ session: foundSession, team: foundTeam, eleve });
    setLoading(false);
  };

  // ── Étape 1 : Identification ──
  if (step === 'identity') {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎒</div>
          <h2 className="text-2xl font-black text-white mb-2">Qui es-tu ?</h2>
          <p className="text-white/60 text-sm">Identifie-toi pour rejoindre une session Bio-Focus</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          {/* Mode de saisie */}
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
              <input
                value={numeroInput}
                onChange={e => { setNumeroInput(e.target.value.toUpperCase()); setError(''); }}
                placeholder="TN-G042 ou TN-F017"
                className="w-full text-center text-xl font-black tracking-widest rounded-xl bg-black/30 border border-white/20 text-white px-4 py-4 focus:outline-none focus:border-emerald-400/50 uppercase"
                autoCapitalize="characters"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-xs mb-1 block">Prénom</label>
                <input value={prenomInput} onChange={e => { setPrenomInput(e.target.value); setError(''); }}
                  placeholder="Ton prénom"
                  className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-blue-400/50 text-sm" />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Nom de famille</label>
                <input value={nomInput} onChange={e => { setNomInput(e.target.value); setError(''); }}
                  placeholder="Ton nom"
                  className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-blue-400/50 text-sm" />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm text-center">⚠️ {error}</div>
          )}

          <button
            onClick={handleIdentify}
            disabled={loading || (identityMode === 'numero' ? numeroInput.length < 5 : !prenomInput.trim() || !nomInput.trim())}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-base hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 transition-all"
          >
            {loading ? '⏳ Recherche…' : '✅ Continuer'}
          </button>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-white/30 text-xs text-center">
          Tu ne te souviens pas de ton numéro ? Demande à ton enseignant(e).
        </div>
      </div>
    );
  }

  // ── Étape 2 : Code équipe ──
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔬</div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 mb-3">
          <span className="text-emerald-300 font-bold text-sm">👤 {eleveFound?.prenom} {eleveFound?.nom}</span>
          <span className="text-emerald-400/50 font-mono text-xs">{eleveFound?.numero}</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-1">Rejoindre une équipe</h2>
        <p className="text-white/60 text-sm">Entre le code équipe donné par ton enseignant(e)</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div>
          <label className="text-white/70 text-sm font-semibold mb-2 block">Code équipe</label>
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
            placeholder="EX: ABC123"
            maxLength={6}
            className="w-full text-center text-2xl font-black tracking-widest rounded-xl bg-black/30 border border-white/20 text-white px-4 py-4 focus:outline-none focus:border-emerald-400/50"
          />
        </div>
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm text-center">⚠️ {error}</div>
        )}
        <button
          onClick={handleJoin}
          disabled={code.length < 4 || loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-base hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 transition-all"
        >
          {loading ? '⏳ Vérification…' : '🚀 Rejoindre l\'équipe'}
        </button>
        <button onClick={() => { setStep('identity'); setCode(''); setError(''); }}
          className="w-full py-2 text-white/30 text-sm hover:text-white/60 transition-colors">
          ← Changer d'identité
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {TEAMS_CONFIG.map(team => (
          <div key={team.id} className={`p-3 rounded-xl border ${team.border} ${team.bg} text-center`}>
            <div className="text-2xl mb-1">{team.emoji}</div>
            <div className="text-white/80 text-xs font-bold">{team.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}