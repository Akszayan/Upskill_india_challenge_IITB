import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Lock, Loader, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEscape = (e) => {
                if (e.key === 'Escape') handleClose();
            };
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.body.style.overflow = 'unset';
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen]);

    const handleClose = () => {
        if (!isSubmitting) {
            setError('');
            setFormData({ name: '', email: '', password: '' });
            onClose();
        }
    };

    const validate = () => {
        if (!formData.password) return "Password is required";
        if (isLogin) {
            if (!formData.name && !formData.email) return "Name or Email is required";
        } else {
            if (!formData.name) return "Name is required";
            if (!formData.email) return "Email is required";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');

        const endpoint = isLogin ? 'http://localhost:3000/api/auth/login' : 'http://localhost:3000/api/auth/signup';
        const payload = isLogin
            ? { identifier: formData.email || formData.name, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            console.log('Auth successful:', data);
            onLoginSuccess(data.user);
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
                    >
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-2 text-white">
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-gray-400">
                                    {isLogin ? 'Enter your details to access your account' : 'Get started with your AI interview journey'}
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex p-1 bg-gray-800 rounded-xl mb-6">
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-gray-700 shadow-sm text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-gray-700 shadow-sm text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Login
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1 text-gray-300">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                id="signup-name"
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-gray-500"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-gray-300">
                                        {isLogin ? 'Email or Username' : 'Email Address'}
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={isLogin ? "text" : "email"}
                                            name="email"
                                            id={isLogin ? "login-email" : "signup-email"}
                                            autoComplete={isLogin ? "username" : "email"}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-gray-500"
                                            placeholder={isLogin ? "john@example.com or John" : "john@example.com"}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-gray-300">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            id={isLogin ? "login-password" : "signup-password"}
                                            autoComplete={isLogin ? "current-password" : "new-password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-gray-400"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2"
                                >
                                    {isSubmitting ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? 'Login' : 'Get Started'}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
