import os
import threading
import wave
import json
import random
import time
from typing import List, Optional, Union

from fastapi import FastAPI, Request, Form, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

# Try importing pyaudio, handle if missing
try:
    import pyaudio
    PYAUDIO_AVAILABLE = True
except ImportError:
    PYAUDIO_AVAILABLE = False
    print("Warning: PyAudio not installed. Server-side recording will be disabled.")

app = FastAPI()

# --- Configuration ---
PORT = int(os.environ.get("PORT", 3000))
GEMINI_API_KEY = "Your API Key"  # User's Gemini API key
genai.configure(api_key=GEMINI_API_KEY)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-Memory Database (Ported from Node.js) ---
users = []
leads = []
# interviews = [] # Not used in original Node.js code but defined

# --- Pydantic Models ---
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    identifier: str
    password: str

class LeadCapture(BaseModel):
    email: str
    role: Optional[str] = None
    name: Optional[str] = None

class MockEval(BaseModel):
    transcript: str
    question: Optional[str] = None
    context: Optional[str] = None

class MockStream(BaseModel):
    action: str
    sessionId: Optional[str] = None

# --- API Endpoints: Auth (Ported) ---

@app.post("/api/auth/signup", status_code=201)
async def signup(user: UserSignup):
    if not user.name or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required")
    
    if any(u["email"] == user.email for u in users):
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = {
        "id": len(users) + 1,
        "name": user.name,
        "email": user.email,
        "password": user.password, # In production, hash this!
        "created_at": str(time.time())
    }
    users.append(new_user)
    print(f"✅ New User Signed Up: {new_user}")
    
    return {
        "message": "User created successfully",
        "user": {"id": new_user["id"], "name": new_user["name"], "email": new_user["email"]}
    }

@app.post("/api/auth/login")
async def login(creds: UserLogin):
    if not creds.identifier or not creds.password:
        raise HTTPException(status_code=400, detail="Name/Email and password are required")

    user = next((u for u in users if (u["email"] == creds.identifier or u["name"] == creds.identifier) and u["password"] == creds.password), None)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    print(f"✅ User Logged In: {user['name']}")
    return {
        "message": "Login successful",
        "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
    }

# --- API Endpoints: Leads (Ported) ---

@app.post("/api/leads", status_code=201)
async def capture_lead(lead: LeadCapture):
    if not lead.email:
        raise HTTPException(status_code=400, detail="Email is required")

    new_lead = {
        "id": len(leads) + 1,
        "email": lead.email,
        "role": lead.role,
        "name": lead.name,
        "timestamp": str(time.time())
    }
    leads.append(new_lead)
    print(f"✅ New Lead Captured: {new_lead}")
    
    return {
        "message": "Lead captured successfully",
        "lead": new_lead
    }

# --- API Endpoints: Mock ASR/Eval/Stream (Ported) ---

@app.post("/api/asr")
async def asr_mock():
    # Simulate processing delay
    time.sleep(1)
    return {
        "transcript": "This is a simulated transcript of the user's answer.",
        "confidence": 0.95,
        "isFinal": True
    }

@app.post("/api/eval")
async def eval_mock(eval_req: MockEval):
    # Simulate processing delay
    time.sleep(1.5)
    return {
        "scores": {
            "clarity": random.randint(80, 99),
            "confidence": random.randint(80, 99),
            "correctness": random.randint(75, 95),
            "emotion": 'Confident'
        },
        "feedback": "Great answer! You spoke clearly and confidently. Consider adding specific examples of projects you've worked on.",
        "improvements": [
            "Add quantifiable achievements",
            "Mention specific technologies used",
            "Reduce filler words"
        ]
    }

@app.post("/api/stream")
async def stream_mock(stream_req: MockStream):
    if stream_req.action == 'start':
        new_session_id = f"sess_{int(time.time()*1000)}"
        print(f"🎙️  New recording session started: {new_session_id}")
        return {
            "sessionId": new_session_id,
            "iceServers": [
                { "urls": 'stun:stun.l.google.com:19302' }
            ]
        }
    elif stream_req.action == 'stop':
        print(f"⏹️  Recording session stopped: {stream_req.sessionId}")
        return { "message": 'Session stopped' }
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

# --- API Endpoints: Interview Session (New) ---

class InterviewStartRequest(BaseModel):
    skillType: str = "full"
    jobRole: str = "Software Engineer"
    difficulty: str = "Medium"
    parameters: List[str] = []
    resumeContext: str = ""  # Optional resume text for context
    previousQuestions: List[str] = []  # Previously asked questions to avoid repetition

