import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GradientBlinds from '../components/GradientBlinds';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5 }}>
          <GradientBlinds
            gradientColors={['#a5b4fc', '#6366f1', '#818cf8', '#a78bfa', '#c7d2fe']}
            angle={30}
            noise={0.12}
            blindCount={18}
            blindMinWidth={80}
            mouseDampening={0.15}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={0.7}
            distortAmount={1.5}
            mixBlendMode="lighten"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-white/30 pointer-events-none" />
        <div className="relative z-10 max-w-md text-center p-12">
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/70 backdrop-blur-sm flex items-center justify-center border border-primary-200 shadow-sm">
            <Sparkles className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-black text-surface-800 mb-4">Join HireHarvester</h1>
          <p className="text-lg text-surface-500 leading-relaxed">Create your account and start discovering jobs with the power of AI.</p>
          <div className="mt-10 space-y-4 text-left">
            {['Multi-platform job scraping', 'AI-powered job matching', 'Application tracking dashboard'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-surface-600">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm"><Sparkles className="w-5 h-5 text-white" /></div>
              <span className="text-2xl font-bold text-primary-600">HireHarvester</span>
            </Link>
          </div>

          <div className="bg-white shadow-card border border-surface-200 p-8 sm:p-10 rounded-2xl">
            <h2 className="text-3xl font-black text-surface-800 mb-1">Create account</h2>
            <p className="text-surface-500 mb-8 font-medium">Start your job search journey</p>
            {error && (<div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm animate-slide-down">{error}</div>)}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-surface-600 mb-2">Full Name</label>
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" /><input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-12" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-600 mb-2">Email</label>
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" autoComplete="email" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-600 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12 pr-12" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-600 mb-2">Confirm Password</label>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" /><input type={showPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pl-12" autoComplete="new-password" /></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 text-base">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
            <p className="mt-8 text-center text-surface-500 font-medium">Already have an account?{' '}<Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
