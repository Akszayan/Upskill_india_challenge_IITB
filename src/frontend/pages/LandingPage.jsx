import React, { useState } from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Comparison from '../components/Comparison';
import FeatureCard from '../components/FeatureCard';
import HowItWorks from '../components/HowItWorks';
import DemoLightbox from '../components/DemoLightbox';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';
import { Mic, Brain, BarChart3, Zap, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDemoOpen, setIsDemoOpen] = useState(false);
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        // Save user to local storage or context if needed
        localStorage.setItem('user', JSON.stringify(user));
        // Trigger custom event for App.jsx to update state
        window.dispatchEvent(new Event('userLogin'));
        navigate('/dashboard');
    };

    const features = [
        {
            icon: Mic,
            title: 'Voice-First Experience',
            text: 'Practice interviews naturally using your voice. Our advanced speech recognition captures every nuance of your responses.',
            link: '#'
        },
        {
            icon: Brain,
            title: 'AI-Powered Feedback',
            text: 'Get instant, detailed feedback on clarity, confidence, technical accuracy, and emotional tone from our advanced AI engine.',
            link: '#'
        },
        {
            icon: BarChart3,
            title: 'Progress Tracking',
            text: 'Watch your skills improve over time with detailed analytics and personalized improvement recommendations.',
            link: '#'
        },
        {
            icon: Zap,
            title: 'Real-Time Analysis',
            text: 'Receive feedback as you speak. No waiting, no delays. Improve on the spot with instant insights.',
            link: '#'
        },
        {
            icon: Target,
            title: 'Adaptive Questions',
            text: 'Our AI adapts to your skill level and industry, providing relevant questions that challenge you appropriately.',
            link: '#'
        },
        {
            icon: Users,
            title: 'Industry Experts',
            text: 'Questions curated by hiring managers and industry professionals from top companies worldwide.',
            link: '#'
        }
    ];

    return (
        <div className="min-h-screen">
            <Nav onOpenAuthModal={() => setIsAuthModalOpen(true)} />

            <Hero
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onOpenDemo={() => setIsDemoOpen(true)}
            />

            <Comparison />


            {/* Features Section */}
            <section id="features" className="py-24 bg-background relative overflow-hidden">
                {/* Background decoration */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
                />

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Everything You Need to Ace Interviews
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive tools and AI-powered insights to transform your interview performance
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                    >
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} index={index} />
                        ))}
                    </motion.div>
                </div>
            </section>

            <HowItWorks />

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-indigo-ink via-deep-midnight-blue to-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

                {/* Floating orbs */}
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                />

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-6"
                            whileInView={{ scale: [0.95, 1] }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Ready to Transform Your Interview Skills?
                        </motion.h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Join thousands of professionals who have already improved their interview performance with AI-powered practice.
                        </p>
                        <motion.div
                            className="flex flex-wrap justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                onClick={() => setIsAuthModalOpen(true)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all shadow-2xl"
                            >
                                Start Free Trial
                            </motion.button>
                            <motion.button
                                onClick={() => setIsDemoOpen(true)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 border-2 border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Watch Demo
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />

            {/* Modals */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
            <DemoLightbox
                isOpen={isDemoOpen}
                onClose={() => setIsDemoOpen(false)}
            />
        </div>
    );
}