@app.post("/api/resume/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    jobRole: str = Form("Software Engineer"),
    skillType: str = Form("full"),
    difficulty: str = Form("Medium")
):
    """Analyze resume and generate personalized interview questions."""
    try:
        contents = await file.read()
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Determine file type and extract text
        file_type = file.content_type or "application/octet-stream"
        
        prompt = f"""You are an expert interview coach analyzing a candidate's resume for a {jobRole} position.

The interview type is: {skillType} (soft = emotional intelligence focus, technical = technical skills focus, full = comprehensive)
Difficulty level: {difficulty}

Based on the resume content, provide:
1. A brief summary of the candidate's background (2-3 sentences)
2. Key strengths identified from the resume
3. 5 personalized interview questions tailored to their experience and the role
4. Areas they should focus on for this interview

Return the response in this exact JSON format:
{{
  "summary": "Brief summary of the candidate...",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "questions": [
    "Question 1 based on their experience?",
    "Question 2 about a specific project?",
    "Question 3 about their skills?",
    "Question 4 about challenges they faced?",
    "Question 5 about future goals?"
  ],
  "focusAreas": ["area 1", "area 2"]
}}"""

        response = model.generate_content([
            prompt,
            {
                "mime_type": file_type,
                "data": contents
            }
        ])
        
        # Try to parse response as JSON
        try:
            import re
            json_match = re.search(r'\{[\s\S]*\}', response.text)
            if json_match:
                result = json.loads(json_match.group())
                return result
        except:
            pass
        
        # Fallback response
        return {
            "summary": "Resume analyzed successfully.",
            "strengths": ["Experience in the field", "Strong background", "Relevant skills"],
            "questions": [
                f"Tell me about your most relevant experience for the {jobRole} role.",
                "Walk me through a challenging project you've worked on.",
                "What technical skills do you consider your strongest?",
                "How do you approach learning new technologies?",
                "Where do you see yourself in 5 years?"
            ],
            "focusAreas": ["Highlight specific achievements", "Prepare STAR method examples"]
        }
    except Exception as e:
        error_msg = str(e)
        print(f"Resume analysis error: {error_msg}")
        
        if "429" in error_msg or "rate" in error_msg.lower():
            return {
                "error": "rate_limit",
                "message": "API rate limit reached. Please wait a moment and try again."
            }
        
        return {
            "error": str(e),
            "summary": "Could not fully analyze resume.",
            "strengths": ["Your experience", "Your skills"],
            "questions": [
                "Tell me about yourself.",
                "What interests you about this role?",
                "Describe your most impactful project.",
                "How do you handle challenges?",
                "What are your career goals?"
            ],
            "focusAreas": ["Prepare examples from your experience"]
        }

