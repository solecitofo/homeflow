import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { getArticleById } from '../data/articles';
import { ArticleContent } from './ArticleContent';
import { Button } from '../../../shared/components/Button';

export const ArticleReader: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const article = articleId ? getArticleById(articleId) : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Artículo no encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            El artículo que buscas no existe o ha sido removido.
          </p>
          <Button onClick={() => navigate('/learn')} variant="primary">
            Volver al centro de aprendizaje
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Artículos</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} min</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-6xl mb-6 text-center">{article.icon}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6 text-center">
            {article.subtitle}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-sage-500 mx-auto rounded-full" />
        </motion.div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <ArticleContent sections={article.content} />
        </motion.div>

        {/* Back to Articles Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/learn')}
            fullWidth
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ver más artículos
          </Button>
        </motion.div>

        {/* Motivational Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          El conocimiento es poder, pero la acción es transformación
        </motion.p>
      </div>
    </div>
  );
};
