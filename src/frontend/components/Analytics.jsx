import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Clock, Calendar, Award,
    ChevronRight, Star, Zap, Target,
    ArrowUpRight, ArrowDownRight, Activity, ChevronDown, User, Play
} from 'lucide-react';

export default function Analytics({ onStartPractice, onViewVideos }) {
    // Mock Data
    const stats = [
        {
            label: 'Total Hours',
            value: '24.5',
            unit: 'h',
            change: '+12%',
            trend: 'up',
            icon: Clock,
            color: 'blue',
            classes: {
                bg: 'bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent',
                border: 'border-blue-500/20 hover:border-blue-500/40',
                shadow: 'hover:shadow-blue-500/20',
                blob1: 'bg-blue-500/20 group-hover:bg-blue-500/30',
                blob2: 'bg-blue-500/10 group-hover:bg-blue-500/20',
                iconBg: 'from-blue-500 to-blue-600 shadow-blue-500/30',
                badge: 'bg-blue-500/10 border-blue-500/20',
                textGradient: 'from-white to-blue-200',
                unitText: 'text-blue-200/70',
                labelText: 'text-blue-300/80'
            }
        },
        {
            label: 'Interviews',
            value: '12',
            unit: '',
            change: '+3',
            trend: 'up',
            icon: Calendar,
            color: 'purple',
            classes: {
                bg: 'bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent',
                border: 'border-purple-500/20 hover:border-purple-500/40',
                shadow: 'hover:shadow-purple-500/20',
                blob1: 'bg-purple-500/20 group-hover:bg-purple-500/30',
                blob2: 'bg-purple-500/10 group-hover:bg-purple-500/20',
                iconBg: 'from-purple-500 to-purple-600 shadow-purple-500/30',
                badge: 'bg-purple-500/10 border-purple-500/20',
                textGradient: 'from-white to-purple-200',
                unitText: 'text-purple-200/70',
                labelText: 'text-purple-300/80'
            }
        },
        {
            label: 'Avg. Score',
            value: '8.4',
            unit: '/10',
            change: '+0.8',
            trend: 'up',
            icon: Star,
            color: 'emerald',
            classes: {
                bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent',
                border: 'border-emerald-500/20 hover:border-emerald-500/40',
                shadow: 'hover:shadow-emerald-500/20',
                blob1: 'bg-emerald-500/20 group-hover:bg-emerald-500/30',
                blob2: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
                iconBg: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
                badge: 'bg-emerald-500/10 border-emerald-500/20',
                textGradient: 'from-white to-emerald-200',
                unitText: 'text-emerald-200/70',
                labelText: 'text-emerald-300/80'
            }
        },
        {
            label: 'Streak',
            value: '5',
            unit: 'days',
            change: 'Best: 7',
            trend: 'neutral',
            icon: Zap,
            color: 'pink',
            classes: {
                bg: 'bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent',
                border: 'border-pink-500/20 hover:border-pink-500/40',
                shadow: 'hover:shadow-pink-500/20',
                blob1: 'bg-pink-500/20 group-hover:bg-pink-500/30',
                blob2: 'bg-pink-500/10 group-hover:bg-pink-500/20',
                iconBg: 'from-pink-500 to-pink-600 shadow-pink-500/30',
                badge: 'bg-pink-500/10 border-pink-500/20',
                textGradient: 'from-white to-pink-200',
                unitText: 'text-pink-200/70',
                labelText: 'text-pink-300/80'
            }
        }
    ];

    const history = [
        { id: 1, title: 'Full Stack Developer', type: 'Technical', score: 8.5, date: 'Today, 10:30 AM', status: 'Completed' },
        { id: 2, title: 'Behavioral Round', type: 'Soft Skills', score: 7.8, date: 'Yesterday, 2:15 PM', status: 'Completed' },
        { id: 3, title: 'System Design', type: 'Technical', score: 6.5, date: 'Nov 28, 4:00 PM', status: 'Completed' }
    ];

    // Custom Chart Components
    const CurveChart = () => {
        const [hoveredIndex, setHoveredIndex] = useState(null);
        const points = [40, 55, 45, 60, 75, 65, 85, 80, 95];
        const width = 100;
        const height = 50;
        const step = width / (points.length - 1);

        const pathData = points.reduce((acc, point, i) => {
            const x = i * step;
            const y = height - (point / 100 * height);
            if (i === 0) return `M ${x} ${y}`;
            const prevX = (i - 1) * step;
            const prevY = height - (points[i - 1] / 100 * height);
            const cp1x = prevX + step / 2;
            const cp1y = prevY;
            const cp2x = x - step / 2;
            const cp2y = y;
            return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        }, '');

        return (
            <div className="h-64 w-full relative group p-4" onMouseLeave={() => setHoveredIndex(null)}>
                {/* Axis Titles */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground font-medium tracking-widest uppercase pointer-events-none">
                    Score
                </div>

                {/* Y-Axis Grid & Labels */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pl-8 pr-4">
                    {[10, 5, 0].map((val, i) => (
                        <div key={i} className="flex items-center w-full">
                            <span className="text-[9px] text-muted-foreground/40 w-6 text-right mr-3 font-mono">{val}</span>
                            <div className="h-[1px] flex-1 bg-border/20 border-t border-dashed border-border/30" />
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 pl-8 pb-8 pr-4 pt-2">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <motion.path
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
                            fill="url(#curveGradient)"
                        />

                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            d={pathData}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            filter="url(#glow)"
                            strokeLinecap="round"
                        />

                        {/* Hover Interaction Layer */}
                        {points.map((_, i) => (
                            <rect
                                key={`hover-${i}`}
                                x={i * step - step / 2}
                                y="0"
                                width={step}
                                height={height}
                                fill="transparent"
                                onMouseEnter={() => setHoveredIndex(i)}
                                className="cursor-crosshair"
                            />
                        ))}

                        {/* Active State Elements */}
                        <AnimatePresence>
                            {hoveredIndex !== null && (
                                <g>
                                    {/* Vertical Line */}
                                    <motion.line
                                        initial={{ opacity: 0, x1: hoveredIndex * step, x2: hoveredIndex * step, y1: height, y2: height }}
                                        animate={{
                                            opacity: 1,
                                            x1: hoveredIndex * step,
                                            x2: hoveredIndex * step,
                                            y1: 0,
                                            y2: height
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                            opacity: { duration: 0.2 }
                                        }}
                                        stroke="white"
                                        strokeWidth="0.5"
                                        strokeDasharray="2 2"
                                    />

                                    {/* Intersection Dot */}
                                    <motion.circle
                                        initial={{ opacity: 0, scale: 0, cx: hoveredIndex * step, cy: height - (points[hoveredIndex] / 100 * height) }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            cx: hoveredIndex * step,
                                            cy: height - (points[hoveredIndex] / 100 * height)
                                        }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                            opacity: { duration: 0.2 }
                                        }}
                                        r="2"
                                        className="fill-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                    />

                                    {/* Tooltip */}
                                    <motion.foreignObject
                                        initial={{ opacity: 0, x: hoveredIndex * step + 4, y: height - (points[hoveredIndex] / 100 * height) - 8 }}
                                        animate={{
                                            opacity: 1,
                                            x: hoveredIndex >= points.length - 2 ? hoveredIndex * step - 44 : hoveredIndex * step + 4,
                                            y: height - (points[hoveredIndex] / 100 * height) - 8
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                            opacity: { duration: 0.2 }
                                        }}
                                        width="40"
                                        height="20"
                                        className="overflow-visible pointer-events-none"
                                    >
                                        <div className={`flex items-center ${hoveredIndex >= points.length - 2 ? 'justify-end' : 'justify-start'}`}>
                                            <div className="bg-black/80 backdrop-blur-md text-[3px] font-bold text-white px-1 py-0.5 rounded-sm border border-white/20 shadow-sm whitespace-nowrap leading-none">
                                                {points[hoveredIndex] / 10}
                                            </div>
                                        </div>
                                    </motion.foreignObject>
                                </g>
                            )}
                        </AnimatePresence>
                    </svg>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute bottom-0 left-0 right-0 pl-12 pr-4 flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                </div>
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 font-medium tracking-[0.2em] uppercase">
                    Timeline
                </div>
            </div>
        );
    };

    const SkillRadar = () => {
        const [skillType, setSkillType] = useState('soft');
        const [hoveredSkill, setHoveredSkill] = useState(null);

        const softSkills = [
            { label: 'Communication', value: 85 },
            { label: 'Confidence', value: 70 },
            { label: 'Body Language', value: 60 },
            { label: 'Tone', value: 75 },
            { label: 'Listening', value: 90 }
        ];

        const technicalSkills = [
            { label: 'Problem Solving', value: 80 },
            { label: 'Coding', value: 85 },
            { label: 'System Design', value: 65 },
            { label: 'Architecture', value: 70 },
            { label: 'Optimization', value: 75 }
        ];

        const currentSkills = skillType === 'soft' ? softSkills : technicalSkills;
        const hexColor = skillType === 'soft' ? '#06b6d4' : '#d946ef'; // Cyan vs Fuchsia

        const getPoints = (skills, scale = 1) => {
            const total = skills.length;
            return skills.map((skill, i) => {
                const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                const value = typeof skill === 'number' ? skill : skill.value;
                const radius = (value / 100) * 40 * scale; // Max radius 40 (Very Large)
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return `${x},${y}`;
            }).join(' ');
        };

        const getPolyPoints = (radius) => {
            const total = 5;
            let points = "";
            for (let i = 0; i < total; i++) {
                const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                // radius input is 20..100. Max radius is 40.
                // Factor = 0.4
                const x = 50 + radius * 0.4 * Math.cos(angle);
                const y = 50 + radius * 0.4 * Math.sin(angle);
                points += `${x},${y} `;
            }
            return points;
        };

        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/5 flex text-xs font-medium relative">
                        <motion.div
                            className={`absolute inset-y-1 rounded-lg shadow-lg ${skillType === 'soft' ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-fuchsia-500/20 border border-fuchsia-500/50'}`}
                            layoutId="activeTab"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{
                                width: '50%',
                                left: skillType === 'soft' ? '4px' : '50%'
                            }}
                        />
                        <button
                            onClick={() => setSkillType('soft')}
                            className={`relative z-10 px-4 py-2 rounded-lg transition-colors ${skillType === 'soft' ? 'text-cyan-400' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Soft Skills
                        </button>
                        <button
                            onClick={() => setSkillType('technical')}
                            className={`relative z-10 px-4 py-2 rounded-lg transition-colors ${skillType === 'technical' ? 'text-fuchsia-400' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Technical
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 flex items-center justify-center min-h-[250px]">
                    {/* Holographic Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20 pointer-events-none" />

                    {/* Removed padding to maximize size */}
                    <div className="w-full h-full">
                        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                            <defs>
                                <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor={hexColor} stopOpacity="0.95" />
                                    <stop offset="100%" stopColor={hexColor} stopOpacity="0.8" />
                                </radialGradient>
                                <filter id="radarGlow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Polygonal Grid */}
                            {[20, 40, 60, 80, 100].map((r, i) => (
                                <polygon
                                    key={i}
                                    points={getPolyPoints(r)}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeOpacity="0.1"
                                    strokeDasharray="2 2"
                                    className="transition-all duration-500"
                                />
                            ))}

                            {/* Crosshairs */}
                            {Array.from({ length: 5 }).map((_, i) => {
                                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                const x2 = 50 + 40 * Math.cos(angle); // Match max radius 40
                                const y2 = 50 + 40 * Math.sin(angle);
                                return (
                                    <line
                                        key={i}
                                        x1="50"
                                        y1="50"
                                        x2={x2}
                                        y2={y2}
                                        stroke="currentColor"
                                        strokeOpacity="0.05"
                                    />
                                );
                            })}

                            {/* Radar Shape */}
                            <motion.polygon
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    points: getPoints(currentSkills),
                                    fill: "url(#radarGradient)",
                                    stroke: hexColor,
                                    scale: 1
                                }}
                                transition={{ duration: 0.6, type: "spring" }}
                                strokeWidth="3"
                                strokeLinejoin="round"
                                filter="url(#radarGlow)"
                                className="drop-shadow-lg"
                            />

                            {/* Vertices Dots & Interaction */}
                            {currentSkills.map((skill, i) => {
                                const angle = (Math.PI * 2 * i) / currentSkills.length - Math.PI / 2;
                                const radius = (skill.value / 100) * 40; // Match max radius 40
                                const x = 50 + radius * Math.cos(angle);
                                const y = 50 + radius * Math.sin(angle);
                                const isHovered = hoveredSkill === i;

                                // Advanced Tooltip Positioning (Smart Dodge)
                                const isHighValue = skill.value > 50;

                                // Radial Offset: Inward for high, Outward for low
                                const radialOffset = isHighValue ? -12 : 10;

                                // Tangential Offset: Sideways shift to avoid "sitting on the line"
                                // Only apply sideways shift for high values (which are inside)
                                const tangentialOffset = isHighValue ? 6 : 0;

                                // Calculate new position
                                // Radial vector: (cos, sin)
                                // Tangential vector: (-sin, cos)
                                const tooltipX = x + (radialOffset * Math.cos(angle)) + (tangentialOffset * -Math.sin(angle));
                                const tooltipY = y + (radialOffset * Math.sin(angle)) + (tangentialOffset * Math.cos(angle));

                                return (
                                    <g key={`dot-${i}`} onMouseEnter={() => setHoveredSkill(i)} onMouseLeave={() => setHoveredSkill(null)}>
                                        {/* Axis Highlight Line (Laser) */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.line
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    animate={{ pathLength: 1, opacity: 1 }}
                                                    exit={{ pathLength: 0, opacity: 0 }}
                                                    x1="50"
                                                    y1="50"
                                                    x2={x}
                                                    y2={y}
                                                    stroke={hexColor}
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* Invisible Hit Area */}
                                        <circle cx={x} cy={y} r="8" fill="transparent" className="cursor-pointer" />

                                        {/* Visible Dot */}
                                        <motion.circle
                                            cx={x}
                                            cy={y}
                                            r={isHovered ? 4 : 2}
                                            fill={hexColor}
                                            stroke="white"
                                            strokeWidth={isHovered ? 2 : 1}
                                            initial={{ scale: 0 }}
                                            animate={{
                                                scale: 1,
                                                cx: x,
                                                cy: y,
                                                filter: isHovered ? "drop-shadow(0 0 4px rgba(255,255,255,0.8))" : "none"
                                            }}
                                            transition={{ duration: 0.2 }}
                                        />

                                        {/* Tooltip */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.foreignObject
                                                    x={tooltipX - 12}
                                                    y={tooltipY - 6}
                                                    width="24"
                                                    height="12"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="overflow-visible pointer-events-none z-50"
                                                >
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-[3px] px-1.5 py-0.5 shadow-xl">
                                                            <div className="text-[4px] font-bold whitespace-nowrap" style={{ color: hexColor }}>{skill.value}%</div>
                                                        </div>
                                                    </div>
                                                </motion.foreignObject>
                                            )}
                                        </AnimatePresence>
                                    </g>
                                );
                            })}

                            {/* Labels */}
                            {currentSkills.map((skill, i) => {
                                const angle = (Math.PI * 2 * i) / currentSkills.length - Math.PI / 2;
                                // Labels at 44 (Extremely close to max radius 40)
                                const labelRadius = 44;
                                const x = 50 + labelRadius * Math.cos(angle);
                                const y = 50 + labelRadius * Math.sin(angle);

                                // Smart Alignment based on position
                                const cos = Math.cos(angle);
                                let textAnchor = "middle";
                                let xOffset = 0;

                                if (cos > 0.1) { // Right side
                                    textAnchor = "start";
                                    xOffset = 2;
                                } else if (cos < -0.1) { // Left side
                                    textAnchor = "end";
                                    xOffset = -2;
                                }

                                return (
                                    <text
                                        key={`label-${i}`}
                                        x={x + xOffset}
                                        y={y}
                                        textAnchor={textAnchor}
                                        dominantBaseline="middle"
                                        className="text-[4px] fill-muted-foreground font-mono uppercase tracking-widest pointer-events-none"
                                        style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
                                    >
                                        {skill.label}
                                    </text>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    const FeedbackSection = () => {
        const [expanded, setExpanded] = useState(null); // 'soft' | 'technical' | null

        const feedback = {
            soft: {
                title: "Soft Skills",
                score: 85,
                color: "cyan",
                icon: "🗣️",
                summary: [
                    { icon: "🦁", text: "Confident Tone" },
                    { icon: "👀", text: "Good Eye Contact" },
                    { icon: "👂", text: "Active Listening" }
                ],
                details: {
                    strengths: [
                        { icon: "🚀", title: "Energy Level", desc: "Great enthusiasm throughout" },
                        { icon: "🤝", title: "Empathy", desc: "Connected well with the interviewer" },
                        { icon: "📚", title: "Storytelling", desc: "STAR method used effectively" }
                    ],
                    improvements: [
                        { icon: "🐢", title: "Pacing", desc: "Slightly fast in technical parts" },
                        { icon: "🤔", title: "Fillers", desc: "Reduced usage of 'um' and 'like'" }
                    ]
                }
            },
            technical: {
                title: "Technical Skills",
                score: 72,
                color: "purple",
                icon: "💻",
                summary: [
                    { icon: "🧠", text: "Strong Logic" },
                    { icon: "⚡", text: "Fast Solver" },
                    { icon: "🏗️", text: "Scalable Design" }
                ],
                details: {
                    strengths: [
                        { icon: "🎯", title: "Accuracy", desc: "Correct solution for the main problem" },
                        { icon: "🧱", title: "Modularity", desc: "Code was well-structured" },
                        { icon: "🔍", title: "Edge Cases", desc: "Identified most boundary conditions" }
                    ],
                    improvements: [
                        { icon: "🐌", title: "Optimization", desc: "Could improve time complexity" },
                        { icon: "📝", title: "Naming", desc: "Variable names could be more descriptive" }
                    ]
                }
            }
        };

        const toggleExpand = (type) => {
            setExpanded(expanded === type ? null : type);
        };

        const Card = ({ type, data, isExpanded, isSecondary }) => {
            const themeColor = type === 'soft' ? 'cyan' : 'purple';

            return (
                <motion.div
                    layout
                    transition={{ layout: { delay: 0.1, duration: 1.2, type: "spring", stiffness: 40, damping: 20 } }}
                    onClick={() => !isExpanded && toggleExpand(type)}
                    whileHover={!isExpanded ? { scale: 1.03, y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
                    whileTap={!isExpanded ? { scale: 0.95 } : {}}
                    className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 cursor-pointer group
                        ${isExpanded
                            ? `col-span-2 h-auto bg-${themeColor}-500/10 border-${themeColor}-500/30`
                            : `h-64 bg-black/20 border-white/5 hover:border-${themeColor}-500/30 hover:bg-${themeColor}-500/5`
                        }
                        ${isSecondary ? 'opacity-80 scale-95' : 'opacity-100'}
                    `}
                >
                    {/* Background Glow */}
                    <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-${themeColor}-500 pointer-events-none`} />

                    {/* Expand Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(type);
                        }}
                        className={`absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors`}
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ delay: 0.1, duration: 1.2, type: "spring", stiffness: 40, damping: 20 }}
                            className="text-white/70"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </motion.div>
                    </button>

                    <div className="p-8 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <motion.div
                                layout
                                className={`w-16 h-16 rounded-2xl bg-${themeColor}-500/20 flex items-center justify-center text-4xl shadow-lg shadow-${themeColor}-500/10`}
                            >
                                {data.icon}
                            </motion.div>
                            <div>
                                <motion.h3 layout className={`text-2xl font-black uppercase tracking-tight text-white`}>{data.title}</motion.h3>
                                <motion.div layout className={`text-sm font-bold text-${themeColor}-400 flex items-center gap-2`}>
                                    <span className="text-2xl">{data.score}</span>/100 Score
                                </motion.div>
                            </div>
                        </div>

                        {/* Collapsed Content */}
                        {!isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col justify-end"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {data.summary.map((item, i) => (
                                        <div key={i} className={`px-3 py-1.5 rounded-lg bg-${themeColor}-500/10 border border-${themeColor}-500/20 text-xs font-bold text-${themeColor}-200 flex items-center gap-2`}>
                                            <span>{item.icon}</span>
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 40, damping: 20 }}
                                    className="mt-4 grid md:grid-cols-2 gap-8"
                                >
                                    {/* Strengths */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
                                            <Zap className="w-4 h-4" /> Superpowers
                                        </h4>
                                        <div className="grid gap-3">
                                            {data.details.strengths.map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                                    className="flex items-center gap-4 p-3 rounded-xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors"
                                                >
                                                    <div className="text-2xl">{item.icon}</div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{item.title}</div>
                                                        <div className="text-xs text-white/60">{item.desc}</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Improvements */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-orange-400 flex items-center gap-2">
                                            <Activity className="w-4 h-4" /> Glitches
                                        </h4>
                                        <div className="grid gap-3">
                                            {data.details.improvements.map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                                    className="flex items-center gap-4 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-colors"
                                                >
                                                    <div className="text-2xl">{item.icon}</div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{item.title}</div>
                                                        <div className="text-xs text-white/60">{item.desc}</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            );
        };

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Logic for ordering: Expanded item first (full width), then the other */}
                {expanded === 'soft' && (
                    <>
                        <Card type="soft" data={feedback.soft} isExpanded={true} />
                        <Card type="technical" data={feedback.technical} isExpanded={false} isSecondary={true} />
                    </>
                )}

                {expanded === 'technical' && (
                    <>
                        <Card type="technical" data={feedback.technical} isExpanded={true} />
                        <Card type="soft" data={feedback.soft} isExpanded={false} isSecondary={true} />
                    </>
                )}

                {expanded === null && (
                    <>
                        <Card type="soft" data={feedback.soft} isExpanded={false} />
                        <Card type="technical" data={feedback.technical} isExpanded={false} />
                    </>
                )}
            </div>
        );
    };

    const Recommendations = ({ onStartPractice, onViewVideos }) => {
        const [activeTab, setActiveTab] = useState('soft');

        const data = {
            soft: {
                focus: {
                    title: "Body Language",
                    score: 65,
                    insight: "Eye Contact",
                    color: "cyan",
                    icon: Target
                },
                videos: [
                    { id: 1, title: "Mastering Non-Verbal Cues", duration: "12m", author: "Sarah K.", thumbnail: "from-cyan-900/80 via-cyan-800/50 to-transparent" },
                    { id: 2, title: "The Art of the Pause", duration: "8m", author: "Ted Talks", thumbnail: "from-blue-900/80 via-blue-800/50 to-transparent" },
                    { id: 3, title: "Power Posing", duration: "5m", author: "Amy C.", thumbnail: "from-indigo-900/80 via-indigo-800/50 to-transparent" }
                ],
                practice: [
                    { id: 1, title: "Rapid Fire Q&A", level: "Hard", xp: "+50 XP", time: "10m" },
                    { id: 2, title: "Storytelling Drill", level: "Med", xp: "+30 XP", time: "15m" }
                ]
            },
            technical: {
                focus: {
                    title: "System Design",
                    score: 58,
                    insight: "Scalability",
                    color: "purple",
                    icon: Activity
                },
                videos: [
                    { id: 1, title: "Scalability Patterns", duration: "25m", author: "SystemExpert", thumbnail: "from-purple-900/80 via-purple-800/50 to-transparent" },
                    { id: 2, title: "Database Sharding", duration: "18m", author: "TechLead", thumbnail: "from-fuchsia-900/80 via-fuchsia-800/50 to-transparent" },
                    { id: 3, title: "CAP Theorem", duration: "10m", author: "DevTips", thumbnail: "from-violet-900/80 via-violet-800/50 to-transparent" }
                ],
                practice: [
                    { id: 1, title: "Design Twitter", level: "Expert", xp: "+100 XP", time: "45m" },
                    { id: 2, title: "API Rate Limiter", level: "Hard", xp: "+75 XP", time: "30m" }
                ]
            }
        };

        const current = data[activeTab];
        const theme = activeTab === 'soft' ? 'cyan' : 'purple';

        return (
            <div className="space-y-6">
                {/* Header & Tabs */}
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Zap className={`w-5 h-5 ${activeTab === 'soft' ? 'text-cyan-400' : 'text-purple-400'}`} />
                        Recommended Growth Plan
                    </h3>
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 backdrop-blur-md">
                        {['soft', 'technical'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === tab
                                    ? `bg-${theme}-500 text-white shadow-lg shadow-${theme}-500/25`
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Action Section - Spans 3 Columns (Full Width) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Video Reel */}
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${theme}-500`} /> Quick Learning
                            </h5>
                            <div className="grid grid-cols-3 gap-3">
                                {current.videos.map((video, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -4 }}
                                        onClick={() => onViewVideos && onViewVideos(activeTab)}
                                        className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/5 bg-black/40"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-t ${video.thumbnail}`} />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                            <div className="text-xs font-bold text-white truncate">{video.title}</div>
                                            <div className="text-[10px] text-white/60 flex justify-between mt-0.5">
                                                <span>{video.author}</span>
                                                <span>{video.duration}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Practice Missions */}
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${theme}-500`} /> Active Practice
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                                {current.practice.map((session, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => onStartPractice && onStartPractice(activeTab, session.title)}
                                        className={`flex items-center justify-between p-4 rounded-xl border border-${theme}-500/10 bg-${theme}-500/5 hover:bg-${theme}-500/10 transition-colors cursor-pointer group`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-${theme}-500/20 text-${theme}-300 uppercase`}>
                                                    {session.level}
                                                </span>
                                                <span className="text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-500" /> {session.xp}
                                                </span>
                                            </div>
                                            <div className="font-bold text-white">{session.title}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{session.time} • Focus Mode</div>
                                        </div>
                                        <div className={`h-8 px-3 rounded-lg bg-${theme}-500 text-white text-xs font-bold flex items-center shadow-lg shadow-${theme}-500/20 group-hover:scale-105 transition-transform`}>
                                            START
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold mb-2">Analytics & Growth</h2>
                <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`relative group backdrop-blur-xl border p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${stat.classes.bg} ${stat.classes.border} ${stat.classes.shadow}`}
                    >
                        {/* Hover Glint Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                        {/* Background Gradient Blob */}
                        <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl transition-colors duration-500 ${stat.classes.blob1}`} />
                        <div className={`absolute -left-6 -bottom-6 w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${stat.classes.blob2}`} />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3.5 rounded-xl bg-gradient-to-br text-white shadow-lg group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20 ${stat.classes.iconBg}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${stat.classes.badge} ${stat.trend === 'up' ? 'text-green-400' : 'text-muted-foreground'
                                    }`}>
                                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                                    {stat.change}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className={`text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${stat.classes.textGradient}`}>
                                    {stat.value}
                                    <span className={`text-sm font-medium ml-1 ${stat.classes.unitText}`}>{stat.unit}</span>
                                </div>
                                <div className={`text-sm font-medium tracking-wide uppercase text-[10px] ${stat.classes.labelText}`}>{stat.label}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Performance Trend */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-2 bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Performance Trend</h3>
                            <p className="text-sm text-muted-foreground">Your interview scores over time</p>
                        </div>
                        <select className="bg-muted border border-border rounded-lg text-sm px-3 py-1 outline-none">
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                            <option>All Time</option>
                        </select>
                    </div>
                    <CurveChart />
                </motion.div>

                {/* Skill Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl"
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-bold">Skill Distribution</h3>
                        <p className="text-sm text-muted-foreground">Current strength analysis</p>
                    </div>
                    <SkillRadar />
                </motion.div>
            </div>

            {/* Recommendations Section (Full Width) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card/30 backdrop-blur-sm border border-border p-6 rounded-2xl"
            >
                <Recommendations onStartPractice={onStartPractice} onViewVideos={onViewVideos} />
            </motion.div>

            {/* Feedback Section */}
            <FeedbackSection />

            {/* Recent Interviews (History) */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold">Recent Interviews</h3>
                        <p className="text-sm text-muted-foreground">History & Results</p>
                    </div>
                    <button className="text-sm text-primary hover:underline">View All</button>
                </div>

                <div className="grid gap-4">
                    {history.map((session, i) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-card border border-border rounded-2xl p-6 hover:border-blue-500/30 hover:bg-accent/5 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg
                                    ${session.type === 'Soft Skills' ? 'bg-blue-500/10 text-blue-500 shadow-blue-500/10' :
                                        session.type === 'Technical' ? 'bg-purple-500/10 text-purple-500 shadow-purple-500/10' :
                                            'bg-green-500/10 text-green-500 shadow-green-500/10'}`}
                                >
                                    {session.type === 'Soft Skills' ? <User className="w-6 h-6" /> :
                                        session.type === 'Technical' ? <Target className="w-6 h-6" /> :
                                            <Play className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1 group-hover:text-blue-500 transition-colors">{session.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border
                                            ${session.type === 'Soft Skills' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                session.type === 'Technical' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                    'bg-green-500/10 text-green-500 border-green-500/20'}`}
                                        >
                                            {session.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{session.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-2xl font-black">{session.score}<span className="text-sm text-muted-foreground font-normal">/10</span></div>
                                    <div className={`text-xs font-bold flex items-center justify-end gap-1 ${session.score >= 8 ? 'text-green-500' : 'text-amber-500'}`}>
                                        {session.score >= 8 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {session.score >= 8 ? '+12%' : '-5%'}
                                    </div>
                                </div>
                                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                                    <ChevronDown className="-rotate-90 w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>


        </div>
    );
}
