/**
 * Location Service using OpenStreetMap Nominatim API
 * Provides real-time, limitless global location search and validation.
 */

// A fallback list of major tech hubs in case the API rate limits or fails
const fallbackLocations = [
  'Bangalore, India', 'Mumbai, India', 'Hyderabad, India', 'Delhi NCR, India', 
  'Pune, India', 'Chennai, India', 'San Francisco, USA', 'New York, USA', 
  'London, UK', 'Remote', 'Work From Home'
];

/**
 * Search locations using OpenStreetMap Nominatim API
 * @param {string} query Search query
 * @param {number} limit Max results
 * @returns {Promise<Array<{name: string, type: string}>>}
 */
async function searchLocationsAPI(query, limit = 5) {
  if (!query || query.trim().length === 0) {
    return fallbackLocations.map(name => ({ name, type: 'fallback' }));
  }

  try {
    // Nominatim requires a User-Agent header for public API usage
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${limit}`,
      {
        headers: {
          'User-Agent': 'JobScrapperAI/1.0 (Contact: admin@jobscrapper.test)'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Location API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Format the results to display nicely (City, State, Country)
    const results = data.map(item => {
      let parts = [];
      const addr = item.address;
      
      if (addr) {
        if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
        if (addr.state) parts.push(addr.state);
        if (addr.country) parts.push(addr.country);
      }

      // Fallback to display_name if address details are sparse
      const displayName = parts.length > 0 ? parts.join(', ') : item.display_name;

      return {
        name: displayName,
        type: item.type || 'place',
        lat: item.lat,
        lon: item.lon
      };
    });

    // Remove duplicates based on name
    const uniqueResults = [];
    const seen = new Set();
    for (const res of results) {
      if (!seen.has(res.name)) {
        seen.add(res.name);
        uniqueResults.push(res);
      }
    }

    return uniqueResults.length > 0 ? uniqueResults : [];
  } catch (error) {
    console.error('Location search error:', error.message);
    // If API fails, just format the user's query nicely as a fallback
    return [{ name: formatFallback(query), type: 'fallback' }];
  }
}

/**
 * Capitalize every word for a fallback formatting
 */
function formatFallback(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

/**
 * Validates and corrects a location string using the API
 * Returns the first valid result, or the original query if not found
 */
async function validateAndCorrectLocation(query) {
  if (!query) return null;
  
  // Don't validate "Remote" variations via maps API
  const lowerQ = query.toLowerCase();
  if (lowerQ.includes('remote') || lowerQ.includes('home') || lowerQ.includes('wfh')) {
    return 'Remote';
  }

  const results = await searchLocationsAPI(query, 1);
  if (results && results.length > 0 && results[0].type !== 'fallback') {
    return results[0].name; // The corrected, formatted location
  }
  
  return formatFallback(query);
}

function getRandomFallback() {
  return fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
}

module.exports = { 
  searchLocationsAPI, 
  validateAndCorrectLocation,
  getRandomFallback
};