@app.post("/api/interview/start")
async def interview_start(req: InterviewStartRequest):
    """Start an interview session and generate the first question using Gemini."""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Mode-specific prompts for different interview types
        mode_prompts = {
            "soft": f"""You are an expert behavioral interviewer specializing in EMOTIONAL INTELLIGENCE and SOFT SKILLS assessment.
            
You are conducting a {req.difficulty} level interview for a {req.jobRole} position.

Focus Areas for Soft Skills:
- Emotional intelligence and self-awareness
- Empathy and understanding others' perspectives  
- Communication warmth and interpersonal skills
- Conflict resolution and handling difficult situations
- Teamwork and collaboration
- Adaptability and stress management
- Leadership and influence without authority

{'Prioritize these areas: ' + ', '.join(req.parameters) if req.parameters else ''}

Generate a single, thoughtful behavioral question that assesses the candidate's emotional intelligence, empathy, or interpersonal sensitivity. Use the STAR method context (Situation, Task, Action, Result).

Return ONLY the question text, nothing else.""",
            
            "technical": f"""You are an expert technical interviewer for {req.jobRole} positions.
            
You are conducting a {req.difficulty} level TECHNICAL interview.

Focus Areas for Technical Skills:
- Technical problem-solving and analytical thinking
- Domain-specific knowledge and expertise
- System design and architecture thinking
- Code quality, best practices, and optimization
- Debugging and troubleshooting approaches
- Learning ability and staying current with technology
- Technical communication and explaining complex concepts

{'Prioritize these areas: ' + ', '.join(req.parameters) if req.parameters else ''}

Generate a single, challenging technical question appropriate for the role and difficulty level. Focus on practical problem-solving.

Return ONLY the question text, nothing else.""",
            
            "full": f"""You are a comprehensive interviewer conducting a FULL interview for a {req.jobRole} position.
            
You are conducting a {req.difficulty} level interview that combines BOTH soft skills AND technical assessment.

Full Interview Covers:
- Technical competency and domain knowledge
- Behavioral and situational responses
- Communication skills and clarity
- Problem-solving approach
- Cultural fit and values alignment
- Career goals and motivation
- Leadership potential

{'Focus areas: ' + ', '.join(req.parameters) if req.parameters else ''}

Generate a single, well-rounded interview question that can reveal both technical thinking and soft skills. Make it open-ended to allow for comprehensive responses.

Return ONLY the question text, nothing else."""
        }
        
        prompt = mode_prompts.get(req.skillType, mode_prompts["full"])
        
        # Add previous questions context to avoid repetition
        if req.previousQuestions:
            prev_qs = '\n'.join([f"- {q}" for q in req.previousQuestions[-5:]])  # Last 5 questions
            prompt += f"\n\nIMPORTANT: Do NOT repeat or ask similar questions to these already-asked questions:\n{prev_qs}\n\nGenerate a COMPLETELY DIFFERENT question."
        
        print(f"📤 Generating question for {req.skillType} / {req.jobRole} / {req.difficulty}")
        response = model.generate_content(prompt)
        question = response.text.strip().strip('"').strip("'")
        print(f"📥 Generated question: {question[:100]}...")
        
        return {"question": question, "sessionId": f"sess_{int(time.time()*1000)}", "source": "ai"}
    except Exception as e:
        print(f"❌ Error generating question: {e}")
        # Fallback questions - but mark as fallback
        fallback_questions = {
            "soft": "Tell me about a time when you had to navigate a difficult conversation with a colleague or client. How did you handle their emotions and reach a resolution?",
            "technical": "Walk me through how you would design and implement a scalable solution for handling high traffic in a web application.",
            "full": "Tell me about a challenging project where you had to balance technical complexity with team collaboration. What was your approach?"
        }
        return {"question": fallback_questions.get(req.skillType, fallback_questions["full"]), "sessionId": f"sess_{int(time.time()*1000)}", "source": "fallback", "error": str(e)}

