import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MoodSelector } from '../components/MoodSelector';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { currentMood } = useStore();

  const handleMoodComplete = () => {
    setStep(1);
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome!</h1>
            <p className="text-lg text-muted-foreground">Let's get to know you better</p>
          </div>

          <MoodSelector onComplete={handleMoodComplete} />

          <div className="text-center mt-4">
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 shadow-strong text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-calm rounded-full flex items-center justify-center"
          >
            <span className="text-4xl">✨</span>
          </motion.div>

          <h2 className="text-3xl font-bold text-foreground mb-4">You're all set!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your emotion-aware dashboard is ready. We'll help you balance productivity with wellness.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">Tasks</p>
                <p className="text-sm text-muted-foreground">Smart management</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-secondary">Mood</p>
                <p className="text-sm text-muted-foreground">Track & adapt</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-accent">Wellness</p>
                <p className="text-sm text-muted-foreground">Stay balanced</p>
              </div>
            </div>

            <Button onClick={handleComplete} size="lg" className="w-full mt-6">
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}