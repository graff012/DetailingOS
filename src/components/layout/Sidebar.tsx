import React, { useState } from 'react';
import {
  TrendingUp,
  Radio,
  Car,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useShopStore, ActiveTab } from '../../store/shop-store';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, bays, setIsCmdkOpen } = useShopStore();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    badge?: string;
    badgeColor?: string;
    icon: React.ElementType;
    description: string;
  }> = [
    {
      id: 'forecast',
      label: 'Executive Forecast',
      badge: '90D',
      icon: TrendingUp,
      description: 'LTV, CAC & Cashflow Cone',
    },
    {
      id: 'radar',
      label: 'IG Targeting Radar',
      badge: 'MCP Live',
      badgeColor: 'text-emerald bg-emerald/10 border-emerald/20',
      icon: Radio,
      description: 'Meta Ads & Rule Engine',
    },
    {
      id: 'bays',
      label: 'Live Bays & Liability',
      badge: '4 Active',
      icon: Car,
      description: 'Turnaround & Damage Map',
    },
    {
      id: 'operations',
      label: 'Chemicals & Retention',
      badge: '2 Alerts',
      badgeColor: 'text-amber bg-amber/10 border-amber/20',
      icon: FlaskConical,
      description: 'Stock & Commission Split',
    },
  ];

  const occupiedBaysCount = bays.filter(b => b.status === 'OCCUPIED').length;

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-card border-r border-border transition-all duration-200 select-none z-30',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded bg-emerald/10 border border-emerald/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-tight text-foreground font-mono flex items-center gap-1.5">
                DETAILING<span className="text-emerald font-bold">OS</span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-border text-foreground-muted rounded">PRO</span>
              </span>
              <span className="text-[10px] text-foreground-subtle tracking-tight font-mono">ERP • MCP v26.0</span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded bg-emerald/10 border border-emerald/30 flex items-center justify-center mx-auto">
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
            'w-full flex items-center justify-between text-left text-xs bg-background/80 hover:bg-background border border-border hover:border-border-bright rounded px-2.5 py-1.5 transition-all text-foreground-muted hover:text-foreground group',
            collapsed && 'px-1.5 justify-center'
          )}
          title="Global Search (Cmd+K)"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Zap className="w-3.5 h-3.5 text-foreground-subtle group-hover:text-emerald shrink-0 transition-colors" />
            {!collapsed && <span className="truncate text-[11px] font-sans">Plate / Action...</span>}
          </div>
          {!collapsed && (
            <kbd className="font-mono text-[10px] text-foreground-subtle px-1.5 py-0.5 rounded bg-card border border-border tabular-nums">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-2.5 py-2 rounded text-left transition-all text-xs font-medium group relative',
                isActive
                  ? 'bg-card-hover text-foreground border border-border shadow-sm'
                  : 'text-foreground-muted hover:text-foreground hover:bg-card-hover/60 border border-transparent',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? `${item.label} — ${item.description}` : undefined}
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
                  <div className="flex flex-col">
                    <span className="truncate text-xs font-sans tracking-tight">{item.label}</span>
                    <span className="text-[10px] text-foreground-subtle truncate font-mono">{item.description}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-border tabular-nums shrink-0',
                        item.badgeColor || 'text-foreground-subtle bg-background'
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

      {/* Bottom Diagnostics / Studio Status */}
      <div className="p-3 border-t border-border bg-card-subtle/50 space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                Meta MCP Host
              </span>
              <span className="text-[10px] text-emerald tabular-nums">STDIO:25.0</span>
            </div>

            <div className="p-2 rounded bg-background border border-border text-[11px] font-mono space-y-1">
              <div className="flex justify-between items-center text-foreground-subtle">
                <span className="flex items-center gap-1 text-[10px]">
                  <Clock className="w-3 h-3" /> Bay Load:
                </span>
                <span className="text-foreground font-semibold tabular-nums">{occupiedBaysCount}/4 Bays</span>
              </div>
              <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald transition-all"
                  style={{ width: `${(occupiedBaysCount / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px] text-foreground-subtle font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald" /> Studio Munich #01
              </span>
              <span className="tabular-nums">48.13°N</span>
            </div>
          </>
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
  );
};
