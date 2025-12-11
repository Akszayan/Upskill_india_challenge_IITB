# User Guide

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   run_app.bat
   ```
   Or manually:
   ```bash
   # Terminal 1 - Backend
   py -m uvicorn src.backend.main:app --host 0.0.0.0 --port 3000 --reload
   
   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Open browser:** http://localhost:5173

---

## Features

### 1. Interview Practice

#### Soft Skills Mode
- Focus on emotional intelligence
- Behavioral questions (STAR method)
- Communication and empathy assessment

#### Technical Mode
- Problem-solving questions
- Domain-specific challenges
- Technical accuracy evaluation

#### Full Interview Mode
- Comprehensive assessment
- Both soft and technical questions
- Complete interview simulation

### 2. Question Sources

#### AI-Generated Questions
1. Select skill type and job role
2. Choose difficulty level
3. AI generates personalized questions

#### Resume-Based Questions
1. Upload your resume (PDF/DOC)
2. AI analyzes your experience
3. Generates tailored questions based on your background

#### Custom Questions
1. Enter your own questions (one per line)
2. Practice specific scenarios you're preparing for

### 3. AI Feedback

After each answer:
- **Clarity Score** (0-100): How clear was your response
- **Confidence Score** (0-100): How confident you sounded
- **Pace Score** (0-100): Speaking pace appropriateness
- **Content Score** (0-100): Answer relevance and completeness
- **Suggestions**: Specific improvement tips

### 4. Video Library

- Browse soft skills and technical interview videos
- AI Chat assistant for questions
- Context-aware coaching tips

---

## Tips for Best Results

1. **Use a good microphone** for clear audio recording
2. **Speak clearly** and at a moderate pace
3. **Structure answers** using the STAR method
4. **Wait for feedback** before moving to next question
5. **Review suggestions** to improve over time

---

## Troubleshooting

### "Rate limit exceeded"
The free Gemini API has limits (~15 requests/min). Wait 1 minute and try again.

### "Failed to fetch"
Check that the backend server is running on port 3000.

### Audio not recording
Allow microphone permissions in your browser.
