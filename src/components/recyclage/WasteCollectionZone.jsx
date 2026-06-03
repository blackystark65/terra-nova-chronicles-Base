import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, CheckCircle, Trash2, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { SWISS_BIN_TYPES } from './SwissWasteData';

const BIN_TYPES = SWISS_BIN_TYPES;

export default function WasteCollectionZone({ 
  zoneName, 
  zoneEmoji, 
  zoneColor, 
  wastes,
  backgroundImage 
}) {
  const [collectedWastes, setCollectedWastes] = useState([]);
  const [bins, setBins] = useState({
    paper: [], plastic: [], glass: [], organic: [], aluminum: [], oils: [], batteries: [], bulbs: [], general: []
  });
  const [feedback, setFeedback] = useState(null);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [slotIndex, setSlotIndex] = useState(null);
  const [score, setScore] = useState(0);

  // Check URL params for timer
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const duration = params.get('duration');
    const session = params.get('session_id');
    const slot = params.get('slot');
    
    if (duration) {
      setTimeLeft(parseInt(duration));
      setSessionId(session);
      setSlotIndex(slot);
    }
  }, [zoneName]);
  
  // Generate wastes continuously (always, both in timed and free mode)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomWaste = wastes[Math.floor(Math.random() * wastes.length)];
      setCollectedWastes(prev => [...prev, { ...randomWaste, id: Date.now() + Math.random() }]);
    }, 3000); // New waste every 3 seconds
    
    return () => clearInterval(interval);
  }, [wastes]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeActivity();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft]);
  
  const completeActivity = async () => {
    if (!sessionId) return;
    
    try {
      const session = await base44.entities.GameSession.filter({ id: sessionId });
      if (session.length > 0) {
        await base44.entities.GameSession.update(sessionId, {
          total_score: (session[0].total_score || 0) + score,
          wastes_sorted_today: (session[0].wastes_sorted_today || 0) + getTotalBinItems(),
          current_time_slot: parseInt(slotIndex) + 1,
        });
      }
      
      window.location.href = createPageUrl('RecyclageSchedule');
    } catch (error) {
      console.error('Error completing activity');
    }
  };

  // Save progress
  useEffect(() => {
    localStorage.setItem(`recyclage_${zoneName}`, JSON.stringify({ collectedWastes, bins }));
  }, [collectedWastes, bins, zoneName]);

  const handleCollectWaste = (waste) => {
    // Remove only this specific waste instance
    const wasteIndex = collectedWastes.findIndex(w => w.id === waste.id || (w.name === waste.name && !w.id));
    if (wasteIndex !== -1) {
      const newWastes = [...collectedWastes];
      newWastes.splice(wasteIndex, 1);
      setCollectedWastes(newWastes);
      setFeedback({ type: 'collect', message: `${waste.emoji} ${waste.name} collecté !` });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSortWaste = (waste, binType) => {
    if (waste.bin === binType) {
      setBins(prev => ({
        ...prev,
        [binType]: [...prev[binType], waste]
      }));
      setCollectedWastes(collectedWastes.filter(w => w !== waste));
      setFeedback({ type: 'success', message: `✅ Bien trié dans ${BIN_TYPES[binType].name} !` });
      setSelectedWaste(null);
      setScore(prev => prev + 10);
    } else {
      setFeedback({ type: 'error', message: `❌ Mauvaise poubelle ! Essaie ${BIN_TYPES[waste.bin].name}` });
      setScore(prev => Math.max(0, prev - 5));
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const getTotalBinItems = () => {
    return Object.values(bins).reduce((sum, bin) => sum + bin.length, 0);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-emerald-950/85 to-teal-950/90" />
      
      <BiolumiHeader currentPage="Recyclage" />

      <main className="relative z-10 pt-16 sm:pt-24 px-2 sm:px-4 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
            <Link to={timeLeft ? createPageUrl('RecyclageSchedule') : createPageUrl('Recyclage')}>
              <Button variant="outline" className="border-emerald-400 text-emerald-300 text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                {timeLeft ? 'Abandonner' : 'Retour'}
              </Button>
            </Link>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {timeLeft !== null && (
                <div className={`bg-white/10 backdrop-blur-xl px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 ${
                  timeLeft < 30 ? 'border-red-400 animate-pulse' : 'border-yellow-400'
                }`}>
                  <span className={`text-sm sm:text-base ${timeLeft < 30 ? 'text-red-300 font-bold' : 'text-yellow-300'}`}>
                    ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
              {timeLeft !== null && (
                <div className="bg-white/10 backdrop-blur-xl px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-purple-400/30">
                  <span className="text-purple-300 font-bold text-sm sm:text-base">
                    ⭐ {score}
                  </span>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-xl px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-emerald-400/30">
                <span className="text-emerald-300 text-sm sm:text-base">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                  {collectedWastes.length}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-xl px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-green-400/30">
                <span className="text-green-300 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                  {getTotalBinItems()}
                </span>
              </div>
            </div>
          </div>

          {/* Zone Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r ${zoneColor} mb-4`}>
              <span className="text-6xl">{zoneEmoji}</span>
              <h1 className="text-4xl font-bold text-white">{zoneName}</h1>
            </div>
            <p className="text-emerald-300 text-lg">
              Collecte les déchets et trie-les dans les bonnes poubelles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Wastes appearing continuously */}
            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-emerald-300 mb-2 sm:mb-4">
                Déchets qui apparaissent
              </h2>
              {collectedWastes.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-emerald-400/50 text-sm sm:text-base">
                  Les déchets vont apparaître...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-4 max-h-[300px] sm:max-h-[500px] overflow-y-auto">
                  {collectedWastes.map((waste, i) => (
                    <motion.div
                      key={waste.id || i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={`p-6 rounded-2xl cursor-pointer transition-all ${
                        selectedWaste?.id === waste.id ? 
                        'bg-cyan-500/50 border-4 border-cyan-300' : 
                        'bg-white/20 hover:bg-white/30 border-2 border-white/20'
                      }`}
                      onClick={() => setSelectedWaste(waste)}
                    >
                      <div className="text-5xl mb-2">{waste.emoji}</div>
                      <div className="text-sm font-semibold text-white">{waste.name}</div>
                      {selectedWaste?.id === waste.id && (
                        <div className="text-xs text-cyan-300 mt-2">→ Clique sur une poubelle</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bins */}
            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-emerald-300 mb-2 sm:mb-4">
                Poubelles de tri sélectif
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {Object.entries(BIN_TYPES).map(([key, bin]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    className={`${bin.color} rounded-2xl p-4 text-white cursor-pointer`}
                    onClick={() => {
                      if (selectedWaste && collectedWastes.includes(selectedWaste)) {
                        handleSortWaste(selectedWaste, key);
                      }
                    }}
                  >
                    <div className="text-4xl mb-2">{bin.emoji}</div>
                    <div className="text-sm font-bold mb-1">{bin.name}</div>
                    <div className="text-xs opacity-80">{bins[key].length} déchets</div>
                    <div className="text-xs opacity-70 mt-1">{bin.info}</div>
                  </motion.div>
                ))}
              </div>

              {selectedWaste && (
                <div className="bg-cyan-500/20 backdrop-blur-xl rounded-2xl p-4 border-2 border-cyan-400">
                  <h3 className="text-lg font-bold text-cyan-300 mb-2 text-center">
                    Déchet sélectionné: {selectedWaste.emoji} {selectedWaste.name}
                  </h3>
                  <p className="text-sm text-cyan-200 text-center">
                    Clique sur la bonne poubelle !
                  </p>
                </div>
              )}

              {/* Link to Decheterie */}
              {getTotalBinItems() > 0 && (
                <Link to={createPageUrl('RecyclageDecheterie')}>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-6">
                    <Recycle className="w-5 h-5 mr-2" />
                    Vider dans la Déchetterie ({getTotalBinItems()} déchets)
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`px-8 py-4 rounded-2xl shadow-2xl border-4 text-white text-xl font-bold ${
              feedback.type === 'success' ? 'bg-green-500 border-green-300' :
              feedback.type === 'error' ? 'bg-red-500 border-red-300' :
              'bg-blue-500 border-blue-300'
            }`}>
              {feedback.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}