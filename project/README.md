# AI-Powered Resume Analyzer SaaS

🚀 **Latest Update**: Enhanced freemium design with premium conversion optimization!

An advanced AI-powered SaaS application that analyzes resumes to provide comprehensive scoring, feedback, and career recommendations. Features include ATS compatibility scoring, skills gap analysis, and premium analytics dashboard.

## ✨ Latest Features (v2.1.0)

### Enhanced Freemium Experience

- **Improved Skills Gap Analysis**: Visual skill match indicators with industry benchmarking
- **Career Path Insights**: Interactive career progression visualization for all users
- **Course Recommendations Preview**: Enticing preview of learning opportunities
- **Premium Analytics Dashboard**: Enhanced free content with upgrade incentives
- **Responsive Design**: Optimized mobile and tablet experience

### Premium Features

- **Advanced Resume Analytics**: Industry positioning and keyword optimization metrics
- **Comprehensive Feedback**: Detailed improvement recommendations with examples
- **Priority Support**: Direct access to resume experts
- **Export Capabilities**: Download detailed analysis reports
- **Career Coaching**: Personalized career development recommendations

### Technical Improvements

- **Performance Optimization**: Faster load times and smoother animations
- **Code Quality**: TypeScript improvements and React best practices
- **Accessibility**: Enhanced screen reader support and keyboard navigation
- **Mobile-First Design**: Responsive layout across all device sizes

## 🎯 Key Features

### Core Functionality

- **AI-Powered Analysis**: Advanced resume analysis using Google Gemini AI
- **ATS Compatibility Scoring**: Real-time assessment of resume ATS compatibility
- **Skills Gap Analysis**: Identify missing skills for target job roles
- **PDF Processing**: Advanced PDF parsing and text extraction
- **Real-time Preview**: Interactive PDF viewer with highlighting

### Premium Analytics

- **Industry Insights**: Compare your resume against industry standards
- **Keyword Optimization**: Track keyword density and relevance
- **Interview Probability**: AI-calculated chance of landing interviews
- **Performance Tracking**: Monitor resume improvements over time
- **Market Analysis**: Industry-specific resume trends and recommendations

## ✨ Latest Features (v2.1.0)

### Enhanced Freemium Experience
- **Improved Skills Gap Analysis**: Visual skill match indicators with industry benchmarking
- **Career Path Insights**: Interactive career progression visualization for all users
- **Course Recommendations Preview**: Enticing preview of learning opportunities
- **Premium Analytics Dashboard**: Enhanced free content with upgrade incentives
- **Responsive Design**: Optimized mobile and tablet experience

### Premium Features
- **Advanced Resume Analytics**: Industry positioning and keyword optimization metrics
- **Comprehensive Feedback**: Detailed improvement recommendations with examples
- **Priority Support**: Direct access to resume experts
- **Export Capabilities**: Download detailed analysis reports
- **Career Coaching**: Personalized career development recommendations

### Technical Improvements
- **Performance Optimization**: Faster load times and smoother animations
- **Code Quality**: TypeScript improvements and React best practices
- **Accessibility**: Enhanced screen reader support and keyboard navigation
- **Mobile-First Design**: Responsive layout across all device sizes

## 🎯 Key Features

### Core Functionality
- **AI-Powered Analysis**: Advanced resume analysis using Google Gemini AI
- **ATS Compatibility Scoring**: Real-time assessment of resume ATS compatibility
- **Skills Gap Analysis**: Identify missing skills for target job roles
- **PDF Processing**: Advanced PDF parsing and text extraction
- **Real-time Preview**: Interactive PDF viewer with highlighting

### Premium Analytics
- **Industry Insights**: Compare your resume against industry standards
- **Keyword Optimization**: Track keyword density and relevance
- **Interview Probability**: AI-calculated chance of landing interviews
- **Performance Tracking**: Monitor resume improvements over time
- **Market Analysis**: Industry-specific resume trends and recommendations

## API Configuration

The application can operate in three modes:

### 1. Real API Mode

Connect to actual API endpoints for resume analysis, ATS scoring, and skills gap analysis.

### 2. Google Gemini API Mode

Use the Google Gemini API to analyze resumes, calculate ATS scores, and perform skills gap analysis with real AI processing.

### 3. Mock API Mode (Default)

Use generated mock data for development and testing purposes. This is useful when:

- You don't have access to the production API
- You're developing locally without an internet connection
- You want predictable responses for testing UI components

## Payment Integration

The application supports premium subscriptions through multiple payment providers:

### 1. Credit Card Processing

Direct credit card processing for subscription payments.

### 2. Razorpay Integration

Integration with Razorpay payment gateway for secure payment processing:

- Monthly and yearly subscription plans
- Secure payment verification using HMAC signatures
- Webhook support for automated payment status updates

For detailed deployment instructions, see [RAZORPAY_DEPLOYMENT_GUIDE.md](./docs/RAZORPAY_DEPLOYMENT_GUIDE.md).

## Environment Configuration

Create a `.env` file based on the provided `.env.example` template:

```bash
cp .env.example .env
```

### Key Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_USE_MOCK_API` | Set to `true` to use mock data, `false` to use real API endpoints |
| `VITE_USE_GEMINI_API` | Set to `true` to use Google Gemini API, `false` to use other API options |
| `VITE_API_BASE_URL` | Base URL for all API endpoints |
| `VITE_OPENAI_API_KEY` | Your OpenAI API key |
| `VITE_PINECONE_API_KEY` | Your Pinecone API key |
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay Key ID for payment processing |

## Error Handling

The application has built-in error handling and will automatically fall back to mock data when:

1. API endpoints are misconfigured or unreachable
2. Network errors occur during API requests
3. API requests return error responses
4. Required API keys are missing

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoint Structure

The application expects the following endpoints:

- **Resume Analysis**: `${API_BASE_URL}/analyze`
- **ATS Scoring**: `${API_BASE_URL}/ats-score`
- **Skills Analysis**: `${API_BASE_URL}/skills-analysis`
