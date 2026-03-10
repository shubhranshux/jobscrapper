import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import JobTable from '../components/JobTable';
import JobCard from '../components/JobCard';
import Modal from '../components/Modal';
import AIAssistant from '../components/AIAssistant';
import {
  Briefcase, TrendingUp, CheckCircle, Sparkles, LayoutGrid, List,
  Loader2, AlertCircle, Target, Brain, Filter, Zap, ArrowRight, Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [searchInfo, setSearchInfo] = useState(null);
  const [error, setError] = useState('');

  const [aiModal, setAiModal] = useState({ open: false, job: null, loading: false, data: null, type: 'summary' });
  const [filterQuery, setFilterQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);

  const [stats, setStats] = useState({ totalJobs: 0, applied: 0, platforms: 0 });

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      const appJobIds = res.data.applications.map(a => a.job_id || a.id);
      setAppliedJobs(appJobIds);
      setStats(prev => ({ ...prev, applied: res.data.applications.length }));
    } catch (err) { console.error('Failed to fetch applications'); }
  };

  const handleSearch = async (keyword, location) => {
    setLoading(true); setError('');
    try {
      const res = await api.post('/jobs/scrape', { keyword, location });
      setJobs(res.data.jobs);
      setSearchInfo({ keyword, location, count: res.data.count });
      setStats(prev => ({ ...prev, totalJobs: res.data.count, platforms: [...new Set(res.data.jobs.map(j => j.platform))].length }));
    } catch (err) { setError(err.response?.data?.error || 'Failed to scrape jobs. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleApply = async (job) => {
    try {
      await api.post('/applications', { job_id: job.id });
      setAppliedJobs(prev => [...prev, job.id]);
      setStats(prev => ({ ...prev, applied: prev.applied + 1 }));
      window.open(job.link, '_blank');
    } catch (err) { if (err.response?.status === 409) window.open(job.link, '_blank'); }
  };

  const handleRecommendJobs = async () => {
    setLoading(true); setIsRecommending(true); setError('');
    try {
      const res = await api.post('/ai/recommend-jobs');
      setJobs(res.data.jobs);
      setSearchInfo({ keyword: `AI Recommended: ${res.data.keyword}`, location: 'Auto-matched', count: res.data.count });
      setStats(prev => ({ ...prev, totalJobs: res.data.count, platforms: [...new Set(res.data.jobs.map(j => j.platform))].length }));
    } catch (err) { setError('Failed to get AI recommendations. Please try again.'); }
    finally { setLoading(false); setIsRecommending(false); }
  };

  const handleSmartFilter = async () => {
    if (!filterQuery.trim() || jobs.length === 0) return;
    setIsFiltering(true);
    try {
      const res = await api.post('/ai/filter-jobs', { jobs, query: filterQuery });
      const keptIds = res.data.keptIds || [];
      const filtered = jobs.filter(j => keptIds.includes(j.id) || keptIds.includes(j.title));
      setJobs(filtered);
      setSearchInfo(prev => ({ ...prev, count: filtered.length, keyword: `${prev.keyword} (Filtered)` }));
      setFilterQuery('');
    } catch (err) { setError('Failed to apply smart filter.'); }
    finally { setIsFiltering(false); }
  };

  const handleMatchResume = async (job) => {
    setAiModal({ open: true, job, loading: true, data: null, type: 'match' });
    try {
      const matchRes = await api.post('/ai/match', { job_id: job.id });
      setAiModal(prev => ({ ...prev, loading: false, data: { matchScore: matchRes.data.score, matchAnalysis: matchRes.data.analysis } }));
    } catch (err) {
      setAiModal(prev => ({ ...prev, loading: false, data: { matchScore: 50, matchAnalysis: 'Could not connect to the analysis service. Please try again in a moment.' } }));
    }
  };

  const handleAISummary = async (job) => {
    setAiModal({ open: true, job, loading: true, data: null, type: 'summary' });
    try {
      const [summaryRes, skillsRes] = await Promise.all([
        api.post('/ai/summarize', { description: job.description }),
        api.post('/ai/skills', { description: job.description })
      ]);
      setAiModal(prev => ({ ...prev, loading: false, data: { summary: summaryRes.data.summary, skills: skillsRes.data.skills } }));
    } catch (err) {
      setAiModal(prev => ({ ...prev, loading: false, data: { summary: 'Could not connect to the analysis service. Please try again in a moment.', skills: [] } }));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const matchScoreColor = (score) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="content-area">
          {/* ── Welcome Banner ── */}
          <motion.div
            className="relative mb-8 p-6 sm:p-8 rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-indigo-200 text-sm font-medium mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {getGreeting()}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user?.name?.split(' ')[0] || 'User'}, ready to find your next role? 🚀
                </h1>
                <p className="text-indigo-200/80 mt-2 max-w-lg">Search across platforms or let AI recommend jobs matched to your profile.</p>
              </div>
              <button
                onClick={handleRecommendJobs}
                disabled={loading || isRecommending}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl hover:bg-white/25 transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {isRecommending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                <span>AI Recommend Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Briefcase, value: stats.totalJobs, label: 'Jobs Found', gradient: 'from-blue-500 to-indigo-600' },
              { icon: CheckCircle, value: stats.applied, label: 'Applied', gradient: 'from-emerald-500 to-teal-600' },
              { icon: TrendingUp, value: stats.platforms, label: 'Platforms', gradient: 'from-amber-500 to-orange-600' },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                className="relative bg-white rounded-2xl border border-surface-200 shadow-sm p-5 flex items-center gap-4 overflow-hidden group hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-surface-800 leading-none">{s.value}</p>
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Search Card ── */}
          <motion.div
            className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 sm:p-6 mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <SearchBar onSearch={handleSearch} loading={loading} />
          </motion.div>

          {/* ── Error ── */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 text-red-600 rounded-xl animate-slide-down">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* ── Results Header ── */}
          {searchInfo && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-surface-800">
                    {searchInfo.count} jobs found
                  </h2>
                  <p className="text-xs text-surface-400">
                    "{searchInfo.keyword}"{searchInfo.location && ` • ${searchInfo.location}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Smart Filter */}
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Smart filter..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSmartFilter()}
                    className="pl-9 pr-10 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder-surface-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 w-full sm:w-52"
                  />
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  {filterQuery && (
                    <button onClick={handleSmartFilter} disabled={isFiltering}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors disabled:opacity-50">
                      {isFiltering ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* View Mode */}
                <div className="flex items-center bg-surface-100 border border-surface-200 rounded-xl p-1">
                  <button onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}>
                    <List className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Job Results ── */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden mb-12">
              {viewMode === 'table' ? (
                <JobTable jobs={jobs} onApply={handleApply} onAISummary={handleAISummary} onMatchResume={handleMatchResume} appliedJobs={appliedJobs} />
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                  {jobs.map((job, idx) => (
                    <JobCard key={job.id || idx} job={job} onApply={handleApply} onAISummary={handleAISummary} onMatchResume={handleMatchResume} isApplied={appliedJobs.includes(job.id)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && jobs.length === 0 && !searchInfo && (
            <motion.div
              className="text-center py-16 sm:py-24"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200/50 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold text-surface-800 mb-2">Start your job search</h3>
              <p className="text-surface-400 max-w-md mx-auto mb-8">Search by keyword above or let AI find jobs matched to your profile.</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {['React Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager', 'ML Engineer'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag, '')}
                    className="px-4 py-2 text-sm font-medium bg-white border border-surface-200 rounded-xl text-surface-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <AIAssistant />

      {/* ── AI Modal ── */}
      <Modal
        isOpen={aiModal.open}
        onClose={() => setAiModal({ open: false, job: null, loading: false, data: null })}
        title={aiModal.type === 'match' ? `🎯 Resume Match — ${aiModal.job?.title || ''}` : `📝 AI Summary — ${aiModal.job?.title || ''}`}
        size="lg"
      >
        {aiModal.loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-surface-500 font-medium">Analyzing this job...</p>
          </div>
        ) : aiModal.data ? (
          <div className="space-y-6">
            {aiModal.type === 'match' && aiModal.data.matchScore !== undefined && (
              <>
                <div className="flex items-center gap-5 p-5 rounded-2xl" style={{ background: `linear-gradient(135deg, ${matchScoreColor(aiModal.data.matchScore)}15, ${matchScoreColor(aiModal.data.matchScore)}08)`, border: `1px solid ${matchScoreColor(aiModal.data.matchScore)}30` }}>
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                      <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={matchScoreColor(aiModal.data.matchScore)} strokeWidth="2.5" strokeDasharray={`${aiModal.data.matchScore}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black" style={{ color: matchScoreColor(aiModal.data.matchScore) }}>{aiModal.data.matchScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-surface-800 text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" style={{ color: matchScoreColor(aiModal.data.matchScore) }} />
                      {aiModal.data.matchScore >= 75 ? 'Strong Match!' : aiModal.data.matchScore >= 50 ? 'Good Potential' : 'Growing Match'}
                    </p>
                    <p className="text-sm text-surface-500 mt-0.5">Based on your profile skills and experience</p>
                  </div>
                </div>

                {aiModal.data.matchAnalysis && (
                  <div className="bg-surface-50 rounded-2xl p-5 border border-surface-100">
                    <h3 className="font-bold text-surface-800 mb-3">Detailed Analysis</h3>
                    <div className="text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{aiModal.data.matchAnalysis}</div>
                  </div>
                )}
              </>
            )}

            {aiModal.type === 'summary' && aiModal.data.summary && (
              <>
                <div className="bg-surface-50 rounded-2xl p-5 border border-surface-100">
                  <h3 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    AI Summary
                  </h3>
                  <div className="text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{aiModal.data.summary}</div>
                </div>

                {aiModal.data.skills?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-surface-800 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiModal.data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-primary-50 to-indigo-50 text-primary-700 rounded-lg border border-primary-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
