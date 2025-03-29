import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import enTranslations from '../locale/en.json';
import zhHansTranslations from '../locale/zh-hans.json';
import zhHantTranslations from '../locale/zh-hant.json';

// Define the supported languages
export type SupportedLanguage = 'en' | 'zhHans' | 'zhHant';

// Define the structure for translation objects
type TranslationValue = string | Record<string, any>;
type TranslationRecord = Record<string, TranslationValue>;

// Define the type for the language context
type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string; // translation function
};

// Create the initial context value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary with imported JSON files
const translations: Record<SupportedLanguage, TranslationRecord> = {
  en: enTranslations,
  zhHans: zhHansTranslations,
  zhHant: zhHantTranslations
};

// Helper function to detect browser language
const detectBrowserLanguage = (): SupportedLanguage => {
  // Get browser language from navigator
  const browserLang = navigator.language.toLowerCase();
  
  // Check if the browser language starts with 'zh' (any Chinese variant)
  if (browserLang.startsWith('zh')) {
    if (browserLang.startsWith('zh-Hant')) {
      return 'zhHant';
    }
    else {
      return 'zhHans';
    }
  }
  
  // Default to English for all other languages
  return 'en';
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to get saved language from localStorage, or detect from browser, default to 'en'
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('language') as SupportedLanguage;
    if (saved && (saved === 'en' || saved === 'zhHans' || saved === 'zhHant')) {
      return saved;
    }
    // If no saved preference, detect from browser
    return detectBrowserLanguage();
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function that handles nested keys like "nav.home"
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};