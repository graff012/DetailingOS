# SYSTEM SPECIFICATION: Auto-Detailing ERP & Instagram MCP Command Center ("DetailingOS")

## 1. Role & Execution Objective
Act as a Principal Full-Stack Engineer and Design Systems Architect. Build **DetailingOS**, a high-density, production-grade Admin Panel, Shop ERP, Financial Forecasting Engine, and Instagram Ad Targeting Command Center for a luxury car detailing, Paint Protection Film (PPF), and Ceramic Coating studio.

Do not generate placeholder "TODO" components or generic AI dashboard templates. Build a working, richly seeded, interactive application with modular architecture, deterministic financial calculations, and an extensible Model Context Protocol (MCP) adapter layer for Meta/Instagram Ads.

---

## 2. Tech Stack & Architecture
- **Frontend Framework:** Next.js (App Router) or React + Vite with TypeScript (strict mode).
- **Styling & UI Primitives:** Tailwind CSS + Shadcn UI (Radix primitives) + Lucide React icons.
- **Charts & Visuals:** Recharts (configured with minimal gridlines, custom dark tooltips, and monospace axes).
- **State & Command Bar:** `cmdk` for global `Cmd+K` license plate, client, and action lookup.
- **Backend / Data Layer:** Next.js Route Handlers (or modular service layer) + Prisma ORM schema (`prisma/schema.prisma`) targeting PostgreSQL, paired with a rich deterministic mock seed store so the UI runs out-of-the-box immediately.
- **MCP Integration Layer:** Modular TypeScript service (`src/services/meta-mcp.service.ts`) designed to interface with open-source Meta Ads MCP servers (`@mikusnuz/meta-ads-mcp` or `hashcott/meta-ads-mcp` wrapping Meta Marketing Graph API v25/v26) via JSON-RPC/stdio or HTTP tool calls, authenticated via a Facebook System User Access Token (`ads_read`, `ads_management`).

### System Architecture Diagram
```text
+-------------------------------------------------------------------------+
|                       DetailingOS Frontend (React/TS)                   |
|  [Cmd+K Search]  [Executive KPIs]  [Bay Live]  [IG Radar]  [Walkaround] |
+-------------------+--------------------+--------------------+-----------+
                    |                    |                    |
        +-----------+-------+   +--------+--------+   +-------+-----------+
        | Finance Engine    |   | Shop ERP Store  |   | Meta Ads MCP Svc  |
        | (LTV, CAC, ROAS,  |   | (Bays, Chems,   |   | (Geo-Pin, Weather |
        |  90d Forecast)    |   |  Walkaround CRM)|   |  Trigger, Rules)  |
        +-------------------+   +-----------------+   +-------------------+
```

---

## 3. Strict Design System: "Anti-AI Slop" Blueprint
Emulate the visual precision and data density of **Linear**, **Stripe Dashboard**, and **Vercel**.

1. **ZERO AI Slop:** Strictly forbidden from using neon purple/blue/cyan gradients, glowing glassmorphism, floating 3D blobs, or unreadable circular gauges.
2. **Color Tokens:**
   - **Canvas Background:** `#09090B` (Zinc 950)
   - **Elevated Card Surface:** `#121215`
   - **Subtle Hairline Borders:** `1px solid #27272A` (Zinc 800)
   - **Primary Text:** `#FAFAFA` | **Muted Text:** `#A1A1AA`
   - **Semantic Accents ONLY:**
     - Racing Emerald (`#10B981`) for positive deltas, active bays, and healthy ROAS.
     - Amber (`#F59E0B`) for chemical stock warnings and upcoming maintenance reminders.
     - Guards Red (`#EF4444`) for CAC spikes, paused campaigns, and vehicle damage markers.
3. **Typography:**
   - **UI Sans:** `Inter` or `Geist Sans` with tight tracking (`tracking-tight` on headers).
   - **Data & Metrics:** `JetBrains Mono` or `Geist Mono` with `tabular-nums` enforced on every currency figure, percentage, bay timer, ROAS multiplier, and license plate badge so numbers align vertically in tables.
4. **Layout Grid:**
   - Collapsible left sidebar navigation, a `Cmd+K` global command bar for instant booking/plate lookup, a top row of 4 KPI sparkline cards, and a 2-column main workspace below.

```text
+-----------------------------------------------------------------------+
| [Logo] DetailingOS         [Cmd+K Search Plate/Client]    [+ Booking] |
+------------+----------------------------------------------------------+
| Overview   |  [Net Rev: $14.2k] [Bay Util: 82%] [CAC: $18] [ROAS: 4.8x]|
| Bay Live   +-----------------------------------+----------------------+
| IG Agent   |  90-Day Revenue & LTV Forecast    | IG Targeting Agent   |
| Bookings   |  (Actuals vs Projected Ceramic    | - Radius: 8km Active |
| CRM / Cars |   Maint. & Ad Spend Scaling)      | - Interest: BMW/Merc |
| Chemicals  |                                   | [Prompt: "Boost SUV  |
| Settings   |                                   |  ads for rainy wknd"]|
+------------+-----------------------------------+----------------------+
```

---

