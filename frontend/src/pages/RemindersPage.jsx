import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, Plus, Edit, Trash2, Power } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ReminderDialog } from '../components/ReminderDialog';
import useStore from '../store/useStore';
import { toast } from 'sonner';

export default function RemindersPage() {
  const { reminders, deleteReminder, toggleReminder } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Group reminders by date
  const groupedReminders = useMemo(() => {
    const groups = {};
    const sortedReminders = [...reminders].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    sortedReminders.forEach((reminder) => {
      const date = new Date(reminder.date).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(reminder);
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

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingReminder(null);
  };

  const handleDelete = (id) => {
    deleteReminder(id);
    toast.success('Reminder deleted');
  };

  const handleToggle = (id) => {
    toggleReminder(id);
    toast.success('Reminder updated');
  };

  const activeReminders = reminders.filter((r) => r.enabled).length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Reminders</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Stay on top of your schedule
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          size="lg"
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Reminder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {activeReminders}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Active reminders</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {groupedReminders[new Date().toDateString()]?.length || 0}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Due today</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {Object.keys(groupedReminders).length}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Days with reminders</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reminders List */}
      {Object.keys(groupedReminders).length > 0 ? (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedReminders).map(([date, dateReminders]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <h3 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  {getDateLabel(date)}
                </h3>
                <div className="space-y-2">
                  {dateReminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card
                        className={`p-4 shadow-soft hover:shadow-medium transition-smooth ${
                          !reminder.enabled ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold text-foreground">
                                {reminder.title}
                              </h4>
                              {reminder.enabled ? (
                                <Badge className="bg-primary text-primary-foreground">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {reminder.description}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Bell className="w-3 h-3" />
                              {reminder.time}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggle(reminder.id)}
                              className="h-8 w-8 md:h-10 md:w-10"
                            >
                              <Power className={`w-4 h-4 ${reminder.enabled ? 'text-primary' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(reminder)}
                              className="h-8 w-8 md:h-10 md:w-10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(reminder.id)}
                              className="h-8 w-8 md:h-10 md:w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="p-12 md:p-16 text-center shadow-soft">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Bell className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No reminders yet
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Create your first reminder to stay on top of important events
          </p>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Reminder
          </Button>
        </Card>
      )}

      {/* Reminder Dialog */}
      <ReminderDialog open={dialogOpen} onClose={handleClose} reminder={editingReminder} />
    </div>
  );
}