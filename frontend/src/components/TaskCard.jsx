import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit, Trash2, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import useStore from '../store/useStore';

export const TaskCard = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useStore();

  const handleToggleComplete = () => {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'upcoming' : 'completed',
      updatedAt: Date.now(),
    });
  };

  const priorityColor =
    task.priority === 'important' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground';

  const urgencyColor =
    task.urgency === 'now' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className="transition-smooth"
    >
      <Card
        className={`p-4 shadow-soft hover:shadow-medium transition-smooth ${
          task.status === 'completed' ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Checkbox */}
            <button
              onClick={handleToggleComplete}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth ${
                task.status === 'completed'
                  ? 'bg-primary border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              {task.status === 'completed' && <Check className="w-3 h-3 text-primary-foreground" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold text-foreground mb-1 ${
                  task.status === 'completed' ? 'line-through' : ''
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-2 text-xs">
                {task.date && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(task.date).toLocaleDateString()}
                  </span>
                )}
                {task.time && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </span>
                )}
                <Badge className={priorityColor}>{task.priority}</Badge>
                <Badge className={urgencyColor}>{task.urgency}</Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};