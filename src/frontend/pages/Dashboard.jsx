import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Home, Target, Video, BarChart3, Settings,
    ChevronDown, User, LogOut, Edit, Calendar, Play, TrendingUp, TrendingDown,
    Shield, Bell, CreditCard, Trash2, Smartphone, Mail, Globe, Moon, ChevronRight,
    Save, Download, History, Key, Eye, EyeOff, ArrowLeft, Check, QrCode
} from 'lucide-react';
import SkillPracticeModal from '../components/SkillPracticeModal';
import VideoLibraryModal from '../components/VideoLibraryModal';
import Analytics from '../components/Analytics';

export default function Dashboard({ user }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
    const [selectedSkillForPractice, setSelectedSkillForPractice] = useState(null);
    const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
    const [videoCategory, setVideoCategory] = useState(null); // 'soft' or 'technical'
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Alex Morgan',
        role: 'Full Stack Developer',
        about: 'Passionate developer building the future of AI. Love to code, design, and innovate.',
        location: 'San Francisco, CA',
        email: user?.email || 'alex.morgan@example.com',
        phone: '+1 (555) 123-4567',
        dob: '1995-06-15',
        age: '28',
        gender: 'Male',
        qualification: 'B.Tech Computer Science'
    });

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: Home, description: 'Your dashboard' },
        { id: 'skills', label: 'Explore Skills', icon: Target, description: 'Discover & practice' },
        { id: 'videos', label: 'Videos & Tutorials', icon: Video, description: 'Learn from experts' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Track your progress' },
        { id: 'settings', label: 'Settings', icon: Settings, description: 'Manage preferences' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    const handleStartPractice = (skillType, skillTitle) => {
        setSelectedSkillForPractice({ title: skillTitle, type: skillType });
        setIsPracticeModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-6">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold">
                        AI
                    </div>
                    <span className="font-bold text-lg hidden sm:block">MockInterview</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-semibold">{user?.name || 'User'}</div>
                            <div className="text-xs text-muted-foreground">{user?.email}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                            {getInitials(user?.name)}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[100] ring-1 ring-black/5"
                                >
                                    <div className="p-4 border-b border-border/50 bg-muted/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {getInitials(user?.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold truncate text-foreground">{user?.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => {
                                                setSelectedSetting('identity');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-accent hover:text-accent-foreground rounded-xl transition-all text-left font-medium"
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="text-sm">View Profile</span>
                                        </button>
                                        <div className="h-px bg-border/50 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-all text-left font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />

                        <motion.div
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 overflow-y-auto"
                        >
                            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold">
                                        AI
                                    </div>
                                    <span className="font-bold text-lg">Menu</span>
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 space-y-2">
                                {menuItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setIsSidebarOpen(false);
                                        }}
                                        whileHover={{ x: 4 }}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeSection === item.id
                                            ? 'bg-accent text-accent-foreground shadow-lg'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        <div className="text-left flex-1">
                                            <div className="font-semibold">{item.label}</div>
                                            <div className={`text-xs ${activeSection === item.id ? 'text-accent-foreground/70' : 'text-muted-foreground'
                                                }`}>
                                                {item.description}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {getInitials(user?.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate">{user?.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="pt-24 px-6 pb-6">
                <div className="container mx-auto max-w-6xl">
                    {activeSection === 'profile' && (
                        <>
                            {/* Hero Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border border-white/10 p-8 text-white shadow-2xl mb-12"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                                        </h1>
                                        <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
                                            Your interview preparation journey is going great. You've improved your communication score by 15% this week!
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleStartPractice('full', 'Full Interview')}
                                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap"
                                    >
                                        <Play className="w-6 h-6 fill-current" />
                                        Start New Interview
                                    </button>
                                </div>
                            </motion.div>

                            {/* Stats Grid */}
                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                {[
                                    { label: 'Interviews Completed', value: '12', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                                    { label: 'Average Score', value: '85%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                                    { label: 'Practice Time', value: '4h 30m', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`bg-card/50 backdrop-blur-sm border ${stat.border} rounded-3xl p-6 flex items-center gap-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group`}
                                    >
                                        <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold mb-1">{stat.value}</div>
                                            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Activity - Full Width */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                                    <button className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
                                        View All History
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                            className="bg-card border border-border rounded-2xl p-6 hover:border-blue-500/30 hover:bg-accent/5 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-2xl">
                                                    {i === 0 ? '🚀' : i === 1 ? '💡' : '🎯'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold mb-1 group-hover:text-blue-500 transition-colors">Product Manager Interview</h3>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                        <span>Yesterday</span>
                                                        <span>•</span>
                                                        <span>15 mins</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex gap-2">
                                                    {['Leadership', 'Strategy'].map(tag => (
                                                        <span key={tag} className="px-3 py-1 rounded-lg bg-muted font-medium text-xs text-muted-foreground">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-600 font-bold">
                                                    88/100
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'skills' && (
                        <div>
                            <header className="mb-12">
                                <h1 className="text-4xl font-bold mb-3">Explore Skills</h1>
                                <p className="text-muted-foreground text-lg">Choose your practice mode and start improving your interview performance</p>
                            </header>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Soft Skills Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16" />

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3 text-blue-500">Soft Skills</h3>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            Master the art of communication, confidence, and presentation. Focus on HOW you deliver your answers.
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span>Communication clarity</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span>Confidence & anxiety management</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span>Tone, pace & filler elimination</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span>Body language & presence</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-6 text-sm">
                                            <span className="text-muted-foreground">Difficulty</span>
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <div className="w-2 h-2 rounded-full bg-gray-600" />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleStartPractice('soft', 'Soft Skills')}
                                            className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Start Practice
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Technical Skills Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16" />

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3 text-purple-500">Technical Skills</h3>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            Demonstrate your knowledge and expertise. Focus on WHAT you know and the accuracy of your content.
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                <span>Domain-specific knowledge</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                <span>Technical accuracy & depth</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                <span>Problem-solving approaches</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                <span>Industry best practices</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-6 text-sm">
                                            <span className="text-muted-foreground">Difficulty</span>
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleStartPractice('technical', 'Technical Skills')}
                                            className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Start Practice
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Full Interview Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-8 hover:border-green-500/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-16 -mt-16" />

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3 text-green-500">Full Interview</h3>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            Complete simulation combining both soft and technical skills. The ultimate interview preparation.
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span>Holistic evaluation</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span>Real interview simulation</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span>STAR method application</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span>Complete performance metrics</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-6 text-sm">
                                            <span className="text-muted-foreground">Difficulty</span>
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleStartPractice('full', 'Full Interview')}
                                            className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Start Practice
                                        </button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-16 grid md:grid-cols-3 gap-6">
                                <div className="bg-card border border-border rounded-xl p-6 text-center">
                                    <div className="text-4xl font-bold text-blue-500 mb-2">15+</div>
                                    <div className="text-sm text-muted-foreground">Soft Skill Metrics</div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-6 text-center">
                                    <div className="text-4xl font-bold text-purple-500 mb-2">50+</div>
                                    <div className="text-sm text-muted-foreground">Technical Topics</div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-6 text-center">
                                    <div className="text-4xl font-bold text-green-500 mb-2">100+</div>
                                    <div className="text-sm text-muted-foreground">Practice Questions</div>
                                </div>
                            </div>

                            {/* Learning Path Suggestion */}
                            <div className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-4">📚 Recommended Learning Path</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                                        <div>
                                            <div className="font-semibold mb-1">Start with Soft Skills</div>
                                            <div className="text-sm text-muted-foreground">Build confidence and communication foundation</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                                        <div>
                                            <div className="font-semibold mb-1">Practice Technical Skills</div>
                                            <div className="text-sm text-muted-foreground">Master domain knowledge and expertise</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                                        <div>
                                            <div className="font-semibold mb-1">Take Full Interviews</div>
                                            <div className="text-sm text-muted-foreground">Combine everything for realistic preparation</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'videos' && (
                        <div>
                            <header className="mb-12">
                                <h1 className="text-4xl font-bold mb-3">Videos & Tutorials</h1>
                                <p className="text-muted-foreground text-lg">Learn from expert tutorials and improve your interview skills</p>
                            </header>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Soft Skills Videos */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20" />

                                    <div className="relative z-10">
                                        <div className="w-20 h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>

                                        <h2 className="text-3xl font-bold mb-4 text-blue-500">Soft Skills</h2>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            Master communication, body language, confidence, and presentation skills through expert-led video tutorials.
                                        </p>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <span>Communication & Articulation</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <span>Body Language & Presence</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <span>Confidence Building</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <span>Handling Nervousness</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-6 p-4 bg-blue-500/10 rounded-xl">
                                            <div>
                                                <div className="text-2xl font-bold text-blue-500">12+</div>
                                                <div className="text-xs text-muted-foreground">Video Tutorials</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-blue-500">2.5h</div>
                                                <div className="text-xs text-muted-foreground">Total Duration</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setVideoCategory('soft');
                                                setIsVideoLibraryOpen(true);
                                            }}
                                            className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                            Explore Soft Skills Videos
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Technical Skills Videos */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20" />

                                    <div className="relative z-10">
                                        <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>

                                        <h2 className="text-3xl font-bold mb-4 text-purple-500">Technical Skills</h2>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            Learn how to answer technical questions, explain concepts clearly, and demonstrate your expertise effectively.
                                        </p>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-purple-500" />
                                                </div>
                                                <span>Technical Question Strategies</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-purple-500" />
                                                </div>
                                                <span>Problem-Solving Approaches</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-purple-500" />
                                                </div>
                                                <span>Explaining Complex Concepts</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Video className="w-4 h-4 text-purple-500" />
                                                </div>
                                                <span>Industry Best Practices</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-6 p-4 bg-purple-500/10 rounded-xl">
                                            <div>
                                                <div className="text-2xl font-bold text-purple-500">18+</div>
                                                <div className="text-xs text-muted-foreground">Video Tutorials</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-purple-500">3.5h</div>
                                                <div className="text-xs text-muted-foreground">Total Duration</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setVideoCategory('technical');
                                                setIsVideoLibraryOpen(true);
                                            }}
                                            className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                            Explore Technical Videos
                                        </button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-16 grid md:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-card border border-border rounded-xl p-6 text-center"
                                >
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">30+</div>
                                    <div className="text-sm text-muted-foreground">Total Videos</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-card border border-border rounded-xl p-6 text-center"
                                >
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">6h+</div>
                                    <div className="text-sm text-muted-foreground">Content Duration</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-card border border-border rounded-xl p-6 text-center"
                                >
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">15+</div>
                                    <div className="text-sm text-muted-foreground">Expert Instructors</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-card border border-border rounded-xl p-6 text-center"
                                >
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">4.8★</div>
                                    <div className="text-sm text-muted-foreground">Average Rating</div>
                                </motion.div>
                            </div>

                            {/* Featured Section */}
                            <div className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold">Featured This Week</h3>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-background/50 rounded-xl p-6 border border-border">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                <Play className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-2">Mastering the STAR Method</h4>
                                                <p className="text-sm text-muted-foreground mb-3">Learn how to structure your behavioral interview answers effectively</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>🕐 25 mins</span>
                                                    <span>👤 Sarah Johnson</span>
                                                    <span>⭐ 4.9</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-background/50 rounded-xl p-6 border border-border">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <Play className="w-8 h-8 text-purple-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-2">System Design Fundamentals</h4>
                                                <p className="text-sm text-muted-foreground mb-3">Approach system design questions with confidence and clarity</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>🕐 45 mins</span>
                                                    <span>👤 Michael Chen</span>
                                                    <span>⭐ 4.8</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'analytics' && (
                        <Analytics
                            onStartPractice={handleStartPractice}
                            onViewVideos={(category) => {
                                setActiveSection('videos');
                                if (category) setVideoCategory(category);
                            }}
                        />
                    )}

                    {activeSection === 'settings' && (
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                        Identity Control Center
                                    </h2>
                                    <p className="text-muted-foreground mt-1">Manage your digital presence and security protocols.</p>
                                </div>
                                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Secure Environment
                                </div>
                            </div>

                            {/* Bento Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* 1. Identity Card (Main Profile) - Spans 2 Columns */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setSelectedSetting('identity')}
                                    className="md:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 group cursor-pointer hover:border-blue-500/30 transition-all"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl shadow-blue-500/20">
                                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-lg">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-3xl font-bold text-white">Alex Morgan</h3>
                                                <p className="text-blue-400 font-medium">Full Stack Developer</p>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-sm text-white/80">
                                                    <Mail className="w-4 h-4 text-white/50" /> alex.morgan@example.com
                                                </div>
                                                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-sm text-white/80">
                                                    <Globe className="w-4 h-4 text-white/50" /> San Francisco, CA
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 2. Security Shield */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col justify-between group hover:border-green-500/30 transition-colors"
                                >
                                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 mb-4">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">Security Shield</h3>
                                        <p className="text-sm text-white/50">2FA & Password Protection</p>
                                    </div>
                                    <div className="relative z-10 mt-6">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 mb-3">
                                            <span className="text-sm font-medium">2-Factor Auth</span>
                                            <div className="w-10 h-6 rounded-full bg-green-500/20 border border-green-500/50 relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-3.5 h-3.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                                            </div>
                                        </div>
                                        <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition-colors">
                                            Change Password
                                        </button>
                                    </div>
                                </motion.div>

                                {/* 3. Preferences Panel */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col justify-between group hover:border-purple-500/30 transition-colors"
                                >
                                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">Preferences</h3>
                                        <p className="text-sm text-white/50">Customize your experience</p>
                                    </div>
                                    <div className="relative z-10 mt-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Bell className="w-4 h-4 text-white/50" /> Notifications
                                            </div>
                                            <div className="w-8 h-4 rounded-full bg-white/10 relative cursor-pointer">
                                                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white/50" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Moon className="w-4 h-4 text-white/50" /> Dark Mode
                                            </div>
                                            <div className="w-8 h-4 rounded-full bg-purple-500/20 border border-purple-500/50 relative cursor-pointer">
                                                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 4. Billing Nexus */}
                                {/* 4. Logout Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={handleLogout}
                                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-900/20 to-red-800/20 p-6 flex flex-col justify-between group hover:bg-red-900/30 hover:border-red-500/30 transition-all cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Logout</h3>
                                            <p className="text-xs text-white/50 group-hover:text-red-200/70 transition-colors">End current session</p>
                                        </div>
                                        <LogOut className="w-6 h-6 text-white/30 group-hover:text-red-400 transition-colors" />
                                    </div>
                                    <div className="relative z-10 mt-8 flex justify-end">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 5. Danger Zone */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="relative overflow-hidden rounded-3xl border border-red-500/10 bg-red-500/5 p-6 flex flex-col justify-center items-center text-center group hover:bg-red-500/10 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 transition-transform">
                                        <Trash2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h3>
                                    <p className="text-xs text-red-400/60 mb-4">Irreversible actions</p>
                                    <button className="px-4 py-2 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                                        Delete Account
                                    </button>
                                </motion.div>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Skill Practice Modal */}
            <SkillPracticeModal
                isOpen={isPracticeModalOpen}
                onClose={() => setIsPracticeModalOpen(false)}
                selectedSkill={selectedSkillForPractice}
            />

            {/* Video Library Modal */}
            <VideoLibraryModal
                isOpen={isVideoLibraryOpen}
                onClose={() => setIsVideoLibraryOpen(false)}
                category={videoCategory}
            />

            {/* Settings Modal */}
            <AnimatePresence>
                {selectedSetting && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSetting(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`fixed ${selectedSetting === 'identity' ? 'inset-0 w-full h-full rounded-none' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-3xl'} bg-[#0f1115] border border-white/10 shadow-2xl z-50 overflow-hidden max-h-[100vh] flex flex-col`}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    {selectedSetting === 'identity' && (
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setSelectedSetting(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                                <ArrowLeft className="w-6 h-6" />
                                            </button>
                                            <span className="text-2xl">Edit Profile</span>
                                        </div>
                                    )}
                                    {selectedSetting === 'security' && <><Shield className="w-5 h-5 text-green-400" /> Security Center</>}
                                    {selectedSetting === 'preferences' && <><Settings className="w-5 h-5 text-purple-400" /> Preferences</>}
                                    {selectedSetting === 'billing' && <><CreditCard className="w-5 h-5 text-indigo-400" /> Billing & Plans</>}
                                    {selectedSetting === 'danger' && <><Trash2 className="w-5 h-5 text-red-400" /> Danger Zone</>}
                                </h3>
                                {selectedSetting !== 'identity' && (
                                    <button onClick={() => setSelectedSetting(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="max-w-5xl mx-auto space-y-8 py-8">
                                    {/* Header Section with Avatar */}
                                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-blue-500 transition-colors shadow-2xl">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                <Edit className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-center md:text-left space-y-2">
                                            <h2 className="text-3xl font-bold">{profileData.name}</h2>
                                            <p className="text-blue-400 text-lg">{profileData.role}</p>
                                            <p className="text-muted-foreground max-w-xl">{profileData.about}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Personal Details */}
                                        <div className="space-y-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                                            <h4 className="text-xl font-bold flex items-center gap-3 text-blue-400">
                                                <User className="w-5 h-5" /> Personal Details
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={profileData.dob}
                                                            onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors [color-scheme:dark]"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Age</label>
                                                        <input
                                                            type="number"
                                                            value={profileData.age}
                                                            onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase text-muted-foreground">Gender</label>
                                                    <select
                                                        value={profileData.gender}
                                                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                                                    >
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Non-binary</option>
                                                        <option>Prefer not to say</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase text-muted-foreground">About Me</label>
                                                    <textarea
                                                        rows={4}
                                                        value={profileData.about}
                                                        onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional & Contact */}
                                        <div className="space-y-8">
                                            {/* Professional */}
                                            <div className="space-y-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                                                <h4 className="text-xl font-bold flex items-center gap-3 text-purple-400">
                                                    <Target className="w-5 h-5" /> Professional Info
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Job Role / Title</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.role}
                                                            onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Qualification</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.qualification}
                                                            onChange={(e) => setProfileData({ ...profileData, qualification: e.target.value })}
                                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact */}
                                            <div className="space-y-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                                                <h4 className="text-xl font-bold flex items-center gap-3 text-green-400">
                                                    <Mail className="w-5 h-5" /> Contact Details
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                                            <input
                                                                type="email"
                                                                value={profileData.email}
                                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500/50 transition-colors"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Phone Number</label>
                                                        <div className="relative">
                                                            <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                                            <input
                                                                type="tel"
                                                                value={profileData.phone}
                                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500/50 transition-colors"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedSetting === 'security' && (
                                    <div className="space-y-6">
                                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-4">
                                            <Shield className="w-6 h-6 text-green-500 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-green-400">Account is Secure</h4>
                                                <p className="text-sm text-green-400/70 mt-1">No suspicious activity detected in the last 30 days.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase text-muted-foreground">Password & Auth</h4>
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-muted-foreground">Current Password</label>
                                                    <div className="relative">
                                                        <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                        <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-green-500/50 transition-colors" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-muted-foreground">New Password</label>
                                                    <div className="relative">
                                                        <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                        <input type="password" placeholder="Enter new password" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-green-500/50 transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase text-muted-foreground">Active Sessions</h4>
                                            {[
                                                { device: 'MacBook Pro', loc: 'San Francisco, US', time: 'Current Session', icon: Globe },
                                                { device: 'iPhone 14 Pro', loc: 'San Francisco, US', time: '2 hours ago', icon: Smartphone },
                                            ].map((session, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <session.icon className="w-5 h-5 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{session.device}</div>
                                                            <div className="text-xs text-muted-foreground">{session.loc} • {session.time}</div>
                                                        </div>
                                                    </div>
                                                    {i !== 0 && <button className="text-xs text-red-400 hover:underline">Revoke</button>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSetting === 'preferences' && (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase text-muted-foreground">Notifications</h4>
                                            {[
                                                { label: 'Email Notifications', desc: 'Receive daily summaries and alerts', active: true },
                                                { label: 'Push Notifications', desc: 'Real-time updates on your device', active: true },
                                                { label: 'Marketing Emails', desc: 'Product updates and offers', active: false },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                                    <div>
                                                        <div className="font-bold">{item.label}</div>
                                                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                                                    </div>
                                                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${item.active ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-white/10 border border-white/20'}`}>
                                                        <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${item.active ? 'right-1 bg-purple-500 shadow-lg shadow-purple-500/50' : 'left-1 bg-white/30'}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase text-muted-foreground">Appearance</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                {['Light', 'Dark', 'System'].map((theme) => (
                                                    <button key={theme} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'Dark' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                        {theme === 'Light' && <div className="w-6 h-6 rounded-full bg-white" />}
                                                        {theme === 'Dark' && <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/20" />}
                                                        {theme === 'System' && <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white to-slate-900" />}
                                                        <span className="text-xs font-bold">{theme}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedSetting === 'billing' && (
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border border-indigo-500/20 text-center">
                                            <div className="text-sm text-indigo-200 uppercase tracking-widest font-bold mb-2">Current Plan</div>
                                            <div className="text-4xl font-black text-white mb-2">Pro Plan</div>
                                            <div className="text-indigo-200/70 mb-6">$29/month • Billed Annually</div>
                                            <button className="px-6 py-2 rounded-xl bg-white text-indigo-900 font-bold hover:scale-105 transition-transform">
                                                Manage Subscription
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold uppercase text-muted-foreground">Payment Method</h4>
                                                <button className="text-xs text-blue-400 hover:underline">Update</button>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-mono text-sm">•••• •••• •••• 4242</div>
                                                    <div className="text-xs text-muted-foreground">Expires 12/25</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase text-muted-foreground">Billing History</h4>
                                            {[
                                                { date: 'Nov 01, 2023', amount: '$29.00', status: 'Paid' },
                                                { date: 'Oct 01, 2023', amount: '$29.00', status: 'Paid' },
                                                { date: 'Sep 01, 2023', amount: '$29.00', status: 'Paid' },
                                            ].map((invoice, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-white transition-colors">
                                                            <History className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-sm font-medium">{invoice.date}</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-bold">{invoice.amount}</span>
                                                        <div className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">
                                                            {invoice.status}
                                                        </div>
                                                        <Download className="w-4 h-4 text-muted-foreground hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSetting === 'danger' && (
                                    <div className="space-y-6 text-center py-8">
                                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                            <Trash2 className="w-10 h-10 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-red-500">Delete Account</h4>
                                            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                                This action is irreversible. All your data, including interview history and analytics, will be permanently removed.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 max-w-sm mx-auto text-left space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                <p className="text-xs text-red-400/80">I understand that this action cannot be undone.</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                <p className="text-xs text-red-400/80">I understand that I will lose access to all my services.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 justify-center mt-4">
                                            <button
                                                onClick={() => setSelectedSetting(null)}
                                                className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/20">
                                                Confirm Deletion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer (Actions) */}
                            {selectedSetting !== 'danger' && selectedSetting !== 'billing' && (
                                <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end gap-3">
                                    <button
                                        onClick={() => setSelectedSetting(null)}
                                        className="px-6 py-2 rounded-xl bg-transparent hover:bg-white/5 text-muted-foreground hover:text-white font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setSelectedSetting(null)}
                                        className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
                                    >
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
