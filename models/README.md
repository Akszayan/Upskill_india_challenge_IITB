# AI Models

## Gemini API (Google AI)

This project uses **Google's Gemini 2.0 Flash** model for all AI-powered features.

### Model Details
- **Model Name**: `gemini-2.0-flash`
- **Provider**: Google AI (Generative AI)
- **API Type**: REST API via `google-generativeai` Python SDK

### API Key Configuration
The API key is configured in `src/backend/main.py`:
```python
GEMINI_API_KEY = "your-api-key-here"
genai.configure(api_key=GEMINI_API_KEY)
```

### Capabilities Used
1. **Text Generation** - Interview questions, feedback, coaching tips
2. **Audio Analysis** - Analyzing recorded interview responses
3. **Document Analysis** - Resume parsing and analysis

### Rate Limits (Free Tier)
- ~15 requests per minute
- ~1,500 requests per day

### Links
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Python SDK](https://pypi.org/project/google-generativeai/)
