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

  const completedCount = categories.filter(c => c.completed).length;
  const progressPercent = (completedCount / categories.length) * 100;

  return (
    <div className="min-h-screen bg-[#0f0f14] flex flex-col">
      {/* Simple Header */}
      <header className="bg-[#1a1a24] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Startup Viability Simulator</h1>
                <p className="text-xs text-white/40">AI-Powered Analysis</p>
              </div>
            </div>
            <div className="text-sm text-white/60">
              Vaihe {currentCategory + 1} / 7
            </div>
          </div>
        </div>
      </header>

      {/* Simple Progress */}
      <div className="bg-[#1a1a24] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <ProgressTracker
            categories={categories}
            currentCategory={currentCategory}
          />
        </div>
      </div>

      {/* Main Content - Centered Chat */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <ChatInterface
            category={categories[currentCategory]}
            onCategoryComplete={handleCategoryComplete}
          />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-[#1a1a24] border-t border-white/5 py-3">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs text-white/30">
            Powered by AI • Made for African & Global Startups
          </p>
        </div>
      </footer>
    </div>
  );
}
