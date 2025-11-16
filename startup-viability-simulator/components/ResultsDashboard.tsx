'use client';

import { useState, useEffect } from 'react';
import { analyzeStartup, type AnalysisResults, type StartupData } from '@/lib/analysisEngine';
import { generatePDFReport } from '@/lib/pdfExport';
import {
  ForecastChart,
  ProfitMarginChart,
  RiskPieChart,
  MonteCarloChart,
  ScenarioChart,
  CustomerGrowthChart,
  ViabilityGauge,
} from './Charts';

interface ResultsDashboardProps {
  data: StartupData;
  onBack: () => void;
}

export default function ResultsDashboard({ data, onBack }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Run analysis
    setTimeout(() => {
      const results = analyzeStartup(data);
      setAnalysis(results);
      setIsAnalyzing(false);
    }, 2000);
  }, [data]);

  const tabs = [
    { id: 'kattava', name: 'Kattava', icon: '📊' },
    { id: 'yhteenveto', name: 'Yhteenveto', icon: '📈' },
    { id: 'simulaatio', name: 'Simulaatio', icon: '🎲' },
    { id: 'taloudellinen', name: 'Taloudellinen', icon: '💰' },
    { id: 'riskianalyysi', name: 'Riskianalyysi', icon: '⚠️' },
    { id: 'stressitesti', name: 'Stressitesti', icon: '🔥' },
    { id: 'skenaariot', name: 'Skenaariot', icon: '🔮' },
    { id: 'suositukset', name: 'Suositukset', icon: '💡' },
    { id: 'toimiala', name: 'Toimiala', icon: '🌍' },
  ];

  if (isAnalyzing || !analysis) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="glass-strong rounded-2xl p-12 text-center max-w-2xl">
          <div className="spinner mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Analysoidaan...</h2>
          <p className="text-white/70 mb-4">AI prosessoi dataasi ja luo kattavan raportin</p>
          <div className="space-y-2 text-sm text-white/50">
            <p>✓ Lasketaan taloudellisia mittareita...</p>
            <p>✓ Ajetaan Monte Carlo -simulaatiota (1000 iteraatiota)...</p>
            <p>✓ Luodaan 5 vuoden ennusteet...</p>
            <p>✓ Arvioidaan riskejä...</p>
            <p>✓ Generoidaan suositukset...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <header className="glass-strong border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="glass rounded-xl px-4 py-2 hover:bg-white/10 transition-all"
              >
                ← Takaisin
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Analyysi Valmis</h1>
                <p className="text-sm text-white/60">
                  Viability Score: {analysis.viabilityScore.toFixed(0)}/100 • {analysis.goNoGo}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`px-4 py-2 rounded-xl font-semibold ${
                  analysis.goNoGo === 'GO'
                    ? 'bg-green-500/20 text-green-400'
                    : analysis.goNoGo === 'WAIT'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {analysis.goNoGo}
              </div>
              <button
                onClick={() => generatePDFReport(analysis, data)}
                className="glass rounded-xl px-4 py-2 hover:bg-white/10 transition-all hover:shadow-glow"
              >
                📄 Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="glass border-b border-white/5 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
                  ${
                    activeTab === index
                      ? 'tab-active text-white'
                      : 'text-white/60 hover:text-white/80'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 0 && <KattavaTab analysis={analysis} data={data} />}
        {activeTab === 1 && <YhteenvetoTab analysis={analysis} />}
        {activeTab === 2 && <SimulaatioTab analysis={analysis} />}
        {activeTab === 3 && <TaloudellinenTab analysis={analysis} />}
        {activeTab === 4 && <RiskianalyysiTab analysis={analysis} />}
        {activeTab === 5 && <StressitestiTab analysis={analysis} />}
        {activeTab === 6 && <SkenaariotTab analysis={analysis} />}
        {activeTab === 7 && <SuosituksetTab analysis={analysis} />}
        {activeTab === 8 && <ToimialaTab analysis={analysis} data={data} />}
      </div>
    </div>
  );
}

// Tab 1: Kattava (Comprehensive Analysis)
function KattavaTab({ analysis, data }: { analysis: AnalysisResults; data: StartupData }) {
  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Comprehensive Business Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Viability Score"
            value={`${analysis.viabilityScore.toFixed(0)}%`}
            icon="📊"
            trend="positive"
          />
          <MetricCard
            title="Overall Risk"
            value={`${analysis.riskScores.overall.toFixed(0)}%`}
            icon="⚠️"
            trend={analysis.riskScores.overall < 50 ? 'positive' : 'negative'}
          />
          <MetricCard
            title="Decision"
            value={analysis.goNoGo}
            icon={analysis.goNoGo === 'GO' ? '✅' : analysis.goNoGo === 'WAIT' ? '⏸️' : '❌'}
            trend={analysis.goNoGo === 'GO' ? 'positive' : 'neutral'}
          />
        </div>

        <div className="prose prose-invert max-w-none">
          <h3>Business Overview</h3>
          <p className="text-white/70">
            <strong>Idea:</strong> {data.basics?.businessIdea || 'N/A'}
          </p>
          <p className="text-white/70">
            <strong>Market:</strong> {data.basics?.country || 'N/A'} - {data.basics?.industry || 'N/A'}
          </p>

          <h3 className="mt-6">Key Findings</h3>
          <ul className="text-white/70">
            <li>Current MRR: €{analysis.financialMetrics.currentMRR.toLocaleString()}</li>
            <li>Projected ARR: €{analysis.financialMetrics.projectedARR.toLocaleString()}</li>
            <li>CLV:CAC Ratio: {analysis.financialMetrics.clvCacRatio.toFixed(2)}</li>
            <li>Runway: {analysis.financialMetrics.runway.toFixed(1)} months</li>
            <li>Probability of Loss: {(analysis.monteCarlo.probabilityOfLoss * 100).toFixed(1)}%</li>
          </ul>

          <h3 className="mt-6">Executive Summary</h3>
          <p className="text-white/70">
            Based on comprehensive analysis of {Object.keys(data).length} data categories including financial metrics,
            market analysis, team assessment, and risk evaluation, this business shows a viability score of{' '}
            <strong>{analysis.viabilityScore.toFixed(0)}%</strong>. Our recommendation is{' '}
            <strong>{analysis.goNoGo}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

// Tab 2: Yhteenveto (Executive Summary)
function YhteenvetoTab({ analysis }: { analysis: AnalysisResults }) {
  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Executive Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="MRR" value={`€${analysis.financialMetrics.currentMRR.toLocaleString()}`} />
          <SummaryCard label="ARR" value={`€${analysis.financialMetrics.projectedARR.toLocaleString()}`} />
          <SummaryCard label="Gross Margin" value={`${analysis.financialMetrics.grossMargin.toFixed(1)}%`} />
          <SummaryCard label="Net Margin" value={`${analysis.financialMetrics.netMargin.toFixed(1)}%`} />
          <SummaryCard label="CLV:CAC" value={analysis.financialMetrics.clvCacRatio.toFixed(2)} />
          <SummaryCard label="Runway" value={`${analysis.financialMetrics.runway.toFixed(0)}mo`} />
          <SummaryCard label="Break-even" value={`€${analysis.financialMetrics.breakEvenRevenue.toLocaleString()}`} />
          <SummaryCard label="Risk Score" value={`${analysis.riskScores.overall.toFixed(0)}%`} />
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Top Recommendations</h3>
          <div className="space-y-3">
            {analysis.recommendations.slice(0, 3).map((rec, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-white">{rec.title}</p>
                  <p className="text-sm text-white/60">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab 3: Simulaatio (Simulations)
function SimulaatioTab({ analysis }: { analysis: AnalysisResults }) {
  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonteCarloChart monteCarlo={analysis.monteCarlo} />
        <ViabilityGauge score={analysis.viabilityScore} />
      </div>

      <ForecastChart
        optimistic={analysis.forecasts.optimistic}
        realistic={analysis.forecasts.realistic}
        pessimistic={analysis.forecasts.pessimistic}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitMarginChart forecasts={analysis.forecasts.realistic} />
        <CustomerGrowthChart forecasts={analysis.forecasts.realistic} />
      </div>

      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Monte Carlo Simulation & Forecasts</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Monte Carlo Results (1000 iterations)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Average Profit (12mo)</span>
                <span className="font-semibold">€{analysis.monteCarlo.avgProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Best Case (95th %ile)</span>
                <span className="font-semibold text-green-400">€{analysis.monteCarlo.bestCase.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Worst Case (5th %ile)</span>
                <span className="font-semibold text-red-400">€{analysis.monteCarlo.worstCase.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Probability of Loss</span>
                <span className="font-semibold">{(analysis.monteCarlo.probabilityOfLoss * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Confidence Intervals</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-white/60 mb-1">90% Confidence</p>
                <div className="flex justify-between text-sm">
                  <span>€{analysis.monteCarlo.confidence90.min.toLocaleString()}</span>
                  <span>to</span>
                  <span>€{analysis.monteCarlo.confidence90.max.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">95% Confidence</p>
                <div className="flex justify-between text-sm">
                  <span>€{analysis.monteCarlo.confidence95.min.toLocaleString()}</span>
                  <span>to</span>
                  <span>€{analysis.monteCarlo.confidence95.max.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">99% Confidence</p>
                <div className="flex justify-between text-sm">
                  <span>€{analysis.monteCarlo.confidence99.min.toLocaleString()}</span>
                  <span>to</span>
                  <span>€{analysis.monteCarlo.confidence99.max.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">5-Year Forecast Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2">Year</th>
                  <th className="text-right py-2">Optimistic</th>
                  <th className="text-right py-2">Realistic</th>
                  <th className="text-right py-2">Pessimistic</th>
                </tr>
              </thead>
              <tbody>
                {analysis.forecasts.realistic.map((year, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="py-2">{year.year}</td>
                    <td className="text-right text-green-400">
                      €{analysis.forecasts.optimistic[idx].revenue.toLocaleString()}
                    </td>
                    <td className="text-right">€{year.revenue.toLocaleString()}</td>
                    <td className="text-right text-red-400">
                      €{analysis.forecasts.pessimistic[idx].revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab 4: Taloudellinen (Financial Metrics)
function TaloudellinenTab({ analysis }: { analysis: AnalysisResults }) {
  const metrics = analysis.financialMetrics;

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Financial Metrics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard title="Current MRR" value={`€${metrics.currentMRR.toLocaleString()}`} icon="💰" />
          <MetricCard title="Projected ARR" value={`€${metrics.projectedARR.toLocaleString()}`} icon="📈" />
          <MetricCard title="CAC" value={`€${metrics.cac.toLocaleString()}`} icon="👥" />
          <MetricCard title="CLV" value={`€${metrics.clv.toLocaleString()}`} icon="💎" />
          <MetricCard title="CLV:CAC Ratio" value={metrics.clvCacRatio.toFixed(2)} icon="⚖️" />
          <MetricCard title="Gross Margin" value={`${metrics.grossMargin.toFixed(1)}%`} icon="📊" />
          <MetricCard title="Net Margin" value={`${metrics.netMargin.toFixed(1)}%`} icon="💹" />
          <MetricCard title="Monthly Burn" value={`€${metrics.monthlyBurn.toLocaleString()}`} icon="🔥" />
          <MetricCard title="Runway" value={`${metrics.runway.toFixed(1)} months`} icon="⏱️" />
          <MetricCard title="Break-even Revenue" value={`€${metrics.breakEvenRevenue.toLocaleString()}`} icon="🎯" />
          <MetricCard title="Months to Break-even" value={metrics.monthsToBreakEven.toFixed(0)} icon="📅" />
          <MetricCard title="ROI" value={`${metrics.roi.toFixed(1)}%`} icon="💵" />
          <MetricCard title="IRR" value={`${metrics.irr.toFixed(1)}%`} icon="📈" />
          <MetricCard title="Payback Period" value={`${metrics.paybackPeriod.toFixed(1)} years`} icon="⏳" />
          <MetricCard title="TAM Penetration" value={`${metrics.tamPercentage.toFixed(3)}%`} icon="🌍" />
          <MetricCard title="YoY Growth" value={`${metrics.yoyGrowth.toFixed(0)}%`} icon="🚀" />
        </div>
      </div>
    </div>
  );
}

// Tab 5: Riskianalyysi (Risk Analysis)
function RiskianalyysiTab({ analysis }: { analysis: AnalysisResults }) {
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400 bg-green-500/20';
    if (score < 60) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="space-y-6">
      <RiskPieChart riskScores={analysis.riskScores} />

      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Risk Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Overall Risk', value: analysis.riskScores.overall },
            { label: 'Market Risk', value: analysis.riskScores.market },
            { label: 'Financial Risk', value: analysis.riskScores.financial },
            { label: 'Operational Risk', value: analysis.riskScores.operational },
            { label: 'Regulatory Risk', value: analysis.riskScores.regulatory },
            { label: 'Team Risk', value: analysis.riskScores.team },
            { label: 'ESG Risk', value: analysis.riskScores.esg },
          ].map((risk, idx) => (
            <div key={idx} className="glass rounded-xl p-4">
              <p className="text-sm text-white/60 mb-2">{risk.label}</p>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getRiskColor(risk.value)}`}>
                  {risk.value.toFixed(0)}%
                </span>
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getRiskColor(risk.value)}`}
                    style={{ width: `${risk.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Identified Risk Factors</h3>
          <div className="space-y-4">
            {analysis.riskScores.riskFactors.map((factor, idx) => (
              <div key={idx} className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{factor.description}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      factor.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : factor.severity === 'high'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {factor.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  <strong>Mitigation:</strong> {factor.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab 6: Stressitesti (Stress Test)
function StressitestiTab({ analysis }: { analysis: AnalysisResults }) {
  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Stress Test</h2>

        <div className="glass rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Worst-Case Scenarios</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <h4 className="font-semibold text-red-400 mb-2">5th Percentile Outcome</h4>
              <p className="text-sm text-white/70 mb-2">
                Based on Monte Carlo simulation, there's a 5% chance your 12-month profit could be as low as:
              </p>
              <p className="text-3xl font-bold text-red-400">€{analysis.monteCarlo.worstCase.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <h4 className="font-semibold text-orange-400 mb-2">Revenue Drop Scenario (-30%)</h4>
              <p className="text-sm text-white/70">
                If revenue drops by 30% due to market conditions, your financial position would be:
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p>Monthly Loss: €{(analysis.financialMetrics.monthlyBurn * 0.7).toLocaleString()}</p>
                <p>Adjusted Runway: {(analysis.financialMetrics.runway * 0.7).toFixed(1)} months</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <h4 className="font-semibold text-yellow-400 mb-2">Cost Increase Scenario (+20%)</h4>
              <p className="text-sm text-white/70">
                If operating costs increase by 20% (e.g., inflation, hiring):
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p>Net Margin Impact: {(analysis.financialMetrics.netMargin - 20).toFixed(1)}%</p>
                <p>Break-even Delay: +{(analysis.financialMetrics.monthsToBreakEven * 0.2).toFixed(0)} months</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Survival Recommendations</h3>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>Maintain {(analysis.financialMetrics.runway * 1.5).toFixed(0)} months runway as safety buffer</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>Diversify revenue streams to reduce dependency on single source</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>Keep variable costs below 40% of revenue for flexibility</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>Have contingency plan if top 3 customers churn simultaneously</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Tab 7: Skenaariot (Scenarios)
function SkenaariotTab({ analysis }: { analysis: AnalysisResults }) {
  return (
    <div className="space-y-6">
      <ScenarioChart scenarios={analysis.forecasts.scenarios} />

      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Scenario Analysis</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {analysis.forecasts.scenarios.map((scenario, idx) => (
            <div key={idx} className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">{scenario.name}</h3>
              <div className="mb-4">
                <span className="text-sm text-white/60">Probability: </span>
                <span className="font-semibold">{(scenario.probability * 100).toFixed(0)}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Revenue Impact</span>
                  <span className={scenario.revenueImpact > 0 ? 'text-green-400' : 'text-red-400'}>
                    {scenario.revenueImpact > 0 ? '+' : ''}
                    {scenario.revenueImpact}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Profit Impact</span>
                  <span className={scenario.profitImpact > 0 ? 'text-green-400' : 'text-red-400'}>
                    {scenario.profitImpact > 0 ? '+' : ''}
                    {scenario.profitImpact}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-4">{scenario.description}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Weighted Average Outcome</h3>
          <p className="text-white/70 mb-4">
            Considering all scenarios and their probabilities, the expected outcome is:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-xl">
              <p className="text-sm text-white/60 mb-1">Expected Revenue Growth</p>
              <p className="text-2xl font-bold">
                {analysis.forecasts.scenarios
                  .reduce((acc, s) => acc + s.revenueImpact * s.probability, 0)
                  .toFixed(1)}
                %
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-xl">
              <p className="text-sm text-white/60 mb-1">Expected Profit Growth</p>
              <p className="text-2xl font-bold">
                {analysis.forecasts.scenarios
                  .reduce((acc, s) => acc + s.profitImpact * s.probability, 0)
                  .toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab 8: Suositukset (Recommendations)
function SuosituksetTab({ analysis }: { analysis: AnalysisResults }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Actionable Recommendations</h2>

        <div className="space-y-4">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className={`p-6 rounded-xl border ${getPriorityColor(rec.priority)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h3 className="text-xl font-semibold">{rec.title}</h3>
                    <p className="text-sm opacity-60">{rec.category}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold">{rec.priority.toUpperCase()}</span>
              </div>
              <p className="text-white/80 mb-3">{rec.description}</p>
              <div className="flex items-center space-x-2 text-sm">
                <span className="opacity-60">Impact:</span>
                <span className="font-semibold">{rec.impact}</span>
              </div>
            </div>
          ))}
        </div>

        {analysis.recommendations.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <span className="text-6xl mb-4 block">🎉</span>
            <h3 className="text-2xl font-bold mb-2">Excellent!</h3>
            <p className="text-white/60">No critical recommendations at this time. Keep up the good work!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab 9: Toimiala (Industry Benchmarks)
function ToimialaTab({ analysis, data }: { analysis: AnalysisResults; data: StartupData }) {
  const industry = data.basics?.industry || 'SaaS';

  // Industry benchmarks (mock data - would come from database in production)
  const benchmarks = {
    clvCacRatio: 3.0,
    grossMargin: 75,
    netMargin: 20,
    yoyGrowth: 100,
    churnRate: 5,
  };

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Industry Benchmarks: {industry}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BenchmarkCard
            metric="CLV:CAC Ratio"
            yourValue={analysis.financialMetrics.clvCacRatio}
            benchmark={benchmarks.clvCacRatio}
            format={(v) => v.toFixed(2)}
          />
          <BenchmarkCard
            metric="Gross Margin"
            yourValue={analysis.financialMetrics.grossMargin}
            benchmark={benchmarks.grossMargin}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <BenchmarkCard
            metric="Net Margin"
            yourValue={analysis.financialMetrics.netMargin}
            benchmark={benchmarks.netMargin}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <BenchmarkCard
            metric="YoY Growth"
            yourValue={analysis.financialMetrics.yoyGrowth}
            benchmark={benchmarks.yoyGrowth}
            format={(v) => `${v.toFixed(0)}%`}
          />
        </div>

        <div className="glass rounded-xl p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Industry Insights</h3>
          <p className="text-white/70">
            Based on analysis of {industry} companies in similar markets, here's how you compare:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>• Top-quartile companies maintain CLV:CAC ratios above 5:1</li>
            <li>• Median gross margins for {industry} are around 75-80%</li>
            <li>• High-growth startups typically achieve 100-200% YoY in early stages</li>
            <li>• Healthy monthly churn rates are below 5% for B2B SaaS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: string;
  trend?: 'positive' | 'negative' | 'neutral';
}) {
  return (
    <div className="glass rounded-xl p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-sm">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${trend === 'positive' ? 'text-green-400' : trend === 'negative' ? 'text-red-400' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function BenchmarkCard({
  metric,
  yourValue,
  benchmark,
  format,
}: {
  metric: string;
  yourValue: number;
  benchmark: number;
  format: (v: number) => string;
}) {
  const percentage = ((yourValue / benchmark) * 100).toFixed(0);
  const isGood = yourValue >= benchmark;

  return (
    <div className="glass rounded-xl p-6">
      <h4 className="font-semibold mb-4">{metric}</h4>
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-sm text-white/60">Your Value</p>
          <p className="text-2xl font-bold">{format(yourValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">Industry Avg</p>
          <p className="text-xl font-semibold">{format(benchmark)}</p>
        </div>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${isGood ? 'bg-green-500' : 'bg-yellow-500'}`}
          style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
        ></div>
      </div>
      <p className="text-xs text-white/50 mt-2">
        You're at {percentage}% of industry average {isGood ? '✓' : ''}
      </p>
    </div>
  );
}
