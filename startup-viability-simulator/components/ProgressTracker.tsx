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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between space-x-2 overflow-x-auto">
        {categories.map((category, index) => (
          <div key={category.id} className="flex items-center flex-shrink-0">
            {/* Category Step */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    index === currentCategory
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-glow scale-110'
                      : category.completed
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                      : 'bg-white/10'
                  }
                `}
              >
                {category.completed ? (
                  <span className="text-xl">✓</span>
                ) : (
                  <span className="text-xl">{category.icon}</span>
                )}

                {/* Pulse animation for current step */}
                {index === currentCategory && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-purple-500/50 animate-ping"></span>
                    <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-pulse"></span>
                  </>
                )}
              </div>

              <span
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap transition-colors
                  ${
                    index === currentCategory
                      ? 'text-white'
                      : category.completed
                      ? 'text-green-400'
                      : 'text-white/40'
                  }
                `}
              >
                {category.name}
              </span>
            </div>

            {/* Connector Line */}
            {index < categories.length - 1 && (
              <div className="w-12 sm:w-16 lg:w-24 h-0.5 mx-2 relative">
                <div className="absolute inset-0 bg-white/10"></div>
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500
                    ${category.completed ? 'w-full' : 'w-0'}
                  `}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
