const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
});

const isConfigured = () => {
  return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key';
};

/**
 * Summarize a job description
 */
async function summarizeJob(description) {
  if (!isConfigured()) {
    return {
      summary: 'AI summarization requires an OpenAI API key. Please configure OPENAI_API_KEY in your .env file.',
      mock: true
    };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a career advisor. Summarize the following job description in 3-4 concise bullet points highlighting key responsibilities, requirements, and benefits.'
      },
      { role: 'user', content: description }
    ],
    max_tokens: 300,
    temperature: 0.5
  });

  return { summary: response.choices[0].message.content, mock: false };
}

/**
 * Extract skills from a job description
 */
async function extractSkills(description) {
  if (!isConfigured()) {
    return {
      skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Problem Solving'],
      mock: true
    };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Extract the key technical and soft skills from this job description. Return as a JSON array of strings. Only return the JSON array, no other text.'
      },
      { role: 'user', content: description }
    ],
    max_tokens: 200,
    temperature: 0.3
  });

  try {
    const skills = JSON.parse(response.choices[0].message.content);
    return { skills, mock: false };
  } catch {
    return { skills: response.choices[0].message.content.split(',').map(s => s.trim()), mock: false };
  }
}

/**
 * Match job to user profile
 */
async function matchJobToProfile(jobDescription, userProfile) {
  if (!isConfigured()) {
    const score = Math.floor(60 + Math.random() * 35);
    return {
      score,
      analysis: `Based on your profile, you have a ${score}% compatibility with this role. Key matching areas include your technical skills and experience level. Consider highlighting your relevant projects and certifications.`,
      mock: true
    };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a career matching expert. Analyze the compatibility between the job description and user profile. Provide: 1) A compatibility score (0-100), 2) Key matching strengths, 3) Gaps to address. Format: Start with "Score: XX" on the first line, then provide analysis.'
      },
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nUser Profile:\nName: ${userProfile.name}\nSkills: ${userProfile.skills || 'Not specified'}\nBio: ${userProfile.bio || 'Not specified'}`
      }
    ],
    max_tokens: 400,
    temperature: 0.5
  });

  const content = response.choices[0].message.content;
  const scoreMatch = content.match(/Score:\s*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;

  return { score, analysis: content, mock: false };
}

/**
 * Get job recommendations
 */
async function getRecommendations(userProfile, recentSearches) {
  if (!isConfigured()) {
    return {
      recommendations: [
        'Consider roles in Full Stack Development given your React and Node.js skills',
        'Look for companies offering remote work options in your preferred locations',
        'Explore Data Science roles to leverage your analytical abilities',
        'Consider applying to startups for faster career growth',
        'Upskill in cloud technologies (AWS/GCP) to increase marketability'
      ],
      mock: true
    };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a career advisor. Based on the user profile and their recent job searches, provide 5 personalized career recommendations. Be specific and actionable.'
      },
      {
        role: 'user',
        content: `Profile:\nName: ${userProfile.name}\nSkills: ${userProfile.skills || 'Not specified'}\nBio: ${userProfile.bio || 'Not specified'}\n\nRecent Searches: ${recentSearches || 'None'}`
      }
    ],
    max_tokens: 400,
    temperature: 0.7
  });

  const content = response.choices[0].message.content;
  const recommendations = content.split('\n').filter(line => line.trim().length > 0);

  return { recommendations, mock: false };
}

/**
 * Extract primary search keyword from profile for finding jobs
 */
async function getKeywordFromProfile(userProfile) {
  if (!userProfile.skills && !userProfile.bio) return 'Software Developer';
  
  if (!isConfigured()) {
    // Basic fallback: just use the first skill
    if (userProfile.skills) {
      const skillsArr = userProfile.skills.split(',').map(s => s.trim()).filter(s => s);
      if (skillsArr.length > 0) return skillsArr[0];
    }
    return 'Software Developer';
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a job search assistant. Based on the user profile (skills and bio), output a SINGLE primary job title that best fits the user to use as a search keyword. Output ONLY the title, nothing else. E.g., "Frontend Developer" or "Data Scientist".'
      },
      {
        role: 'user',
        content: `Skills: ${userProfile.skills || 'None'}\nBio: ${userProfile.bio || 'None'}`
      }
    ],
    max_tokens: 20,
    temperature: 0.3
  });

  return response.choices[0].message.content.trim();
}

/**
 * Filter jobs based on a natural language query
 */
async function smartFilterJobs(jobs, query) {
  if (!isConfigured() || !jobs || jobs.length === 0) {
    // If not configged, fallback to simple case-insensitive text search across the job objects
    const q = query.toLowerCase();
    const keptIds = jobs.filter(j => 
      j.title.toLowerCase().includes(q) || 
      j.company.toLowerCase().includes(q) || 
      j.location.toLowerCase().includes(q)
    ).map(j => j.id);
    return keptIds;
  }

  // Create a simplified representation of jobs for the prompt
  const simpleJobs = jobs.map(j => ({ id: j.id || j.title, t: j.title, c: j.company, l: j.location, s: j.salary, type: j.job_type }));

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a job filtering engine. The user provides a natural language filter query and a JSON array of jobs. Determine which jobs match the query exactly. Return ONLY a JSON array of the job IDs that match. If none match, return an empty array []. Do not include any explanations.'
      },
      { 
        role: 'user', 
        content: `Query: "${query}"\nJobs: ${JSON.stringify(simpleJobs)}` 
      }
    ],
    max_tokens: 500,
    temperature: 0.1
  });

  try {
    const keptIds = JSON.parse(response.choices[0].message.content);
    return keptIds;
  } catch (err) {
    console.error('Smart filter parse error:', err);
    return jobs.map(j => j.id); // Fallback to all if failed
  }
}

/**
 * AI Assistant chat
 */
async function chatAssistant(message, context) {
  if (!isConfigured()) {
    const responses = [
      "That's a great question! Based on current market trends, I'd recommend focusing on building projects that showcase your skills. Tailor your resume for each application and practice system design interviews.",
      "I'd suggest looking into roles that align with your skill set. Focus on companies that match your career goals. Don't forget to network on LinkedIn and attend tech meetups!",
      "For this type of role, you'll typically need strong problem-solving skills, good communication, and relevant technical experience. Consider getting certified in the key technologies mentioned in the job description."
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      mock: true
    };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an AI career assistant for a job search platform. Help users understand job requirements, evaluate their suitability for roles, provide career advice, and answer questions about the job market. Be concise, helpful, and encouraging. ${context ? `Context: ${context}` : ''}`
      },
      { role: 'user', content: message }
    ],
    max_tokens: 500,
    temperature: 0.7
  });

  return { response: response.choices[0].message.content, mock: false };
}

module.exports = { 
  summarizeJob, 
  extractSkills, 
  matchJobToProfile, 
  getRecommendations, 
  chatAssistant,
  getKeywordFromProfile,
  smartFilterJobs 
};
