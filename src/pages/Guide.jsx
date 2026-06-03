import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import {
  ChevronLeft, ChevronRight, Globe, BookOpen, Leaf, Trophy, Flame,
  Recycle, Map, Music, Puzzle, Users, GraduationCap, Star, Zap,
  TreeDeciduous, Bug, Droplets, Mountain, ArrowRight, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  // ── SLIDE 0 : Couverture ──
  {
    id: 'cover',
    bg: 'from-emerald-950 via-teal-950 to-slate-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 rounded-full overflow-hidden shadow-2xl shadow-emerald-500/50 mb-8"
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png"
            alt="Terre"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-4">
          Chroniques de Terra Nova
        </h1>
        <p className="text-xl md:text-2xl text-emerald-300/80 mb-6 max-w-2xl">
          La plateforme éducative pour explorer, comprendre et protéger notre planète
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Enseignants', 'Élèves', 'Familles', 'Curieux'].map(p => (
            <span key={p} className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold">
              {p}
            </span>
          ))}
        </div>
        <p className="text-emerald-400/50 text-sm italic">Utilisez les flèches pour naviguer dans cette présentation →</p>
      </div>
    ),
  },

  // ── SLIDE 1 : C'est quoi ? ──
  {
    id: 'intro',
    bg: 'from-slate-950 via-emerald-950 to-teal-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <Globe className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Qu'est-ce que Terra Nova ?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-white/5 border border-emerald-400/20">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-emerald-300 mb-2">Une plateforme éducative immersive</h3>
            <p className="text-emerald-200/70">
              Terra Nova est un espace numérique qui mêle jeux, quiz, exploration et simulation pour sensibiliser les jeunes à la biodiversité, à l'écologie et au développement durable.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-teal-400/20">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-teal-300 mb-2">Apprendre en jouant</h3>
            <p className="text-teal-200/70">
              Chaque module est conçu pour être ludique et pédagogique : les élèves progressent, gagnent des points, débloquent des badges et explorent des contenus réels.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-cyan-400/20">
            <div className="text-4xl mb-4">👩‍🏫</div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Pour les enseignants</h3>
            <p className="text-cyan-200/70">
              La plateforme s'intègre facilement en cours de SVT, géographie, éducation citoyenne. Les élèves travaillent en autonomie ou en classe.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-purple-400/20">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Progression et récompenses</h3>
            <p className="text-purple-200/70">
              Chaque action rapporte des points XP, des crédits et des badges. Un profil personnalisé suit la progression de chaque élève.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 2 : Pour les enseignants ──
  {
    id: 'teachers',
    bg: 'from-blue-950 via-indigo-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30">
            <GraduationCap className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Pour les <span className="text-blue-300">Enseignants</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '📚', title: 'Intégration pédagogique', desc: 'Compatible avec les programmes SVT, géographie et éducation citoyenne de l\'école primaire au lycée.' },
            { emoji: '👥', title: 'Gestion par classes', desc: 'Créez des classes (ClasseFerme), assignez des rôles aux élèves et suivez leur progression en temps réel.' },
            { emoji: '🎯', title: 'Missions ciblées', desc: 'Définissez des missions spécifiques par biome ou thème : quiz, observation, recherche, défi.' },
            { emoji: '📊', title: 'Suivi des élèves', desc: 'Chaque élève dispose d\'un profil EcoSentinelle avec ses points XP, badges et statistiques.' },
            { emoji: '🔧', title: 'Personnalisation', desc: 'Ajoutez vos propres missions et quiz directement depuis l\'interface administrateur.' },
            { emoji: '🌱', title: 'Micro-ferme collaborative', desc: 'Le module Micro-ferme simule une exploitation agricole où chaque élève joue un rôle précis.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-blue-400/20">
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="text-base font-bold text-blue-300 mb-2">{item.title}</h3>
              <p className="text-blue-200/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-200 text-sm">
          💡 <strong>Conseil :</strong> Commencez par créer une classe dans "Micro-ferme", assignez des rôles à vos élèves, puis lancez une session de jeu collective !
        </div>
      </div>
    ),
  },

  // ── SLIDE 3 : Pour les élèves ──
  {
    id: 'students',
    bg: 'from-orange-950 via-amber-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30">
            <Star className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Pour les <span className="text-orange-300">Élèves</span></h2>
        </div>
        <p className="text-orange-200/70 text-lg mb-8 max-w-2xl">
          Tu deviens un <strong className="text-orange-300">Éco-Sentinelle</strong> : un gardien de la planète qui explore, apprend et agit pour protéger les écosystèmes !
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { emoji: '🌍', title: 'Explore 9 biomes', desc: 'Forêts tropicales, océans, savanes, arctique, zones humides, déserts, montagnes, forêts tempérées et Sol & Humus.' },
            { emoji: '🦅', title: 'Découvre des espèces', desc: '80+ espèces à identifier grâce à leurs photos et leurs chants (mode son pour les oiseaux !).' },
            { emoji: '♻️', title: 'Trie des déchets', desc: 'Dans le jeu de recyclage, tu tris les déchets de l\'hôtel Terra Nova dans les bonnes poubelles.' },
            { emoji: '🌱', title: 'Cultive ta ferme', desc: 'Plante, arrose, récolte et transforme des produits dans la micro-ferme communautaire.' },
            { emoji: '🧠', title: 'Réponds aux quiz', desc: 'Des centaines de questions sur la permaculture, les forêts, l\'eau, le climat et l\'agroécologie.' },
            { emoji: '🏅', title: 'Gagne des badges', desc: 'Recycle Débutant, Expert en Biodiversité, Explorateur de Biomes... Débloque-les tous !' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-orange-400/20">
              <span className="text-3xl flex-shrink-0">{item.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-orange-300 mb-1">{item.title}</h3>
                <p className="text-orange-200/60 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── SLIDE 4 : Atlas & Biomes ──
  {
    id: 'atlas',
    bg: 'from-emerald-950 via-green-950 to-teal-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <Map className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Atlas des Biomes</h2>
            <p className="text-emerald-400/60 text-sm">Module : Exploration géographique</p>
          </div>
        </div>
        <p className="text-emerald-200/70 mb-6">
          L'Atlas est le point de départ de la plateforme. Il présente une carte interactive du monde avec <strong className="text-emerald-300">9 grands biomes</strong>. Chaque biome dispose d'une page détaillée avec des espèces emblématiques, des faits scientifiques et les menaces qui pèsent sur lui.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { emoji: '🌴', name: 'Forêts tropicales', color: 'from-green-600 to-emerald-700' },
            { emoji: '🌊', name: 'Océans & Récifs', color: 'from-blue-600 to-cyan-700' },
            { emoji: '🦁', name: 'Savanes', color: 'from-amber-600 to-orange-700' },
            { emoji: '❄️', name: 'Arctique', color: 'from-slate-500 to-blue-700' },
            { emoji: '🌵', name: 'Déserts', color: 'from-yellow-600 to-amber-700' },
            { emoji: '🌿', name: 'Zones humides', color: 'from-teal-600 to-cyan-700' },
            { emoji: '🏔️', name: 'Montagnes', color: 'from-slate-600 to-stone-700' },
            { emoji: '🌲', name: 'Forêts tempérées', color: 'from-lime-600 to-green-700' },
            { emoji: '🪱', name: 'Sol & Humus', color: 'from-amber-800 to-yellow-900' },
          ].map((b, i) => (
            <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${b.color} text-center border border-white/10`}>
              <div className="text-3xl mb-2">{b.emoji}</div>
              <div className="text-white text-xs font-bold">{b.name}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-sm text-emerald-200/80">
          🎓 <strong>Usage pédagogique :</strong> Idéal pour des cours de géographie et SVT. Les élèves peuvent explorer chaque biome, lire les fiches espèces et compléter des missions associées.
        </div>
      </div>
    ),
  },

  // ── SLIDE 5 : Biodiversité ──
  {
    id: 'biodiversite',
    bg: 'from-teal-950 via-emerald-950 to-green-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/30">
            <Bug className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Jeu Biodiversité</h2>
            <p className="text-teal-400/60 text-sm">Module : Identification des espèces</p>
          </div>
        </div>
        <p className="text-teal-200/70 mb-6">
          Un jeu de cartes pour identifier <strong className="text-teal-300">80+ espèces européennes</strong> : oiseaux, mammifères, reptiles, insectes, fleurs, arbres et plantes aromatiques.
        </p>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '👁️', title: 'Mode Image', desc: 'Identifie l\'espèce à partir de sa photo. Description et indices disponibles.' },
            { emoji: '🎵', title: 'Mode Son', desc: 'Reconnais l\'oiseau uniquement à partir de son chant. 34 espèces avec audio réel !' },
            { emoji: '🌿', title: 'Mode Mixte', desc: 'Mélange sons pour les oiseaux et images pour les autres espèces.' },
          ].map((m, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-4xl mb-3">{m.emoji}</div>
              <h3 className="font-bold text-teal-300 mb-2">{m.title}</h3>
              <p className="text-teal-200/60 text-sm">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          {['🐦 34 Oiseaux', '🦊 7 Mammifères', '🐸 5 Batraciens', '🦎 5 Reptiles', '🐝 6 Insectes'].map((cat, i) => (
            <div key={i} className="p-3 rounded-xl bg-teal-500/10 border border-teal-400/20 text-center text-teal-300 text-xs font-bold">{cat}</div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/20 text-sm text-teal-200/80">
          🎓 <strong>Usage pédagogique :</strong> Parfait pour les cours de sciences naturelles. Le système de points motive les élèves à mémoriser et reconnaître les espèces locales.
        </div>
      </div>
    ),
  },

  // ── SLIDE 6 : Recyclage ──
  {
    id: 'recyclage',
    bg: 'from-green-950 via-emerald-950 to-lime-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/30">
            <Recycle className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Jeu de Recyclage</h2>
            <p className="text-green-400/60 text-sm">Module : Tri et gestion des déchets</p>
          </div>
        </div>
        <p className="text-green-200/70 mb-6">
          Dans l'hôtel <strong className="text-green-300">Terra Nova</strong>, les déchets s'accumulent dans différentes zones. Les joueurs choisissent un rôle et trient les déchets dans les bonnes poubelles avant qu'elles ne débordent !
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-green-400/20">
            <h3 className="font-bold text-green-300 mb-3">🏨 10 zones de jeu</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Cuisine', 'Restaurant', 'Réception', 'Chambres', 'Piscine', 'Plage', 'Marina', 'Parking', 'Déchetterie', 'Boutique'].map(z => (
                <span key={z} className="text-xs text-green-200/60 bg-green-500/10 px-2 py-1 rounded-lg">{z}</span>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-green-400/20">
            <h3 className="font-bold text-green-300 mb-3">👷 10 rôles disponibles</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Client', 'Réceptionniste', 'Nettoyeur', 'Cuisinier', 'Serveur', 'Jardinier', 'Chauffeur', 'Maître nageur', 'Port', 'Épicier'].map(r => (
                <span key={r} className="text-xs text-green-200/60 bg-green-500/10 px-2 py-1 rounded-lg">{r}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { emoji: '📦', label: '6 types de poubelles', sub: 'Papier, Plastique, Verre, Organique, Métal, Général' },
            { emoji: '⏱️', label: 'Temps réel', sub: 'Les poubelles se remplissent et débordent si on ne les vide pas' },
            { emoji: '🚛', label: 'Animation camion', sub: 'Animation quand tu vides une poubelle pleine' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20 text-center">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <div className="text-green-300 text-xs font-bold mb-1">{item.label}</div>
              <div className="text-green-200/50 text-xs">{item.sub}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20 text-sm text-green-200/80">
          🎓 <strong>Usage pédagogique :</strong> Enseigne les règles du tri sélectif suisses/européennes. Chaque déchet mal trié entraîne des pénalités pédagogiques.
        </div>
      </div>
    ),
  },

  // ── SLIDE 7 : Micro-ferme ──
  {
    id: 'microferme',
    bg: 'from-lime-950 via-green-950 to-emerald-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-lime-500/20 border border-lime-400/30">
            <Leaf className="w-8 h-8 text-lime-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Micro-Ferme Communautaire</h2>
            <p className="text-lime-400/60 text-sm">Module : Agriculture & permaculture</p>
          </div>
        </div>
        <p className="text-lime-200/70 mb-6">
          Une simulation complète d'une micro-ferme où chaque élève joue un <strong className="text-lime-300">rôle spécialisé</strong>. Ensemble, ils font fonctionner l'exploitation : de la graine à la vente !
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div>
            <h3 className="font-bold text-lime-300 mb-3">🌾 Les 7 rôles de la ferme</h3>
            <div className="space-y-2">
              {[
                { r: '🥕 Maraîcher', d: 'Cultive le potager, plante et récolte légumes' },
                { r: '🍎 Arboriste', d: 'Entretient les arbres fruitiers' },
                { r: '🍞 Boulanger', d: 'Transforme la farine en pain pour l\'épicerie' },
                { r: '🐄 Éleveur', d: 'S\'occupe des animaux de la ferme' },
                { r: '🛒 Épicier', d: 'Gère les stocks et vend les produits' },
                { r: '🌳 Jardinier forêt', d: 'Cultive la forêt-jardin' },
                { r: '🌸 Horticulteur', d: 'Gère la serre et les semis' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-xl bg-white/5 border border-lime-400/10">
                  <span className="text-sm font-bold text-lime-300 w-32 flex-shrink-0">{item.r}</span>
                  <span className="text-lime-200/60 text-sm">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lime-300 mb-3">🗺️ Les zones de la ferme</h3>
            <div className="grid grid-cols-2 gap-2">
              {['🏫 Centre de formation', '🌽 Champ Milpa', '🌿 Permaculture', '🌱 Pépinière/Serre', '🌳 Forêt-jardin', '🐔 Ferme pédagogique', '🍞 Boulangerie', '🛒 Épicerie', '♻️ Compost', '🌾 Bocage'].map((z, i) => (
                <span key={i} className="text-xs text-lime-200/60 bg-lime-500/10 px-2 py-1.5 rounded-lg">{z}</span>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-lime-500/10 border border-lime-400/20">
              <div className="text-lime-300 text-sm font-bold mb-1">💰 Économie interne</div>
              <p className="text-lime-200/60 text-xs">Les produits vendus à l'épicerie génèrent des crédits. La caisse centrale redistribue les salaires aux élèves selon leur activité.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 8 : Quiz & Missions ──
  {
    id: 'quiz-missions',
    bg: 'from-purple-950 via-indigo-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quiz */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/30">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Quiz</h2>
                <p className="text-purple-400/60 text-xs">Module : Évaluation des connaissances</p>
              </div>
            </div>
            <p className="text-purple-200/70 mb-5 text-sm">
              Des centaines de questions organisées par thème. Chaque bonne réponse rapporte des XP et des crédits.
            </p>
            <div className="space-y-3">
              {[
                { emoji: '🌱', cat: 'Permaculture', desc: 'Principes de design écologique' },
                { emoji: '🌳', cat: 'Forêt', desc: 'Écosystèmes forestiers' },
                { emoji: '🚜', cat: 'Agroécologie', desc: 'Agriculture durable' },
                { emoji: '💧', cat: 'Eau', desc: 'Cycle et gestion de l\'eau' },
                { emoji: '🌡️', cat: 'Climat', desc: 'Changement climatique' },
              ].map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                  <span className="text-xl">{q.emoji}</span>
                  <div>
                    <div className="text-purple-300 text-sm font-bold">{q.cat}</div>
                    <div className="text-purple-200/50 text-xs">{q.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Missions */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Missions</h2>
                <p className="text-orange-400/60 text-xs">Module : Défis éco-citoyens</p>
              </div>
            </div>
            <p className="text-orange-200/70 mb-5 text-sm">
              Des missions actives à compléter, classées par biome et difficulté. Elles combinent quiz, observation et recherche.
            </p>
            <div className="space-y-3">
              {[
                { emoji: '🌿', label: 'Débutant', desc: 'Missions d\'introduction accessibles à tous' },
                { emoji: '🔬', label: 'Intermédiaire', desc: 'Nécessite quelques connaissances préalables' },
                { emoji: '🧬', label: 'Avancé', desc: 'Missions approfondies pour les passionnés' },
                { emoji: '⚡', label: 'Expert', desc: 'Défis pour les vrais Éco-Sentinelles' },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-400/20">
                  <span className="text-xl">{d.emoji}</span>
                  <div>
                    <div className="text-orange-300 text-sm font-bold">{d.label}</div>
                    <div className="text-orange-200/50 text-xs">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 9 : Profil & Progression ──
  {
    id: 'profil',
    bg: 'from-amber-950 via-orange-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Profil & Progression</h2>
            <p className="text-amber-400/60 text-sm">Module : Suivi de l'élève</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-amber-300 mb-4">🎮 Système de progression</h3>
            <div className="space-y-4">
              {[
                { emoji: '⚡', label: 'Points XP', desc: 'Gagnés en complétant missions, quiz et activités de jeu. Permettent de monter de niveau.' },
                { emoji: '💰', label: 'Crédits', desc: 'Monnaie virtuelle pour acheter à l\'épicerie. Gagnés via les jeux et missions.' },
                { emoji: '🌍', label: 'Niveau Éco-Sentinelle', desc: 'De 1 à ∞, monte avec les XP accumulés. Chaque niveau débloque de nouveaux contenus.' },
                { emoji: '📍', label: 'Score d\'impact', desc: 'Mesure l\'impact total du joueur sur la planète. Combine toutes les activités.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="text-amber-300 text-sm font-bold">{item.label}</div>
                    <div className="text-amber-200/60 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-300 mb-4">🏅 Badges à débloquer</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🌏', name: 'Explorateur', desc: 'Explorer tous les biomes' },
                { emoji: '♻️', name: 'Recycleur', desc: 'Trier 10+ déchets' },
                { emoji: '🔬', name: 'Scientifique', desc: 'Compléter 5 quiz' },
                { emoji: '🌱', name: 'Agriculteur', desc: 'Récolter à la ferme' },
                { emoji: '🦉', name: 'Naturaliste', desc: 'Identifier 20 espèces' },
                { emoji: '⚡', name: 'Éco-Warrior', desc: 'Score recyclage 500+' },
              ].map((badge, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center">
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-amber-300 text-xs font-bold">{badge.name}</div>
                  <div className="text-amber-200/40 text-xs">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 10 : Encyclopédie & Climat ──
  {
    id: 'autres',
    bg: 'from-cyan-950 via-teal-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-white mb-6">Autres modules</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-cyan-400/20">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-cyan-300">Encyclopédie</h3>
            </div>
            <p className="text-cyan-200/70 text-sm mb-3">
              Un agent IA conversationnel spécialisé en biodiversité et écologie. Pose tes questions librement et obtiens des réponses détaillées avec des sources fiables.
            </p>
            <div className="space-y-1">
              {['💬 Chat en langage naturel', '🌿 Spécialisé en écologie', '📚 Réponses sourcées', '🔍 Recherche web intégrée'].map(f => (
                <div key={f} className="text-xs text-cyan-200/60">{f}</div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-blue-400/20">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-blue-300">Tableau de bord Climat</h3>
            </div>
            <p className="text-blue-200/70 text-sm mb-3">
              Données climatiques en temps réel de plusieurs villes mondiales. Température, qualité de l'air, humidité, et tendances historiques visualisées en graphiques.
            </p>
            <div className="space-y-1">
              {['🌡️ Météo en temps réel', '🏙️ Villes mondiales', '📊 Graphiques interactifs', '🌍 Données scientifiques'].map(f => (
                <div key={f} className="text-xs text-blue-200/60">{f}</div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-emerald-400/20">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-emerald-300">L'Écosphère</h3>
            </div>
            <p className="text-emerald-200/70 text-sm">
              Un livre illustré de planches dessinées sur l'agroécologie, la biodiversité et les techniques de vie durable. Organisé en 11 chapitres : climat, eau, permaculture, agroforesterie, semences, sol et bien plus.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🐝</span>
              <h3 className="text-lg font-bold text-yellow-300">Pollinisation</h3>
            </div>
            <p className="text-yellow-200/70 text-sm">
              Un module interactif en diapositives pour comprendre la pollinisation : son importance mondiale, les abeilles sauvages, les papillons, les menaces et comment agir. Inclut des photos et ressources de terrain de Terra Nova.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-violet-400/20">
            <div className="flex items-center gap-3 mb-3">
              <Puzzle className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold text-violet-300">Puzzle</h3>
            </div>
            <p className="text-violet-200/70 text-sm">
              Des puzzles interactifs sur des images de la nature et des écosystèmes. Un moment de détente éducatif pour consolider les apprentissages visuels.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-rose-400/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-rose-300">Jeux libres</h3>
            </div>
            <p className="text-rose-200/70 text-sm">
              Une sélection de mini-jeux éducatifs pour s'amuser tout en apprenant. Idéal en fin de cours ou comme récompense.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-amber-400/20 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🔬</span>
              <h3 className="text-lg font-bold text-amber-300">Bio-Focus : Les Enquêteurs de l'Humus</h3>
            </div>
            <p className="text-amber-200/70 text-sm">
              Un jeu de terrain ludo-éducatif en 2 équipes. Les joueurs photographient les acteurs de la décomposition (macrofaune, mésofaune, champignons) avec un appareil grossissant ×1000, puis completent leur tableau d'écosystème. Bonus chaîne trophique, défis Expert et bonus biodiversité !
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE Bio-Focus ──
  {
    id: 'biofocus',
    bg: 'from-amber-950 via-yellow-950 to-lime-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30">
            <span className="text-3xl">🔬</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Bio-Focus : Les Enquêteurs de l'Humus</h2>
            <p className="text-amber-400/60 text-sm">Activité de terrain — Biome Sol & Humus</p>
          </div>
        </div>
        <p className="text-amber-200/70 mb-6 text-base leading-relaxed">
          Un jeu de terrain <strong className="text-amber-300">ludo-éducatif en 2 équipes</strong> qui transforme l'exploration du sol en aventure scientifique. Les élèves photographient les acteurs de la décomposition avec un appareil grossissant ×1000 et completent leur tableau d'écosystème.
        </p>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '🪱', title: 'Macrofaune', desc: 'Vers de terre, cloportes, mille-pattes, larves… les organismes visibles à l\'œil nu.' },
            { emoji: '🦠', title: 'Mésofaune', desc: 'Acariens, collemboles, enchytréides… les micro-décomposeurs du sol.' },
            { emoji: '🍄', title: 'Champignons & mycorhizes', desc: 'Réseaux souterrains, filaments, spores. Le "bois d\'internet" du sol !' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-amber-400/20 text-center">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-amber-300 mb-2">{item.title}</h3>
              <p className="text-amber-200/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="p-5 rounded-2xl bg-white/5 border border-lime-400/20">
            <h3 className="font-bold text-lime-300 mb-3">🏆 Système de points</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Espèce commune identifiée', pts: '+10 pts' },
                { label: 'Espèce rare capturée', pts: '+25 pts' },
                { label: 'Espèce endémique', pts: '+50 pts' },
                { label: 'Défi Expert réussi', pts: '+30 pts' },
                { label: 'Chaîne trophique complète', pts: '+100 pts bonus' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-lime-200/70">{row.label}</span>
                  <span className="text-lime-300 font-bold font-mono">{row.pts}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-orange-400/20">
            <h3 className="font-bold text-orange-300 mb-3">👩‍🏫 Rôle de l'enseignant</h3>
            <ul className="space-y-2 text-sm text-orange-200/70 list-disc list-inside">
              <li>Crée la session et génère 2 codes équipe</li>
              <li><strong className="text-white">Forme les équipes lui-même</strong> : recherche les élèves par numéro TN ou nom et les affecte directement à chaque équipe</li>
              <li>Les élèves n'ont <strong className="text-yellow-300">pas besoin de saisir de code</strong> — idéal en classe sans téléphone</li>
              <li>Suit les scores en temps réel depuis son tableau de bord</li>
              <li>Clôture la session et distribue les récompenses</li>
            </ul>
            <Link to={createPageUrl('BioFocus')}>
              <button className="mt-4 w-full py-2 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-bold hover:bg-orange-500/30 transition-all">
                🔬 Accéder à Bio-Focus →
              </button>
            </Link>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-sm text-amber-200/80">
          🎓 <strong>Usage pédagogique :</strong> Sciences naturelles, EDD, observation terrain. L'enseignant forme les équipes directement depuis son tableau de bord en cherchant chaque élève par numéro TN ou nom. <strong className="text-white">Aucun téléphone requis côté élèves</strong> — idéal pour les classes sans accès aux appareils pendant les cours.
        </div>
      </div>
    ),
  },

  // ── SLIDE Éco-Mahjong ──
  {
    id: 'eco-mahjong',
    bg: 'from-green-950 via-emerald-950 to-teal-950',
    content: (
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/30">
            <span className="text-3xl">🀄</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Éco-Mahjong</h2>
            <p className="text-green-400/60 text-sm">Lutte biologique — Appariements ravageurs & auxiliaires</p>
          </div>
        </div>
        <p className="text-green-200/70 mb-6 text-base leading-relaxed">
          Un jeu de mémoire inspiré du Mahjong où les élèves doivent <strong className="text-green-300">associer chaque ravageur agricole à son auxiliaire naturel</strong> (prédateur ou parasitoide). Le jeu couvre 4 secteurs agronomiques et 26 espèces scientifiques réelles.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-green-400/20">
            <h3 className="font-bold text-green-300 mb-3">🎯 Comment jouer ?</h3>
            <ul className="space-y-2 text-green-200/70 text-sm">
              <li>• Choisir un secteur agricole (Maraichage, Arboriculture, Viticulture, Pepiniere)</li>
              <li>• Les tuiles ravageurs et auxiliaires sont disposees en grille 3D</li>
              <li>• Associer la tuile ravageur a son auxiliaire correspondant</li>
              <li>• Seules les tuiles "libres" (non bloquees) peuvent etre jouees</li>
              <li>• Utiliser les indices ou melanger si bloques</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-teal-400/20">
            <h3 className="font-bold text-teal-300 mb-3">🌿 Objectifs pedagogiques</h3>
            <ul className="space-y-2 text-teal-200/70 text-sm">
              <li>• Comprendre la lutte biologique comme alternative aux pesticides</li>
              <li>• Memoriser les noms scientifiques des especes auxiliaires</li>
              <li>• Distinguer predateurs et parasitoides</li>
              <li>• Explorer 4 secteurs : maraichage, arboriculture, viticulture, pepiniere</li>
              <li>• Lire la fiche scientifique de chaque appariement reussi</li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3 mb-5">
          {[
            { emoji: '🥦', label: 'Maraichage', desc: '11 paires' },
            { emoji: '🍎', label: 'Arboriculture', desc: '6 paires' },
            { emoji: '🍇', label: 'Viticulture', desc: '6 paires' },
            { emoji: '🌱', label: 'Pepiniere', desc: '5 paires' },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-xl bg-green-500/10 border border-green-400/20 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-green-300 font-bold text-xs mb-0.5">{s.label}</div>
              <div className="text-green-200/50 text-xs">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/30 text-sm text-teal-200/80">
          🎓 <strong>Usage pedagogique :</strong> Sciences naturelles, EDD, agroecologie. Chaque paire reussie affiche une fiche scientifique detaillee expliquant le mode d'action de l'auxiliaire. Ideal apres une sortie terrain ou en complement du module Bio-Focus.
        </div>
        <Link to={createPageUrl('MahjongEco')}>
          <button className="mt-4 w-full py-3 rounded-xl bg-green-500/20 border border-green-400/30 text-green-300 font-bold hover:bg-green-500/30 transition-all">
            🀄 Jouer a l'Eco-Mahjong →
          </button>
        </Link>
      </div>
    ),
  },

  // ── SLIDE Agenda Terrain & Rapports ──
  {
    id: 'agenda-rapports',
    bg: 'from-orange-950 via-amber-950 to-yellow-950',
    content: (
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30 text-3xl">🗓️</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Agenda & Bilans Pédagogiques</h2>
            <p className="text-orange-400/60 text-sm">Réservation d'ateliers — Dossier d'évaluation post-terrain</p>
          </div>
        </div>
        <p className="text-orange-200/70 text-base mb-6 leading-relaxed">
          Un système intégré permettant aux enseignants de <strong className="text-orange-300">réserver des ateliers pédagogiques</strong> sur le terrain de permaculture et de remplir un <strong className="text-yellow-300">bilan d'évaluation complet</strong> après chaque sortie.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* Agenda */}
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
          {/* Bilan */}
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
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {[
            { emoji: '🏫', label: 'Nom de l\'école', sub: 'Enseignant, classe, niveau' },
            { emoji: '🎯', label: 'Objectifs EDD', sub: 'Cochez les objectifs visés' },
            { emoji: '⭐', label: 'Note & Recommandation', sub: 'Évaluation sur 5 étoiles' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center">
              <div className="text-xl mb-1">{item.emoji}</div>
              <div className="text-amber-300 text-xs font-bold mb-0.5">{item.label}</div>
              <div className="text-amber-200/50 text-xs">{item.sub}</div>
            </div>
          ))}
        </div>
        {/* Système code bilan */}
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/30 mb-4">
          <h3 className="text-teal-300 font-bold text-sm mb-3">🔑 Comment accéder à votre dossier de bilan ?</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-teal-300 font-bold text-xs mb-1">1. Faites votre demande de RDV</div>
              <div className="text-white/50 text-xs">Remplissez le formulaire dans <strong className="text-white">📅 RDV</strong> depuis la navigation.</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-2xl mb-2">📧</div>
              <div className="text-teal-300 font-bold text-xs mb-1">2. Recevez votre code personnel</div>
              <div className="text-white/50 text-xs">Un email de confirmation vous envoie un code confidentiel unique, ex : <span className="font-mono text-yellow-300">TN-A3F7-K9QP</span></div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-teal-300 font-bold text-xs mb-1">3. Ouvrez votre dossier</div>
              <div className="text-white/50 text-xs">Rendez-vous dans <strong className="text-white">📋 Bilan</strong>, saisissez votre code pour accéder à votre dossier privé.</div>
            </div>
          </div>
        </div>

        {/* Mockup code gate */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 mb-4">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">🔒 Page Bilan — Accès sécurisé</div>
          </div>
          <div className="max-w-xs mx-auto p-4 rounded-2xl bg-white/5 border border-teal-400/20 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-white font-bold text-sm mb-1">Saisissez votre code</div>
            <div className="text-white/40 text-xs mb-3">Reçu dans votre email de confirmation</div>
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 font-mono text-yellow-300 text-center text-sm tracking-widest mb-3">TN-A3F7-K9QP</div>
            <div className="py-2 rounded-xl bg-teal-500/30 border border-teal-400/30 text-teal-200 text-xs font-bold">🔑 Accéder au dossier →</div>
          </div>
          <p className="text-white/40 text-xs text-center mt-3">Le dossier est strictement privé — seul vous possédez ce code.</p>
        </div>

        {/* Rouvrir son dossier */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 mb-4">
          <h3 className="text-amber-300 font-bold text-sm mb-2">🔄 Rouvrir votre dossier plus tard</h3>
          <div className="flex items-start gap-3 text-sm text-amber-200/70">
            <div className="text-amber-400 font-bold flex-shrink-0 mt-0.5">→</div>
            <div>Votre code est <strong className="text-white">permanent</strong> : conservez l'email de confirmation. À tout moment, retournez sur <strong className="text-white">📋 Bilan</strong> et ressaisissez votre code pour retrouver, modifier ou compléter votre dossier.</div>
          </div>
          <div className="flex items-start gap-3 text-sm text-amber-200/70 mt-2">
            <div className="text-amber-400 font-bold flex-shrink-0 mt-0.5">→</div>
            <div>Vous pouvez <strong className="text-white">sauvegarder en brouillon</strong> et revenir plus tard pour finaliser avant de soumettre.</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200/80 text-xs text-center font-semibold">
          🌿 Votre dossier est privé et lié à votre RDV — non visible par les élèves ni le public.
        </div>
      </div>
    ),
  },

  // ── SLIDE 12 : Commencer ──
  {
    id: 'start',
    bg: 'from-emerald-950 via-teal-950 to-cyan-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
        <div className="text-7xl mb-6">🚀</div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Prêt à commencer ?</h2>
        <p className="text-emerald-200/70 text-lg mb-10 max-w-2xl">
          Rejoins des milliers d'Éco-Sentinelles qui explorent et protègent la planète avec Terra Nova Chronicles.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-10 w-full max-w-2xl">
          {[
            { emoji: '1️⃣', title: 'Connecte-toi', desc: 'Crée ton compte ou connecte-toi avec les identifiants fournis par ton enseignant.' },
            { emoji: '2️⃣', title: 'Explore', desc: 'Commence par l\'Atlas pour découvrir les biomes, puis plonge dans les activités.' },
            { emoji: '3️⃣', title: 'Progresse', desc: 'Accumule des XP, débloque des badges et monte en niveau d\'Éco-Sentinelle !' },
          ].map((step, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-emerald-400/20 text-center">
              <div className="text-3xl mb-3">{step.emoji}</div>
              <h3 className="text-emerald-300 font-bold mb-2">{step.title}</h3>
              <p className="text-emerald-200/60 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
        <Link to={createPageUrl('Home')}>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-emerald-500/30">
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    ),
  },
];

export default function GuidePage() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));

  const slide = SLIDES[current];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
      <BiolumiHeader currentPage="Guide" />

      <main className="pt-16 h-screen flex flex-col">
        {/* Slide */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="min-h-full"
            >
              {slide.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barre de navigation */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-t border-white/10">
          {/* Prev */}
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Précédent</span>
          </button>

          {/* Indicateurs */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            disabled={current === SLIDES.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <span className="hidden sm:inline text-sm">Suivant</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}