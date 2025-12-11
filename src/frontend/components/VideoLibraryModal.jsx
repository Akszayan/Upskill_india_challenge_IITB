import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Play, ExternalLink, Zap, Bot, Send, Loader2 } from 'lucide-react';
import { softSkillsParameters, technicalRoles } from '../data/videoData';

export default function VideoLibraryModal({ isOpen, onClose, category }) {
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [customRole, setCustomRole] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedParameter(null);
            setCustomRole('');
            setIsChatOpen(false);
            setChatMessages([]);
            setChatInput('');
        }
    }, [isOpen]);

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-500/10 border-blue-500/30 text-blue-500 hover:border-blue-500/50',
            purple: 'bg-purple-500/10 border-purple-500/30 text-purple-500 hover:border-purple-500/50',
            red: 'bg-red-500/10 border-red-500/30 text-red-500 hover:border-red-500/50',
            green: 'bg-green-500/10 border-green-500/30 text-green-500 hover:border-green-500/50',
            indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 hover:border-indigo-500/50',
            yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:border-yellow-500/50',
            cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500 hover:border-cyan-500/50',
            orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:border-orange-500/50',
            pink: 'bg-pink-500/10 border-pink-500/30 text-pink-500 hover:border-pink-500/50',
            violet: 'bg-violet-500/10 border-violet-500/30 text-violet-500 hover:border-violet-500/50',
            teal: 'bg-teal-500/10 border-teal-500/30 text-teal-500 hover:border-teal-500/50',
            amber: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:border-amber-500/50',
            slate: 'bg-slate-500/10 border-slate-500/30 text-slate-500 hover:border-slate-500/50',
            rose: 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:border-rose-500/50',
            emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:border-emerald-500/50'
        };
        return colors[color] || colors.blue;
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: chatInput,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, userMessage]);
        const messageToSend = chatInput;
        setChatInput('');
        setIsLoading(true);

        try {
            // Get current skill name for context
            const currentSkill = category === 'soft'
                ? softSkillsParameters.find(p => p.id === selectedParameter)?.name
                : technicalRoles.find(r => r.id === selectedParameter)?.name;

            // Build conversation history for context
            const conversationHistory = chatMessages.slice(-6).map(m =>
                `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`
            );

            const response = await fetch('http://localhost:3000/api/video-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageToSend,
                    skillType: category === 'soft' ? 'soft' : 'technical',
                    videoTitle: currentSkill || '',
                    conversationHistory: conversationHistory
                })
            });

            const data = await response.json();

            const aiResponse = {
                id: Date.now() + 1,
                text: data.response || "I'm having trouble connecting. Please try again!",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorResponse = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please check your connection and try again!",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const getSkillPrompts = () => {
        const currentSkill = category === 'soft'
            ? softSkillsParameters.find(p => p.id === selectedParameter)
            : technicalRoles.find(r => r.id === selectedParameter);

        if (!currentSkill) return [];

        if (category === 'soft') {
            const prompts = {
                'communication': ["How can I improve my communication skills for interviews?", "What are common communication mistakes in interviews?", "Tips for clear and concise communication?"],
                'tone': ["How should I modulate my voice during interviews?", "What tone is best for professional interviews?", "How to sound confident without being arrogant?"],
                'fillers': ["How do I stop saying 'um' and 'like'?", "Techniques to eliminate filler words?", "Practice exercises for reducing fillers?"],
                'confidence': ["How to build confidence before an interview?", "What if I feel nervous during the interview?", "Body language tips for showing confidence?"]
            };
            return prompts[selectedParameter] || [`How can I improve my ${currentSkill.name}?`, `Common mistakes in ${currentSkill.name}?`, `Best practices for ${currentSkill.name}?`];
        } else {
            return [
                `What are key interview questions for ${currentSkill.name}?`,
                `How to prepare for ${currentSkill.name} interviews?`,
                `Common technical challenges for ${currentSkill.name}?`,
                `Best resources to learn ${currentSkill.name}?`
            ];
        }
    };

    const currentVideos = category === 'soft'
        ? softSkillsParameters.find(p => p.id === selectedParameter)?.videos || []
        : technicalRoles.find(r => r.id === selectedParameter)?.videos || [];

    const showVideos = selectedParameter !== null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative bg-background rounded-2xl shadow-2xl border border-border ${showVideos ? 'w-full max-w-7xl' : 'w-full max-w-6xl'
                            } max-h-[90vh] flex flex-col`}
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 bg-background border-b border-border p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {category === 'soft' ? 'Soft Skills' : 'Technical Skills'} Video Library
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {!showVideos
                                        ? `Select a ${category === 'soft' ? 'parameter' : 'role'} to explore videos`
                                        : 'Watch and learn from expert tutorials'
                                    }
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {!showVideos ? (
                                <div>
                                    {category === 'soft' ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {softSkillsParameters.map((param, idx) => (
                                                <motion.button
                                                    key={param.id}
                                                    onClick={() => setSelectedParameter(param.id)}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`p-6 rounded-xl border-2 transition-all text-center ${getColorClasses(param.color)}`}
                                                >
                                                    <div className="text-4xl mb-3">{param.icon}</div>
                                                    <div className="font-semibold text-sm">{param.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-2">{param.videos.length} videos</div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                                {technicalRoles.map((role, idx) => (
                                                    <motion.button
                                                        key={role.id}
                                                        onClick={() => setSelectedParameter(role.id)}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                        whileHover={{ scale: 1.05, y: -5 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="p-6 rounded-xl border-2 border-border hover:border-accent/50 transition-all text-center"
                                                    >
                                                        <div className="text-4xl mb-3">{role.icon}</div>
                                                        <div className="font-semibold text-sm">{role.name}</div>
                                                        <div className="text-xs text-muted-foreground mt-2">{role.videos.length} videos</div>
                                                    </motion.button>
                                                ))}
                                            </div>

                                            <div className="p-6 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-2 border-violet-500/30 rounded-2xl">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Zap className="w-6 h-6 text-violet-500" />
                                                    <h3 className="text-lg font-semibold">Custom Role</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4">Enter your role for general technical videos</p>
                                                <input
                                                    type="text"
                                                    value={customRole}
                                                    onChange={(e) => setCustomRole(e.target.value)}
                                                    placeholder="e.g., Blockchain Developer..."
                                                    className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
                                                />
                                                <button
                                                    onClick={() => customRole.trim() && setSelectedParameter('custom')}
                                                    disabled={!customRole.trim()}
                                                    className="w-full py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    <Play className="w-5 h-5" />
                                                    Explore Videos
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => setSelectedParameter(null)}
                                        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                        Back to {category === 'soft' ? 'parameters' : 'roles'}
                                    </button>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentVideos.map((video, idx) => (
                                            <motion.a
                                                key={idx}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                                className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all group cursor-pointer"
                                            >
                                                <div className="relative aspect-video bg-muted">
                                                    {video.thumbnail ? (
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 ${video.thumbnail ? 'bg-black/30' : ''} flex items-center justify-center`}>
                                                        <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <ExternalLink className="w-3 h-3" />
                                                        <span>Watch on YouTube</span>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Chat - Full Screen */}
                        {showVideos && isChatOpen && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setIsChatOpen(false)}>
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full max-w-4xl h-[85vh] bg-background border-2 border-accent rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                                >
                                    <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                <Bot className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">AI Interview Assistant</h3>
                                                <p className="text-sm text-white/90">
                                                    {category === 'soft' ? softSkillsParameters.find(p => p.id === selectedParameter)?.name : technicalRoles.find(r => r.id === selectedParameter)?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                            <X className="w-6 h-6 text-white" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30">
                                        {chatMessages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                                                    <Bot className="w-12 h-12 text-accent" />
                                                </div>
                                                <h4 className="text-2xl font-bold mb-3">Hi! I'm your AI Interview Coach</h4>
                                                <p className="text-muted-foreground mb-8 text-center max-w-md">
                                                    Ask me anything or try one of these questions:
                                                </p>

                                                <div className="grid md:grid-cols-2 gap-3 w-full max-w-2xl">
                                                    {getSkillPrompts().map((prompt, idx) => (
                                                        <motion.button
                                                            key={idx}
                                                            onClick={() => {
                                                                setChatInput(prompt);
                                                                setTimeout(() => handleSendMessage(), 100);
                                                            }}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="p-4 bg-card border border-border rounded-xl hover:border-accent/50 transition-all text-left group"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <Bot className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                                <p className="text-sm group-hover:text-accent transition-colors">{prompt}</p>
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            chatMessages.map((message) => (
                                                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`flex gap-3 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                                            }`}>
                                                            {message.sender === 'user' ? <span className="text-white text-xs font-bold">You</span> : <Bot className="w-5 h-5 text-white" />}
                                                        </div>
                                                        <div>
                                                            <div className={`rounded-2xl px-5 py-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-card border border-border'}`}>
                                                                <p className="text-sm leading-relaxed">{message.text}</p>
                                                            </div>
                                                            <p className="text-xs mt-1 px-2 text-muted-foreground">{message.timestamp}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="flex-shrink-0 p-6 border-t border-border bg-background">
                                        {isLoading && (
                                            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                <span>AI is thinking...</span>
                                            </div>
                                        )}
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && chatInput.trim() && !isLoading && handleSendMessage()}
                                                placeholder="Ask me anything about your interview preparation..."
                                                className="flex-1 px-5 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                disabled={isLoading}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!chatInput.trim() || isLoading}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold min-w-[100px]"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        Send
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Floating AI Button */}
                        {showVideos && (
                            <motion.button
                                onClick={() => setIsChatOpen(true)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all group"
                            >
                                <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
