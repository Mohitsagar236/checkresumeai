import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Save, 
  Send,
  X,
  GripVertical,
  Users,
  Globe,
  Target,
  Brain,
  Sparkles,
  Crown,
  Zap,
  BarChart3,
  RefreshCw,
  FileText,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Layout,
  Moon,
  Sun
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { create } from 'zustand';
import { useTheme } from '../context/ThemeContext';

// Types
interface BulletPoint {
  id: string;
  text: string;
}

interface ResumeSection {
  id: string;
  name: string;
  points: BulletPoint[];
  isEditing: boolean;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface ResumeSettings {
  fontFamily: string;
  fontSize: number;
  spacing: number;
}

interface ResumeStore {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  settings: ResumeSettings;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addSection: () => void;
  updateSection: (id: string, updates: Partial<ResumeSection>) => void;
  deleteSection: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  addBulletPoint: (sectionId: string) => void;
  updateBulletPoint: (sectionId: string, pointId: string, text: string) => void;
  deleteBulletPoint: (sectionId: string, pointId: string) => void;
  updateSettings: (settings: Partial<ResumeSettings>) => void;
}

// Zustand Store
const useResumeStore = create<ResumeStore>((set) => ({
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    summary: 'Experienced software engineer with 5+ years in full-stack development. Proven track record of delivering scalable web applications and leading cross-functional teams.'
  },
  sections: [
    {
      id: '1',
      name: 'Experience',
      isEditing: false,
      points: [
        { id: '1-1', text: 'Led development team of 5 engineers at Tech Corp, increasing productivity by 40%' },
        { id: '1-2', text: 'Architected and implemented microservices infrastructure serving 1M+ users' },
        { id: '1-3', text: 'Reduced system response time by 60% through database optimization' }
      ]
    },
    {
      id: '2',
      name: 'Skills',
      isEditing: false,
      points: [
        { id: '2-1', text: 'JavaScript, TypeScript, React, Node.js, Python' },
        { id: '2-2', text: 'AWS, Docker, Kubernetes, CI/CD, MongoDB' },
        { id: '2-3', text: 'Agile Development, Team Leadership, Code Review' }
      ]
    },
    {
      id: '3',
      name: 'Education',
      isEditing: false,
      points: [
        { id: '3-1', text: 'Bachelor of Science in Computer Science - MIT (2018)' },
        { id: '3-2', text: 'Relevant Coursework: Data Structures, Algorithms, Software Engineering' }
      ]
    }
  ],
  settings: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    spacing: 1.5
  },
  updatePersonalInfo: (info) => set(state => ({
    personalInfo: { ...state.personalInfo, ...info }
  })),
  addSection: () => set(state => ({
    sections: [...state.sections, {
      id: Date.now().toString(),
      name: 'New Section',
      isEditing: true,
      points: []
    }]
  })),
  updateSection: (id, updates) => set(state => ({
    sections: state.sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    )
  })),
  deleteSection: (id) => set(state => ({
    sections: state.sections.filter(section => section.id !== id)
  })),
  moveSection: (id, direction) => set(state => {
    const sections = [...state.sections];
    const index = sections.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    }
    return { sections };
  }),
  addBulletPoint: (sectionId) => set(state => ({
    sections: state.sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            points: [...section.points, {
              id: `${sectionId}-${Date.now()}`,
              text: 'New bullet point'
            }]
          }
        : section
    )
  })),
  updateBulletPoint: (sectionId, pointId, text) => set(state => ({
    sections: state.sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            points: section.points.map(point => 
              point.id === pointId ? { ...point, text } : point
            )
          }
        : section
    )
  })),
  deleteBulletPoint: (sectionId, pointId) => set(state => ({
    sections: state.sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            points: section.points.filter(point => point.id !== pointId)
          }
        : section
    )
  })),
  updateSettings: (settings) => set(state => ({
    settings: { ...state.settings, ...settings }
  }))
}));

