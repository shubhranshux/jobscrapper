import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const keywordSuggestions = [
  // Engineering & Development
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'React Developer', 'Node.js Developer', 'Python Developer', 'Java Developer',
  'Android Developer', 'iOS Developer', 'Mobile Developer', 'Flutter Developer',
  'React Native Developer', 'MERN Stack Developer', 'MEAN Stack Developer',
  'Angular Developer', 'Vue.js Developer', 'Next.js Developer', 'TypeScript Developer',
  'Spring Boot Developer', 'Django Developer', 'Laravel Developer', '.NET Developer',
  'Go Developer', 'Rust Developer', 'C++ Developer', 'PHP Developer', 'Ruby Developer',
  'Embedded Systems Engineer', 'Firmware Engineer', 'Microservices Developer',
  'API Developer', 'GraphQL Developer', 'Blockchain Developer', 'Web3 Developer',
  'Smart Contract Developer', 'Salesforce Developer', 'SAP Developer', 'ERP Developer',
  'WordPress Developer', 'Shopify Developer', 'Game Developer', 'Unity Developer',
  'SDE-1', 'SDE-2', 'SDE-3', 'Staff Engineer', 'Principal Engineer',
  'Software Engineer Intern', 'Junior Developer', 'Senior Software Engineer',
  // Data & AI
  'Data Scientist', 'Data Analyst', 'Data Engineer', 'Machine Learning Engineer',
  'AI Engineer', 'Deep Learning Engineer', 'NLP Engineer', 'Computer Vision Engineer',
  'MLOps Engineer', 'AI Research Scientist', 'Business Intelligence Analyst',
  'Big Data Engineer', 'ETL Developer', 'Spark Developer', 'Hadoop Developer',
  'Power BI Developer', 'Tableau Developer', 'Analytics Manager',
  'Quantitative Analyst', 'Statistician', 'Prompt Engineer', 'LLM Engineer',
  // Cloud & DevOps
  'DevOps Engineer', 'Cloud Engineer', 'AWS Solutions Architect', 'Azure Engineer',
  'GCP Engineer', 'Site Reliability Engineer', 'Platform Engineer',
  'Kubernetes Engineer', 'Infrastructure Engineer', 'Network Engineer',
  'Linux Administrator', 'Systems Administrator', 'CI/CD Engineer',
  // Security
  'Cybersecurity Analyst', 'Security Engineer', 'Penetration Tester',
  'Ethical Hacker', 'SOC Analyst', 'Cloud Security Engineer', 'CISO',
  // QA & Testing
  'QA Engineer', 'SDET', 'Automation Test Engineer', 'Performance Tester',
  'Manual Tester', 'Selenium Tester', 'Test Architect',
  // Design
  'UI/UX Designer', 'Product Designer', 'Visual Designer', 'UX Researcher',
  'Interaction Designer', 'Graphic Designer', 'Motion Designer', 'Web Designer',
  '3D Designer', 'Design Lead', 'Creative Director',
  // Management & Strategy
  'Product Manager', 'Project Manager', 'Scrum Master', 'Agile Coach',
  'Engineering Manager', 'Technical Program Manager', 'Delivery Manager',
  'Solutions Architect', 'Technical Lead', 'CTO', 'VP Engineering',
  // Business & Operations
  'Business Analyst', 'Management Consultant', 'Operations Manager',
  'Account Manager', 'Customer Success Manager', 'Sales Engineer',
  'Pre-Sales Consultant', 'Business Development Manager',
  // Marketing & Content
  'Digital Marketing Manager', 'Content Writer', 'SEO Specialist',
  'Social Media Manager', 'Growth Hacker', 'Performance Marketing',
  'Brand Manager', 'Content Strategist', 'Copywriter', 'PPC Specialist',
  'Email Marketing Specialist', 'Community Manager',
  // HR & Recruiting
  'HR Manager', 'Technical Recruiter', 'Talent Acquisition Specialist',
  'HR Business Partner', 'People Operations Manager',
  // Other
  'Technical Writer', 'Database Administrator', 'Support Engineer',
  'Implementation Specialist', 'IT Manager', 'Help Desk Engineer',
  'Finance Analyst', 'Investment Banker', 'Chartered Accountant',
  'Supply Chain Manager', 'Logistics Manager', 'Operations Analyst',
];

