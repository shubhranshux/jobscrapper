import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import GradientBlinds from '../components/GradientBlinds';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding with GradientBlinds */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
          <GradientBlinds
            gradientColors={['#c7d2fe', '#818cf8', '#a78bfa', '#c084fc', '#e0e7ff']}
            angle={30}
            noise={0.12}
            blindCount={18}
            blindMinWidth={80}
            mouseDampening={0.15}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={0.7}
            distortAmount={1.5}
            mixBlendMode="normal"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-white/30 pointer-events-none" />
        
        <motion.div className="relative z-10 max-w-md text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <motion.div
            className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/70 backdrop-blur-sm flex items-center justify-center border border-primary-200 shadow-sm"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
          >
            <Sparkles className="w-10 h-10 text-primary-600" />
          </motion.div>
          <h1 className="text-4xl font-black text-surface-800 mb-4">Welcome Back!</h1>
          <p className="text-lg text-surface-500 leading-relaxed">
            Continue your job search journey with AI-powered insights and smart matching.
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary-600">HireHarvester</span>
            </Link>
          </div>

          <div className="bg-white shadow-card border border-surface-200 p-8 sm:p-10 rounded-2xl">
            <h2 className="text-3xl font-black text-surface-800 mb-1">Sign in</h2>
            <p className="text-surface-500 mb-8 font-medium">Enter your credentials to continue</p>

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm animate-slide-down">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-surface-600 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-600 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 pr-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 text-base"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-surface-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
