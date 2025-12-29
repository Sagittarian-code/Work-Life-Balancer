import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, BookOpen, Heart, BarChart, User, LogOut, Menu, X } from 'lucide-react';
import useStore from '../store/useStore';
import { Button } from './ui/button';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isGuest, logout } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
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

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src="https://customer-assets.emergentagent.com/job_balance-buddy-23/artifacts/udn3mqfq_WhatsApp%20Image%202025-12-29%20at%2018.16.18_c1681a27.jpg"
            alt="Work-Life Balancer Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground">Work-Life</h1>
            <p className="text-xs text-muted-foreground">Balancer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start transition-smooth text-sm md:text-base h-10 md:h-auto"
              onClick={() => handleNavClick(item.path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 md:p-4 border-t border-border space-y-2">
        <div className="px-3 py-2 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.name || (isGuest ? 'Guest User' : 'User')}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {isGuest ? 'Temporary Session' : user?.email || ''}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-sm md:text-base h-10 md:h-auto"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://static.prod-images.emergentagent.com/jobs/bf2943b7-3896-49fc-9373-bd8f9077dc23/images/75077385fdf76cb6d1d613c19bb668bb24e5269cfe216977307e1f1d4ef8a09b.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="font-bold text-foreground">Work-Life Balancer</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col shadow-soft">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col shadow-strong z-50"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};