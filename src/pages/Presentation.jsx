import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ChevronLeft, ChevronRight, Maximize2, Minimize2, Download,
  Globe, BookOpen, Leaf, Trophy, Flame, Recycle, Bug, Droplets,
  GraduationCap, Star, Zap, Users, CreditCard, Home, Calendar, ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  // 0 — Couverture
  {
    id: 'cover',
    bg: 'from-emerald-950 via-teal-950 to-slate-950',
    title: 'Couverture',
    content: (
      <div className="relative flex flex-col items-center justify-center h-full text-center px-8 py-16 min-h-[70vh] overflow-hidden">
        {/* Fond bleu Institut Le Rosey */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10, 30, 80, 0.92)' }} />
        {/* Reflet doré subtil comme le header */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-transparent to-yellow-600/5" />
        {/* Particules bioluminescentes */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />

        {/* Contenu */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Institut Le Rosey */}
          <motion.a
            href="https://www.rosey.ch" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="mb-6"
          >
            <img
              src="https://media.base44.com/images/public/6959886137576a65dcfe1370/386bb9e92_Institut_Le_Rosey_logo.png"
              alt="Institut Le Rosey"
              style={{ height: '64px', width: 'auto', objectFit: 'contain' }}
            />
          </motion.a>

          {/* Séparateur doré */}
          <div className="w-32 h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, rgba(234,179,8,0.5), transparent)' }} />

          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="w-28 h-28 rounded-full overflow-hidden shadow-2xl shadow-emerald-500/50 mb-8">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png"
              alt="Terre" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-4">
            Chroniques de<br />Terra Nova
          </h1>
          <p className="text-2xl text-emerald-300/80 mb-8 max-w-2xl">
            La plateforme éducative pour explorer, comprendre et protéger notre planète
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['Enseignants', 'Élèves', 'Familles', 'Établissements scolaires'].map(p => (
              <span key={p} className="px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-base font-semibold">{p}</span>
            ))}
          </div>
          <p className="text-emerald-400/40 text-sm italic">© 2025 Terra Nova — Plateforme ludo-éducative</p>
        </div>
      </div>
    ),
  },

  // 1 — Problématique
  {
    id: 'probleme',
    bg: 'from-slate-950 via-red-950 to-slate-950',
    title: 'Le Défi',
    content: (
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center">Pourquoi Terra Nova ?</h2>
        <p className="text-white/60 text-center text-lg mb-10">Les jeunes d'aujourd'hui héritent d'une planète en crise. L'éducation est la première réponse.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { emoji: '🌡️', stat: '1,5°C', label: 'Hausse de température déjà atteinte', color: 'red' },
            { emoji: '🦋', stat: '40%', label: 'des espèces d\'insectes en déclin', color: 'amber' },
            { emoji: '🌊', stat: '8M', label: 'tonnes de plastique dans les océans chaque année', color: 'blue' },
          ].map((s, i) => (
            <div key={i} className={`p-6 rounded-3xl bg-${s.color}-500/10 border border-${s.color}-400/20 text-center`}>
              <div className="text-5xl mb-3">{s.emoji}</div>
              <div className={`text-4xl font-black text-${s.color}-300 mb-2`}>{s.stat}</div>
              <p className={`text-${s.color}-200/70 text-sm`}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-400/20 text-center">
          <p className="text-xl text-emerald-300 font-bold">
            🌱 Terra Nova transforme ces enjeux en apprentissages ludiques, engageants et mémorables pour les élèves.
          </p>
        </div>
      </div>
    ),
  },

  // 2 — C'est quoi
  {
    id: 'quoi',
    bg: 'from-slate-950 via-emerald-950 to-teal-950',
    title: "Qu'est-ce que c'est ?",
    content: (
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <Globe className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-black text-white">Une plateforme complète</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { emoji: '🎮', title: 'Ludique & Engageante', desc: 'Jeux interactifs, missions, quiz, simulations — les élèves apprennent en s\'amusant et reviennent d\'eux-mêmes.' },
            { emoji: '🔬', title: 'Scientifiquement Rigoureuse', desc: 'Données réelles, espèces authentiques, problématiques environnementales actuelles. Contenus validés et sourcés.' },
            { emoji: '👩‍🏫', title: 'Outil pour Enseignants', desc: 'Compatible avec les programmes SVT, géographie, éducation citoyenne. Gestion des classes et suivi des élèves intégrés.' },
            { emoji: '🏆', title: 'Système de Progression', desc: 'XP, crédits, badges, niveaux Éco-Sentinelle. Chaque action est valorisée et encourage la progression.' },
          ].map((c, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/5 border border-emerald-400/20 flex gap-4">
              <div className="text-4xl flex-shrink-0">{c.emoji}</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-300 mb-2">{c.title}</h3>
                <p className="text-emerald-200/60 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 3 — Modules
  {
    id: 'modules',
    bg: 'from-teal-950 via-cyan-950 to-slate-950',
    title: 'Les Modules',
    content: (
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-white mb-1 text-center">14 Modules Éducatifs</h2>
        <p className="text-cyan-300/60 text-center mb-6">Tous accessibles depuis une seule plateforme</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: '🗺️', name: 'Atlas des Biomes', color: 'emerald', desc: '9 biomes détaillés' },
            { emoji: '🦅', name: 'Biodiversité', color: 'teal', desc: '80+ espèces à identifier' },
            { emoji: '♻️', name: 'Recyclage', color: 'green', desc: '10 zones, 10 rôles' },
            { emoji: '🌾', name: 'Micro-ferme', color: 'lime', desc: '7 rôles agricoles' },
            { emoji: '🧠', name: 'Quiz', color: 'purple', desc: '5 catégories thématiques' },
            { emoji: '🎯', name: 'Missions', color: 'orange', desc: '4 niveaux de difficulté' },
            { emoji: '📚', name: 'Encyclopédie IA', color: 'cyan', desc: 'Agent conversationnel' },
            { emoji: '🌡️', name: 'Tableau Climat', color: 'blue', desc: 'Données temps réel' },
            { emoji: '📖', name: 'Écosphère', color: 'emerald', desc: '11 chapitres illustrés' },
            { emoji: '🐝', name: 'Pollinisation', color: 'yellow', desc: 'Module interactif' },
            { emoji: '🔬', name: 'Bio-Focus', color: 'amber', desc: 'Jeu de terrain ×1000' },
            { emoji: '🧩', name: 'Puzzle & Jeux', color: 'rose', desc: 'Mini-jeux éducatifs' },
            { emoji: '📅', name: 'Agenda Terrain', color: 'orange', desc: 'Réservation d\'ateliers' },
            { emoji: '📋', name: 'Bilan Pédagogique', color: 'yellow', desc: 'Rapport post-atelier' },
          ].map((m, i) => (
            <div key={i} className={`p-3 rounded-2xl bg-${m.color}-500/10 border border-${m.color}-400/20 text-center`}>
              <div className="text-2xl mb-1">{m.emoji}</div>
              <div className={`font-bold text-${m.color}-300 text-xs mb-0.5`}>{m.name}</div>
              <div className={`text-${m.color}-200/50 text-xs`}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 4 — Pour enseignants
  {
    id: 'enseignants',
    bg: 'from-blue-950 via-indigo-950 to-slate-950',
    title: 'Pour les Enseignants',
    content: (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30">
            <GraduationCap className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl font-black text-white">Pour les <span className="text-blue-300">Enseignants</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-5">
          {[
            { emoji: '📚', title: 'Intégration au programme', desc: 'Compatible SVT, géographie, éducation citoyenne — primaire au lycée.' },
            { emoji: '👥', title: 'Gestion des classes', desc: 'Créez vos classes, assignez des rôles et suivez la progression de chaque élève.' },
            { emoji: '🔢', title: 'Inscription des élèves', desc: 'Import CSV ou saisie manuelle. Chaque élève reçoit un numéro unique TN-F001 / TN-G001 selon son genre.' },
            { emoji: '🔬', title: 'Bio-Focus Terrain', desc: 'Organisez des sessions de terrain avec codes d\'accès par équipe et suivi des scores en temps réel.' },
            { emoji: '📅', title: 'Agenda & Ateliers', desc: 'Réservez en ligne des ateliers pédagogiques sur le terrain de permaculture. Confirmation automatique par email.' },
            { emoji: '📋', title: 'Bilan pédagogique', desc: 'Remplissez un dossier d\'évaluation complet après chaque sortie terrain, accessible via un code sécurisé.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-blue-400/20">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <h3 className="text-sm font-bold text-blue-300 mb-1">{item.title}</h3>
              <p className="text-blue-200/60 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-blue-200 text-sm text-center">
          💡 <strong>Interface administrateur dédiée</strong> — tableau de bord, gestion des contenus, statistiques de classe, export CSV
        </div>
      </div>
    ),
  },

  // 5 — Inscription élèves
  {
    id: 'inscription',
    bg: 'from-indigo-950 via-violet-950 to-slate-950',
    title: "Inscription des Élèves",
    content: (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30">
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white">Système d'inscription</h2>
            <p className="text-indigo-400/60 text-sm">Gestion des élèves — Aucun email requis</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-indigo-400/20">
            <h3 className="font-bold text-indigo-300 mb-4">👨‍🏫 Côté enseignant</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: '📋', text: 'Saisie manuelle ou import CSV d\'une liste de classe' },
                { icon: '⚡', text: 'Génération automatique des numéros TN-F001 (fille) / TN-G001 (garçon)' },
                { icon: '🔢', text: 'Chaque élève a un identifiant unique et permanent' },
                { icon: '📥', text: 'Export CSV de la liste avec tous les numéros attribués' },
                { icon: '🔍', text: 'Recherche par nom, prénom, classe ou numéro' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-indigo-200/70">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-violet-400/20">
            <h3 className="font-bold text-violet-300 mb-4">🎒 Côté élève</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: '🔑', text: 'Connexion avec le numéro TN attribué par l\'enseignant' },
                { icon: '👤', text: 'Ou connexion par prénom + nom de famille' },
                { icon: '📱', text: 'Aucun compte, aucun mot de passe, aucun email requis' },
                { icon: '⚡', text: 'Accès immédiat aux sessions Bio-Focus et activités' },
                { icon: '💾', text: 'Identité sauvegardée localement pour une reconnexion rapide' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-violet-200/70">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/20">
          <h3 className="text-indigo-300 font-bold text-sm mb-3">🔢 Format des numéros d'élève</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { num: 'TN-F001', label: 'Fille n°1', color: 'pink' },
              { num: 'TN-F017', label: 'Fille n°17', color: 'pink' },
              { num: 'TN-G001', label: 'Garçon n°1', color: 'blue' },
              { num: 'TN-G042', label: 'Garçon n°42', color: 'blue' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="font-mono text-lg font-black text-yellow-300 mb-1">{item.num}</div>
                <div className="text-white/50 text-xs">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-indigo-200/60 text-xs mt-3 text-center">Les numéros sont séquentiels et distincts par genre — ils persistent d'une session à l'autre.</p>
        </div>
      </div>
    ),
  },

  // 6 — Pour les élèves
  {
    id: 'eleves',
    bg: 'from-orange-950 via-amber-950 to-slate-950',
    title: 'Pour les Élèves',
    content: (
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30">
            <Star className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white">Pour les <span className="text-orange-300">Élèves</span></h2>
            <p className="text-orange-400/60">Deviens un Éco-Sentinelle !</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { emoji: '🌍', title: 'Explorer 9 biomes', desc: 'Forêts tropicales, océans, savanes, arctique, zones humides, déserts, montagnes, forêts tempérées et Sol & Humus.' },
            { emoji: '🦅', title: 'Identifier les espèces', desc: '80+ espèces — reconnaître à la photo ET au chant pour les oiseaux.' },
            { emoji: '♻️', title: 'Trier des déchets', desc: 'Jeu de rôle dans un hôtel : trie les déchets dans les bonnes poubelles.' },
            { emoji: '🌾', title: 'Gérer la micro-ferme', desc: 'Plante, récolte, transforme et vends dans l\'épicerie coopérative.' },
            { emoji: '🔬', title: 'Enquêter le sol', desc: 'Bio-Focus : photographie les organismes du sol avec un appareil ×1000.' },
            { emoji: '🀄', title: 'Eco-Mahjong', desc: 'Associe chaque ravageur agricole a son auxiliaire naturel en lutte biologique.' },
            { emoji: '🏅', title: 'Progresser & Gagner', desc: 'XP, crédits, badges, niveaux Éco-Sentinelle — chaque action compte.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-orange-400/20">
              <span className="text-3xl flex-shrink-0">{item.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-orange-300 mb-1">{item.title}</h3>
                <p className="text-orange-200/60 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 7 — Bio-Focus focus
  {
    id: 'biofocus',
    bg: 'from-slate-950 via-green-950 to-emerald-950',
    title: '🔬 Bio-Focus',
    content: (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-5xl">🔬</div>
          <div>
            <h2 className="text-4xl font-black text-white">Bio-Focus</h2>
            <p className="text-emerald-400/60">Les Enquêteurs de l'Humus — Jeu de terrain unique</p>
          </div>
        </div>
        <p className="text-emerald-200/70 text-lg mb-6">
          Un jeu ludo-éducatif <strong className="text-emerald-300">sur le terrain</strong> : 2 équipes photographient les organismes décomposeurs du sol avec un appareil ×1000. Qui construit l'écosystème le plus riche ?
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-400/20">
            <h3 className="font-bold text-sky-300 mb-3">👩‍🏫 L'enseignant</h3>
            <ul className="space-y-2 text-sky-200/70 text-sm">
              <li>• Crée la session (nom de classe + degré scolaire libre)</li>
              <li>• <strong className="text-white">Forme les équipes lui-même</strong> : recherche les élèves par numéro TN ou nom et les affecte à chaque équipe — sans que les élèves aient besoin d'un téléphone</li>
              <li>• Répartit ses élèves selon ses critères pédagogiques</li>
              <li>• Clôture la session → récompenses automatiques</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
            <h3 className="font-bold text-emerald-300 mb-3">🎒 Les élèves</h3>
            <ul className="space-y-2 text-emerald-200/70 text-sm">
              <li>• <strong className="text-white">Pas besoin de saisir de code</strong> — l'enseignant les affecte directement à leur équipe</li>
              <li>• Photographient les espèces in situ</li>
              <li>• Uploadent en temps réel depuis smartphone/tablette/<strong className="text-amber-300">Kideo ×1000</strong></li>
              <li>• Score mis à jour instantanément pour toute l'équipe</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center">
            <div className="text-2xl mb-1">🪱</div>
            <div className="font-bold text-amber-300 text-xs">Transformateurs</div>
            <div className="text-amber-200/60 text-xs">10 pts/espèce</div>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-center">
            <div className="text-2xl mb-1">🦂</div>
            <div className="font-bold text-red-300 text-xs">Prédateurs</div>
            <div className="text-red-200/60 text-xs">20 pts/espèce</div>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-400/20 text-center">
            <div className="text-2xl mb-1">🍄</div>
            <div className="font-bold text-teal-300 text-xs">Nettoyeurs</div>
            <div className="text-teal-200/60 text-xs">15 pts/espèce</div>
          </div>
        </div>
      </div>
    ),
  },

  // 7b — Éco-Mahjong
  {
    id: 'eco-mahjong',
    bg: 'from-green-950 via-emerald-950 to-teal-950',
    title: '🀄 Eco-Mahjong',
    content: (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/30 text-4xl">🀄</div>
          <div>
            <h2 className="text-4xl font-black text-white">Eco-Mahjong</h2>
            <p className="text-green-400/60 text-sm">Lutte biologique — Appariements ravageurs & auxiliaires de culture</p>
          </div>
        </div>
        <p className="text-green-200/70 text-lg mb-6 leading-relaxed">
          Un jeu educatif inspire du Mahjong : les eleves <strong className="text-green-300">associent chaque ravageur agricole a son auxiliaire naturel</strong> (predateur ou parasitoide) a travers une grille de tuiles en 3D. 26 especes scientifiques reelles reparties sur 4 secteurs agronomiques.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="p-5 rounded-2xl bg-white/5 border border-green-400/20">
            <h3 className="font-bold text-green-300 mb-3">🎯 Principe du jeu</h3>
            <ul className="space-y-2 text-green-200/70 text-sm">
              <li>• Choisir un secteur agricole parmi 4</li>
              <li>• Les tuiles ravageurs + auxiliaires sont disposees en grille 3D superposee</li>
              <li>• Retrouver et associer chaque ravageur a son auxiliaire</li>
              <li>• Seules les tuiles "libres" (non bloquees) peuvent etre jouees</li>
              <li>• Chaque paire reussie devoile une fiche scientifique</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-teal-400/20">
            <h3 className="font-bold text-teal-300 mb-3">🌿 Apports pedagogiques</h3>
            <ul className="space-y-2 text-teal-200/70 text-sm">
              <li>• Comprendre la lutte biologique (alternative aux pesticides)</li>
              <li>• Memoriser des noms scientifiques reels</li>
              <li>• Distinguer predateurs et parasitoides</li>
              <li>• Aborder l'agroecologie de facon ludique</li>
              <li>• Complement ideal aux sorties terrain Bio-Focus</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { emoji: '🥦', label: 'Maraichage', desc: '11 paires', color: 'green' },
            { emoji: '🍎', label: 'Arboriculture', desc: '6 paires', color: 'red' },
            { emoji: '🍇', label: 'Viticulture', desc: '6 paires', color: 'violet' },
            { emoji: '🌱', label: 'Pepiniere', desc: '5 paires', color: 'teal' },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-green-400/20 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-green-300 font-bold text-xs mb-0.5">{s.label}</div>
              <div className="text-green-200/50 text-xs">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20 text-sm text-green-200/80">
          🎓 <strong className="text-white">Disciplines :</strong> Sciences naturelles, EDD, Agroecologie. Adaptable au degre primaire et secondaire. Jouable en classe ou en autonomie.
        </div>
      </div>
    ),
  },

  // 7c — Rallye des Éco-Sentinelles
  {
    id: 'rallye',
    bg: 'from-green-950 via-emerald-950 to-amber-950',
    title: '🌍 Rallye Éco-Sentinelles',
    content: (
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-4xl">🌍</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Rallye des Éco-Sentinelles</h2>
            <p className="text-emerald-400/60 text-sm">Escape game pédagogique hybride — Intérieur & Terrain — 2 équipes</p>
          </div>
        </div>
        <p className="text-emerald-200/70 text-base mb-5 leading-relaxed">
          Un jeu de territoire en <strong className="text-amber-300">2 équipes</strong> articulant <strong className="text-blue-300">mini-jeux numériques intérieurs</strong> et <strong className="text-amber-300">défis de terrain extérieurs</strong>. 7 défis pour collecter les clés du <strong className="text-amber-300">Coffre de la Planète</strong>.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-400/20">
            <h3 className="font-bold text-blue-300 mb-3">🖥️ 4 défis Intérieurs — 100 pts chacun</h3>
            <p className="text-blue-200/50 text-xs mb-3">🏆 Défi Liste : l'équipe avec la liste la plus longue et juste gagne 100 pts, l'autre 50 pts.</p>
            <div className="space-y-3">
              {[
                { e: '⚡', t: 'Énergie — La Chasse aux Veilles', d: 'L\'équipe liste le maximum d\'appareils qui consomment inutilement en veille ou branchés à vide.', m: 'SOLEIL' },
                { e: '💧', t: 'Eau — La Brigade des Gouttes', d: 'L\'équipe liste le maximum de gestes du quotidien qui permettent d\'économiser l\'eau.', m: 'RIVIÈRE' },
                { e: '🚲', t: 'Mobilité Douce — Les Trajets Éco-Responsables', d: 'L\'équipe liste le maximum de situations où l\'on peut remplacer la voiture par un transport alternatif.', m: 'PÉDALE' },
                { e: '♻️', t: 'Économie Circulaire — La Seconde Vie des Objets', d: 'L\'équipe liste le maximum d\'objets jetés trop vite avec une alternative (réparer, donner, réutiliser).', m: 'RÉPARE' },
              ].map((d, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{d.e}</span>
                  <div>
                    <p className="text-blue-200 font-bold text-xs">{d.t}</p>
                    <p className="text-blue-200/50 text-xs">{d.d}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black">🗝️ {d.m}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/20">
            <h3 className="font-bold text-amber-300 mb-3">🌿 3 défis Terrain — 150 pts chacun</h3>
            <div className="space-y-3">
              {[
                { e: '🥗', t: 'Alimentation — Mission Terrain', d: 'Photographier 3 exemples : gaspillage alimentaire observé, compostage, produit local ou de saison.', m: 'COMPOST' },
                { e: '🌍', t: 'Voyages Locaux — Explorateurs de Proximité', d: 'Photographier 3 richesses naturelles ou culturelles de votre région à découvrir sans avion.', m: 'NATURE' },
                { e: '🥕', t: 'Circuits Courts — Le Marché Local', d: 'Photographier un marché ou producteur local, un produit de saison, un jardin partagé.', m: 'SAISON' },
              ].map((d, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{d.e}</span>
                  <div>
                    <p className="text-amber-200 font-bold text-xs">{d.t}</p>
                    <p className="text-amber-200/50 text-xs">{d.d}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black">🗝️ {d.m}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200/70">
              📷 L'enseignant <strong className="text-white">valide les photos</strong> depuis son panneau avant d'accorder les points.
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-center">
            <p className="text-sky-300 font-bold text-xs mb-1">👩‍🏫 Enseignant</p>
            <ul className="text-left text-xs text-sky-200/70 space-y-1">
              <li>• Crée session + 2 codes</li>
              <li>• Valide les preuves terrain</li>
              <li>• Suit scores en temps réel</li>
              <li>• Clôture → gagnant</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-center">
            <p className="text-emerald-300 font-bold text-xs mb-1">🎒 Élèves</p>
            <ul className="text-left text-xs text-emerald-200/70 space-y-1">
              <li>• Numéro TN + code équipe</li>
              <li>• Listes collaboratives intérieures</li>
              <li>• Photos terrain dehors</li>
              <li>• Collectent les 7 clés</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <p className="text-white/70 font-bold text-xs">Durée</p>
            <p className="text-white font-black text-sm">45 min – 1h30</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-amber-300 font-bold text-xs">Score max</p>
            <p className="text-white font-black text-xl">850 pts</p>
            <p className="text-amber-200/60 text-xs">4×100 + 3×150</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-center text-sm text-emerald-200/80">
          🗝️ Les 7 mots-clés assemblés — <strong className="text-amber-300">SOLEIL · RIVIÈRE · COMPOST · PÉDALE · NATURE · SAISON · RÉPARE</strong> — forment le code secret du Coffre de la Planète !
        </div>
        <Link to={createPageUrl('RallyeEcoSentinelles')}>
          <button className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black hover:from-emerald-500 hover:to-teal-500 transition-all">
            🌍 Accéder au Rallye des Éco-Sentinelles →
          </button>
        </Link>
      </div>
    ),
  },

  // 8 — Agenda & Bilans
  {
    id: 'agenda-bilan',
    bg: 'from-orange-950 via-amber-950 to-yellow-950',
    title: 'Agenda & Bilans',
    content: (
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30 text-3xl">🗓️</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Agenda & Bilans Pédagogiques</h2>
            <p className="text-orange-400/60 text-sm">Réservation d'ateliers — Dossier d'évaluation post-terrain</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="p-5 rounded-2xl bg-white/5 border border-orange-400/20 space-y-3">
            <h3 className="font-bold text-orange-300 text-base">📅 Prise de rendez-vous en ligne</h3>
            <ul className="text-orange-200/70 space-y-1.5 text-sm list-disc list-inside">
              <li>Formulaire simplifié pour l'enseignant</li>
              <li>Choix du type d'atelier : Biodiversité, Bio-Focus, Permaculture, Recyclage</li>
              <li>Date souhaitée + date alternative</li>
              <li>Confirmation automatique par email (enseignant + organisateur)</li>
              <li>Notification immédiate à l'équipe Terra Nova</li>
            </ul>
            <Link to={createPageUrl('Agenda')}>
              <button className="mt-2 w-full py-2 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-bold hover:bg-orange-500/30 transition-all">
                📅 Accéder à l'Agenda →
              </button>
            </Link>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-yellow-400/20 space-y-3">
            <h3 className="font-bold text-yellow-300 text-base">📋 Bilan pédagogique post-atelier</h3>
            <ul className="text-yellow-200/70 space-y-1.5 text-sm list-disc list-inside">
              <li>Identification de la classe et de la sortie</li>
              <li>Objectifs d'apprentissage cochés</li>
              <li>Activités réalisées : observation, expérimentation, débat</li>
              <li>Évaluation des acquis et compétences</li>
              <li>Volet EDD : changements d'attitude et prolongements</li>
              <li>Aspects logistiques, note globale ⭐ et recommandation</li>
            </ul>
            <Link to={createPageUrl('BilanPedagogique')}>
              <button className="mt-2 w-full py-2 rounded-xl bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-sm font-bold hover:bg-yellow-500/30 transition-all">
                📋 Accéder au Bilan →
              </button>
            </Link>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/30">
          <h3 className="text-teal-300 font-bold text-sm mb-3">🔑 Accès sécurisé au bilan en 3 étapes</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { icon: '📅', step: '1. Demande de RDV', desc: 'L\'enseignant remplit le formulaire de réservation en ligne.' },
              { icon: '📧', step: '2. Code par email', desc: 'Un code unique ex: TN-A3F7-K9QP est envoyé automatiquement.' },
              { icon: '📋', step: '3. Dossier privé', desc: 'Le code ouvre un dossier personnel, modifiable et sauvegardable.' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-teal-300 font-bold text-xs mb-1">{item.step}</div>
                <div className="text-white/50 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // 9 — Tarifs & Abonnement
  {
    id: 'tarifs',
    bg: 'from-violet-950 via-purple-950 to-slate-950',
    title: 'Tarifs & Abonnement',
    content: (
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-violet-500/20 border border-violet-400/30">
            <CreditCard className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Tarifs & Abonnements</h2>
            <p className="text-violet-400/60 text-sm">Abonnements annuels — accès complet à tous les modules</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {[
            {
              label: 'Individuel',
              price: 'CHF 240',
              period: '/an',
              color: 'cyan',
              features: ['1 utilisateur', 'Tous les modules', 'Profil Éco-Sentinelle', 'Support email'],
            },
            {
              label: 'Famille',
              price: 'CHF 290',
              period: '/an',
              color: 'teal',
              features: ['Jusqu\'à 5 membres', 'Tous les modules', 'Profils individuels', 'Support email'],
            },
            {
              label: 'Établissement',
              price: 'CHF 390',
              period: '/an',
              color: 'emerald',
              features: ['Jusqu\'à 150 élèves', 'Tous les modules', '3 enseignants admin', 'Support email'],
            },
            {
              label: 'Premium',
              price: 'CHF 690',
              period: '/an',
              color: 'amber',
              badge: '⭐ Recommandé',
              features: ['Élèves illimités', 'Enseignants illimités', 'Bio-Focus inclus', 'Support prioritaire', 'Logo personnalisé'],
            },
          ].map((plan, i) => (
            <div key={i} className={`p-4 rounded-2xl bg-${plan.color}-500/10 border-2 border-${plan.color}-400/30 flex flex-col`}>
              {plan.badge && <div className="text-xs font-bold text-amber-300 mb-1">{plan.badge}</div>}
              <h3 className={`font-black text-${plan.color}-300 text-sm mb-1`}>{plan.label}</h3>
              <div className="flex items-end gap-1 mb-3">
                <span className={`text-2xl font-black text-${plan.color}-200`}>{plan.price}</span>
                <span className={`text-${plan.color}-400/60 text-xs mb-1`}>{plan.period}</span>
              </div>
              <ul className="space-y-1 flex-1 mb-3">
                {plan.features.map((f, j) => (
                  <li key={j} className={`text-xs text-${plan.color}-200/70 flex gap-1.5`}>
                    <span className={`text-${plan.color}-400 flex-shrink-0`}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl('Abonnement')}>
                <button className={`w-full py-1.5 rounded-xl font-bold text-xs bg-${plan.color}-500/20 hover:bg-${plan.color}-500/30 text-${plan.color}-300 border border-${plan.color}-400/30 transition-all`}>
                  Choisir →
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white/70 font-bold text-sm mb-2">🏫 Réseau d'écoles — Sur devis</h3>
              <ul className="text-white/50 text-xs space-y-1">
                {['Plusieurs établissements', 'Dashboard centralisé', 'Formation enseignants', 'Accompagnement pédagogique', 'Intégration ENT possible'].map(f => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <div className="text-center text-white/40 text-xs">🔒 Paiement sécurisé via Stripe</div>
              <div className="text-center text-white/40 text-xs">📄 Facture disponible pour les établissements</div>
              <div className="text-center text-white/40 text-xs">🔄 Résiliable chaque année</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 11 — Déploiement pour d'autres établissements
  {
    id: 'deploiement',
    bg: 'from-slate-950 via-indigo-950 to-violet-950',
    title: 'Déploiement pour votre établissement',
    content: (
      <div className="flex flex-col items-center justify-center h-full px-8 py-16 min-h-[70vh]">
        <div className="text-7xl mb-4">🏫</div>
        <h2 className="text-4xl font-black text-white mb-3 text-center">Une plateforme, chaque école unique</h2>
        <p className="text-indigo-200/70 text-lg mb-10 max-w-2xl text-center">
          Terra Nova peut être déployée pour n'importe quel établissement scolaire ou commune avec sa propre identité.
        </p>
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
          {[
            {
              emoji: '📋',
              title: 'Copie dédiée de la plateforme',
              desc: 'Chaque école reçoit sa propre instance indépendante. Les données de chaque établissement sont entièrement séparées et sécurisées.',
              color: 'border-indigo-400/30 bg-indigo-500/10',
              textColor: 'text-indigo-300',
            },
            {
              emoji: '✏️',
              title: 'Contenu personnalisé',
              desc: "L'onglet Permaculture et les autres modules sont adaptés aux espaces et cours propres à l'établissement (jardin, forêt, terrain maraîcher…).",
              color: 'border-violet-400/30 bg-violet-500/10',
              textColor: 'text-violet-300',
            },
            {
              emoji: '🔒',
              title: 'Base de données autonome',
              desc: 'Les élèves, sessions, bilans pédagogiques et abonnements sont gérés de manière totalement indépendante pour chaque école.',
              color: 'border-cyan-400/30 bg-cyan-500/10',
              textColor: 'text-cyan-300',
            },
            {
              emoji: '🎨',
              title: 'Identité visuelle & nom de domaine',
              desc: "Logo, couleurs, nom de l'établissement et nom de domaine personnalisé. Chaque école dispose de sa propre plateforme branded.",
              color: 'border-emerald-400/30 bg-emerald-500/10',
              textColor: 'text-emerald-300',
            },
          ].map((item, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${item.color}`}>
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className={`font-bold mb-2 ${item.textColor}`}>{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 max-w-2xl text-center">
          <p className="text-white/70 text-sm leading-relaxed">
            💡 <span className="text-white font-semibold">Comment ça se passe concrètement ?</span><br />
            Nous configurons ensemble votre instance, importons votre contenu pédagogique, et votre plateforme est opérationnelle en quelques jours — avec votre nom de domaine et votre identité.
          </p>
        </div>
      </div>
    ),
  },

  // 12 — Contact / Démarrage
  {
    id: 'contact',
    bg: 'from-emerald-950 via-teal-950 to-cyan-950',
    title: 'Commencer',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16 min-h-[70vh]">
        <div className="text-7xl mb-6">🚀</div>
        <h2 className="text-5xl font-black text-white mb-4">Prêt à démarrer ?</h2>
        <p className="text-emerald-200/70 text-xl mb-10 max-w-2xl">
          Offrez à vos élèves une expérience éducative unique. Rejoignez la communauté Terra Nova.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-10 w-full max-w-3xl">
          {[
            { emoji: '1️⃣', title: 'Souscrire', desc: 'Choisissez votre plan et réglez en ligne via Stripe sécurisé.' },
            { emoji: '2️⃣', title: 'Inscrire vos élèves', desc: 'Importez votre liste de classe ou saisissez manuellement. Numéros TN générés automatiquement.' },
            { emoji: '3️⃣', title: 'Explorer', desc: 'Vos élèves accèdent à tous les modules dès le premier jour !' },
          ].map((step, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-emerald-400/20">
              <div className="text-3xl mb-3">{step.emoji}</div>
              <h3 className="text-emerald-300 font-bold mb-2">{step.title}</h3>
              <p className="text-emerald-200/60 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to={createPageUrl('Abonnement')}>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl">
              <CreditCard className="w-5 h-5 mr-2" />
              Souscrire un abonnement
            </Button>
          </Link>
          <Link to={createPageUrl('Home')}>
            <Button variant="outline" className="px-8 py-6 text-lg rounded-2xl bg-white/5 border-emerald-400/30 text-emerald-300 hover:bg-white/10">
              <Home className="w-5 h-5 mr-2" />
              Explorer la plateforme
            </Button>
          </Link>
        </div>
        <p className="text-white/30 text-sm mt-8">📧 contact@terra-nova.edu — 🌐 terra-nova.edu</p>
      </div>
    ),
  },
];

export default function PresentationPage() {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));
  const slide = SLIDES[current];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
      if (e.key === 'f' || e.key === 'F') handleFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={containerRef} className={`min-h-screen bg-gradient-to-br ${slide.bg} transition-all duration-700 flex flex-col print:min-h-0`}>
      {/* Barre du haut */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-xl border-b border-white/10 print:hidden">
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <span className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">← Accueil</span>
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/60 text-sm font-semibold">{slide.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">{current + 1} / {SLIDES.length}</span>
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all border border-emerald-400/20">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={handleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <Link to={createPageUrl('Abonnement')}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs font-semibold transition-all border border-violet-400/20">
              <CreditCard className="w-3.5 h-3.5" /> S'abonner
            </button>
          </Link>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="min-h-full"
          >
            {slide.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Barre de navigation */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-t border-white/10 print:hidden">
        <button onClick={prev} disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Précédent</span>
        </button>

        <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>

        <button onClick={next} disabled={current === SLIDES.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all">
          <span className="hidden sm:inline text-sm">Suivant</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}