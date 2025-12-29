import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // User State
      user: null,
      isAuthenticated: false,
      isGuest: false,

      // Mood State
      currentMood: {
        energy: 50,
        mood: 'calm',
        timestamp: Date.now(),
      },
      moodHistory: [],

      // Tasks State
      tasks: [],
      
      // Automation State
      automationEnabled: true,

      // Journal State
      journalEntries: [],

      // Reminders State
      reminders: [],

      // Actions
      setUser: (user) => {
        // Merge with existing user data if available
        set((state) => ({
          user: { ...state.user, ...user },
          isAuthenticated: true,
          isGuest: false,
        }));
      },
      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },
      setGuest: () => set((state) => ({ 
        isGuest: true, 
        isAuthenticated: true,
        // Keep user data if it exists (for returning guests)
        user: state.user || { name: 'Guest User' }
      })),
      logout: () => {
        // Don't clear user data on logout - keep it for next session
        set({ isAuthenticated: false, isGuest: false });
      },

      updateMood: (mood) => {
        const newMood = { ...mood, timestamp: Date.now() };
        set((state) => ({
          currentMood: newMood,
          moodHistory: [...state.moodHistory, newMood].slice(-7), // Keep last 7 days
        }));
      },

      addTask: (task) => {
        const newTask = {
          id: Date.now().toString(),
          ...task,
          status: 'upcoming',
          createdAt: Date.now(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleAutomation: () => {
        set((state) => ({ automationEnabled: !state.automationEnabled }));
      },

      addJournalEntry: (entry) => {
        const newEntry = {
          id: Date.now().toString(),
          ...entry,
          timestamp: Date.now(),
        };
        set((state) => ({
          journalEntries: [...state.journalEntries, newEntry],
        }));
      },

      updateJournalEntry: (id, updates) => {
        set((state) => ({
          journalEntries: state.journalEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
      },

      deleteJournalEntry: (id) => {
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
        }));
      },

      // Reminder Actions
      addReminder: (reminder) => {
        const newReminder = {
          id: Date.now().toString(),
          ...reminder,
          createdAt: Date.now(),
          enabled: true,
        };
        set((state) => ({ reminders: [...state.reminders, newReminder] }));
      },

      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...updates } : reminder
          ),
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      toggleReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
          ),
        }));
      },

      // Get insights based on current data
      getInsights: () => {
        const state = get();
        const insights = [];

        // Task overload insight
        const upcomingTasks = state.tasks.filter((t) => t.status === 'upcoming');
        const importantTasks = upcomingTasks.filter((t) => t.priority === 'important');
        
        if (upcomingTasks.length > 10) {
          insights.push({
            type: 'warning',
            message: "You seem overloaded — slowing down may help.",
          });
        }

        // Mood-based insight
        if (state.currentMood.energy < 30) {
          insights.push({
            type: 'info',
            message: "Your energy is low. Consider taking a break or doing a breathing exercise.",
          });
        }

        // Positive reinforcement
        const completedToday = state.tasks.filter(
          (t) =>
            t.status === 'completed' &&
            new Date(t.updatedAt || t.createdAt).toDateString() === new Date().toDateString()
        );
        
        if (completedToday.length > 3) {
          insights.push({
            type: 'success',
            message: "You're doing better than earlier this week. Keep it up!",
          });
        }

        // Good focus moment
        if (state.currentMood.energy > 60 && upcomingTasks.length > 0) {
          insights.push({
            type: 'info',
            message: "This is a good moment to focus on important tasks.",
          });
        }

        return insights;
      },
    }),
    {
      name: 'work-life-balancer-storage',
    }
  )
);

export default useStore;