import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',         label: '냉장고',     emoji: '🧊' },
  { to: '/recipe',   label: '레시피 추천', emoji: '🍳' },
  { to: '/shopping', label: '장보기',     emoji: '🛒' },
] as const;

interface Props {
  onAddClick: () => void;
}

export function Header({ onAddClick }: Props) {
  return (
    <>
      {/* ── Sticky Top Nav ── */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-10 flex items-center justify-between h-14 sticky top-0 z-50">
        <div className="flex items-center gap-4 sm:gap-8">
          <NavLink
            to="/"
            className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight no-underline"
          >
            🧊 <span className="hidden sm:inline">FridgeApp</span>
          </NavLink>

          <div className="hidden sm:flex gap-1">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 no-underline ${
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="px-3.5 py-1.5 sm:px-5 sm:py-2 bg-gray-900 text-white border-0 rounded-[10px] text-xs sm:text-[13px] font-bold cursor-pointer"
        >
          + 재료 추가
        </button>
      </nav>

      {/* ── Mobile Bottom Nav ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex sm:hidden h-[60px] z-50">
        {NAV_ITEMS.map(({ to, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 no-underline transition-colors duration-150 ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">{emoji}</span>
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
}
