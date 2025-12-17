import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.blog': 'BLOG',
    'nav.resources': 'RESOURCES',
    'nav.projects': 'PROJECTS',
    'home.subtitle': 'Web3 Platform • Crypto Dashboard • Portfolio Manager',
    'home.description': 'Your all-in-one Web3 hub for real-time crypto prices, gas tracking, portfolio management, and blockchain interactions. Powered by advanced analytics and community insights.',
    'home.btn.dashboard': 'EXPLORE DASHBOARD →',
    'home.btn.blog': 'READ BLOG',
    'home.btn.contract': 'CONTRACT INTERACTIONS →',
  },
  pt: {
    'nav.blog': 'BLOG',
    'nav.resources': 'RECURSOS',
    'nav.projects': 'PROJETOS',
    'home.subtitle': 'Plataforma Web3 • Dashboard de Criptomoedas • Gerenciador de Portfólio',
    'home.description': 'Seu hub Web3 tudo-em-um para preços de criptomoedas em tempo real, rastreamento de gas, gerenciamento de portfólio e interações blockchain. Alimentado por análises avançadas e insights da comunidade.',
    'home.btn.dashboard': 'EXPLORAR PAINEL →',
    'home.btn.blog': 'LER BLOG',
    'home.btn.contract': 'INTERAÇÕES COM CONTRATO →',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('language') as Language | null;
    return saved || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
