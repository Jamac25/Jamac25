// Comprehensive Analysis Engine for Startup Viability Simulator

export interface StartupData {
  basics?: any;
  market?: any;
  financials?: any;
  team?: any;
  operations?: any;
  risks?: any;
  growth?: any;
}

export interface AnalysisResults {
  financialMetrics: FinancialMetrics;
  monteCarlo: MonteCarloResults;
  forecasts: ForecastResults;
  riskScores: RiskScores;
  recommendations: Recommendation[];
  viabilityScore: number;
  goNoGo: 'GO' | 'NO-GO' | 'WAIT';
}

export interface FinancialMetrics {
  // Revenue metrics
  currentMRR: number;
  projectedARR: number;

  // Unit economics
  cac: number;
  clv: number;
  clvCacRatio: number;

  // Profitability
  grossMargin: number;
  netMargin: number;
  breakEvenRevenue: number;
  monthsToBreakEven: number;

  // Cash flow
  monthlyBurn: number;
  runway: number;

  // Growth
  momGrowth: number;
  yoyGrowth: number;

  // Market
  tamPercentage: number;
  samPercentage: number;

  // Investment
  roi: number;
  irr: number;
  paybackPeriod: number;
}

export interface MonteCarloResults {
  iterations: number;
  avgProfit: number;
  bestCase: number;
  worstCase: number;
  probabilityOfLoss: number;
  confidence90: { min: number; max: number };
  confidence95: { min: number; max: number };
  confidence99: { min: number; max: number };
}

export interface ForecastResults {
  optimistic: YearlyForecast[];
  realistic: YearlyForecast[];
  pessimistic: YearlyForecast[];
  scenarios: ScenarioAnalysis[];
}

export interface YearlyForecast {
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  cumulativeProfit: number;
  customers: number;
  employees: number;
}

export interface ScenarioAnalysis {
  name: string;
  probability: number;
  revenueImpact: number;
  profitImpact: number;
  description: string;
}

export interface RiskScores {
  overall: number;
  market: number;
  financial: number;
  operational: number;
  regulatory: number;
  team: number;
  esg: number;
  riskFactors: RiskFactor[];
}

export interface RiskFactor {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
}

export interface Recommendation {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
}

// Main Analysis Function
export function analyzeStartup(data: StartupData): AnalysisResults {
  const financialMetrics = calculateFinancialMetrics(data);
  const monteCarlo = runMonteCarloSimulation(data, 1000);
  const forecasts = generateForecasts(data);
  const riskScores = calculateRiskScores(data);
  const recommendations = generateRecommendations(data, financialMetrics, riskScores);
  const viabilityScore = calculateViabilityScore(financialMetrics, riskScores);
  const goNoGo = determineGoNoGo(viabilityScore, riskScores);

  return {
    financialMetrics,
    monteCarlo,
    forecasts,
    riskScores,
    recommendations,
    viabilityScore,
    goNoGo,
  };
}

