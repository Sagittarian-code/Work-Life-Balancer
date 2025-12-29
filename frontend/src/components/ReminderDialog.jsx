import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import useStore from '../store/useStore';

export const ReminderDialog = ({ open, onClose, reminder }) => {
  const { addReminder, updateReminder } = useStore();
  const isEditing = !!reminder;

  const [formData, setFormData] = useState(
    reminder || {
      title: '',
      description: '',
      date: '',
      time: '',
      enabled: true,
    }
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateReminder(reminder.id, formData);
    } else {
      addReminder(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] z-50">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Reminder' : 'Create New Reminder'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-title">Title *</Label>
            <Input
              id="reminder-title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter reminder title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-description">Description</Label>
            <Textarea
              id="reminder-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add details about this reminder..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-date">Date *</Label>
              <Input
                id="reminder-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-time">Time *</Label>
              <Input
                id="reminder-time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <Label htmlFor="reminder-enabled" className="cursor-pointer">
              Enable Reminder
            </Label>
            <Switch
              id="reminder-enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => handleChange('enabled', checked)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update Reminder' : 'Create Reminder'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
