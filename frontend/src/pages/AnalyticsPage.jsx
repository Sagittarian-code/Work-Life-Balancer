import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import useStore from '../store/useStore';
import {
  BarChart as RechartsBar,
  Bar,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['hsl(270 60% 65%)', 'hsl(150 50% 65%)', 'hsl(200 70% 60%)'];

export default function AnalyticsPage() {
  const { tasks, moodHistory } = useStore();

  // Task completion data (last 5 days)
  const taskData = useMemo(() => {
    const last5Days = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (4 - i));
      return date.toDateString();
    });

    return last5Days.map((date) => {
      const dayTasks = tasks.filter(
        (t) => t.createdAt && new Date(t.createdAt).toDateString() === date
      );
      const completed = dayTasks.filter((t) => t.status === 'completed').length;
      return {
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: dayTasks.length,
        completed,
      };
    });
  }, [tasks]);

  // Mood & Energy data
  const moodData = useMemo(() => {
    return moodHistory.slice(-7).map((mood, idx) => ({
      day: `Day ${idx + 1}`,
      energy: mood.energy,
    }));
  }, [moodHistory]);

  // Priority distribution
  const priorityData = useMemo(() => {
    const important = tasks.filter((t) => t.priority === 'important').length;
    const notImportant = tasks.filter((t) => t.priority === 'not-important').length;
    return [
      { name: 'Important', value: important },
      { name: 'Not Important', value: notImportant },
    ];
  }, [tasks]);

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-2">Track your progress and patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 md:p-6 shadow-soft">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Tasks</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{tasks.length}</p>
        </Card>
        <Card className="p-4 md:p-6 shadow-soft">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Completed</p>
          <p className="text-2xl md:text-3xl font-bold text-success">
            {tasks.filter((t) => t.status === 'completed').length}
          </p>
        </Card>
        <Card className="p-4 md:p-6 shadow-soft">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Completion Rate</p>
          <p className="text-2xl md:text-3xl font-bold text-primary">{completionRate}%</p>
          <Progress value={completionRate} className="mt-2" />
        </Card>
        <Card className="p-4 md:p-6 shadow-soft">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Avg Energy</p>
          <p className="text-2xl md:text-3xl font-bold text-secondary">
            {moodHistory.length > 0
              ? Math.round(
                  moodHistory.reduce((acc, m) => acc + m.energy, 0) / moodHistory.length
                )
              : 0}
            %
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Chart */}
        <Card className="p-6 shadow-medium">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-primary" />
            Task Activity (Last 5 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsBar data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="completed" fill="hsl(150 60% 65%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="tasks" fill="hsl(270 60% 65%)" radius={[8, 8, 0, 0]} />
            </RechartsBar>
          </ResponsiveContainer>
        </Card>

        {/* Energy Trend Chart */}
        <Card className="p-6 shadow-medium">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-secondary" />
            Energy Trend
          </h3>
          {moodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsLine data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="hsl(150 60% 65%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(150 60% 65%)', r: 5 }}
                />
              </RechartsLine>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Track your mood to see energy trends
            </div>
          )}
        </Card>

        {/* Priority Distribution */}
        <Card className="p-6 shadow-medium">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-accent" />
            Task Priority Distribution
          </h3>
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Create tasks to see distribution
            </div>
          )}
        </Card>

        {/* Weekly Summary */}
        <Card className="p-6 shadow-medium bg-gradient-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tasks Created</span>
              <span className="text-xl font-bold text-foreground">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tasks Completed</span>
              <span className="text-xl font-bold text-success">
                {tasks.filter((t) => t.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Important Tasks</span>
              <span className="text-xl font-bold text-primary">
                {tasks.filter((t) => t.priority === 'important').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mood Entries</span>
              <span className="text-xl font-bold text-secondary">{moodHistory.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}