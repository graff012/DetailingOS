import React from 'react';
import {
  Sun,
  Plus,
  Search,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC<{ onOpenNewBooking: () => void }> = ({ onOpenNewBooking }) => {
  const { setIsCmdkOpen, t } = useShopStore();

  return (
    <header className="h-14 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left: Streamlined Studio Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span className="font-semibold text-foreground tracking-tight font-sans">
            Munich Studio
          </span>
          <span className="text-foreground-subtle">•</span>
          <span className="flex items-center gap-1 text-foreground-muted font-mono text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber" />
            21°C
          </span>
        </div>
      </div>

      {/* Right: Actions, Global Search Trigger, Language Switcher & Booking CTA */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsCmdkOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border hover:border-border-bright text-xs text-foreground-muted hover:text-foreground transition-all group"
        >
          <Search className="w-3.5 h-3.5 text-foreground-subtle group-hover:text-emerald transition-colors" />
          <span className="font-sans text-xs hidden md:inline">{t.header.searchPlaceholder}</span>
          <kbd className="font-mono text-[10px] bg-card px-1.5 py-0.5 rounded border border-border text-foreground-subtle">
            ⌘K
          </kbd>
        </button>

        {/* Language Switcher Dropdown (EN / RU / UZ) */}
        <LanguageSwitcher />

        <button
          onClick={onOpenNewBooking}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald hover:bg-emerald/90 text-background font-semibold text-xs font-sans transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.header.newBooking}</span>
        </button>
      </div>
    </header>
  );
};
