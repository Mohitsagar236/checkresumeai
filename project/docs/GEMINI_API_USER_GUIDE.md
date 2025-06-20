# Resume Analyzer - Google Gemini API User Guide

This guide explains how to use the Resume Analyzer application with Google's Gemini API integration.

## Getting Started

### 1. Set Up Environment

Make sure your `.env` file contains the following configurations:

```
# Disable mock data
VITE_USE_MOCK_API=false

# Enable Gemini API
VITE_USE_GEMINI_API=true

# Your Gemini API key
VITE_GEMINI_API_KEY="AIzaSyCggVFJHGMu1_WK57J2gUuRZsX6qVfO4DM"
```

### 2. Install Required Dependencies

```bash
npm install pdfjs-dist
```

### 3. Start the Application

```bash
npm run dev
```

## Using the Application

1. **Upload a Resume**
   - Go to the "Upload" page
   - Drag and drop your resume file (PDF recommended)
   - Select a job role from the dropdown menu
   - PDF preview is available to confirm your file was properly uploaded

2. **View Premium Analysis Results**
   - The application will use Gemini AI to analyze the resume
   - Results will be displayed with enhanced visual scores and dynamic animations
   - Color-coded status indicators showing performance categories (Excellent, Good, Needs Work)
   - Interactive skills gap analysis with visually distinct matched and missing skills
   - Premium recommendation cards with actionable improvements and priority levels
   - Advanced analytics including industry comparisons and hiring potential calculator
   - Responsive design optimized for all devices
   - Performance-optimized animations for low-end devices
   
3. **Premium Features**
   - Real-time analysis during upload with immediate feedback
   - Advanced resume optimization suggestions with priority levels
   - Interactive progress indicators with visual performance metrics
   - Industry-specific resume insights with comparative analysis
   - AI-powered hiring chance calculator with personalized recommendations
   - One-click optimized resume generation with targeted improvements
   - Downloadable detailed analysis report with actionable steps
   - Premium interface with animations and responsive design
   - Accessibility features for all users

4. **Understanding Error Messages**
   - If you see "Using fallback data" in the console, it means the Gemini API request failed
   - The application will automatically use mock data as a fallback
   - Check the browser console for detailed error information
   - API responses are now cached to improve performance and reduce failures

## Troubleshooting

### API Key Issues

If you're experiencing problems with the Gemini API:

1. Verify your API key is valid with the check script:
   ```bash
   # For Linux/macOS
   bash scripts/check-gemini-api.sh
   
   # For Windows
   .\scripts\check-gemini-api.ps1
   ```

2. Make sure the API key starts with "AIzaSy"

3. Check if you've exceeded your Gemini API quota

### PDF Parsing Features

The application uses PDF.js for extracting text from PDF files. This provides:

1. Browser-compatible PDF processing
2. Support for multi-page PDFs
3. Basic metadata extraction

### PDF Parsing Issues

If your PDF isn't being analyzed correctly:

1. Try a simpler PDF format
2. For password-protected PDFs, you'll now see a password entry form
3. If you encounter "Failed to load PDF" errors, you can click "Try Again" to retry
4. Check that the PDF doesn't contain only scanned images (OCR not supported)
5. For corrupted PDFs, try re-saving or re-exporting the PDF from the original source
6. See the `docs/PDF_EXTRACTION_GUIDE.md` for advanced PDF handling tips

### Other Issues

- Make sure you have a stable internet connection
- Try disabling browser extensions that might interfere with API requests
- Clear your browser cache and try again

## Performance & Accessibility

The Resume Analyzer now includes several improvements for better performance and accessibility:

### Performance Optimizations

- Reduced animation complexity for lower-end devices
- Progressive loading of analysis sections
- Optimized asset loading and API request caching
- Reduced layout shifts during page transitions

### Accessibility Features

- Screen reader compatible UI components
- Keyboard navigable interface with proper focus management
- High contrast mode support
- ARIA attributes for improved assistive technology support
- Responsive design that works on all screen sizes

## Getting Support

If you're still experiencing issues:

1. Open your browser console (F12) and check for error messages
2. Create an issue on the project's GitHub repository
3. Contact support with the error messages and steps to reproduce the issue
