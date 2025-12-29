import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import useStore from '../store/useStore';
import { toast } from 'sonner';

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUser, setGuest } = useStore();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock authentication
    setUser({ name: 'User', email: loginData.email });
    toast.success('Welcome back!');
    // Use replace to ensure navigation works
    setTimeout(() => navigate('/onboarding', { replace: true }), 100);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Mock registration
    setUser({ name: signupData.name, email: signupData.email });
    toast.success('Account created successfully!');
    setTimeout(() => navigate('/onboarding', { replace: true }), 100);
  };

  const handleGuest = () => {
    setGuest();
    toast.success('Continuing as guest');
    setTimeout(() => navigate('/onboarding', { replace: true }), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.img
            src="https://customer-assets.emergentagent.com/job_balance-buddy-23/artifacts/udn3mqfq_WhatsApp%20Image%202025-12-29%20at%2018.16.18_c1681a27.jpg"
            alt="Work-Life Balancer"
            className="w-24 h-24 mx-auto mb-4 rounded-full object-cover shadow-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          />
          <h1 className="text-4xl font-bold text-foreground mb-2">Work-Life Balancer</h1>
          <p className="text-muted-foreground">Your emotion-aware productivity companion</p>
        </div>

        <Card className="p-6 shadow-strong">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" size="lg" onClick={handleGuest}>
              Continue as Guest
            </Button>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          All data is stored locally in your browser
        </p>
      </motion.div>
    </div>
  );
}