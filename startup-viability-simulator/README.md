# 🚀 Startup Viability Simulator

**AI-Powered Business Analysis for African & Global Markets**

A comprehensive startup viability analysis tool that uses artificial intelligence to interview entrepreneurs, collect business data across 7 key categories, and generate investor-grade reports with financial forecasts, risk assessments, and actionable recommendations.

---

## ✨ Key Features

### 🤖 **AI-Powered Interview**
- Intelligent conversational data collection with 100+ context-aware questions
- Dynamic follow-up questions until sufficient data is collected
- Natural language data extraction and validation
- 7 categories: Basics, Market, Financials, Team, Operations, Risks, Growth

### 📊 **Comprehensive Analysis**
- **16+ Financial Metrics**: MRR, ARR, CAC, CLV, margins, burn rate, runway, ROI, IRR
- **Monte Carlo Simulation**: 1,000 iterations for probabilistic forecasting
- **5-Year Forecasts**: Optimistic, realistic, and pessimistic scenarios
- **Risk Scoring**: 7 risk categories with mitigation strategies
- **Go/No-Go Decision**: Automated viability assessment (0-100 score)

### 📈 **Interactive Charts**
- 7 chart types: Forecasts, Profit Margins, Risk Distribution, Monte Carlo, Scenarios, Growth, Viability Gauge
- Real-time responsive visualizations using Recharts
- Export-ready graphics

### 📄 **PDF Export**
- One-click professional report generation
- Multi-page formatted PDFs with all analysis
- Investor-grade documentation

### 🎨 **Premium UI**
- Mac-level design with glassmorphism effects
- Dark mode with animated gradients
- Fully responsive (desktop, tablet, mobile)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📖 How It Works

1. **AI Interview** (5-15 min) - Answer questions across 7 business categories
2. **Automatic Analysis** (~2 sec) - AI processes data and runs simulations
3. **Results Dashboard** - View analysis across 9 specialized tabs
4. **Export PDF** - Download professional report

---

## 📊 What Gets Analyzed

### Financial Metrics
- Revenue: MRR, ARR, Growth rates
- Unit Economics: CAC, CLV, CLV:CAC ratio
- Profitability: Gross/Net margins, Break-even
- Cash Flow: Burn rate, Runway
- Investment: ROI, IRR, Payback period
- Market: TAM%, SAM%

### Monte Carlo Simulation
- 1,000 iterations with probabilistic modeling
- Confidence intervals: 90%, 95%, 99%
- Best/worst case scenarios
- Probability of loss calculation

### Risk Assessment
- Market, Financial, Operational, Regulatory, Team, ESG, Overall
- Risk factors identification with mitigation strategies

---

## 🎯 9-Tab Results Dashboard

| Tab | Content |
|-----|---------|
| 📊 Kattava | Comprehensive overview |
| 📈 Yhteenveto | Key metrics snapshot |
| 🎲 Simulaatio | Monte Carlo & forecasts with charts |
| 💰 Taloudellinen | All 16 financial metrics |
| ⚠️ Riskianalyysi | Risk breakdown with pie chart |
| 🔥 Stressitesti | Worst-case scenarios |
| 🔮 Skenaariot | Market scenarios with charts |
| 💡 Suositukset | Priority-based recommendations |
| 🌍 Toimiala | Industry benchmarks |

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16, React 18, TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **Charts**: Recharts
- **PDF**: jsPDF + html2canvas
- **Storage**: localStorage (client-side)

---

## 📦 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Your app will be live in minutes with a public URL!

---

## 🌍 Built for African Markets

Specifically designed for African and emerging markets:
- Accounts for local market conditions
- Addresses regulatory complexity
- Evaluates currency and political risks
- Tailored for growth-stage startups

---

## 🔧 Project Structure

```
startup-viability-simulator/
├── app/
│   ├── api/chat/          # AI interview endpoint
│   ├── page.tsx           # Main entry point
│   └── globals.css        # Premium styles
├── components/
│   ├── InterviewWizard.tsx    # Main flow
│   ├── ChatInterface.tsx      # AI chat UI
│   ├── ResultsDashboard.tsx   # 9-tab results
│   ├── Charts.tsx             # 7 chart components
│   └── ProgressTracker.tsx    # Progress UI
├── lib/
│   ├── analysisEngine.ts  # Analysis logic
│   └── pdfExport.ts       # PDF generation
└── README.md
```

---

## 📝 License

MIT License - Free for commercial and personal use

---

**Made with 💜 for African & Global Startups**
