import React, { useState } from 'react';
import {
  TrendingUp,
  Radio,
  Car,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  X,
  Share2,
} from 'lucide-react';
import { useShopStore, ActiveTab } from '../../store/shop-store';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    bays,
    chemicals,
    setIsCmdkOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsYongoqModalOpen,
    t,
  } = useShopStore();
  const [collapsed, setCollapsed] = useState(false);

  const occupiedBaysCount = bays.filter(b => b.status === 'OCCUPIED').length;
  const lowStockCount = chemicals.filter(c => c.currentStock <= c.reorderThreshold).length;

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    badge?: string | number;
    badgeColor?: string;
    icon: React.ElementType;
  }> = [
    {
      id: 'forecast',
      label: t.nav.forecast.label,
      badge: '90D',
      icon: TrendingUp,
    },
    {
      id: 'radar',
      label: t.nav.radar.label,
      badge: 'MCP',
      badgeColor: 'text-emerald bg-emerald/10 border-emerald/20',
      icon: Radio,
    },
    {
      id: 'bays',
      label: t.nav.bays.label,
      badge: `${occupiedBaysCount}`,
      badgeColor: 'text-emerald bg-emerald/10 border-emerald/20',
      icon: Car,
    },
    {
      id: 'operations',
      label: t.nav.operations.label,
      badge: lowStockCount > 0 ? `${lowStockCount}` : undefined,
      badgeColor: 'text-amber bg-amber/10 border-amber/20',
      icon: FlaskConical,
    },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar (Hidden on mobile / tablet < lg) */}
      <aside
        className={cn(
          'hidden lg:flex relative flex-col bg-card border-r border-border transition-all duration-200 select-none z-30 shrink-0 h-full',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          {!collapsed ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-md bg-emerald/10 border border-emerald/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs tracking-tight text-foreground font-mono flex items-center gap-1.5">
                  DETAILING<span className="text-emerald font-bold">OS</span>
                  <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-border text-foreground-muted rounded">
                    {t.common.pro}
                  </span>
                </span>
                <span className="text-[10px] text-foreground-subtle tracking-tight font-mono">ERP • MCP v26.0</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-md bg-emerald/10 border border-emerald/30 flex items-center justify-center mx-auto">
              <Sparkles className="w-4 h-4 text-emerald" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'text-foreground-subtle hover:text-foreground p-1 rounded hover:bg-card-hover transition-colors',
              collapsed && 'hidden'
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Cmd+K Bar Trigger */}
        <div className="px-3 py-3 border-b border-border/50">
          <button
            onClick={() => setIsCmdkOpen(true)}
            className={cn(
              'w-full flex items-center justify-between text-left text-xs bg-background hover:bg-background/80 border border-border hover:border-border-bright rounded-md px-2.5 py-2 transition-all text-foreground-muted hover:text-foreground group',
              collapsed && 'px-1.5 justify-center'
            )}
            title="Global Search (Cmd+K)"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Zap className="w-3.5 h-3.5 text-foreground-subtle group-hover:text-emerald shrink-0 transition-colors" />
              {!collapsed && <span className="truncate text-xs font-sans">{t.nav.searchQuick}</span>}
            </div>
            {!collapsed && (
              <kbd className="font-mono text-[10px] text-foreground-subtle px-1.5 py-0.5 rounded bg-card border border-border tabular-nums">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all text-xs font-medium group relative',
                  isActive
                    ? 'bg-card-hover text-foreground border border-border font-semibold shadow-sm'
                    : 'text-foreground-muted hover:text-foreground hover:bg-card-hover/60 border border-transparent',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-emerald rounded-r" />
                )}
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-emerald' : 'text-foreground-subtle group-hover:text-foreground'
                  )}
                />

                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="truncate text-xs font-sans">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border tabular-nums shrink-0',
                          item.badgeColor || 'text-foreground-subtle bg-background border-border'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Yong'oq Gateway Link */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setIsYongoqModalOpen(true)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-card-hover/60 border border-border/50 group',
              collapsed && 'justify-center px-0'
            )}
            title="Yong‘oq Ingestion Gateway"
          >
            <Share2 className="w-4 h-4 text-amber shrink-0 group-hover:scale-110 transition-transform" />
            {!collapsed && (
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <span className="truncate text-xs font-sans">Yong‘oq Sync</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              </div>
            )}
          </button>
        </div>

        {/* Sleek Studio Footer */}
        <div className="p-3 border-t border-border bg-card-subtle/50">
          {!collapsed ? (
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                {t.nav.mcpHost}
              </span>
              <span className="text-[10px] text-foreground font-semibold tabular-nums">
                {t.nav.studioLocation}
              </span>
            </div>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex justify-center text-foreground-subtle hover:text-foreground py-1"
              title="Expand"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile / Tablet Slide-over Drawer (Visible on < lg when isMobileMenuOpen) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative w-72 max-w-[85vw] bg-card border-r border-border flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-md bg-emerald/10 border border-emerald/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-xs tracking-tight text-foreground font-mono flex items-center gap-1.5">
                    DETAILING<span className="text-emerald font-bold">OS</span>
                    <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-border text-foreground-muted rounded">
                      {t.common.pro}
                    </span>
                  </span>
                  <span className="text-[10px] text-foreground-subtle tracking-tight font-mono">ERP • MCP v26.0</span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground-subtle hover:text-foreground p-1.5 rounded hover:bg-card-hover transition-colors"
                title="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Cmd+K */}
            <div className="px-3 py-3 border-b border-border/50">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCmdkOpen(true);
                }}
                className="w-full flex items-center justify-between text-left text-xs bg-background hover:bg-background/80 border border-border rounded-md px-2.5 py-2 text-foreground-muted"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-foreground-subtle" />
                  <span className="text-xs font-sans">{t.nav.searchQuick}</span>
                </div>
                <kbd className="font-mono text-[10px] text-foreground-subtle px-1.5 py-0.5 rounded bg-card border border-border">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all text-xs font-medium relative',
                      isActive
                        ? 'bg-card-hover text-foreground border border-border font-semibold shadow-sm'
                        : 'text-foreground-muted hover:text-foreground hover:bg-card-hover/60 border border-transparent'
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald rounded-r" />
                    )}
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isActive ? 'text-emerald' : 'text-foreground-subtle'
                      )}
                    />
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span className="truncate text-xs font-sans">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border tabular-nums',
                            item.badgeColor || 'text-foreground-subtle bg-background border-border'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Quick Yong'oq Gateway Link Mobile */}
            <div className="px-2 pb-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsYongoqModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-card-hover/60 border border-border/50 group"
              >
                <Share2 className="w-4 h-4 text-amber shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="truncate text-xs font-sans">Yong‘oq Sync Gateway</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                </div>
              </button>
            </div>

            {/* Mobile Footer */}
            <div className="p-3 border-t border-border bg-card-subtle/50 text-[11px] font-mono text-foreground-subtle flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                {t.nav.mcpHost}
              </span>
              <span className="text-[10px] text-foreground font-semibold">
                {t.nav.studioLocation}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
