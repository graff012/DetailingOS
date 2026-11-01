import {
  Customer,
  Vehicle,
  Booking,
  YongoqClientPayload,
  YongoqSalePayload,
  YongoqSyncLog,
  PackageType,
  CoatingType,
} from '../types';

export const YONGOQ_DEFAULT_SECRET = 'yq_sec_tashkent_998';
export const UZS_TO_USD_RATE = 12850; // Tashkent exchange benchmark rate

export class YongoqSyncService {
  private static instance: YongoqSyncService;
  private syncLogs: YongoqSyncLog[] = [
    {
      id: 'yq-log-1',
      timestamp: '2026-11-01T14:10:00+05:00',
      mode: 'WEBHOOK',
      clientsSynced: 1,
      salesSynced: 1,
      revenueSyncedUsd: 1250,
      status: 'SUCCESS',
      message: 'Client Alisher Qodirov (Porsche 911 GT3) + $1,250 Ceramic Package received via Click',
    },
    {
      id: 'yq-log-2',
      timestamp: '2026-11-01T11:45:00+05:00',
      mode: 'REST_API',
      clientsSynced: 3,
      salesSynced: 2,
      revenueSyncedUsd: 840,
      status: 'SUCCESS',
      message: 'Incremental sync pulled 3 clients and 2 washes ($840)',
    },
  ];

  private listeners: Array<(logs: YongoqSyncLog[]) => void> = [];

  public static getInstance(): YongoqSyncService {
    if (!YongoqSyncService.instance) {
      YongoqSyncService.instance = new YongoqSyncService();
    }
    return YongoqSyncService.instance;
  }

  public getLogs(): YongoqSyncLog[] {
    return [...this.syncLogs];
  }

  public subscribe(listener: (logs: YongoqSyncLog[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.getLogs()));
  }

  /**
   * Helper: Map Yong'oq package name to DetailingOS PackageType
   */
  public mapServiceToPackage(serviceName: string): PackageType {
    const s = serviceName.toLowerCase();
    if (s.includes('ppf') || s.includes('пленка') || s.includes('plyonka')) {
      if (s.includes('full') || s.includes('полная') || s.includes('butun')) return 'FULL_VEHICLE_PPF';
      if (s.includes('track')) return 'TRACK_PACK_PPF';
      return 'FULL_FRONT_PPF';
    }
    if (s.includes('ceramic') || s.includes('керамик') || s.includes('keramika')) {
      return 'STAGE_2_CERAMIC_PACKAGE';
    }
    if (s.includes('correction') || s.includes('полиров') || s.includes('polirovka')) {
      return 'STAGE_1_PAINT_CORRECTION';
    }
    if (s.includes('interior') || s.includes('салон') || s.includes('ximchistka')) {
      return 'INTERIOR_DEEP_CLEAN';
    }
    if (s.includes('decon') || s.includes('декон') || s.includes('moyka')) {
      return 'EXPRESS_DECON_WASH';
    }
    return 'MAINTENANCE_CERAMIC_WASH';
  }

  /**
   * Convert currency to USD if in UZS
   */
  public normalizePriceToUsd(amount: number, currency: 'USD' | 'UZS' = 'USD'): number {
    if (currency === 'UZS' || amount > 10000) {
      return Math.round(amount / UZS_TO_USD_RATE);
    }
    return Math.round(amount);
  }

  /**
   * Ingest and process a single Client payload from Yong'oq
   */
  public processClientPayload(payload: YongoqClientPayload): {
    customer: Customer;
    vehicle: Vehicle;
  } {
    const customerId = `cust-${payload.client_id || Date.now()}`;
    const vehicleId = `veh-${payload.client_id || Date.now()}`;

    const cleanPhone = payload.phone.startsWith('+') ? payload.phone : `+${payload.phone}`;
    const plate = payload.vehicle?.license_plate || '01 A 000 AA';
    const make = payload.vehicle?.make || 'Unknown';
    const model = payload.vehicle?.model || 'Vehicle';
    const color = payload.vehicle?.color || 'Black';

    // 6-month ceramic maintenance reminder default date
    const now = new Date(payload.created_at || new Date().toISOString());
    const dueAt = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString();

    const customer: Customer = {
      id: customerId,
      fullName: payload.full_name || 'Yong‘oq Client',
      phone: cleanPhone,
      acquisitionChannel: 'WALK_IN',
      notes: payload.notes || 'Imported via Yong‘oq POS integration',
      createdAt: payload.created_at || new Date().toISOString(),
    };

    const vehicle: Vehicle = {
      id: vehicleId,
      customerId,
      licensePlate: plate,
      make,
      model,
      year: 2024,
      color,
      coatingType: 'CERAMIC_3_YEAR_GYEON' as CoatingType,
      coatingAppliedAt: payload.created_at || new Date().toISOString(),
      nextMaintenanceDueAt: dueAt,
      inspectionMarkers: [],
    };

    return { customer, vehicle };
  }

  /**
   * Ingest and process a single Sale payload from Yong'oq
   */
  public processSalePayload(
    payload: YongoqSalePayload,
    vehicleId = 'veh-1',
    technicianId = 'tech-1'
  ): Booking {
    const currency = payload.currency || (payload.total_amount > 10000 ? 'UZS' : 'USD');
    const amountUsd = this.normalizePriceToUsd(payload.total_amount, currency);

    const serviceName = payload.services?.[0]?.service_name || 'Standard Detailing Service';
    const packageType = this.mapServiceToPackage(serviceName);

    const booking: Booking = {
      id: `booking-${payload.sale_id || Date.now()}`,
      vehicleId,
      vehiclePlate: payload.vehicle_plate || '01 A 777 AA',
      vehicleModel: 'Synced Client Vehicle',
      customerName: payload.client_name || 'Yong‘oq Client',
      bayNumber: 2,
      packageType,
      status: 'COMPLETED',
      totalPrice: amountUsd,
      laborCost: Math.round(amountUsd * 0.28),
      chemicalCost: Math.round(amountUsd * 0.12),
      billableHours: packageType.includes('PPF') ? 12 : packageType.includes('CERAMIC') ? 6 : 2,
      elapsedMinutes: 240,
      estimatedMinutes: 240,
      technicianId,
      technicianName: payload.cashier_or_master || 'Studio Specialist',
      stage: 'Ready',
      scheduledAt: payload.sale_date || new Date().toISOString(),
      completedAt: payload.sale_date || new Date().toISOString(),
      inspectionDone: true,
    };

    return booking;
  }

  /**
   * Log an integration sync event
   */
  public addSyncLog(log: Omit<YongoqSyncLog, 'id' | 'timestamp'>): void {
    const newLog: YongoqSyncLog = {
      ...log,
      id: `yq-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.syncLogs.unshift(newLog);
    if (this.syncLogs.length > 30) this.syncLogs.pop();
    this.notify();
  }
}
