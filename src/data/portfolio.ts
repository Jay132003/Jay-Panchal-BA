export const profile = {
  name: 'Jay Panchal',
  initials: 'JP',
  role: 'Business Analyst · Solutions Engineer',
  email: 'panchalj481@gmail.com',
  phone: '+919624287628',
  bio: 'A Business Analyst & Solutions Engineer crafting AI-driven workflows that turn complex operations into calm, scalable systems for the people who use them.',
  status: 'Where business meets effortless automation.',
  resumePath: '/assets/jay-panchal-resume.pdf',
} as const;

export const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jjp01/' },
  { label: 'Website', href: 'https://jaypanchal.vercel.app' },
  { label: 'Email', href: 'mailto:panchalj481@gmail.com' },
  { label: 'Phone', href: 'tel:+919624287628' },
] as const;

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  details: string[];
  website?: string;
  linkedIn?: string;
  technologies?: { name: string; icon: string }[];
};

export const experiences: ExperienceItem[] = [
  {
    company: 'Neome.ai',
    role: 'Business Analyst',
    period: 'Jun 2024 – Present',
    location: 'Ahmedabad, India',
    isCurrent: true,
    website: 'https://neome.ai',
    linkedIn: 'https://www.linkedin.com/company/neome-ai/',
    technologies: [
      { name: 'Jira',       icon: `${DEVICON}/jira/jira-original.svg` },
      { name: 'Figma',      icon: `${DEVICON}/figma/figma-original.svg` },
      { name: 'Confluence', icon: `${DEVICON}/confluence/confluence-original.svg` },
      { name: 'SQL',        icon: `${DEVICON}/mysql/mysql-original.svg` },
      { name: 'Excel',      icon: `${DEVICON}/microsoftexcel/microsoftexcel-plain.svg` },
      { name: 'Postman',    icon: `${DEVICON}/postman/postman-original.svg` },
      { name: 'Git',        icon: `${DEVICON}/git/git-original.svg` },
    ],
    details: [
      'Delivered 100+ enterprise automation modules — Leads, Visits, Quotations, Approvals, Dashboards, Data Management — used by 100+ users across multiple industries.',
      'Automated 70% of manual operations by designing validations, workflow rules, escalations, reminders and event-driven triggers, reducing turnaround times significantly.',
      'Led requirement discovery and documentation — BRDs, FRDs, user stories and workflow diagrams — aligning business needs with engineering and QA teams.',
      'Accelerated implementation speed by 50% through reusable components, standardized logic templates and modular workflow patterns.',
      'Owned UAT cycles and go-live execution, resolving blockers and streamlining release planning across cross-functional teams.',
      'Enabled data-driven decision-making by designing automated dashboards and structured reporting workflows.',
    ],
  },
  {
    company: 'Brainybeam Info-Tech Pvt Ltd',
    role: 'Frontend Development Intern',
    period: 'Jan 2024 – Jul 2024',
    location: 'Ahmedabad, India',
    technologies: [
      { name: 'Android', icon: `${DEVICON}/android/android-original.svg` },
      { name: 'MySQL',   icon: `${DEVICON}/mysql/mysql-original.svg` },
      { name: 'HTML5',   icon: `${DEVICON}/html5/html5-original.svg` },
      { name: 'Git',     icon: `${DEVICON}/git/git-original.svg` },
    ],
    details: [
      'Built foundational skills in Android development, REST API integration, MySQLite and client-server workflow design.',
      'Strengthened technical depth to support engineering collaboration in automation and process optimization projects.',
    ],
  },
  {
    company: 'QSpiders',
    role: 'Development & Testing Trainee',
    period: 'Jul 2023 – Aug 2023',
    location: 'Ahmedabad, India',
    technologies: [
      { name: 'Python', icon: `${DEVICON}/python/python-original.svg` },
      { name: 'SQL',    icon: `${DEVICON}/mysql/mysql-original.svg` },
      { name: 'HTML5',  icon: `${DEVICON}/html5/html5-original.svg` },
    ],
    details: [
      'Trained in Python, SQL, Web Development and Manual Testing through an intensive software engineering program.',
      'Developed mini-projects involving data handling, API usage and backend logic implementation.',
      'Gained practical SDLC exposure and improved debugging, documentation and analytical skills.',
    ],
  },
];

