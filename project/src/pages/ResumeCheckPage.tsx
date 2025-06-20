import { useState } from 'react';
import { Upload } from 'lucide-react';
import { PremiumFeedbackCard } from '../components/resume/PremiumFeedbackCard';

export function ResumeCheckPage() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Check
          </h1>
          <p className="text-xl text-gray-600">
            Check your resume before it gets rejected.
          </p>
        </div>

        {/* Upload Section */}
        <div 
          className={`
            mt-8 p-8 border-2 border-dashed rounded-lg 
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
            transition-colors duration-200 ease-in-out
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
              >
                <span>Upload your resume</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.docx"
                />
              </label>
              <p className="text-gray-500">(PDF or DOCX)</p>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              or drag and drop your file here
            </p>
          </div>
        </div>

        {/* Check Button */}
        <div className="mt-8 text-center">
          <button
            type="button"
            className="
              inline-flex items-center px-6 py-3 border border-transparent 
              text-base font-medium rounded-md shadow-sm text-white 
              bg-blue-600 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200 ease-in-out
            "
          >
            Check My Resume
          </button>
        </div>        {/* Sample Results */}
        <div className="mt-12 space-y-8">
          {/* Basic Version */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Feedback</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <p className="text-red-600">❌ Missing key skills section</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <p className="text-yellow-600">⚠️ Too many bullet points under one job role</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <p className="text-green-600">✅ Education section is complete</p>
              </div>
            </div>
          </div>

          {/* Premium Version */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Feedback</h3>
            <PremiumFeedbackCard
              items={[
                {
                  id: '1',
                  type: 'error',
                  message: 'Missing key skills section',
                  description: 'Your resume lacks a dedicated skills section which is crucial for ATS scanning and recruiter review.',
                  priority: 'high',
                  impact: 'Adding a skills section could improve your ATS score by 25-30%'
                },
                {
                  id: '2',
                  type: 'warning',
                  message: 'Too many bullet points under one job role',
                  description: 'Your current position has 8 bullet points, which may overwhelm recruiters. Optimal range is 4-6 bullet points.',
                  priority: 'medium',
                  impact: 'Condensing to 5-6 key achievements will improve readability'
                },
                {
                  id: '3',
                  type: 'success',
                  message: 'Education section is complete',
                  description: 'Your education section includes all necessary details: degree, institution, graduation date, and relevant coursework.',
                  priority: 'low',
                  impact: 'Well-structured education section supports your qualifications'
                }
              ]}
              title="Premium Resume Analysis"
              showPriorityIndicator={true}
              showImpactScore={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeCheckPage;