## 4. Core Modules & Mathematical Implementations

### Module A: Financial & Business Forecasting Engine (`src/lib/finance-engine.ts`)
Car detailing has two distinct revenue streams: high-ticket one-offs (PPF, Ceramic Coating, Paint Correction) and recurring maintenance washes. Implement pure, unit-testable TypeScript functions backing the dashboard charts using these exact models:

1. **Customer Acquisition Cost (CAC) & Return on Ad Spend (ROAS):**
   $$\text{CAC} = \frac{\text{Total Instagram Ad Spend}}{\text{New Customers Booked via IG}}$$
   $$\text{ROAS} = \frac{\text{Revenue from IG Customers}}{\text{Instagram Ad Spend}}$$

2. **Detailing Customer Lifetime Value (LTV):**
   $$\text{LTV} = (\text{Average Ticket Size} \times \text{Visits Per Year} \times \text{Avg Retention Years}) \times \text{Gross Margin } \%$$
   - *Cohort Logic:* Support comparing *Standard Wash Clients* vs. *Ceramic/PPF VIP Clients* to show how a $\$25$ wash lead acquired from an Instagram Reel converts into a $\$600$ to $\$900$ Ceramic Coating package within $60\text{ days}$.

3. **Bay Utilization Rate & Revenue Per Bay Hour (The Shop Bottleneck):**
   $$\text{Bay Utilization} = \left( \frac{\text{Total Billable Bay Hours Used}}{\text{Number of Bays} \times \text{Open Hours}} \right) \times 100$$
   $$\text{Rev Per Bay Hour} = \frac{\text{Package Price}}{\text{Bay Hours Occupied}}$$
   - *Operational Logic:* If Bay 1 is occupied for $2\text{ days}$ by a PPF job, calculate how many express washes Bay 2 must turn over to hit the weekly revenue target.

4. **90-Day Cash Flow & Repeat-Cycle Projection (with Confidence Cone):**
   $$\text{Projected Revenue}_{t+1} = (\text{Active Ceramic/VIP Clients} \times \text{Monthly Wash Rate} \times \text{Avg Maint Ticket}) + \left(\frac{\text{Planned Ad Budget}_{t+1}}{\text{Historical CAC}} \times \text{Avg First Ticket}\right)$$
   - Generate a $90\text{-day}$ time-series array combining $60\text{ days}$ of historical actuals and $90\text{ days}$ of projected revenue using Holt-Winters seasonal smoothing, complete with Upper ($+15\%$) and Lower ($-12\%$) confidence bands rendered as a shaded area chart.
   - Include interactive sliders for **Planned Daily IG Ad Spend ($\$$)** and **Target Bay Utilization ($\%$)** that dynamically recalculate the $90\text{-day}$ projection curve in real time.

---

### Module B: Instagram Ad Targeting Radar (`src/components/ig-radar/`)
Build a simplified, high-leverage "Targeting Radar" interface powered by the Meta Ads MCP service so the shop owner never has to open Meta Ads Manager:

1. **Natural Language MCP Command Bar:**
   - Input box where the owner types plain commands (e.g., *"Target Porsche and BMW owners within 10km with the Gyeon Ceramic Reel at $20/day"*).
   - Display a structured **MCP Tool Execution Preview** showing the translated JSON-RPC payload (`search_targeting_interests`, `create_ad_set`, `set_geo_radius`, `create_rule`).
2. **Hyper-Local Geo-Radius & Luxury Interest Builder:**
   - Interactive controls for **Geo-Radius Drop-Pin** ($5\text{ km}$ to $25\text{ km}$ around the garage coordinates), **Age Bracket** ($25\text{--}60$), and **High-Ticket Vehicle Interest Clusters** (`BMW M`, `Mercedes-AMG`, `Porsche`, `Tesla`, `Track Days`, `Auto Detailing`) for high-margin Ceramic and PPF packages.
3. **Weather-Triggered Promo Automation Card:**
   - Displays a $5\text{-day}$ local weather forecast strip. When rain or snow stops and $\ge 3$ sunny days are ahead, highlight an actionable prompt: *"4 sunny days ahead — launch a $15/day 'Post-Rain Hydrophobic Wash' Reel ad within 8km?"*
   - Include a 1-click **Activate via MCP** button that switches the paused ad set to `ACTIVE`.
4. **Active Reels Matrix & Automated Kill-Switch Rules:**
   - Visual cards/table for each active Instagram Reel/Post ad displaying: **Creative Preview**, **Target Radius**, **Spend**, **Cost Per DM/Lead**, **Attributed Revenue**, **Real ROAS**, and a **Kill/Scale Toggle** (calls MCP `create_rule` to auto-pause if Cost Per Lead exceeds $\$18$).

---

### Module C: Shop Floor ERP & Detailing Operations
Include these critical detailing-specific operational workflows:

1. **Live Bay Tracker (4 Bays):**
   - Visual status cards for **Bay 1 (PPF Cleanroom)**, **Bay 2 (Ceramic & Paint Correction)**, **Bay 3 (Interior Deep Clean)**, and **Bay 4 (Express Wash & Decon)**.
   - Show Vehicle Make/Model, Monospace License Plate badge, Assigned Technician, Elapsed vs. Estimated Time progress bar, and current stage (`Pre-Wash` $\rightarrow$ `Clay & Iron Decon` $\rightarrow$ `2-Step Polish` $\rightarrow$ `IR Curing`).
