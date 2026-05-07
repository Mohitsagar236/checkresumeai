import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import {
  Users, Globe, Linkedin, Briefcase, Mail, MessageSquare,
  BarChart2, Target, Clock, CheckCircle, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';

const phases = [
  {
    id: 'prepare',
    label: 'Prepare',
    color: 'blue',
    description: 'Set yourself up for success before you send a single application.',
    steps: [
      {
        title: 'Define Your Target Role and Companies',
        icon: <Target className="w-5 h-5" />,
        body: 'Before anything else, clarify what you\'re looking for. Unfocused job searching wastes your time and produces weak applications. Identify 3–5 target roles and 20–30 target companies where you\'d love to work.',
        tips: [
          'Create a spreadsheet: Company | Role | Status | Contact | Notes',
          'Research company culture on Glassdoor, Blind, and LinkedIn',
          'Follow target companies on LinkedIn to catch openings early',
          'Set up Google Alerts for "[Company] hiring" or "[Role] job",',
        ],
      },
      {
        title: 'Optimize Your LinkedIn Profile',
        icon: <Linkedin className="w-5 h-5" />,
        body: 'Recruiters use LinkedIn to find candidates — your profile needs to be as strong as your resume. A complete, keyword-rich profile significantly increases inbound recruiter outreach.',
        tips: [
          'Use a professional headshot (profiles with photos get 21× more views)',
          'Write a headline beyond your job title: "Software Engineer | React & Node.js | Open to Remote"',
          'Add your 5 most important skills to the Skills section',
          'Turn on "Open to Work" (visible to recruiters only if you prefer)',
          'Ask 2–3 former colleagues for recommendations',
        ],
      },
      {
        title: 'Prepare Your Application Materials',
        icon: <Briefcase className="w-5 h-5" />,
        body: 'Have a polished base resume and cover letter template ready to customize quickly. Keep a "master resume" with every experience — then cut it down for each application.',
        tips: [
          'Keep a master resume with all experience (don\'t submit this directly)',
          'Create a cover letter template with [COMPANY], [ROLE], [ACHIEVEMENT] placeholders',
          'Save PDF and .docx versions of your resume',
          'Have your portfolio, GitHub, or work samples accessible via link',
        ],
      },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    color: 'purple',
    description: 'Up to 85% of jobs are filled through networking. Most are never posted publicly.',
    steps: [
      {
        title: 'Work Your Existing Network First',
        icon: <Users className="w-5 h-5" />,
        body: 'The people most likely to help you are people who already know and trust you. Start with former colleagues, managers, classmates, and people you\'ve worked with in any capacity.',
        tips: [
          'Reconnect before you need something — share an interesting article, congratulate a promotion',
          'Be specific: "I\'m looking for a backend engineering role at fintech companies in NYC or remote"',
          'Ask for introductions, not jobs: "Do you know anyone at Stripe I could chat with?"',
          'Follow up with a thank-you note within 24 hours of any helpful conversation',
        ],
      },
      {
        title: 'Do Informational Interviews',
        icon: <MessageSquare className="w-5 h-5" />,
        body: 'Requesting a 20-minute "informational interview" to learn about someone\'s role or company is one of the highest-ROI job search activities. It builds relationships before jobs open up.',
        tips: [
          'Message on LinkedIn: "I\'m exploring [field]. Would you have 20 min for a quick call? No ask — just curious about your experience at [Company]."',
          'Prepare 5–7 genuine questions about their career path, team, or industry',
          'Never ask for a job in an informational interview — let the relationship develop naturally',
          'Send a thank-you email the same day with one specific insight you valued',
        ],
      },
      {
        title: 'Attend Industry Events',
        icon: <Globe className="w-5 h-5" />,
        body: 'Conferences, meetups, hackathons, and professional association events put you in rooms with people who are hiring or know who is. In-person connections build faster trust than digital ones.',
        tips: [
          'Look for local meetup.com events in your field',
          'Volunteer at conferences — great access and conversation starters',
          'Prepare a 30-second introduction: role, what you\'re looking for, one interesting hook',
          'Follow up on LinkedIn within 24 hours of meeting someone new',
        ],
      },
    ],
  },
  {
    id: 'apply',
    label: 'Apply',
    color: 'green',
    description: 'Apply strategically — quality beats quantity every time.',
    steps: [
      {
        title: 'Use Multiple Channels',
        icon: <Globe className="w-5 h-5" />,
        body: 'Don\'t rely on any single source. Diversify across job boards, company career pages, LinkedIn, and referrals. Each channel reaches different openings.',
        tips: [
          'LinkedIn Jobs — strongest for white-collar roles, set up email alerts',
          'Company career pages — apply directly; often not on aggregator sites',
          'Indeed — broad coverage across all industries',
          'AngelList/Wellfound — best for startup roles',
          'Remote.co, We Work Remotely — for remote-first positions',
          'Handshake — if you\'re a recent or upcoming grad',
        ],
      },
      {
        title: 'Customize Each Application',
        icon: <Target className="w-5 h-5" />,
        body: 'Generic applications get generic results. Spend 10–15 extra minutes per application tailoring your resume and cover letter. This significantly improves your interview conversion rate.',
        tips: [
          'Mirror keywords from the job description (especially the top 3 required skills)',
          'Update your professional summary to match the role',
          'Reorder bullet points so the most relevant accomplishments are first',
          'Reference the company name, mission, or a specific product in your cover letter',
        ],
      },
      {
        title: 'Track Everything in a Spreadsheet',
        icon: <BarChart2 className="w-5 h-5" />,
        body: 'Staying organized prevents you from missing follow-ups, losing track of stages, or accidentally applying twice. A simple spreadsheet is enough.',
        tips: [
          'Columns: Company | Role | Date Applied | Status | Contact | Next Action | Notes',
          'Track: Applied → Phone Screen → Technical → Onsite → Offer',
          'Set calendar reminders to follow up if you haven\'t heard back in 1 week',
          'Note the specific version of your resume you submitted for each job',
        ],
      },
    ],
  },
  {
    id: 'followup',
    label: 'Follow Up',
    color: 'amber',
    description: 'Most candidates don\'t follow up — the ones who do stand out.',
    steps: [
      {
        title: 'Send a Follow-Up Email After Applying',
        icon: <Mail className="w-5 h-5" />,
        body: 'If you can find the hiring manager or recruiter on LinkedIn, send a short, polite message after applying. This extra touchpoint helps your application stand out in a pile of hundreds.',
        tips: [
          'Wait 5–7 business days after applying before following up',
          'Keep it to 3 sentences: who you are, what you applied for, one specific reason you\'re excited',
          'Never complain about not hearing back or pressure for urgency',
          'Subject line: "Following up on [Role] Application — [Your Name]"',
        ],
      },
      {
        title: 'Send a Thank-You Note After Every Interview',
        icon: <CheckCircle className="w-5 h-5" />,
        body: 'A personalized thank-you note within 24 hours of an interview is still remembered positively by most interviewers. It\'s an easy differentiator that very few candidates do well.',
        tips: [
          'Send within 24 hours — same day is even better',
          'Reference something specific from the conversation (not generic)',
          'Email is fine; handwritten notes are exceptional but rare',
          'If you interviewed with multiple people, send each a unique message',
        ],
      },
      {
        title: 'Manage Your Timeline Professionally',
        icon: <Clock className="w-5 h-5" />,
        body: 'Juggling multiple processes requires communication. If you\'re close to an offer at one company but waiting on another, it\'s acceptable to ask for expedited timelines or deadline extensions.',
        tips: [
          'If you have a competing offer, tell the slower company: "I have an offer with a deadline of X. Is there any way to accelerate your process?"',
          'Never lie about competing offers — it can backfire badly',
          'Ask for 3–5 business days to consider any offer you receive',
          'It\'s OK to decline politely if the role isn\'t right — maintain the relationship',
        ],
      },
    ],
  },
];

const colorMap: Record<string, { tab: string; border: string; icon: string; badge: string }> = {
  blue: {
    tab: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    border: 'border-l-blue-500',
    icon: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  },
  purple: {
    tab: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    border: 'border-l-purple-500',
    icon: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  },
  green: {
    tab: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    border: 'border-l-green-500',
    icon: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    badge: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  },
  amber: {
    tab: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    border: 'border-l-amber-500',
    icon: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  },
};

function StepCard({ step, color }: { step: typeof phases[0]['steps'][0]; color: string }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[color];

  return (
    <Card className={`border-0 border-l-4 ${c.border} shadow-sm dark:shadow-slate-800/20`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors rounded-xl"
      >
        <span className={`p-2 rounded-lg flex-shrink-0 ${c.icon}`}>{step.icon}</span>
        <span className="flex-1 font-semibold text-gray-900 dark:text-white text-sm">{step.title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <CardContent className="pt-0 pb-4 px-5">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{step.body}</p>
          <ul className="space-y-2">
            {step.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}

export function JobSearchPage() {
  const [activePhase, setActivePhase] = useState('prepare');
  const phase = phases.find(p => p.id === activePhase)!;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-10">

        {/* Header */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full mb-4">
            Job Search Playbook
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The Complete Job Search Strategy Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A step-by-step playbook covering preparation, networking, applications, and follow-ups — everything you need to land your next role faster.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { stat: '85%', label: 'Jobs filled through networking' },
            { stat: '7s', label: 'Average recruiter resume scan time' },
            { stat: '3–6', label: 'Months average job search duration' },
            { stat: '2%', label: 'Application-to-offer conversion rate' },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{s.stat}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Phase tabs */}
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {phases.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activePhase === p.id
                    ? colorMap[p.color].tab + ' shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-current opacity-20 flex-shrink-0" />
                <span className="text-xs text-gray-400 dark:text-gray-500 mr-0.5">{i + 1}.</span>
                {p.label}
              </button>
            ))}
          </div>

          <div className="mb-5">
            <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colorMap[phase.color].badge}`}>
              Phase {phases.indexOf(phase) + 1} of {phases.length}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{phase.description}</p>
          </div>

          <div className="space-y-3">
            {phase.steps.map((step, i) => (
              <StepCard key={i} step={step} color={phase.color} />
            ))}
          </div>
        </div>

        {/* Job board resources */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommended Job Boards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'LinkedIn Jobs', tag: 'All industries', desc: 'Best for professional roles and direct recruiter contact', url: 'https://linkedin.com/jobs' },
              { name: 'Indeed', tag: 'All industries', desc: 'Largest aggregator — great for broad searches and alerts', url: 'https://indeed.com' },
              { name: 'Wellfound (AngelList)', tag: 'Startups', desc: 'Best for startup and early-stage company roles', url: 'https://wellfound.com' },
              { name: 'We Work Remotely', tag: 'Remote', desc: 'Curated remote-first job listings across disciplines', url: 'https://weworkremotely.com' },
              { name: 'Glassdoor', tag: 'With reviews', desc: 'Job listings plus salary data and company reviews', url: 'https://glassdoor.com' },
              { name: 'Dice', tag: 'Tech', desc: 'Technology-focused roles — great for developers', url: 'https://dice.com' },
            ].map((board, i) => (
              <a
                key={i}
                href={board.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{board.name}</p>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-full">{board.tag}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{board.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-blue-500 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
