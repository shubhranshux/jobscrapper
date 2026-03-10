import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { History, ExternalLink, Trash2, Calendar, Building2, MapPin, Loader2, Briefcase, CheckCircle } from 'lucide-react';

const statusColors = {
  Applied: 'bg-blue-50 text-blue-700', Interview: 'bg-yellow-50 text-yellow-700',
  Offered: 'bg-green-50 text-green-700', Rejected: 'bg-red-50 text-red-700', Withdrawn: 'bg-gray-100 text-gray-600',
};
const platformColors = {
  LinkedIn: 'bg-blue-50 text-blue-700', Naukri: 'bg-purple-50 text-purple-700',
  Internshala: 'bg-emerald-50 text-emerald-700', Unstop: 'bg-orange-50 text-orange-700',
};

export default function ApplicationHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try { const res = await api.get('/applications'); setApplications(res.data.applications); } catch (err) { setError('Failed to load application history.'); } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try { await api.put(`/applications/${id}`, { status }); setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app)); } catch (err) { console.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this application from history?')) return;
    try { await api.delete(`/applications/${id}`); setApplications(prev => prev.filter(app => app.id !== id)); } catch (err) { console.error('Failed to delete application'); }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="content-area">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-surface-800">Application History</h1>
                <p className="text-surface-500 mt-1">Track all your job applications</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl text-primary-700">
                <Briefcase className="w-5 h-5" />
                <span className="font-bold">{applications.length}</span>
                <span className="text-sm font-medium tracking-wide uppercase">Total Applications</span>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                  <p className="text-surface-500 font-medium">Loading applications...</p>
                </div>
              </div>
            )}

            {error && (<div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>)}

            {!loading && applications.length === 0 && (
              <div className="text-center py-20">
                <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-surface-100 border border-surface-200 flex items-center justify-center">
                  <History className="w-12 h-12 text-surface-400" />
                </div>
                <h3 className="text-2xl font-bold text-surface-800 mb-2">No applications yet</h3>
                <p className="text-surface-500 max-w-md mx-auto text-lg">Start applying to jobs from the Dashboard and your application history will appear here.</p>
              </div>
            )}

            {!loading && applications.length > 0 && (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white border border-surface-200 shadow-card rounded-2xl p-5 sm:p-6 hover:shadow-card-hover transition-all duration-200">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-xl font-bold text-surface-800">{app.job_title}</h3>
                          <span className={`badge-platform ${platformColors[app.platform] || 'bg-surface-100 text-surface-600'}`}>{app.platform}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 mb-3">
                          <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" />{app.company}</span>
                          {app.location && (<span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{app.location}</span>)}
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(app.applied_at)}</span>
                        </div>
                        {app.salary && (<p className="text-sm font-medium text-surface-600">{app.salary}</p>)}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <select value={app.status} onChange={(e) => handleStatusUpdate(app.id, e.target.value)} className={`px-3 py-2 text-sm font-bold rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-primary-500/30 outline-none ${statusColors[app.status] || 'bg-surface-100 text-surface-600'}`}>
                          <option value="Applied">Applied</option><option value="Interview">Interview</option><option value="Offered">Offered</option><option value="Rejected">Rejected</option><option value="Withdrawn">Withdrawn</option>
                        </select>
                        <a href={app.link} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors" title="View Job"><ExternalLink className="w-4 h-4" /></a>
                        <button onClick={() => handleDelete(app.id)} className="p-2.5 rounded-xl hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors" title="Remove"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
