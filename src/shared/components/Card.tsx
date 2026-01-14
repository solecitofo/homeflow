import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  delay?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  hover = false,
  padding = 'md',
  delay = 0,
}) => {
  const baseClasses = 'bg-white rounded-3xl shadow-xl';

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover
    ? 'cursor-pointer hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
    : '';

  const classes = `${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  const CardContent = (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );

  if (delay > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
      >
        {CardContent}
      </motion.div>
    );
  }

  return CardContent;
};
