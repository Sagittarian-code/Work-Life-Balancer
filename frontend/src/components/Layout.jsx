import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, BookOpen, Heart, BarChart, User, LogOut } from 'lucide-react';
import useStore from '../store/useStore';
import { Button } from './ui/button';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isGuest, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/reminders', icon: Calendar, label: 'Reminders' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/wellness', icon: Heart, label: 'Wellness' },
    { path: '/analytics', icon: BarChart, label: 'Analytics' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-card border-r border-border flex flex-col shadow-soft"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="https://static.prod-images.emergentagent.com/jobs/bf2943b7-3896-49fc-9373-bd8f9077dc23/images/75077385fdf76cb6d1d613c19bb668bb24e5269cfe216977307e1f1d4ef8a09b.png"
              alt="Work-Life Balancer Logo"
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-lg font-bold text-foreground">Work-Life</h1>
              <p className="text-xs text-muted-foreground">Balancer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start transition-smooth"
                onClick={() => navigate(item.path)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="px-3 py-2 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground">
              {isGuest ? 'Guest User' : user?.name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isGuest ? 'Temporary Session' : user?.email || ''}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};