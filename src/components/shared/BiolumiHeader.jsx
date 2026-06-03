import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Globe, Leaf, BookOpen, Trophy, User, Flame, X, LogOut, Calendar, Users, ChevronDown } from 'lucide-react';

export default function BiolumiHeader({ currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const hideTimer = useRef(null);

  const navItems = [
    { name: 'Atlas', icon: Globe, path: 'Atlas' },
    { name: 'Encyclopédie', icon: BookOpen, path: 'Encyclopedia' },
    { name: 'Permaculture', icon: Leaf, path: null, externalUrl: 'https://www.permaculturedurosey.org' },
    { name: 'Quiz', icon: Trophy, path: 'Quiz' },
    { name: 'Jeux', icon: Flame, path: 'Jeux' },
    { name: 'Puzzle', icon: Trophy, path: 'Puzzle' },
    { name: '🀄 Éco-Mahjong', icon: Leaf, path: 'MahjongEco' },
    { name: 'Recyclage', icon: Leaf, path: 'RecyclageRoleSelection' },
    { name: 'Micro-ferme', icon: Leaf, path: 'MicroFerme' },
    { name: 'Missions', icon: Flame, path: 'Missions' },
    { name: 'Climat', icon: Leaf, path: 'Climate' },
    { name: 'Biodiversité', icon: Leaf, path: 'Biodiversite' },
    { name: 'Pollinisation', icon: Leaf, path: 'Pollinisation' },
    { name: 'Écosphère', icon: BookOpen, path: 'Ecosphere' },
    { name: '🔬 Bio-Focus', icon: Flame, path: 'BioFocus' },
    { name: '📊 Présentation', icon: BookOpen, path: 'Presentation' },
    { name: '🔑 Abonnement', icon: Globe, path: 'Abonnement' },
    { name: '📅 RDV', icon: Calendar, path: 'Agenda' },
    { name: '📋 Bilan', icon: BookOpen, path: 'BilanPedagogique' },
    { name: '👥 Élèves', icon: Users, path: 'GestionEleves' },
    { name: '📸 Photos Mahjong', icon: BookOpen, path: 'AdminEcoPairs' }
  ];

  const handleLogout = () => {
    base44.auth.redirectToLogin();
  };

  const handleMouseEnter = () => {
    clearTimeout(hideTimer.current);
    setHeaderVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => {
      setHeaderVisible(false);
    }, 1200);
  };

  return (
    <>
      {/* Zone de détection survol invisible tout en haut (desktop uniquement) */}
      <div
        className="hidden md:block fixed top-0 left-0 right-0 h-3 z-[60]"
        onMouseEnter={handleMouseEnter}
      />

      {/* Header principal — style Le Rosey (fond bleu sombre) */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{ y: headerVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fond bleu sombre Le Rosey */}
        <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: 'rgba(10, 25, 60, 0.97)' }} />
        
        {/* Néon bleu subtil */}
        <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 80px rgba(59,130,246,0.08), inset 0 -4px 30px rgba(59,130,246,0.05)' }} />
        
        <nav className="relative w-full px-2 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Logo Le Rosey */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="https://www.rosey.ch/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  src="https://media.base44.com/images/public/6959886137576a65dcfe1370/78281f6ca_generated_image.png"
                  alt="Le Rosey"
                  title="Institut Le Rosey"
                  style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }}
                />
              </a>
              <div className="h-6 w-px bg-white/20 flex-shrink-0" />
              <Link to={createPageUrl('Home')}>
                <motion.div
                  className="flex items-center gap-2 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg shadow-blue-500/50">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png"
                      alt="Planète Terre"
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                  </motion.div>
                </motion.div>
              </Link>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-1 flex-wrap">
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-2 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-300"
              >
                <div className="relative flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-medium text-red-300">Déconnexion</span>
                </div>
              </motion.button>
              
              {navItems.map((item) => {
                const isActive = currentPage === item.path;
                const Icon = item.icon;

                if (item.externalUrl) {
                  return (
                    <a key={item.name} href={item.externalUrl}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-2 py-1.5 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300"
                      >
                        <div className="relative flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-blue-300 group-hover:text-blue-200 transition-all" />
                          <span className="text-xs font-semibold text-blue-200 group-hover:text-white transition-all">{item.name}</span>
                        </div>
                      </motion.div>
                    </a>
                  );
                }

                return (
                  <Link key={item.path} to={createPageUrl(item.path)}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative px-2 py-1.5 rounded-xl
                        transition-all duration-300
                        ${isActive ?
                          'bg-blue-600 shadow-lg shadow-blue-500/30 border border-blue-500' :
                          'bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 hover:border-blue-400/60'}
                      `}>
                      <div className="relative flex items-center gap-1.5">
                        <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-blue-200'}`}>
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
              
              {/* Photo de profil */}
              <Link to={createPageUrl('Profile')}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-blue-400/50 cursor-pointer"
                >
                  <User className="w-5 h-5 text-white" />
                </motion.div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Link to={createPageUrl('Profile')}>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-blue-400/50 touch-manipulation active:scale-95 transition-transform">
                  <User className="w-5 h-5 text-white pointer-events-none" />
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-blue-900/50 backdrop-blur-sm touch-manipulation active:scale-95 transition-transform border border-blue-500/30"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-blue-300 pointer-events-none" />
                ) : (
                  <>
                    <div className="w-5 h-0.5 bg-blue-300 pointer-events-none" />
                    <div className="w-5 h-0.5 bg-blue-300 pointer-events-none" />
                    <div className="w-5 h-0.5 bg-blue-300 pointer-events-none" />
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Ligne de séparation bleue néon */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" style={{ boxShadow: '0 0 6px rgba(59,130,246,0.4)' }} />

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2 backdrop-blur-xl overflow-y-auto max-h-[80vh]" style={{ backgroundColor: 'rgba(10, 25, 60, 0.98)' }}>
                <Link to={createPageUrl('Profile')} onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-300"
                  >
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-base font-medium text-blue-300">Profil</span>
                  </motion.div>
                </Link>
                
                <motion.button
                  onClick={handleLogout}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-base font-medium text-red-300">Déconnexion</span>
                </motion.button>

                {navItems.map((item) => {
                  const isActive = currentPage === item.path;
                  const Icon = item.icon;

                  if (item.externalUrl) {
                    return (
                      <a key={item.name} href={item.externalUrl} onClick={() => setMobileMenuOpen(false)}>
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-900/40 border border-blue-500/30 transition-all duration-300"
                        >
                          <Icon className="w-5 h-5 text-blue-300" />
                          <span className="text-base font-semibold text-blue-200">{item.name}</span>
                        </motion.div>
                      </a>
                    );
                  }

                  return (
                    <Link key={item.path} to={createPageUrl(item.path)} onClick={() => setMobileMenuOpen(false)}>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl
                          transition-all duration-300
                          ${isActive ?
                            'bg-blue-600 shadow-lg border border-blue-500' :
                            'bg-blue-900/40 border border-blue-500/30'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                        <span className={`text-base font-semibold ${isActive ? 'text-white' : 'text-blue-200'}`}>
                          {item.name}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Languette visible quand le header est caché (desktop uniquement) */}
      <AnimatePresence>
        {!headerVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex fixed top-0 left-1/2 -translate-x-1/2 z-[55] items-center gap-2 px-4 py-1 rounded-b-xl cursor-pointer"
            style={{ backgroundColor: 'rgba(10, 25, 60, 0.92)', backdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.2)', borderTop: 'none' }}
            onMouseEnter={handleMouseEnter}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-blue-300/70 font-medium">Menu</span>
            <ChevronDown className="w-3 h-3 text-blue-400/60" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}