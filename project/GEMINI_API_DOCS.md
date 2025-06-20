# Google Gemini API Integration for Resume Analyzer

This document explains how the Resume Analyzer application integrates with Google's Gemini API to provide AI-powered resume analysis.

## Overview

The Resume Analyzer now supports three modes of operation:

1. **Mock Data Mode** - Uses generated fake data (for development/testing)
2. **Google Gemini API Mode** - Uses Google's Gemini API directly
3. **Custom API Mode** - Uses your own API endpoints

## Configuration

The application decides which mode to use based on environment variables in the `.env` file:

```
# Enable/disable mock data (overrides other options if true)
VITE_USE_MOCK_API=false

# Enable/disable Gemini API (if both this and mock are false, custom API is used)
VITE_USE_GEMINI_API=true

# Gemini API key
VITE_GEMINI_API_KEY="AIzaSyCggVFJHGMu1_WK57J2gUuRZsX6qVfO4DM"

# Only needed if using custom API:
VITE_API_BASE_URL="https://your-custom-api.com/api"
```

## How It Works

### 1. API Selection Logic

The application uses the following logic to determine which API to use:

```typescript
// In api.ts
if (USE_MOCK_API) {
  // Use mock data
} else if (USE_GEMINI_API) {
  // Use Google Gemini API
} else {
  // Use custom API endpoints
}
```

### 2. Gemini API Flow

When using the Gemini API mode:

1. The application extracts text from uploaded resume files
2. It sends the resume text to Gemini API with a carefully crafted prompt
3. The API returns a structured analysis which is parsed into the expected format
4. The results are displayed in the UI

### 3. Key Functions

- `analyzeResumeWithGemini()` - Analyzes a complete resume
- `getAtsScoreWithGemini()` - Gets just the ATS score
- `analyzeSkillsWithGemini()` - Analyzes the skills gap

## Benefits of Gemini API

- **No Backend Required** - Direct integration with Gemini API means you don't need your own server
- **High-Quality Analysis** - Leverages Google's powerful AI models
- **Cost-Effective** - Gemini API has generous free tier and affordable pricing
- **Easy to Set Up** - Just provide an API key and you're ready to go

## Implementation Details

### Prompts Design

The prompts are carefully crafted to:
- Provide clear instructions on the analysis task
- Include relevant job details for context
- Specify exact JSON structure for responses

Example prompt structure:
```
You are an expert ATS analyzer. Evaluate the following resume for a {job title} position.

Job requires these skills:
{skills list}

RESUME TEXT:
"""
{resume content}
"""

Return analysis in this JSON format:
...
```

### Error Handling

The implementation includes robust error handling:
- Fallback to mock data if Gemini API calls fail
- Helpful console messages for debugging
- Graceful degradation of functionality
- Structured error information included in API responses:

```typescript
{
  // Regular response data
  score: 85,
  // Error information when applicable
  error: {
    occurred: true,
    message: "API request failed: 429 Too Many Requests",
    fallbackUsed: true,
    timestamp: "2023-05-24T12:34:56.789Z"
  }
}
```

## Limitations

- Maximum text length is limited to avoid exceeding API limits (20,000 characters)
- Some complex formatting analysis may be less accurate
- Error handling focuses on graceful fallback rather than recovery

## Improvements Implemented

1. Added proper PDF text extraction using pdf-parse library
2. Implement caching to reduce API calls
3. Add user feedback loop to improve prompts
4. Support more document formats

## References

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Application Code Structure](e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\utils\geminiApi.ts)
