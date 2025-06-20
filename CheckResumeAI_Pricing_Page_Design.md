# CheckResumeAI Pricing Page Design
*Visual Concept & Layout Specification*

## Page Structure Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                          HEADER NAVIGATION                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    PRICING PAGE HERO SECTION                      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    BILLING TOGGLE SECTION                         │
│                                                                  │
├─────────────┬─────────────────┬──────────────────┬──────────────┤
│             │                 │                  │              │
│  FREE PLAN  │  FREEMIUM PLAN  │  PREMIUM MONTHLY │  PREMIUM     │
│             │                 │                  │  YEARLY      │
│             │                 │                  │              │
├─────────────┼─────────────────┼──────────────────┼──────────────┤
│                                                                  │
│                    FEATURE COMPARISON TABLE                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    TESTIMONIALS SECTION                           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    FAQ SECTION                                    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    CALL TO ACTION                                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                          FOOTER                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Design Elements

### Color Palette
- **Primary**: #3B82F6 (Blue)
- **Secondary**: #8B5CF6 (Purple)
- **Accent**: #10B981 (Green)
- **Premium Gradient**: Linear gradient from #6366F1 to #A855F7
- **Text Dark**: #1E293B
- **Text Light**: #F8FAFC
- **Background Light**: #FFFFFF
- **Background Dark**: #0F172A
- **Card Background Light**: #F1F5F9
- **Card Background Dark**: #1E293B

### Typography
- **Headings**: 'Inter', sans-serif (600 weight)
- **Body**: 'Inter', sans-serif (400 weight)
- **Pricing**: 'Inter', sans-serif (700 weight)
- **Accent Text**: 'Inter', sans-serif (500 weight, italicized)

## Detailed Page Components

### 1. Hero Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                Simple, Transparent Pricing                        │
│                                                                  │
│        Choose the plan that works best for your career goals     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Elements:**
- H1 Heading: "Simple, Transparent Pricing"
- Subheading: "Choose the plan that works best for your career goals"
- Background: Subtle gradient with abstract shapes in background
- Animation: Subtle floating shapes that follow cursor movement

### 2. Billing Toggle Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│          ┌─────────────────┐     ┌─────────────────┐            │
│          │     MONTHLY     │     │     YEARLY      │            │
│          └─────────────────┘     └─────────────────┘            │
│                                                                  │
│                      Save 58% with annual billing                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Toggle Pills: "Monthly" and "Yearly" options
- Highlight effect on active selection
- Save callout: "Save 58% with annual billing"
- Animation: Smooth transition between toggle states

### 3. Pricing Cards

```
┌─────────────┬─────────────────┬──────────────────┬──────────────┐
│             │                 │                  │              │
│  FREE       │  FREEMIUM       │  PREMIUM         │  PREMIUM     │
│             │                 │  MONTHLY         │  YEARLY      │
│  $0         │  $0             │  $99/mo          │  $499/yr     │
│             │                 │                  │              │
│  ● Feature  │  ● Feature      │  ● Feature       │  ● Feature   │
│  ● Feature  │  ● Feature      │  ● Feature       │  ● Feature   │
│  ● Feature  │  ● Feature      │  ● Feature       │  ● Feature   │
│             │                 │                  │              │
│  [Button]   │  [Button]       │  [Button]        │  [Button]    │
│             │                 │                  │              │
└─────────────┴─────────────────┴──────────────────┴──────────────┘
```

**Elements:**
- 4 distinct pricing cards with clear visual hierarchy
- Premium plans have special styling (gradient border, highlight effect)
- "Most Popular" tag on recommended plan
- Feature bullets with check marks
- Prominent CTA buttons
- Hover effects with subtle elevation

#### Free Card Design
- Simple clean design
- Neutral color scheme
- Basic shadow effect
- Button text: "Get Started"

#### Freemium Card Design
- Enhanced design with subtle highlighting
- Slightly elevated appearance
- Button text: "Try Freemium"

#### Premium Monthly Card Design
- Premium gradient border
- "Most Popular" highlight ribbon
- Prominent elevation shadow
- Button text: "Start Premium Monthly"

#### Premium Yearly Card Design
- Premium gradient border with enhanced effect
- "Best Value" highlight ribbon
- Maximum elevation shadow
- Prominent savings callout: "Save 58%"
- Button text: "Start Premium Yearly"

### 4. Feature Comparison Table

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  FEATURE                FREE    FREEMIUM   PREMIUM    PREMIUM    │
│                                           MONTHLY    YEARLY      │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  ATS Analysis            ✓        ✓✓         ✓✓✓       ✓✓✓      │
│  Resume Scans           2/mo     5/mo     Unlimited  Unlimited   │
│  Real-time Analysis      ✗         ✗         ✓         ✓        │
│  ...                                                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Clean table with alternating row colors
- Feature categories with expandable sections
- Visual indicators (✓, ✓✓, ✓✓✓, ✗) for feature availability
- Tooltip explanations for complex features
- Sticky header on scroll
- Highlight effect for premium features

