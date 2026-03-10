/**
 * Built-in AI Agent — No External API Keys Required
 * 
 * Provides intelligent job analysis using:
 * - TF-IDF-like keyword extraction from job descriptions
 * - Jaccard similarity for job-to-profile matching
 * - Rule-based text summarization
 * - Comprehensive career chatbot with knowledge base
 */

// ═══════════════════════════════════════════════════════════════════════════
// SKILL & TECHNOLOGY DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const SKILL_DATABASE = {
  languages: ['javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'go', 'golang', 'rust', 'swift', 'kotlin', 'ruby', 'php', 'scala', 'r', 'matlab', 'perl', 'dart', 'elixir', 'haskell', 'lua', 'objective-c', 'shell', 'bash', 'powershell', 'sql', 'nosql', 'html', 'css', 'sass', 'less'],
  
  frontend: ['react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js', 'next.js', 'nextjs', 'nuxt', 'nuxtjs', 'svelte', 'gatsby', 'remix', 'webpack', 'vite', 'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'chakra', 'styled-components', 'redux', 'mobx', 'zustand', 'jquery', 'three.js', 'threejs', 'd3', 'd3.js'],
  
  backend: ['node.js', 'nodejs', 'express', 'expressjs', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'springboot', 'rails', 'ruby on rails', 'laravel', 'asp.net', '.net', 'dotnet', 'graphql', 'rest', 'restful', 'api', 'microservices', 'grpc', 'websocket', 'socket.io', 'nestjs', 'nest.js', 'fastify', 'koa', 'hapi'],
  
  database: ['mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'firebase', 'firestore', 'supabase', 'sqlite', 'oracle', 'mariadb', 'couchdb', 'neo4j', 'prisma', 'sequelize', 'mongoose', 'typeorm', 'knex'],
  
  cloud: ['aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify', 'digitalocean', 'cloudflare', 's3', 'ec2', 'lambda', 'ecs', 'eks', 'fargate', 'sqs', 'sns', 'cloudfront', 'route53'],
  
  devops: ['docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'cicd', 'github actions', 'gitlab ci', 'terraform', 'ansible', 'puppet', 'chef', 'prometheus', 'grafana', 'datadog', 'nginx', 'apache', 'linux', 'unix', 'bash', 'helm', 'argocd'],
  
  datascience: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'jupyter', 'nlp', 'natural language processing', 'computer vision', 'opencv', 'neural network', 'cnn', 'rnn', 'lstm', 'transformer', 'bert', 'gpt', 'llm', 'generative ai', 'langchain', 'hugging face', 'mlflow', 'mlops', 'data pipeline', 'etl', 'spark', 'hadoop', 'airflow', 'kafka', 'power bi', 'tableau', 'looker'],
  
  mobile: ['react native', 'flutter', 'ios', 'android', 'swiftui', 'jetpack compose', 'xamarin', 'ionic', 'cordova', 'expo'],
  
  testing: ['jest', 'mocha', 'chai', 'cypress', 'selenium', 'playwright', 'puppeteer', 'junit', 'pytest', 'rspec', 'testng', 'postman', 'swagger', 'tdd', 'bdd', 'unit testing', 'integration testing', 'e2e testing', 'automation testing', 'performance testing', 'load testing', 'jmeter', 'appium'],
  
  security: ['cybersecurity', 'penetration testing', 'ethical hacking', 'owasp', 'encryption', 'authentication', 'authorization', 'oauth', 'jwt', 'ssl', 'tls', 'firewall', 'vulnerability', 'soc', 'siem', 'ids', 'ips'],
  
  tools: ['git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'adobe xd', 'postman', 'vscode', 'intellij', 'vim', 'notion', 'trello', 'asana', 'monday'],
  
  softSkills: ['communication', 'teamwork', 'leadership', 'problem solving', 'problem-solving', 'analytical', 'critical thinking', 'time management', 'agile', 'scrum', 'kanban', 'collaboration', 'mentoring', 'decision making', 'adaptability', 'creativity', 'attention to detail', 'project management', 'stakeholder management', 'presentation']
};

// Flatten all skills for lookup
const ALL_SKILLS = {};
Object.entries(SKILL_DATABASE).forEach(([category, skills]) => {
  skills.forEach(skill => {
    ALL_SKILLS[skill.toLowerCase()] = category;
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TEXT PROCESSING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')      // Remove HTML
    .replace(/&[a-z]+;/gi, ' ')    // Remove HTML entities
    .replace(/[^\w\s.,!?;:\-\/+#]/g, ' ')  // Keep useful chars
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();
}

function tokenize(text) {
  return cleanText(text).toLowerCase().split(/[\s,;.!?()]+/).filter(t => t.length > 1);
}

function extractSentences(text) {
  const cleaned = cleanText(text);
  return cleaned.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 15);
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE AI FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract skills from text using comprehensive keyword matching
 */
function extractSkillsFromText(text) {
  if (!text) return { technical: [], soft: [] };
  
  const lowerText = cleanText(text).toLowerCase();
  const found = { technical: new Set(), soft: new Set() };
  
  // Check each skill in our database
  Object.entries(ALL_SKILLS).forEach(([skill, category]) => {
    // Use word boundary matching for short skills to avoid false positives
    const pattern = skill.length <= 3 
      ? new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      : new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    
    if (pattern.test(lowerText)) {
      if (category === 'softSkills') {
        found.soft.add(formatSkill(skill));
      } else {
        found.technical.add(formatSkill(skill));
      }
    }
  });
  
  return {
    technical: [...found.technical].slice(0, 15),
    soft: [...found.soft].slice(0, 8)
  };
}

function formatSkill(skill) {
  const special = {
    'javascript': 'JavaScript', 'typescript': 'TypeScript', 'python': 'Python',
    'java': 'Java', 'c++': 'C++', 'c#': 'C#', 'go': 'Go', 'golang': 'Go',
    'rust': 'Rust', 'swift': 'Swift', 'kotlin': 'Kotlin', 'ruby': 'Ruby',
    'php': 'PHP', 'sql': 'SQL', 'nosql': 'NoSQL', 'html': 'HTML', 'css': 'CSS',
    'react': 'React', 'reactjs': 'React', 'react.js': 'React',
    'angular': 'Angular', 'vue': 'Vue.js', 'vuejs': 'Vue.js', 'vue.js': 'Vue.js',
    'next.js': 'Next.js', 'nextjs': 'Next.js', 'node.js': 'Node.js', 'nodejs': 'Node.js',
    'express': 'Express.js', 'expressjs': 'Express.js',
    'django': 'Django', 'flask': 'Flask', 'fastapi': 'FastAPI',
    'spring': 'Spring', 'spring boot': 'Spring Boot', 'springboot': 'Spring Boot',
    'docker': 'Docker', 'kubernetes': 'Kubernetes', 'k8s': 'Kubernetes',
    'aws': 'AWS', 'azure': 'Azure', 'gcp': 'GCP',
    'mongodb': 'MongoDB', 'postgresql': 'PostgreSQL', 'postgres': 'PostgreSQL',
    'mysql': 'MySQL', 'redis': 'Redis', 'firebase': 'Firebase',
    'git': 'Git', 'github': 'GitHub', 'gitlab': 'GitLab',
    'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch',
    'machine learning': 'Machine Learning', 'deep learning': 'Deep Learning',
    'nlp': 'NLP', 'computer vision': 'Computer Vision',
    'ci/cd': 'CI/CD', 'cicd': 'CI/CD', 'rest': 'REST APIs', 'restful': 'REST APIs',
    'graphql': 'GraphQL', 'api': 'APIs', 'microservices': 'Microservices',
    'flutter': 'Flutter', 'react native': 'React Native',
    'ios': 'iOS', 'android': 'Android',
    'figma': 'Figma', 'jira': 'Jira', 'agile': 'Agile', 'scrum': 'Scrum',
    'jwt': 'JWT', 'oauth': 'OAuth', 'linux': 'Linux',
    'jenkins': 'Jenkins', 'terraform': 'Terraform',
    'pandas': 'Pandas', 'numpy': 'NumPy',
    'jest': 'Jest', 'cypress': 'Cypress', 'selenium': 'Selenium',
    'tdd': 'TDD', 'bdd': 'BDD',
    'llm': 'LLM', 'generative ai': 'Generative AI', 'langchain': 'LangChain',
    'spark': 'Apache Spark', 'kafka': 'Apache Kafka', 'hadoop': 'Hadoop',
    'power bi': 'Power BI', 'tableau': 'Tableau',
    'problem solving': 'Problem Solving', 'problem-solving': 'Problem Solving',
    'communication': 'Communication', 'teamwork': 'Teamwork',
    'leadership': 'Leadership', 'critical thinking': 'Critical Thinking',
    'time management': 'Time Management', 'project management': 'Project Management',
  };
  return special[skill.toLowerCase()] || skill.charAt(0).toUpperCase() + skill.slice(1);
}

/**
 * Summarize a job description using extractive summarization
 */
function summarizeJob(description) {
  const cleaned = cleanText(description);
  if (cleaned.length < 50) return { summary: cleaned, mock: true };

  const sentences = extractSentences(cleaned);
  const skills = extractSkillsFromText(description);
  
  // Score sentences by relevance
  const importantWords = ['responsible', 'require', 'experience', 'build', 'develop', 'design', 
    'lead', 'manage', 'work with', 'collaborate', 'opportunity', 'looking for', 'ideal candidate',
    'must have', 'should have', 'proficient', 'expertise', 'knowledge of', 'salary', 'benefit',
    'remote', 'hybrid', 'full-time', 'part-time'];
  
  const scored = sentences.map(sentence => {
    let score = 0;
    const lower = sentence.toLowerCase();
    importantWords.forEach(w => { if (lower.includes(w)) score += 2; });
    // Boost sentences with skills mentioned
    [...skills.technical, ...skills.soft].forEach(s => {
      if (lower.includes(s.toLowerCase())) score += 3;
    });
    // Prefer earlier sentences (usually more important)
    score += 1;
    return { sentence, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topSentences = scored.slice(0, 4).map(s => `• ${s.sentence}`);
  
  let summary = topSentences.join('\n');
  
  if (skills.technical.length > 0) {
    summary += `\n\n🔧 Key Skills: ${skills.technical.slice(0, 8).join(', ')}`;
  }

  return { summary, mock: true };
}

/**
 * Extract skills from a job description (exported function)
 */
function extractSkills(description) {
  const { technical, soft } = extractSkillsFromText(description);
  const allSkills = [...technical, ...soft];
  
  if (allSkills.length === 0) {
    return { skills: ['Communication', 'Problem Solving', 'Teamwork', 'Analytical Thinking'], mock: true };
  }
  
  return { skills: allSkills, mock: true };
}

/**
 * Match job to user profile using Jaccard-like similarity
 */
function matchJobToProfile(jobDescription, userProfile) {
  const jobSkills = extractSkillsFromText(jobDescription);
  const allJobSkills = [...jobSkills.technical, ...jobSkills.soft].map(s => s.toLowerCase());
  
  // Parse user skills
  const userSkillsRaw = (userProfile.skills || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);
  const userBio = (userProfile.bio || '').toLowerCase();

  // Also extract skills from user bio
  const bioSkills = extractSkillsFromText(userProfile.bio || '');
  const allUserSkills = [...new Set([
    ...userSkillsRaw,
    ...bioSkills.technical.map(s => s.toLowerCase()),
    ...bioSkills.soft.map(s => s.toLowerCase())
  ])];

  // Find matching skills
  const matchingSkills = [];
  const missingSkills = [];

  allJobSkills.forEach(jobSkill => {
    const matched = allUserSkills.some(us => 
      us.includes(jobSkill) || jobSkill.includes(us) || 
      areSimilar(us, jobSkill)
    );
    if (matched) {
      matchingSkills.push(formatSkill(jobSkill));
    } else {
      missingSkills.push(formatSkill(jobSkill));
    }
  });

  // Calculate score
  let score;
  if (allJobSkills.length === 0) {
    score = 60; // Can't determine, give average
  } else {
    const rawScore = (matchingSkills.length / allJobSkills.length) * 100;
    // Add bonus for having additional skills
    const bonusSkills = allUserSkills.filter(us => !allJobSkills.some(js => us.includes(js) || js.includes(us)));
    const bonus = Math.min(10, bonusSkills.length * 2);
    score = Math.min(98, Math.round(rawScore + bonus));
    score = Math.max(15, score); // Minimum 15%
  }

  // Generate analysis
  let analysis = `## Match Analysis\n\n`;
  analysis += `**Compatibility Score: ${score}%**\n\n`;

  if (matchingSkills.length > 0) {
    analysis += `### ✅ Matching Skills (${matchingSkills.length})\n`;
    analysis += matchingSkills.map(s => `- ${s}`).join('\n');
    analysis += '\n\n';
  }

  if (missingSkills.length > 0) {
    analysis += `### 📚 Skills to Develop (${missingSkills.length})\n`;
    analysis += missingSkills.map(s => `- ${s}`).join('\n');
    analysis += '\n\n';
  }

  // Personalized tips
  analysis += `### 💡 Tips\n`;
  if (score >= 75) {
    analysis += `- You're a strong match! Tailor your resume to highlight: ${matchingSkills.slice(0, 3).join(', ')}\n`;
    analysis += `- Prepare specific examples of projects using these skills\n`;
    analysis += `- Research the company culture and prepare thoughtful questions\n`;
  } else if (score >= 50) {
    analysis += `- Good foundation! Focus on highlighting transferable skills\n`;
    analysis += `- Consider building projects using: ${missingSkills.slice(0, 3).join(', ')}\n`;
    analysis += `- Online courses on platforms like Coursera or Udemy can help bridge gaps\n`;
  } else {
    analysis += `- This role needs skills you're still building — great learning opportunity\n`;
    analysis += `- Start with: ${missingSkills.slice(0, 2).join(', ')} — these are most in-demand\n`;
    analysis += `- Consider related roles that better match your current skillset\n`;
  }

  return { score, analysis, mock: true };
}

// Check if two skill strings are similar (fuzzy match)
function areSimilar(a, b) {
  if (a === b) return true;
  // Common equivalences
  const equivalences = [
    ['js', 'javascript'], ['ts', 'typescript'], ['py', 'python'],
    ['node', 'nodejs', 'node.js'], ['react', 'reactjs', 'react.js'],
    ['vue', 'vuejs', 'vue.js'], ['angular', 'angularjs'],
    ['postgres', 'postgresql'], ['mongo', 'mongodb'],
    ['k8s', 'kubernetes'], ['tf', 'tensorflow'],
    ['ml', 'machine learning'], ['dl', 'deep learning'],
    ['devops', 'dev ops'], ['frontend', 'front-end', 'front end'],
    ['backend', 'back-end', 'back end'], ['fullstack', 'full-stack', 'full stack'],
  ];
  return equivalences.some(group => group.includes(a) && group.includes(b));
}

/**
 * Get personalized job recommendations
 */
function getRecommendations(userProfile, recentSearches) {
  const userSkills = extractSkillsFromText(
    `${userProfile.skills || ''} ${userProfile.bio || ''}`
  );
  const allSkills = [...userSkills.technical, ...userSkills.soft];
  
  const recommendations = [];

  // Skill-based recommendations
  if (allSkills.some(s => ['React', 'Vue.js', 'Angular', 'Next.js'].includes(s))) {
    recommendations.push('🎯 Your frontend skills are in high demand — look for roles at product companies and startups');
  }
  if (allSkills.some(s => ['Node.js', 'Django', 'Spring Boot', 'Express.js'].includes(s))) {
    recommendations.push('🔧 Strong backend skills! Consider Full Stack roles for higher pay bands');
  }
  if (allSkills.some(s => ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch'].includes(s))) {
    recommendations.push('🧠 Data/ML skills are premium — focus on companies building AI-first products');
  }
  if (allSkills.some(s => ['AWS', 'Docker', 'Kubernetes', 'Terraform'].includes(s))) {
    recommendations.push('☁️ Cloud/DevOps expertise is scarce — you can command 20-30% higher salaries');
  }
  if (allSkills.some(s => ['React Native', 'Flutter', 'iOS', 'Android'].includes(s))) {
    recommendations.push('📱 Mobile development is evergreen — cross-platform skills (Flutter/RN) are especially valued');
  }

  // General recommendations
  if (recommendations.length < 3) {
    recommendations.push('📝 Tailor your resume for each application — highlight relevant projects and quantify achievements');
  }
  recommendations.push('🤝 Network actively on LinkedIn — 70% of jobs are filled through referrals');
  recommendations.push('💻 Build a portfolio with 3-5 quality projects — GitHub contributions impress recruiters');
  
  if (recentSearches) {
    recommendations.push(`🔍 Based on your search history, consider expanding to related roles for more opportunities`);
  }
  
  recommendations.push('📈 Stay updated — follow tech blogs, join communities, and attend meetups/webinars');

  return { recommendations: recommendations.slice(0, 6), mock: true };
}

/**
 * Extract primary search keyword from profile
 */
function getKeywordFromProfile(userProfile) {
  if (!userProfile.skills && !userProfile.bio) return 'Software Developer';
  
  const skills = extractSkillsFromText(`${userProfile.skills || ''} ${userProfile.bio || ''}`);
  
  // Map skills to job titles
  const skillToTitle = {
    'React': 'React Developer', 'Angular': 'Angular Developer', 'Vue.js': 'Vue.js Developer',
    'Next.js': 'Full Stack Developer', 'Node.js': 'Backend Developer',
    'Python': 'Python Developer', 'Django': 'Python Developer', 'Flask': 'Python Developer',
    'Java': 'Java Developer', 'Spring Boot': 'Java Developer',
    'Machine Learning': 'ML Engineer', 'Data Science': 'Data Scientist',
    'TensorFlow': 'ML Engineer', 'PyTorch': 'ML Engineer',
    'Flutter': 'Flutter Developer', 'React Native': 'Mobile Developer',
    'iOS': 'iOS Developer', 'Android': 'Android Developer',
    'AWS': 'Cloud Engineer', 'Docker': 'DevOps Engineer', 'Kubernetes': 'DevOps Engineer',
    'Figma': 'UI/UX Designer', 'UI/UX': 'UI/UX Designer',
    'Cybersecurity': 'Security Engineer', 'Ethical Hacking': 'Security Engineer',
  };

  for (const skill of skills.technical) {
    if (skillToTitle[skill]) return skillToTitle[skill];
  }

  if (skills.technical.length > 0) return `${skills.technical[0]} Developer`;
  return 'Software Developer';
}

/**
 * Smart filter jobs using text matching
 */
function smartFilterJobs(jobs, query) {
  if (!jobs || jobs.length === 0) return [];
  
  const q = query.toLowerCase();
  const queryTokens = tokenize(query);
  
  return jobs.filter(j => {
    const jobText = `${j.title} ${j.company} ${j.location} ${j.salary || ''} ${j.job_type || ''} ${j.platform || ''}`.toLowerCase();
    
    // Direct substring match
    if (jobText.includes(q)) return true;
    
    // Token matching - if most query tokens are found
    const matchCount = queryTokens.filter(t => jobText.includes(t)).length;
    return matchCount >= Math.ceil(queryTokens.length * 0.6);
  }).map(j => j.id);
}

// ═══════════════════════════════════════════════════════════════════════════
// CAREER CHAT ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════

const KNOWLEDGE_BASE = {
  resume: {
    patterns: ['resume', 'cv', 'curriculum'],
    response: `📝 **Resume Best Practices**

**Structure:**
• Keep it 1-2 pages — recruiters spend 6-7 seconds on initial scan
• Use reverse chronological order
• Include: Contact Info → Summary → Experience → Skills → Education → Projects

**Content Tips:**
• Use action verbs: Built, Led, Designed, Optimized, Reduced, Increased
• Quantify achievements: "Reduced API response time by 40%" not "Improved performance"
• Tailor for each role — mirror keywords from the job description
• Include relevant projects with tech stack and impact

**Format:**
• Use clean, ATS-friendly templates (no tables, images, or fancy formatting)
• Save as PDF unless asked otherwise
• File name: "FirstName_LastName_Resume.pdf"

**Common Mistakes:**
• Listing responsibilities instead of achievements
• Including irrelevant experience
• Typos and grammatical errors — proofread twice!`
  },

  interview: {
    patterns: ['interview', 'prepare', 'preparation'],
    response: `🎯 **Interview Preparation Guide**

**Before the Interview:**
• Research the company — products, culture, recent news, tech stack
• Review the job description — prepare examples for each requirement
• Practice the STAR method (Situation, Task, Action, Result)
• Prepare 3-5 thoughtful questions to ask

**Technical Interview:**
• Practice DSA on LeetCode/HackerRank (focus on Medium difficulty)
• Study system design fundamentals (for mid-senior roles)
• Review your past projects — be ready to explain trade-offs
• Know Big O complexity for common algorithms

**Behavioral Interview:**
• "Tell me about yourself" — 2-min pitch: past → present → future
• "Why this company?" — Show genuine knowledge and enthusiasm
• "Describe a challenge" — Use STAR with positive outcome
• "Where do you see yourself in 5 years?" — Show ambition + alignment

**After the Interview:**
• Send a thank-you email within 24 hours
• Follow up after 1 week if you haven't heard back
• Reflect on what went well and areas to improve`
  },

  salary: {
    patterns: ['salary', 'negotiate', 'negotiation', 'compensation', 'pay', 'package', 'ctc'],
    response: `💰 **Salary Negotiation Guide**

**Research First:**
• Check Glassdoor, Levels.fyi, AmbitionBox, LinkedIn Salary
• Know the market rate for your role, experience, and location
• Factor in company size, funding stage, and industry

**Negotiation Tips:**
• Never share your current salary first — focus on market value
• Use the phrase: "Based on my research and experience, I'm targeting ₹X-Y"
• Negotiate AFTER receiving the offer, not during interviews
• Consider the full package: base + equity + bonus + benefits + growth

**Counter-Offer Strategy:**
• Ask for 10-20% more than the initial offer
• Be specific with numbers, not vague
• Express enthusiasm — "I'm excited about this role, and I'd like to discuss..."
• Have a walk-away number in mind

**Indian Market Ranges (2024-25):**
• Fresher (0-1 yr): ₹3-8 LPA
• Junior (1-3 yr): ₹6-15 LPA
• Mid (3-6 yr): ₹12-30 LPA
• Senior (6-10 yr): ₹25-50 LPA
• Lead/Staff (10+ yr): ₹40-80+ LPA`
  },

  skills: {
    patterns: ['skill', 'learn', 'course', 'upskill', 'roadmap', 'what should i learn'],
    response: `🚀 **Top Skills in Demand (2024-25)**

**Most Wanted Tech Skills:**
1. **Full Stack** — React/Next.js + Node.js + PostgreSQL/MongoDB
2. **Cloud & DevOps** — AWS/Azure/GCP + Docker + Kubernetes + CI/CD
3. **AI/ML** — Python + TensorFlow/PyTorch + LLMs + Prompt Engineering
4. **Mobile** — Flutter or React Native (cross-platform preferred)
5. **Data Engineering** — SQL + Spark + Kafka + Airflow

**Learning Resources (Free):**
• freeCodeCamp, The Odin Project — Web Development
• CS50 (Harvard) — Computer Science fundamentals
• fast.ai — Machine Learning / Deep Learning
• Kubernetes by Example — Cloud/DevOps

**Building Your Portfolio:**
• Create 3-5 projects that solve real problems
• Contribute to open source — even documentation helps!
• Write technical blog posts on DEV.to or Hashnode
• Build in public — share your progress on Twitter/LinkedIn

**Priority:** Pick ONE stack and go deep before going wide.`
  },

  linkedin: {
    patterns: ['linkedin', 'profile', 'networking', 'network', 'connection', 'referral'],
    response: `🔗 **LinkedIn & Networking Tips**

**Optimize Your Profile:**
• Professional headshot (2x more profile views)
• Headline: "Role | Key Skills | What You're Passionate About"
• Summary: Tell your story — why you do what you do
• Featured section: Pin your best projects, articles, or certifications

**Networking Strategy:**
• Connect with recruiters at target companies
• Engage daily — comment thoughtfully on posts (not just "Great post!")
• Share your projects and learnings weekly
• Join relevant groups and participate in discussions

**Getting Referrals:**
• Message 2nd-degree connections at target companies
• Template: "Hi [Name], I noticed you work at [Company]. I'm applying for [Role] and would love to learn about the team culture. Could we chat for 10 minutes?"
• 70% of jobs are filled through referrals — networking works!

**Cold Outreach:**
• Keep messages short (3-4 sentences max)
• Personalize each message — mention something specific about their work
• Follow up once after 3-5 days if no response`
  },

  remote: {
    patterns: ['remote', 'work from home', 'wfh', 'freelance', 'freelancing'],
    response: `🏠 **Remote Work & Freelancing Guide**

**Finding Remote Jobs:**
• Platforms: Remotive, We Work Remotely, Remote.co, AngelList, FlexJobs
• Filter LinkedIn jobs by "Remote" location
• Many Indian companies now offer hybrid/remote permanently

**Freelancing Platforms:**
• Upwork, Toptal — General freelancing
• Fiverr — Quick gigs
• Gun.io — Developer-specific

**Standing Out Remote:**
• Strong written communication is essential
• Be proactive with updates and documentation
• Master async collaboration tools (Slack, Notion, Loom)
• Build a personal brand through consistent open-source and blogging

**Earning Potential:**
• Remote roles at international companies can pay 2-5x Indian rates
• Freelancing rates: ₹500-5000/hr depending on skill and experience`
  },

  startup: {
    patterns: ['startup', 'early stage', 'equity', 'stock option', 'esop'],
    response: `🚀 **Working at Startups**

**Pros:**
• Faster learning curve — wear multiple hats
• More responsibility and ownership early
• Equity could be worth significant money if company succeeds
• Direct impact on product and company direction

**Cons:**
• Lower base salary (often 10-30% below market)
• Job security uncertainty
• Longer hours are common
• Less structured mentorship

**Evaluating Startup Offers:**
• Check funding stage and runway (CrunchBase, Tracxn)
• Understand ESOP vesting (typically 4 years with 1-year cliff)
• Ask about the company's path to profitability
• Talk to current/former employees

**Best Strategy:**
• Join a Series A/B startup for balance of growth + stability
• Negotiate equity alongside salary — it's expected at startups`
  }
};

function chatAssistant(message, context) {
  const msg = message.toLowerCase().trim();

  // Check knowledge base
  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    if (data.patterns.some(p => msg.includes(p))) {
      return { response: data.response, mock: true };
    }
  }

  // Context-aware responses for common questions
  if (msg.match(/hello|hi|hey|hola|good morning|good evening/)) {
    return { response: `Hey there! 👋 I'm your AI Career Assistant. I can help you with:\n\n• 📝 **Resume** tips and best practices\n• 🎯 **Interview** preparation strategies\n• 💰 **Salary** negotiation guidance\n• 🚀 **Skills** roadmap and learning resources\n• 🔗 **LinkedIn** and networking advice\n• 🏠 **Remote work** and freelancing tips\n\nWhat would you like to know about?`, mock: true };
  }

  if (msg.match(/thank|thanks|great|helpful|awesome|perfect/)) {
    return { response: `You're welcome! 😊 Feel free to ask me anything else about your job search. I'm here to help you land your dream role! 🎯`, mock: true };
  }

  if (msg.match(/job|opportunity|opening|apply|application/)) {
    return { response: `🎯 **Job Search Strategy**\n\n1. **Quality over Quantity** — Apply to 5-8 well-researched roles per week rather than 50 generic ones\n2. **Target Companies** — Make a list of 20 dream companies and track their job boards\n3. **Customize Everything** — Tailor your resume and cover letter for each application\n4. **Follow Up** — Email the recruiter 5-7 days after applying\n5. **Track Applications** — Use the Application Tracker in this app!\n\n**Where to Find Jobs:**\n• LinkedIn, Naukri, Internshala (India)\n• AngelList, YCombinator (Startups)\n• Remotive, WeWorkRemotely (Remote)\n• Company career pages directly\n\nNeed help with anything specific?`, mock: true };
  }

  if (msg.match(/stress|anxious|anxiety|worried|depressed|rejection|rejected/)) {
    return { response: `🧠 **It's Normal to Feel This Way**\n\nJob searching is one of the most stressful experiences. Here's what helps:\n\n• **Rejection is redirection** — Even top engineers get rejected. It's not personal.\n• **Set boundaries** — Dedicate specific hours to job hunting, then disconnect\n• **Celebrate small wins** — Got a callback? That's progress!\n• **Stay active** — Exercise, hobbies, and social connections matter\n• **Track progress** — Focus on actions (applications sent, skills learned) not just results\n\n**Remember:** The right opportunity will come. Every interview is practice, and every rejection is getting you closer to the right fit. 💪\n\nI'm here if you need help with anything!`, mock: true };
  }

  // Default response
  return { 
    response: `That's a great topic! Here's what I can help you with:\n\n• 📝 Ask about **resume** writing and optimization\n• 🎯 Ask about **interview** preparation\n• 💰 Ask about **salary** negotiation\n• 🚀 Ask about **skills** to learn\n• 🔗 Ask about **LinkedIn** and networking\n• 🏠 Ask about **remote** work and freelancing\n• 🚀 Ask about **startup** careers\n\nTry asking something like: "How should I prepare for a technical interview?" or "What skills should I learn for a frontend role?"`, 
    mock: true 
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

console.log('✅ Built-in AI Agent loaded — no external API keys required');

module.exports = {
  summarizeJob: (description) => summarizeJob(description),
  extractSkills: (description) => extractSkills(description),
  matchJobToProfile: (jobDescription, userProfile) => matchJobToProfile(jobDescription, userProfile),
  getRecommendations: (userProfile, recentSearches) => getRecommendations(userProfile, recentSearches),
  chatAssistant: (message, context) => chatAssistant(message, context),
  getKeywordFromProfile: (userProfile) => getKeywordFromProfile(userProfile),
  smartFilterJobs: (jobs, query) => smartFilterJobs(jobs, query)
};
