'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { YearlyForecast, ScenarioAnalysis, MonteCarloResults } from '@/lib/analysisEngine';

// Color palette
const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

// 5-Year Forecast Chart (Line Chart)
export function ForecastChart({ optimistic, realistic, pessimistic }: {
  optimistic: YearlyForecast[];
  realistic: YearlyForecast[];
  pessimistic: YearlyForecast[];
}) {
  const data = realistic.map((year, idx) => ({
    year: `Year ${year.year}`,
    optimistic: optimistic[idx].revenue,
    realistic: year.revenue,
    pessimistic: pessimistic[idx].revenue,
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">5-Year Revenue Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="year" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="optimistic" stroke={COLORS.success} strokeWidth={2} name="Optimistic" />
          <Line type="monotone" dataKey="realistic" stroke={COLORS.primary} strokeWidth={2} name="Realistic" />
          <Line type="monotone" dataKey="pessimistic" stroke={COLORS.danger} strokeWidth={2} name="Pessimistic" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Profit Margin Chart (Bar Chart)
export function ProfitMarginChart({ forecasts }: {
  forecasts: YearlyForecast[];
}) {
  const data = forecasts.map((year) => ({
    year: `Year ${year.year}`,
    revenue: year.revenue,
    expenses: year.expenses,
    profit: year.profit,
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Revenue vs Expenses vs Profit</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="year" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="revenue" fill={COLORS.success} name="Revenue" />
          <Bar dataKey="expenses" fill={COLORS.danger} name="Expenses" />
          <Bar dataKey="profit" fill={COLORS.primary} name="Profit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Risk Distribution Pie Chart
export function RiskPieChart({ riskScores }: {
  riskScores: {
    market: number;
    financial: number;
    operational: number;
    regulatory: number;
    team: number;
    esg: number;
  };
}) {
  const data = [
    { name: 'Market Risk', value: riskScores.market },
    { name: 'Financial Risk', value: riskScores.financial },
    { name: 'Operational Risk', value: riskScores.operational },
    { name: 'Regulatory Risk', value: riskScores.regulatory },
    { name: 'Team Risk', value: riskScores.team },
    { name: 'ESG Risk', value: riskScores.esg },
  ];

  const CHART_COLORS = [
    COLORS.danger,
    COLORS.warning,
    COLORS.info,
    COLORS.primary,
    COLORS.secondary,
    COLORS.success,
  ];

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Monte Carlo Distribution Chart (Bar Chart)
export function MonteCarloChart({ monteCarlo }: { monteCarlo: MonteCarloResults }) {
  // Create distribution bins for visualization
  const bins = 10;
  const range = monteCarlo.bestCase - monteCarlo.worstCase;
  const binSize = range / bins;

  const data = Array.from({ length: bins }, (_, i) => {
    const binStart = monteCarlo.worstCase + i * binSize;
    const binEnd = binStart + binSize;
    const binCenter = (binStart + binEnd) / 2;

    return {
      range: `€${(binCenter / 1000).toFixed(0)}k`,
      probability: Math.exp(-Math.pow((binCenter - monteCarlo.avgProfit) / (range / 4), 2)) * 100,
    };
  });

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Monte Carlo Simulation Results</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="range" stroke="rgba(255,255,255,0.6)" angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="rgba(255,255,255,0.6)" label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="probability" fill={COLORS.primary} name="Probability Distribution" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="text-white/60">Worst Case</p>
          <p className="font-bold text-red-400">€{monteCarlo.worstCase.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-white/60">Average</p>
          <p className="font-bold text-white">€{monteCarlo.avgProfit.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-white/60">Best Case</p>
          <p className="font-bold text-green-400">€{monteCarlo.bestCase.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// Scenario Comparison Chart
export function ScenarioChart({ scenarios }: { scenarios: ScenarioAnalysis[] }) {
  const data = scenarios.map(s => ({
    name: s.name,
    revenue: s.revenueImpact,
    profit: s.profitImpact,
    probability: s.probability * 100,
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Scenario Impact Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" label={{ value: 'Impact (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="revenue" fill={COLORS.success} name="Revenue Impact %" />
          <Bar dataKey="profit" fill={COLORS.primary} name="Profit Impact %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Customer Growth Chart
export function CustomerGrowthChart({ forecasts }: { forecasts: YearlyForecast[] }) {
  const data = forecasts.map(year => ({
    year: `Year ${year.year}`,
    customers: year.customers,
    employees: year.employees,
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Customer & Team Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="year" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="customers" stroke={COLORS.success} strokeWidth={2} name="Customers" />
          <Line type="monotone" dataKey="employees" stroke={COLORS.info} strokeWidth={2} name="Employees" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gauge Chart for Viability Score
export function ViabilityGauge({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 70) return COLORS.success;
    if (score >= 40) return COLORS.warning;
    return COLORS.danger;
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 45;
  const progress = (score / 100) * circumference;

  return (
    <div className="glass rounded-xl p-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-white">Viability Score</h3>
      <div className="relative w-40 h-40">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl font-bold" style={{ color }}>{score.toFixed(0)}</span>
            <p className="text-xs text-white/60">/ 100</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/70 text-center">
        {score >= 70 ? 'Strong viability' : score >= 40 ? 'Moderate viability' : 'Low viability'}
      </p>
    </div>
  );
}
