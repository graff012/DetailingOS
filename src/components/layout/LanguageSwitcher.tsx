import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { cn } from '../../lib/utils';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useShopStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-background border border-border hover:border-border-bright text-xs text-foreground font-mono transition-all hover:bg-card-hover select-none"
        title="Change Language / Сменить язык / Tilni o'zgartirish"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-semibold tracking-wide text-xs">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn('w-3 h-3 text-foreground-subtle transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-lg bg-card border border-border shadow-popover py-1 z-50 text-xs font-mono animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] text-foreground-subtle uppercase border-b border-border/60">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-card-hover',
                language === lang.code ? 'text-emerald font-bold bg-card-subtle' : 'text-foreground'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none">{lang.flag}</span>
                <span className="font-sans text-xs">{lang.nativeName}</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