@app.post("/api/interview/analyze")
async def interview_analyze(
    file: UploadFile = File(...),
    question: str = Form(""),
    skillType: str = Form("full"),
    jobRole: str = Form("Software Engineer")
):
    """Analyze an audio response and generate feedback + next question based on interview mode."""
    try:
        contents = await file.read()
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Mode-specific analysis prompts
        if skillType == "soft":
            analysis_prompt = f"""You are an expert BEHAVIORAL and EMOTIONAL INTELLIGENCE interview coach.

The candidate was asked: "{question}"
They are interviewing for: {jobRole}
Interview type: SOFT SKILLS (emotional intelligence, empathy, interpersonal skills)

Analyze their response with EMPHASIS on:
- Emotional awareness and empathy shown in their answer
- How they demonstrate understanding of others' perspectives
- Sensitivity and warmth in communication
- Conflict handling and diplomatic approach

Provide a JSON object with these fields:
- clarity: number 0-100 (communication clarity and warmth)
- confidence: number 0-100 (emotional confidence and authenticity)
- pace: number 0-100 (conversational flow)
- content: number 0-100 (emotional intelligence in answer)
- overall: string (2 sentences focusing on soft skills)
- suggestions: array of 2-3 tips to improve emotional intelligence
- transcript: string (rough transcription)

Generate a follow-up behavioral question about emotional intelligence.

Return in JSON format:
{{"feedback": {{"clarity": 85, "confidence": 80, "pace": 90, "content": 85, "overall": "...", "suggestions": ["..."], "transcript": "..."}}, "nextQuestion": "..."}}"""
        
        elif skillType == "technical":
            analysis_prompt = f"""You are an expert TECHNICAL interview coach for {jobRole} roles.

The candidate was asked: "{question}"
Interview type: TECHNICAL (problem-solving, domain knowledge)

Analyze their response with EMPHASIS on:
- Technical accuracy and depth of knowledge
- Problem-solving methodology
- System thinking and architecture
- Ability to explain complex concepts

Provide a JSON object with these fields:
- clarity: number 0-100 (technical explanation clarity)
- confidence: number 0-100 (technical confidence)
- pace: number 0-100 (appropriate depth vs time)
- content: number 0-100 (technical accuracy)
- overall: string (2 sentences on technical competency)
- suggestions: array of 2-3 technical improvement tips
- transcript: string (rough transcription)

Generate a follow-up technical question.

Return in JSON format:
{{"feedback": {{"clarity": 85, "confidence": 80, "pace": 90, "content": 85, "overall": "...", "suggestions": ["..."], "transcript": "..."}}, "nextQuestion": "..."}}"""
        
        else:  # full
            analysis_prompt = f"""You are a COMPREHENSIVE interview coach evaluating soft skills AND technical abilities.

The candidate was asked: "{question}"
They are interviewing for: {jobRole}
Interview type: FULL INTERVIEW

Analyze covering BOTH:
- Soft Skills: communication, empathy, collaboration
- Technical: problem-solving, domain knowledge

Provide a JSON object with these fields:
- clarity: number 0-100 (overall communication)
- confidence: number 0-100 (presence and assurance)
- pace: number 0-100 (pacing and structure)
- content: number 0-100 (completeness)
- overall: string (2 sentences balanced feedback)
- suggestions: array of 2-3 tips
- transcript: string (rough transcription)

Generate a well-rounded follow-up question.

Return in JSON format:
{{"feedback": {{"clarity": 85, "confidence": 80, "pace": 90, "content": 85, "overall": "...", "suggestions": ["..."], "transcript": "..."}}, "nextQuestion": "..."}}"""
        
        print(f"📤 Sending audio ({len(contents)} bytes) to Gemini for analysis...")
        print(f"   Question: {question[:80]}...")
        print(f"   Skill Type: {skillType}, Job Role: {jobRole}")
        
        response = model.generate_content([
            analysis_prompt,
            {
                "mime_type": file.content_type or "audio/webm",
                "data": contents
            }
        ])
        
        print(f"📥 Gemini raw response length: {len(response.text)} chars")
        print(f"   First 200 chars: {response.text[:200]}...")
        
        # Try to parse response as JSON
        try:
            import re
            # Try to find JSON object in response
            json_match = re.search(r'\{[\s\S]*\}', response.text)
            if json_match:
                result = json.loads(json_match.group())
                print(f"✅ Successfully parsed Gemini JSON response")
                result["source"] = "ai"  # Mark as real AI response
                return result
            else:
                print(f"⚠️ No JSON found in response, trying direct parse...")
                # Try direct parse
                result = json.loads(response.text)
                result["source"] = "ai"
                return result
        except json.JSONDecodeError as je:
            print(f"⚠️ JSON parse failed: {je}")
            # Try to extract structured data from text response
            # Return partial AI response with error flag
            return {
                "feedback": {
                    "clarity": 75,
                    "confidence": 75,
                    "pace": 75,
                    "content": 75,
                    "overall": response.text[:500] if response.text else "Analysis completed.",
                    "suggestions": ["AI response was not in expected format"],
                    "transcript": ""
                },
                "nextQuestion": "Tell me more about your experience with this.",
                "source": "ai_partial",
                "parseError": str(je)
            }
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error analyzing interview: {error_msg}")
        
        # Check for specific error types
        is_rate_limit = "429" in error_msg or "rate" in error_msg.lower() or "quota" in error_msg.lower()
        
        return {
            "feedback": {
                "clarity": 0,
                "confidence": 0,
                "pace": 0,
                "content": 0,
                "overall": "⚠️ AI analysis failed. " + ("Rate limit exceeded - please wait a moment." if is_rate_limit else "Please try again."),
                "suggestions": ["Try recording again", "Speak clearly into microphone", "Check your internet connection"],
                "transcript": ""
            },
            "nextQuestion": "Let's try that question again, or you can skip to the next one.",
            "source": "error",
            "error": error_msg,
            "isRateLimit": is_rate_limit
        }

# --- API Endpoints: Gemini AI Chat ---

class VideoChatRequest(BaseModel):
    message: str
    skillType: str = "general"  # soft, technical, or general
    videoTitle: str = ""
    conversationHistory: List[str] = []