// Financial Metrics Calculator
function calculateFinancialMetrics(data: StartupData): FinancialMetrics {
  const financials = data.financials || {};

  // Extract financial data
  const currentRevenue = parseFinancialValue(financials.currentRevenue) || 0;
  const pricing = parseFinancialValue(financials.pricing) || 100;
  const monthlyExpenses = parseFinancialValue(financials.monthlyExpenses) || 0;
  const cac = parseFinancialValue(financials.cac) || pricing * 0.3;
  const clv = parseFinancialValue(financials.clv) || pricing * 12;
  const fundingRaised = parseFinancialValue(financials.fundingRaised) || 0;

  // Market data
  const marketSize = parseFinancialValue(data.market?.marketSize) || 1000000000;

  // Calculate metrics
  const currentMRR = currentRevenue;
  const projectedARR = currentMRR * 12;
  const clvCacRatio = cac > 0 ? clv / cac : 0;

  // Estimate costs (if not provided, use industry averages)
  const costOfGoodsSold = currentRevenue * 0.3; // 30% COGS
  const grossMargin = currentRevenue > 0 ? ((currentRevenue - costOfGoodsSold) / currentRevenue) * 100 : 70;
  const netProfit = currentRevenue - monthlyExpenses;
  const netMargin = currentRevenue > 0 ? (netProfit / currentRevenue) * 100 : -100;

  // Break-even analysis
  const fixedCosts = monthlyExpenses * 0.7; // Assume 70% fixed
  const variableCostPerUnit = pricing * 0.3;
  const contributionMargin = pricing - variableCostPerUnit;
  const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
  const breakEvenRevenue = breakEvenUnits * pricing;
  const monthsToBreakEven = currentRevenue > 0 && netProfit > 0
    ? 0
    : currentRevenue > 0
      ? Math.abs(fundingRaised / (monthlyExpenses - currentRevenue))
      : fundingRaised > 0 ? fundingRaised / monthlyExpenses : 999;

  // Cash flow
  const monthlyBurn = currentRevenue - monthlyExpenses;
  const runway = monthlyBurn < 0 && fundingRaised > 0
    ? fundingRaised / Math.abs(monthlyBurn)
    : monthlyBurn >= 0 ? 999 : 0;

  // Growth (estimate if not provided)
  const momGrowth = 15; // Default 15% MoM
  const yoyGrowth = 200; // Default 200% YoY for early stage

  // Market penetration
  const tamPercentage = (projectedARR / marketSize) * 100;
  const samPercentage = (projectedARR / (marketSize * 0.1)) * 100; // SAM ~ 10% of TAM

  // Investment metrics
  const roi = fundingRaised > 0 ? (projectedARR / fundingRaised) * 100 : 0;
  const irr = calculateIRR([-fundingRaised, netProfit * 12, netProfit * 12 * 1.5, netProfit * 12 * 2]);
  const paybackPeriod = fundingRaised > 0 && netProfit > 0
    ? fundingRaised / (netProfit * 12)
    : 999;

  return {
    currentMRR,
    projectedARR,
    cac,
    clv,
    clvCacRatio,
    grossMargin,
    netMargin,
    breakEvenRevenue,
    monthsToBreakEven,
    monthlyBurn,
    runway,
    momGrowth,
    yoyGrowth,
    tamPercentage,
    samPercentage,
    roi,
    irr,
    paybackPeriod,
  };
}

// Monte Carlo Simulation (1000 iterations)
function runMonteCarloSimulation(data: StartupData, iterations: number): MonteCarloResults {
  const results: number[] = [];
  const financials = data.financials || {};

  const baseRevenue = parseFinancialValue(financials.currentRevenue) || 10000;
  const baseExpenses = parseFinancialValue(financials.monthlyExpenses) || 8000;

  for (let i = 0; i < iterations; i++) {
    // Random variables with normal distribution
    const revenueMultiplier = normalRandom(1, 0.3); // μ=1, σ=0.3
    const expenseMultiplier = normalRandom(1, 0.15); // μ=1, σ=0.15
    const growthRate = normalRandom(0.15, 0.1); // 15% ± 10%

    // Simulate 12 months
    let revenue = baseRevenue * revenueMultiplier;
    let expenses = baseExpenses * expenseMultiplier;
    let totalProfit = 0;

    for (let month = 0; month < 12; month++) {
      revenue *= (1 + growthRate);
      expenses *= 1.05; // 5% expense growth
      totalProfit += (revenue - expenses);
    }

    results.push(totalProfit);
  }

  // Sort results for percentile calculations
  results.sort((a, b) => a - b);

  const avgProfit = results.reduce((a, b) => a + b, 0) / results.length;
  const bestCase = results[Math.floor(results.length * 0.95)];
  const worstCase = results[Math.floor(results.length * 0.05)];
  const probabilityOfLoss = results.filter(r => r < 0).length / results.length;

  return {
    iterations,
    avgProfit,
    bestCase,
    worstCase,
    probabilityOfLoss,
    confidence90: {
      min: results[Math.floor(results.length * 0.05)],
      max: results[Math.floor(results.length * 0.95)],
    },
    confidence95: {
      min: results[Math.floor(results.length * 0.025)],
      max: results[Math.floor(results.length * 0.975)],
    },
    confidence99: {
      min: results[Math.floor(results.length * 0.005)],
      max: results[Math.floor(results.length * 0.995)],
    },
  };
}

