import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import {
  generate90DayForecast,
  getDetailingCohortModels,
  analyzeBayBottleneck,
} from '../../lib/finance-engine';
import { formatCurrency, formatNumber, cn } from '../../lib/utils';

export const ExecutiveForecastTab: React.FC = () => {
  const {
    adSpendSlider,
    setAdSpendSlider,
    bayUtilSlider,
    setBayUtilSlider,
    campaigns,
    bookings,
  } = useShopStore();

  // Dynamic 90-day time-series points based on current sliders
  const forecastData = useMemo(() => {
    return generate90DayForecast(adSpendSlider, bayUtilSlider, 142, 21.5);
  }, [adSpendSlider, bayUtilSlider]);

  // Cohort LTV analysis models
  const cohorts = useMemo(() => {
    return getDetailingCohortModels();
  }, []);

  // Operational bottleneck calculation
  const bottleneck = useMemo(() => {
    return analyzeBayBottleneck({
      weeklyRevenueTarget: 16500,
      bay1PpfJobRevenue: 3600,
      otherBaysProjectedRevenue: 8400,
      bay2ExpressWashPrice: 85,
    });
  }, []);

  // Summary forecast aggregates
  const day30Projected = forecastData[90]?.projectedRevenue || 0;
  const day90Projected = forecastData[150]?.projectedRevenue || 0;
  const total90DayVolume = forecastData
    .filter(p => !p.isHistorical)
    .reduce((acc, p) => acc + p.projectedRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Forecasting Controls & Interactive Sliders */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <h2 className="text-sm font-semibold tracking-tight text-foreground font-sans">
                Holt-Winters 90-Day Cash Flow & Revenue Forecast
              </h2>
            </div>
            <p className="text-xs text-foreground-subtle font-mono mt-0.5">
              60 days historical actuals + 90 days projected with ±15% confidence cone
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-[10px] text-foreground-subtle uppercase">90D Projected Total</div>
              <div className="text-sm font-bold text-emerald tabular-nums">
                {formatCurrency(total90DayVolume)}
              </div>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="text-right">
              <div className="text-[10px] text-foreground-subtle uppercase">Day 90 Run-Rate</div>
              <div className="text-sm font-bold text-foreground tabular-nums">
                {formatCurrency(day90Projected * 30)}/mo
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Sliders Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Slider 1: Planned Daily IG Ad Spend */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-foreground flex items-center gap-1.5 font-sans">
                <Sliders className="w-3.5 h-3.5 text-emerald" />
                Planned Daily Instagram Ad Spend
              </label>
              <span className="font-mono font-bold text-emerald tabular-nums bg-background px-2 py-0.5 rounded border border-border">
                ${adSpendSlider}/day
                <span className="text-[10px] text-foreground-subtle ml-1 font-normal">
                  (${adSpendSlider * 30}/mo)
                </span>
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={250}
              step={5}
              value={adSpendSlider}
              onChange={e => setAdSpendSlider(Number(e.target.value))}
              className="w-full accent-emerald bg-background h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-foreground-subtle">
              <span>$10/day (Organic Base)</span>
              <span>$100/day (Growth)</span>
              <span>$250/day (Hyper-Scale)</span>
            </div>
          </div>

          {/* Slider 2: Target Bay Utilization Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-foreground flex items-center gap-1.5 font-sans">
                <Target className="w-3.5 h-3.5 text-emerald" />
                Target Bay Utilization Cap
              </label>
              <span className="font-mono font-bold text-emerald tabular-nums bg-background px-2 py-0.5 rounded border border-border">
                {bayUtilSlider}%
                <span className="text-[10px] text-foreground-subtle ml-1 font-normal">
                  ({Math.round((bayUtilSlider / 100) * 4 * 48)} billable hrs/wk)
                </span>
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={bayUtilSlider}
              onChange={e => setBayUtilSlider(Number(e.target.value))}
              className="w-full accent-emerald bg-background h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-foreground-subtle">
              <span>50% (Underutilized)</span>
              <span>80–85% (Optimal Shop Peak)</span>
              <span>100% (Zero Bottleneck Buffer)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart Card */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-foreground">
              <span className="w-2.5 h-0.5 bg-foreground" /> Historical Actuals
            </span>
            <span className="flex items-center gap-1 text-emerald">
              <span className="w-2.5 h-0.5 bg-emerald" /> Projected Mean
            </span>
            <span className="flex items-center gap-1 text-foreground-subtle">
              <span className="w-2.5 h-2 bg-emerald/10 border border-emerald/20" /> Confidence Cone (+15% / -12%)
            </span>
          </div>
          <span className="text-[11px] font-mono text-foreground-subtle">
            Updated via deterministic smoothing
          </span>
        </div>

        {/* Recharts Area/Line Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={forecastData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="confidenceCone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} opacity={0.6} />
              <XAxis
                dataKey="dateStr"
                stroke="#71717A"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#27272A' }}
                interval={14}
                fontFamily="JetBrains Mono"
              />
              <YAxis
                stroke="#71717A"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#27272A' }}
                tickFormatter={val => `$${val}`}
                fontFamily="JetBrains Mono"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded bg-[#121215] border border-border shadow-popover text-xs font-mono">
                      <div className="text-[10px] text-foreground-subtle mb-1 flex items-center justify-between">
                        <span>Date: {d.dateStr}</span>
                        <span className={d.isHistorical ? 'text-foreground' : 'text-emerald'}>
                          {d.isHistorical ? 'Actual' : 'Projected'}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {d.isHistorical ? (
                          <div className="text-sm font-bold text-foreground tabular-nums">
                            Actual: {formatCurrency(d.actualRevenue)}
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-bold text-emerald tabular-nums">
                              Projected: {formatCurrency(d.projectedRevenue)}
                            </div>
                            <div className="text-[10px] text-foreground-subtle flex justify-between gap-4">
                              <span>Cone Range:</span>
                              <span className="tabular-nums">
                                {formatCurrency(d.lowerConfidenceBound)} – {formatCurrency(d.upperConfidenceBound)}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="text-[10px] text-foreground-muted pt-1 border-t border-border flex justify-between">
                          <span>Maint. Recurring:</span>
                          <span className="tabular-nums">{formatCurrency(d.maintRecurringPortion)}</span>
                        </div>
                        <div className="text-[10px] text-foreground-muted flex justify-between">
                          <span>Ad-Acquired First-Jobs:</span>
                          <span className="tabular-nums">{formatCurrency(d.adAcquiredPortion)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              {/* Upper Confidence Cone Area */}
              <Area
                type="monotone"
                dataKey="upperConfidenceBound"
                stroke="none"
                fill="url(#confidenceCone)"
                isAnimationActive={false}
              />
              {/* Lower Confidence Cone Area (masking below) */}
              <Area
                type="monotone"
                dataKey="lowerConfidenceBound"
                stroke="none"
                fill="#09090B"
                isAnimationActive={false}
              />
              {/* Actuals Line (historical) */}
              <Line
                type="monotone"
                dataKey="actualRevenue"
                stroke="#FAFAFA"
                strokeWidth={1.75}
                dot={false}
                isAnimationActive={false}
              />
              {/* Projected Line (future) */}
              <Line
                type="monotone"
                dataKey="projectedRevenue"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Module Breakdown: Cohort LTV & The Shop Bottleneck */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module A1: Cohort LTV & Funnel Model */}
        <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                Cohort LTV & Funnel Conversion
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded">
              60-Day Funnel ROAS: {cohorts.conversionFunnelInsight.sixtyDayROAS}x
            </span>
          </div>

          {/* Standard Wash vs Ceramic VIP Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Standard Wash Client */}
            <div className="p-3 rounded bg-background border border-border space-y-2">
              <div className="text-[11px] font-semibold text-foreground font-sans">
                {cohorts.standardWashCohort.cohortName}
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-foreground-subtle">
                  <span>Avg Ticket Size:</span>
                  <span className="text-foreground tabular-nums">${cohorts.standardWashCohort.averageTicketSize}</span>
                </div>
                <div className="flex justify-between text-foreground-subtle">
                  <span>Visits / Year:</span>
                  <span className="text-foreground tabular-nums">{cohorts.standardWashCohort.visitsPerYear}x</span>
                </div>
                <div className="flex justify-between text-foreground-subtle">
                  <span>Retention:</span>
                  <span className="text-foreground tabular-nums">{cohorts.standardWashCohort.avgRetentionYears} yrs</span>
                </div>
                <div className="flex justify-between text-foreground-subtle">
                  <span>Gross Margin:</span>
                  <span className="text-foreground tabular-nums">{Math.round(cohorts.standardWashCohort.grossMarginPercent * 100)}%</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-bold">
                  <span className="text-foreground">Base LTV:</span>
                  <span className="text-foreground tabular-nums">
                    {formatCurrency(cohorts.standardWashCohort.calculatedLtv)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ceramic VIP Client */}
            <div className="p-3 rounded bg-background border border-border space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald/5 -rotate-45 pointer-events-none" />
              <div className="text-[11px] font-semibold text-emerald font-sans flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {cohorts.ceramicVipCohort.cohortName}
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-foreground-subtle">
                  <span>Initial Package:</span>
                  <span className="text-foreground tabular-nums">$1,450</span>
                </div>
                <div className="flex justify-between text-foreground-subtle">
                  <span>Maint. Ticket:</span>
                  <span className="text-foreground tabular-nums">${cohorts.ceramicVipCohort.averageTicketSize} (6x/yr)</span>
                </div>
                <div className="flex justify-between text-foreground-subtle">
                  <span>Retention:</span>
                  <span className="text-foreground tabular-nums">{cohorts.ceramicVipCohort.avgRetentionYears} yrs</span>
                </div>
                <div className="flex justify-between text-foreground-subtle">
                  <span>Gross Margin:</span>
                  <span className="text-emerald tabular-nums">{Math.round(cohorts.ceramicVipCohort.grossMarginPercent * 100)}%</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-bold">
                  <span className="text-foreground">VIP LTV:</span>
                  <span className="text-emerald tabular-nums">
                    {formatCurrency(cohorts.ceramicVipCohort.calculatedLtv)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reel Lead to Ceramic Conversion Callout */}
          <div className="p-2.5 rounded bg-card-subtle border border-border text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <ArrowRight className="w-3 h-3 text-emerald" />
              Reel Lead → Ceramic Conversion Logic (60 Days)
            </div>
            <p className="text-foreground-subtle leading-relaxed text-[10px]">
              A <span className="text-foreground font-medium">$22.50 IG Reel lead</span> books a $55 express wash.
              Within 60 days, <span className="text-emerald font-medium">18.5% of clients</span> convert to a
              $850 ceramic coating package, yielding an effective customer value of <span className="text-foreground font-bold">$212.25</span> on initial acquisition.
            </p>
          </div>
        </div>

        {/* Module A2: Shop Bottleneck & Bay Hours */}
        <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                Shop Bottleneck & Bay Turnaround
              </h3>
            </div>
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded border',
                bottleneck.isBottleneckFeasible
                  ? 'text-emerald bg-emerald/10 border-emerald/20'
                  : 'text-amber bg-amber/10 border-amber/20'
              )}
            >
              {bottleneck.isBottleneckFeasible ? 'Schedule Balanced' : 'Turnover Deficit Alert'}
            </span>
          </div>

          {/* Scenario Simulation Display */}
          <div className="space-y-3 text-xs font-sans">
            <p className="text-foreground-subtle text-[11px] leading-relaxed">
              When <span className="text-foreground font-medium">Bay 1 (PPF Cleanroom)</span> is occupied for
              <span className="text-foreground font-medium"> 2 days (16 hours)</span> by a $3,600 Full-Body PPF project,
              calculate the required turnover in other bays to clear the weekly revenue target of{' '}
              <span className="text-foreground font-bold font-mono">$16,500</span>.
            </p>

            <div className="p-3 rounded bg-background border border-border font-mono text-[11px] space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Weekly Studio Revenue Target:</span>
                <span className="text-foreground font-bold tabular-nums">
                  {formatCurrency(bottleneck.weeklyRevenueTarget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Bay 1 PPF Job (16h locked):</span>
                <span className="text-emerald tabular-nums">+{formatCurrency(bottleneck.bay1PpfJobRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Bay 3 & 4 Projected Baseline:</span>
                <span className="text-foreground tabular-nums">+{formatCurrency(bottleneck.otherBaysProjectedRevenue)}</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between">
                <span className="text-foreground-subtle">Bay 2 Revenue Target Shortfall:</span>
                <span className="text-amber font-bold tabular-nums">
                  {formatCurrency(bottleneck.revenueShortfall)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-border/40">
                <span className="text-foreground-subtle">Required Bay 2 Express Washes ($85 ea):</span>
                <span className="text-foreground font-bold text-xs tabular-nums px-2 py-0.5 rounded bg-card border border-border">
                  {bottleneck.requiredExpressWashes} washes ({bottleneck.requiredExpressWashes * 1.2} bay hours)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pt-1">
              <span>Bay 2 Capacity: {bottleneck.maxFeasibleExpressWashes} slots/week</span>
              <span className={bottleneck.isBottleneckFeasible ? 'text-emerald' : 'text-amber'}>
                {bottleneck.isBottleneckFeasible
                  ? `+${bottleneck.surplusDeficit} slots buffer remaining`
                  : `Requires +${Math.abs(bottleneck.surplusDeficit)} overtime slots`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
