import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { CheckCircle, Briefcase, GraduationCap, Code, User, Star, ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'content',
    label: 'Content',
    icon: <Briefcase className="w-4 h-4" />,
    color: 'blue',
  },
  {
    id: 'format',
    label: 'Format',
    icon: <Layout className="w-4 h-4" />,
    color: 'purple',
  },
  {
    id: 'impact',
    label: 'Impact',
    icon: <Star className="w-4 h-4" />,
    color: 'amber',
  },
  {
    id: 'technical',
    label: 'Tech Roles',
    icon: <Code className="w-4 h-4" />,
    color: 'green',
  },
  {
    id: 'entry',
    label: 'Entry Level',
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'rose',
  },
];

// inline Layout icon since lucide doesn't have exactly what we want
function Layout({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  );
}

const tips: Array<{
  category: string;
  title: string;
  description: string;
  example?: string;
  badge?: string;
}> = [
  // Content
  {
    category: 'content',
    badge: 'Most Important',
    title: 'Tailor Every Resume to the Job',
    description:
      'A generic resume gets generic results. Before applying, re-read the job description and customize your summary, skills section, and top bullet points to match the specific role. Hiring managers spend an average of 7 seconds — make those seconds count.',
    example: 'Job asks for "client-facing communication" → add that phrase to your experience bullet.',
  },
  {
    category: 'content',
    title: 'Write a Targeted Professional Summary',
    description:
      'Your summary is the first thing read. In 2–3 sentences, state your role, years of experience, and one or two standout achievements. Skip objective statements — focus on what you bring, not what you want.',
    example: '"Results-driven software engineer with 5+ years building scalable APIs. Reduced latency by 40% at Acme Corp by migrating to Redis caching."',
  },
  {
    category: 'content',
    title: 'List Only Relevant Experience',
    description:
      'Older or unrelated jobs don\'t need equal billing. For roles over 10 years ago, you can shrink them to one line or remove them entirely. Prioritize depth over breadth — two strong bullet points beat five weak ones.',
  },
  {
    category: 'content',
    title: 'Include a Dedicated Skills Section',
    description:
      'Put your most relevant skills in a scannable list — ATS systems and recruiters both appreciate it. Group them: technical skills, tools, languages, soft skills. Don\'t list skills you couldn\'t discuss in an interview.',
  },
  // Format
  {
    category: 'format',
    title: 'Keep It to One or Two Pages',
    description:
      '0–10 years experience: one page. 10+ years or senior/executive roles: two pages are acceptable. Never pad with empty phrases to fill space — white space is your friend. Quality over quantity always wins.',
  },
  {
    category: 'format',
    title: 'Use Consistent Formatting',
    description:
      'Inconsistency signals carelessness. Every date should follow the same format (e.g., "Jan 2020" not mixing "January 2020" and "1/2020"). Bullet style, font size, and spacing should be uniform throughout.',
  },
  {
    category: 'format',
    title: 'Choose a Readable Font at 10–12pt',
    description:
      'Stick to classic fonts: Calibri (11pt), Arial (11pt), or Georgia (11pt). Avoid decorative fonts. Your name can be slightly larger (14–16pt). Don\'t go below 10pt — readability matters to human reviewers.',
  },
  {
    category: 'format',
    title: 'Add White Space Strategically',
    description:
      'Dense walls of text hurt readability. Leave consistent margins (0.5"–1"), add spacing between sections, and keep bullet points concise. A clean, breathable layout invites the reader in.',
  },
  // Impact
  {
    category: 'impact',
    badge: 'High Impact',
    title: 'Quantify Every Achievement You Can',
    description:
      'Numbers make your accomplishments concrete and memorable. Whenever possible, add metrics: percentages, dollar amounts, headcount, timeframes, or growth figures.',
    example: '"Managed a team" → "Managed a team of 8 engineers across 3 time zones, delivering the project 2 weeks ahead of schedule."',
  },
  {
    category: 'impact',
    title: 'Start Bullets with Strong Action Verbs',
    description:
      'Weak: "Responsible for managing the database." Strong: "Architected and optimized a PostgreSQL database, cutting query times by 60%." Begin every bullet with an active past-tense verb.',
    example: 'Led, Built, Reduced, Generated, Launched, Negotiated, Designed, Automated, Scaled',
  },
  {
    category: 'impact',
    title: 'Show Progression and Growth',
    description:
      'If you stayed at a company multiple years, highlight promotions or expanding responsibilities. This signals loyalty, performance, and growth — all traits recruiters value highly.',
    example: '"Promoted from Junior to Senior Developer within 18 months based on consistently exceeding performance targets."',
  },
  {
    category: 'impact',
    title: 'Proofread — Then Proofread Again',
    description:
      'A single typo can eliminate an otherwise perfect resume. After proofreading yourself, use a spell checker, then read it backwards (forces you to see each word), then ask someone else to review it.',
  },
  // Technical
  {
    category: 'technical',
    title: 'List Languages and Tools in a Skills Section',
    description:
      'For tech roles, put your stack front and center. Group by category: Languages (Python, TypeScript), Frameworks (React, Django), Cloud (AWS, GCP), Databases (PostgreSQL, Redis). Keep it honest — anything listed is fair game for interview questions.',
  },
  {
    category: 'technical',
    title: 'Link to GitHub and Portfolio Projects',
    description:
      'Include links to live projects or your GitHub profile. For each personal/side project, add 2–3 bullets explaining the technical decisions and scale: "Built a real-time chat app using WebSockets serving 500+ concurrent users."',
  },
  {
    category: 'technical',
    badge: 'Often Overlooked',
    title: 'Describe Impact, Not Just Technologies Used',
    description:
      'Listing "Used React, Node, PostgreSQL" tells a recruiter nothing. Describe what you built and why it mattered: scale, business outcome, or technical challenge you solved.',
    example: '"Migrated monolith to microservices architecture, enabling independent team deploys and reducing mean time to recovery from 2 hours to 15 minutes."',
  },
  // Entry Level
  {
    category: 'entry',
    title: 'Lead with Education if You\'re New to the Field',
    description:
      'If you\'re a recent grad or career changer, put your Education section near the top. Include GPA if it\'s above 3.5, relevant coursework, academic projects, and honors — these are your credentials.',
  },
  {
    category: 'entry',
    title: 'Include Internships, Freelance, and Volunteer Work',
    description:
      'Don\'t leave your experience section empty just because you lack full-time roles. Internships, part-time jobs, campus positions, open-source contributions, and volunteer work all count as real experience.',
  },
  {
    category: 'entry',
    badge: 'Quick Win',
    title: 'Build a Projects Section',
    description:
      'A strong projects section can compensate for limited work history. Choose 2–3 projects where you can speak technically, describe your role, the tech used, and ideally a link to see it live or on GitHub.',
    example: '"Personal Finance Tracker | React, Firebase | Deployed app tracking $50k+ in user expenses with budget alerts."',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
};

const borderMap: Record<string, string> = {
  blue: 'border-l-blue-500',
  purple: 'border-l-purple-500',
  amber: 'border-l-amber-500',
  green: 'border-l-green-500',
  rose: 'border-l-rose-500',
};

export function ResumeTipsPage() {
  const [activeCategory, setActiveCategory] = useState('content');

  const activeCat = categories.find(c => c.id === activeCategory)!;
  const filtered = tips.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-10">

        {/* Header */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full mb-4">
            Resume Writing Guide
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resume Writing Tips That Actually Work
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {tips.length} actionable tips across content, formatting, impact, technical roles, and entry-level advice — written by recruiters and hiring managers.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? colorMap[cat.color] + ' shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.icon}
              {cat.label}
              <span className="text-xs opacity-60">
                ({tips.filter(t => t.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* Tips for active category */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${colorMap[activeCat.color]}`}>{activeCat.icon}</span>
            {activeCat.label} Tips
          </h2>

          {filtered.map((tip, i) => (
            <Card
              key={i}
              className={`border-0 border-l-4 ${borderMap[activeCat.color]} shadow-md dark:shadow-slate-800/20 rounded-xl`}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {tip.title}
                  </h3>
                  {tip.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${colorMap[activeCat.color]}`}>
                      {tip.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed ml-6">
                  {tip.description}
                </p>
                {tip.example && (
                  <div className="mt-3 ml-6 flex items-start gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">{tip.example}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Summary */}
        <Card className="border-0 shadow-md dark:shadow-slate-800/20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">The Golden Rule</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Every word on your resume should either demonstrate a skill, show an achievement, or position you as the right person for this specific job. If it doesn't do one of those three things, cut it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
