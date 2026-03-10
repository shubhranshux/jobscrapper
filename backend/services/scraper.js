/**
 * Job Scraper Service
 * Uses realistic mock data with pluggable interface for real scrapers.
 * Each platform function can be replaced with actual scraping logic.
 */

// ─── Massive Company Database ───────────────────────────────────────────────
// Organized by industry for realistic results

const companiesByIndustry = {
  bigTech: [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'NVIDIA',
    'Intel', 'AMD', 'IBM', 'Oracle', 'Salesforce', 'Adobe', 'SAP', 'VMware',
    'Cisco', 'Qualcomm', 'Broadcom', 'Texas Instruments', 'Micron', 'Dell Technologies',
    'HP Inc.', 'Hewlett Packard Enterprise', 'Lenovo', 'Samsung Electronics',
    'Sony', 'LG Electronics', 'Panasonic', 'Toshiba', 'Huawei', 'Xiaomi',
    'Spotify', 'Uber', 'Lyft', 'Airbnb', 'DoorDash', 'Snap Inc.', 'Pinterest',
    'Twitter/X', 'Reddit', 'Discord', 'Slack', 'Zoom', 'Dropbox', 'Box',
    'Palantir Technologies', 'Snowflake', 'Databricks', 'Confluent', 'HashiCorp',
    'Cloudflare', 'Datadog', 'Elastic', 'Splunk', 'CrowdStrike', 'Palo Alto Networks',
    'Fortinet', 'Okta', 'Twilio', 'SendGrid', 'Stripe', 'Square', 'PayPal',
    'Shopify', 'Squarespace', 'Wix', 'GoDaddy', 'DigitalOcean', 'Akamai',
    'Rackspace', 'Linode', 'MongoDB', 'Redis Labs', 'Cockroach Labs', 'PlanetScale',
    'Supabase', 'Vercel', 'Netlify', 'GitHub', 'GitLab', 'Bitbucket',
    'JetBrains', 'Atlassian', 'Notion', 'Figma', 'Canva', 'Miro',
    'Autodesk', 'Unity Technologies', 'Epic Games', 'Roblox', 'Electronic Arts',
    'Activision Blizzard', 'Riot Games', 'Valve', 'Nintendo', 'Ubisoft'
  ],

  indianIT: [
    'Tata Consultancy Services', 'Infosys', 'Wipro', 'HCL Technologies',
    'Tech Mahindra', 'L&T Infotech', 'Mindtree', 'Mphasis', 'Persistent Systems',
    'Cyient', 'NIIT Technologies', 'Hexaware Technologies', 'Coforge',
    'Birlasoft', 'Zensar Technologies', 'KPIT Technologies', 'Sonata Software',
    'Happiest Minds', 'Mastek', 'Newgen Software', 'Intellect Design Arena',
    'Tata Elxsi', 'LTTS', 'Sasken Technologies', 'Subex', 'Affle India',
    'Tanla Platforms', 'Route Mobile', 'Quick Heal Technologies',
    'Nucleus Software', 'Ramco Systems', 'Majesco', 'Firstsource Solutions',
    'CSS Corp', 'Igate', 'Patni Computer Systems', 'Geometric Software',
    'Polaris Financial Technology', 'i-flex Solutions', 'iGate Mascon'
  ],

  indianStartups: [
    'Flipkart', 'Zomato', 'Swiggy', 'Razorpay', 'CRED', 'PhonePe', 'Paytm',
    'Ola', 'Byju\'s', 'Unacademy', 'Freshworks', 'Zoho', 'Postman',
    'Browserstack', 'Druva', 'Icertis', 'Hasura', 'Chargebee', 'Clevertap',
    'MoEngage', 'WebEngage', 'Leena AI', 'Yellow.ai', 'Haptik',
    'Meesho', 'Nykaa', 'PolicyBazaar', 'Cars24', 'CarDekho', 'Droom',
    'Urban Company', 'Dunzo', 'BigBasket', 'Blinkit', 'JioMart',
    'Lenskart', 'BoAt', 'Mamaearth', 'Sugar Cosmetics', 'Bewakoof',
    'Dream11', 'MPL', 'Games24x7', 'WinZO', 'Nazara Technologies',
    'Cure.fit', 'Practo', 'PharmEasy', 'Netmeds', '1mg',
    'OYO Rooms', 'MakeMyTrip', 'Yatra', 'ixigo', 'ClearTrip',
    'Groww', 'Upstox', 'Zerodha', 'Angel One', 'Coin DCX',
    'Vedantu', 'Toppr', 'Simplilearn', 'upGrad', 'Scaler Academy',
    'Ather Energy', 'Ola Electric', 'Bounce', 'Rapido', 'BluSmart',
    'ShareChat', 'Koo', 'Josh', 'Moj', 'DailyHunt',
    'Licious', 'Country Delight', 'Milkbasket', 'Grofers',
    'Spinny', 'Park+', 'Jupiter', 'Fi Money', 'Niyo',
    'Apna', 'Hirist', 'Cutshort', 'Instahyre', 'BigShyft',
    'Rivigo', 'BlackBuck', 'Porter', 'Delhivery', 'Shiprocket',
    'Pine Labs', 'BharatPe', 'Cashfree', 'Juspay', 'Setu',
    'Open Financial', 'Khatabook', 'OkCredit', 'Vyapar', 'myBillBook'
  ],

  consulting: [
    'Accenture', 'Deloitte', 'PwC', 'Ernst & Young', 'KPMG',
    'McKinsey & Company', 'Boston Consulting Group', 'Bain & Company',
    'Capgemini', 'Cognizant', 'Atos', 'DXC Technology', 'CGI Group',
    'NTT Data', 'Fujitsu', 'Unisys', 'Booz Allen Hamilton',
    'Leidos', 'SAIC', 'Gartner', 'Forrester', 'IDC',
    'Roland Berger', 'Oliver Wyman', 'Kearney', 'ZS Associates',
    'Mu Sigma', 'Fractal Analytics', 'Tiger Analytics', 'Tredence',
    'LatentView Analytics', 'AbsolutData', 'Manthan', 'TheMathCompany'
  ],

  finance: [
    'Goldman Sachs', 'JP Morgan Chase', 'Morgan Stanley', 'Barclays',
    'Deutsche Bank', 'UBS', 'Credit Suisse', 'Citibank', 'HSBC',
    'Bank of America', 'Wells Fargo', 'BNP Paribas', 'Standard Chartered',
    'ING Bank', 'Nomura', 'Macquarie', 'BlackRock', 'Vanguard',
    'Fidelity Investments', 'Charles Schwab', 'Visa', 'Mastercard',
    'American Express', 'Capital One', 'Discover Financial',
    'ICICI Bank', 'HDFC Bank', 'Kotak Mahindra Bank', 'Axis Bank',
    'State Bank of India', 'Yes Bank', 'IndusInd Bank', 'Federal Bank',
    'Bajaj Finserv', 'Muthoot Finance', 'Manappuram Finance',
    'ICICI Prudential', 'HDFC Life', 'SBI Life', 'LIC',
    'Angel Broking', 'Motilal Oswal', 'IIFL', 'Edelweiss',
    'NSE', 'BSE', 'CDSL', 'NSDL'
  ],

  ecommerce: [
    'Amazon India', 'Flipkart', 'Myntra', 'Ajio', 'Tata CLiQ',
    'Snapdeal', 'ShopClues', 'Paytm Mall', 'JioMart', 'Reliance Digital',
    'Croma', 'Nykaa', 'Purplle', 'FirstCry', 'Pepperfry',
    'Urban Ladder', 'Limeroad', 'Jabong', 'Koovs', 'Cliq',
    'IndiaMART', 'Udaan', 'Moglix', 'OfBusiness', 'Infra.Market',
    'eBay', 'Alibaba', 'Rakuten', 'Zalando', 'ASOS',
    'Etsy', 'Wish', 'Target', 'Walmart', 'Costco',
    'Ikea', 'H&M', 'Zara', 'Uniqlo', 'Nike',
    'Adidas', 'Puma', 'Decathlon', 'Levi\'s'
  ],

  healthcare: [
    'Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Narayana Health',
    'Manipal Hospitals', 'Medanta', 'Aster DM Healthcare', 'Columbia Asia',
    'Dr. Reddy\'s Laboratories', 'Sun Pharmaceutical', 'Cipla', 'Lupin',
    'Aurobindo Pharma', 'Biocon', 'Divi\'s Laboratories', 'Glenmark',
    'Torrent Pharma', 'Cadila Healthcare', 'Alkem Laboratories', 'Ipca Labs',
    'Pfizer', 'Johnson & Johnson', 'Abbott', 'Roche', 'Novartis',
    'AstraZeneca', 'GlaxoSmithKline', 'Merck', 'Sanofi', 'Bayer',
    'Siemens Healthineers', 'GE Healthcare', 'Philips Healthcare',
    'Medtronic', 'Boston Scientific', 'Stryker', 'Becton Dickinson'
  ],

  automotive: [
    'Tata Motors', 'Mahindra & Mahindra', 'Maruti Suzuki', 'Hyundai India',
    'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen',
    'Ford', 'General Motors', 'Stellantis', 'Kia India', 'MG Motor',
    'Renault', 'Nissan', 'Skoda', 'Volvo', 'Jaguar Land Rover',
    'Tesla', 'Rivian', 'Lucid Motors', 'NIO', 'BYD',
    'Bosch', 'Continental', 'Denso', 'ZF Friedrichshafen', 'Valeo',
    'Aptiv', 'Borg Warner', 'Schaeffler', 'Motherson Group', 'Bharat Forge',
    'Ashok Leyland', 'Eicher Motors', 'TVS Motor', 'Bajaj Auto', 'Hero MotoCorp'
  ],

  telecom: [
    'Reliance Jio', 'Airtel', 'Vodafone Idea', 'BSNL',
    'AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'Comcast',
    'Nokia', 'Ericsson', 'Huawei', 'ZTE', 'Motorola Solutions',
    'Juniper Networks', 'Ciena', 'CommScope', 'Corning',
    'American Tower', 'Indus Towers', 'Bharti Infratel',
    'Sterlite Technologies', 'Tejas Networks', 'HFCL', 'Lava International',
    'Micromax', 'Karbonn', 'iBall', 'Intex Technologies'
  ],

  media: [
    'Disney+ Hotstar', 'Netflix India', 'Amazon Prime Video', 'Zee Entertainment',
    'Sony Pictures Networks', 'Star India', 'Viacom18', 'Times Internet',
    'Hindustan Times', 'Indian Express', 'NDTV', 'Republic Media',
    'Dentsu', 'WPP', 'Omnicom', 'Publicis', 'Havas',
    'Ogilvy', 'Leo Burnett', 'JWT', 'McCann', 'BBDO',
    'InMobi', 'Criteo', 'The Trade Desk', 'MediaMath',
    'Pocket Aces', 'TVF', 'Culture Machine', 'Qyuki', 'BuzzFeed India'
  ],

  manufacturing: [
    'Tata Steel', 'JSW Steel', 'Hindalco', 'Vedanta', 'SAIL',
    'Larsen & Toubro', 'Siemens India', 'ABB India', 'Schneider Electric',
    'Honeywell', 'Emerson', 'Rockwell Automation', 'Yokogawa',
    'BHEL', 'Thermax', 'Crompton Greaves', 'Havells', 'Polycab',
    'Asian Paints', 'Berger Paints', 'Pidilite', 'UltraTech Cement',
    'ACC', 'Ambuja Cements', 'Shree Cement', 'Dalmia Bharat',
    'ITC', 'Hindustan Unilever', 'Nestlé India', 'Procter & Gamble',
    'Colgate-Palmolive', 'Godrej Consumer Products', 'Dabur', 'Marico',
    'Britannia', 'Parle', 'Amul', 'Mother Dairy', 'Haldiram\'s',
    'Adani Group', 'Reliance Industries', 'Aditya Birla Group',
    'Mahindra Group', 'Godrej Group', 'Murugappa Group', 'TVS Group',
    'RPG Group', 'Wockhardt', 'Jubilant FoodWorks',
    'Titan Company', 'Borosil', 'Ceat', 'MRF', 'Apollo Tyres',
    '3M India', 'Saint-Gobain', 'Corning India', 'Hella India'
  ],

  energy: [
    'ONGC', 'Indian Oil', 'Bharat Petroleum', 'Hindustan Petroleum',
    'GAIL', 'NTPC', 'Power Grid', 'Adani Green Energy', 'Tata Power',
    'ReNew Power', 'Suzlon Energy', 'Greenko', 'Azure Power',
    'Shell', 'BP', 'ExxonMobil', 'Chevron', 'Total Energies',
    'Engie', 'Iberdrola', 'NextEra Energy', 'Duke Energy',
    'Vestas', 'Siemens Gamesa', 'GE Renewable Energy', 'Goldwind',
    'First Solar', 'SunPower', 'Canadian Solar', 'Trina Solar'
  ],

  education: [
    'Byju\'s', 'Unacademy', 'Vedantu', 'upGrad', 'Simplilearn',
    'Scaler Academy', 'Coding Ninjas', 'GeeksforGeeks', 'InterviewBit',
    'Toppr', 'Doubtnut', 'PhysicsWallah', 'Allen Career Institute',
    'FIITJEE', 'Aakash Institute', 'Resonance', 'Bansal Classes',
    'Coursera', 'Udemy', 'edX', 'Khan Academy', 'Skillshare',
    'LinkedIn Learning', 'Pluralsight', 'DataCamp', 'Codecademy',
    'Great Learning', 'Jigsaw Academy', 'Edureka', 'Intellipaat',
    'NIIT', 'Aptech', 'IIHT', 'Manipal ProLearn', 'IIM Skills'
  ],

  logistics: [
    'Delhivery', 'Blue Dart', 'DTDC', 'Ecom Express', 'Shadowfax',
    'Shiprocket', 'Rivigo', 'BlackBuck', 'Porter', 'Lalamove',
    'FedEx', 'DHL', 'UPS', 'Aramex', 'TNT',
    'Maersk', 'CMA CGM', 'Hapag-Lloyd', 'MSC', 'Evergreen',
    'Container Corporation of India', 'Allcargo Logistics',
    'Transport Corporation of India', 'VRL Logistics', 'Gati',
    'Safexpress', 'Future Supply Chain', 'Mahindra Logistics'
  ],

  realestate: [
    'DLF', 'Godrej Properties', 'Prestige Group', 'Brigade Group',
    'Sobha', 'Puravankara', 'Oberoi Realty', 'Lodha Group',
    'Mahindra Lifespace', 'Tata Housing', 'Shapoorji Pallonji',
    'NoBroker', 'Housing.com', 'MagicBricks', '99acres', 'Square Yards',
    'WeWork India', 'Awfis', 'CoWrks', 'Smartworks', 'IndiQube',
    'Embassy Group', 'Brookfield', 'Blackstone Real Estate',
    'CBRE', 'JLL', 'Knight Frank', 'Cushman & Wakefield', 'Colliers'
  ],

  aerospace: [
    'ISRO', 'HAL', 'DRDO', 'BEL', 'BDL',
    'Boeing India', 'Airbus India', 'Lockheed Martin India', 'Raytheon',
    'Northrop Grumman', 'General Dynamics', 'BAE Systems',
    'Thales', 'Safran', 'Rolls-Royce', 'Pratt & Whitney',
    'Dassault Systèmes', 'L3Harris', 'Textron', 'Elbit Systems',
    'Bharat Dynamics', 'Bharat Electronics', 'BEML',
    'Kalyani Group', 'Adani Defence', 'Tata Advanced Systems',
    'Mahindra Defence', 'L&T Defence', 'Mazagon Dock',
    'Garden Reach Shipbuilders', 'Goa Shipyard', 'Cochin Shipyard'
  ],

  ai_ml: [
    'OpenAI', 'Anthropic', 'Google DeepMind', 'Cohere', 'Hugging Face',
    'Stability AI', 'Midjourney', 'Jasper AI', 'Scale AI', 'Weights & Biases',
    'DataRobot', 'H2O.ai', 'Dataiku', 'Alteryx', 'SAS Institute',
    'C3.ai', 'Anyscale', 'Lightning AI', 'Runway', 'Synthesia',
    'Uniphore', 'Observe.AI', 'Gupshup', 'Niki.ai', 'SigTuple',
    'Niramai', 'Qure.ai', 'Sigtuple', 'Mad Street Den', 'Locus',
    'Sentence', 'Infilect', 'Uncanny Vision', 'Fluid AI', 'Arya.ai'
  ],

  gaming: [
    'Electronic Arts', 'Activision Blizzard', 'Ubisoft', 'Riot Games',
    'Epic Games', 'Valve', 'Rockstar Games', 'Bungie', 'Bethesda',
    'Square Enix', 'Bandai Namco', 'Capcom', 'Konami', 'Sega',
    'Nintendo', 'Sony Interactive', 'Xbox Game Studios',
    'Supercell', 'King', 'Zynga', 'Rovio', 'Niantic',
    'Nazara Technologies', 'Games24x7', 'Dream11', 'MPL',
    'Moonfrog Labs', 'Octro', 'Gameberry Labs', 'nCore Games',
    'Tegra Studios', 'Studio Sirah', 'Ogre Head Studio'
  ],

  food: [
    'Zomato', 'Swiggy', 'Domino\'s India', 'McDonald\'s India',
    'Starbucks India', 'Burger King India', 'KFC India', 'Pizza Hut India',
    'Subway India', 'Taco Bell India', 'Haldiram\'s', 'Bikanervala',
    'Rebel Foods', 'Box8', 'FreshMenu', 'Eatfit', 'Biryani by Kilo',
    'Chai Point', 'Chaayos', 'Third Wave Coffee', 'Blue Tokai',
    'Wow! Momo', 'Faasos', 'Behrouz Biryani', 'Lunchbox',
    'Licious', 'FreshToHome', 'Country Delight', 'Milkbasket',
    'BigBasket', 'Blinkit', 'Zepto', 'JioMart', 'Dunzo Daily',
    'ITC Foods', 'Nestlé India', 'Britannia', 'Parle', 'Amul',
    'Dabur', 'MTR Foods', 'Patanjali', 'Marico', 'Godrej Agrovet'
  ]
};

