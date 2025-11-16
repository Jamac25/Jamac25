'use client';

interface Category {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  categories: Category[];
  currentCategory: number;
}

export default function ProgressTracker({ categories, currentCategory }: ProgressTrackerProps) {
  const completedCount = categories.filter(c => c.completed).length;
  const progressPercent = (completedCount / categories.length) * 100;

  return (
    <div className="space-y-4">
      {/* Current Step */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">{categories[currentCategory].icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{categories[currentCategory].name}</h2>
            <p className="text-sm text-white/50">Kategoria {currentCategory + 1} / {categories.length}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{completedCount}/{categories.length}</div>
          <div className="text-xs text-white/50">Valmis</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* All Steps - Simple */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${idx === currentCategory
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : cat.completed
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-white/5 text-white/40'
              }
            `}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}
