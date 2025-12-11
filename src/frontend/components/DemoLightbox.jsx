import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

export default function DemoLightbox({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            const handleEscape = (e) => {
                if (e.key === 'Escape') onClose();
            };
            document.addEventListener('keydown', handleEscape);

            return () => {
                document.body.style.overflow = 'unset';
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-background rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            aria-label="Close demo"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Video Container */}
                        <div className="relative aspect-video bg-black">
                            <video
                                autoPlay
                                controls
                                className="w-full h-full"
                                poster="/demo-poster.jpg"
                            >
                                <source src="/video/demo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Placeholder if video not available */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-ink to-deep-midnight-blue">
                                <div className="text-center text-white p-8">
                                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-2xl font-bold mb-2">Demo Video</h3>
                                    <p className="text-gray-300">
                                        Place your demo video at <code className="bg-black/30 px-2 py-1 rounded">/public/video/demo.mp4</code>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-6 border-t border-border">
                            <h3 className="text-xl font-bold mb-2">See AI Mock Interview in Action</h3>
                            <p className="text-muted-foreground">
                                Watch how our platform helps you practice interviews, get real-time feedback, and improve your performance.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
