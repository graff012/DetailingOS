import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Zap } from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { cn, formatCurrency } from '../../lib/utils';

// Sparkline Mock Data
const REVENUE_SPARK = [
  { val: 11200 }, { val: 11800 }, { val: 12400 }, { val: 11900 },
  { val: 13100 }, { val: 13800 }, { val: 14280 }
];

const UTILIZATION_SPARK = [
  { val: 72 }, { val: 74 }, { val: 79 }, { val: 81 },
  { val: 78 }, { val: 84 }, { val: 82.5 }
];

const CAC_SPARK = [
  { val: 24.5 }, { val: 23.0 }, { val: 21.2 }, { val: 19.8 },
  { val: 19.1 }, { val: 18.9 }, { val: 18.4 }
];

const ROAS_SPARK = [
  { val: 3.8 }, { val: 4.1 }, { val: 4.3 }, { val: 4.0 },
  { val: 4.5 }, { val: 4.7 }, { val: 4.82 }
];

export const KPIHeader: React.FC = () => {
  const { bayUtilSlider, adSpendSlider } = useShopStore();

  const kpis = [
    {
      title: 'Net Monthly Revenue',
      value: '$14,280',
      delta: '+18.4%',
      deltaType: 'positive',
      subtext: 'vs previous 30-day cycle',
      icon: DollarSign,
      sparkData: REVENUE_SPARK,
      color: '#10B981',
      unit: '$',
    },
    {
      title: 'Bay Utilization Rate',
      value: `${bayUtilSlider.toFixed(1)}%`,
      delta: bayUtilSlider >= 80 ? 'Optimal' : 'Healthy',
      deltaType: 'positive',
      subtext: 'Target 80–85% billable cap',
      icon: Activity,
      sparkData: UTILIZATION_SPARK,
      color: '#10B981',
      unit: '%',
    },
    {
      title: 'Instagram Blended CAC',
      value: '$18.40',
      delta: '-12.3%',
      deltaType: 'positive', // Lower CAC is good
      subtext: 'Target < $22.00 / booking',
      icon: Target,
      sparkData: CAC_SPARK,
      color: '#10B981',
      unit: '$',
    },
    {
      title: 'Meta Blended ROAS',
      value: '4.82x',
      delta: '+0.65x',
      deltaType: 'positive',
      subtext: `$${adSpendSlider}/day scaling budget`,
      icon: Zap,
      sparkData: ROAS_SPARK,
      color: '#10B981',
      unit: 'x',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-border bg-card/40">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;

        return (
          <div
            key={idx}
            className="p-3.5 rounded bg-card border border-border hover:border-border-bright transition-all shadow-card flex flex-col justify-between"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between text-xs text-foreground-muted mb-2">
              <span className="font-sans font-medium">{kpi.title}</span>
              <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center text-foreground-subtle">
                <Icon className="w-3 h-3" />
              </div>
            </div>

            {/* Middle row: Big Metric & Delta */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                  {kpi.value}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      'text-[11px] font-mono font-medium px-1.5 py-0.2 rounded border tabular-nums',
                      kpi.deltaType === 'positive'
                        ? 'text-emerald bg-emerald/10 border-emerald/20'
                        : 'text-guardsRed bg-guardsRed/10 border-guardsRed/20'
                    )}
                  >
                    {kpi.delta}
                  </span>
                  <span className="text-[10px] text-foreground-subtle font-sans truncate">
                    {kpi.subtext}
                  </span>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="w-18 h-9 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.sparkData}>
                    <Line
                      type="monotone"
                      dataKey="val"
                      stroke={kpi.color}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
