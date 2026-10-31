import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Booking,
  Bay,
  Vehicle,
  Customer,
  ChemicalInventory,
  Technician,
  IgCampaign,
  BeforeAfterMedia,
  WeatherCondition,
  MCPToolCallLog,
  InspectionMarker,
  DamageType,
  PanelZone,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_BAYS,
  INITIAL_CHEMICALS,
  INITIAL_TECHNICIANS,
  INITIAL_CAMPAIGNS,
  INITIAL_BEFORE_AFTER,
  FIVE_DAY_WEATHER,
} from '../data/seed-data';
import { MetaMCPService } from '../services/meta-mcp.service';
import { SupportedLanguage, getTranslations, translations } from '../lib/i18n';

export type ActiveTab = 'forecast' | 'radar' | 'bays' | 'operations';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'alert' | 'info';
}

interface ShopStoreContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: typeof translations.en;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCmdkOpen: boolean;
  setIsCmdkOpen: (open: boolean) => void;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;

  // Sliders for Module A
  adSpendSlider: number;
  setAdSpendSlider: (val: number) => void;
  bayUtilSlider: number;
  setBayUtilSlider: (val: number) => void;

  // Data
  customers: Customer[];
  vehicles: Vehicle[];
  bookings: Booking[];
  bays: Bay[];
  chemicals: ChemicalInventory[];
  technicians: Technician[];
  campaigns: IgCampaign[];
  beforeAfterMedia: BeforeAfterMedia[];
  weather: WeatherCondition[];
  mcpLogs: MCPToolCallLog[];
  toasts: ToastMessage[];

  // Actions
  dismissToast: (id: string) => void;
  addToast: (title: string, description: string, type?: ToastMessage['type']) => void;
  advanceBookingStage: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  addInspectionMarker: (data: Omit<InspectionMarker, 'id' | 'timestamp'>) => void;
  removeInspectionMarker: (markerId: string) => void;
  toggleCampaignStatus: (campaignId: string) => Promise<void>;
  updateKillSwitchThreshold: (campaignId: string, limit: number) => Promise<void>;
  executeNaturalLanguageMcpPrompt: (prompt: string) => Promise<void>;
  activateWeatherPromotion: (campaignId: string) => Promise<void>;
  restockChemical: (chemicalId: string, amount: number) => void;
  sendRetentionReminder: (vehicleId: string, channel: 'IG_DM' | 'TELEGRAM' | 'SMS') => void;
  pushMediaToIgQueue: (mediaId: string) => Promise<void>;
  addNewBooking: (newBooking: Partial<Booking>) => void;
}

const ShopStoreContext = createContext<ShopStoreContextType | null>(null);

const metaMcp = MetaMCPService.getInstance();

