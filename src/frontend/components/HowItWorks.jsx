import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, FileText, Brain, TrendingUp, X } from 'lucide-react';

const steps = [
    {
        id: 1,
        icon: Mic,
        title: 'Speak',
        description: 'Answer interview questions naturally using your voice',
        detail: 'Our advanced speech recognition captures every word with high accuracy. Just speak naturally as you would in a real interview.',
        mockData: { status: 'Recording...', duration: '00:45' }
    },
    {
        id: 2,
        icon: FileText,
        title: 'Transcribe',
        description: 'AI converts your speech to text in real-time',
        detail: 'Powered by state-of-the-art ASR technology, we transcribe your answers with 95%+ accuracy in real-time.',
        mockData: { transcript: 'I have 3 years of experience in full-stack development, specializing in React and Node.js...' }
    },
    {
        id: 3,
        icon: Brain,
        title: 'Analyze',
        description: 'Get instant feedback on clarity, confidence, and content',
        detail: 'Our AI evaluates multiple dimensions: technical accuracy, communication clarity, confidence levels, and emotional tone.',
        mockData: { clarity: 92, confidence: 88, correctness: 85, emotion: 'Confident' }
    },
    {
        id: 4,
        icon: TrendingUp,
        title: 'Improve',
        description: 'Receive personalized tips to ace your next interview',
        detail: 'Get actionable feedback and track your progress over time. See exactly where to improve and watch your scores grow.',
        mockData: { improvement: '+12% from last session', tip: 'Try to reduce filler words like "um" and "uh"' }
    }
];

export default function HowItWorks() {
    const [selectedStep, setSelectedStep] = useState(null);

    return (
        <section id="tech" className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
            />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-4"
                        whileInView={{ scale: [0.9, 1] }}
                        viewport={{ once: true }}
                    >
                        How It Works
                    </motion.h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Four simple steps to transform your interview skills
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative">
                    {/* Animated connecting line */}
                    <motion.div
                        className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            onClick={() => setSelectedStep(step)}
                            className="relative cursor-pointer group"
                        >
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full hover:shadow-2xl transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                                {/* Hover gradient effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={false}
                                />

                                {/* Inner Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

                                {/* Animated Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:text-white transition-colors relative"
                                >
                                    <motion.div
                                        animate={{
                                            boxShadow: [
                                                '0 0 0 0 rgba(59, 130, 246, 0)',
                                                '0 0 0 10px rgba(59, 130, 246, 0)',
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-xl"
                                    />
                                    <step.icon className="w-8 h-8 relative z-10" />
                                </motion.div>

                                <h3 className="text-xl font-bold mb-2 relative z-10 text-white group-hover:text-blue-200 transition-colors">{step.title}</h3>
                                <p className="text-sm text-gray-400 relative z-10 group-hover:text-gray-300 transition-colors">{step.description}</p>

                                <motion.div
                                    className="mt-4 text-xs font-semibold text-blue-400 group-hover:text-blue-300 group-hover:underline relative z-10 flex items-center gap-1"
                                    whileHover={{ x: 5 }}
                                >
                                    Click to learn more
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        →
                                    </motion.span>
                                </motion.div>
                            </div>

                            {/* Step Number with bounce animation - Moved outside to prevent clipping */}
                            <motion.div
                                className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-lg z-20"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {step.id}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Detail Panel */}
                <AnimatePresence>
                    {selectedStep && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-background border border-border rounded-2xl p-8 shadow-xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                            <selectedStep.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">{selectedStep.title}</h3>
                                            <p className="text-muted-foreground">{selectedStep.detail}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStep(null)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Mock Data Display */}
                                <div className="bg-muted/50 rounded-xl p-6 font-mono text-sm">
                                    <pre className="text-foreground overflow-x-auto">
                                        {JSON.stringify(selectedStep.mockData, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
