import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import useStore from '../store/useStore';
import { generateCompanionResponse } from '../utils/journalCompanion';
import { toast } from 'sonner';

export default function JournalPage() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, { content });
      toast.success('Journal entry updated');
    } else {
      addJournalEntry({ content });
      toast.success('Journal entry saved');
    }

    setContent('');
    setEditingEntry(null);
    setDialogOpen(false);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setContent(entry.content);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    deleteJournalEntry(id);
    toast.success('Journal entry deleted');
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingEntry(null);
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journal</h1>
          <p className="text-muted-foreground mt-1">Your safe space for thoughts and reflections</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          New Entry
        </Button>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {journalEntries.length > 0 ? (
            [...journalEntries]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(entry.timestamp).toLocaleString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                          {entry.content}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Card className="p-12 shadow-soft">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-5xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Start your journaling journey
                </h3>
                <p className="text-muted-foreground mb-6">
                  Write your thoughts, feelings, and reflections in a safe, private space
                </p>
                <Button onClick={() => setDialogOpen(true)}>Write First Entry</Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Journal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Entry' : 'New Journal Entry'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={12}
              className="resize-none"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim()}>
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}