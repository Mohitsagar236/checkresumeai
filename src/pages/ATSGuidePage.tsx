import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, AlertTriangle, Zap, FileText, Search, Layout, Tag } from 'lucide-react';

const tips = [
  {
    icon: <FileText className="w-6 h-6 text-blue-500" />,
    title: 'Use Standard Section Headings',
    description:
      'ATS software scans for recognizable section labels. Use exact headings like "Work Experience", "Education", "Skills", and "Summary". Avoid creative names like "My Journey" or "Where I\'ve Been" — parsers will miss them entirely.',
    doList: ['Work Experience / Professional Experience', 'Education', 'Skills / Technical Skills', 'Certifications', 'Summary / Professional Summary'],
    dontList: ['My Story', 'Career Highlights (as a main section)', 'What I Bring to the Table', 'Achievements (standalone top section)'],
  },
  {
    icon: <Search className="w-6 h-6 text-green-500" />,
    title: 'Mirror Keywords from the Job Description',
    description:
      'Most ATS systems rank resumes based on keyword matches with the job posting. Read the job description carefully and incorporate relevant skills, tools, and terminology verbatim. Synonyms often don\'t count.',
    doList: ['Copy exact phrases: "project management", "cross-functional teams"', 'Include both long-form and abbreviations: "Search Engine Optimization (SEO)"', 'Add technical tools mentioned: "Jira, Confluence, Salesforce"', 'Match the seniority level language used in the posting'],
    dontList: ['Assume synonyms count — "led" vs "managed" can matter', 'Stuff keywords unnaturally in every sentence', 'Ignore skills listed in "Nice to Have" sections'],
  },
  {
    icon: <Layout className="w-6 h-6 text-purple-500" />,
    title: 'Keep Formatting Simple and Clean',
    description:
      'Fancy formatting, tables, columns, and graphics look great to human eyes but confuse ATS parsers. Stick to a single-column, plain-text-friendly layout with standard fonts.',
    doList: ['Single-column layout', 'Standard fonts: Arial, Calibri, Times New Roman', 'Simple bullet points (• or -)', 'Clear date ranges: "Jan 2021 – Mar 2023"'],
    dontList: ['Two-column layouts (ATS reads left-to-right, merging columns)', 'Tables for skills sections', 'Text boxes and shapes', 'Headers/footers for contact info', 'Icons, logos, and photos'],
  },
  {
    icon: <Tag className="w-6 h-6 text-orange-500" />,
    title: 'Save in the Right File Format',
    description:
      'Most ATS systems handle .docx and plain .pdf files well. Scanned PDFs (image-based) are invisible to parsers — always export from your word processor, never scan a printed copy.',
    doList: ['.docx (Microsoft Word) — safest universal format', '.pdf created from Word/Google Docs export', 'File name: FirstName-LastName-Resume.pdf'],
    dontList: ['Scanned PDF (image-based — unreadable by ATS)', '.pages (Apple Pages — not widely supported)', 'Zip files or Google Drive links', 'File names with spaces or special characters'],
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: 'Write Out Abbreviations on First Use',
    description:
      'ATS keyword matching is often literal. If the job posting says "Search Engine Optimization" but your resume only has "SEO", a strict matcher may not count it. Introduce both.',
    doList: ['Search Engine Optimization (SEO)', 'Application Programming Interface (API)', 'Customer Relationship Management (CRM)', 'Key Performance Indicator (KPI)'],
    dontList: ['Using only the abbreviation without ever expanding it', 'Using informal shorthand like "PM" without clarifying if it\'s "Project Manager" or "Product Manager"'],
  },
];

const checklist = [
  'Contact info is at the top (not in a header/footer)',
  'Section headings are standard and spelled correctly',
  'No tables, text boxes, or multi-column layouts',
  'Keywords from the job description are included verbatim',
  'Dates are in a consistent format (e.g., Jan 2022 – Mar 2024)',
  'File saved as .docx or text-based .pdf',
  'File name is clean (e.g., Jane-Doe-Resume.pdf)',
  'No graphics, icons, or photos',
  'Fonts are standard (Arial, Calibri, Times New Roman)',
  'Skills section exists with relevant technical and soft skills',
  'Abbreviations are written out at least once',
  'No spelling errors in section headings',
];

const commonMistakes = [
  { mistake: 'Using a two-column template', impact: 'ATS reads columns left-to-right and merges text, creating gibberish.' },
  { mistake: 'Putting contact info in the document header', impact: 'Many parsers skip document headers entirely, so your email/phone is invisible.' },
  { mistake: 'Using images of your name or job title', impact: 'Graphics are completely ignored by ATS — the information never gets parsed.' },
  { mistake: 'Using "creative" job titles', impact: '"Ninja Developer" or "Marketing Rockstar" won\'t match any standard keyword filter.' },
  { mistake: 'Saving as .pages or .odt', impact: 'Non-standard formats are often rejected before a human even sees your resume.' },
  { mistake: 'Listing skills only in a visual bar/chart', impact: 'Visual skill ratings are images — the skills text inside them doesn\'t get extracted.' },
];

function TipCard({ tip, index }: { tip: typeof tips[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-0 shadow-md dark:shadow-slate-800/20 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
      >
        <div className="mt-0.5 flex-shrink-0">{tip.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              <span className="text-blue-500 mr-2">{index + 1}.</span>{tip.title}
            </h3>
            {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tip.description}</p>
        </div>
      </button>

      {open && (
        <div className="px-6 pb-5 border-t border-gray-100 dark:border-slate-700 pt-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tip.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Do
              </p>
              <ul className="space-y-1.5">
                {tip.doList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Avoid
              </p>
              <ul className="space-y-1.5">
                {tip.dontList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function ATSGuidePage() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const toggle = (i: number) => setCheckedItems(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">

        {/* Hero */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full mb-4">
            ATS Optimization Guide
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Beat the ATS: Get Your Resume Past the Robots
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Over 98% of Fortune 500 companies use Applicant Tracking Systems to filter candidates before a human ever reads a resume. Learn exactly how to format and write your resume to pass these filters.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { stat: '98%', label: 'of large companies use ATS' },
            { stat: '75%', label: 'of resumes rejected by ATS before human review' },
            { stat: '3×', label: 'more interview chances with ATS-optimized resume' },
          ].map((s, i) => (
            <div key={i} className="text-center p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{s.stat}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5 Essential ATS Rules</h2>
          <div className="space-y-3">
            {tips.map((tip, idx) => <TipCard key={idx} tip={tip} index={idx} />)}
          </div>
        </div>

        {/* Common Mistakes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" /> Common ATS Killers
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm">These mistakes cause ATS rejection even for highly qualified candidates.</p>
          <div className="space-y-3">
            {commonMistakes.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.mistake}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Checklist */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pre-Submission Checklist</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm">
            Run through this before sending any application. &nbsp;
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {checkedCount}/{checklist.length} complete
            </span>
          </p>
          <Card className="border-0 shadow-md dark:shadow-slate-800/20">
            <CardContent className="pt-5 space-y-2">
              {checklist.map((item, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[i]}
                    onChange={() => toggle(i)}
                    className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0"
                  />
                  <span className={`text-sm ${checkedItems[i] ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item}
                  </span>
                </label>
              ))}
              {checkedCount === checklist.length && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Your resume is ATS-ready! Good luck with your application.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
