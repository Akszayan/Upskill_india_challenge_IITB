import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, TrendingUp, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Hero({ onOpenAuthModal, onOpenDemo }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: 'easeOut' },
        },
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.5,
                ease: 'easeOut',
            },
        }),
    };

    const headline = "Never fear an interview again.";

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-ink via-deep-midnight-blue to-black" />

                {/* Animated orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.25, 0.45, 0.25],
                        x: [0, 50, 0],
                        y: [0, -80, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-500/25 rounded-full blur-3xl"
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-white"
                    >
                        {/* Headline with Letter Stagger */}
                        <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight flex flex-wrap gap-x-4">
                            {headline.split(' ').map((word, wordIndex) => (
                                <span key={wordIndex} className="inline-block whitespace-nowrap">
                                    {word.split('').map((char, charIndex) => (
                                        <motion.span
                                            key={`${wordIndex}-${charIndex}`}
                                            custom={wordIndex * 10 + charIndex}
                                            variants={letterVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="inline-block"
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed"
                        >
                            Real-time voice interviews, instant feedback, and a growth plan tailored to you.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
                            <button
                                onClick={onOpenAuthModal}
                                className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                            >
                                Get Started
                                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </button>
                            <button
                                onClick={onOpenDemo}
                                className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                See Demo
                            </button>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div variants={itemVariants} className="flex items-center gap-6 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <span>Used by 10,000+ students</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Animated Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="hidden lg:flex justify-center items-center"
                    >
                        <div className="relative w-full max-w-md">
                            {/* Glow effect behind card */}
                            <motion.div
                                animate={{
                                    opacity: [0.4, 0.7, 0.4],
                                    scale: [0.95, 1.05, 0.95],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-3xl blur-2xl"
                            />

                            {/* Main Dashboard Card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
                            >
                                {/* Animated gradient overlay */}
                                <motion.div
                                    animate={{
                                        background: [
                                            'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                                            'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
                                            'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
                                        ]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="absolute inset-0 rounded-3xl"
                                />

                                {/* Shimmer effect */}
                                <motion.div
                                    animate={{
                                        x: ['-100%', '200%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                />

                                <div className="space-y-6 relative z-10">
                                    {/* Live Recording Indicator */}
                                    <motion.div
                                        className="bg-black/30 rounded-xl p-4 border border-white/10 relative overflow-hidden"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        {/* Pulse ring effect */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.5],
                                                opacity: [0.5, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                            }}
                                            className="absolute top-4 left-4 w-3 h-3 rounded-full bg-red-500"
                                        />

                                        <div className="flex items-center gap-3 mb-4">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
                                            />
                                            <span className="text-white text-sm font-medium">Live Interview</span>
                                            <motion.span
                                                className="ml-auto text-blue-400 text-xs font-mono"
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                02:34
                                            </motion.span>
                                        </div>

                                        {/* Voice waveform animation */}
                                        <div className="flex items-end gap-1 h-12">
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{
                                                        height: ['20%', `${Math.random() * 80 + 20}%`, '20%']
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        repeat: Infinity,
                                                        delay: i * 0.05,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full shadow-lg shadow-blue-500/30"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* AI Analysis Scores */}
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30 relative overflow-hidden"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 }}
                                    >
                                        {/* Animated border glow */}
                                        <motion.div
                                            animate={{
                                                opacity: [0.3, 0.6, 0.3],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                            }}
                                            className="absolute inset-0 rounded-xl border-2 border-blue-400/50"
                                        />

                                        <p className="text-white text-sm font-medium mb-3 flex items-center gap-2 relative z-10">
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </motion.div>
                                            AI Analysis
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 relative z-10">
                                            {[
                                                { label: 'Clarity', value: 92, color: 'text-green-400', shadowColor: 'shadow-green-400/50' },
                                                { label: 'Confidence', value: 88, color: 'text-blue-400', shadowColor: 'shadow-blue-400/50' },
                                                { label: 'Pace', value: 85, color: 'text-purple-400', shadowColor: 'shadow-purple-400/50' }
                                            ].map((metric, i) => (
                                                <motion.div
                                                    key={metric.label}
                                                    className={`bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm shadow-lg ${metric.shadowColor}`}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                                                    whileHover={{ scale: 1.1, y: -5 }}
                                                >
                                                    <motion.div
                                                        className={`text-2xl font-bold ${metric.color}`}
                                                        animate={{
                                                            scale: [1, 1.1, 1]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            delay: i * 0.3
                                                        }}
                                                    >
                                                        {metric.value}
                                                    </motion.div>
                                                    <div className="text-xs text-gray-300 mt-1">{metric.label}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Real-time Feedback */}
                                    <motion.div
                                        className="bg-black/20 rounded-lg p-3 border border-white/10 relative overflow-hidden"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                    >
                                        {/* Typing indicator animation */}
                                        <motion.div
                                            animate={{
                                                scaleX: [0, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                            }}
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 origin-left"
                                        />

                                        <div className="flex items-start gap-2 relative z-10">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="flex-shrink-0"
                                            >
                                                <Brain className="w-4 h-4 text-purple-400 mt-0.5" />
                                            </motion.div>
                                            <motion.p
                                                className="text-xs text-gray-300 leading-relaxed"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1.8 }}
                                            >
                                                Great answer! Try adding specific examples to strengthen your response.
                                            </motion.p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Floating particles with glow */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        background: `radial-gradient(circle, ${['rgba(59, 130, 246, 0.6)', 'rgba(147, 51, 234, 0.6)', 'rgba(34, 211, 238, 0.6)'][i % 3]
                                            }, transparent)`,
                                        boxShadow: `0 0 10px ${['rgba(59, 130, 246, 0.8)', 'rgba(147, 51, 234, 0.8)', 'rgba(34, 211, 238, 0.8)'][i % 3]
                                            }`,
                                    }}
                                    animate={{
                                        y: [0, -40, 0],
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2 cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
