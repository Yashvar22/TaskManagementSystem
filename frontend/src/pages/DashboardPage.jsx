import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  ListTodo,
  TrendingUp,
  ArrowRight,
  Calendar,
  Zap,
  Target,
  BarChart3,
  Activity,
} from 'lucide-react';

const statusConfig = {
  todo: { label: 'Todo', dotColor: '#3B82F6', bg: '#DBEAFE', color: '#1D4ED8' },
  'in-progress': { label: 'In Progress', dotColor: '#F59E0B', bg: '#FEF3C7', color: '#D97706' },
  done: { label: 'Done', dotColor: '#10B981', bg: '#D1FAE5', color: '#065F46' },
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, gradient, iconColor, trend, delay = 0 }) => (
  <div
    className="card-hover p-5 flex items-start gap-4 animate-slide-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ background: gradient }}
    >
      <Icon size={21} style={{ color: iconColor }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-gray-900 mt-1 leading-none">{value}</p>
      {trend && (
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{trend}</p>
      )}
    </div>
  </div>
);

/* ── Progress Bar ── */
const ProgressBar = ({ label, value, total, color, badgeBg, badgeColor }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: badgeBg, color: badgeColor }}
          >
            {label}
          </span>
        </div>
        <span className="text-sm font-bold text-gray-900">{value} <span className="text-xs text-gray-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

/* ── Task Row ── */
const TaskRow = ({ task, onClick }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const cfg = statusConfig[task.status] || {};
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between py-3.5 px-4 -mx-2 rounded-2xl hover:bg-primary-50 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: cfg.dotColor || '#CBD5E1' }}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-primary transition-colors">
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{task.projectId?.name || 'Unknown Project'}</span>
            {isOverdue && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <AlertTriangle size={9} /> Overdue
              </span>
            )}
          </div>
        </div>
      </div>
      <span
        className="ml-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        {cfg.label}
      </span>
    </div>
  );
};

/* ── Main Page ── */
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dashboardAPI.getData();
        setData(res.data.data);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  if (error)
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: '#FEE2E2' }}>
          <AlertTriangle size={28} style={{ color: '#DC2626' }} />
        </div>
        <p className="text-gray-500">{error}</p>
      </div>
    );

  const { stats, statusBreakdown, recentTasks, projects } = data;


  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const statCards = [
    {
      icon: ListTodo,
      label: 'Total Tasks',
      value: stats.totalTasks,
      gradient: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)',
      iconColor: '#6366F1',
      trend: `Across ${stats.totalProjects} project${stats.totalProjects !== 1 ? 's' : ''}`,
      delay: 0,
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: stats.completedTasks,
      gradient: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
      iconColor: '#059669',
      trend: `${completionRate}% completion rate`,
      delay: 80,
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pendingTasks,
      gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
      iconColor: '#D97706',
      trend: 'In progress or todo',
      delay: 160,
    },
    {
      icon: AlertTriangle,
      label: 'Overdue',
      value: stats.overdueTasks,
      gradient: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
      iconColor: '#DC2626',
      trend: stats.overdueTasks > 0 ? '⚠️ Needs attention' : '✓ All on schedule',
      delay: 240,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero Header ── */}
      <div
        className="rounded-3xl p-6 border border-primary-100 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FDF4FF 100%)' }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C7D2FE, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #A78BFA, transparent)', transform: 'translateY(30%)' }}
        />

        <div className="relative flex items-center justify-between">
          <div>
          <h1 className="text-2xl font-black text-gray-900 mt-2">
              Welcome back,{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user?.name?.split(' ')[0]}
              </span>
              !
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening across your projects today.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* Completion ring */}
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
                style={{ background: 'white', boxShadow: '0 4px 20px rgba(99,102,241,0.12)' }}
              >
                <p className="text-2xl font-black text-gray-900">{completionRate}%</p>
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Done</p>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <Calendar size={15} className="text-primary" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Middle Row: Breakdown + Recent Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Task Breakdown */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)' }}>
              <BarChart3 size={16} style={{ color: '#6366F1' }} />
            </div>
            <h2 className="font-bold text-gray-900 text-sm">Task Breakdown</h2>
          </div>

          {stats.totalTasks === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#F1F5F9' }}>
                <Target size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No tasks yet</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <ProgressBar
                label="Todo"
                value={statusBreakdown.todo || 0}
                total={stats.totalTasks}
                color="linear-gradient(90deg, #3B82F6, #60A5FA)"
                badgeBg="#DBEAFE"
                badgeColor="#1D4ED8"
              />
              <ProgressBar
                label="In Progress"
                value={statusBreakdown['in-progress'] || 0}
                total={stats.totalTasks}
                color="linear-gradient(90deg, #F59E0B, #FCD34D)"
                badgeBg="#FEF3C7"
                badgeColor="#D97706"
              />
              <ProgressBar
                label="Done"
                value={statusBreakdown.done || 0}
                total={stats.totalTasks}
                color="linear-gradient(90deg, #10B981, #34D399)"
                badgeBg="#D1FAE5"
                badgeColor="#065F46"
              />

              {/* Summary pills */}
              <div className="pt-3 mt-1 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
                {['todo', 'in-progress', 'done'].map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"
                    style={{ background: statusConfig[s].bg, color: statusConfig[s].color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: statusConfig[s].dotColor }} />
                    {statusConfig[s].label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}>
                <Activity size={16} style={{ color: '#D97706' }} />
              </div>
              <h2 className="font-bold text-gray-900 text-sm">Recent Tasks</h2>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#F1F5F9' }}>
                <ListTodo size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">No tasks yet</p>
              <p className="text-xs text-gray-300 mt-1">Tasks will appear here once created</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  onClick={() => navigate(`/projects/${task.projectId?._id || task.projectId}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Projects Quick Access ── */}
      {projects.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' }}>
                <FolderKanban size={16} style={{ color: '#059669' }} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Your Projects</h2>
                <p className="text-xs text-gray-400">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
            >
              All projects <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {projects.slice(0, 6).map((proj, i) => {
              const colors = [
                { bg: '#EEF2FF', color: '#6366F1', dot: '#6366F1' },
                { bg: '#D1FAE5', color: '#059669', dot: '#10B981' },
                { bg: '#FEF3C7', color: '#D97706', dot: '#F59E0B' },
                { bg: '#FEE2E2', color: '#DC2626', dot: '#EF4444' },
                { bg: '#F3E8FF', color: '#7C3AED', dot: '#8B5CF6' },
                { bg: '#E0F2FE', color: '#0369A1', dot: '#3B82F6' },
              ];
              const c = colors[i % colors.length];
              return (
                <button
                  key={proj._id}
                  onClick={() => navigate(`/projects/${proj._id}`)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5"
                  style={{ background: c.bg, color: c.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                  {proj.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