@app.post("/api/gemini")
async def gemini_chat(prompt: str = Form(...)):
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/video-chat")
async def video_ai_chat(req: VideoChatRequest):
    """AI Chat for Videos section - provides interview coaching tips based on context."""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Build conversation context
        history_context = "\n".join(req.conversationHistory[-6:]) if req.conversationHistory else ""
        
        # Skill-specific system prompts
        system_prompts = {
            "soft": """You are an expert SOFT SKILLS and EMOTIONAL INTELLIGENCE coach.
Focus on: communication, empathy, leadership, teamwork, conflict resolution, emotional awareness.
Provide practical tips for interviews that assess emotional intelligence and interpersonal skills.
Use examples and scenarios to illustrate your points.""",
            
            "technical": """You are an expert TECHNICAL interview coach.
Focus on: coding, system design, problem-solving, algorithms, debugging, technical communication.
Provide practical coding tips, explain concepts clearly, and help prepare for technical assessments.
Use examples and break down complex concepts.""",
            
            "general": """You are a comprehensive INTERVIEW COACH.
Help with all aspects: resume tips, behavioral questions, technical prep, salary negotiation, and career advice.
Provide actionable, encouraging guidance for job seekers."""
        }
        
        system_prompt = system_prompts.get(req.skillType, system_prompts["general"])
        
        prompt = f"""{system_prompt}

{f'The user is watching a video about: {req.videoTitle}' if req.videoTitle else ''}

{f'Previous conversation:\\n{history_context}' if history_context else ''}

User's question: {req.message}

Provide a helpful, encouraging, and practical response. Keep it concise but informative. 
Use bullet points or numbered lists when appropriate. Include specific examples when possible."""

        response = model.generate_content(prompt)
        
        return {
            "response": response.text,
            "skillType": req.skillType
        }
    except Exception as e:
        error_msg = str(e)
        print(f"Video chat error: {error_msg}")
        
        # Handle rate limiting specifically
        if "429" in error_msg or "rate" in error_msg.lower() or "quota" in error_msg.lower():
            return {
                "response": "⏳ I'm receiving too many requests right now. The free API has a limit of about 15 requests per minute. Please wait a moment and try again!",
                "error": "rate_limit"
            }
        
        return {
            "response": "I'm having trouble connecting right now. Please try again in a moment!",
            "error": error_msg
        }

@app.post("/api/analyze-interview")
async def analyze_interview(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = """
        Analyze this audio recording of a self-introduction for a job interview.
        Please provide a concise analysis covering:
        1. Voice Tone (Confidence, Clarity, Pace)
        2. Sentiment Analysis (Positive, Negative, Neutral)
        3. Content Feedback (Strengths and Areas for Improvement)
        
        Keep the response professional and encouraging.
        """
        
        response = model.generate_content([
            prompt,
            {
                "mime_type": "audio/wav", # Assuming wav for now as per requested code
                "data": contents
            }
        ])
        
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}

# --- Server-side Recording Logic (New) ---

is_recording = False
frames = []
stream = None
p = None
recording_thread = None

def record_audio_thread_func():
    global is_recording, frames, stream, p
    if not PYAUDIO_AVAILABLE:
        return

    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 44100
    
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)
    
    frames = []
    while is_recording:
        data = stream.read(CHUNK)
        frames.append(data)
        
    stream.stop_stream()
    stream.close()
    p.terminate()

@app.post("/api/record/start")
async def start_recording():
    global is_recording, recording_thread
    if not PYAUDIO_AVAILABLE:
         return {"error": "PyAudio not installed on server."}

    if not is_recording:
        is_recording = True
        recording_thread = threading.Thread(target=record_audio_thread_func)
        recording_thread.start()
        return {"status": "Recording started"}
    return {"status": "Already recording"}

@app.post("/api/record/stop")
async def stop_recording():
    global is_recording, recording_thread, p
    if not PYAUDIO_AVAILABLE:
         return {"error": "PyAudio not installed on server."}

    if is_recording:
        is_recording = False
        recording_thread.join()
        
        # Save file
        filename = "server_recording.wav"
        wf = wave.open(filename, 'wb')
        wf.setnchannels(1)
        wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wf.setframerate(44100)
        wf.writeframes(b''.join(frames))
        wf.close()
        
        # Analyze with Gemini
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            prompt = """
            Analyze this audio recording of a self-introduction for a job interview.
            Please provide a concise analysis covering:
            1. Voice Tone (Confidence, Clarity, Pace)
            2. Sentiment Analysis (Positive, Negative, Neutral)
            3. Content Feedback (Strengths and Areas for Improvement)
            
            Keep the response professional and encouraging.
            """
            
            # Read the saved file
            with open(filename, "rb") as f:
                audio_data = f.read()
            
            response = model.generate_content([
                prompt,
                {
                    "mime_type": "audio/wav",
                    "data": audio_data
                }
            ])
            return {"response": response.text}
        except Exception as e:
            return {"error": str(e)}
            
    return {"error": "Not recording"}

# --- Static Files & Catch-All (For React SPA) ---
# Mount the dist directory at /assets if it exists, or just root?
# Vite builds to dist. dist/index.html is the entry point.
# dist/assets contains js/css.
# We want to serve dist/ as root.
dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")

if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
    
    # Catch all other routes to serve index.html
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Check if file exists in dist (e.g. favicon.ico)
        file_path = os.path.join(dist_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Otherwise serve index.html
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    print(f"Warning: 'dist' directory not found at {dist_path}. React app won't be served.")
    @app.get("/")
    def read_root():
        return {"message": "Backend is running, but React frontend build (dist) was not found."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