// Flatten all companies into one giant array
const allCompanies = Object.values(companiesByIndustry).flat();

// ─── Comprehensive Job Titles ───────────────────────────────────────────────

const jobTitles = {
  'software': [
    'Senior Software Engineer', 'Full Stack Developer', 'Frontend Developer',
    'Backend Engineer', 'Software Development Engineer', 'DevOps Engineer',
    'Cloud Engineer', 'React Developer', 'Node.js Developer', 'Python Developer',
    'Java Developer', 'Mobile App Developer', 'iOS Developer', 'Android Developer',
    'Flutter Developer', 'React Native Developer', 'Go Developer', 'Rust Developer',
    'C++ Developer', 'Embedded Software Engineer', 'Firmware Engineer',
    'Site Reliability Engineer', 'Platform Engineer', 'Infrastructure Engineer',
    'Staff Software Engineer', 'Principal Engineer', 'Distinguished Engineer',
    'Engineering Manager', 'VP of Engineering', 'CTO',
    'Solutions Architect', 'Cloud Architect', 'System Architect',
    'Technical Lead', 'Team Lead', 'Senior Technical Lead',
    'Full Stack Web Developer', 'MERN Stack Developer', 'MEAN Stack Developer',
    'Laravel Developer', 'Django Developer', 'Spring Boot Developer',
    'Angular Developer', 'Vue.js Developer', 'Next.js Developer',
    'Microservices Developer', 'API Developer', 'GraphQL Developer',
    'Blockchain Developer', 'Smart Contract Developer', 'Web3 Developer',
    'Salesforce Developer', 'ServiceNow Developer', 'SAP Developer',
    'WordPress Developer', 'Shopify Developer', 'Magento Developer',
    'ERP Developer', 'CRM Developer', 'RPA Developer',
    'Software Engineer Intern', 'SDE-1', 'SDE-2', 'SDE-3',
    'Junior Developer', 'Associate Software Engineer', 'Trainee Software Engineer'
  ],
  'data': [
    'Data Scientist', 'Data Analyst', 'Business Intelligence Analyst',
    'Machine Learning Engineer', 'AI Research Scientist', 'Data Engineer',
    'Analytics Manager', 'Statistician', 'NLP Engineer', 'Computer Vision Engineer',
    'Deep Learning Engineer', 'AI/ML Engineer', 'Research Scientist',
    'Data Architect', 'ETL Developer', 'Big Data Engineer', 'Hadoop Developer',
    'Spark Developer', 'Data Warehouse Engineer', 'Business Analyst',
    'Quantitative Analyst', 'Risk Analyst', 'Fraud Analyst',
    'Product Analyst', 'Growth Analyst', 'Marketing Analyst',
    'Senior Data Scientist', 'Lead Data Engineer', 'Head of Analytics',
    'Chief Data Officer', 'Director of Data Science',
    'MLOps Engineer', 'AI Product Manager', 'Data Science Intern'
  ],
  'design': [
    'UI/UX Designer', 'Product Designer', 'Visual Designer', 'UX Researcher',
    'Interaction Designer', 'Design Lead', 'Creative Director', 'Graphic Designer',
    'Motion Designer', 'Brand Designer', 'Communication Designer',
    'Design System Designer', 'Illustration Artist', 'Icon Designer',
    'Web Designer', 'App Designer', 'Game Designer',
    'Design Manager', 'Head of Design', 'VP of Design',
    'Design Intern', 'Junior Designer', 'Senior UX Designer',
    '3D Designer', 'AR/VR Designer', 'Design Thinking Consultant'
  ],
  'marketing': [
    'Digital Marketing Manager', 'Content Strategist', 'SEO Specialist',
    'Social Media Manager', 'Growth Hacker', 'Marketing Analyst',
    'Brand Manager', 'Performance Marketing Lead', 'Content Writer',
    'Copywriter', 'Email Marketing Specialist', 'PPC Specialist',
    'Affiliate Marketing Manager', 'Influencer Marketing Manager',
    'Marketing Automation Specialist', 'CRM Marketing Manager',
    'Product Marketing Manager', 'Community Manager', 'PR Manager',
    'Event Manager', 'Campaign Manager', 'Media Planner',
    'Chief Marketing Officer', 'VP of Marketing', 'Head of Growth',
    'Marketing Intern', 'Digital Marketing Executive'
  ],
  'devops': [
    'DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer',
    'Infrastructure Engineer', 'Platform Engineer', 'Systems Administrator',
    'Network Engineer', 'Security Engineer', 'DevSecOps Engineer',
    'Kubernetes Engineer', 'Docker Specialist', 'CI/CD Engineer',
    'Release Engineer', 'Build Engineer', 'AWS Solutions Architect',
    'Azure Cloud Engineer', 'GCP Engineer', 'Cloud Security Engineer',
    'Linux Administrator', 'Windows Systems Engineer',
    'Monitoring Engineer', 'Observability Engineer'
  ],
  'cybersecurity': [
    'Cybersecurity Analyst', 'Security Engineer', 'Penetration Tester',
    'Ethical Hacker', 'Security Architect', 'SOC Analyst',
    'Incident Response Analyst', 'Threat Intelligence Analyst',
    'Application Security Engineer', 'Cloud Security Architect',
    'CISO', 'Security Consultant', 'Vulnerability Researcher',
    'Malware Analyst', 'Forensic Analyst', 'GRC Analyst',
    'Identity & Access Management Engineer', 'Security Operations Lead'
  ],
  'management': [
    'Project Manager', 'Product Manager', 'Program Manager',
    'Scrum Master', 'Agile Coach', 'Delivery Manager',
    'Technical Program Manager', 'Senior Product Manager',
    'Associate Product Manager', 'Chief Product Officer',
    'VP of Product', 'Director of Engineering',
    'Operations Manager', 'General Manager', 'Business Development Manager',
    'Account Manager', 'Client Relationship Manager',
    'Strategy Consultant', 'Management Consultant'
  ],
  'qa': [
    'QA Engineer', 'Test Engineer', 'SDET', 'Automation Test Engineer',
    'Manual Tester', 'Performance Test Engineer', 'Security Tester',
    'QA Lead', 'QA Manager', 'Quality Analyst',
    'Selenium Tester', 'Appium Tester', 'API Tester',
    'Test Architect', 'Quality Assurance Intern'
  ],
  'hr': [
    'HR Manager', 'HR Business Partner', 'Talent Acquisition Specialist',
    'Technical Recruiter', 'HR Generalist', 'Compensation & Benefits Manager',
    'Learning & Development Manager', 'Employee Engagement Manager',
    'HR Analyst', 'People Operations Manager', 'Chief People Officer',
    'HR Intern', 'Recruiter', 'Staffing Manager'
  ],
  'default': [
    'Project Manager', 'Product Manager', 'Business Analyst', 'Technical Writer',
    'QA Engineer', 'Scrum Master', 'Solutions Architect', 'Technical Lead',
    'Engineering Manager', 'Consultant', 'Operations Analyst',
    'Customer Success Manager', 'Sales Engineer', 'Pre-Sales Consultant',
    'Support Engineer', 'Implementation Specialist', 'System Administrator',
    'Database Administrator', 'ERP Consultant', 'IT Manager',
    'Network Administrator', 'Help Desk Engineer', 'IT Support Specialist',
    'Trainee Engineer', 'Graduate Engineer', 'Management Trainee'
  ]
};

