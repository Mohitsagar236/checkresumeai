import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

interface DetailItem {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

interface DetailedAnalysisSectionProps {
  title: string;
  icon: React.ReactNode;
  details: DetailItem[];
  defaultExpanded?: boolean;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorSchemes = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100/30',
    border: 'border-blue-200',
    headerBg: 'bg-gradient-to-r from-blue-600 to-blue-500',
    text: 'text-blue-900',
    lightText: 'text-blue-700'
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100/30',
    border: 'border-green-200',
    headerBg: 'bg-gradient-to-r from-green-600 to-green-500',
    text: 'text-green-900',
    lightText: 'text-green-700'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100/30',
    border: 'border-purple-200',
    headerBg: 'bg-gradient-to-r from-purple-600 to-purple-500',
    text: 'text-purple-900',
    lightText: 'text-purple-700'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100/30',
    border: 'border-orange-200',
    headerBg: 'bg-gradient-to-r from-orange-600 to-orange-500',
    text: 'text-orange-900',
    lightText: 'text-orange-700'
  }
};

const getIcon = (type: 'success' | 'warning' | 'info') => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};

export function DetailedAnalysisSection({
  title,
  icon,
  details,
  defaultExpanded = false,
  colorScheme = 'blue'
}: DetailedAnalysisSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const colors = colorSchemes[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colors.bg} rounded-xl shadow-md border ${colors.border} overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full ${colors.headerBg} px-6 py-4 flex items-center justify-between hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <div className="text-white">{icon}</div>
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <div className="bg-white/20 px-2 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-white">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {details.map((detail, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/60 rounded-lg p-4 border border-gray-200/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(detail.type)}</div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${colors.text} mb-1`}>{detail.title}</h4>
                  <p className={`text-sm ${colors.lightText}`}>{detail.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
