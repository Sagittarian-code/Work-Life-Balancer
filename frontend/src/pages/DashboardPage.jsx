import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Smile, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { InsightCard } from '../components/InsightCard';
import { MoodSelector } from '../components/MoodSelector';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isGuest, tasks, currentMood, getInsights } = useStore();
  const [showMoodSelector, setShowMoodSelector] = React.useState(false);

  const insights = useMemo(() => getInsights(), [getInsights]);

  const todayTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.date &&
          new Date(t.date).toDateString() === new Date().toDateString()
      ),
    [tasks]
  );

  const completedToday = useMemo(
    () => todayTasks.filter((t) => t.status === 'completed').length,
    [todayTasks]
  );

  const upcomingTasks = useMemo(
    () => tasks.filter((t) => t.status === 'upcoming').length,
    [tasks]
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMoodEmoji = () => {
    const moodEmojis = {
      happy: '😊',
      calm: '😌',
      stressed: '😰',
      tired: '😴',
    };
    return moodEmojis[currentMood.mood] || '😊';
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {getGreeting()}, {isGuest ? (user?.name || 'Friend') : user?.name || 'there'}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Let's make today productive and balanced
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Mood</span>
            <Smile className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{getMoodEmoji()}</span>
            <div>
              <p className="text-2xl font-bold text-foreground capitalize">{currentMood.mood}</p>
              <p className="text-xs text-muted-foreground">Energy: {currentMood.energy}%</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3"
            onClick={() => setShowMoodSelector(true)}
          >
            Update Mood
          </Button>
        </Card>

        <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's Tasks</span>
            <Calendar className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{todayTasks.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {completedToday} completed
          </p>
          {todayTasks.length > 0 && (
            <Progress value={(completedToday / todayTasks.length) * 100} className="mt-3" />
          )}
        </Card>

        <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Upcoming</span>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{upcomingTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">
            tasks pending
          </p>
        </Card>

        <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Completed</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {tasks.filter((t) => t.status === 'completed').length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            all time
          </p>
        </Card>
      </motion.div>

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div variants={item}>
          <h2 className="text-2xl font-bold text-foreground mb-4">Insights</h2>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Today's Focus */}
      <motion.div variants={item}>
        <Card className="p-6 shadow-medium bg-gradient-card">
          <h2 className="text-2xl font-bold text-foreground mb-4">Today's Focus</h2>
          {todayTasks.length > 0 ? (
            <div className="space-y-3">
              {todayTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-success' : 'bg-primary'
                    }`}
                  />
                  <span className="flex-1 text-foreground">{task.title}</span>
                  {task.time && (
                    <span className="text-sm text-muted-foreground">{task.time}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tasks for today yet</p>
              <Button onClick={() => navigate('/tasks')}>Add Your First Task</Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => navigate('/tasks')}
          >
            <CheckCircle className="w-6 h-6" />
            <span>Manage Tasks</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => navigate('/journal')}
          >
            <Calendar className="w-6 h-6" />
            <span>Write Journal</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => navigate('/wellness')}
          >
            <Smile className="w-6 h-6" />
            <span>Wellness</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => navigate('/analytics')}
          >
            <TrendingUp className="w-6 h-6" />
            <span>Analytics</span>
          </Button>
        </div>
      </motion.div>

      {/* Mood Selector Dialog */}
      {showMoodSelector && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <MoodSelector
              onComplete={() => {
                setShowMoodSelector(false);
                toast.success('Mood updated!');
              }}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}