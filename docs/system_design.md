# System Design

## Architecture Overview

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

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn ASGI
- **AI SDK**: google-generativeai

### AI Integration
- **Model**: Gemini 2.0 Flash
- **Features**: Text generation, audio analysis, document parsing

## Data Flow

1. **Interview Session Start**
   - User selects skill type, job role, difficulty
   - Backend calls Gemini to generate first question
   - Question displayed to user

2. **Answer Recording & Analysis**
   - User records audio response
   - Audio sent to backend as WebM blob
   - Backend sends audio to Gemini for analysis
   - Feedback returned with scores and suggestions

3. **Resume Analysis**
   - User uploads PDF/DOC resume
   - Backend sends to Gemini for analysis
   - AI extracts skills, experience, generates tailored questions

4. **AI Chat**
   - User asks interview-related questions
   - Context (skill type, video topic) sent with message
   - Gemini provides personalized coaching response
