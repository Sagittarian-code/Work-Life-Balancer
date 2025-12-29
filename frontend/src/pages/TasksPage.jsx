import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { TaskCard } from '../components/TaskCard';
import { TaskDialog } from '../components/TaskDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import useStore from '../store/useStore';

export default function TasksPage() {
  const { tasks } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage your tasks and priorities
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          size="lg"
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({tasks.filter((t) => t.status === 'upcoming').length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({tasks.filter((t) => t.status === 'in-progress').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({tasks.filter((t) => t.status === 'completed').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={handleEdit} />)
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-6">
                {filter === 'all'
                  ? 'Create your first task to get started'
                  : `No ${filter} tasks at the moment`}
              </p>
              {filter === 'all' && (
                <Button onClick={() => setDialogOpen(true)}>Create Task</Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task Dialog */}
      <TaskDialog open={dialogOpen} onClose={handleClose} task={editingTask} />
    </div>
  );
}