// 5-Year Forecasts (3 scenarios)
function generateForecasts(data: StartupData): ForecastResults {
  const financials = data.financials || {};
  const baseRevenue = parseFinancialValue(financials.currentRevenue) || 10000;
  const baseExpenses = parseFinancialValue(financials.monthlyExpenses) || 8000;
  const baseCustomers = 100;
  const baseEmployees = parseFloat(data.team?.teamSize) || 3;

  const scenarios = {
    optimistic: { revenueGrowth: 0.20, expenseGrowth: 0.03 },
    realistic: { revenueGrowth: 0.12, expenseGrowth: 0.05 },
    pessimistic: { revenueGrowth: 0.05, expenseGrowth: 0.08 },
  };

  const generateYearlyForecast = (scenario: { revenueGrowth: number; expenseGrowth: number }): YearlyForecast[] => {
    const forecast: YearlyForecast[] = [];
    let revenue = baseRevenue * 12;
    let expenses = baseExpenses * 12;
    let customers = baseCustomers;
    let employees = baseEmployees;
    let cumulativeProfit = 0;

    for (let year = 1; year <= 5; year++) {
      revenue *= (1 + scenario.revenueGrowth);
      expenses *= (1 + scenario.expenseGrowth);
      customers *= (1 + scenario.revenueGrowth * 0.8);
      employees = Math.ceil(employees * (1 + scenario.revenueGrowth * 0.5));

      const profit = revenue - expenses;
      cumulativeProfit += profit;

      forecast.push({
        year,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        profit: Math.round(profit),
        cumulativeProfit: Math.round(cumulativeProfit),
        customers: Math.round(customers),
        employees,
      });
    }

    return forecast;
  };

  // Scenario analysis
  const scenarioAnalysis: ScenarioAnalysis[] = [
    {
      name: 'Market Boom',
      probability: 0.3,
      revenueImpact: 15,
      profitImpact: 20,
      description: 'Strong market growth, high customer adoption',
    },
    {
      name: 'Stable Growth',
      probability: 0.5,
      revenueImpact: 8,
      profitImpact: 10,
      description: 'Normal market conditions, steady progress',
    },
    {
      name: 'Recession',
      probability: 0.2,
      revenueImpact: -5,
      profitImpact: -10,
      description: 'Economic downturn, reduced spending',
    },
  ];

  return {
    optimistic: generateYearlyForecast(scenarios.optimistic),
    realistic: generateYearlyForecast(scenarios.realistic),
    pessimistic: generateYearlyForecast(scenarios.pessimistic),
    scenarios: scenarioAnalysis,
  };
}

// Risk Scoring
function calculateRiskScores(data: StartupData): RiskScores {
  const riskFactors: RiskFactor[] = [];

  // Market risk
  const marketRisk = assessMarketRisk(data, riskFactors);

  // Financial risk
  const financialRisk = assessFinancialRisk(data, riskFactors);

  // Operational risk
  const operationalRisk = assessOperationalRisk(data, riskFactors);

  // Regulatory risk
  const regulatoryRisk = assessRegulatoryRisk(data, riskFactors);

  // Team risk
  const teamRisk = assessTeamRisk(data, riskFactors);

  // ESG risk
  const esgRisk = assessESGRisk(data, riskFactors);

  const overall = (marketRisk + financialRisk + operationalRisk + regulatoryRisk + teamRisk + esgRisk) / 6;

  return {
    overall,
    market: marketRisk,
    financial: financialRisk,
    operational: operationalRisk,
    regulatory: regulatoryRisk,
    team: teamRisk,
    esg: esgRisk,
    riskFactors,
  };
}

function assessMarketRisk(data: StartupData, riskFactors: RiskFactor[]): number {
  let score = 50; // Baseline

  const competitors = data.market?.competitors || '';
  if (competitors.toLowerCase().includes('many') || competitors.toLowerCase().includes('lots')) {
    score += 20;
    riskFactors.push({
      category: 'Market',
      severity: 'high',
      description: 'High competition in the market',
      mitigation: 'Focus on differentiation and unique value proposition',
    });
  }

  return Math.min(100, score);
}

function assessFinancialRisk(data: StartupData, riskFactors: RiskFactor[]): number {
  let score = 30;

  const revenue = parseFinancialValue(data.financials?.currentRevenue) || 0;
  if (revenue < 1000) {
    score += 30;
    riskFactors.push({
      category: 'Financial',
      severity: 'high',
      description: 'Very low or no revenue',
      mitigation: 'Focus on customer acquisition and revenue generation',
    });
  }

  return Math.min(100, score);
}

function assessOperationalRisk(data: StartupData, riskFactors: RiskFactor[]): number {
  return 40; // Default moderate risk
}

function assessRegulatoryRisk(data: StartupData, riskFactors: RiskFactor[]): number {
  const industry = data.basics?.industry || '';
  if (industry.toLowerCase().includes('fintech') || industry.toLowerCase().includes('health')) {
    riskFactors.push({
      category: 'Regulatory',
      severity: 'high',
      description: 'Highly regulated industry',
      mitigation: 'Ensure compliance with all regulations and obtain necessary licenses',
    });
    return 70;
  }
  return 30;
}

