import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import useStore from '../store/useStore';

const moodOptions = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'hsl(150 60% 60%)' },
  { value: 'calm', label: 'Calm', icon: Meh, color: 'hsl(270 60% 65%)' },
  { value: 'stressed', label: 'Stressed', icon: Frown, color: 'hsl(0 70% 60%)' },
  { value: 'tired', label: 'Tired', icon: Zap, color: 'hsl(30 70% 60%)' },
];

export const MoodSelector = ({ onComplete }) => {
  const { updateMood } = useStore();
  const [selectedMood, setSelectedMood] = useState('calm');
  const [energy, setEnergy] = useState([50]);

  const handleSubmit = () => {
    updateMood({
      mood: selectedMood,
      energy: energy[0],
    });
    onComplete?.();
  };

  return (
    <Card className="p-8 shadow-medium">
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">How are you feeling?</h3>
          <p className="text-muted-foreground">Let's understand your current state</p>
        </div>

        {/* Mood Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">Mood</label>
          <div className="grid grid-cols-2 gap-4">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.value;
              return (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-6 rounded-xl border-2 transition-smooth ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: mood.color }} />
                  <p className="text-sm font-medium text-foreground">{mood.label}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Energy Slider */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-foreground">Energy Level</label>
            <span className="text-sm text-muted-foreground">{energy[0]}%</span>
          </div>
          <Slider
            value={energy}
            onValueChange={setEnergy}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Continue
        </Button>
      </div>
    </Card>
  );
};