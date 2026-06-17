export const profile = {
  name: 'Jay Panchal',
  initials: 'JP',
  role: 'Business Analyst · Solutions Engineer',
  email: 'panchalj481@gmail.com',
  phone: '+919624287628',
  bio: 'I turn complex business operations into simple, scalable digital workflows that save time, improve accuracy, and help teams make better decisions.',
  status: 'Building automation systems across HR, CRM, logistics, and manufacturing.',
  resumePath: '/assets/jay-panchal-resume.pdf',
} as const;

export const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/PanchalJay' },
  { label: 'Website', href: 'https://jaypanchal.vercel.app' },
  { label: 'Email', href: 'mailto:panchalj481@gmail.com' },
  { label: 'Phone', href: 'tel:+919624287628' },
] as const;

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  details: string[];
};

export const experiences: ExperienceItem[] = [
  {
    company: 'Neome.ai',
    role: 'Business Analyst',
    period: 'Jun 2024 – Present',
    location: 'Ahmedabad, India',
    isCurrent: true,
    details: [
      'Delivered 100+ enterprise automation modules used by 100+ users across multiple industries.',
      'Automated 70% of manual operations through validations, rules, escalations, reminders, and event-driven triggers.',
      'Improved implementation speed by 50% with reusable components and modular workflow patterns.',
    ],
  },
  {
    company: 'Brainybeam Info-Tech',
    role: 'Frontend Development Intern',
    period: 'Jan 2024 – Jul 2024',
    location: 'Ahmedabad, India',
    details: [
      'Built foundations in Android development, REST API integration, MySQLite, and client-server workflow design.',
      'Developed technical depth for stronger collaboration on automation and process optimization projects.',
    ],
  },
  {
    company: 'QSpiders',
    role: 'Development & Testing Trainee',
    period: 'Jul 2023 – Aug 2023',
    location: 'Ahmedabad, India',
    details: [
      'Trained in Python, SQL, web development, and manual testing through an intensive engineering program.',
      'Built mini-projects involving data handling, API usage, backend logic, debugging, and documentation.',
    ],
  },
];

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

export const capabilities = [
  {
    title: 'Business Analysis',
    description:
      'Requirement gathering, process mapping, BRD/FRD, user stories, acceptance criteria, RCA, and change management.',
  },
  {
    title: 'Solutions Engineering',
    description:
      'Workflow automation, rule engine design, system configuration, logic building, optimization, and integrations.',
  },
  {
    title: 'Tools & Technology',
    description: 'SQL, advanced Excel, Jira, Confluence, REST APIs, Figma, Git, Python, and web development.',
  },
] as const;

export const education = {
  school: 'Gujarat Technological University',
  degree: 'Bachelor of Engineering (BE)',
  year: '2024',
  cgpa: '7.98',
} as const;

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
