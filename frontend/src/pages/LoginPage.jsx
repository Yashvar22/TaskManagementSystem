import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated]);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.userMessage || err.response?.data?.message || 'Login failed.', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(145deg, #EAECF4 0%, #F4F5F9 60%, #E8EBF5 100%)' }}
    >
      <div
        className="w-full max-w-[380px] bg-white rounded-3xl p-8 animate-slide-up"
        style={{ boxShadow: '0 20px 60px rgba(99,102,241,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">Team Task Manager</span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-900">Welcome Back!</h1>
          <p className="text-sm text-gray-400 mt-0.5">We Are Happy To See You Again</p>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex mb-6 p-1 rounded-2xl"
          style={{ background: '#F1F3F9' }}
        >
          <div
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-center text-white"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
          >
            Sign in
          </div>
          <Link
            to="/signup"
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email */}
          <div>
            <div
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]'
              }`}
            >
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                placeholder="Enter your email"
              />
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]'
              }`}
            >
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  remember ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
                }`}
              >
                {remember && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-gray-500">Remember me</span>
            </label>
            <span className="text-sm font-semibold text-primary cursor-pointer hover:text-primary-dark transition-colors">
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm mt-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* OR divider */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