// Template Definitions - 50+ Professional Templates
const resumeTemplates = {
  // Professional Category
  classic: {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean, traditional layout perfect for corporate roles',
    preview: '📄',
    category: 'Professional'
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Elite',
    description: 'Formal business template with structured sections',
    preview: '🏢',
    category: 'Professional'
  },
  executive: {
    id: 'executive',
    name: 'Executive Premium',
    description: 'Sophisticated design for senior-level positions',
    preview: '👔',
    category: 'Professional'
  },
  banking: {
    id: 'banking',
    name: 'Banking & Finance',
    description: 'Conservative layout for financial sector roles',
    preview: '💼',
    category: 'Professional'
  },
  consulting: {
    id: 'consulting',
    name: 'Management Consulting',
    description: 'Strategic layout emphasizing achievements',
    preview: '📊',
    category: 'Professional'
  },
  legal: {
    id: 'legal',
    name: 'Legal Professional',
    description: 'Formal template for law and compliance roles',
    preview: '⚖️',
    category: 'Professional'
  },
  medical: {
    id: 'medical',
    name: 'Healthcare Professional',
    description: 'Clean medical template with certification focus',
    preview: '⚕️',
    category: 'Professional'
  },
  government: {
    id: 'government',
    name: 'Government & Public Service',
    description: 'Official template for public sector positions',
    preview: '🏛️',
    category: 'Professional'
  },

  // Modern Category
  modern: {
    id: 'modern',
    name: 'Modern Creative',
    description: 'Contemporary design with accent colors and visual elements',
    preview: '🎨',
    category: 'Modern'
  },
  startup: {
    id: 'startup',
    name: 'Startup Dynamic',
    description: 'Innovative layout for fast-paced environments',
    preview: '🚀',
    category: 'Modern'
  },
  tech: {
    id: 'tech',
    name: 'Tech Professional',
    description: 'Modern template optimized for technology roles',
    preview: '💻',
    category: 'Modern'
  },
  digital: {
    id: 'digital',
    name: 'Digital Native',
    description: 'Contemporary design for digital professionals',
    preview: '📱',
    category: 'Modern'
  },
  innovation: {
    id: 'innovation',
    name: 'Innovation Leader',
    description: 'Forward-thinking design for change agents',
    preview: '💡',
    category: 'Modern'
  },
  agile: {
    id: 'agile',
    name: 'Agile Professional',
    description: 'Flexible layout for agile environments',
    preview: '🔄',
    category: 'Modern'
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud Architect',
    description: 'Modern template for cloud professionals',
    preview: '☁️',
    category: 'Modern'
  },
  ai: {
    id: 'ai',
    name: 'AI & Machine Learning',
    description: 'Cutting-edge design for AI specialists',
    preview: '🤖',
    category: 'Modern'
  },

  // Creative Category
  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Artistic layout with visual emphasis',
    preview: '🎭',
    category: 'Creative'
  },
  designer: {
    id: 'designer',
    name: 'Designer Showcase',
    description: 'Visual-first template for design professionals',
    preview: '🎨',
    category: 'Creative'
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Pro',
    description: 'Brand-focused template for marketing roles',
    preview: '📢',
    category: 'Creative'
  },
  media: {
    id: 'media',
    name: 'Media & Communications',
    description: 'Dynamic layout for media professionals',
    preview: '📺',
    category: 'Creative'
  },
  photography: {
    id: 'photography',
    name: 'Photography Portfolio',
    description: 'Visual template for photographers',
    preview: '📸',
    category: 'Creative'
  },
  advertising: {
    id: 'advertising',
    name: 'Advertising Creative',
    description: 'Bold design for advertising professionals',
    preview: '🎯',
    category: 'Creative'
  },
  social: {
    id: 'social',
    name: 'Social Media Manager',
    description: 'Trendy template for social media roles',
    preview: '📲',
    category: 'Creative'
  },
  content: {
    id: 'content',
    name: 'Content Creator',
    description: 'Engaging layout for content professionals',
    preview: '✍️',
    category: 'Creative'
  },

  // Academic Category
  academic: {
    id: 'academic',
    name: 'Academic & Research',
    description: 'Table-based format ideal for academic and research positions',
    preview: '🎓',
    category: 'Academic'
  },
  research: {
    id: 'research',
    name: 'Research Scholar',
    description: 'Publication-focused template for researchers',
    preview: '🔬',
    category: 'Academic'
  },
  professor: {
    id: 'professor',
    name: 'Professor & Faculty',
    description: 'Comprehensive template for academic positions',
    preview: '👨‍🏫',
    category: 'Academic'
  },
  phd: {
    id: 'phd',
    name: 'PhD Candidate',
    description: 'Academic template for doctoral students',
    preview: '📚',
    category: 'Academic'
  },
  scientist: {
    id: 'scientist',
    name: 'Research Scientist',
    description: 'Technical template for scientific roles',
    preview: '🧪',
    category: 'Academic'
  },
  education: {
    id: 'education',
    name: 'Education Professional',
    description: 'Teaching-focused template for educators',
    preview: '📖',
    category: 'Academic'
  },
  librarian: {
    id: 'librarian',
    name: 'Library & Information',
    description: 'Organized template for information professionals',
    preview: '📚',
    category: 'Academic'
  },

  // Technical Category
  engineer: {
    id: 'engineer',
    name: 'Software Engineer',
    description: 'Technical template for engineering roles',
    preview: '⚙️',
    category: 'Technical'
  },
  devops: {
    id: 'devops',
    name: 'DevOps Engineer',
    description: 'Operations-focused technical template',
    preview: '🔧',
    category: 'Technical'
  },
  security: {
    id: 'security',
    name: 'Cybersecurity',
    description: 'Security-focused professional template',
    preview: '🔒',
    category: 'Technical'
  },
  data: {
    id: 'data',
    name: 'Data Scientist',
    description: 'Analytics-focused template with metrics emphasis',
    preview: '📊',
    category: 'Technical'
  },
  fullstack: {
    id: 'fullstack',
    name: 'Full Stack Developer',
    description: 'Comprehensive technical template',
    preview: '🌐',
    category: 'Technical'
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile Developer',
    description: 'App development focused template',
    preview: '📱',
    category: 'Technical'
  },
  blockchain: {
    id: 'blockchain',
    name: 'Blockchain Developer',
    description: 'Cryptocurrency and blockchain template',
    preview: '⛓️',
    category: 'Technical'
  },
  qa: {
    id: 'qa',
    name: 'QA Engineer',
    description: 'Testing and quality assurance template',
    preview: '🧪',
    category: 'Technical'
  },

  // Minimal Category
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on content clarity',
    preview: '⚪',
    category: 'Minimal'
  },
  simple: {
    id: 'simple',
    name: 'Simple Elegant',
    description: 'Clean and straightforward design',
    preview: '📝',
    category: 'Minimal'
  },
  zen: {
    id: 'zen',
    name: 'Zen Minimalist',
    description: 'Ultra-clean design with maximum white space',
    preview: '🕊️',
    category: 'Minimal'
  },
  basic: {
    id: 'basic',
    name: 'Basic Professional',
    description: 'No-frills professional template',
    preview: '📄',
    category: 'Minimal'
  },
  clean: {
    id: 'clean',
    name: 'Clean Lines',
    description: 'Minimal template with subtle dividers',
    preview: '📋',
    category: 'Minimal'
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Clean',
    description: 'Scandinavian-inspired minimal design',
    preview: '❄️',
    category: 'Minimal'
  },

  // International Category
  european: {
    id: 'european',
    name: 'European Standard',
    description: 'EU-format template with photo section',
    preview: '🇪🇺',
    category: 'International'
  },
  asian: {
    id: 'asian',
    name: 'Asian Business',
    description: 'Asia-Pacific business format',
    preview: '🏢',
    category: 'International'
  },
  australian: {
    id: 'australian',
    name: 'Australian Format',
    description: 'Australian resume standard',
    preview: '🇦🇺',
    category: 'International'
  },
  canadian: {
    id: 'canadian',
    name: 'Canadian Professional',
    description: 'Canadian resume format',
    preview: '🇨🇦',
    category: 'International'
  },
  uk: {
    id: 'uk',
    name: 'UK CV Format',
    description: 'British curriculum vitae standard',
    preview: '🇬🇧',
    category: 'International'
  },

  // Industry Specific
  sales: {
    id: 'sales',
    name: 'Sales Professional',
    description: 'Results-driven template for sales roles',
    preview: '💰',
    category: 'Sales'
  },
  retail: {
    id: 'retail',
    name: 'Retail Manager',
    description: 'Customer-focused retail template',
    preview: '🛍️',
    category: 'Sales'
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality Professional',
    description: 'Service-oriented template',
    preview: '🏨',
    category: 'Service'
  },
  nonprofit: {
    id: 'nonprofit',
    name: 'Non-Profit Professional',
    description: 'Mission-driven template for NGO roles',
    preview: '🤝',
    category: 'Service'
  }
};

