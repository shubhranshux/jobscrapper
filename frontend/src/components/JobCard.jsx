import { ExternalLink, MapPin, Building2, Sparkles, CheckCircle, Loader2, Target } from 'lucide-react';
import { useState } from 'react';

const platformColors = {
  LinkedIn: 'from-blue-500 to-blue-600',
  Naukri: 'from-purple-500 to-purple-600',
  Internshala: 'from-emerald-500 to-emerald-600',
  Unstop: 'from-orange-500 to-orange-600',
};

const platformBg = {
  LinkedIn: 'bg-blue-50 border-blue-200',
  Naukri: 'bg-purple-50 border-purple-200',
  Internshala: 'bg-emerald-50 border-emerald-200',
  Unstop: 'bg-orange-50 border-orange-200',
};

export default function JobCard({ job, onApply, onAISummary, onMatchResume, isApplied }) {
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    await onApply(job);
    setApplying(false);
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${platformBg[job.platform] || 'bg-white border-surface-200'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 text-xs font-bold text-white rounded-lg bg-gradient-to-r ${platformColors[job.platform] || 'from-gray-500 to-gray-600'}`}>
          {job.platform}
        </span>
        {job.salary && (
          <span className="text-sm font-semibold text-surface-600">{job.salary}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-surface-800 mb-2 line-clamp-2">{job.title}</h3>

      {/* Meta */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-surface-500">
          <Building2 className="w-4 h-4" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-500">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
      </div>

      {/* Type badge */}
      {job.job_type && (
        <span className="inline-block px-2.5 py-1 text-xs font-medium bg-white/80 text-surface-600 rounded-md mb-4">
          {job.job_type}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-black/5">
        {isApplied ? (
          <span className="flex items-center gap-1.5 flex-1 justify-center py-2 text-sm font-semibold text-accent-600">
            <CheckCircle className="w-4 h-4" />
            Applied
          </span>
        ) : (
          <button
            onClick={handleApply}
            disabled={applying}
            className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Apply Now
          </button>
        )}

        {onMatchResume && (
          <button
            onClick={() => onMatchResume(job)}
            className="p-2 rounded-lg hover:bg-white/60 text-surface-400 hover:text-orange-500 transition-colors"
            title="Match Resume"
          >
            <Target className="w-4 h-4" />
          </button>
        )}

        {onAISummary && (
          <button
            onClick={() => onAISummary(job)}
            className="p-2 rounded-lg hover:bg-white/60 text-surface-400 hover:text-primary-500 transition-colors"
            title="AI Summary"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-white/60 text-surface-400 hover:text-surface-600 transition-colors"
          title="Open Job Link"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