### 5. Testimonials Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                   What Our Users Are Saying                       │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │ Testimonial │  │ Testimonial │  │ Testimonial │               │
│  │     1       │  │     2       │  │     3       │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Carousel of user testimonials with profile photos
- Star ratings
- Brief success stories
- Industry and role information
- Before/after metrics
- Navigation dots and arrows
- Auto-scrolling with pause on hover

### 6. FAQ Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                  Frequently Asked Questions                       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Q: What is the difference between free and premium plans?   │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ A: Our premium plans offer advanced features including...   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Q: How does the ATS compatibility analysis work?            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Accordion-style FAQ items
- Categorized questions
- Expandable answers with rich formatting
- Search functionality
- Anchor links to specific questions
- "Still have questions?" callout with support link

### 7. Call to Action Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│          Ready to optimize your resume with CheckResumeAI?       │
│                                                                  │
│                      [START FREE ANALYSIS]                        │
│                                                                  │
│               No credit card required to get started             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Bold heading with clear value proposition
- Large, prominent primary CTA button
- Secondary reassurance text: "No credit card required"
- Trust indicators (security badges, customer logos)
- Background with subtle animation

## Mobile Responsive Design

```
┌───────────────────┐
│     HEADER        │
├───────────────────┤
│                   │
│   PRICING HERO    │
│                   │
├───────────────────┤
│                   │
│ BILLING TOGGLE    │
│                   │
├───────────────────┤
│                   │
│   FREE PLAN       │
│                   │
├───────────────────┤
│                   │
│   FREEMIUM PLAN   │
│                   │
├───────────────────┤
│                   │
│  PREMIUM MONTHLY  │
│                   │
├───────────────────┤
│                   │
│  PREMIUM YEARLY   │
│                   │
├───────────────────┤
│                   │
│ FEATURE COMPARE   │
│                   │
├───────────────────┤
│                   │
│  TESTIMONIALS     │
│                   │
├───────────────────┤
│                   │
│      FAQs         │
│                   │
├───────────────────┤
│                   │
│   CALL TO ACTION  │
│                   │
├───────────────────┤
│     FOOTER        │
└───────────────────┘
```

**Responsive Elements:**
- Stacked pricing cards at mobile breakpoints
- Horizontally scrollable feature comparison table
- Larger touch targets for interactive elements
- Full-width buttons on small screens
- Simplified navigation with hamburger menu
- Optimized testimonial carousel for mobile

## Interactive Elements

### Feature Benefit Tooltips
- Hover over features to see detailed explanations and benefits
- Includes examples and use-cases for each premium feature
- Mobile: Tap to reveal tooltips

### Real-time Plan Comparison
- Select features to see which plans include them
- Dynamically highlight plans that match selected features
- "Recommended for you" algorithm based on selected priorities

### ROI Calculator
- Interactive calculator to determine value of premium plans
- Input current salary, job search status
- Shows potential time savings, interview probability increase
- Calculates return on investment for premium plans

### Preview Premium Features
- Interactive demos of premium features
- "Try for free" limited-time access to premium features
- Before/after comparisons of resume analysis

## Animation & Microinteractions

- Smooth transitions between plan selections
- Subtle "breathing" effect on premium cards
- Check mark animations when comparing features
- Progress indicators during plan selection
- Confetti effect on yearly subscription selection (highlighting savings)
- Typing effect on testimonial quotes

## Copy Guidelines

### Value-focused Headlines
- Emphasize results, not just features
- Example: "Land interviews 3.4x faster" vs "Resume analysis"

### Feature Description Formula
- Feature name + Brief explanation + Benefit to user
- Example: "AI-powered keyword analysis: Automatically identify and add missing keywords to increase your interview chances by 70%"

### Social Proof Integration
- Include specific metrics with testimonials
- Example: "After using CheckResumeAI Premium, I received 5 interview calls in 2 weeks compared to 0 in the previous month"

### Call-to-Action Hierarchy
- Primary CTAs: "Start Premium Trial", "Upgrade Now"
- Secondary CTAs: "Learn More", "Compare Plans"
- Tertiary CTAs: "See Features", "View Demos"

## Implementation Notes

### Technical Requirements
- React components with Framer Motion animations
- Responsive design with Tailwind CSS
- State management for plan comparison features
- A/B testing setup for pricing page variations
- Event tracking for user interactions
- Integration with payment processing system
- Mobile-first implementation approach

### Conversion Optimization
- Exit-intent discount popups
- Social proof notifications ("10 people upgraded in the last hour")
- Limited-time offers with countdown timers
- Abandoned cart email sequences
- First-month discount incentives
- Money-back guarantee badges