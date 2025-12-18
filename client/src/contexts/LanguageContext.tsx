import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt';

interface Translations {
  [key: string]: {
    en: string;
    pt: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.blog': { en: 'BLOG', pt: 'BLOG' },
  'nav.resources': { en: 'RESOURCES', pt: 'RECURSOS' },
  'nav.projects': { en: 'PROJECTS', pt: 'PROJETOS' },
  
  // Dashboard
  'dashboard.title': { en: '[DASHBOARD]', pt: '[PAINEL]' },
  'dashboard.subtitle': { en: 'Arc Network Real-time Metrics & On-chain Data', pt: 'Métricas em Tempo Real da Rede Arc & Dados On-chain' },
  'dashboard.market_prices': { en: 'Market Prices', pt: 'Preços de Mercado' },
  'dashboard.gas_prices': { en: 'Gas Prices', pt: 'Preços de Gas' },
  'dashboard.my_portfolio': { en: 'My Portfolio', pt: 'Meu Portfólio' },
  'dashboard.network_metrics': { en: 'NETWORK METRICS', pt: 'MÉTRICAS DE REDE' },
  'dashboard.on_chain_registry': { en: 'ON-CHAIN REGISTRY', pt: 'REGISTRO ON-CHAIN' },
  'dashboard.connect_wallet': { en: 'CONNECT WALLET', pt: 'CONECTAR CARTEIRA' },
  'dashboard.refresh': { en: 'REFRESH', pt: 'ATUALIZAR' },
  'dashboard.no_assets': { en: 'No assets yet', pt: 'Nenhum ativo ainda' },
  'dashboard.failed_to_fetch': { en: 'Failed to fetch', pt: 'Falha ao buscar' },
  
  // Contract
  'contract.title': { en: '[CONTRACT]', pt: '[CONTRATO]' },
  'contract.subtitle': { en: 'Register Projects & Support Arc Network', pt: 'Registre Projetos & Apoie a Rede Arc' },
  'contract.register_project': { en: 'REGISTER PROJECT', pt: 'REGISTRAR PROJETO' },
  'contract.donate_usdc': { en: 'DONATE USDC', pt: 'DOAR USDC' },
  'contract.how_to_register': { en: 'How to Register', pt: 'Como Registrar' },
  'contract.benefits': { en: 'Benefits', pt: 'Benefícios' },
  'contract.requirements': { en: 'Requirements', pt: 'Requisitos' },
  'contract.total_projects': { en: 'TOTAL PROJECTS', pt: 'TOTAL DE PROJETOS' },
  'contract.total_donations': { en: 'TOTAL DONATIONS', pt: 'TOTAL DE DOAÇÕES' },
  'contract.contributors': { en: 'CONTRIBUTORS', pt: 'CONTRIBUIDORES' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
