import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FeatureCard({ icon: Icon, title, text, link, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
        >
            <div className="relative h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10" />

                {/* Inner Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

                {/* Icon */}
                <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:text-white transition-colors"
                >
                    <Icon className="w-7 h-7" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">{title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors">{text}</p>

                {/* Learn More Link */}
                {link && (
                    <a
                        href={link}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:gap-3 transition-all duration-300"
                    >
                        Learn more
                        <ChevronRight className="w-4 h-4" />
                    </a>
                )}
            </div>
        </motion.div>
    );
}
