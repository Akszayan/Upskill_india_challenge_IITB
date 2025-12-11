# 🎤 AI Mock Interview Platform

An AI-powered interview preparation platform featuring real-time voice interviews, intelligent response analysis, and personalized feedback using Google Gemini 2.0 Flash.

---

## 📋 Project Overview

**AI Mock Interview Platform** helps job seekers prepare for interviews through:

- 🎙️ **Voice Interviews** - Record answers and receive AI-powered analysis
- 🧠 **AI-Generated Questions** - Personalized questions based on role, difficulty, and skill type
- 📄 **Resume Analysis** - Upload your resume for tailored interview questions
- 💬 **AI Chat Coach** - Get real-time interview tips and guidance
- 📊 **Detailed Analytics** - Track performance with interactive charts and insights
- 🎥 **Video Library** - Learn from curated interview preparation content

### Interview Modes
| Mode | Focus |
|------|-------|
| **Soft Skills** | Emotional intelligence, communication, empathy, leadership |
| **Technical** | Problem-solving, system design, coding, domain knowledge |
| **Full Interview** | Comprehensive assessment combining both skill types |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │  Interview   │  │    Video     │      │
│  │    Pages     │  │   Session    │  │   Library    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Python)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │  Interview   │  │   AI Chat    │      │
│  │   Endpoints  │  │  Analysis    │  │   Endpoints  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ API Calls
┌─────────────────────────────────────────────────────────────┐
│                    Google Gemini API                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Question   │  │    Audio     │  │    Resume    │      │
│  │  Generation  │  │   Analysis   │  │   Analysis   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure
```
/src/
  /frontend/          # React frontend (Vite)
    /components/      # UI components (InterviewSession, Analytics, etc.)
    /pages/           # Page components (Dashboard, LandingPage)
    /hooks/           # Custom React hooks
    /data/            # Static data (video library)
    /lib/             # Utilities
  /backend/           # Python FastAPI backend
    main.py           # Main API server (746 lines)
  /ai/                # AI modules
    prompts.py        # AI prompt templates

/models/              # Model documentation
/docs/                # Documentation (API, User Guide, System Design)
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Python** 3.8+
- **Node.js** 18+
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-mock-interview
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

---

## ▶️ How to Run Locally

### Option 1: Using the Batch File (Windows)
```bash
run_app.bat
```

### Option 2: Manual Start

**Terminal 1 - Start Backend:**
```bash
py -m uvicorn src.backend.main:app --host 0.0.0.0 --port 3000 --reload
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## 🔌 APIs / Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Create new user account |
| `/auth/login` | POST | Login to existing account |

### Interview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/interview/start` | POST | Generate AI interview question |
| `/interview/analyze` | POST | Analyze audio response, get feedback |

### Resume

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/resume/analyze` | POST | Analyze resume, generate personalized questions |

### AI Chat

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/video-chat` | POST | Get AI coaching response |
| `/gemini` | POST | Direct Gemini API call |

---

## 📥 Example Inputs/Outputs

### Start Interview Session

**Request:**
```json
POST /api/interview/start
{
  "skillType": "technical",
  "jobRole": "Software Engineer",
  "difficulty": "Medium",
  "parameters": ["system design", "problem solving"]
}
```

**Response:**
```json
{
  "question": "Walk me through how you would design a distributed caching system for a high-traffic e-commerce platform.",
  "sessionId": "sess_1702298400000"
}
```

### Analyze Interview Response

**Request:**
```
POST /api/interview/analyze
Content-Type: multipart/form-data

file: [audio.webm]
question: "Tell me about a challenging project..."
skillType: "soft"
jobRole: "Product Manager"
```

**Response:**
```json
{
  "feedback": {
    "clarity": 85,
    "confidence": 80,
    "pace": 90,
    "content": 85,
    "overall": "Great response! You demonstrated strong communication skills.",
    "suggestions": ["Add more specific metrics", "Use STAR method consistently"],
    "transcript": "In my previous role at..."
  },
  "nextQuestion": "How do you handle conflicts within your team?"
}
```

