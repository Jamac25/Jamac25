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
    // Save data from this category
    const updatedData = {
      ...allCollectedData,
      [categories[currentCategory].id]: categoryData,
    };
    setAllCollectedData(updatedData);

    // Mark category as completed
    const updatedCategories = [...categories];
    updatedCategories[currentCategory].completed = true;
    setCategories(updatedCategories);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('startupData', JSON.stringify(updatedData));
    }

    // Move to next category or show results
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      // All categories complete - trigger analysis
      setShowResults(true);
      console.log('All data collected:', updatedData);
    }
  };

  // Show results dashboard if all categories complete
  if (showResults) {
    return (
      <ResultsDashboard
        data={allCollectedData}
        onBack={() => setShowResults(false)}
      />
    );
  }

  // Otherwise show interview wizard
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Startup Viability Simulator</h1>
                <p className="text-sm text-white/60">AI-Powered Business Analysis</p>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-white/60">Vaihe {currentCategory + 1}/7</p>
                <p className="text-lg font-semibold text-white">{categories[currentCategory].name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Tracker */}
      <div className="glass border-b border-white/5">
        <ProgressTracker
          categories={categories}
          currentCategory={currentCategory}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Sidebar - Category Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Current Category Card */}
            <div className="glass-strong rounded-2xl p-6 card-hover">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{categories[currentCategory].icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{categories[currentCategory].name}</h2>
                  <p className="text-sm text-white/60">Kategoria {currentCategory + 1}/7</p>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                AI kysyy sinulta tarkentavia kysymyksiä kunnes saa riittävästi tietoa tästä kategoriasta.
              </p>
            </div>

            {/* Tips Card */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-white mb-2">Vinkkejä</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400">•</span>
                      <span>Ole mahdollisimman tarkka vastauksissa</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400">•</span>
                      <span>AI kysyy lisää jos vastaus on epäselvä</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400">•</span>
                      <span>Voit antaa arvioita jos et tiedä tarkkoja lukuja</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Edistyminen</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Valmiit kategoriat</span>
                    <span className="text-white font-semibold">
                      {categories.filter(c => c.completed).length}/7
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(categories.filter(c => c.completed).length / 7) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-white/50">
                    Arvioi ~{15 - (currentCategory * 2)} min jäljellä
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface
              category={categories[currentCategory]}
              onCategoryComplete={handleCategoryComplete}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-strong border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-white/40">
            Powered by AI • Made with 💜 for African & Global Startups
          </p>
        </div>
      </footer>
    </div>
  );
}
