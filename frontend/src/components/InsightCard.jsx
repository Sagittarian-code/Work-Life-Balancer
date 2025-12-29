import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';

export const InsightCard = ({ insight }) => {
  const iconMap = {
    warning: AlertCircle,
    info: Info,
    success: CheckCircle,
  };

  const colorMap = {
    warning: 'text-destructive',
    info: 'text-primary',
    success: 'text-success',
  };

  const bgMap = {
    warning: 'bg-destructive/10',
    info: 'bg-primary/10',
    success: 'bg-success/10',
  };

  const Icon = iconMap[insight.type] || Info;
  const color = colorMap[insight.type] || 'text-primary';
  const bg = bgMap[insight.type] || 'bg-primary/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={`p-4 ${bg} border-none shadow-soft`}>
        <div className="flex gap-3">
          <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
          <p className="text-sm text-foreground">{insight.message}</p>
        </div>
      </Card>
    </motion.div>
  );
};