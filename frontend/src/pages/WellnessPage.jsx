import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { BreathingExercise } from '../components/BreathingExercise';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const wellnessActivities = [
  {
    title: 'Tap to Calm',
    description: 'Simple tapping meditation for instant relaxation',
    emoji: '✨',
  },
  {
    title: 'Gratitude Moment',
    description: 'Think of three things you’re grateful for today',
    emoji: '🙏',
  },
  {
    title: 'Stretch Break',
    description: 'Take a 2-minute stretch to release tension',
    emoji: '🧘',
  },
  {
    title: 'Positive Affirmation',
    description: 'Repeat: "I am capable and doing my best"',
    emoji: '🌟',
  },
];

export default function WellnessPage() {
  const handleActivityClick = (activity) => {
    toast.success(`${activity.emoji} ${activity.title} - Take a moment for yourself`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary" />
          Mental Wellness
        </h1>
        <p className="text-muted-foreground mt-2">
          Take care of your mind and emotions with these gentle exercises
        </p>
      </div>

      {/* Breathing Exercise */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-secondary" />
          Guided Breathing
        </h2>
        <BreathingExercise />
      </div>

      {/* Other Activities */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Quick Wellness Activities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wellnessActivities.map((activity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="p-6 shadow-soft hover:shadow-medium transition-smooth cursor-pointer"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{activity.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips Card */}
      <Card className="p-6 bg-gradient-calm shadow-medium">
        <h3 className="text-lg font-semibold text-foreground mb-3">Wellness Tips</h3>
        <ul className="space-y-2 text-sm text-foreground/90">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Take short breaks every hour to prevent burnout</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Stay hydrated throughout the day</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Practice breathing exercises when feeling stressed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Celebrate small wins and progress</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Remember: You're doing better than you think!</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}