# CheckResumeAI Backend API

A comprehensive backend API for the CheckResumeAI SaaS platform - an AI-powered resume analyzer that helps users optimize their resumes for ATS (Applicant Tracking Systems) and improve their job application success rates.

## Features

### Core Features
- **AI-Powered Resume Analysis**: Advanced resume analysis using OpenAI GPT-4 and Groq AI
- **ATS Scoring**: Comprehensive ATS compatibility scoring and recommendations
- **Multi-format Support**: PDF and Word document processing
- **Real-time Analysis**: WebSocket-based real-time analysis updates
- **Batch Processing**: Process multiple resumes simultaneously (Premium feature)

### User Management
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Profiles**: Comprehensive user profile management
- **Subscription Management**: Tiered subscription plans with Razorpay integration
- **Analytics Dashboard**: Detailed user analytics and progress tracking

### Advanced Features
- **Course Recommendations**: AI-powered course suggestions based on skill gaps
- **Industry Benchmarking**: Compare scores against industry standards
- **Resume Comparison**: Side-by-side analysis of resume improvements
- **Export Capabilities**: Export analytics and reports in JSON/CSV formats

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **AI Services**: OpenAI GPT-4, Groq AI
- **File Processing**: PDF-Parse, Multer
- **Payment**: Razorpay
- **Real-time**: Socket.IO
- **Logging**: Winston
- **Validation**: Joi, Express-Validator

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key
- Groq API key
- Razorpay account (for payments)

### Installation

1. **Clone and install dependencies**:
```bash
cd backend
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Start Development Server**:
```bash
npm run start:dev
```

The server will start on `http://localhost:5000`

### Production Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Start production server**:
```bash
npm start
```

## API Documentation

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: `https://your-domain.com/api/v1`

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

#### Resume Analysis
- `POST /resume/analyze` - Analyze resume file
- `POST /resume/analyze-text` - Analyze resume text
- `GET /resume/history` - Get analysis history
- `GET /resume/:analysisId` - Get specific analysis
- `DELETE /resume/:analysisId` - Delete analysis
- `POST /resume/compare` - Compare two analyses (Premium)
- `POST /resume/batch-analyze` - Batch analysis (Premium)

#### Analytics
- `GET /analytics/dashboard` - Get analytics dashboard
- `GET /analytics/trends` - Get analytics trends
- `GET /analytics/benchmark` - Industry benchmark comparison
- `GET /analytics/export` - Export analytics data

#### Payments
- `GET /payment/plans` - Get subscription plans
- `POST /payment/create-order` - Create payment order
- `POST /payment/verify` - Verify payment
- `GET /payment/subscription` - Get subscription status
- `GET /payment/history` - Get payment history
- `POST /payment/cancel` - Cancel subscription

#### User Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /profile/avatar` - Upload avatar
- `GET /profile/stats` - Get user statistics
- `GET /profile/preferences` - Get user preferences
- `PUT /profile/preferences` - Update preferences

#### Course Recommendations
- `GET /courses/recommendations` - Get course recommendations
- `GET /courses/categories/:category` - Get courses by category
- `POST /courses/:courseId/save` - Save course
- `DELETE /courses/:courseId/save` - Remove saved course
- `GET /courses/saved` - Get saved courses
- `POST /courses/:courseId/complete` - Mark course as completed
- `GET /courses/progress` - Get learning progress

#### File Upload
- `POST /upload/session` - Create upload session
- `POST /upload/session/:sessionId` - Upload file to session
- `POST /upload/session/:sessionId/batch` - Batch upload files
- `GET /upload/session/:sessionId` - Get session status
- `DELETE /upload/file/:fileId` - Delete uploaded file

#### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system health
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

## Database Schema

### Core Tables
- `profiles` - User profiles and account information
- `resume_analyses` - Resume analysis records
- `user_analytics` - User analytics and statistics
- `analytics_trends` - Historical analytics data
- `payment_orders` - Payment transaction records
- `course_recommendations` - Course recommendation records
- `upload_sessions` - File upload session management

## Configuration

### Environment Variables

#### Required
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key
- `GROQ_API_KEY` - Groq API key

#### Optional
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret
- `SMTP_HOST` - SMTP server host
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `REDIS_URL` - Redis connection URL

### Feature Flags
- `ENABLE_PREMIUM_FEATURES` - Enable premium features
- `ENABLE_REAL_TIME_ANALYSIS` - Enable real-time updates
- `ENABLE_COURSE_RECOMMENDATIONS` - Enable course recommendations
- `ENABLE_ADVANCED_ANALYTICS` - Enable advanced analytics

## Security

### Authentication
- JWT tokens with configurable expiration
- Secure password hashing with bcrypt
- Rate limiting on authentication endpoints
- CORS configuration for allowed origins

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Helmet.js
- File upload restrictions and validation
- Secure file storage with unique identifiers

### API Security
- Rate limiting on all endpoints
- Request size limits
- Error handling without information leakage
- Audit logging for sensitive operations

## Monitoring & Logging

### Logging
- Structured logging with Winston
- Configurable log levels
- File-based log rotation
- Development console logging

### Health Checks
- Basic health endpoint
- Detailed system health with metrics
- Kubernetes-ready liveness/readiness probes
- Database connectivity checks

### Metrics
- Request/response metrics
- Error tracking and reporting
- Performance monitoring
- User activity analytics

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers (if using controller pattern)
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── server.ts       # Main server file
```

### Testing
- Unit tests with Jest
- Integration tests for API endpoints
- Mock services for external dependencies
- Test database setup and teardown

## Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically build and deploy

### Manual Deployment
1. Build the project: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates

## Performance Optimization

### Caching
- Redis caching for frequently accessed data
- In-memory caching for static data
- Database query optimization
- CDN for static assets

### Scaling
- Horizontal scaling support
- Load balancer ready
- Database connection pooling
- Stateless architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Email: [support@checkresumeai.com](mailto:support@checkresumeai.com)
- Documentation: [API Docs](https://docs.checkresumeai.com)
- Issues: [GitHub Issues](https://github.com/yourusername/checkresumeai/issues)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.
