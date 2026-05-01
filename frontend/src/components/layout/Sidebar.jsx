import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Sparkles,
  User,
  Shield,
  CheckSquare,
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
];

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 flex flex-col z-30 bg-white border-r border-border"
      style={{ width: '268px', boxShadow: '4px 0 24px rgba(0,0,0,0.06)' }}
    >
      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <CheckSquare size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm leading-tight">Team Task</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Manager</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Main Menu
        </p>

        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'bg-primary shadow-glow'
                      : 'bg-gray-100 group-hover:bg-primary-50'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User Info ── */}
      <div className="px-4 py-4 border-t border-border">
        <div
          className="flex items-center gap-3 p-3 rounded-2xl mb-2"
          style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-xs font-semibold truncate">{user?.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {isAdmin ? (
                <Shield size={10} className="text-primary" />
              ) : (
                <User size={10} className="text-gray-400" />
              )}
              <p className="text-gray-500 text-[10px] capitalize font-medium">{user?.role}</p>
            </div>
          </div>
          <Sparkles size={14} className="text-accent flex-shrink-0" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-500 hover:text-danger hover:bg-red-50 text-sm font-medium transition-all duration-200"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
