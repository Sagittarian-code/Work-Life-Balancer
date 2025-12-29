import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

const BREATHING_PHASES = [
  { name: 'Inhale', duration: 4000, text: 'Breathe in...', color: 'hsl(150 60% 60%)' },
  { name: 'Hold', duration: 2000, text: 'Hold...', color: 'hsl(270 60% 65%)' },
  { name: 'Exhale', duration: 6000, text: 'Breathe out...', color: 'hsl(200 70% 60%)' },
];

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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
        setCurrentPhaseIndex((prev) => (prev + 1) % BREATHING_PHASES.length);
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
    <Card className="p-8 shadow-medium">
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Breathing Exercise</h3>
          <p className="text-muted-foreground">4-2-6 breathing pattern for calmness</p>
        </div>

        {/* Breathing Circle Container */}
        <div className="relative flex items-center justify-center" style={{ minHeight: '400px' }}>
          {/* Breathing Circle with Glow */}
          <motion.div
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `radial-gradient(circle at center, ${currentPhase.color}, ${currentPhase.color}dd)`,
              boxShadow: `0 0 80px ${currentPhase.color}aa, 0 0 120px ${currentPhase.color}66, inset 0 0 60px ${currentPhase.color}33`,
              filter: 'blur(1px)',
            }}
          />

          {/* Inner Circle for Better Visibility */}
          <motion.div
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${currentPhase.color}ee, ${currentPhase.color}bb)`,
              boxShadow: `0 4px 30px ${currentPhase.color}77`,
            }}
          />

          {/* Outer Ring */}
          <motion.div
            animate={{
              scale: getCircleScale() * 1.1,
              opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: isActive ? Infinity : 0,
            }}
            className="absolute"
            style={{
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: `2px solid ${currentPhase.color}`,
              boxShadow: `0 0 30px ${currentPhase.color}55`,
            }}
          />

          {/* Phase Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhaseIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                  {currentPhase.text}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl text-white/90 drop-shadow-md"
                  >
                    {Math.ceil((currentPhase.duration * (1 - progress / 100)) / 1000)}s
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} size="lg" variant="outline" className="gap-2">
              <Pause className="w-5 h-5" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
          <p><strong>How it works:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Inhale for 4 seconds (circle expands)</li>
            <li>Hold for 2 seconds (circle stays large)</li>
            <li>Exhale for 6 seconds (circle contracts)</li>
            <li>Repeat for a few cycles to feel calm and centered</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};