const { getRandomFallback, validateAndCorrectLocation } = require('./locations');

// ─── Descriptions ───────────────────────────────────────────────────────────

const descriptions = [
  'We are looking for a talented professional to join our growing team. You will work on cutting-edge technology and collaborate with cross-functional teams to deliver innovative solutions that impact millions of users.',
  'Join our world-class engineering team to build scalable systems that serve millions of users. You will design, develop, and deploy high-performance applications using modern technologies.',
  'Exciting opportunity to work with latest technologies in a fast-paced environment. Strong problem-solving skills and passion for technology required. Competitive salary and benefits.',
  'Be part of a team that is revolutionizing the industry. Work on challenging problems, mentor junior engineers, and drive technical excellence across the organization.',
  'We need a creative and driven professional who can take ownership of projects and deliver high-quality results. Great work-life balance, learning opportunities, and career growth.',
  'Looking for an experienced professional who is passionate about building products that solve real-world problems. Join us in our mission to make technology accessible to everyone.',
  'This role offers the opportunity to work with a diverse team of talented individuals. You will contribute to building next-generation products that define the future of our industry.',
  'We are seeking a motivated individual who thrives in a collaborative environment. You will have the opportunity to work on greenfield projects and shape the technology direction.',
  'Join our fast-growing team and help us scale our platform to serve millions more users. Experience with distributed systems and cloud infrastructure is a plus.',
  'An excellent opportunity for someone who wants to make a real impact. You will work closely with product managers, designers, and stakeholders to deliver exceptional user experiences.'
];

