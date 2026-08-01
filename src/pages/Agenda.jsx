import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Calendar, MapPin, Users, Mail, CheckCircle2, Loader2, BookOpen, Leaf, Recycle, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BiolumiHeader from '@/components/shared/BiolumiHeader';

const TYPE_ATELIER = [
  { id: 'decouverte_biodiversite', label: 'Découverte Biodiversité', emoji: '🦋', desc: 'Observation faune & flore locale' },
  { id: 'bio_focus_terrain', label: 'Bio-Focus Terrain', emoji: '🔬', desc: 'Inventaire des espèces du sol' },
  { id: 'permaculture', label: 'Permaculture', emoji: '🌾', desc: 'Visite de la micro-ferme' },
  { id: 'recyclage', label: 'Recyclage', emoji: '♻️', desc: 'Atelier tri sélectif et déchets' },
  { id: 'autre', label: 'Autre', emoji: '✨', desc: 'Précisez dans le message' },
];

export default function AgendaPage() {
  const [form, setForm] = useState({
    nom_ecole: '', nom_enseignant: '', email_enseignant: '', classe_niveau: '',
    nombre_eleves: '', date_souhaitee: '', date_alternative: '', type_atelier: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const generateCodeBilan = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `TN-${part1}-${part2}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const code_bilan = generateCodeBilan();
      const rdv = await base44.entities.RendezVous.create({
        ...form,
        nombre_eleves: form.nombre_eleves ? Number(form.nombre_eleves) : undefined,
        statut: 'en_attente',
        code_bilan,
      });
      await base44.functions.invoke('sendRdvNotification', { rdvId: rdv.id });
      setSuccess(true);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
        <BiolumiHeader currentPage="Agenda" />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 rounded-3xl bg-white/5 border border-emerald-400/20 max-w-lg mx-4">
            <div className="text-6xl mb-6">🌿</div>
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-3">Demande envoyée !</h2>
            <p className="text-white/60 mb-6">
              Votre demande de RDV a bien été reçue. Vous recevrez une confirmation par email dans les plus brefs délais.
            </p>
            <Button onClick={() => { setSuccess(false); setForm({ nom_ecole: '', nom_enseignant: '', email_enseignant: '', classe_niveau: '', nombre_eleves: '', date_souhaitee: '', date_alternative: '', type_atelier: '', message: '' }); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-8">
              Nouvelle demande
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
      <BiolumiHeader currentPage="Agenda" />
      <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-4">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-semibold text-sm">Réservation d'atelier pédagogique</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Prendre un <span className="text-emerald-400">Rendez-vous</span></h1>
          <p className="text-white/50 max-w-xl mx-auto">Réservez une sortie nature ou un atelier pour votre classe. Notre équipe vous confirmera le créneau par email.</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} className="space-y-6">

          {/* Identité */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Identification
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Nom de l'école *</label>
                <input required value={form.nom_ecole} onChange={e => update('nom_ecole', e.target.value)}
                  placeholder="École primaire des Pins" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Nom de l'enseignant *</label>
                <input required value={form.nom_enseignant} onChange={e => update('nom_enseignant', e.target.value)}
                  placeholder="Marie Dupont" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Email *</label>
                <input required type="email" value={form.email_enseignant} onChange={e => update('email_enseignant', e.target.value)}
                  placeholder="marie.dupont@edu.ch" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Classe et niveau *</label>
                <input required value={form.classe_niveau} onChange={e => update('classe_niveau', e.target.value)}
                  placeholder="CM2 / Harmo 7e" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Nombre d'élèves</label>
                <input type="number" min="1" value={form.nombre_eleves} onChange={e => update('nombre_eleves', e.target.value)}
                  placeholder="25" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm" />
              </div>
            </div>
          </div>

          {/* Type d'atelier */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" /> Type d'atelier *
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TYPE_ATELIER.map(t => (
                <button key={t.id} type="button" onClick={() => update('type_atelier', t.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${form.type_atelier === t.id ? 'border-emerald-400/60 bg-emerald-500/15' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-white font-semibold text-xs">{t.label}</div>
                  <div className="text-white/40 text-xs mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" /> Disponibilités
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Date souhaitée *</label>
                <input required type="date" value={form.date_souhaitee} onChange={e => update('date_souhaitee', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-emerald-400/50 text-sm [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Date alternative</label>
                <input type="date" value={form.date_alternative} onChange={e => update('date_alternative', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-emerald-400/50 text-sm [color-scheme:dark]" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" /> Message (optionnel)
            </h3>
            <textarea value={form.message} onChange={e => update('message', e.target.value)}
              placeholder="Précisez vos besoins particuliers, contraintes, objectifs pédagogiques..."
              rows={4} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm resize-none" />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm">{error}</div>
          )}

          <Button type="submit" disabled={loading || !form.type_atelier}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 text-lg rounded-2xl shadow-2xl disabled:opacity-50">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours…</> : <><Calendar className="w-5 h-5 mr-2" /> Envoyer ma demande de RDV</>}
          </Button>
        </motion.form>
      </main>
    </div>
  );
}