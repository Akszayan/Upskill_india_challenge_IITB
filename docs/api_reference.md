# API Reference

## Base URL
```
http://localhost:3000/api
```

---

## Authentication

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "password": "securepassword"
}
```

---

## Interview

### POST /interview/start
Generate an AI-powered interview question.

**Request Body:**
```json
{
  "skillType": "soft|technical|full",
  "jobRole": "Software Engineer",
  "difficulty": "Easy|Medium|Hard",
  "parameters": ["communication", "leadership"]
}
```

**Response:**
```json
{
  "question": "Tell me about a time when...",
  "sessionId": "sess_1234567890"
}
```

### POST /interview/analyze
Analyze audio response and provide feedback.

**Request (multipart/form-data):**
- `file`: Audio file (WebM)
- `question`: The question being answered
- `skillType`: soft|technical|full
- `jobRole`: Job role string

**Response:**
```json
{
  "feedback": {
    "clarity": 85,
    "confidence": 80,
    "pace": 90,
    "content": 85,
    "overall": "Great response!",
    "suggestions": ["Add more examples", "Speak slower"],
    "transcript": "..."
  },
  "nextQuestion": "Follow-up question..."
}
```

---

## Resume

### POST /resume/analyze
Analyze resume and generate personalized questions.

**Request (multipart/form-data):**
- `file`: Resume file (PDF/DOC)
- `jobRole`: Target job role
- `skillType`: soft|technical|full
- `difficulty`: Easy|Medium|Hard

**Response:**
```json
{
  "summary": "Experienced developer with...",
  "strengths": ["Strong backend skills", "Leadership experience"],
  "questions": [
    "Question about their experience...",
    "Question about a project..."
  ],
  "focusAreas": ["Highlight achievements", "Prepare STAR examples"]
}
```

---

## AI Chat

### POST /video-chat
Get AI coaching response for video learning.

**Request Body:**
```json
{
  "message": "How can I improve my communication?",
  "skillType": "soft|technical|general",
  "videoTitle": "Communication Skills",
  "conversationHistory": ["User: Hi", "AI: Hello!"]
}
```

**Response:**
```json
{
  "response": "Great question! Here are some tips...",
  "skillType": "soft"
}
```

---

## Error Responses

### Rate Limit (429)
```json
{
  "response": "Rate limit reached. Please wait...",
  "error": "rate_limit"
}
```

### Server Error (500)
```json
{
  "error": "Error message details"
}
```
