import React from 'react';
import { motion } from 'framer-motion';
import { ArticleSection } from '../data/articles';

interface ArticleContentProps {
  sections: ArticleSection[];
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ sections }) => {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {section.type === 'heading' && (
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
              {section.content as string}
            </h2>
          )}

          {section.type === 'paragraph' && (
            <p className="text-gray-700 leading-relaxed">
              {section.content as string}
            </p>
          )}

          {section.type === 'list' && (
            <ul className="space-y-2 ml-4">
              {(section.content as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary-500 font-bold mt-1">•</span>
                  <span className="text-gray-700 flex-1">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {section.type === 'highlight' && (
            <div className="bg-gradient-to-r from-primary-50 to-sage-50 border-l-4 border-primary-500 rounded-r-xl p-6 my-6">
              <p className="text-gray-800 font-semibold italic">
                {section.content as string}
              </p>
            </div>
          )}

          {section.type === 'quote' && (
            <blockquote className="border-l-4 border-gray-300 pl-6 py-2 my-6 italic text-gray-600">
              {section.content as string}
            </blockquote>
          )}
        </motion.div>
      ))}
    </div>
  );
};
