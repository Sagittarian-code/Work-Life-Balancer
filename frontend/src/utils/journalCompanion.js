// Rule-based journal companion responses
// No external API - uses mood, energy, and keyword detection

const responses = {
  stressed: [
    "It sounds like you've been carrying a lot today.",
    "You don't need to solve everything at once.",
    "Sometimes the weight we carry deserves to be set down, even briefly.",
    "Taking a breath between tasks isn't weakness—it's wisdom.",
  ],
  tired: [
    "It's okay to rest.",
    "Your body is telling you something important.",
    "Rest isn't giving up. It's recharging.",
    "Even small steps forward still count as progress.",
  ],
  overwhelmed: [
    "One thing at a time is enough.",
    "You don't need to have all the answers right now.",
    "Breaking things down into smaller pieces can help.",
    "It's okay to ask for help or to pause.",
  ],
  happy: [
    "It's beautiful to see you recognizing these moments.",
    "Hold onto this feeling—you've earned it.",
    "Your joy matters, and so do you.",
    "This lightness you're feeling? That's real progress.",
  ],
  calm: [
    "This peaceful moment is worth honoring.",
    "You're finding your center, and that's powerful.",
    "Balance isn't constant, but you're here for it now.",
    "May this calm stay with you through what comes next.",
  ],
  progress: [
    "Even small progress matters.",
    "Look how far you've already come.",
    "You're moving forward, even when it feels slow.",
    "Every step, no matter how small, is still a step.",
  ],
  stuck: [
    "Being stuck doesn't mean you're failing.",
    "Sometimes pausing helps us see the path forward.",
    "This feeling is temporary, even when it doesn't feel that way.",
    "You've navigated uncertainty before. You can do it again.",
  ],
  default: [
    "Thank you for sharing this with me.",
    "Your thoughts and feelings matter.",
    "I'm here with you in this moment.",
    "Whatever you're feeling right now is valid.",
  ],
};

const keywords = {
  stressed: ['stress', 'stressed', 'pressure', 'anxious', 'anxiety', 'worried', 'worry'],
  tired: ['tired', 'exhausted', 'drained', 'fatigue', 'sleepy', 'weary', 'worn'],
  overwhelmed: ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'swamped', 'buried'],
  happy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'fantastic', 'good'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'quiet', 'still'],
  progress: ['progress', 'achievement', 'accomplished', 'finished', 'completed', 'done'],
  stuck: ['stuck', 'blocked', 'lost', 'confused', 'unsure', 'don\'t know', 'uncertain'],
};

export const generateCompanionResponse = (journalText, userMood, energyLevel) => {
  const text = journalText.toLowerCase();
  
  // Check for keywords in journal text
  let detectedCategory = null;
  let maxMatches = 0;
  
  for (const [category, keywordList] of Object.entries(keywords)) {
    const matches = keywordList.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedCategory = category;
    }
  }
  
  // If no strong keyword match, use mood and energy
  if (!detectedCategory || maxMatches === 0) {
    if (energyLevel < 30) {
      detectedCategory = 'tired';
    } else if (userMood === 'stressed') {
      detectedCategory = 'stressed';
    } else if (userMood === 'happy') {
      detectedCategory = 'happy';
    } else if (userMood === 'calm') {
      detectedCategory = 'calm';
    } else {
      detectedCategory = 'default';
    }
  }
  
  // Get random response from selected category
  const categoryResponses = responses[detectedCategory] || responses.default;
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  
  return categoryResponses[randomIndex];
};
