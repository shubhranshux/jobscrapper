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
  Loader2, AlertCircle, Target, Brain, Filter, Search
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchInfo, setSearchInfo] = useState(null);
  const [error, setError] = useState('');

  // AI Modal
  const [aiModal, setAiModal] = useState({ open: false, job: null, loading: false, data: null, type: 'summary' });
  const [filterQuery, setFilterQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);

  // Stats
  const [stats, setStats] = useState({ totalJobs: 0, applied: 0, platforms: 0 });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      const appJobIds = res.data.applications.map(a => a.job_id || a.id);
      setAppliedJobs(appJobIds);
      setStats(prev => ({ ...prev, applied: res.data.applications.length }));
    } catch (err) {
      console.error('Failed to fetch applications');
    }
  };

  const handleSearch = async (keyword, location) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/jobs/scrape', { keyword, location });
      setJobs(res.data.jobs);
      setSearchInfo({ keyword, location, count: res.data.count });
      setStats(prev => ({
        ...prev,
        totalJobs: res.data.count,
        platforms: [...new Set(res.data.jobs.map(j => j.platform))].length
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scrape jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    try {
      await api.post('/applications', { job_id: job.id });
      setAppliedJobs(prev => [...prev, job.id]);
      setStats(prev => ({ ...prev, applied: prev.applied + 1 }));
      // Open job link in new tab
      window.open(job.link, '_blank');
    } catch (err) {
      if (err.response?.status === 409) {
        // Already applied
        window.open(job.link, '_blank');
      }
    }
  };

  const handleRecommendJobs = async () => {
    setLoading(true);
    setIsRecommending(true);
    setError('');
    try {
      const res = await api.post('/ai/recommend-jobs');
      setJobs(res.data.jobs);
      setSearchInfo({ keyword: `AI Recommended: ${res.data.keyword}`, location: 'Auto-matched', count: res.data.count });
      setStats(prev => ({
        ...prev,
        totalJobs: res.data.count,
        platforms: [...new Set(res.data.jobs.map(j => j.platform))].length
      }));
    } catch (err) {
      setError('Failed to get AI recommendations. Please try again.');
    } finally {
      setLoading(false);
      setIsRecommending(false);
    }
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
    } catch (err) {
      setError('Failed to apply smart filter.');
    } finally {
      setIsFiltering(false);
    }
  };

  const handleMatchResume = async (job) => {
    setAiModal({ open: true, job, loading: true, data: null, type: 'match' });
    try {
      const matchRes = await api.post('/ai/match', { job_id: job.id });
      setAiModal(prev => ({
        ...prev,
        loading: false,
        data: {
          matchScore: matchRes.data.score,
          matchAnalysis: matchRes.data.analysis
        }
      }));
    } catch (err) {
      setAiModal(prev => ({
        ...prev,
        loading: false,
        data: { matchScore: 0, matchAnalysis: 'Failed to analyze match. Please check your AI connection.' }
      }));
    }
  };

  const handleAISummary = async (job) => {
    setAiModal({ open: true, job, loading: true, data: null, type: 'summary' });
    try {
      const [summaryRes, skillsRes] = await Promise.all([
        api.post('/ai/summarize', { description: job.description }),
        api.post('/ai/skills', { description: job.description })
      ]);

      setAiModal(prev => ({
        ...prev,
        loading: false,
        data: {
          summary: summaryRes.data.summary,
          skills: skillsRes.data.skills
        }
      }));
    } catch (err) {
      setAiModal(prev => ({
        ...prev,
        loading: false,
        data: { summary: 'AI analysis unavailable. Please check your OpenAI API key.', skills: [] }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="content-area">
          {/* Welcome */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-800">
              Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <p className="text-surface-500 mt-1">Search and discover your next opportunity</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Briefcase, value: stats.totalJobs, label: 'Jobs Found', bg: 'bg-primary-50', border: 'border-primary-100', iconColor: 'text-primary-600' },
              { icon: CheckCircle, value: stats.applied, label: 'Applied', bg: 'bg-emerald-50', border: 'border-emerald-100', iconColor: 'text-emerald-600' },
              { icon: TrendingUp, value: stats.platforms, label: 'Platforms', bg: 'bg-orange-50', border: 'border-orange-100', iconColor: 'text-orange-600' },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                className="stat-card flex items-center gap-5"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -3, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
              >
                <div className={`w-14 h-14 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center`}>
                  <s.icon className={`w-7 h-7 ${s.iconColor}`} />
                </div>
                <div>
                  <p className="text-3xl font-black text-surface-800">{s.value}</p>
                  <p className="text-sm font-medium text-surface-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-0">
            {/* Search Bar */}
            <div className="flex-1 bg-white p-6 rounded-2xl border border-surface-200 shadow-card">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>

            {/* AI Recommend Jobs Button */}
            <button
              onClick={handleRecommendJobs}
              disabled={loading || isRecommending}
              className="sm:w-64 bg-primary-600 text-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center gap-3 hover:bg-primary-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden group"
            >
              {isRecommending ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Brain className="w-8 h-8 text-white/90" />
              )}
              <span className="font-bold text-lg">✨ Recommend Jobs</span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 text-red-600 rounded-xl animate-slide-down">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Results Header */}
          {searchInfo && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 bg-white p-4 rounded-2xl border border-surface-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-surface-800">
                  {searchInfo.count} jobs found for "{searchInfo.keyword}"
                  {searchInfo.location && ` in ${searchInfo.location}`}
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Smart Filter Input */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="🧠 Smart Filter (e.g. Remote only)"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSmartFilter()}
                    className="pl-9 pr-10 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder-surface-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 w-full sm:w-64"
                  />
                  <Filter className="absolute left-3 w-4 h-4 text-surface-400" />
                  {filterQuery && (
                    <button
                      onClick={handleSmartFilter}
                      disabled={isFiltering}
                      className="absolute right-1.5 p-1.5 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Apply Filter"
                    >
                      {isFiltering ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* View Toggles */}
                <div className="flex items-center gap-1 bg-surface-100 border border-surface-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Job Results */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden mb-12">
              {viewMode === 'table' ? (
                <JobTable jobs={jobs} onApply={handleApply} onAISummary={handleAISummary} onMatchResume={handleMatchResume} appliedJobs={appliedJobs} />
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                  {jobs.map((job, idx) => (
                    <JobCard
                      key={job.id || idx}
                      job={job}
                      onApply={handleApply}
                      onAISummary={handleAISummary}
                      onMatchResume={handleMatchResume}
                      isApplied={appliedJobs.includes(job.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && jobs.length === 0 && !searchInfo && (
            <div className="text-center py-20">
              <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-surface-100 border border-surface-200 flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-surface-400" />
              </div>
              <h3 className="text-2xl font-bold text-surface-800 mb-2">Start your job search</h3>
              <p className="text-surface-500 max-w-md mx-auto text-lg">Enter a job title or skill keyword above and we'll scrape jobs from LinkedIn, Naukri, Internshala & Unstop.</p>
            </div>
          )}
        </main>
      </div>

      {/* AI Assistant FAB */}
      <AIAssistant />

      {/* AI Summary Modal */}
      <Modal
        isOpen={aiModal.open}
        onClose={() => setAiModal({ open: false, job: null, loading: false, data: null })}
        title={aiModal.type === 'match' ? `🎯 Resume Match — ${aiModal.job?.title || ''}` : `📝 AI Summary — ${aiModal.job?.title || ''}`}
        size="lg"
      >
        {aiModal.loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-surface-500 font-medium">AI is analyzing this job...</p>
          </div>
        ) : aiModal.data ? (
          <div className="space-y-6">
            {aiModal.type === 'match' && aiModal.data.matchScore !== undefined && (
              <>
                {/* Match Score */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray={`${aiModal.data.matchScore}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-surface-800">{aiModal.data.matchScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-surface-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      Match Score
                    </p>
                    <p className="text-sm text-surface-500">Based on your profile and skills</p>
                  </div>
                </div>

                {/* Match Analysis */}
                {aiModal.data.matchAnalysis && (
                  <div>
                    <h3 className="font-bold text-surface-800 mb-2">Detailed Analysis</h3>
                    <p className="text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{aiModal.data.matchAnalysis}</p>
                  </div>
                )}
              </>
            )}

            {aiModal.type === 'summary' && aiModal.data.summary && (
              <>
                {/* Summary */}
                <div>
                  <h3 className="font-bold text-surface-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    AI Summary
                  </h3>
                  <p className="text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{aiModal.data.summary}</p>
                </div>

                {/* Skills */}
                {aiModal.data.skills?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-surface-800 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiModal.data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 text-sm font-medium bg-primary-50 text-primary-700 rounded-lg border border-primary-100">
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
