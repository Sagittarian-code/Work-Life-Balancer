import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

// FIXED: 6-2-6 breathing pattern
const BREATHING_PHASES = [
  { name: 'Inhale', duration: 6000, text: 'Breathe in...', color: 'hsl(175 65% 55%)' }, // Turquoise water
  { name: 'Hold', duration: 2000, text: 'Hold...', color: 'hsl(195 85% 55%)' }, // Ocean blue
  { name: 'Exhale', duration: 6000, text: 'Breathe out...', color: 'hsl(160 55% 50%)' }, // Forest green
];

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const currentPhase = BREATHING_PHASES[currentPhaseIndex];

  useEffect(() => {
    if (!isActive) return;

    const startTime = Date.now();
    const duration = currentPhase.duration;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= duration) {
        setProgress(0);
        const nextPhaseIndex = (currentPhaseIndex + 1) % BREATHING_PHASES.length;
        setCurrentPhaseIndex(nextPhaseIndex);
        
        // Increment cycle count only after completing exhale (end of cycle)
        if (currentPhaseIndex === 2) { // Exhale is index 2
          setCycleCount((prev) => prev + 1);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, currentPhase.duration]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setProgress(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setProgress(0);
    setCycleCount(0);
  };

  const getCircleScale = () => {
    if (currentPhase.name === 'Inhale') {
      return 1 + (progress / 100) * 0.8; // Scale from 1 to 1.8
    } else if (currentPhase.name === 'Hold') {
      return 1.8; // Stay at max
    } else {
      return 1.8 - (progress / 100) * 0.8; // Scale from 1.8 to 1
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-medium">
      <div className="space-y-6 md:space-y-8">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Breathing Exercise</h3>
          <p className="text-sm md:text-base text-muted-foreground">6-2-6 breathing pattern for deep relaxation</p>
        </div>

        {/* Cycle Counter */}
        <div className="flex justify-center">
          <div className="px-6 py-3 bg-muted/50 rounded-full border border-border">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Cycles</span>
              <motion.span
                key={cycleCount}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-primary"
              >
                {cycleCount}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Breathing Circle Container */}
        <div className="relative flex items-center justify-center" style={{ minHeight: '400px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '1rem' }}>
          {/* Main Breathing Circle - Highly Visible */}
          <motion.div
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: `radial-gradient(circle at center, ${currentPhase.color}, ${currentPhase.color}cc)`,
              boxShadow: `
                0 0 60px ${currentPhase.color},
                0 0 100px ${currentPhase.color}88,
                0 0 140px ${currentPhase.color}44,
                inset 0 0 60px ${currentPhase.color}33
              `,
            }}
          />

          {/* Inner Glow Circle */}
          <motion.div
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${currentPhase.color}, ${currentPhase.color}dd)`,
              boxShadow: `0 8px 40px ${currentPhase.color}aa`,
            }}
          />

          {/* Pulsing Outer Ring */}
          <motion.div
            animate={{
              scale: getCircleScale() * 1.2,
              opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: isActive ? Infinity : 0,
            }}
            className="absolute"
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              border: `4px solid ${currentPhase.color}`,
              boxShadow: `0 0 50px ${currentPhase.color}77`,
            }}
          />

          {/* Phase Text & Timer Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhaseIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="text-center px-4"
              >
                <p className="text-2xl md:text-3xl font-bold drop-shadow-lg mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  {currentPhase.text}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl md:text-2xl font-semibold drop-shadow-md"
                    style={{ color: 'hsl(var(--foreground) / 0.7)' }}
                  >
                    {Math.ceil((currentPhase.duration * (1 - progress / 100)) / 1000)}s
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 md:gap-4">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="gap-2 min-w-[120px]">
              <Play className="w-5 h-5" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} size="lg" variant="outline" className="gap-2 min-w-[120px]">
              <Pause className="w-5 h-5" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} size="lg" variant="outline" className="gap-2 min-w-[120px]">
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
          <p><strong>How it works:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
            <li>Inhale deeply for 6 seconds (circle expands)</li>
            <li>Hold your breath for 2 seconds (circle stays large)</li>
            <li>Exhale slowly for 6 seconds (circle contracts)</li>
            <li>The cycle counter increases after each complete cycle</li>
            <li>Practice 5-10 cycles for best results</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};