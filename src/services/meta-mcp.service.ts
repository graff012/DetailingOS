/**
 * Meta Ads MCP Service Layer
 * Emulates the Model Context Protocol (MCP) JSON-RPC 2.0 interface
 * for Meta Marketing Graph API v25/v26 (@mikusnuz/meta-ads-mcp & hashcott/meta-ads-mcp).
 */

import { MCPToolCallLog, IgCampaign } from '../types';

export interface JSONRPCRequest<T = Record<string, unknown>> {
  jsonrpc: '2.0';
  id: string | number;
  method: 'tools/call' | 'tools/list';
  params: {
    name: string;
    arguments: T;
  };
}

export interface JSONRPCResponse<T = Record<string, unknown>> {
  jsonrpc: '2.0';
  id: string | number;
  result?: {
    content: Array<{
      type: 'text' | 'json';
      text?: string;
      data?: T;
    }>;
    isError?: boolean;
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// Available MCP Tools
export const META_MCP_TOOLS: MCPToolDefinition[] = [
  {
    name: 'search_targeting_interests',
    description: 'Query Meta Marketing Graph API for validated luxury vehicle and auto detailing interest clusters and audience sizes.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Interest search keyword' },
        limit: { type: 'number', description: 'Max items to return' },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_ad_set',
    description: 'Deploy a high-converting Instagram Reel ad set with strict geo-fencing, placement targeting, and daily spend cap.',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string' },
        name: { type: 'string' },
        daily_budget_cents: { type: 'number' },
        targeting: { type: 'object' },
        billing_event: { type: 'string', enum: ['IMPRESSIONS', 'LINK_CLICKS'] },
      },
      required: ['name', 'daily_budget_cents', 'targeting'],
    },
  },
  {
    name: 'set_geo_radius',
    description: 'Set hyper-local garage coordinate drop-pin with radius in kilometers.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        radius_km: { type: 'number', minimum: 5, maximum: 25 },
        distance_unit: { type: 'string', enum: ['kilometer'] },
      },
      required: ['latitude', 'longitude', 'radius_km'],
    },
  },
  {
    name: 'create_rule',
    description: 'Install an automated Meta Ads kill-switch rule to pause ads if Cost Per Lead exceeds threshold.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        evaluation_spec: {
          type: 'object',
          properties: {
            metric: { type: 'string', enum: ['cost_per_lead', 'cpl', 'frequency'] },
            operator: { type: 'string', enum: ['GREATER_THAN'] },
            value: { type: 'number' },
          },
        },
        execution_spec: {
          type: 'object',
          properties: {
            action_type: { type: 'string', enum: ['PAUSE', 'SEND_NOTIFICATION'] },
          },
        },
      },
      required: ['name', 'evaluation_spec', 'execution_spec'],
    },
  },
  {
    name: 'toggle_campaign_status',
    description: 'Immediately toggle campaign or ad set delivery state between ACTIVE and PAUSED.',
    inputSchema: {
      type: 'object',
      properties: {
        meta_campaign_id: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED'] },
      },
      required: ['meta_campaign_id', 'status'],
    },
  },
];

// Validated Meta Audience Interest Dictionary
export const KNOWN_INTERESTS: Record<string, { id: string; name: string; audienceSize: number; category: string }> = {
  'porsche': { id: '6003139268392', name: 'Porsche', audienceSize: 84000, category: 'Luxury Vehicle' },
  'porsche 911': { id: '6003139268393', name: 'Porsche 911', audienceSize: 42000, category: 'Sports Car' },
  'bmw m': { id: '6003189283921', name: 'BMW M', audienceSize: 67000, category: 'Performance Auto' },
  'mercedes-amg': { id: '6003299102911', name: 'Mercedes-AMG', audienceSize: 71000, category: 'Performance Auto' },
  'track days': { id: '6004928192019', name: 'Track day', audienceSize: 29000, category: 'Motorsport' },
  'auto detailing': { id: '6005829102918', name: 'Auto detailing', audienceSize: 115000, category: 'Automotive Care' },
  'ceramic coating': { id: '6007192839102', name: 'Ceramic coating', audienceSize: 38000, category: 'Automotive Care' },
  'tesla': { id: '6003819201928', name: 'Tesla', audienceSize: 92000, category: 'Electric Vehicle' },
  'ferrari': { id: '6003102938475', name: 'Ferrari', audienceSize: 31000, category: 'Supercar' },
};

export class MetaMCPService {
  private static instance: MetaMCPService;
  private logs: MCPToolCallLog[] = [];
  private listeners: Array<(logs: MCPToolCallLog[]) => void> = [];

  // Studio Garage Coordinates (Munich Supercar Hub)
  public readonly GARAGE_COORDINATES = {
    lat: 48.137154,
    lng: 11.576124,
    address: 'Maximilianstraße 35, 80539 Munich, Germany',
  };