export const ShopStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('detailingos_lang') : null;
    return saved === 'ru' || saved === 'uz' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('detailingos_lang', lang);
    }
  };

  const t = getTranslations(language);

  const [activeTab, setActiveTab] = useState<ActiveTab>('forecast');
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-1');

  const [adSpendSlider, setAdSpendSlider] = useState<number>(65);
  const [bayUtilSlider, setBayUtilSlider] = useState<number>(82);

  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [bays, setBays] = useState<Bay[]>(INITIAL_BAYS);
  const [chemicals, setChemicals] = useState<ChemicalInventory[]>(INITIAL_CHEMICALS);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [campaigns, setCampaigns] = useState<IgCampaign[]>(INITIAL_CAMPAIGNS);
  const [beforeAfterMedia, setBeforeAfterMedia] = useState<BeforeAfterMedia[]>(INITIAL_BEFORE_AFTER);
  const [weather] = useState<WeatherCondition[]>(FIVE_DAY_WEATHER);
  const [mcpLogs, setMcpLogs] = useState<MCPToolCallLog[]>(metaMcp.getLogs());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Listen to MCP Service real-time logs
  useEffect(() => {
    const unsubscribe = metaMcp.subscribe(logs => {
      setMcpLogs(logs);
    });
    return unsubscribe;
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdkOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (title: string, description: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const advanceBookingStage = (bookingId: string) => {
    const stages: Booking['stage'][] = [
      'Pre-Wash',
      'Clay & Iron Decon',
      '2-Step Polish',
      'Coating Application',
      'IR Curing',
      'Final Inspection',
      'Ready',
    ];

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const currentIndex = stages.indexOf(b.stage);
        if (currentIndex < stages.length - 1) {
          const nextStage = stages[currentIndex + 1];
          const newStatus = nextStage === 'Ready' ? 'COMPLETED' : 'IN_PROGRESS';
          addToast(
            `${b.vehiclePlate} Stage Advanced`,
            `Moved to ${nextStage}. Assigned to ${b.technicianName}.`,
            'info'
          );
          return {
            ...b,
            stage: nextStage,
            status: newStatus,
            elapsedMinutes: Math.min(b.estimatedMinutes, b.elapsedMinutes + Math.round(b.estimatedMinutes / 6)),
          };
        }
        return b;
      })
    );

    // Sync Bay booking state
    setBays(prevBays =>
      prevBays.map(bay => {
        if (bay.currentBooking?.id === bookingId) {
          const updatedBk = bookings.find(b => b.id === bookingId);
          return {
            ...bay,
            currentBooking: updatedBk ? { ...updatedBk } : bay.currentBooking,
          };
        }
        return bay;
      })
    );
  };

  const completeBooking = (bookingId: string) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    // 1. Mark booking completed
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'COMPLETED', stage: 'Ready', completedAt: new Date().toISOString() } : b))
    );

    // 2. Calculate commission for technician
    const tech = technicians.find(t => t.id === targetBooking.technicianId);
    if (tech) {
      const commissionEarned = Math.round(targetBooking.totalPrice * tech.commissionRate);
      setTechnicians(prev =>
        prev.map(t =>
          t.id === tech.id
            ? {
                ...t,
                totalCompletedJobs: t.totalCompletedJobs + 1,
                currentMonthRevenueGenerated: t.currentMonthRevenueGenerated + targetBooking.totalPrice,
              }
            : t
        )
      );
      addToast(
        `Job Completed: ${targetBooking.vehiclePlate}`,
        `${tech.name} earned $${commissionEarned} (${Math.round(tech.commissionRate * 100)}% labor commission split).`,
        'success'
      );
    }

    // 3. Deduct chemicals automatically
    setChemicals(prev =>
      prev.map(c => {
        const deducted = Math.max(0, c.currentStock - c.burnRatePerJob);
        if (deducted <= c.reorderThreshold && c.currentStock > c.reorderThreshold) {
          addToast(
            `Stock Reorder Alert: ${c.name}`,
            `Current stock (${deducted} ${c.unit}) breached safety threshold (${c.reorderThreshold} ${c.unit}).`,
            'alert'
          );
        }
        return {
          ...c,
          currentStock: Number(deducted.toFixed(1)),
        };
      })
    );
  };

  const addInspectionMarker = (data: Omit<InspectionMarker, 'id' | 'timestamp'>) => {
    const newMarker: InspectionMarker = {
      ...data,
      id: `marker-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setVehicles(prev =>
      prev.map(v =>
        v.id === data.vehicleId
          ? {
              ...v,
              inspectionMarkers: [...v.inspectionMarkers, newMarker],
            }
          : v
      )
    );

    addToast(
      'Liability Pin Placed',
      `${data.damageType.replace('_', ' ')} logged on ${data.panelZone.replace(/_/g, ' ')}.`,
      'info'
    );
  };

  const removeInspectionMarker = (markerId: string) => {
    setVehicles(prev =>
      prev.map(v => ({
        ...v,
        inspectionMarkers: v.inspectionMarkers.filter(m => m.id !== markerId),
      }))
    );
    addToast('Marker Removed', 'Inspection pin cleared from vehicle record.', 'info');
  };

  const toggleCampaignStatus = async (campaignId: string) => {
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return;

    const nextStatus = camp.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    await metaMcp.executeToolCall('toggle_campaign_status', {
      meta_campaign_id: camp.metaCampaignId,
      status: nextStatus,
    });

    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, status: nextStatus } : c))
    );

    addToast(
      `Meta Campaign ${nextStatus === 'ACTIVE' ? 'Activated' : 'Paused'}`,
      `"${camp.name}" is now ${nextStatus} via Meta MCP Graph API.`,
      nextStatus === 'ACTIVE' ? 'success' : 'warning'
    );
  };

  const updateKillSwitchThreshold = async (campaignId: string, limit: number) => {
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return;

    await metaMcp.executeToolCall('create_rule', {
      name: `Kill-Switch CPL > $${limit.toFixed(2)}`,
      metric: 'cost_per_lead',
      operator: 'GREATER_THAN',
      value: limit,
      action: 'PAUSE',
    });

    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, autoKillCplLimit: limit } : c))
    );

    addToast(
      'Automated Rule Armed',
      `Auto-pause triggered if CPL crosses $${limit.toFixed(2)}.`,
      'info'
    );
  };

  const executeNaturalLanguageMcpPrompt = async (prompt: string) => {
    const parsed = metaMcp.parseNaturalLanguagePrompt(prompt);

    for (const call of parsed.generatedToolCalls) {
      await metaMcp.executeToolCall(call.toolName, call.args);
    }

    // Add new campaign to list
    const newCamp: IgCampaign = {
      id: `camp-${Date.now()}`,
      metaCampaignId: `act_492019482910_c${campaigns.length + 1}`,
      name: `AI Target: ${parsed.detectedInterests.slice(0, 2).join(' + ')} (${parsed.detectedRadiusKm}km)`,
      creativeType: parsed.creativeType as IgCampaign['creativeType'],
      creativeThumbnail: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&auto=format&fit=crop&q=80',
      radiusKm: parsed.detectedRadiusKm,
      targetInterests: parsed.detectedInterests,
      ageMin: 25,
      ageMax: 60,
      dailyBudget: parsed.detectedDailyBudget,
      totalSpend: 0,
      leadsGenerated: 0,
      costPerLead: 0,
      bookingsAttributed: 0,
      revenueAttributed: 0,
      autoKillCplLimit: 18.0,
      weatherTriggered: false,
      status: 'ACTIVE',
    };

    setCampaigns(prev => [newCamp, ...prev]);

    addToast(
      'Meta MCP Campaign Deployed',
      `Targeting ${parsed.detectedInterests.join(', ')} within ${parsed.detectedRadiusKm}km at $${parsed.detectedDailyBudget}/day.`,
      'success'
    );
  };

  const activateWeatherPromotion = async (campaignId: string) => {
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return;

    await metaMcp.activateWeatherPromotion(camp);

    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, status: 'ACTIVE' } : c))
    );

    addToast(
      'Weather Promo Live!',
      'Sunny window detected. "Post-Rain Hydrophobic Wash" Reel is now live within 8km.',
      'success'
    );
  };

  const restockChemical = (chemicalId: string, amount: number) => {
    setChemicals(prev =>
      prev.map(c => {
        if (c.id !== chemicalId) return c;
        const newStock = Math.min(c.maxCapacity, c.currentStock + amount);
        return {
          ...c,
          currentStock: Number(newStock.toFixed(1)),
          lastRestockedAt: new Date().toISOString(),
        };
      })
    );
    addToast('Inventory Restocked', `Added ${amount} units to consumable inventory.`, 'success');
  };

  const sendRetentionReminder = (vehicleId: string, channel: 'IG_DM' | 'TELEGRAM' | 'SMS') => {
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) return;

    // Reset due date by 180 days (6 months)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 180);

    setVehicles(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, nextMaintenanceDueAt: nextDate.toISOString() } : v))
    );

    addToast(
      `Reminder Dispatched via ${channel.replace('_', ' ')}`,
      `Ceramic decon wash invitation sent for ${veh.licensePlate} (${veh.model}). Reset countdown for 180 days.`,
      'success'
    );
  };

  const pushMediaToIgQueue = async (mediaId: string) => {
    const media = beforeAfterMedia.find(m => m.id === mediaId);
    if (!media) return;

    await metaMcp.executeToolCall('create_ad_set', {
      name: `Reel Showcase • ${media.vehicleModel}`,
      daily_budget_cents: 2500,
      targeting: { geo_radius_km: 10, interests: ['Auto Detailing', 'Luxury Cars'] },
    });

    setBeforeAfterMedia(prev =>
      prev.map(m => (m.id === mediaId ? { ...m, isQueuedForIG: true, igQueueStatus: 'READY' } : m))
    );

    addToast(
      'Media Queued to Meta MCP',
      `Transformation reel for ${media.vehiclePlate} pushed to Meta Ads creative queue.`,
      'success'
    );
  };

  const addNewBooking = (newBooking: Partial<Booking>) => {
    const bk: Booking = {
      id: `bk-${Date.now()}`,
      vehicleId: newBooking.vehicleId || vehicles[0].id,
      vehiclePlate: newBooking.vehiclePlate || 'M-GT-992',
      vehicleModel: newBooking.vehicleModel || 'Porsche 911 GT3',
      customerName: newBooking.customerName || 'Alexander Von Berg',
      bayNumber: newBooking.bayNumber || 1,
      packageType: newBooking.packageType || 'STAGE_2_CERAMIC_PACKAGE',
      status: 'SCHEDULED',
      totalPrice: newBooking.totalPrice || 1200,
      laborCost: newBooking.laborCost || 340,
      chemicalCost: newBooking.chemicalCost || 120,
      billableHours: newBooking.billableHours || 4.5,
      elapsedMinutes: 0,
      estimatedMinutes: (newBooking.billableHours || 4.5) * 60,
      technicianId: newBooking.technicianId || 'tech-1',
      technicianName: newBooking.technicianName || 'Marco Rossi',
      stage: 'Pre-Wash',
      scheduledAt: new Date().toISOString(),
      inspectionDone: false,
    };

    setBookings(prev => [bk, ...prev]);
    addToast('Booking Created', `Booked ${bk.vehiclePlate} in Bay ${bk.bayNumber}.`, 'success');
  };

  return (
    <ShopStoreContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        isCmdkOpen,
        setIsCmdkOpen,
        selectedVehicleId,
        setSelectedVehicleId,
        adSpendSlider,
        setAdSpendSlider,
        bayUtilSlider,
        setBayUtilSlider,
        customers,
        vehicles,
        bookings,
        bays,
        chemicals,
        technicians,
        campaigns,
        beforeAfterMedia,
        weather,
        mcpLogs,
        toasts,
        dismissToast,
        addToast,
        advanceBookingStage,
        completeBooking,
        addInspectionMarker,
        removeInspectionMarker,
        toggleCampaignStatus,
        updateKillSwitchThreshold,
        executeNaturalLanguageMcpPrompt,
        activateWeatherPromotion,
        restockChemical,
        sendRetentionReminder,
        pushMediaToIgQueue,
        addNewBooking,
      }}
    >
      {children}
    </ShopStoreContext.Provider>
  );
};

export const useShopStore = () => {
  const context = useContext(ShopStoreContext);
  if (!context) {
    throw new Error('useShopStore must be used within a ShopStoreProvider');
  }
  return context;
};
