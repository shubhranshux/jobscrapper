/**
 * Utility helpers
 */

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function sanitizeInput(str) {
  if (!str) return '';
  return str.replace(/[<>"'&]/g, (char) => {
    const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
    return entities[char] || char;
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = { formatDate, sanitizeInput, generateId };