  private constructor() {
    // Initial mock logs showing startup handshakes
    this.logs = [
      {
        id: 'log-init-1',
        timestamp: '2026-10-31 07:15:02',
        toolName: 'set_geo_radius',
        status: 'SUCCESS',
        arguments: {
          latitude: 48.137154,
          longitude: 11.576124,
          radius_km: 12,
          distance_unit: 'kilometer',
        },
        response: {
          status: 'BOUND_TO_ADSET',
          coordinates: '48.137154, 11.576124',
          active_radius: '12 km',
          potential_reach: 184000,
        },
        latencyMs: 142,
      },
      {
        id: 'log-init-2',
        timestamp: '2026-10-31 07:15:04',
        toolName: 'create_rule',
        status: 'SUCCESS',
        arguments: {
          name: 'Auto-Kill CPL Spikes > $18.00',
          metric: 'cost_per_lead',
          operator: 'GREATER_THAN',
          value: 18.0,
          action: 'PAUSE',
        },
        response: {
          rule_id: 'rule_8492019482',
          trigger_frequency: 'EVERY_30_MINUTES',
          enforced: true,
        },
        latencyMs: 218,
      },
    ];
  }

  public static getInstance(): MetaMCPService {
    if (!MetaMCPService.instance) {
      MetaMCPService.instance = new MetaMCPService();
    }
    return MetaMCPService.instance;
  }

  public getLogs(): MCPToolCallLog[] {
    return [...this.logs];
  }