const salaryRanges = [
  '₹3-5 LPA', '₹4-7 LPA', '₹5-8 LPA', '₹6-10 LPA', '₹8-14 LPA',
  '₹10-18 LPA', '₹12-20 LPA', '₹15-25 LPA', '₹18-30 LPA', '₹20-35 LPA',
  '₹25-40 LPA', '₹30-50 LPA', '₹35-60 LPA', '₹40-70 LPA',
  '₹50-80 LPA', '₹60-1 Cr', 'Not Disclosed', 'Competitive'
];

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCategory(keyword) {
  const kw = keyword.toLowerCase();
  if (kw.includes('devops') || kw.includes('cloud') || kw.includes('sre') || kw.includes('infrastructure') || kw.includes('kubernetes') || kw.includes('docker')) return 'devops';
  if (kw.includes('security') || kw.includes('cyber') || kw.includes('hacker') || kw.includes('penetration') || kw.includes('soc')) return 'cybersecurity';
  if (kw.includes('qa') || kw.includes('test') || kw.includes('sdet') || kw.includes('automation test') || kw.includes('quality')) return 'qa';
  if (kw.includes('hr') || kw.includes('recruit') || kw.includes('talent') || kw.includes('people')) return 'hr';
  if (kw.includes('product manager') || kw.includes('project manager') || kw.includes('scrum') || kw.includes('agile')) return 'management';
  if (kw.includes('software') || kw.includes('developer') || kw.includes('engineer') || kw.includes('react') || kw.includes('node') || kw.includes('python') || kw.includes('java') || kw.includes('full stack') || kw.includes('frontend') || kw.includes('backend') || kw.includes('web') || kw.includes('mobile') || kw.includes('flutter') || kw.includes('angular') || kw.includes('vue') || kw.includes('golang') || kw.includes('rust') || kw.includes('.net') || kw.includes('php') || kw.includes('ruby') || kw.includes('spring') || kw.includes('django') || kw.includes('laravel')) return 'software';
  if (kw.includes('data') || kw.includes('ml') || kw.includes('machine learning') || kw.includes('ai') || kw.includes('analytics') || kw.includes('deep learning') || kw.includes('nlp') || kw.includes('computer vision') || kw.includes('big data') || kw.includes('etl') || kw.includes('spark') || kw.includes('hadoop')) return 'data';
  if (kw.includes('design') || kw.includes('ui') || kw.includes('ux') || kw.includes('graphic') || kw.includes('creative') || kw.includes('figma')) return 'design';
  if (kw.includes('marketing') || kw.includes('seo') || kw.includes('content') || kw.includes('social media') || kw.includes('growth') || kw.includes('brand') || kw.includes('digital market')) return 'marketing';
  return 'default';
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateJobs(keyword, validLocation, platform, count) {
  const category = getCategory(keyword);
  const titles = jobTitles[category] || jobTitles['default'];
  const jobs = [];

  for (let i = 0; i < count; i++) {
    const company = randomFrom(allCompanies);
    const title = randomFrom(titles);
    const jobLocation = validLocation && validLocation !== '' ? validLocation : getRandomFallback();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let link;
    const encodedTitle = encodeURIComponent(title);
    const encodedCompany = encodeURIComponent(company);
    const searchQuery = encodeURIComponent(`${title} ${company}`);
    switch (platform) {
      case 'LinkedIn':
        link = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${encodeURIComponent(jobLocation)}`;
        break;
      case 'Naukri':
        link = `https://www.naukri.com/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-jobs-in-${jobLocation.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        break;
      case 'Internshala':
        link = `https://internshala.com/internships/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-internship-in-${jobLocation.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        break;
      case 'Unstop':
        link = `https://unstop.com/jobs?search=${searchQuery}`;
        break;
      default:
        link = `https://www.google.com/search?q=${searchQuery}+jobs`;
    }

    jobs.push({
      title,
      company,
      location: jobLocation,
      platform,
      link,
      description: randomFrom(descriptions),
      salary: randomFrom(salaryRanges),
      job_type: randomFrom(jobTypes)
    });
  }

  return jobs;
}

/**
 * Main scraping function
 * @param {string} keyword - Job search keyword
 * @param {string} location - Job location filter
 * @returns {Array} Array of job objects
 */
async function scrapeJobs(keyword, location) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  // Autocorrect location using maps API
  let validLocation = '';
  if (location && location.trim() !== '') {
    validLocation = await validateAndCorrectLocation(location.trim());
  }

  const platforms = ['LinkedIn', 'Naukri', 'Internshala', 'Unstop'];
  let allJobs = [];

  for (const platform of platforms) {
    const count = 3 + Math.floor(Math.random() * 5); // 3-7 jobs per platform
    const jobs = generateJobs(keyword, validLocation, platform, count);
    allJobs = allJobs.concat(jobs);
  }

  // Shuffle results
  allJobs.sort(() => Math.random() - 0.5);

  return allJobs;
}

module.exports = { scrapeJobs };
