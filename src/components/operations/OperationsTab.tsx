import React from 'react';
import {
  FlaskConical,
  Clock,
  Send,
  MessageSquare,
  Plus,
  Users,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { formatCurrency, cn } from '../../lib/utils';

export const OperationsTab: React.FC = () => {
  const {
    chemicals,
    restockChemical,
    vehicles,
    customers,
    sendRetentionReminder,
    technicians,
    t,
  } = useShopStore();

  const handleRestock = (id: string, defaultAmount: number) => {
    restockChemical(id, defaultAmount);
  };

  // Helper to calculate days remaining until maintenance
  const getDaysRemaining = (dueAtStr?: string) => {
    if (!dueAtStr) return 999;
    const due = new Date(dueAtStr).getTime();
    const now = new Date('2026-10-31T12:00:00Z').getTime();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* 1. Automated Ceramic & Wax Retention Reminder Engine */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              {t.operations.retentionTitle}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-foreground-subtle">
            {t.operations.retentionSub}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-foreground-subtle text-[10px] uppercase">
                <th className="py-2 px-3">{t.operations.colVehicle}</th>
                <th className="py-2 px-3">{t.operations.colOwner}</th>
                <th className="py-2 px-3">{t.operations.colCoating}</th>
                <th className="py-2 px-3">{t.operations.colCycle}</th>
                <th className="py-2 px-3">{t.operations.colStatus}</th>
                <th className="py-2 px-3 text-right">{t.operations.colDispatch}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {vehicles.map(v => {
                const cust = customers.find(c => c.id === v.customerId);
                const daysLeft = getDaysRemaining(v.nextMaintenanceDueAt);

                let statusBadge = (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald bg-emerald/10 border border-emerald/20">
                    {t.operations.protected}
                  </span>
                );

                if (daysLeft <= 0) {
                  statusBadge = (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-guardsRed bg-guardsRed/10 border border-guardsRed/20 animate-pulse">
                      {t.operations.dueToday}
                    </span>
                  );
                } else if (daysLeft <= 14) {
                  statusBadge = (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-amber bg-amber/10 border border-amber/20">
                      {t.operations.expiringSoon}
                    </span>
                  );
                }

                return (
                  <tr key={v.id} className="hover:bg-card-hover/50 transition-colors">
                    {/* Vehicle */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-background border border-border font-bold text-foreground tabular-nums">
                          {v.licensePlate}
                        </span>
                        <span className="text-foreground font-sans font-medium">
                          {v.make} {v.model}
                        </span>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="text-foreground font-medium">{cust?.fullName}</span>
                        <span className="text-[10px] text-foreground-subtle">
                          {cust?.instagramHandle || cust?.phone}
                        </span>
                      </div>
                    </td>

                    {/* Coating */}
                    <td className="py-2.5 px-3 text-foreground-subtle">
                      {v.coatingType.replace(/_/g, ' ')}
                    </td>

                    {/* Days Left */}
                    <td className="py-2.5 px-3 font-bold tabular-nums">
                      <span className={daysLeft <= 0 ? 'text-guardsRed' : daysLeft <= 14 ? 'text-amber' : 'text-emerald'}>
                        {daysLeft <= 0 ? t.operations.expired : `${daysLeft} ${t.common.days}`}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">{statusBadge}</td>

                    {/* Trigger Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => sendRetentionReminder(v.id, 'IG_DM')}
                          className="px-2 py-1 rounded bg-card hover:bg-card-hover border border-border text-[10px] text-foreground font-medium transition-colors flex items-center gap-1"
                          title="Send Instagram Direct Message"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald" />
                          <span>{t.operations.igDm}</span>
                        </button>

                        <button
                          onClick={() => sendRetentionReminder(v.id, 'TELEGRAM')}
                          className="px-2 py-1 rounded bg-card hover:bg-card-hover border border-border text-[10px] text-foreground font-medium transition-colors flex items-center gap-1"
                          title="Send Telegram Alert"
                        >
                          <Send className="w-3 h-3 text-blue-400" />
                          <span>{t.operations.telegram}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column: Chemical Burn-Rate Inventory & Technician Commission Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module C4: Chemical Burn-Rate Inventory */}
        <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                {t.operations.chemTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-foreground-subtle">
              {t.operations.chemSub}
            </span>
          </div>

          <div className="space-y-3">
            {chemicals.map(chem => {
              const stockPercent = Math.min(100, Math.round((chem.currentStock / chem.maxCapacity) * 100));
              const isBelowThreshold = chem.currentStock <= chem.reorderThreshold;
              const isCritical = chem.currentStock <= chem.reorderThreshold * 0.5;

              return (
                <div
                  key={chem.id}
                  className="p-3 rounded bg-background border border-border space-y-2 text-xs font-mono"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground font-sans">{chem.name}</span>
                        {isBelowThreshold && (
                          <span
                            className={cn(
                              'px-1.5 py-0.2 rounded text-[9px] font-bold uppercase',
                              isCritical ? 'bg-guardsRed/10 text-guardsRed border border-guardsRed/30' : 'bg-amber/10 text-amber border border-amber/30'
                            )}
                          >
                            {isCritical ? t.operations.criticalLow : t.operations.reorderAmber}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-foreground-subtle block">
                        {chem.brand} • {t.operations.burnRate} -{chem.burnRatePerJob} {chem.unit}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRestock(chem.id, chem.burnRatePerJob * 5)}
                      className="px-2 py-1 rounded bg-card hover:bg-card-hover border border-border text-[10px] text-foreground hover:text-emerald font-medium transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-emerald" />
                      <span>{t.operations.restock}</span>
                    </button>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-card rounded-full overflow-hidden border border-border/50">
                      <div
                        className={cn(
                          'h-full transition-all duration-300',
                          isCritical
                            ? 'bg-guardsRed'
                            : isBelowThreshold
                            ? 'bg-amber'
                            : 'bg-emerald'
                        )}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-foreground-subtle">
                      <span>
                        {t.operations.current}{' '}
                        <strong className="text-foreground tabular-nums">
                          {chem.currentStock} {chem.unit}
                        </strong>{' '}
                        ({t.operations.min} {chem.reorderThreshold} {chem.unit})
                      </span>
                      <span>{t.operations.unitCost} ${chem.costPerUnit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module C5: Technician Commission Split & Payouts */}
        <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                {t.operations.commTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded">
              {t.operations.commSub}
            </span>
          </div>

          <div className="space-y-3">
            {technicians.map(tech => {
              const commissionEarned = Math.round(
                tech.currentMonthRevenueGenerated * tech.commissionRate
              );
              const totalPayout = tech.baseSalaryMonthly + commissionEarned;

              return (
                <div
                  key={tech.id}
                  className="p-3 rounded bg-background border border-border space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-card border border-border flex items-center justify-center font-bold text-foreground text-xs">
                        {tech.avatarInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground font-sans text-xs">
                          {tech.name}
                        </span>
                        <span className="text-[10px] text-foreground-subtle">
                          {tech.role} • Bay {tech.activeBay || 'Float'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald/10 border border-emerald/30 text-emerald text-[11px] font-bold tabular-nums">
                      {Math.round(tech.commissionRate * 100)}% {t.operations.split}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-border/50 text-[10px] sm:text-[11px]">
                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-foreground-subtle block truncate">{t.operations.baseSalary}</span>
                      <span className="font-bold text-foreground tabular-nums truncate block">
                        {formatCurrency(tech.baseSalaryMonthly)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-foreground-subtle block truncate">
                        {t.operations.commission} ({tech.totalCompletedJobs}):
                      </span>
                      <span className="font-bold text-emerald tabular-nums truncate block">
                        +{formatCurrency(commissionEarned)}
                      </span>
                    </div>

                    <div className="text-right min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-foreground-subtle block truncate">{t.operations.totalPayout}</span>
                      <span className="font-bold text-foreground text-xs tabular-nums truncate block">
                        {formatCurrency(totalPayout)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
