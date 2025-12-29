import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, CloudRain, Waves, Trees, Wind, Radio } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const sounds = [
  {
    id: 'rain',
    name: 'Rain',
    icon: CloudRain,
    color: 'hsl(200 70% 50%)',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3', // Rain sound
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    icon: Waves,
    color: 'hsl(195 85% 55%)',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3', // Ocean waves
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: Trees,
    color: 'hsl(160 55% 50%)',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3', // Forest ambience
  },
  {
    id: 'wind',
    name: 'Soft Wind',
    icon: Wind,
    color: 'hsl(180 45% 60%)',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3', // Wind sound
  },
  {
    id: 'whitenoise',
    name: 'White Noise',
    icon: Radio,
    color: 'hsl(200 20% 60%)',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3', // White noise
  },
];

export const AmbientSounds = () => {
  const [selectedSound, setSelectedSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load last selected sound from localStorage (but don't auto-play)
    const lastSound = localStorage.getItem('lastAmbientSound');
    if (lastSound) {
      setSelectedSound(lastSound);
    }
  }, []);

  useEffect(() => {
    // Pause when component unmounts (user leaves page)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    // Update audio volume
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handleSoundSelect = (soundId) => {
    // Stop current sound if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setSelectedSound(soundId);
    setIsPlaying(false);
    localStorage.setItem('lastAmbientSound', soundId);
  };

  const handlePlayPause = () => {
    if (!selectedSound) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      const sound = sounds.find((s) => s.id === selectedSound);
      if (sound) {
        // Create or update audio element
        if (!audioRef.current) {
          audioRef.current = new Audio(sound.url);
          audioRef.current.loop = true;
          audioRef.current.volume = volume[0] / 100;
        } else {
          audioRef.current.src = sound.url;
        }
        audioRef.current.play();
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const selectedSoundData = sounds.find((s) => s.id === selectedSound);

  return (
    <Card className="p-6 md:p-8 shadow-medium">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Ambient Sounds
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Choose a calming sound to enhance your focus
          </p>
        </div>

        {/* Sound Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {sounds.map((sound) => {
            const Icon = sound.icon;
            const isSelected = selectedSound === sound.id;
            return (
              <motion.button
                key={sound.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSoundSelect(sound.id)}
                className={`p-4 md:p-6 rounded-xl border-2 transition-smooth ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon
                  className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2"
                  style={{ color: sound.color }}
                />
                <p className="text-xs md:text-sm font-medium text-foreground">
                  {sound.name}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Controls */}
        {selectedSound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Now Playing */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {isPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              )}
              <span>
                {isPlaying ? 'Now Playing: ' : 'Selected: '}
                <strong className="text-foreground">{selectedSoundData?.name}</strong>
              </span>
            </div>

            {/* Play/Pause & Stop */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="gap-2 min-w-[120px]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play
                  </>
                )}
              </Button>
              {isPlaying && (
                <Button onClick={handleStop} size="lg" variant="outline">
                  Stop
                </Button>
              )}
            </div>

            {/* Volume Control */}
            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Volume</span>
                </div>
                <span className="text-sm text-muted-foreground">{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </motion.div>
        )}

        {/* Info */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Tips:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
            <li>Sound will pause when you leave this page</li>
            <li>Use headphones for the best experience</li>
            <li>Combine with breathing exercises for deeper relaxation</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
