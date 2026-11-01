import React from 'react';
import {
  Sun,
  Plus,
  Search,
  Menu,
  Share2,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC<{ onOpenNewBooking: () => void }> = ({ onOpenNewBooking }) => {
  const { setIsCmdkOpen, setIsMobileMenuOpen, setIsYongoqModalOpen, language, t } = useShopStore();

  return (
    <header className="h-14 bg-card border-b border-border px-2.5 sm:px-6 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left: Mobile Menu Toggle & Streamlined Studio Status */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-1.5 -ml-1 text-foreground-subtle hover:text-foreground rounded-md hover:bg-card-hover transition-colors shrink-0"
          title="Open menu"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md bg-background border border-border text-xs min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse shrink-0" />
          <span className="font-semibold text-foreground tracking-tight font-sans text-xs truncate max-w-[110px] sm:max-w-none">
            {t.header.studioName}
          </span>
          <span className="text-foreground-subtle hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1 text-foreground-muted font-mono text-[11px] shrink-0">
            <Sun className="w-3.5 h-3.5 text-amber shrink-0" />
            21°C
          </span>
        </div>
      </div>

      {/* Right: Actions, Global Search, Yong'oq Gateway, Language Switcher & Booking CTA */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Yong'oq Integration Trigger */}
        <button
          onClick={() => setIsYongoqModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background border border-border hover:border-amber/40 text-xs font-mono text-foreground-muted hover:text-foreground transition-all group"
          title="Yong‘oq Ingestion Gateway (Webhooks & API)"
        >
          <Share2 className="w-3.5 h-3.5 text-amber group-hover:scale-110 transition-transform" />
          <span className="font-sans text-xs">Yong‘oq</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
        </button>

        <button
          onClick={() => setIsCmdkOpen(true)}
          className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-background border border-border hover:border-border-bright text-xs text-foreground-muted hover:text-foreground transition-all group"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-foreground-subtle group-hover:text-emerald transition-colors" />
          <span className="font-sans text-xs hidden md:inline">{t.header.searchPlaceholder}</span>
          <kbd className="font-mono text-[10px] bg-card px-1.5 py-0.5 rounded border border-border text-foreground-subtle">
            ⌘K
          </kbd>
        </button>

        {/* Language Switcher Dropdown (EN / RU / UZ) */}
        <LanguageSwitcher />

        {/* New Booking CTA */}
        <button
          onClick={onOpenNewBooking}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-md bg-emerald hover:bg-emerald/90 text-background font-semibold text-xs font-sans transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">{t.header.newBooking}</span>
          <span className="sm:hidden">
            {language === 'uz' ? 'Buyurtma' : language === 'ru' ? 'Запись' : 'Booking'}
          </span>
        </button>
      </div>
    </header>
  );
};
