import { ExternalLink, Sparkles, CheckCircle, Loader2, Target, Search } from 'lucide-react';
import { useState } from 'react';

const platformColors = {
  LinkedIn: 'bg-blue-50 text-blue-700 border border-blue-200',
  Naukri: 'bg-purple-50 text-purple-700 border border-purple-200',
  Internshala: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Unstop: 'bg-orange-50 text-orange-700 border border-orange-200',
};

export default function JobTable({ jobs, onApply, onAISummary, onMatchResume, appliedJobs = [] }) {
  const [applyingId, setApplyingId] = useState(null);

  const handleApply = async (job) => {
    setApplyingId(job.id);
    await onApply(job);
    setApplyingId(null);
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center">
          <Search className="w-10 h-10 text-surface-400" />
        </div>
        <h3 className="text-lg font-bold text-surface-800 mb-2">No jobs found</h3>
        <p className="text-surface-500">Search for jobs to see results here</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-surface-200 bg-surface-50">
            <th className="text-left py-4 px-5 text-xs font-bold text-surface-500 uppercase tracking-widest">Job Title</th>
            <th className="text-left py-4 px-5 text-xs font-bold text-surface-500 uppercase tracking-widest hidden md:table-cell">Company</th>
            <th className="text-left py-4 px-5 text-xs font-bold text-surface-500 uppercase tracking-widest hidden lg:table-cell">Location</th>
            <th className="text-left py-4 px-5 text-xs font-bold text-surface-500 uppercase tracking-widest">Platform</th>
            <th className="text-left py-4 px-5 text-xs font-bold text-surface-500 uppercase tracking-widest hidden xl:table-cell">Salary</th>
            <th className="text-right py-4 px-5 text-xs font-bold text-surface-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, idx) => {
            const isApplied = appliedJobs.includes(job.id);
            return (
              <tr key={job.id || idx} className="table-row group">
                <td className="py-4 px-5">
                  <div>
                    <p className="font-bold text-surface-800 group-hover:text-primary-600 transition-colors">{job.title}</p>
                    <p className="text-sm text-surface-500 md:hidden mt-0.5">{job.company}</p>
                  </div>
                </td>
                <td className="py-4 px-5 hidden md:table-cell">
                  <p className="text-surface-600 font-medium">{job.company}</p>
                </td>
                <td className="py-4 px-5 hidden lg:table-cell">
                  <p className="text-surface-500 text-sm">{job.location}</p>
                </td>
                <td className="py-4 px-5">
                  <span className={`badge-platform ${platformColors[job.platform] || 'bg-surface-100 text-surface-600'}`}>
                    {job.platform}
                  </span>
                </td>
                <td className="py-4 px-5 hidden xl:table-cell">
                  <p className="text-surface-500 text-sm">{job.salary || 'N/A'}</p>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center justify-end gap-2">
                    {onMatchResume && (
                      <button
                        onClick={() => onMatchResume(job)}
                        className="p-2 rounded-lg hover:bg-orange-50 text-surface-400 hover:text-orange-600 transition-colors"
                        title="Match Resume"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    )}
                    {onAISummary && (
                      <button
                        onClick={() => onAISummary(job)}
                        className="p-2 rounded-lg hover:bg-primary-50 text-surface-400 hover:text-primary-600 transition-colors"
                        title="AI Summary"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    )}
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors"
                      title="View Job"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {isApplied ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(job)}
                        disabled={applyingId === job.id}
                        className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {applyingId === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        Apply
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
