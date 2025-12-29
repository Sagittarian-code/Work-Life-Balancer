import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import useStore from '../store/useStore';

export default function RemindersPage() {
  const { tasks } = useStore();

  // Get tasks with dates as reminders
  const reminders = useMemo(
    () =>
      tasks
        .filter((t) => t.date && t.status !== 'completed')
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [tasks]
  );

  // Group by date
  const groupedReminders = useMemo(() => {
    const groups = {};
    reminders.forEach((task) => {
      const date = new Date(task.date).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(task);
    });
    return groups;
  }, [reminders]);

  const isToday = (date) => date === new Date().toDateString();
  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date === tomorrow.toDateString();
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground mt-1">Stay on top of your schedule</p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Add Reminder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{reminders.length}</p>
              <p className="text-sm text-muted-foreground">Active reminders</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {groupedReminders[new Date().toDateString()]?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Due today</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Object.keys(groupedReminders).length}
              </p>
              <p className="text-sm text-muted-foreground">Days with reminders</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reminders List */}
      {Object.keys(groupedReminders).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedReminders).map(([date, tasks]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {getDateLabel(date)}
              </h3>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-4 shadow-soft hover:shadow-medium transition-smooth">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{task.title}</h4>
                          {task.urgency === 'now' && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              Urgent
                            </Badge>
                          )}
                          {task.priority === 'important' && (
                            <Badge className="bg-primary text-primary-foreground">
                              Important
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                        )}
                        {task.time && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            {task.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center shadow-soft">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Bell className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No reminders yet</h3>
          <p className="text-muted-foreground mb-6">
            Create tasks with dates to see them as reminders here
          </p>
        </Card>
      )}
    </div>
  );
}