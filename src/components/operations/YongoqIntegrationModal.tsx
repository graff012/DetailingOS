import React, { useState } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  Copy,
  Zap,
  Upload,
  ArrowRight,
  Database,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { YONGOQ_DEFAULT_SECRET, UZS_TO_USD_RATE } from '../../services/yongoq-sync.service';
import { cn } from '../../lib/utils';

interface YongoqIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YongoqIntegrationModal: React.FC<YongoqIntegrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    yongoqLogs,
    syncYongoqClient,
    syncYongoqSale,
    importYongoqJson,
    t,
  } = useShopStore();

  const [activeTab, setActiveTab] = useState<'webhook' | 'import' | 'logs'>('webhook');
  const [jsonInput, setJsonInput] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const webhookUrl = 'https://studio.detailingos.uz/api/webhooks/yongoq';

  const copyToClipboard = (text: string, type: 'secret' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // Test 1: Simulate Client Webhook
  const handleTestClientWebhook = () => {
    syncYongoqClient({
      client_id: `cli-${Date.now().toString().slice(-4)}`,
      full_name: 'Alisher Qodirov',
      phone: '+998901234567',
      created_at: new Date().toISOString(),
      vehicle: {
        license_plate: '01 A 777 AA',
        make: 'Porsche',
        model: '911 GT3 (992)',
        color: 'Shark Blue',
      },
      notes: 'VIP Client imported via Yong‘oq POS Webhook.',
    });
  };

  // Test 2: Simulate Sale Webhook (Click / UZS)
  const handleTestSaleWebhook = () => {
    syncYongoqSale({
      sale_id: `inv-${Date.now().toString().slice(-4)}`,
      client_id: 'cli-8842',
      client_phone: '+998901234567',
      client_name: 'Alisher Qodirov',
      sale_date: new Date().toISOString(),
      vehicle_plate: '01 A 777 AA',
      services: [
        {
          service_code: 'STAGE_2_CERAMIC',
          service_name: 'Stage 2 Ceramic Coating Gyeon Mohs+',
          unit_price: 1250,
          quantity: 1,
          total_price: 1250,
        },
      ],
      total_amount: 16062500, // 16,062,500 UZS = $1,250 USD
      currency: 'UZS',
      payment_method: 'CLICK',
      cashier_or_master: 'Marco Rossi',
      status: 'COMPLETED',
    });
  };

  const handleProcessJsonImport = () => {
    if (!jsonInput.trim()) return;
    const res = importYongoqJson(jsonInput);
    if (res.success) {
      setImportStatus(`Imported ${res.clientsCount} clients and ${res.salesCount} sales!`);
      setJsonInput('');
      setTimeout(() => setImportStatus(null), 4000);
    } else {
      setImportStatus(`Error: ${res.error || 'Invalid JSON format'}`);
    }
  };

  const loadSampleJson = (type: 'clients' | 'sales') => {
    if (type === 'clients') {
      setJsonInput(
        JSON.stringify(
          [
            {
              client_id: 'yq-001',
              full_name: 'Jamshid Usmanov',
              phone: '+998971112233',
              vehicle_plate: '01 B 007 BB',
              vehicle_model: 'BMW M5 Competition',
            },
            {
              client_id: 'yq-002',
              full_name: 'Sardor Rahimiy',
              phone: '+998935558899',
              vehicle_plate: '01 X 777 XX',
              vehicle_model: 'Mercedes-AMG G63',
            },
          ],
          null,
          2
        )
      );
    } else {
      setJsonInput(
        JSON.stringify(
          [
            {
              sale_id: 'yq-s-901',
              client_name: 'Jamshid Usmanov',
              client_phone: '+998971112233',
              service_name: 'Full Vehicle PPF Cleanroom',
              total_amount: 6500,
              currency: 'USD',
              payment_method: 'CARD',
            },
            {
              sale_id: 'yq-s-902',
              client_name: 'Sardor Rahimiy',
              client_phone: '+998935558899',
              service_name: 'Express Wash & Iron Decon',
              total_amount: 1413500,
              currency: 'UZS',
              payment_method: 'PAYME',
            },
          ],
          null,
          2
        )
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-card border border-border shadow-popover rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-amber/10 border border-amber/30 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-amber" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold font-sans text-foreground">
                  Yong‘oq ERP Gateway
                </h2>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald/10 text-emerald border border-emerald/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-foreground-subtle font-mono">
                Tashkent Client & Sales Ingestion Bridge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-foreground-subtle hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-background px-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('webhook')}
            className={cn(
              'px-3 py-2 border-b-2 font-medium transition-colors',
              activeTab === 'webhook'
                ? 'border-emerald text-foreground font-bold'
                : 'border-transparent text-foreground-subtle hover:text-foreground'
            )}
          >
            Webhook Receiver (Option A)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={cn(
              'px-3 py-2 border-b-2 font-medium transition-colors',
              activeTab === 'import'
                ? 'border-emerald text-foreground font-bold'
                : 'border-transparent text-foreground-subtle hover:text-foreground'
            )}
          >
            JSON Import (Option B Fallback)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={cn(
              'px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5',
              activeTab === 'logs'
                ? 'border-emerald text-foreground font-bold'
                : 'border-transparent text-foreground-subtle hover:text-foreground'
            )}
          >
            <span>Activity Log</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-card border border-border">
              {yongoqLogs.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {activeTab === 'webhook' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-background border border-border space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-foreground-subtle">Webhook Destination URL:</span>
                  <button
                    onClick={() => copyToClipboard(webhookUrl, 'url')}
                    className="flex items-center gap-1 text-[10px] text-emerald hover:underline"
                  >
                    {copiedUrl ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-card border border-border text-foreground font-mono text-[11px] select-all break-all">
                  {webhookUrl}
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-foreground-subtle">Authentication Secret Header:</span>
                  <button
                    onClick={() => copyToClipboard(YONGOQ_DEFAULT_SECRET, 'secret')}
                    className="flex items-center gap-1 text-[10px] text-emerald hover:underline"
                  >
                    {copiedSecret ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSecret ? 'Copied' : 'Copy Secret'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-card border border-border text-emerald font-mono text-[11px] select-all">
                  X-Yongoq-Secret: {YONGOQ_DEFAULT_SECRET}
                </div>
              </div>

              {/* Instant Simulation Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-foreground-subtle uppercase">
                  Test Live Webhook Handlers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleTestClientWebhook}
                    className="p-3 rounded border border-border hover:border-emerald/40 bg-background hover:bg-card text-left transition-all group flex flex-col justify-between space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs font-sans flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber" />
                        Simulate Client Created
                      </span>
                      <ArrowRight className="w-3 h-3 text-foreground-subtle group-hover:text-emerald group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] text-foreground-subtle font-mono">
                      Porsche 911 GT3 (Alisher Q.)
                    </span>
                  </button>

                  <button
                    onClick={handleTestSaleWebhook}
                    className="p-3 rounded border border-border hover:border-emerald/40 bg-background hover:bg-card text-left transition-all group flex flex-col justify-between space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald text-xs font-sans flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Simulate Sale Created
                      </span>
                      <ArrowRight className="w-3 h-3 text-foreground-subtle group-hover:text-emerald group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] text-foreground-subtle font-mono">
                      Stage 2 Ceramic • 16.06M UZS ($1,250)
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-foreground-subtle">
                  Paste Yong‘oq JSON Array:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadSampleJson('clients')}
                    className="text-[10px] font-mono text-foreground-subtle hover:text-foreground underline"
                  >
                    Load Sample Clients
                  </button>
                  <span className="text-foreground-subtle">•</span>
                  <button
                    onClick={() => loadSampleJson('sales')}
                    className="text-[10px] font-mono text-foreground-subtle hover:text-foreground underline"
                  >
                    Load Sample Sales
                  </button>
                </div>
              </div>

              <textarea
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                placeholder="[ { &quot;client_id&quot;: &quot;...&quot;, &quot;full_name&quot;: &quot;...&quot;, &quot;phone&quot;: &quot;...&quot; } ]"
                rows={6}
                className="w-full p-2.5 rounded bg-background border border-border text-foreground font-mono text-xs focus:outline-none focus:border-emerald/50"
              />

              {importStatus && (
                <div
                  className={cn(
                    'p-2 rounded text-xs font-mono',
                    importStatus.startsWith('Error')
                      ? 'bg-guardsRed/10 border border-guardsRed/30 text-guardsRed'
                      : 'bg-emerald/10 border border-emerald/30 text-emerald'
                  )}
                >
                  {importStatus}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleProcessJsonImport}
                  disabled={!jsonInput.trim()}
                  className="px-4 py-2 rounded bg-emerald hover:bg-emerald/90 text-background font-semibold text-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Parse & Ingest JSON</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
                <span>Recent Ingestion Events</span>
                <span>Auto-refreshing</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {yongoqLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded bg-background border border-border flex items-start justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald shrink-0 mt-1.5" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-foreground truncate">{log.message}</span>
                        <span className="text-[10px] text-foreground-subtle">
                          {new Date(log.timestamp).toLocaleTimeString()} • Mode: {log.mode}
                        </span>
                      </div>
                    </div>

                    {log.revenueSyncedUsd > 0 && (
                      <span className="font-bold text-emerald tabular-nums shrink-0">
                        +${log.revenueSyncedUsd}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-card-subtle flex items-center justify-between text-xs font-mono text-foreground-subtle">
          <span>UZS Exchange: 1 USD = {UZS_TO_USD_RATE.toLocaleString()} UZS</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-card hover:bg-card-hover border border-border text-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
