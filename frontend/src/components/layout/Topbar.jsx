import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ title, subtitle }) => {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="bg-glass border-b border-border flex items-center justify-between px-6 sticky top-0 z-20"
      style={{ height: '64px', backdropFilter: 'blur(12px)' }}
    >
      {/* Left: page info */}
      <div>
        {title ? (
          <>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </>
        ) : (
          <p className="text-sm font-medium text-gray-500">{greeting}, <span className="text-gray-900 font-semibold">{user?.name?.split(' ')[0]}</span></p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-9 pr-4 py-2 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-52 transition-all placeholder-gray-400"
          />
        </div>


        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name?.split(' ')[0]}</p>
            <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
