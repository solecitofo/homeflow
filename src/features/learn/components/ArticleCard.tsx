import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { Article } from '../data/articles';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  delay?: number;
}

const categoryColors = {
  psychology: {
    bg: 'bg-empathy-50',
    border: 'border-empathy-200',
    text: 'text-empathy-700',
    badge: 'bg-empathy-100',
  },
  habits: {
    bg: 'bg-sage-50',
    border: 'border-sage-200',
    text: 'text-sage-700',
    badge: 'bg-sage-100',
  },
  science: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    badge: 'bg-primary-100',
  },
};

const categoryLabels = {
  psychology: 'Psicología',
  habits: 'Hábitos',
  science: 'Ciencia',
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onClick,
  delay = 0,
}) => {
  const colors = categoryColors[article.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        ${colors.bg} border-2 ${colors.border}
        rounded-2xl p-6 cursor-pointer
        transition-all duration-200
        hover:shadow-lg
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-5xl flex-shrink-0">{article.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`${colors.badge} ${colors.text} px-3 py-1 rounded-full text-xs font-medium`}>
              {categoryLabels[article.category]}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {article.title}
          </h3>

          {/* Subtitle */}
          <p className="text-sm font-medium text-gray-600 mb-3">
            {article.subtitle}
          </p>

          {/* Summary */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {article.summary}
          </p>

          {/* Read More */}
          <div className="flex items-center gap-1 text-sm font-medium text-primary-600">
            <span>Leer artículo</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
