import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '~/contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { t } = useTranslation();
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-stone-700 hover:text-stone-900 hover:bg-white/20 transition-all duration-300 group"
        aria-label="Toggle language"
      >
        <Globe className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
        <span className="text-sm font-light uppercase tracking-wider">
          {currentLanguage === 'en' ? 'FR' : 'EN'}
        </span>
      </button>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-stone-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        {currentLanguage === 'en' ? t('language.french') : t('language.english')}
      </div>
    </div>
  );
}
