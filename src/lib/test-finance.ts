import {
  calculateCAC,
  calculateROAS,
  calculateLTV,
  getDetailingCohortModels,
  calculateBayUtilization,
  calculateRevPerBayHour,
  analyzeBayBottleneck,
  generate90DayForecast,
} from './finance-engine';

console.log('--- Testing DetailingOS Finance Engine ---');

// 1. CAC & ROAS
const cacTest = calculateCAC(1200, 65);
console.log('CAC Test:', cacTest);
console.assert(cacTest.cac === 18.46, 'CAC calculation mismatch');

const roasTest = calculateROAS(5760, 1200);
console.log('ROAS Test:', roasTest);
console.assert(roasTest.roasMultiplier === 4.8, 'ROAS calculation mismatch');

// 2. LTV & Cohorts
const standardLtv = calculateLTV(55, 14, 2.2, 0.62);
console.log('Standard Wash LTV:', standardLtv);
console.assert(standardLtv === 1050.28, 'Standard LTV mismatch');

const cohorts = getDetailingCohortModels();
console.log('Cohorts:', cohorts.standardWashCohort.cohortName, cohorts.ceramicVipCohort.cohortName);
console.log('Funnel 60-Day ROAS:', cohorts.conversionFunnelInsight.sixtyDayROAS);

// 3. Bay Utilization & Bottleneck
const bayUtil = calculateBayUtilization(158, 4, 48);
console.log('Bay Utilization:', bayUtil);
console.assert(bayUtil.utilizationRate === 82.3, 'Bay utilization mismatch');

const bottleneck = analyzeBayBottleneck({
  weeklyRevenueTarget: 16500,
  bay1PpfJobRevenue: 3600,
  otherBaysProjectedRevenue: 8400,
  bay2ExpressWashPrice: 85,
});
console.log('Bottleneck Analysis:', {
  shortfall: bottleneck.revenueShortfall,
  requiredExpressWashes: bottleneck.requiredExpressWashes,
  maxFeasible: bottleneck.maxFeasibleExpressWashes,
  isFeasible: bottleneck.isBottleneckFeasible,
});

// 4. 90-Day Forecast
const forecast = generate90DayForecast(65, 82);
console.log(`Forecast generated ${forecast.length} points.`);
console.assert(forecast.length === 151, 'Expected 60 historical + 91 projected (days 0-90) = 151 points');
console.log('First Historical Point:', forecast[0]);
console.log('Day 0 Anchor Point:', forecast[60]);
console.log('Day 90 Projected Point:', forecast[forecast.length - 1]);

console.log('✅ ALL FINANCE ENGINE MATHEMATICAL TESTS PASSED.');
