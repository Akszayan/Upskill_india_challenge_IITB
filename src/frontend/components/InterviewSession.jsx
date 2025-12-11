import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, ChevronRight, X, Clock, BarChart3,
    Volume2, Zap, Brain, MessageSquare, CheckCircle2,
    Loader, ArrowLeft, Sparkles, SkipForward, Trophy,
    Target, TrendingUp, Star, Award, Flame
} from 'lucide-react';

export default function InterviewSession({ isOpen, onClose, config }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [timer, setTimer] = useState(120);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [transcript, setTranscript] = useState('');
    const [allResponses, setAllResponses] = useState([]);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const audioChunksRef = useRef([]);
    const animationFrameRef = useRef(null);
    const isRecordingRef = useRef(false); // Use ref to track recording state in closure

    // Difficulty settings
    const difficultySettings = {
        Easy: { questions: 5, time: 90, color: 'emerald' },
        Medium: { questions: 8, time: 120, color: 'amber' },
        Hard: { questions: 12, time: 150, color: 'rose' }
    };

    const currentSettings = difficultySettings[config?.difficulty] || difficultySettings.Medium;
    const totalQuestions = currentSettings.questions;

    useEffect(() => {
        if (isOpen && config) {
            initializeSession();
            setTimer(currentSettings.time);
        }
        return () => cleanup();
    }, [isOpen, config]);

    useEffect(() => {
        let interval;
        if (isRecording && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (timer === 0 && isRecording) {
            handleStopRecording();
        }
        return () => clearInterval(interval);
    }, [isRecording, timer]);

    const cleanup = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) audioContextRef.current.close();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const initializeSession = async () => {
        setIsLoading(true);
        try {
            // Check if custom questions provided by user
            if (config?.questionSource === 'custom' && config?.customQuestions) {
                const customQs = config.customQuestions
                    .split('\n')
                    .map(q => q.trim())
                    .filter(q => q.length > 0);
                if (customQs.length > 0) {
                    setQuestions(customQs);
                    setIsLoading(false);
                    return;
                }
            }

            // Check if resume-based questions
            if (config?.questionSource === 'resume' && config?.uploadedFile) {
                // Analyze resume and get personalized questions
                const formData = new FormData();
                formData.append('file', config.uploadedFile);
                formData.append('jobRole', config?.jobRole || 'Software Engineer');
                formData.append('skillType', config?.skill?.type || 'full');
                formData.append('difficulty', config?.difficulty || 'Medium');

                const resumeResponse = await fetch('http://localhost:3000/api/resume/analyze', {
                    method: 'POST',
                    body: formData
                });

                if (resumeResponse.ok) {
                    const resumeData = await resumeResponse.json();
                    if (resumeData.questions && resumeData.questions.length > 0) {
                        setQuestions(resumeData.questions);
                        setIsLoading(false);
                        return;
                    }
                }
            }

            // AI-generated questions (default or fallback)
            const response = await fetch('http://localhost:3000/api/interview/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skillType: config?.skill?.type || 'full',
                    jobRole: config?.jobRole || 'Software Engineer',
                    difficulty: config?.difficulty || 'Medium',
                    parameters: config?.parameters || [],
                    previousQuestions: []  // Initial call, no previous questions
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('📥 Initial question received:', data);
                setQuestions([data.question]);
            } else {
                console.error('❌ Failed to fetch initial question');
                setQuestions([getDefaultQuestion()]);
            }
        } catch (error) {
            console.error('Session init error:', error);
            setQuestions([getDefaultQuestion()]);
        }
        setIsLoading(false);
    };

    const getDefaultQuestion = () => {
        const defaults = {
            soft: "Tell me about a time when you had to communicate a complex idea to a non-technical audience.",
            technical: "Walk me through your approach to solving a complex technical problem.",
            full: "Tell me about yourself and what interests you about this role."
        };
        return defaults[config?.skill?.type] || defaults.full;
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyserRef.current = analyser;
            analyser.fftSize = 256;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateLevel = () => {
                // Use ref to check recording state (not stale closure value)
                if (!isRecordingRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(Math.min(100, (average / 255) * 150));
                animationFrameRef.current = requestAnimationFrame(updateLevel);
            };

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };
            mediaRecorder.start(1000);

            // Set both state and ref
            isRecordingRef.current = true;
            setIsRecording(true);
            setTimer(currentSettings.time);
            updateLevel();
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    };

    const handleStopRecording = async () => {
        // Set ref first to stop animation loop immediately
        isRecordingRef.current = false;

        if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setIsRecording(false);
        setAudioLevel(0);
        setIsAnalyzing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzeResponse(audioBlob);
    };

    const analyzeResponse = async (audioBlob) => {
        try {
            console.log('📤 Sending audio for analysis...', audioBlob.size, 'bytes');
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('question', questions[currentQuestionIndex]);
            formData.append('skillType', config?.skill?.type || 'full');
            formData.append('jobRole', config?.jobRole || 'Software Engineer');

            const response = await fetch('http://localhost:3000/api/interview/analyze', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log('📥 Analysis response:', data);

                // Check if it's an error response
                if (data.source === 'error') {
                    console.error('❌ AI analysis error:', data.error);
                    setFeedback({
                        ...data.feedback,
                        isError: true,
                        errorMessage: data.error
                    });
                } else {
                    // Real AI response
                    setFeedback(data.feedback);
                    setTranscript(data.feedback?.transcript || data.transcript || '');
                    if (data.nextQuestion) {
                        setQuestions(prev => [...prev, data.nextQuestion]);
                    }
                }
                setAllResponses(prev => [...prev, {
                    question: questions[currentQuestionIndex],
                    feedback: data.feedback,
                    transcript: data.feedback?.transcript || '',
                    source: data.source || 'unknown'
                }]);
            } else {
                console.error('❌ API call failed:', response.status);
                setFeedback({
                    clarity: 0,
                    confidence: 0,
                    pace: 0,
                    content: 0,
                    overall: '⚠️ Failed to analyze response. Server returned error ' + response.status,
                    suggestions: ['Check if backend server is running', 'Try recording again'],
                    isError: true
                });
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            setFeedback({
                clarity: 0,
                confidence: 0,
                pace: 0,
                content: 0,
                overall: '⚠️ Network error. Please check your connection and try again.',
                suggestions: ['Check internet connection', 'Make sure backend server is running on port 3000'],
                isError: true,
                errorMessage: error.message
            });
        }
        setIsAnalyzing(false);
    };

    // Helper to get error feedback (no more mock random data)
    const getErrorFeedback = (message) => ({
        clarity: 0,
        confidence: 0,
        pace: 0,
        content: 0,
        suggestions: ['Try recording again', 'Speak clearly and loudly'],
        overall: message || '⚠️ Unable to analyze response. Please try again.',
        isError: true
    });

    const handleSkipQuestion = () => {
        setAllResponses(prev => [...prev, { question: questions[currentQuestionIndex], skipped: true }]);
        handleNextQuestion();
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            // Generate next question if needed
            if (currentQuestionIndex >= questions.length - 1) {
                try {
                    console.log('📤 Fetching next question, previous:', questions);
                    const response = await fetch('http://localhost:3000/api/interview/start', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            skillType: config?.skill?.type || 'full',
                            jobRole: config?.jobRole || 'Software Engineer',
                            difficulty: config?.difficulty || 'Medium',
                            parameters: config?.parameters || [],
                            previousQuestions: questions  // Send all previous questions to avoid repetition
                        })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log('📥 Next question received:', data);
                        setQuestions(prev => [...prev, data.question]);
                    }
                } catch (e) {
                    console.error('❌ Failed to fetch next question:', e);
                }
            }
            setCurrentQuestionIndex(prev => prev + 1);
            setFeedback(null);
            setTimer(currentSettings.time);
            setTranscript('');
        } else {
            setSessionComplete(true);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getOverallScore = () => {
        const answered = allResponses.filter(r => !r.skipped);
        if (answered.length === 0) return 0;
        return Math.round(answered.reduce((acc, r) => acc + ((r.feedback?.clarity || 0) + (r.feedback?.confidence || 0) + (r.feedback?.pace || 0) + (r.feedback?.content || 0)) / 4, 0) / answered.length);
    };

    const waveformBars = Array.from({ length: 50 }, (_, i) => {
        const height = isRecording ? Math.sin((i + Date.now() / 80) * 0.4) * audioLevel + audioLevel / 2 : 4;
        return Math.max(4, Math.min(70, height));
    });

    if (!isOpen) return null;

    const difficultyColor = currentSettings.color;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-hidden"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative h-full flex flex-col">
                    {/* Header */}
                    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5">
                        <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Exit</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-full bg-${difficultyColor}-500/20 border border-${difficultyColor}-500/30 flex items-center gap-2`}>
                                <Flame className={`w-4 h-4 text-${difficultyColor}-400`} />
                                <span className={`text-sm font-semibold text-${difficultyColor}-400`}>{config?.difficulty || 'Medium'}</span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                                {config?.skill?.title || 'Interview'}
                            </div>
                        </div>

                        <div className="w-24" />
                    </header>

                    {/* Progress */}
                    <div className="px-6 py-3 border-b border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/50">Progress</span>
                            <span className="text-sm font-medium text-white">{currentQuestionIndex + 1} / {totalQuestions}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-auto">
                        {isLoading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                                        <Brain className="w-10 h-10 text-white" />
                                    </div>
                                    <motion.div className="absolute inset-0 rounded-2xl border-2 border-blue-500" animate={{ scale: [1, 1.2], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                                </div>
                                <p className="text-white/70 text-lg">Preparing your interview...</p>
                            </motion.div>
                        ) : sessionComplete ? (
                            /* Premium Analytics Dashboard */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-w-5xl w-full overflow-y-auto max-h-full px-4 pb-8"
                            >
                                {/* Confetti-like celebration particles */}
                                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={`confetti-${i}`}
                                            className={`absolute w-2 h-2 rounded-full ${['bg-yellow-400', 'bg-pink-500', 'bg-blue-500', 'bg-green-400', 'bg-purple-500'][i % 5]}`}
                                            style={{ left: `${Math.random() * 100}%`, top: -20 }}
                                            animate={{
                                                y: [0, 800],
                                                x: [0, (Math.random() - 0.5) * 200],
                                                opacity: [1, 0]
                                            }}
                                            transition={{
                                                duration: 3 + Math.random() * 2,
                                                delay: i * 0.1,
                                                ease: "easeOut"
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Hero Section with Giant Score */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center mb-12"
                                >
                                    {/* Glowing Score Ring */}
                                    <div className="relative inline-block mb-8">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                                        <div className="relative w-48 h-48">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                                <motion.circle
                                                    cx="96" cy="96" r="88"
                                                    fill="none"
                                                    stroke="url(#scoreGradient2)"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                    strokeDasharray={553}
                                                    initial={{ strokeDashoffset: 553 }}
                                                    animate={{ strokeDashoffset: 553 - (553 * getOverallScore() / 100) }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                />
                                                <defs>
                                                    <linearGradient id="scoreGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#06b6d4" />
                                                        <stop offset="50%" stopColor="#8b5cf6" />
                                                        <stop offset="100%" stopColor="#f43f5e" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <motion.span
                                                    className="text-6xl font-black text-white"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    {getOverallScore()}
                                                </motion.span>
                                                <span className="text-white/50 text-sm font-medium">OUT OF 100</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl md:text-5xl font-black mb-3"
                                    >
                                        <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                            {getOverallScore() >= 85 ? '🏆 Outstanding!' : getOverallScore() >= 70 ? '🌟 Great Job!' : getOverallScore() >= 50 ? '💪 Good Effort!' : '📈 Keep Practicing!'}
                                        </span>
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-white/50 text-lg"
                                    >
                                        {config?.difficulty} Level • {config?.jobRole || 'Interview'} Practice
                                    </motion.p>
                                </motion.div>

                                {/* Bento Grid Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { label: 'Questions', value: allResponses.length, icon: MessageSquare, gradient: 'from-blue-500 to-cyan-400' },
                                        { label: 'Answered', value: allResponses.filter(r => !r.skipped).length, icon: CheckCircle2, gradient: 'from-emerald-500 to-green-400' },
                                        { label: 'Skipped', value: allResponses.filter(r => r.skipped).length, icon: SkipForward, gradient: 'from-amber-500 to-orange-400' },
                                        { label: 'Difficulty', value: config?.difficulty || 'N/A', icon: Flame, gradient: 'from-rose-500 to-pink-400' },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className={`relative group overflow-hidden rounded-3xl bg-gradient-to-br ${stat.gradient} p-[1px] shadow-2xl`}
                                        >
                                            <div className="h-full bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                                                <stat.icon className="w-8 h-8 text-white/80 mb-3" />
                                                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                                <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Skills Cards */}
                                <motion.div
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                                >
                                    {[
                                        { label: 'Clarity', key: 'clarity', emoji: '💎', gradient: 'from-sky-400 to-blue-600' },
                                        { label: 'Confidence', key: 'confidence', emoji: '⚡', gradient: 'from-violet-400 to-purple-600' },
                                        { label: 'Pace', key: 'pace', emoji: '🎯', gradient: 'from-teal-400 to-emerald-600' },
                                        { label: 'Content', key: 'content', emoji: '🧠', gradient: 'from-orange-400 to-red-600' },
                                    ].map((skill, i) => {
                                        const answered = allResponses.filter(r => !r.skipped && r.feedback);
                                        const avg = answered.length > 0
                                            ? Math.round(answered.reduce((acc, r) => acc + (r.feedback?.[skill.key] || 0), 0) / answered.length)
                                            : 0;
                                        return (
                                            <div
                                                key={skill.key}
                                                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden group hover:bg-white/10 transition-all"
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                                <div className="relative">
                                                    <div className="text-3xl mb-3">{skill.emoji}</div>
                                                    <div className="text-4xl font-black text-white mb-1">{avg}%</div>
                                                    <div className="text-xs text-white/50 uppercase tracking-wider">{skill.label}</div>
                                                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full bg-gradient-to-r ${skill.gradient}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${avg}%` }}
                                                            transition={{ duration: 1.5, delay: 0.8 + i * 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>

                                {/* Question Timeline */}
                                <motion.div
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <BarChart3 className="w-5 h-5 text-white" />
                                        </div>
                                        Question Breakdown
                                    </h3>
                                    <div className="space-y-3">
                                        {allResponses.map((response, i) => {
                                            const score = !response.skipped && response.feedback
                                                ? Math.round((response.feedback.clarity + response.feedback.confidence + response.feedback.pace + response.feedback.content) / 4)
                                                : null;
                                            return (
                                                <motion.div
                                                    key={`q-${i}`}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 1 + i * 0.05 }}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl ${response.skipped ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-white/5 border border-white/10'}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${response.skipped ? 'bg-orange-500/20 text-orange-400' : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'}`}>
                                                        Q{i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white/80 text-sm truncate">{response.question}</p>
                                                    </div>
                                                    {response.skipped ? (
                                                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">Skipped</span>
                                                    ) : score !== null ? (
                                                        <div className={`px-4 py-2 rounded-xl font-bold ${score >= 80 ? 'bg-green-500/20 text-green-400' : score >= 60 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                            {score}%
                                                        </div>
                                                    ) : null}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Tips Section */}
                                {(() => {
                                    const tips = allResponses.filter(r => !r.skipped && r.feedback?.suggestions).flatMap(r => r.feedback.suggestions).slice(0, 4);
                                    return tips.length > 0 && (
                                        <motion.div
                                            initial={{ y: 40, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.1 }}
                                            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-6 mb-8"
                                        >
                                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                                <Sparkles className="w-6 h-6 text-emerald-400" />
                                                Pro Tips for Next Time
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {tips.map((tip, i) => (
                                                    <div key={`tip-${i}`} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl">
                                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-emerald-400 text-xs">✓</span>
                                                        </div>
                                                        <p className="text-white/70 text-sm">{tip}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    );
                                })()}

                                {/* CTA Button */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3 }}
                                    className="text-center"
                                >
                                    <button
                                        onClick={onClose}
                                        className="group relative px-10 py-5 text-lg font-bold text-white rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            Back to Dashboard
                                        </span>
                                    </button>
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* Interview Question Screen */
                            <div className="max-w-4xl w-full">
                                {/* Question Card */}
                                <motion.div
                                    key={currentQuestionIndex}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 mb-8 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                                Question {currentQuestionIndex + 1}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                                            {questions[currentQuestionIndex]}
                                        </h2>
                                    </div>
                                </motion.div>

                                {/* Timer & Controls */}
                                <div className="flex items-center justify-center gap-8 mb-8">
                                    {/* Timer */}
                                    <motion.div
                                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${timer < 30 ? 'bg-red-500/20 border-red-500/30' : 'bg-white/5 border-white/10'} border`}
                                        animate={{ scale: timer < 10 ? [1, 1.05, 1] : 1 }}
                                        transition={{ repeat: timer < 10 ? Infinity : 0, duration: 0.5 }}
                                    >
                                        <Clock className={`w-5 h-5 ${timer < 30 ? 'text-red-400' : 'text-white/70'}`} />
                                        <span className={`text-2xl font-mono font-bold ${timer < 30 ? 'text-red-400' : 'text-white'}`}>{formatTime(timer)}</span>
                                    </motion.div>

                                    {/* Skip Button */}
                                    <button
                                        onClick={handleSkipQuestion}
                                        disabled={isRecording || isAnalyzing}
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <SkipForward className="w-5 h-5" />
                                        <span className="font-medium">Skip</span>
                                    </button>

                                    {/* End Interview Button - Always Visible */}
                                    <button
                                        onClick={() => {
                                            console.log('END INTERVIEW CLICKED');
                                            // Stop recording if active
                                            if (isRecording) {
                                                isRecordingRef.current = false;
                                                if (mediaRecorderRef.current?.state !== 'inactive') {
                                                    mediaRecorderRef.current?.stop();
                                                }
                                                streamRef.current?.getTracks().forEach(track => track.stop());
                                                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                                                setIsRecording(false);
                                                setAudioLevel(0);
                                            }
                                            setIsAnalyzing(false);
                                            setFeedback(null);
                                            // Force update sessionComplete
                                            setTimeout(() => {
                                                setSessionComplete(true);
                                            }, 100);
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                        <span className="font-medium">End Interview</span>
                                    </button>
                                </div>

                                {/* Waveform & Record Button */}
                                <div className="flex flex-col items-center gap-8 mb-8">
                                    {/* Waveform */}
                                    <div className="flex items-center justify-center gap-0.5 h-20 px-8 bg-white/5 rounded-2xl border border-white/10">
                                        {waveformBars.map((height, i) => (
                                            <motion.div
                                                key={i}
                                                className={`w-1 rounded-full ${isRecording ? 'bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500' : 'bg-white/20'}`}
                                                animate={{ height: `${height}px` }}
                                                transition={{ duration: 0.05 }}
                                            />
                                        ))}
                                    </div>

                                    {/* Record Button */}
                                    <div className="relative">
                                        <motion.button
                                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                                            disabled={isAnalyzing}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all ${isRecording
                                                ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-2xl shadow-red-500/50'
                                                : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/40'
                                                }`}
                                        >
                                            {isAnalyzing ? (
                                                <Loader className="w-12 h-12 text-white animate-spin" />
                                            ) : isRecording ? (
                                                <div className="w-8 h-8 rounded-sm bg-white" />
                                            ) : (
                                                <Mic className="w-12 h-12 text-white" />
                                            )}
                                        </motion.button>

                                        {isRecording && (
                                            <>
                                                <motion.div className="absolute inset-0 rounded-full border-4 border-red-500" animate={{ scale: [1, 1.4], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
                                                <motion.div className="absolute inset-0 rounded-full border-4 border-red-500" animate={{ scale: [1, 1.6], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
                                            </>
                                        )}
                                    </div>

                                    {/* Dedicated Stop Recording Button */}
                                    {isRecording && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={handleStopRecording}
                                            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-red-500/30"
                                        >
                                            <MicOff className="w-5 h-5" />
                                            Stop Recording
                                        </motion.button>
                                    )}

                                    <p className="text-white/50 text-sm">
                                        {isAnalyzing ? 'Analyzing your response with AI...' : isRecording ? 'Click the button or the icon above to stop' : 'Click to start recording your answer'}
                                    </p>
                                </div>

                                {/* Feedback Panel */}
                                <AnimatePresence>
                                    {feedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">AI Feedback</h3>
                                                    <p className="text-sm text-white/50">Real-time analysis of your response</p>
                                                </div>
                                            </div>

                                            {/* Score Grid */}
                                            <div className="grid grid-cols-4 gap-4 mb-6">
                                                {[
                                                    { label: 'Clarity', value: feedback.clarity, icon: MessageSquare, color: 'blue' },
                                                    { label: 'Confidence', value: feedback.confidence, icon: Zap, color: 'purple' },
                                                    { label: 'Pace', value: feedback.pace, icon: Volume2, color: 'green' },
                                                    { label: 'Content', value: feedback.content, icon: Brain, color: 'orange' },
                                                ].map((metric) => (
                                                    <div key={metric.label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                                                        <div className={`w-10 h-10 mx-auto rounded-xl bg-${metric.color}-500/20 flex items-center justify-center mb-3`}>
                                                            <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                                                        </div>
                                                        <div className="text-2xl font-bold text-white mb-1">{metric.value}%</div>
                                                        <div className="text-xs text-white/50">{metric.label}</div>
                                                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${metric.value}%` }}
                                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Overall Feedback */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6">
                                                <p className="text-white/90 leading-relaxed">{feedback.overall}</p>
                                            </div>

                                            {/* Suggestions */}
                                            {feedback.suggestions && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-white/70 mb-3">💡 Quick Tips</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {feedback.suggestions.map((tip, i) => (
                                                            <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80">
                                                                {tip}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Next Button */}
                                            <div className="flex items-center justify-center gap-4 mt-8">
                                                <button
                                                    onClick={() => {
                                                        // Stop recording if active
                                                        if (isRecording) {
                                                            isRecordingRef.current = false;
                                                            if (mediaRecorderRef.current?.state !== 'inactive') {
                                                                mediaRecorderRef.current?.stop();
                                                            }
                                                            streamRef.current?.getTracks().forEach(track => track.stop());
                                                            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                                                            setIsRecording(false);
                                                            setAudioLevel(0);
                                                        }
                                                        setIsAnalyzing(false);
                                                        setFeedback(null);
                                                        setTimeout(() => {
                                                            setSessionComplete(true);
                                                        }, 100);
                                                    }}
                                                    className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                                                >
                                                    <X className="w-5 h-5" />
                                                    End Interview
                                                </button>
                                                <button
                                                    onClick={handleNextQuestion}
                                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30"
                                                >
                                                    {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Interview'}
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Exit Confirmation Modal */}
            <AnimatePresence>
                {showExitConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowExitConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <X className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Leave Interview?</h3>
                                <p className="text-white/60 mb-6">
                                    Are you sure you want to exit? Your progress will not be saved.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowExitConfirm(false)}
                                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                                    >
                                        No, Continue
                                    </button>
                                    <button
                                        onClick={() => {
                                            cleanup();
                                            onClose();
                                        }}
                                        className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
                                    >
                                        Yes, Exit
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
}
