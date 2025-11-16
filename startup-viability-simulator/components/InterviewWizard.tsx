'use client';

import { useState } from 'react';
import ChatInterface from './ChatInterface';
import ProgressTracker from './ProgressTracker';

export default function InterviewWizard() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const categories = [
    { id: 'basics', name: 'Perustiedot', icon: '🎯', completed: false },
    { id: 'market', name: 'Markkinat', icon: '🌍', completed: false },
    { id: 'financials', name: 'Talous', icon: '💰', completed: false },
    { id: 'team', name: 'Tiimi', icon: '👥', completed: false },
    { id: 'operations', name: 'Operaatiot', icon: '⚙️', completed: false },
    { id: 'risks', name: 'Riskit', icon: '⚠️', completed: false },
    { id: 'growth', name: 'Kasvu', icon: '📈', completed: false },
  ];

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

            {!showResults && (
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-white/60">Vaihe {currentCategory + 1}/7</p>
                  <p className="text-lg font-semibold text-white">{categories[currentCategory].name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress Tracker */}
      {!showResults && (
        <div className="glass border-b border-white/5">
          <ProgressTracker
            categories={categories}
            currentCategory={currentCategory}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
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
                onCategoryComplete={() => {
                  if (currentCategory < categories.length - 1) {
                    setCurrentCategory(currentCategory + 1);
                  } else {
                    setShowResults(true);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="glass-strong rounded-2xl p-12 text-center max-w-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-4">Haastattelu Valmis!</h2>
              <p className="text-white/70 mb-8">
                AI analysoi nyt kaikki tietosi ja luo kattavan raportin...
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="spinner"></div>
                <span className="text-white/60">Analysoidaan dataa...</span>
              </div>
            </div>
          </div>
        )}
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
