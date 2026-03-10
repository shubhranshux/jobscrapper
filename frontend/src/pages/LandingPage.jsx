import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import BlurText from '../components/BlurText';
import LightPillar from '../components/LightPillar';
import { FadeIn, StaggerContainer, StaggerItem, AnimatedCounter, SlideIn } from '../components/AnimatedElements';
import { Sparkles, Search, BarChart3, Shield, Zap, Globe, ArrowRight, Star, CheckCircle2 } from 'lucide-react';

const features = [
  { icon: Search, title: 'Multi-Platform Scraping', desc: 'Scrape jobs from LinkedIn, Naukri, Internshala, and Unstop in one click.', color: 'from-blue-500 to-blue-700' },
  { icon: Sparkles, title: 'AI-Powered Insights', desc: 'Smart summaries, skill extraction, and compatibility scoring powered by AI.', color: 'from-purple-500 to-purple-700' },
  { icon: BarChart3, title: 'Application Tracking', desc: 'Track all your applications in one place with status updates.', color: 'from-emerald-500 to-emerald-700' },
  { icon: Zap, title: 'Instant Apply', desc: 'Apply to jobs instantly and keep a record of all your applications.', color: 'from-orange-500 to-orange-700' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared with third parties.', color: 'from-red-500 to-red-700' },
  { icon: Globe, title: 'Smart Matching', desc: 'AI matches your profile with jobs and gives compatibility scores.', color: 'from-indigo-500 to-indigo-700' }
];

const stats = [
  { value: '10,000+', label: 'Jobs Scraped' },
  { value: '4', label: 'Platforms' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '24/7', label: 'AI Assistant' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer', text: 'Found my dream job at a top MNC within 2 weeks!', rating: 5 },
  { name: 'Rahul Verma', role: 'Data Analyst', text: 'The AI matching feature is incredibly accurate. Saved me hours of job hunting.', rating: 5 },
  { name: 'Ananya Patel', role: 'UX Designer', text: 'Clean interface and powerful scraping. Best job search tool I\'ve used.', rating: 5 },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-surface-800 overflow-hidden">
      <Navbar />

      {/* ===== HERO — Full screen LightPillar ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
        {/* Full-screen LightPillar Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <LightPillar
            topColor="#5227FF"
            bottomColor="#FF9FFC"
            intensity={1.2}
            rotationSpeed={0.3}
            glowAmount={0.005}
            pillarWidth={3}
            pillarHeight={0.4}
            noiseIntensity={0.5}
            pillarRotation={25}
            interactive={true}
            mixBlendMode="normal"
            quality="high"
          />
        </div>

        {/* Dark overlay to make white text pop, fading to white at bottom */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, rgba(255,255,255,0.9) 90%, white 100%)'
        }} />

        {/* Content — Centered */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-16">
          <div className="text-center max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              {/* Liquid glass badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm mb-8 shadow-lg liquid-glass-dark">
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
                <span className="font-semibold drop-shadow-sm">AI-Powered Job Search Platform</span>
              </div>
            </FadeIn>

            <div className="mb-6">
              <BlurText text="Find Your Dream Job" className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight justify-center drop-shadow-md" delay={80} animateBy="words" direction="top" stepDuration={0.4} />
              <BlurText text="Powered by AI" className="text-5xl sm:text-6xl lg:text-7xl font-black text-white/90 leading-tight justify-center mt-2 drop-shadow-md" delay={100} animateBy="words" direction="bottom" stepDuration={0.4}
                animationFrom={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
                animationTo={[
                  { filter: 'blur(5px)', opacity: 0.5, y: -5 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 }
                ]}
              />
            </div>

            <FadeIn delay={0.6} y={20}>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium liquid-glass-dark px-6 py-4 rounded-2xl drop-shadow-sm">
                Scrape jobs from LinkedIn, Naukri, Internshala & Unstop. Get AI-powered insights,
                smart matching, and track all your applications in one place.
              </p>
            </FadeIn>

            <FadeIn delay={0.8} y={20}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl text-lg shadow-lg hover:bg-primary-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  Get Started Free
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                {/* Liquid glass button */}
                <Link to={isAuthenticated ? '/dashboard' : '/login'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-2xl text-lg shadow-md hover:-translate-y-1 transition-all duration-200 liquid-glass-strong">
                  {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
                </Link>
              </div>
            </FadeIn>

            {/* Floating liquid glass info cards */}
            <FadeIn delay={1.2} y={30}>
              <div className="flex flex-wrap justify-center gap-4 mt-14 mb-8">
                {['4 Platforms', 'AI Matching', 'Free to Use', 'Real-time Scraping'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold liquid-glass-dark drop-shadow-sm border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative z-10 py-16 bg-white border-b border-surface-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <StaggerContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" stagger={0.12}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-white p-6 text-center rounded-2xl border border-surface-200 shadow-card hover-lift-sm cursor-default">
                  <div className="text-3xl sm:text-4xl font-black text-primary-600 mb-1"><AnimatedCounter value={stat.value} duration={2} /></div>
                  <div className="text-sm text-surface-500 font-medium tracking-wide uppercase">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 border border-primary-100 rounded-full mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-surface-800 mb-4">Everything you need to land your next role</h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">Our AI-powered platform streamlines your job search from discovery to application.</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
            {features.map((f, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-card hover-lift cursor-default group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-surface-800 mb-3 group-hover:text-primary-600 transition-colors duration-200">{f.title}</h3>
                  <p className="text-surface-500 leading-relaxed">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 border border-primary-100 rounded-full mb-4">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-surface-800 mb-4">Three simple steps</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search & Scrape', desc: 'Enter your desired job title and location. Our scraper fetches jobs from 4+ platforms instantly.' },
              { step: '02', title: 'AI Analysis', desc: 'Get AI-powered summaries, skill extraction, and compatibility scores for each job.' },
              { step: '03', title: 'Apply & Track', desc: 'Apply to jobs with one click and track all your applications in a beautiful dashboard.' },
            ].map((item, idx) => (
              <SlideIn key={idx} direction={idx === 0 ? 'left' : idx === 2 ? 'right' : 'left'} delay={idx * 0.15}>
                <div className="relative p-8 text-center bg-surface-50 rounded-2xl border border-surface-200 hover-lift-sm cursor-default">
                  <div className="text-7xl font-black text-primary-100 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-surface-800 mb-3">{item.title}</h3>
                  <p className="text-surface-500 leading-relaxed">{item.desc}</p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-full mb-4">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-surface-800 mb-4">Loved by job seekers</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-6" stagger={0.15}>
            {testimonials.map((t, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-card hover-lift cursor-default">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-surface-600 mb-8 leading-relaxed text-lg">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-white shadow-md">{t.name.charAt(0)}</div>
                    <div><p className="font-bold text-surface-800">{t.name}</p><p className="text-sm text-surface-500">{t.role}</p></div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-white">
        <FadeIn className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-16 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-700 relative overflow-hidden shadow-elevated hover-lift-sm">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-4">Ready to find your dream job?</h2>
              <p className="text-xl text-white/80 mb-8">Join thousands of job seekers using AI to land their next role.</p>
              <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl text-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                Start Searching Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-surface-200 bg-white text-surface-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center shadow-md"><Sparkles className="w-5 h-5 text-white" /></div>
              <span className="text-surface-800 font-black text-xl tracking-tight">HireHarvester</span>
            </div>
            <p className="text-sm font-medium">© 2026 HireHarvester. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
