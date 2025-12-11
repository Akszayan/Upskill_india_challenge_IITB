import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Mail, href: '#', label: 'Email' }
    ];

    return (
        <footer className="bg-muted/30 border-t border-border py-12 relative overflow-hidden">
            {/* Subtle background animation */}
            <motion.div
                animate={{
                    opacity: [0.03, 0.08, 0.03],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10"
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <motion.div
                                className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue-start to-accent-blue-end flex items-center justify-center text-white text-sm font-bold"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                            >
                                AI
                            </motion.div>
                            <span className="font-bold text-lg">MockInterview</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Practice makes perfect. AI makes it faster.
                        </p>
                    </motion.div>

                    {/* Product */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a href="#tech" className="hover:text-foreground transition-colors">Technology</a>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* Company */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a href="#about" className="hover:text-foreground transition-colors">About</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a href="#team" className="hover:text-foreground transition-colors">Team</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a href="#careers" className="hover:text-foreground transition-colors">Careers</a>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* Connect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="p-2 bg-muted hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <p>&copy; 2024 AI Mock Interview. All rights reserved.</p>
                    <div className="flex gap-6">
                        <motion.a
                            href="#"
                            className="hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            Privacy Policy
                        </motion.a>
                        <motion.a
                            href="#"
                            className="hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            Terms of Service
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
