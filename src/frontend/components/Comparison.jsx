import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';

export default function Comparison() {
    return (
        <section className="py-24 bg-muted/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose AI Mock Interview?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See the difference between traditional preparation and our AI-powered approach.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
                    {/* VS Badge */}
                    {/* VS Badge */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="w-16 h-16 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-background"
                        >
                            VS
                        </motion.div>
                    </div>

                    {/* Traditional Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-background/50 backdrop-blur-sm border border-border rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
                        <h3 className="text-2xl font-bold mb-6 text-muted-foreground">Traditional Way</h3>
                        <ul className="space-y-4">
                            {[
                                "Relies on friends for feedback",
                                "Generic, outdated questions",
                                "No objective scoring",
                                "Hard to schedule practice time",
                                "Limited feedback on body language"
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    className="flex items-start gap-3 text-muted-foreground"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* AI Solution Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-500" />

                        {/* Animated glow */}
                        <motion.div
                            animate={{ opacity: [0, 0.1, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-accent/20 blur-3xl"
                        />

                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                            AI Mock Interview
                        </h3>
                        <ul className="space-y-4 relative z-10">
                            {[
                                "Instant, unbiased AI feedback",
                                "Tailored questions for your role",
                                "Detailed scoring on 10+ metrics",
                                "Practice 24/7, anywhere",
                                "Real-time voice & tone analysis"
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    className="flex items-start gap-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                >
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.button
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 flex items-center gap-2 text-accent font-semibold group"
                        >
                            Start Practicing Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Stat Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center"
                >
                    <p className="text-lg md:text-xl">
                        <span className="font-bold text-red-500">Did you know?</span> 80% of candidates fail interviews not because of lack of knowledge, but due to <span className="underline decoration-red-500/30">poor communication and anxiety</span>.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