  public subscribe(listener: (logs: MCPToolCallLog[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn([...this.logs]));
  }

  /**
   * Executes a simulated JSON-RPC 2.0 tool call to Meta Marketing Graph API
   */
  public async executeToolCall<T = Record<string, unknown>>(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<JSONRPCResponse<T>> {
    const startTime = performance.now();
    const callId = `call_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let responseData: Record<string, unknown> = {};
    let isError = false;

    // Simulate realistic network delay (80-220ms)
    await new Promise(r => setTimeout(r, 120 + Math.random() * 80));

    try {
      switch (toolName) {
        case 'search_targeting_interests': {
          const q = String(args.query || '').toLowerCase().trim();
          const matches = Object.entries(KNOWN_INTERESTS)
            .filter(([key]) => key.includes(q) || q.includes(key))
            .map(([, val]) => val);

          responseData = {
            query: args.query,
            total_matches: matches.length,
            interests: matches.length > 0 ? matches : [
              { id: '6003139268392', name: `${args.query} Luxury Segment`, audienceSize: 34000, category: 'Automotive' }
            ],
          };
          break;
        }

        case 'set_geo_radius': {
          const radius = Number(args.radius_km || 10);
          const reachEstimate = Math.round(14000 * Math.pow(radius / 5, 1.4));
          responseData = {
            latitude: args.latitude ?? this.GARAGE_COORDINATES.lat,
            longitude: args.longitude ?? this.GARAGE_COORDINATES.lng,
            radius_km: radius,
            estimated_high_income_auto_enthusiasts: reachEstimate,
            applied: true,
          };
          break;
        }

        case 'create_ad_set': {
          const budget = Number(args.daily_budget_cents || 3500) / 100;
          responseData = {
            ad_set_id: `adset_${Date.now()}`,
            name: args.name,
            daily_budget: `$${budget.toFixed(2)}/day`,
            placements: ['instagram_reels', 'instagram_stories', 'instagram_feed'],
            optimization_goal: 'LEAD_GENERATION',
            status: 'ACTIVE',
          };
          break;
        }

        case 'create_rule': {
          const cplLimit = Number(args.value ?? 18.0);
          responseData = {
            rule_id: `rule_${Date.now()}`,
            name: args.name,
            guardrail: `Pause ad set if Cost Per Lead > $${cplLimit.toFixed(2)}`,
            status: 'ARMED_AND_ACTIVE',
          };
          break;
        }

        case 'toggle_campaign_status': {
          const newStatus = args.status === 'ACTIVE' ? 'ACTIVE' : 'PAUSED';
          responseData = {
            meta_campaign_id: args.meta_campaign_id,
            previous_status: newStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
            current_status: newStatus,
            updated_at: new Date().toISOString(),
          };
          break;
        }

        default:
          isError = true;
          responseData = { error: `Tool "${toolName}" not implemented in Meta MCP adapter.` };
      }
    } catch (err: unknown) {
      isError = true;
      responseData = { error: String(err) };
    }

    const duration = Math.round(performance.now() - startTime);

    const logEntry: MCPToolCallLog = {
      id: callId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      toolName,
      status: isError ? 'ERROR' : 'SUCCESS',
      arguments: args,
      response: responseData,
      latencyMs: duration,
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > 50) this.logs.pop();
    this.notify();

    return {
      jsonrpc: '2.0',
      id: callId,
      result: {
        content: [
          {
            type: 'json',
            data: responseData as T,
          },
        ],
        isError,
      },
    };
  }

  /**
   * Natural Language MCP Prompt Compiler
   * Translates natural language shop requests like:
   * "Target Porsche and BMW owners within 10km with the Gyeon Ceramic Reel at $20/day"
   * into a batch of typed JSON-RPC tool calls.
   */
  public parseNaturalLanguagePrompt(prompt: string): {
    detectedRadiusKm: number;
    detectedDailyBudget: number;
    detectedInterests: string[];
    creativeType: string;
    generatedToolCalls: Array<{
      toolName: string;
      args: Record<string, unknown>;
      summary: string;
    }>;
  } {
    const p = prompt.toLowerCase();

    // 1. Detect radius
    let detectedRadiusKm = 10;
    const radiusMatch = p.match(/(\d+)\s*(?:km|k|kilometer|kilometers|miles|mi)/i);
    if (radiusMatch) {
      detectedRadiusKm = Math.min(25, Math.max(5, parseInt(radiusMatch[1], 10)));
    }

    // 2. Detect budget
    let detectedDailyBudget = 25;
    const budgetMatch = p.match(/\$(\d+)(?:\/day|\s*daily|\s*budget)?/i) || p.match(/(\d+)\s*(?:dollars|bucks|usd|eur|€)/i);
    if (budgetMatch) {
      detectedDailyBudget = Math.min(250, Math.max(10, parseInt(budgetMatch[1], 10)));
    }

    // 3. Detect interests
    const detectedInterests: string[] = [];
    if (p.includes('porsche') || p.includes('911') || p.includes('gt3')) detectedInterests.push('Porsche', 'Porsche 911');
    if (p.includes('bmw') || p.includes('m3') || p.includes('m4') || p.includes('m5')) detectedInterests.push('BMW M');
    if (p.includes('mercedes') || p.includes('amg')) detectedInterests.push('Mercedes-AMG');
    if (p.includes('tesla') || p.includes('plaid')) detectedInterests.push('Tesla');
    if (p.includes('track') || p.includes('nurburgring') || p.includes('circuit')) detectedInterests.push('Track Days');
    if (p.includes('ceramic') || p.includes('gyeon') || p.includes('coating')) detectedInterests.push('Ceramic Coating');
    if (p.includes('ppf') || p.includes('xpel') || p.includes('film')) detectedInterests.push('Auto Detailing', 'Paint Protection Film');
    if (p.includes('suv') || p.includes('rain') || p.includes('wash')) detectedInterests.push('Luxury Cars', 'Auto Detailing');

    if (detectedInterests.length === 0) {
      detectedInterests.push('Porsche', 'BMW M', 'Auto Detailing');
    }

    // 4. Creative type
    let creativeType = 'REEL_WATER_BEADING';
    if (p.includes('ppf') || p.includes('scratch') || p.includes('wire brush')) {
      creativeType = 'REEL_PPF_SELF_HEALING';
    } else if (p.includes('50/50') || p.includes('correction') || p.includes('polish')) {
      creativeType = 'REEL_50_50_CORRECTION';
    } else if (p.includes('story') || p.includes('poll') || p.includes('discount')) {
      creativeType = 'STORY_POLL_DISCOUNT';
    }

    // Generate sequence of MCP tool calls
    const generatedToolCalls = [
      {
        toolName: 'set_geo_radius',
        args: {
          latitude: this.GARAGE_COORDINATES.lat,
          longitude: this.GARAGE_COORDINATES.lng,
          radius_km: detectedRadiusKm,
          distance_unit: 'kilometer',
        },
        summary: `Set geo-radius to ${detectedRadiusKm}km around studio`,
      },
      {
        toolName: 'search_targeting_interests',
        args: {
          query: detectedInterests[0],
          limit: 5,
        },
        summary: `Validate luxury audience size for "${detectedInterests[0]}"`,
      },
      {
        toolName: 'create_ad_set',
        args: {
          name: `IG Reel • ${detectedInterests.slice(0, 2).join(' + ')} • ${detectedRadiusKm}km`,
          daily_budget_cents: detectedDailyBudget * 100,
          targeting: {
            geo_radius_km: detectedRadiusKm,
            age_min: 25,
            age_max: 60,
            interests: detectedInterests,
          },
          billing_event: 'IMPRESSIONS',
        },
        summary: `Launch Instagram Ad Set with $${detectedDailyBudget}/day cap`,
      },
      {
        toolName: 'create_rule',
        args: {
          name: `Auto-Kill CPL Spikes > $18.00`,
          metric: 'cost_per_lead',
          operator: 'GREATER_THAN',
          value: 18.0,
          action: 'PAUSE',
        },
        summary: `Arm automated kill-switch rule if CPL > $18.00`,
      },
    ];

    return {
      detectedRadiusKm,
      detectedDailyBudget,
      detectedInterests,
      creativeType,
      generatedToolCalls,
    };
  }

  /**
   * Fast 1-click trigger to activate weather promotion reel
   */
  public async activateWeatherPromotion(campaign: IgCampaign): Promise<void> {
    await this.executeToolCall('toggle_campaign_status', {
      meta_campaign_id: campaign.metaCampaignId,
      status: 'ACTIVE',
    });
    await this.executeToolCall('set_geo_radius', {
      latitude: this.GARAGE_COORDINATES.lat,
      longitude: this.GARAGE_COORDINATES.lng,
      radius_km: 8,
      distance_unit: 'kilometer',
    });
  }
}
