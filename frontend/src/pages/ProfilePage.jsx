import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Settings, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import useStore from '../store/useStore';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, isGuest, automationEnabled, toggleAutomation, updateUser } = useStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    productivityStyle: user?.productivityStyle || 'calm',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user in the store - this will persist via Zustand
    updateUser({
      name: formData.name,
      email: formData.email,
      productivityStyle: formData.productivityStyle,
    });
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          Profile
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Info */}
      <Card className="p-6 shadow-medium">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Mail className="w-5 h-5 text-muted-foreground mt-2" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Productivity Style</Label>
            <Select
              value={formData.productivityStyle}
              onValueChange={(value) => setFormData({ ...formData, productivityStyle: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calm">Calm - Gentle reminders</SelectItem>
                <SelectItem value="focused">Focused - Regular check-ins</SelectItem>
                <SelectItem value="flexible">Flexible - Adaptive approach</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isGuest && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Guest Mode:</strong> Your profile changes are saved locally in your browser.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </Card>

      {/* Automation Settings */}
      <Card className="p-6 shadow-medium">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-secondary" />
          Automation & Assistance
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-foreground">Smart Task Automation</p>
              <p className="text-sm text-muted-foreground">
                Let the app suggest task priorities based on your mood and schedule
              </p>
            </div>
            <Switch checked={automationEnabled} onCheckedChange={toggleAutomation} />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-foreground mb-2">
              <strong>Note:</strong> Automation is designed to assist, not force.
            </p>
            <p className="text-sm text-muted-foreground">
              You always have full control over your tasks and can override any suggestions.
            </p>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 shadow-medium">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent" />
          App Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-foreground">Mood Reminders</p>
              <p className="text-sm text-muted-foreground">Get gentle reminders to track your mood</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-foreground">Wellness Nudges</p>
              <p className="text-sm text-muted-foreground">
                Receive suggestions for breathing exercises and breaks
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-foreground">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">
                Get a summary of your progress every week
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6 shadow-medium">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Your data is stored locally in your browser. You can export or clear it anytime.
          </p>
          <div className="flex gap-3">
            <Button variant="outline">Export Data</Button>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}