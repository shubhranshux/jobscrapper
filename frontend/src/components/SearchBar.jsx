import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function SearchBar({ onSearch, loading }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const locationInputRef = useRef(null);
  const debounceTimer = useRef(null);

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
      // Show popular locations when empty
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

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          locationInputRef.current && !locationInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setShowSuggestions(false);
      onSearch(keyword.trim(), location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Keyword Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Job title, skill, or keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-field pl-12"
          />
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

          {/* Suggestions Dropdown */}
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
