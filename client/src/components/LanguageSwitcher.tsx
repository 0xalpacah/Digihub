import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 border border-cyan-400 rounded px-3 py-2">
      <Globe size={16} className="text-cyan-400" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs font-mono transition-all ${
          language === 'en'
            ? 'bg-cyan-400 text-black'
            : 'text-cyan-400 hover:bg-cyan-400 hover:text-black'
        }`}
      >
        EN
      </button>
      <span className="text-cyan-400">/</span>
      <button
        onClick={() => setLanguage('pt')}
        className={`px-2 py-1 text-xs font-mono transition-all ${
          language === 'pt'
            ? 'bg-cyan-400 text-black'
            : 'text-cyan-400 hover:bg-cyan-400 hover:text-black'
        }`}
      >
        PT
      </button>
    </div>
  );
}
