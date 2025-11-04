# CheckResumeAI - AI-Powered Resume Analyzer SaaS

## Overview
CheckResumeAI is an advanced AI-powered SaaS application that analyzes resumes to provide comprehensive scoring, feedback, and career recommendations. The application helps job seekers optimize their resumes for ATS (Applicant Tracking Systems) compatibility and increase their chances of landing interviews.

## Project Status
- **Status**: ✅ Running successfully in Replit environment
- **Last Updated**: November 4, 2025
- **Version**: 1.0.0

## Architecture

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.4.1
- **UI Components**: Radix UI, Framer Motion, Lucide React
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **PDF Processing**: PDF.js (pdfjs-dist)
- **Charts**: Recharts
- **Port**: 5000 (configured for Replit environment)

### Backend (Optional)
- **Framework**: Express + TypeScript
- **Location**: `backend/` directory
- **Note**: Currently not running - frontend operates in Mock API Mode
- **Default Port**: 5000 (would need to be changed to avoid frontend conflict)

## Key Features

### Core Functionality
- AI-Powered Resume Analysis using Google Gemini API
- ATS Compatibility Scoring
- Skills Gap Analysis
- PDF Processing and text extraction
- Real-time PDF preview with highlighting
- Interactive resume feedback

### Premium Features
- Advanced resume analytics
- Industry insights and benchmarking
- Keyword optimization tracking
- Interview probability calculation
- Performance tracking over time
- Comprehensive feedback with examples
- Export capabilities

## Configuration

### Environment Setup
The application is configured to run on Replit with the following settings:

**Vite Configuration** (`vite.config.ts`):
- Host: `0.0.0.0` (listens on all network interfaces)
- Port: `5000` (Replit's required port for webview)
- Allowed Hosts: `true` (allows proxy access from Replit's iframe)
- HMR: Enabled with overlay for hot module replacement

### API Modes
The application supports three operational modes:

1. **Mock API Mode (Default/Current)**: Uses generated mock data for development
2. **Google Gemini API Mode**: Uses Google Gemini AI for real analysis
3. **Real API Mode**: Connects to backend API endpoints

### Environment Variables
Required environment variables for full functionality (see `.env.example`):
- `VITE_USE_MOCK_API`: Set to `true` for mock mode
- `VITE_USE_GEMINI_API`: Set to `true` for Gemini API mode
- `VITE_GEMINI_API_KEY`: Google Gemini API key
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_RAZORPAY_KEY_ID`: Razorpay payment key (for premium features)

## Workflow Configuration

### Current Workflows
1. **Frontend Dev Server**
   - Command: `npm run dev`
   - Output Type: webview
   - Port: 5000
   - Status: ✅ Running

## Development

### Running Locally
The application is configured to start automatically with the workflow. Manual start:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```
Output directory: `frontend-build/`

### Dependencies
All npm dependencies are installed and managed in `package.json`. Key dependencies:
- React ecosystem (react, react-dom, react-router-dom)
- Supabase client for authentication and database
- TanStack Query for data fetching
- PDF.js for resume parsing
- Tailwind CSS for styling

## Project Structure
```
├── src/              # Frontend source code
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── utils/        # Utility functions
│   ├── hooks/        # Custom React hooks
│   └── styles/       # CSS styles
├── backend/          # Backend API (optional)
├── public/           # Static assets
├── sample-resumes/   # Sample resume files for testing
├── supabase/         # Supabase configuration and migrations
└── vite.config.ts    # Vite configuration
```

## Recent Changes
- **2025-11-04**: Initial Replit setup and configuration
  - Configured Vite to use port 5000 and host 0.0.0.0
  - Enabled `allowedHosts: true` for Replit proxy compatibility
  - Set up Frontend Dev Server workflow
  - Fixed .gitignore encoding issues
  - Verified application running successfully

## User Preferences
None documented yet.

## Known Issues
- Backend is not currently running (using Mock API Mode)
- If backend is needed, port configuration must be updated to avoid conflict with frontend

## Deployment Notes
- Application is ready for deployment with Replit's publish feature
- Frontend builds to `frontend-build/` directory
- Production mode serves static files from backend when NODE_ENV=production

## Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
