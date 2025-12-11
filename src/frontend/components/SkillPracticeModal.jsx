import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, Upload, FileText, Sparkles,
    Briefcase, Code, Palette, TrendingUp, Users,
    Heart, Shield, Zap, Globe, Cpu, Database,
    MessageSquare, Mic, Ear, CheckCircle2
} from 'lucide-react';
import { softSkillsParameters } from '../data/videoData';
import InterviewSession from './InterviewSession';

export default function SkillPracticeModal({ isOpen, onClose, selectedSkill }) {
    const [step, setStep] = useState(1); // 1: Job Role, 2: Difficulty, 3: Question Source
    const [selectedJobRole, setSelectedJobRole] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [selectedQuestionSource, setSelectedQuestionSource] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isCustomRole, setIsCustomRole] = useState(false);
    const [customJobTitle, setCustomJobTitle] = useState('');
    const [customJobDescription, setCustomJobDescription] = useState('');
    const [customQuestions, setCustomQuestions] = useState('');
    const [selectedParameters, setSelectedParameters] = useState([]);
    const [showInterviewSession, setShowInterviewSession] = useState(false);
    const [interviewConfig, setInterviewConfig] = useState(null);

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedJobRole(null);
            setSelectedDifficulty(null);
            setSelectedQuestionSource(null);
            setUploadedFile(null);
            setIsCustomRole(false);
            setCustomJobTitle('');
            setCustomJobDescription('');
            setCustomQuestions('');
            setSelectedParameters([]);
        }
    }, [isOpen]);



    // softSkillParameters are now imported from ../data/videoData

    const toggleParameter = (paramId) => {
        setSelectedParameters(prev =>
            prev.includes(paramId)
                ? prev.filter(id => id !== paramId)
                : [...prev, paramId]
        );
    };

    const jobCategories = [
        {
            category: 'Technology',
            icon: Code,
            color: 'blue',
            roles: [
                'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer',
                'Cloud Architect', 'Security Engineer', 'Mobile Developer', 'QA Engineer',
                'Product Manager (Tech)', 'Technical Lead', 'Solutions Architect', 'Site Reliability Engineer'
            ]
        },
        {
            category: 'Business & Management',
            icon: Briefcase,
            color: 'purple',
            roles: [
                'Product Manager', 'Project Manager', 'Business Analyst', 'Management Consultant',
                'Operations Manager', 'Strategy Manager', 'Account Manager', 'Sales Manager',
                'Business Development Manager', 'General Manager', 'CEO/Founder', 'COO'
            ]
        },
        {
            category: 'Design & Creative',
            icon: Palette,
            color: 'pink',
            roles: [
                'UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Brand Designer',
                'Motion Designer', 'Creative Director', 'Art Director', 'Illustrator',
                'Content Designer', '3D Artist', 'Video Editor', 'Photographer'
            ]
        },
        {
            category: 'Marketing & Sales',
            icon: TrendingUp,
            color: 'green',
            roles: [
                'Digital Marketing Manager', 'Content Marketing Manager', 'SEO Specialist', 'Social Media Manager',
                'Growth Hacker', 'Marketing Analyst', 'Brand Manager', 'Sales Executive',
                'Account Executive', 'Customer Success Manager', 'Marketing Director', 'CMO'
            ]
        },
        {
            category: 'Data & Analytics',
            icon: Database,
            color: 'cyan',
            roles: [
                'Data Analyst', 'Business Intelligence Analyst', 'Data Engineer', 'Analytics Manager',
                'Quantitative Analyst', 'Research Analyst', 'Market Research Analyst', 'Financial Analyst'
            ]
        },
        {
            category: 'HR & People',
            icon: Users,
            color: 'orange',
            roles: [
                'HR Manager', 'Recruiter', 'Talent Acquisition Specialist', 'HR Business Partner',
                'People Operations Manager', 'Learning & Development Manager', 'Compensation & Benefits Manager', 'HR Director'
            ]
        },
        {
            category: 'Healthcare',
            icon: Heart,
            color: 'red',
            roles: [
                'Healthcare Administrator', 'Medical Coder', 'Clinical Research Coordinator', 'Healthcare Consultant',
                'Public Health Specialist', 'Healthcare Data Analyst', 'Medical Device Sales', 'Pharmaceutical Sales'
            ]
        },
        {
            category: 'Finance & Consulting',
            icon: Shield,
            color: 'indigo',
            roles: [
                'Financial Analyst', 'Investment Banker', 'Management Consultant', 'Strategy Consultant',
                'Accountant', 'Auditor', 'Risk Analyst', 'Compliance Officer'
            ]
        }
    ];

    const difficultyLevels = [
        {
            level: 'Easy',
            description: 'Perfect for beginners and building confidence',
            color: 'green',
            icon: '🌱',
            questions: '5-8 questions',
            duration: '15-20 mins'
        },
        {
            level: 'Medium',
            description: 'Intermediate level for steady improvement',
            color: 'yellow',
            icon: '⚡',
            questions: '8-12 questions',
            duration: '25-35 mins'
        },
        {
            level: 'Hard',
            description: 'Advanced challenges for expert preparation',
            color: 'red',
            icon: '🔥',
            questions: '12-15 questions',
            duration: '40-50 mins'
        }
    ];

    const questionSources = [
        {
            id: 'ai-generated',
            title: 'AI-Generated Questions',
            description: 'Get personalized questions based on your role and skill level',
            icon: Sparkles,
            color: 'purple',
            features: ['Tailored to your role', 'Adaptive difficulty', 'Industry-specific']
        },
        {
            id: 'custom',
            title: 'Your Own Questions',
            description: 'Practice with questions you want to prepare for',
            icon: FileText,
            color: 'blue',
            features: ['Full control', 'Specific preparation', 'Personal focus areas']
        },
        {
            id: 'resume',
            title: 'Resume-Based Questions',
            description: 'Upload your resume and get questions based on your experience',
            icon: Upload,
            color: 'green',
            features: ['Experience-focused', 'Role-relevant', 'Smart analysis']
        }
    ];

    const handleStartPractice = () => {
        // Configure and launch the interview session
        const config = {
            skill: selectedSkill,
            jobRole: selectedJobRole,
            isCustomRole,
            customJobTitle: isCustomRole ? customJobTitle : null,
            customJobDescription: isCustomRole ? customJobDescription : null,
            difficulty: selectedDifficulty,
            questionSource: selectedQuestionSource,
            uploadedFile,
            customQuestions,
            parameters: selectedSkill?.type === 'soft' ? selectedParameters : []
        };
        setInterviewConfig(config);
        setShowInterviewSession(true);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-500/10 border-blue-500/30 text-blue-500 hover:border-blue-500/50',
            purple: 'bg-purple-500/10 border-purple-500/30 text-purple-500 hover:border-purple-500/50',
            pink: 'bg-pink-500/10 border-pink-500/30 text-pink-500 hover:border-pink-500/50',
            green: 'bg-green-500/10 border-green-500/30 text-green-500 hover:border-green-500/50',
            cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500 hover:border-cyan-500/50',
            orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:border-orange-500/50',
            red: 'bg-red-500/10 border-red-500/30 text-red-500 hover:border-red-500/50',
            indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 hover:border-indigo-500/50',
            yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:border-yellow-500/50',
            violet: 'bg-violet-500/10 border-violet-500/30 text-violet-500 hover:border-violet-500/50',
            teal: 'bg-teal-500/10 border-teal-500/30 text-teal-500 hover:border-teal-500/50',
            amber: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:border-amber-500/50',
            slate: 'bg-slate-500/10 border-slate-500/30 text-slate-500 hover:border-slate-500/50',
            rose: 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:border-rose-500/50',
            emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:border-emerald-500/50'
        };
        return colors[color] || colors.blue;
    };

    // If interview session is active, show it instead of the modal
    if (showInterviewSession) {
        return (
            <InterviewSession
                isOpen={showInterviewSession}
                onClose={() => {
                    setShowInterviewSession(false);
                    setInterviewConfig(null);
                    onClose();
                }}
                config={interviewConfig}
            />
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden border border-border"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {selectedSkill?.title} Practice
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Step {step} of 3: {step === 1 ? (selectedSkill?.type === 'soft' ? 'Select Parameters' : 'Select Job Role') : step === 2 ? 'Choose Difficulty' : 'Question Source'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 bg-muted">
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                className="h-full bg-accent"
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Step 1: Job Role Selection OR Parameter Selection */}
                            {step === 1 && (
                                <div className="space-y-8">
                                    {selectedSkill?.type === 'soft' ? (
                                        // Soft Skills Parameter Selection
                                        <>
                                            <div className="text-center mb-8">
                                                <h3 className="text-3xl font-bold mb-2">Select Practice Parameters</h3>
                                                <p className="text-muted-foreground">Choose one or more areas to focus on during your interview</p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {softSkillsParameters.map((param, idx) => {
                                                    const isSelected = selectedParameters.includes(param.id);
                                                    const colorClass = getColorClasses(param.color);

                                                    return (
                                                        <motion.button
                                                            key={param.id}
                                                            onClick={() => toggleParameter(param.id)}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${isSelected
                                                                ? `bg-${param.color}-500/20 border-${param.color}-500`
                                                                : colorClass
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-4 relative z-10">
                                                                <div className={`text-3xl ${isSelected ? 'scale-110' : ''} transition-transform`}>
                                                                    {param.icon}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <h4 className={`font-bold text-lg ${isSelected ? `text-${param.color}-500` : ''}`}>{param.name}</h4>
                                                                        {isSelected && <CheckCircle2 className={`w-5 h-5 text-${param.color}-500 fill-current`} />}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : (
                                        // Technical/Full Interview Job Role Selection
                                        <>
                                            <div className="text-center mb-8">
                                                <h3 className="text-3xl font-bold mb-2">Choose Your Job Role</h3>
                                                <p className="text-muted-foreground">Select the role you're preparing for</p>
                                            </div>

                                            {jobCategories.map((category, idx) => (
                                                <motion.div
                                                    key={category.category}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                                                            <category.icon className="w-5 h-5" />
                                                        </div>
                                                        <h4 className="text-lg font-semibold">{category.category}</h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {category.roles.map((role) => (
                                                            <motion.button
                                                                key={role}
                                                                onClick={() => setSelectedJobRole(role)}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className={`p-3 rounded-xl border-2 transition-all text-left ${selectedJobRole === role
                                                                    ? `${getColorClasses(category.color)} border-opacity-100`
                                                                    : 'border-border hover:border-accent/50'
                                                                    }`}
                                                            >
                                                                <span className="text-sm font-medium">{role}</span>
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {/* Custom Job Role Option */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: jobCategories.length * 0.05 }}
                                                className="mt-8"
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-2 border-violet-500/30">
                                                        <Zap className="w-5 h-5 text-violet-500" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold">Custom Job Role</h4>
                                                </div>

                                                <motion.button
                                                    onClick={() => {
                                                        setIsCustomRole(!isCustomRole);
                                                        if (!isCustomRole) {
                                                            setSelectedJobRole(null);
                                                        }
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${isCustomRole
                                                        ? 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/50'
                                                        : 'border-border hover:border-accent/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-semibold text-violet-500">✨ Create Custom Role</div>
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                Don't see your role? Define it yourself
                                                            </div>
                                                        </div>
                                                        <ChevronRight className={`w-5 h-5 transition-transform ${isCustomRole ? 'rotate-90' : ''}`} />
                                                    </div>
                                                </motion.button>

                                                {/* Custom Role Input Fields */}
                                                <AnimatePresence>
                                                    {isCustomRole && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-4 space-y-4 overflow-hidden"
                                                        >
                                                            <div>
                                                                <label className="block text-sm font-medium mb-2">
                                                                    Job Title <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={customJobTitle}
                                                                    onChange={(e) => {
                                                                        setCustomJobTitle(e.target.value);
                                                                        if (e.target.value.trim()) {
                                                                            setSelectedJobRole(`Custom: ${e.target.value}`);
                                                                        } else {
                                                                            setSelectedJobRole(null);
                                                                        }
                                                                    }}
                                                                    placeholder="e.g., Blockchain Developer, UX Researcher, etc."
                                                                    className="w-full p-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-foreground placeholder:text-muted-foreground"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium mb-2">
                                                                    Job Description <span className="text-muted-foreground text-xs">(Optional)</span>
                                                                </label>
                                                                <textarea
                                                                    value={customJobDescription}
                                                                    onChange={(e) => setCustomJobDescription(e.target.value)}
                                                                    placeholder="Briefly describe the role, key responsibilities, or skills required..."
                                                                    className="w-full h-24 p-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-foreground placeholder:text-muted-foreground"
                                                                />
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    This helps us generate more relevant questions for your role
                                                                </p>
                                                            </div>

                                                            {customJobTitle.trim() && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                            <Sparkles className="w-4 h-4 text-violet-500" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-sm mb-1">Custom Role Created!</div>
                                                                            <div className="text-sm text-muted-foreground">
                                                                                We'll tailor questions specifically for <span className="font-medium text-violet-500">{customJobTitle}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Difficulty Selection */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h3 className="text-3xl font-bold mb-2">Select Difficulty Level</h3>
                                        <p className="text-muted-foreground">Choose based on your preparation stage</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {difficultyLevels.map((diff, idx) => (
                                            <motion.button
                                                key={diff.level}
                                                onClick={() => setSelectedDifficulty(diff.level)}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`p-8 rounded-2xl border-2 transition-all text-left ${selectedDifficulty === diff.level
                                                    ? `${getColorClasses(diff.color)} border-opacity-100 shadow-lg`
                                                    : 'border-border hover:border-accent/50'
                                                    }`}
                                            >
                                                <div className="text-4xl mb-4">{diff.icon}</div>
                                                <h4 className="text-2xl font-bold mb-2">{diff.level}</h4>
                                                <p className="text-sm text-muted-foreground mb-4">{diff.description}</p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        <span>{diff.questions}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        <span>{diff.duration}</span>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Question Source Selection */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h3 className="text-3xl font-bold mb-2">How would you like to practice?</h3>
                                        <p className="text-muted-foreground">Choose your question source</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {questionSources.map((source, idx) => (
                                            <motion.button
                                                key={source.id}
                                                onClick={() => setSelectedQuestionSource(source.id)}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedQuestionSource === source.id
                                                    ? `${getColorClasses(source.color)} border-opacity-100 shadow-lg`
                                                    : 'border-border hover:border-accent/50'
                                                    }`}
                                            >
                                                <source.icon className="w-12 h-12 mb-4" />
                                                <h4 className="text-xl font-bold mb-2">{source.title}</h4>
                                                <p className="text-sm text-muted-foreground mb-4">{source.description}</p>
                                                <div className="space-y-2">
                                                    {source.features.map((feature) => (
                                                        <div key={feature} className="flex items-center gap-2 text-sm">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Custom Questions Input */}
                                    {selectedQuestionSource === 'custom' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6"
                                        >
                                            <label className="block text-sm font-medium mb-2">Enter your questions (one per line)</label>
                                            <textarea
                                                value={customQuestions}
                                                onChange={(e) => setCustomQuestions(e.target.value)}
                                                placeholder="Example:&#10;Tell me about yourself&#10;What are your strengths?&#10;Describe a challenging project"
                                                className="w-full h-40 p-4 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                            />
                                        </motion.div>
                                    )}

                                    {/* Resume Upload */}
                                    {selectedQuestionSource === 'resume' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6"
                                        >
                                            <label className="block text-sm font-medium mb-2">Upload your resume</label>
                                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    id="resume-upload"
                                                />
                                                <label htmlFor="resume-upload" className="cursor-pointer">
                                                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                                    {uploadedFile ? (
                                                        <div>
                                                            <p className="font-semibold text-accent">{uploadedFile.name}</p>
                                                            <p className="text-sm text-muted-foreground mt-1">Click to change</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="font-semibold">Click to upload resume</p>
                                                            <p className="text-sm text-muted-foreground mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border p-6 flex items-center justify-between">
                            <button
                                onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                                className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </button>

                            <button
                                onClick={() => {
                                    if (step === 1) {
                                        if (selectedSkill?.type === 'soft' && selectedParameters.length > 0) setStep(2);
                                        else if (selectedSkill?.type !== 'soft' && selectedJobRole) setStep(2);
                                    }
                                    else if (step === 2 && selectedDifficulty) setStep(3);
                                    else if (step === 3 && selectedQuestionSource) handleStartPractice();
                                }}
                                disabled={
                                    (step === 1 && ((selectedSkill?.type === 'soft' && selectedParameters.length === 0) || (selectedSkill?.type !== 'soft' && !selectedJobRole))) ||
                                    (step === 2 && !selectedDifficulty) ||
                                    (step === 3 && !selectedQuestionSource)
                                }
                                className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-accent/20"
                            >
                                {step === 3 ? 'Start Practice' : 'Continue'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