function assessTeamRisk(data: StartupData, riskFactors: RiskFactor[]): number {
  const teamSize = parseFloat(data.team?.teamSize) || 1;
  if (teamSize < 2) {
    riskFactors.push({
      category: 'Team',
      severity: 'medium',
      description: 'Solo founder - high dependency on single person',
      mitigation: 'Build a co-founding team or advisory board',
    });
    return 60;
  }
  return 30;
}

function assessESGRisk(data: StartupData, riskFactors: RiskFactor[]): number {
  return 25; // Default low ESG risk
}

// Recommendations Generator
function generateRecommendations(
  data: StartupData,
  metrics: FinancialMetrics,
  risks: RiskScores
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Financial recommendations
  if (metrics.clvCacRatio < 3) {
    recommendations.push({
      category: 'Financial',
      priority: 'critical',
      title: 'Improve Unit Economics',
      description: `Your CLV:CAC ratio is ${metrics.clvCacRatio.toFixed(2)}, which is below the healthy threshold of 3:1. You need to either increase customer lifetime value or reduce acquisition costs.`,
      impact: 'Critical for sustainable growth',
    });
  }

  if (metrics.runway < 6) {
    recommendations.push({
      category: 'Financial',
      priority: 'critical',
      title: 'Urgent: Extend Runway',
      description: `You have only ${metrics.runway.toFixed(1)} months of runway. Start fundraising immediately or reduce burn rate.`,
      impact: 'Survival-critical',
    });
  }

  if (metrics.monthsToBreakEven > 24) {
    recommendations.push({
      category: 'Financial',
      priority: 'high',
      title: 'Accelerate Path to Profitability',
      description: `Your estimated time to break-even is ${metrics.monthsToBreakEven.toFixed(0)} months. Focus on revenue growth and cost optimization.`,
      impact: 'Important for investor confidence',
    });
  }

  // Market recommendations
  if (risks.market > 60) {
    recommendations.push({
      category: 'Market',
      priority: 'high',
      title: 'Strengthen Competitive Position',
      description: 'High market risk detected. Focus on unique differentiation and building defensible moats.',
      impact: 'Critical for long-term success',
    });
  }

  // Team recommendations
  if (risks.team > 50) {
    recommendations.push({
      category: 'Team',
      priority: 'high',
      title: 'Expand Core Team',
      description: 'Consider bringing on co-founders or key hires to reduce dependency risk.',
      impact: 'Reduces operational risk',
    });
  }

  // Growth recommendations
  if (metrics.tamPercentage < 0.01) {
    recommendations.push({
      category: 'Growth',
      priority: 'medium',
      title: 'Scale Marketing Efforts',
      description: `You're capturing only ${metrics.tamPercentage.toFixed(4)}% of TAM. Significant growth opportunity exists.`,
      impact: 'High growth potential',
    });
  }

  return recommendations;
}

// Viability Score (0-100)
function calculateViabilityScore(metrics: FinancialMetrics, risks: RiskScores): number {
  let score = 50; // Baseline

  // Financial health (30 points)
  if (metrics.clvCacRatio > 3) score += 10;
  if (metrics.netMargin > 0) score += 10;
  if (metrics.runway > 12) score += 10;

  // Market position (20 points)
  if (metrics.tamPercentage > 0.1) score += 10;
  if (metrics.yoyGrowth > 100) score += 10;

  // Risk adjustment (-30 points)
  score -= (risks.overall / 100) * 30;

  return Math.max(0, Math.min(100, score));
}

// Go/No-Go Decision
function determineGoNoGo(viabilityScore: number, risks: RiskScores): 'GO' | 'NO-GO' | 'WAIT' {
  if (viabilityScore >= 70 && risks.overall < 60) return 'GO';
  if (viabilityScore < 40 || risks.overall > 80) return 'NO-GO';
  return 'WAIT';
}

// Helper Functions
function parseFinancialValue(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;

  const cleaned = value.replace(/[€$,\s]/g, '');
  const multiplier = value.toLowerCase().includes('million') ? 1000000 :
                     value.toLowerCase().includes('billion') ? 1000000000 : 1;

  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number * multiplier;
}

function normalRandom(mean: number, stdDev: number): number {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

function calculateIRR(cashFlows: number[]): number {
  // Simplified IRR calculation (Newton's method)
  let rate = 0.1;
  for (let i = 0; i < 20; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      dnpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(npv) < 0.01) break;
    rate = rate - npv / dnpv;
  }
  return rate * 100;
}