### Resume Analysis

**Request:**
```
POST /api/resume/analyze
Content-Type: multipart/form-data

file: [resume.pdf]
jobRole: "Data Scientist"
skillType: "full"
difficulty: "Hard"
```

**Response:**
```json
{
  "summary": "Experienced data scientist with 5+ years in ML and analytics.",
  "strengths": ["Strong Python skills", "ML model deployment", "Statistical analysis"],
  "questions": [
    "Describe your experience with deploying ML models to production.",
    "How did you handle the imbalanced dataset in your fraud detection project?",
    "Walk me through your A/B testing methodology.",
    "What challenges did you face scaling your recommendation system?",
    "Where do you see the future of AI in your domain?"
  ],
  "focusAreas": ["Highlight quantifiable impact", "Prepare system design examples"]
}
```

---

## 📦 List of Dependencies

### Python (Backend)
```
fastapi          # Web framework
uvicorn          # ASGI server
python-multipart # File upload handling
google-generativeai  # Gemini AI SDK
pyaudio          # Audio recording (optional)
```

### Node.js (Frontend)
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.555.0",
  "tailwindcss": "^3.4.1",
  "vite": "^7.2.4",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

### AI Model
- **Google Gemini 2.0 Flash** - Multimodal AI for text, audio, and document analysis

---

## ⚠️ Important: Free API Limitations

> **This project uses the FREE tier of Google Gemini API (no payment/billing enabled).**

### Rate Limits
| Limit | Value |
|-------|-------|
| Requests per minute | ~15 RPM |
| Requests per day | ~1,500 RPD |
| Tokens per minute | ~32,000 TPM |

### Known Issues Due to Free API

1. **Audio Feedback/Analysis Not Working**
   - After recording your answer, the AI analysis may fail or return generic feedback
   - This happens when the Gemini API rate limit is exceeded
   - You may see: "⚠️ AI analysis failed - Rate limit exceeded"
   - **Solution**: Wait 30-60 seconds between recordings, or try again in 1-2 minutes

2. **Questions Repeating**
   - When the AI fails, the system uses fallback questions from a preset pool
   - The fallback pool has 10 questions per skill type to avoid repetition
   - **Solution**: Wait for rate limit to reset (~1 minute) for AI-generated questions

3. **AI Chat in Video Library May Not Respond**
   - The AI chatbot in the Videos & Tutorials section may fail to respond
   - This happens when the API rate limit is exceeded
   - **Solution**: Wait 1-2 minutes before trying again

4. **Interview Questions Not Generating**
   - If you start multiple interviews quickly, AI question generation may fail
   - **Solution**: Space out your interview sessions by at least 1 minute

### How to Check if Rate Limited

If you see any of these errors, you've hit the rate limit:
- "Rate limit exceeded"
- "429 Too Many Requests"
- "quota exceeded"
- Generic/repetitive responses

**Wait 1-2 minutes and try again.**

### For Production Use
To remove these limitations, you would need to:
1. Enable billing on your Google Cloud account
2. Upgrade to a paid Gemini API tier
3. Replace the API key in `src/backend/main.py` (line 28)

---

## 👥 Contributors

| Name | Role | Contributions |
|------|------|---------------|
| **Team Lead** | Full Stack Developer | Architecture, Backend API, AI Integration |
| **Frontend Dev** | UI/UX Developer | React Components, Dashboard, Animations |
| **AI Engineer** | ML/AI Specialist | Prompt Engineering, Gemini Integration |

---

## 📄 Additional Documentation

- [API Reference](docs/api_reference.md) - Complete API documentation
- [System Design](docs/system_design.md) - Architecture details
- [User Guide](docs/user_guide.md) - How to use the platform
- [AI Models](models/README.md) - Gemini API configuration

---

## 📝 License

MIT License

---

## 🙏 Acknowledgments

- Google Generative AI for Gemini 2.0 Flash API
- React & Vite teams for the frontend framework
- FastAPI for the excellent Python web framework