export default function SearchBar({ onSearch, loading }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  // Keyword suggestions
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
  const keywordInputRef = useRef(null);
  const keywordSuggestionsRef = useRef(null);

  // Location suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const locationInputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Filter keyword suggestions based on input
  useEffect(() => {
    if (keyword.trim().length === 0) {
      setFilteredKeywords(keywordSuggestions.slice(0, 8));
    } else {
      const filtered = keywordSuggestions.filter(s =>
        s.toLowerCase().includes(keyword.toLowerCase())
      ).slice(0, 8);
      setFilteredKeywords(filtered);
    }
  }, [keyword]);

  // Fetch location suggestions
  const fetchSuggestions = async (query) => {
    try {
      setLoadingSuggestions(true);
      const res = await api.get(`/locations/search?q=${encodeURIComponent(query)}&limit=8`);
      setSuggestions(res.data.locations || []);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounced search on location input change
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (location.length === 0) {
      fetchSuggestions('');
      return;
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(location);
    }, 200);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [location]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          locationInputRef.current && !locationInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (keywordSuggestionsRef.current && !keywordSuggestionsRef.current.contains(e.target) &&
          keywordInputRef.current && !keywordInputRef.current.contains(e.target)) {
        setShowKeywordSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setShowSuggestions(false);
  };

  const handleSelectKeyword = (kw) => {
    setKeyword(kw);
    setShowKeywordSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setShowSuggestions(false);
      setShowKeywordSuggestions(false);
      onSearch(keyword.trim(), location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Keyword Input with Suggestions */}
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors z-10" />
          <input
            ref={keywordInputRef}
            type="text"
            placeholder="Job title, skill, or keyword..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowKeywordSuggestions(true);
            }}
            onFocus={() => setShowKeywordSuggestions(true)}
            className="input-field pl-12"
            autoComplete="off"
          />

          {/* Keyword Suggestions Dropdown */}
          {showKeywordSuggestions && filteredKeywords.length > 0 && (
            <div
              ref={keywordSuggestionsRef}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl border border-surface-200 shadow-elevated z-50 overflow-hidden animate-slide-down"
            >
              <div className="max-h-60 overflow-y-auto">
                <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-surface-400 bg-surface-50">
                  {keyword.trim() ? 'Suggestions' : 'Popular Searches'}
                </div>
                {filteredKeywords.map((kw, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectKeyword(kw)}
                    className="flex items-center gap-3 w-full px-5 py-3 text-left text-sm font-medium text-surface-600 hover:bg-surface-50 hover:text-surface-800 transition-colors"
                  >
                    <Search className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span>{kw}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location Input with Autocomplete */}
        <div className="relative sm:w-72 group">
          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors z-10" />
          <input
            ref={locationInputRef}
            type="text"
            placeholder="City or 'Remote'"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="input-field pl-12 pr-10"
            autoComplete="off"
          />
          {location && (
            <button
              type="button"
              onClick={() => { setLocation(''); setShowSuggestions(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Location Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl border border-surface-200 shadow-elevated z-50 overflow-hidden animate-slide-down"
            >
              {loadingSuggestions && (
                <div className="px-5 py-3 text-sm text-surface-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </div>
              )}
              <div className="max-h-60 overflow-y-auto">
                {!location && (
                  <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-surface-400 bg-surface-50">
                    Popular Locations
                  </div>
                )}
                {location && suggestions.length > 0 && (
                  <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-surface-400 bg-surface-50">
                    Suggestions
                  </div>
                )}
                {suggestions.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className="flex items-center gap-3 w-full px-5 py-3 text-left text-sm font-medium text-surface-600 hover:bg-surface-50 hover:text-surface-800 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span>{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results hint */}
          {showSuggestions && location.length > 1 && suggestions.length === 0 && !loadingSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl border border-surface-200 shadow-elevated z-50 p-5 animate-slide-down"
            >
              <p className="text-sm font-medium text-surface-400 text-center">
                No matching location found. Try a different spelling.
              </p>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={!keyword.trim() || loading}
          className="btn-primary flex items-center justify-center gap-2 sm:w-auto whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scraping...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Scrape Jobs</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