2. **Digital Vehicle Walkaround (Pre-Inspection Liability Map):**
   - Interactive tablet/desktop view with a top-down SVG vehicle diagram (Front Bumper, Hood, Roof, Doors, Rear Quarter, Wheels/Rims).
   - Clicking a zone drops a color-coded damage pin (`Scratch`, `Dent`, `Rock Chip`, `Swirl Marks`) with photo attachment placeholders and timestamped notes to protect the shop from false damage claims.
3. **Automated Ceramic & Wax Retention Reminder Engine:**
   - Ceramic coatings require a decontamination inspection wash every $6\text{ months}$; carnauba waxes and sealants fade in $60\text{ days}$.
   - Track the service countdown per vehicle license plate and provide a 1-click **Send IG DM / Telegram / SMS Reminder** trigger when the timer hits zero.
4. **Chemical & Consumable Burn-Rate Inventory:**
   - Track expensive detailing consumables (`Gyeon Mohs EVO 50ml`, `Koch-Chemie Green Star`, `XPEL Ultimate Plus PPF Roll`, `Rupes Coarse Wool Pads`, `GSM 500 Microfibers`).
   - Automatically deduct estimated $\text{ml}$ or $\text{meters}$ per completed package and trigger an Amber/Red reorder alert before stock runs dry.
5. **Technician Commission Split & Before/After Media Vault:**
   - Automatically calculate each detailer's payout per job (Base + $25\%$ to $30\%$ labor commission split) when a vehicle status moves to `Completed`.
   - Include a **Before/After Media Vault** where workers upload a 5-second transformation clip upon finishing a car, with a 1-click **Push to IG MCP Ad Queue** button.

---

## 5. Database Schema (`prisma/schema.prisma`)
Generate a complete, valid Prisma schema covering all entities:
- `Customer` (id, fullName, phone, instagramHandle, telegramUsername, acquisitionChannel, createdAt)
- `Vehicle` (id, customerId, licensePlate, make, model, year, color, paintCode, coatingType, coatingAppliedAt, nextMaintenanceDueAt)
- `Booking` (id, vehicleId, bayNumber, packageType, status, totalPrice, laborCost, chemicalCost, billableHours, technicianId, igCampaignId, scheduledAt, completedAt)
- `InspectionMarker` (id, bookingId, vehicleId, panelZone, damageType, coordinateX, coordinateY, notes, photoUrl, createdAt)
- `ChemicalInventory` (id, name, brand, category, unit, currentStock, burnRatePerJob, reorderThreshold, costPerUnit)
- `Technician` (id, name, role, commissionRate, activeBay, totalCompletedJobs)
- `IgCampaign` (id, metaCampaignId, name, creativeType, radiusKm, targetInterests, ageMin, ageMax, dailyBudget, totalSpend, leadsGenerated, bookingsAttributed, revenueAttributed, autoKillCplLimit, weatherTriggered, status)

---

## 6. Step-by-Step Execution Plan
1. **Scaffold & Theme:** Initialize the project structure, configure Tailwind CSS with the `#09090B` Zinc dark palette and `tabular-nums` monospace utilities, and create `prisma/schema.prisma`.
2. **Finance Engine & Seed Store:** Implement `src/lib/finance-engine.ts` with all mathematical formulas (CAC, ROAS, LTV, Bay Utilization, and 90-Day Forecast with confidence intervals) alongside a realistic, pre-populated mock database of luxury vehicles, active bays, chemical stocks, and Instagram campaigns.
3. **Meta Ads MCP Service:** Implement `src/services/meta-mcp.service.ts` with typed MCP tool schemas (`search_targeting_interests`, `create_ad_set`, `set_geo_radius`, `create_rule`, `toggle_campaign_status`) and interactive execution logs.
4. **App Shell & Navigation:** Build the collapsible sidebar, top status bar with live weather trigger pill, global `Cmd+K` search modal, and the 4-card KPI sparkline header.
5. **Core Operational Views:**
   - **Tab 1: Executive Overview & 90-Day Forecasting** (Interactive Ad Spend & Bay Utilization sliders + Confidence Cone Area Chart + Cohort LTV breakdown).
   - **Tab 2: IG Targeting Radar (MCP Command Center)** (Natural language prompt bar + JSON-RPC tool preview + Geo-Radius controller + Weather Promo Card + Active Reels table with Kill-Switch toggles).
   - **Tab 3: Live Bays & Digital Vehicle Walkaround** (4 Live Bay timers + interactive SVG car damage map + Before/After Media Vault).
   - **Tab 4: Chemicals, Retention CRM & Commissions** (Coating countdown table with 1-click DM reminders + Chemical burn-rate bars + Technician payout calculator).
6. **Verification:** Ensure zero TypeScript or build errors, full interactivity across all sliders, tabs, damage pins, and command bar shortcuts, and strict adherence to the Anti-AI Slop visual guidelines.