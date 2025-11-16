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
  const progress = (categories.filter(c => c.completed).length / categories.length) * 100;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Kokonaisedistyminen
          </span>
          <span className="text-sm font-bold gradient-text">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="progress-bar h-2">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {categories.map((category, index) => {
          const isActive = index === currentCategory;
          const isCompleted = category.completed;
          const isPast = index < currentCategory;
          const isFuture = index > currentCategory;

          return (
            <div key={category.id} className="flex items-center flex-shrink-0">
              {/* Category Step Node */}
              <div className="flex flex-col items-center gap-2 group">
                {/* Main Circle */}
                <div className="relative">
                  {/* Glow Effect for Active */}
                  {isActive && (
                    <>
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-60 animate-pulse-slow"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 animate-ping"></div>
                    </>
                  )}

                  {/* Circle Container */}
                  <div
                    className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center
                      transition-all duration-500 shadow-lg
                      ${
                        isActive
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 shadow-glow scale-110'
                          : isCompleted
                          ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-glow hover:scale-105'
                          : isPast
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          : 'bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    {/* Icon or Checkmark */}
                    {isCompleted ? (
                      <div className="relative">
                        <svg
                          className="w-7 h-7 text-white animate-scale-in"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <span className={`
                        text-2xl transition-transform
                        ${isActive ? 'scale-110' : ''}
                      `}>
                        {category.icon}
                      </span>
                    )}

                    {/* Badge for Current */}
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-glow">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className={`
                      text-xs font-semibold whitespace-nowrap transition-all
                      ${
                        isActive
                          ? 'text-white scale-105'
                          : isCompleted
                          ? 'text-emerald-400'
                          : 'text-white/40'
                      }
                    `}
                  >
                    {category.name}
                  </p>
                  <p className="text-[10px] text-white/20 mt-0.5">
                    {index + 1}/{categories.length}
                  </p>
                </div>

                {/* Status Indicator Line */}
                <div
                  className={`
                    w-12 h-0.5 rounded-full transition-all duration-500
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : isCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : 'bg-white/10'
                    }
                  `}
                />
              </div>

              {/* Connector Line Between Steps */}
              {index < categories.length - 1 && (
                <div className="relative w-12 sm:w-16 lg:w-20 h-1 mx-2 mt-[-30px]">
                  {/* Background Line */}
                  <div className="absolute inset-0 bg-white/5 rounded-full"></div>

                  {/* Progress Line */}
                  <div
                    className={`
                      absolute top-0 left-0 h-full rounded-full transition-all duration-700
                      ${
                        category.completed
                          ? 'w-full bg-gradient-to-r from-emerald-500 to-cyan-500'
                          : 'w-0'
                      }
                    `}
                  >
                    {/* Animated Shimmer on Active Connector */}
                    {category.completed && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    )}
                  </div>

                  {/* Pulse on Active Connector */}
                  {index === currentCategory && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