// Template Components
const ClassicTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections, settings } = useResumeStore();

  return (
    <div 
      ref={ref}
      className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-8 shadow-lg h-full overflow-auto max-w-[8.5in] mx-auto`}
      style={{
        fontFamily: settings.fontFamily || 'Times New Roman, serif',
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.spacing,
        minHeight: '11in'
      }}
    >
      {/* Classic Header */}
      <header className={`text-center mb-8 pb-4 border-b-2 ${isDark ? 'border-gray-400' : 'border-black'}`}>
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'} uppercase tracking-wide`}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} space-x-2`}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span>•</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span>•</span><span>{personalInfo.location}</span></>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-black'} uppercase`}>
            Professional Summary
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'} leading-relaxed text-justify`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Sections */}
      {sections.map(section => (
        <section key={section.id} className="mb-6">
          <h2 className={`text-lg font-bold mb-3 ${isDark ? 'text-white border-gray-500' : 'text-black border-gray-400'} uppercase border-b pb-1`}>
            {section.name}
          </h2>
          <div className="space-y-2">
            {section.points.map(point => (
              <div key={point.id} className="flex items-start">
                <span className="mr-3 mt-1">•</span>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  {point.text}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
});

const ModernTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections, settings } = useResumeStore();

  return (
    <div 
      ref={ref}
      className={`${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg h-full overflow-auto max-w-[8.5in] mx-auto`}
      style={{
        fontFamily: settings.fontFamily || 'Arial, sans-serif',
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.spacing,
        minHeight: '11in'
      }}
    >
      {/* Modern Header with Gradient */}
      <header className={`${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white p-8 -mx-0`}>
        <h1 className="text-4xl font-bold mb-2">{personalInfo.name || 'Your Name'}</h1>
        <p className={`text-xl ${isDark ? 'text-gray-200' : 'text-blue-100'} mb-4`}>
          {personalInfo.summary || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center">
              <span className="mr-2">✉</span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Sections with Modern Styling */}
        {sections.map(section => (
          <section key={section.id} className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-gray-200 border-gray-400' : 'text-blue-700 border-blue-500'} border-l-4 pl-4`}>
              {section.name}
            </h2>
            <div className="space-y-3">
              {section.points.map(point => (
                <div key={point.id} className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-blue-300'} p-3 rounded-lg border-l-4`}>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
});

const AcademicTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections, settings } = useResumeStore();

  return (
    <div 
      ref={ref}
      className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-8 shadow-lg h-full overflow-auto max-w-[8.5in] mx-auto`}
      style={{
        fontFamily: settings.fontFamily || 'Times New Roman, serif',
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.spacing,
        minHeight: '11in'
      }}
    >
      {/* Academic Header */}
      <header className={`flex items-start mb-8 pb-6 border-b-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
        <div className="mr-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <div className="text-white font-bold text-xl">
              {personalInfo.name ? personalInfo.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'MS'}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
            {personalInfo.summary || 'Academic Title'}
          </p>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
            {personalInfo.email && <div className="flex justify-between"><span></span><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex justify-between"><span></span><span>{personalInfo.phone}</span></div>}
            {personalInfo.location && <div className="flex justify-between"><span></span><span>{personalInfo.location}</span></div>}
          </div>
        </div>
      </header>

      {/* Academic Sections */}
      {sections.map((section) => {
        const isEducation = section.name.toLowerCase().includes('education');
        
        return (
          <section key={section.id} className="mb-8">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} px-4 py-2 mb-4`}>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} uppercase`}>
                {section.name}
              </h2>
            </div>

            {isEducation ? (
              <table className={`w-full border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                <thead>
                  <tr className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                    <th className={`border ${isDark ? 'border-gray-600 text-gray-200' : 'border-gray-300'} px-4 py-2 text-left`}>Degree</th>
                    <th className={`border ${isDark ? 'border-gray-600 text-gray-200' : 'border-gray-300'} px-4 py-2 text-left`}>University/Institute</th>
                    <th className={`border ${isDark ? 'border-gray-600 text-gray-200' : 'border-gray-300'} px-4 py-2 text-left`}>Year</th>
                    <th className={`border ${isDark ? 'border-gray-600 text-gray-200' : 'border-gray-300'} px-4 py-2 text-left`}>CGPA/Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {section.points.map((point, idx) => (
                    <tr key={point.id} className={idx % 2 === 0 ? (isDark ? 'bg-gray-900' : 'bg-white') : (isDark ? 'bg-gray-800' : 'bg-gray-50')}>
                      <td className={`border ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300'} px-4 py-2 text-sm`}>{point.text}</td>
                      <td className={`border ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300'} px-4 py-2 text-sm`}>-</td>
                      <td className={`border ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300'} px-4 py-2 text-sm`}>-</td>
                      <td className={`border ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300'} px-4 py-2 text-sm`}>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="space-y-2">
                {section.points.map(point => (
                  <div key={point.id} className="flex items-start">
                    <span className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-600'} rounded-full mt-2 mr-3`}></span>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{point.text}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
});

const ExecutiveTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections, settings } = useResumeStore();

  return (
    <div 
      ref={ref}
      className={`${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg h-full overflow-auto max-w-[8.5in] mx-auto`}
      style={{
        fontFamily: settings.fontFamily || 'Georgia, serif',
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.spacing,
        minHeight: '11in'
      }}
    >
      {/* Executive Header */}
      <header className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-700' : 'bg-gradient-to-r from-gray-800 to-gray-600'} text-white p-8`}>
        <div className="border-l-4 border-yellow-400 pl-6">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">{personalInfo.name || 'Your Name'}</h1>
          <div className="w-16 h-1 bg-yellow-400 mb-4"></div>
          <p className={`text-xl ${isDark ? 'text-gray-100' : 'text-gray-200'} mb-4`}>
            {personalInfo.summary || 'Executive Professional'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {personalInfo.email && <div>✉ {personalInfo.email}</div>}
            {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
            {personalInfo.location && <div>📍 {personalInfo.location}</div>}
          </div>
        </div>
      </header>

      <div className="p-8">
        {sections.map(section => (
          <section key={section.id} className="mb-8">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 ${isDark ? 'bg-gray-600' : 'bg-gray-800'} text-white rounded-full flex items-center justify-center mr-4 text-sm font-bold`}>
                {section.name[0]}
              </div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} uppercase tracking-wide`}>
                {section.name}
              </h2>
              <div className={`flex-1 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'} ml-4`}></div>
            </div>
            <div className="space-y-4 ml-12">
              {section.points.map(point => (
                <div key={point.id} className="relative">
                  <div className="absolute -left-8 top-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
});

const MinimalTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections, settings } = useResumeStore();

  return (
    <div 
      ref={ref}
      className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-12 shadow-lg h-full overflow-auto max-w-[8.5in] mx-auto`}
      style={{
        fontFamily: settings.fontFamily || 'Helvetica, sans-serif',
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.spacing,
        minHeight: '11in'
      }}
    >
      {/* Minimal Header */}
      <header className="mb-12">
        <h1 className={`text-5xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div className={`w-24 h-px ${isDark ? 'bg-gray-400' : 'bg-gray-900'} mb-6`}></div>
        {personalInfo.summary && (
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6 font-light leading-relaxed`}>
            {personalInfo.summary}
          </p>
        )}
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} space-x-8`}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {/* Minimal Sections */}
      {sections.map(section => (
        <section key={section.id} className="mb-10">
          <h2 className={`text-sm font-semibold ${isDark ? 'text-white border-gray-600' : 'text-gray-900 border-gray-200'} uppercase tracking-widest mb-6 pb-2 border-b`}>
            {section.name}
          </h2>
          <div className="space-y-4">
            {section.points.map(point => (
              <p key={point.id} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {point.text}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
});

// Additional Professional Templates
const CorporateTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections } = useResumeStore();
  
  return (
    <div ref={ref} className={`max-w-2xl mx-auto p-8 font-serif ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <header className="mb-8">
        <div className={`text-center pb-6 border-b-4 ${isDark ? 'border-blue-400' : 'border-blue-600'}`}>
          <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
          <div className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
            <p>{personalInfo.email} • {personalInfo.phone}</p>
            <p>{personalInfo.location}</p>
          </div>
        </div>
        {personalInfo.summary && (
          <div className="mt-6">
            <h2 className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-3`}>EXECUTIVE SUMMARY</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{personalInfo.summary}</p>
          </div>
        )}
      </header>
      {sections.map(section => (
        <section key={section.id} className="mb-8">
          <h2 className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-wide mb-4 pb-2 border-b-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {section.name}
          </h2>
          <div className="space-y-3">
            {section.points.map(point => (
              <p key={point.id} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed pl-4 border-l-2 ${isDark ? 'border-blue-400' : 'border-blue-600'}`}>
                {point.text}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
});

const BankingTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections } = useResumeStore();
  
  return (
    <div ref={ref} className={`max-w-2xl mx-auto p-8 font-sans ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <header className={`mb-8 p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
        <h1 className="text-3xl font-bold mb-3">{personalInfo.name}</h1>
        <div className={`grid grid-cols-2 gap-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <div>Email: {personalInfo.email}</div>
          <div>Phone: {personalInfo.phone}</div>
          <div className="col-span-2">Location: {personalInfo.location}</div>
        </div>
        {personalInfo.summary && (
          <div className="mt-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Professional Summary</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{personalInfo.summary}</p>
          </div>
        )}
      </header>
      {sections.map(section => (
        <section key={section.id} className="mb-6">
          <h2 className={`text-lg font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-3 pb-1 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            {section.name}
          </h2>
          <div className="space-y-2">
            {section.points.map(point => (
              <p key={point.id} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
                • {point.text}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
});

const TechTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections } = useResumeStore();
  
  return (
    <div ref={ref} className={`max-w-2xl mx-auto p-8 font-mono ${isDark ? 'bg-gray-900 text-green-400' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <header className="mb-8">
        <div className={`border-2 ${isDark ? 'border-green-400' : 'border-blue-500'} p-6 rounded-lg`}>
          <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-green-400' : 'text-blue-600'}`}>
            {'> '}{personalInfo.name}
          </h1>
          <div className={`space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>{'// '}{personalInfo.email}</p>
            <p>{'// '}{personalInfo.phone}</p>
            <p>{'// '}{personalInfo.location}</p>
          </div>
        </div>
        {personalInfo.summary && (
          <div className="mt-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-blue-600'} mb-3`}>
              {'/* ABOUT */'}
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{personalInfo.summary}</p>
          </div>
        )}
      </header>
      {sections.map(section => (
        <section key={section.id} className="mb-6">
          <h2 className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-blue-600'} mb-3`}>
            {'/* '}{section.name.toUpperCase()}{' */'}
          </h2>
          <div className="space-y-2 ml-4">
            {section.points.map(point => (
              <p key={point.id} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
                {'- '}{point.text}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
});

const CreativeTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections } = useResumeStore();
  
  return (
    <div ref={ref} className={`max-w-2xl mx-auto p-8 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <header className="mb-8 relative">
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isDark ? 'from-purple-500 to-pink-500' : 'from-purple-600 to-pink-600'}`}></div>
        <div className="pt-6">
          <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r ${isDark ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
            {personalInfo.name}
          </h1>
          <div className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            <p>{personalInfo.email} | {personalInfo.phone} | {personalInfo.location}</p>
          </div>
        </div>
        {personalInfo.summary && (
          <div className={`mt-6 p-4 ${isDark ? 'bg-gray-800 border-l-4 border-purple-400' : 'bg-purple-50 border-l-4 border-purple-600'} rounded-r-lg`}>
            <h2 className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-2`}>Creative Vision</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed italic`}>{personalInfo.summary}</p>
          </div>
        )}
      </header>
      {sections.map(section => (
        <section key={section.id} className="mb-8">
          <h2 className={`text-xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-4 relative`}>
            {section.name}
            <div className={`absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r ${isDark ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'}`}></div>
          </h2>
          <div className="space-y-3 ml-4">
            {section.points.map(point => (
              <p key={point.id} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed relative pl-6`}>
                <span className={`absolute left-0 top-2 w-2 h-2 ${isDark ? 'bg-purple-400' : 'bg-purple-600'} rounded-full`}></span>
                {point.text}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
});

const StartupTemplate = React.forwardRef<HTMLDivElement, { isDark?: boolean }>((props, ref) => {
  const { isDark = false } = props;
  const { personalInfo, sections } = useResumeStore();
  
  return (
    <div ref={ref} className={`max-w-2xl mx-auto p-8 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <header className="mb-8">
        <div className={`p-6 ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white rounded-lg shadow-lg`}>
          <h1 className="text-3xl font-bold mb-2">🚀 {personalInfo.name}</h1>
          <div className="text-lg opacity-90">
            <p>{personalInfo.email} • {personalInfo.phone} • {personalInfo.location}</p>
          </div>
        </div>
        {personalInfo.summary && (
          <div className="mt-6">
            <h2 className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-3`}>💡 Mission Statement</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>{personalInfo.summary}</p>
          </div>
        )}
      </header>
      {sections.map(section => (
        <section key={section.id} className="mb-8">
          <h2 className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-4 flex items-center`}>
            <span className={`w-8 h-8 ${isDark ? 'bg-blue-400' : 'bg-blue-600'} text-white rounded-full flex items-center justify-center text-sm mr-3`}>
              {section.name.charAt(0)}
            </span>
            {section.name}
          </h2>
          <div className="space-y-3 ml-11">
            {section.points.map(point => (
              <p key={point.id} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                ⚡ {point.text}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
});

// Template Components Map
const templateComponents = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  academic: AcademicTemplate,
  executive: ExecutiveTemplate,
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  banking: BankingTemplate,
  tech: TechTemplate,
  creative: CreativeTemplate,
  startup: StartupTemplate,
  // Adding more will follow the same pattern
  consulting: CorporateTemplate, // Reuse with corporate style
  legal: BankingTemplate, // Reuse with banking style (formal)
  medical: BankingTemplate, // Reuse with banking style (clean/professional)
  government: BankingTemplate, // Reuse with banking style (formal)
  digital: TechTemplate, // Reuse with tech style
  innovation: StartupTemplate, // Reuse with startup style
  agile: TechTemplate, // Reuse with tech style
  cloud: TechTemplate, // Reuse with tech style
  ai: TechTemplate, // Reuse with tech style
  designer: CreativeTemplate, // Reuse with creative style
  marketing: CreativeTemplate, // Reuse with creative style
  media: CreativeTemplate, // Reuse with creative style
  photography: CreativeTemplate, // Reuse with creative style
  advertising: CreativeTemplate, // Reuse with creative style
  social: CreativeTemplate, // Reuse with creative style
  content: CreativeTemplate, // Reuse with creative style
  research: AcademicTemplate, // Reuse with academic style
  professor: AcademicTemplate, // Reuse with academic style
  phd: AcademicTemplate, // Reuse with academic style
  scientist: AcademicTemplate, // Reuse with academic style
  education: AcademicTemplate, // Reuse with academic style
  librarian: AcademicTemplate, // Reuse with academic style
  engineer: TechTemplate, // Reuse with tech style
  devops: TechTemplate, // Reuse with tech style
  security: TechTemplate, // Reuse with tech style
  data: TechTemplate, // Reuse with tech style
  fullstack: TechTemplate, // Reuse with tech style
  mobile: TechTemplate, // Reuse with tech style
  blockchain: TechTemplate, // Reuse with tech style
  qa: TechTemplate, // Reuse with tech style
  simple: MinimalTemplate, // Reuse with minimal style
  zen: MinimalTemplate, // Reuse with minimal style
  basic: MinimalTemplate, // Reuse with minimal style
  clean: MinimalTemplate, // Reuse with minimal style
  nordic: MinimalTemplate, // Reuse with minimal style
  european: CorporateTemplate, // Reuse with corporate style
  asian: CorporateTemplate, // Reuse with corporate style
  australian: CorporateTemplate, // Reuse with corporate style
  canadian: CorporateTemplate, // Reuse with corporate style
  uk: CorporateTemplate, // Reuse with corporate style
  sales: StartupTemplate, // Reuse with startup style (dynamic)
  retail: StartupTemplate, // Reuse with startup style
  hospitality: CreativeTemplate, // Reuse with creative style
  nonprofit: BankingTemplate // Reuse with banking style (professional)
};

// Resume Preview Component
const ResumePreview = React.forwardRef<HTMLDivElement, { template?: string; isDark?: boolean }>((props, ref) => {
  const { template = 'classic', isDark = false } = props;
  const TemplateComponent = templateComponents[template as keyof typeof templateComponents] || ClassicTemplate;
  
  return (
    <div data-theme={isDark ? 'dark' : 'light'} className={isDark ? 'dark' : ''}>
      <TemplateComponent ref={ref} isDark={isDark} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

// Main Resume Builder Component
const ResumeBuilder: React.FC = () => {
  const { darkMode } = useTheme(); // Access global dark mode state
  
  const {
    personalInfo,
    sections,
    settings,
    updatePersonalInfo,
    addSection,
    updateSection,
    deleteSection,
    moveSection,
    addBulletPoint,
    updateBulletPoint,
    deleteBulletPoint,
    updateSettings
  } = useResumeStore();

  const [editingPoint, setEditingPoint] = useState<{sectionId: string, pointId: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isForExport, setIsForExport] = useState(false); // Track if modal is for export or just template change
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Filter for template categories
  const resumeRef = useRef<HTMLDivElement>(null);

  // Initialize Live Preview dark mode to match global dark mode on mount
  useEffect(() => {
    setIsDarkPreview(darkMode);
  }, []); // Only run once on mount

  // Real-time score calculations
  const calculateATSScore = () => {
    let score = 0;
    
    // Basic info completeness (40 points)
    if (personalInfo.name) score += 10;
    if (personalInfo.email) score += 10;
    if (personalInfo.phone) score += 10;
    if (personalInfo.summary) score += 10;
    
    // Sections (40 points)
    const hasExperience = sections.some(s => s.name.toLowerCase().includes('experience') && s.points.length > 0);
    const hasSkills = sections.some(s => s.name.toLowerCase().includes('skill') && s.points.length > 0);
    const hasEducation = sections.some(s => s.name.toLowerCase().includes('education') && s.points.length > 0);
    
    if (hasExperience) score += 15;
    if (hasSkills) score += 15;
    if (hasEducation) score += 10;
    
    // Content quality (20 points)
    const totalPoints = sections.reduce((acc, section) => acc + section.points.length, 0);
    if (totalPoints >= 5) score += 10;
    if (totalPoints >= 10) score += 10;
    
    return Math.min(score, 100);
  };

  const calculateCompleteness = () => {
    let completeness = 0;
    const totalFields = 8; // name, email, phone, location, summary, experience, skills, education
    
    if (personalInfo.name) completeness++;
    if (personalInfo.email) completeness++;
    if (personalInfo.phone) completeness++;
    if (personalInfo.location) completeness++;
    if (personalInfo.summary) completeness++;
    
    const hasExperience = sections.some(s => s.name.toLowerCase().includes('experience') && s.points.length > 0);
    const hasSkills = sections.some(s => s.name.toLowerCase().includes('skill') && s.points.length > 0);
    const hasEducation = sections.some(s => s.name.toLowerCase().includes('education') && s.points.length > 0);
    
    if (hasExperience) completeness++;
    if (hasSkills) completeness++;
    if (hasEducation) completeness++;
    
    return Math.round((completeness / totalFields) * 100);
  };

  const calculateFormatGrade = () => {
    let score = 0;
    
    // Font appropriateness
    if (['Arial', 'Helvetica', 'Calibri', 'Trebuchet MS', 'Verdana', 'Tahoma', 'Century Gothic', 'Lucida Sans', 'Cambria'].includes(settings.fontFamily)) score += 30;
    else if (['Times New Roman', 'Georgia', 'Garamond', 'Book Antiqua', 'Palatino'].includes(settings.fontFamily)) score += 25;
    else if (['Franklin Gothic Medium'].includes(settings.fontFamily)) score += 20;
    else score += 15;
    
    // Font size appropriateness
    if (settings.fontSize >= 11 && settings.fontSize <= 12) score += 30;
    else if (settings.fontSize >= 10 && settings.fontSize <= 14) score += 25;
    else score += 15;
    
    // Line spacing appropriateness
    if (settings.spacing >= 1.4 && settings.spacing <= 1.6) score += 30;
    else if (settings.spacing >= 1.2 && settings.spacing <= 1.8) score += 25;
    else score += 15;
    
    // Section organization
    if (sections.length >= 3 && sections.length <= 6) score += 10;
    else score += 5;
    
    // Return letter grade
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    return 'C';
  };

  // Real-time calculated values
  const atsScore = calculateATSScore();
  const completenessScore = calculateCompleteness();
  const formatGrade = calculateFormatGrade();
  const sectionCount = sections.length;

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${personalInfo.name}_Resume_${selectedTemplate}`,
    onBeforePrint: () => {
      // Ensure the correct theme is applied before printing
      console.log('Preparing for print with dark mode:', isDarkPreview);
      
      // Add print-specific styles to force color preservation
      const printStyles = document.createElement('style');
      printStyles.id = 'resume-print-styles';
      printStyles.innerHTML = `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .bg-gray-900 { background-color: #111827 !important; }
          .bg-gray-800 { background-color: #1f2937 !important; }
          .text-white { color: #ffffff !important; }
          .text-gray-300 { color: #d1d5db !important; }
          .text-gray-400 { color: #9ca3af !important; }
          .border-gray-600 { border-color: #4b5563 !important; }
          .border-gray-500 { border-color: #6b7280 !important; }
          .border-gray-400 { border-color: #9ca3af !important; }
        }
      `;
      document.head.appendChild(printStyles);
      
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log('Print completed successfully');
      // Clean up print styles
      const printStyles = document.getElementById('resume-print-styles');
      if (printStyles) {
        printStyles.remove();
      }
    },
    onPrintError: (error: unknown) => {
      console.error('Print error:', error);
      // Clean up print styles on error too
      const printStyles = document.getElementById('resume-print-styles');
      if (printStyles) {
        printStyles.remove();
      }
    }
  });

  const handleDownloadClick = () => {
    setIsForExport(true);
    setSelectedCategory('All'); // Reset to show all categories
    setShowTemplateModal(true);
  };

  const handleTemplateChangeClick = () => {
    setIsForExport(false);
    setSelectedCategory('All'); // Reset to show all categories
    setShowTemplateModal(true);
  };

  const handleTemplateChange = (templateId: string) => {
    console.log('Template changed to:', templateId);
    setSelectedTemplate(templateId);
    setShowTemplateModal(false);
    
    // Show success message
    const templateName = resumeTemplates[templateId as keyof typeof resumeTemplates]?.name || templateId;
    console.log(`Template changed to: ${templateName}`);
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log('Template selected for export:', templateId, 'Dark mode:', isDarkPreview);
    setSelectedTemplate(templateId);
    
    // Close modal and show success message without immediately printing
    setShowTemplateModal(false);
    
    const templateName = resumeTemplates[templateId as keyof typeof resumeTemplates]?.name || templateId;
    console.log(`Template changed to: ${templateName} - Ready for download`);
    
    // Don't auto-print, let user manually download when ready
  };

  // Filter templates by category
  const getFilteredTemplates = () => {
    if (selectedCategory === 'All') {
      return Object.values(resumeTemplates);
    }
    return Object.values(resumeTemplates).filter(template => template.category === selectedCategory);
  };

  // Get templates by specific category
  const getTemplatesByCategory = (category: string) => {
    return Object.values(resumeTemplates).filter(template => template.category === category);
  };

  const handleSaveChanges = () => {
    // Simulate saving to localStorage or backend
    const resumeData = {
      personalInfo,
      sections,
      settings,
      scores: {
        atsScore,
        completenessScore, 
        formatGrade,
        sectionCount
      },
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('checkresumeai_resume_data', JSON.stringify(resumeData));
    console.log('Saving resume data:', resumeData);
    
    // Show success notification
    const originalText = 'Save';
    const button = document.querySelector('.save-button') as HTMLButtonElement;
    if (button) {
      button.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Saved!';
      setTimeout(() => {
        button.innerHTML = `<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path></svg>${originalText}`;
      }, 2000);
    }
  };

  const performAIAnalysis = () => {
    // Recalculate completeness for accuracy
    const currentCompletenessScore = calculateCompleteness();
    
    const totalWords = sections.reduce((acc, section) => 
      acc + section.points.reduce((pointAcc, point) => pointAcc + point.text.split(' ').length, 0), 0
    );
    
    const hasQuantifiedAchievements = sections.some(section => 
      section.points.some(point => /\d+%|\d+\+|\$\d+|increased|improved|reduced|saved/i.test(point.text))
    );
    
    const hasActionVerbs = sections.some(section => 
      section.points.some(point => /^(led|managed|developed|created|implemented|designed|optimized|achieved)/i.test(point.text))
    );
    
    const hasSkillsSection = sections.some(s => s.name.toLowerCase().includes('skill'));
    const hasExperienceSection = sections.some(s => s.name.toLowerCase().includes('experience'));
    const hasEducationSection = sections.some(s => s.name.toLowerCase().includes('education'));
    
    // Generate detailed feedback
    const suggestions = [];
    const strengths = [];
    const criticalIssues = [];
    
    // Analyze content quality
    if (hasQuantifiedAchievements) {
      strengths.push("Great use of quantified achievements - this shows measurable impact!");
    } else {
      suggestions.push("Add specific numbers and percentages to your achievements (e.g., 'Increased sales by 30%')");
    }
    
    if (hasActionVerbs) {
      strengths.push("Strong action verbs make your experience impactful");
    } else {
      suggestions.push("Start bullet points with powerful action verbs (Led, Managed, Developed, etc.)");
    }
    
    // Analyze sections
    if (!hasSkillsSection) {
      criticalIssues.push("Missing Skills section - this is crucial for ATS systems");
    }
    if (!hasExperienceSection) {
      criticalIssues.push("Missing Experience/Work History section");
    }
    if (!hasEducationSection) {
      suggestions.push("Consider adding an Education section to strengthen your profile");
    }
    
    // Analyze personal info
    if (!personalInfo.summary || personalInfo.summary.length < 50) {
      suggestions.push("Add a compelling professional summary (2-3 sentences highlighting your key value)");
    }
    
    // Word count analysis
    if (totalWords < 100) {
      criticalIssues.push("Resume content is too brief - aim for 200-400 words total");
    } else if (totalWords > 600) {
      suggestions.push("Consider condensing content - resumes should be concise and scannable");
    }
    
    // Font and formatting analysis
    if (['Helvetica', 'Arial', 'Calibri'].includes(settings.fontFamily)) {
      strengths.push(`Excellent font choice (${settings.fontFamily}) - highly ATS-compatible`);
    } else if (settings.fontFamily === 'Times New Roman') {
      suggestions.push("Consider switching to Arial or Helvetica for better readability");
    }
      if (settings.fontSize >= 11 && settings.fontSize <= 12) {
      strengths.push("Perfect font size for ATS systems and readability");
    } else if (settings.fontSize < 10) {
      criticalIssues.push("Font size too small - may be difficult to read");
    }

    // Calculate comprehensive overall score
    let overallScore = 0;
    const maxScore = 100;
    
    // ATS compatibility (30% weight)
    overallScore += (atsScore * 0.3);
    
    // Content quality (25% weight)
    let contentScore = 0;
    if (hasQuantifiedAchievements) contentScore += 40;
    if (hasActionVerbs) contentScore += 30;
    if (personalInfo.summary && personalInfo.summary.length >= 50) contentScore += 30;
    overallScore += (contentScore * 0.25);
    
    // Completeness (25% weight)
    overallScore += (currentCompletenessScore * 0.25);
    
    // Structure & sections (20% weight)
    let structureScore = 0;
    if (hasSkillsSection) structureScore += 40;
    if (hasExperienceSection) structureScore += 40;
    if (hasEducationSection) structureScore += 20;
    overallScore += (structureScore * 0.20);
    
    overallScore = Math.round(Math.min(overallScore, maxScore));

    return {
      overallScore,
      completenessScore: currentCompletenessScore,
      formatGrade,
      strengths,
      suggestions,
      criticalIssues,
      keyMetrics: {
        totalWords,
        sectionsCount: sections.length,
        hasQuantifiedAchievements,
        hasActionVerbs,
        hasAllEssentialSections: hasSkillsSection && hasExperienceSection
      },
      recommendations: {
        immediate: criticalIssues.slice(0, 3),
        shortTerm: suggestions.slice(0, 5),
        advanced: [
          "Consider tailoring keywords for specific job applications",
          "Add relevant certifications or professional development",
          "Include links to portfolio or LinkedIn profile"
        ]
      }
    };
  };

  const handleSendForVerification = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const results = performAIAnalysis();
      setAnalysisResults(results);
      setIsAnalyzing(false);
      setShowAnalysisModal(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 pt-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700 opacity-20"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-luxury-lg p-6 mb-6 border border-white/20 dark:border-gray-700/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 p-3 rounded-lg mr-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  Premium Master CV Builder
                  <Crown className="w-6 h-6 ml-2 text-yellow-500" fill="currentColor" />
                </h2>
                <p className="text-gray-600 dark:text-gray-300">AI-powered professional resume creation</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 px-4 py-2 rounded-full">
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                Live Preview Active
              </span>
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Font Family
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 transition-colors"
                title="Select font family"
              >
                <option value="Arial">Arial (Modern)</option>
                <option value="Times New Roman">Times New Roman (Classic)</option>
                <option value="Helvetica">Helvetica (Professional)</option>
                <option value="Georgia">Georgia (Academic)</option>
                <option value="Calibri">Calibri (Corporate)</option>
                <option value="Garamond">Garamond (Elegant)</option>
                <option value="Trebuchet MS">Trebuchet MS (Clean)</option>
                <option value="Verdana">Verdana (Clear)</option>
                <option value="Tahoma">Tahoma (Compact)</option>
                <option value="Book Antiqua">Book Antiqua (Traditional)</option>
                <option value="Palatino">Palatino (Refined)</option>
                <option value="Century Gothic">Century Gothic (Contemporary)</option>
                <option value="Lucida Sans">Lucida Sans (Tech-Friendly)</option>
                <option value="Franklin Gothic Medium">Franklin Gothic (Bold)</option>
                <option value="Cambria">Cambria (Readable)</option>
              </select>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {settings.fontFamily === 'Helvetica' ? '✓ Professional choice' :
                 settings.fontFamily === 'Arial' ? '✓ Modern & clean' :
                 settings.fontFamily === 'Calibri' ? '✓ Corporate standard' :
                 settings.fontFamily === 'Trebuchet MS' ? '✓ Clean & readable' :
                 settings.fontFamily === 'Verdana' ? '✓ Excellent clarity' :
                 settings.fontFamily === 'Tahoma' ? '✓ Compact & clear' :
                 settings.fontFamily === 'Century Gothic' ? '✓ Contemporary look' :
                 settings.fontFamily === 'Lucida Sans' ? '✓ Tech-friendly' :
                 settings.fontFamily === 'Cambria' ? '✓ Very readable' :
                 settings.fontFamily === 'Times New Roman' ? '⚠ Traditional but dense' :
                 settings.fontFamily === 'Georgia' ? '✓ Academic choice' :
                 settings.fontFamily === 'Garamond' ? '✓ Elegant & refined' :
                 settings.fontFamily === 'Book Antiqua' ? '✓ Traditional style' :
                 settings.fontFamily === 'Palatino' ? '✓ Sophisticated' :
                 settings.fontFamily === 'Franklin Gothic Medium' ? '⚠ Bold but heavy' :
                 '✓ Good choice'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Font Size
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="18"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-lg appearance-none cursor-pointer"
                  title={`Font size: ${settings.fontSize}px`}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                    {settings.fontSize}px
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {settings.fontSize >= 11 && settings.fontSize <= 12 ? '✓ Perfect for ATS' :
                     settings.fontSize >= 10 && settings.fontSize <= 14 ? '✓ Good readability' :
                     '⚠ May affect readability'}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <RefreshCw className="w-4 h-4 mr-1" />
                Line Spacing
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.1"
                  value={settings.spacing}
                  onChange={(e) => updateSettings({ spacing: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-green-200 dark:bg-green-700 rounded-lg appearance-none cursor-pointer"
                  title={`Line spacing: ${settings.spacing}`}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                    {settings.spacing}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {settings.spacing >= 1.4 && settings.spacing <= 1.6 ? '✓ Optimal spacing' :
                     settings.spacing >= 1.2 && settings.spacing <= 1.8 ? '✓ Good readability' :
                     '⚠ May look cramped/loose'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleSaveChanges}
                className="save-button bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleSendForVerification}
                className="ai-check-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Send className="w-4 h-4 mr-1" />
                AI Check
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTemplateChangeClick}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 h-12 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Layout className="w-4 h-4 mr-2" />
                Change Template
              </button>
              <button
                onClick={handleDownloadClick}
                className="w-full btn-premium-luxury h-12 shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Resume
              </button>
            </div>
          </div>

          {/* Premium Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                atsScore >= 80 ? 'text-green-600 dark:text-green-400' :
                atsScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {atsScore}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">ATS Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                completenessScore >= 80 ? 'text-green-600 dark:text-green-400' :
                completenessScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {completenessScore}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completeness</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                ['A+', 'A'].includes(formatGrade) ? 'text-green-600 dark:text-green-400' :
                ['B+', 'B'].includes(formatGrade) ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {formatGrade}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Format Grade</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                sectionCount >= 4 && sectionCount <= 6 ? 'text-green-600 dark:text-green-400' :
                sectionCount >= 3 && sectionCount <= 7 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {sectionCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Sections</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-luxury p-6 border border-white/20 dark:border-gray-700/40">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-800 dark:to-purple-800 p-2 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                <div className="ml-auto">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">
                    ✓ Complete
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={personalInfo.name}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 transition-colors pl-10"
                  />
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 transition-colors pl-10"
                  />
                  <Send className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 transition-colors pl-10"
                  />
                  <Target className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Location"
                    value={personalInfo.location}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 transition-colors pl-10"
                  />
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                </div>
              </div>
              <div className="mt-4 relative">
                <textarea
                  placeholder="Professional Summary - Describe your key achievements and career goals..."
                  value={personalInfo.summary}
                  onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 transition-colors pl-10 pt-10"
                  rows={4}
                />
                <Brain className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                <div className="absolute top-4 right-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Suggestions Available
                </div>
              </div>
            </div>

            {/* Sections */}
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-luxury p-6 border border-white/20 dark:border-gray-700/40 hover:shadow-luxury-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-800 dark:to-purple-800 p-2 rounded-lg cursor-grab">
                      <GripVertical className="w-4 h-4 text-white" />
                    </div>
                    {section.isEditing ? (
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSection(section.id, { name: e.target.value })}
                        onBlur={() => updateSection(section.id, { isEditing: false })}
                        onKeyPress={(e) => e.key === 'Enter' && updateSection(section.id, { isEditing: false })}
                        className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 bg-transparent outline-none min-w-[200px]"
                        autoFocus
                        title="Edit section name"
                      />
                    ) : (
                      <h3
                        className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors flex items-center"
                        onClick={() => updateSection(section.id, { isEditing: true })}
                      >
                        {section.name}
                        <Target className="w-4 h-4 ml-2 text-gray-400" />
                      </h3>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={sectionIndex === 0}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move section up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={sectionIndex === sections.length - 1}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move section down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all duration-200"
                      title="Delete section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Bullet Points */}
                <div className="space-y-3">
                  {section.points.map(point => (
                    <div key={point.id} className="flex items-start space-x-3 group bg-gray-50 dark:bg-gray-800 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                      <span className="text-blue-500 mt-1 font-bold">•</span>
                      {editingPoint?.sectionId === section.id && editingPoint?.pointId === point.id ? (
                        <textarea
                          value={point.text}
                          onChange={(e) => updateBulletPoint(section.id, point.id, e.target.value)}
                          onBlur={() => setEditingPoint(null)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              setEditingPoint(null);
                            }
                          }}
                          className="flex-1 p-2 border-2 border-blue-500 rounded-lg resize-none bg-white dark:bg-gray-700 dark:text-white focus:outline-none"
                          rows={2}
                          autoFocus
                          placeholder="Edit this achievement or responsibility..."
                          title="Edit bullet point content"
                        />
                      ) : (
                        <p
                          className="flex-1 text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 leading-relaxed"
                          onClick={() => setEditingPoint({ sectionId: section.id, pointId: point.id })}
                        >
                          {point.text}
                        </p>
                      )}
                      <button
                        onClick={() => deleteBulletPoint(section.id, point.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-all duration-200"
                        title="Delete bullet point"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Bullet Point */}
                <button
                  onClick={() => addBulletPoint(section.id)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 hover:from-blue-100 hover:to-purple-100 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-400 transition-all duration-200 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement/Responsibility
                </button>
              </div>
            ))}

            {/* Add Section */}
            <button
              onClick={addSection}
              className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 hover:from-purple-100 hover:to-indigo-100 text-purple-600 dark:text-purple-200 px-6 py-4 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-400 transition-all duration-200 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Section
            </button>
          </div>
          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-luxury p-6 border border-white/20 dark:border-gray-700/40 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-600" />
                    Live Preview
                  </h3>
                  <div className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                    {resumeTemplates[selectedTemplate as keyof typeof resumeTemplates]?.name || selectedTemplate}
                  </div>
                  <button
                    onClick={() => setIsDarkPreview(!isDarkPreview)}
                    className={`ml-4 p-2 rounded-lg transition-all duration-200 ${
                      isDarkPreview 
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isDarkPreview ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDarkPreview ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Auto-Save Active
                </div>
              </div>
              
              <div className={`${isDarkPreview ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border-2 ${isDarkPreview ? 'border-gray-600' : 'border-gray-100'} overflow-hidden transition-colors duration-200`}>
                <ResumePreview ref={resumeRef} template={selectedTemplate} isDark={isDarkPreview} />
              </div>
              
              {/* Quick Actions */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <button
                  onClick={handleDownloadClick}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Layout className="w-4 h-4 mr-2" />
                  Choose Template
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </button>
                <button
                  onClick={handleSendForVerification}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAnalysisModal && analysisResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Resume Analysis</h2>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Score Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Overall Score</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisResults.overallScore}%</div>
                    <div className="text-sm text-gray-600">Overall Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{atsScore}%</div>
                    <div className="text-sm text-gray-600">ATS Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analysisResults.completenessScore}%</div>
                    <div className="text-sm text-gray-600">Completeness</div>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {analysisResults.strengths.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Strengths ({analysisResults.strengths.length})
                  </h3>
                  <div className="space-y-2">
                    {analysisResults.strengths.map((strength: string, index: number) => (
                      <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-green-800">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Critical Issues */}
              {analysisResults.criticalIssues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Critical Issues ({analysisResults.criticalIssues.length})
                  </h3>
                  <div className="space-y-2">
                    {analysisResults.criticalIssues.map((issue: string, index: number) => (
                      <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-800">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysisResults.suggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Suggestions ({analysisResults.suggestions.length})
                  </h3>
                  <div className="space-y-2">
                    {analysisResults.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-blue-800">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Action Plan
                </h3>
                <div className="space-y-4">
                  {analysisResults.recommendations.immediate.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">🚨 Immediate Actions</h4>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.immediate.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 ml-4">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResults.recommendations.shortTerm.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-600 mb-2">📅 Short-term Improvements</h4>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.shortTerm.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 ml-4">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResults.recommendations.advanced.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">🎯 Advanced Optimizations</h4>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.advanced.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 ml-4">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAnalysisModal(false);
                    // Optional: Auto-save improvements
                    handleSaveChanges();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Suggestions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-7xl max-h-[90vh] overflow-y-auto m-4 w-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isForExport ? 'Choose Template for Download' : 'Change Resume Template'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  50+ Professional Templates • All with Dark Mode Support
                  {isForExport ? ' • Select Template Then Download' : ' • Live Preview Update'}
                </p>
                <div className="flex items-center mt-3 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Mode:</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkPreview 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isDarkPreview ? '🌙 Dark' : '☀️ Light'} Mode
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    💡 Switch preview mode above to see how templates look in both themes
                  </div>
                  {isForExport && (
                    <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                      ✓ After selecting template, use "Download Resume" button to get your PDF
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedCategory('All'); // Reset filter when closing modal
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                title="Close template selector"
                aria-label="Close template selector"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category Filters */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {['All', 'Professional', 'Modern', 'Creative', 'Academic', 'Technical', 'Minimal', 'International', 'Sales', 'Service'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300'
                    }`}
                  >
                    {category}
                    {category !== 'All' && (
                      <span className="ml-2 text-xs opacity-75">
                        {getTemplatesByCategory(category).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedCategory !== 'All' && (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Showing {getFilteredTemplates().length} templates in "{selectedCategory}" category
                </div>
              )}
            </div>

            {/* Templates Grid - Show filtered or categorized view */}
            <div className="space-y-12">
              {selectedCategory === 'All' ? (
                // Show all categories when "All" is selected
                <>
                  {/* Professional Category */}
                  {getTemplatesByCategory('Professional').length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm mr-3">
                          💼
                        </div>
                        Professional Templates
                        <span className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                          {getTemplatesByCategory('Professional').length} templates
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getTemplatesByCategory('Professional').map((template) => (
                          <div
                            key={template.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg dark:border-gray-700 ${
                              selectedTemplate === template.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => {
                              console.log('Template card clicked:', template.id);
                              setSelectedTemplate(template.id);
                            }}
                          >
                            <div className="mb-3 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                              {template.preview}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                            {selectedTemplate === template.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isForExport) {
                                    handleTemplateSelect(template.id);
                                  } else {
                                    handleTemplateChange(template.id);
                                  }
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-xs flex items-center justify-center transition-colors shadow-md hover:shadow-lg font-medium"
                              >
                                <Download className="w-3 h-3 mr-1 text-white" />
                                <span className="text-white">{isForExport ? 'Apply' : 'Select'}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modern Category */}
                  {getTemplatesByCategory('Modern').length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm mr-3">
                          ✨
                        </div>
                        Modern Templates
                        <span className="ml-3 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                          {getTemplatesByCategory('Modern').length} templates
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getTemplatesByCategory('Modern').map((template) => (
                          <div
                            key={template.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg dark:border-gray-700 ${
                              selectedTemplate === template.id
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="mb-3 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                              {template.preview}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                            {selectedTemplate === template.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isForExport) {
                                    handleTemplateSelect(template.id);
                                  } else {
                                    handleTemplateChange(template.id);
                                  }
                                }}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-xs flex items-center justify-center transition-colors shadow-md hover:shadow-lg font-medium"
                              >
                                <Download className="w-3 h-3 mr-1 text-white" />
                                <span className="text-white">{isForExport ? 'Apply' : 'Select'}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Creative Category */}
                  {getTemplatesByCategory('Creative').length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-pink-600 text-white rounded-lg flex items-center justify-center text-sm mr-3">
                          🎨
                        </div>
                        Creative Templates
                        <span className="ml-3 px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-sm rounded-full">
                          {getTemplatesByCategory('Creative').length} templates
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getTemplatesByCategory('Creative').map((template) => (
                          <div
                            key={template.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg dark:border-gray-700 ${
                              selectedTemplate === template.id
                                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="mb-3 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                              {template.preview}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                            {selectedTemplate === template.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isForExport) {
                                    handleTemplateSelect(template.id);
                                  } else {
                                    handleTemplateChange(template.id);
                                  }
                                }}
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-3 rounded-lg text-xs flex items-center justify-center transition-colors shadow-md hover:shadow-lg font-medium"
                              >
                                <Download className="w-3 h-3 mr-1 text-white" />
                                <span className="text-white">{isForExport ? 'Apply' : 'Select'}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academic Category */}
                  {getTemplatesByCategory('Academic').length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm mr-3">
                          🎓
                        </div>
                        Academic Templates
                        <span className="ml-3 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                          {getTemplatesByCategory('Academic').length} templates
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getTemplatesByCategory('Academic').map((template) => (
                          <div
                            key={template.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg dark:border-gray-700 ${
                              selectedTemplate === template.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="mb-3 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                              {template.preview}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                            {selectedTemplate === template.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isForExport) {
                                    handleTemplateSelect(template.id);
                                  } else {
                                    handleTemplateChange(template.id);
                                  }
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-xs flex items-center justify-center transition-colors shadow-md hover:shadow-lg font-medium"
                              >
                                <Download className="w-3 h-3 mr-1 text-white" />
                                <span className="text-white">{isForExport ? 'Apply' : 'Select'}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Category */}
                  {getTemplatesByCategory('Technical').length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm mr-3">
                          💻
                        </div>
                        Technical Templates
                        <span className="ml-3 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full">
                          {getTemplatesByCategory('Technical').length} templates
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getTemplatesByCategory('Technical').map((template) => (
                          <div
                            key={template.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg dark:border-gray-700 ${
                              selectedTemplate === template.id
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="mb-3 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                              {template.preview}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                            {selectedTemplate === template.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isForExport) {
                                    handleTemplateSelect(template.id);
                                  } else {
                                    handleTemplateChange(template.id);
                                  }
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-xs flex items-center justify-center transition-colors shadow-md hover:shadow-lg font-medium"
                              >
                                <Download className="w-3 h-3 mr-1 text-white" />
                                <span className="text-white">{isForExport ? 'Apply' : 'Select'}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Other Categories - Compact View */}
                  {Object.values(resumeTemplates).filter(t => !['Professional', 'Modern', 'Creative', 'Academic', 'Technical'].includes(t.category)).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gray-600 text-white rounded-lg flex items-center justify-center text-sm mr-3">
                          📋
                        </div>
                        More Templates
                        <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                          {Object.values(resumeTemplates).filter(t => !['Professional', 'Modern', 'Creative', 'Academic', 'Technical'].includes(t.category)).length}+ templates
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.values(resumeTemplates).filter(t => !['Professional', 'Modern', 'Creative', 'Academic', 'Technical'].includes(t.category)).map((template) => (
                          <div
                            key={template.id}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-lg dark:border-gray-700 ${
                              selectedTemplate === template.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="mb-2 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-lg">
                              {template.preview}
                            </div>
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{template.category}</div>
                            {selectedTemplate === template.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isForExport) {
                                    handleTemplateSelect(template.id);
                                  } else {
                                    handleTemplateChange(template.id);
                                  }
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs flex items-center justify-center transition-colors shadow-md hover:shadow-lg font-medium"
                              >
                                <Download className="w-3 h-3 mr-1 text-white" />
                                <span className="text-white">{isForExport ? 'Apply' : 'Select'}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Show filtered results for specific category
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <div className={`w-10 h-10 text-white rounded-lg flex items-center justify-center text-lg mr-4 ${
                      selectedCategory === 'Professional' ? 'bg-blue-600' :
                      selectedCategory === 'Modern' ? 'bg-purple-600' :
                      selectedCategory === 'Creative' ? 'bg-pink-600' :
                      selectedCategory === 'Academic' ? 'bg-green-600' :
                      selectedCategory === 'Technical' ? 'bg-indigo-600' :
                      'bg-gray-600'
                    }`}>
                      {selectedCategory === 'Professional' ? '💼' :
                       selectedCategory === 'Modern' ? '✨' :
                       selectedCategory === 'Creative' ? '🎨' :
                       selectedCategory === 'Academic' ? '🎓' :
                       selectedCategory === 'Technical' ? '💻' :
                       '📄'}
                    </div>
                    {selectedCategory} Templates
                    <span className="ml-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {getFilteredTemplates().length} templates available
                    </span>
                  </h3>
                  
                  {getFilteredTemplates().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {getFilteredTemplates().map((template) => (
                        <div
                          key={template.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg dark:border-gray-700 ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="mb-3 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                            {template.preview}
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <span className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                              {template.category}
                            </span>
                          </div>
                          {selectedTemplate === template.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isForExport) {
                                  handleTemplateSelect(template.id);
                                } else {
                                  handleTemplateChange(template.id);
                                }
                              }}
                              className={`w-full text-white py-2 px-3 rounded-lg text-xs flex items-center justify-center transition-colors shadow-md hover:shadow-lg font-medium ${
                                selectedCategory === 'Professional' ? 'bg-blue-600 hover:bg-blue-700' :
                                selectedCategory === 'Modern' ? 'bg-purple-600 hover:bg-purple-700' :
                                selectedCategory === 'Creative' ? 'bg-pink-600 hover:bg-pink-700' :
                                selectedCategory === 'Academic' ? 'bg-green-600 hover:bg-green-700' :
                                selectedCategory === 'Technical' ? 'bg-indigo-600 hover:bg-indigo-700' :
                                'bg-gray-600 hover:bg-gray-700'
                              }`}
                            >
                              <Download className="w-3 h-3 mr-1 text-white" />
                              <span className="text-white">{isForExport ? 'Apply' : 'Select'}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📄</div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No templates found in "{selectedCategory}" category
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        This category will be available in future updates.
                      </p>
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View All Templates
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Selected: <span className="font-semibold">{resumeTemplates[selectedTemplate as keyof typeof resumeTemplates]?.name || 'None'}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setSelectedCategory('All'); // Reset filter when canceling
                  }}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (isForExport) {
                      handleTemplateSelect(selectedTemplate);
                    } else {
                      handleTemplateChange(selectedTemplate);
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isForExport ? 'Apply Template' : 'Select Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
