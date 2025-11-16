'use client';

import { useState } from 'react';
import ChatInterface from './ChatInterface';
import ProgressTracker from './ProgressTracker';
import ResultsDashboard from './ResultsDashboard';

interface Category {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
}

export default function InterviewWizard() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [allCollectedData, setAllCollectedData] = useState<any>({});

  const [categories, setCategories] = useState<Category[]>([
    { id: 'basics', name: 'Perustiedot', icon: '🎯', completed: false },
    { id: 'market', name: 'Markkinat', icon: '🌍', completed: false },
    { id: 'financials', name: 'Talous', icon: '💰', completed: false },
    { id: 'team', name: 'Tiimi', icon: '👥', completed: false },
    { id: 'operations', name: 'Operaatiot', icon: '⚙️', completed: false },
    { id: 'risks', name: 'Riskit', icon: '⚠️', completed: false },
    { id: 'growth', name: 'Kasvu', icon: '📈', completed: false },
  ]);

  const handleCategoryComplete = (categoryData: any) => {
    const updatedData = {
      ...allCollectedData,
      [categories[currentCategory].id]: categoryData,
    };
    setAllCollectedData(updatedData);

    const updatedCategories = [...categories];
    updatedCategories[currentCategory].completed = true;
    setCategories(updatedCategories);

    if (typeof window !== 'undefined') {
      localStorage.setItem('startupData', JSON.stringify(updatedData));
    }

    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <ResultsDashboard
        data={allCollectedData}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Premium Header with Gradient */}
      <header className="glass-strong border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Branding */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow hover-scale click-scale">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text tracking-tight">
                  Startup Viability Simulator
                </h1>
                <p className="text-sm text-white/50 mt-0.5">
                  AI-Powered Business Intelligence
                </p>
              </div>
            </div>

            {/* Current Step Indicator */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                  Vaihe
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold gradient-text">
                    {currentCategory + 1}
                  </span>
                  <span className="text-lg text-white/30">/7</span>
                </div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{categories[currentCategory].icon}</span>
                <div>
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    Kategoria
                  </p>
                  <p className="text-lg font-semibold text-white mt-0.5">
                    {categories[currentCategory].name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Tracker - Premium */}
      <div className="glass border-b border-white/5 sticky top-[73px] z-40 backdrop-blur-xl">
        <ProgressTracker
          categories={categories}
          currentCategory={currentCategory}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Sidebar - Enhanced Info Panel */}
          <div className="lg:col-span-4 space-y-5 animate-scale-in">
            {/* Current Category Card - Premium */}
            <div className="glass-strong rounded-3xl p-8 card-hover shadow-glow-hover border border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <span className="text-4xl">{categories[currentCategory].icon}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="badge-glow mb-2">
                    Kategoria {currentCategory + 1}/7
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {categories[currentCategory].name}
                  </h2>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

              <p className="text-white/70 text-sm leading-relaxed">
                AI kysyy sinulta tarkentavia kysymyksiä kunnes saa riittävästi tietoa.
                Vastaa mahdollisimman yksityiskohtaisesti saadaksesi parhaan analyysin.
              </p>
            </div>

            {/* Smart Tips Card */}
            <div className="glass rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-xl">💡</span>
                </div>
                <h3 className="font-bold text-white text-lg">Smart Tips</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Ole mahdollisimman tarkka vastauksissa',
                  'AI kysyy lisää jos vastaus on epäselvä',
                  'Voit antaa arvioita jos et tiedä tarkkoja lukuja',
                  'Ajattele laajasti - kaikkikin tieto on arvokasta',
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 group-hover:shadow-glow transition"></div>
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Stats Card */}
            <div className="glass rounded-3xl p-6 border border-white/5">
              <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Edistyminen
              </h3>
              <div className="space-y-5">
                {/* Completed Categories */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-white/50">Valmiit kategoriat</span>
                    <span className="text-2xl font-bold gradient-text">
                      {categories.filter(c => c.completed).length}
                      <span className="text-sm text-white/30">/7</span>
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(categories.filter(c => c.completed).length / 7) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Time Estimate */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Arvioitu aika jäljellä</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-sm font-semibold text-cyan-400">
                        ~{Math.max(15 - (currentCategory * 2), 2)} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Banner */}
            <div className="relative rounded-3xl overflow-hidden glass border border-white/10 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
              <div className="relative">
                <p className="text-sm font-medium text-white/90 leading-relaxed">
                  🌟 Joka vastaus vie sinua lähemmäs täydellistä liiketoiminta-analyysiä!
                </p>
              </div>
            </div>
          </div>

          {/* Chat Interface - Full Width on Mobile, 8 cols on Desktop */}
          <div className="lg:col-span-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <ChatInterface
              category={categories[currentCategory]}
              onCategoryComplete={handleCategoryComplete}
            />
          </div>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="glass-strong border-t border-white/5 py-6 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30 flex items-center gap-2">
              <span>Powered by</span>
              <span className="font-semibold gradient-text">Advanced AI</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs text-white/40">All systems operational</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <p className="text-sm text-white/30">
                Made with <span className="text-pink-400">♥</span> for African & Global Startups
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