export const techStack = [
  { name: 'Jira',       icon: `${DEVICON}/jira/jira-original.svg` },
  { name: 'Figma',      icon: `${DEVICON}/figma/figma-original.svg` },
  { name: 'Git',        icon: `${DEVICON}/git/git-original.svg` },
  { name: 'SQL',        icon: `${DEVICON}/mysql/mysql-original.svg` },
  { name: 'Python',     icon: `${DEVICON}/python/python-original.svg` },
  { name: 'Excel',      icon: `${DEVICON}/microsoftexcel/microsoftexcel-plain.svg` },
  { name: 'Confluence', icon: `${DEVICON}/confluence/confluence-original.svg` },
  { name: 'Android',    icon: `${DEVICON}/android/android-original.svg` },
  { name: 'HTML5',      icon: `${DEVICON}/html5/html5-original.svg` },
  { name: 'Postman',    icon: `${DEVICON}/postman/postman-original.svg` },
] as const;

export const impactItems = [
  {
    metric: '100+',
    title: 'Automation modules',
    description: 'Leads, visits, quotations, approvals, dashboards, and data management systems.',
  },
  {
    metric: '70%',
    title: 'Manual work automated',
    description: 'Designed rule-driven workflows that reduced repetitive operations and turnaround time.',
  },
  {
    metric: '50%',
    title: 'Faster implementation',
    description: 'Created reusable logic templates and modular patterns for repeatable delivery.',
  },
] as const;

export type CapabilityItem = {
  title: string;
  tags: string[];
};

export const capabilities: CapabilityItem[] = [
  {
    title: 'Business Analysis',
    tags: ['Requirement Gathering', 'Process Mapping', 'BRD / FRD', 'User Stories', 'Acceptance Criteria', 'Root Cause Analysis', 'Change Management'],
  },
  {
    title: 'Solutions Engineering',
    tags: ['Workflow Automation', 'Rule Engine Design', 'System Configuration', 'Logic Building', 'Optimization', 'Integrations'],
  },
  {
    title: 'Tools & Technology',
    tags: ['SQL', 'Excel (Advanced)', 'Jira', 'Confluence', 'REST APIs', 'Figma', 'Git'],
  },
  {
    title: 'Soft Skills',
    tags: ['Stakeholder Management', 'Client Communication', 'Problem Solving', 'Critical Thinking'],
  },
];

export const education = {
  school: 'Gujarat Technological University',
  degree: 'Bachelor of Engineering (BE)',
  year: '2024',
  cgpa: '7.98',
} as const;

export const playlists = [
  {
    name: 'Alive',
    url: 'https://open.spotify.com/playlist/72PKk905OzSzSog1N8OLmC',
    id: '72PKk905OzSzSog1N8OLmC',
    gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  },
  {
    name: 'Mastana',
    url: 'https://open.spotify.com/playlist/3GTTRXXSnKGdzmz6DuVlPp',
    id: '3GTTRXXSnKGdzmz6DuVlPp',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
  },
  {
    name: 'Human',
    url: 'https://open.spotify.com/playlist/3fypkHaTRwz5lr7IMAF3q6',
    id: '3fypkHaTRwz5lr7IMAF3q6',
    gradient: 'linear-gradient(135deg, #200122, #6f0000)',
  },
  {
    name: "The OG 90's",
    url: 'https://open.spotify.com/playlist/10ZkQhj86xjY4RYWBodxy0',
    id: '10ZkQhj86xjY4RYWBodxy0',
    gradient: 'linear-gradient(135deg, #f7971e, #ffd200)',
  },
  {
    name: 'Gujju Rocks',
    url: 'https://open.spotify.com/playlist/6JmjJn7Ex6aZ3TppK4yMf2',
    id: '6JmjJn7Ex6aZ3TppK4yMf2',
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
  },
];

export const quote = {
  text: 'Good systems do more than automate tasks. They give people clarity, speed, and room to do better work.',
  author: 'Jay Panchal',
} as const;

export type CommandItem = {
  label: string;
  shortcut: string;
  target?: string;
  href?: string;
};

export const commands: CommandItem[] = [
  { label: 'Home', shortcut: 'H', target: '#home' },
  { label: 'Experience', shortcut: 'W', target: '#work' },
  { label: 'Capabilities', shortcut: 'S', target: '#skills' },
  { label: 'Open resume', shortcut: 'R', href: '/assets/jay-panchal-resume.pdf' },
  { label: 'Send an email', shortcut: 'E', href: 'mailto:panchalj481@gmail.com' },
];
