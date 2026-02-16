import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { BookOpen, CheckCircle2, Clock, Circle, ChevronRight } from 'lucide-react';

const StudentExercises = () => {
    const [selectedExercise, setSelectedExercise] = useState(null);

    // Mock dynamic data structure
    const exercises = [
        {
            id: 1,
            title: "Explain Photosynthesis",
            status: "completed",
            difficulty: "easy",
            description: "Ask the AI to explain photosynthesis in simple terms for a 5-year old.",
            assignedDate: "2025-01-15",
            tokens: 450
        },
        {
            id: 2,
            title: "Creative Story Writing",
            status: "in-progress",
            difficulty: "medium",
            description: "Collaborate with AI to write a 200-word cyberpunk short story.",
            assignedDate: "2025-01-16",
            tokens: 1200
        },
        {
            id: 3,
            title: "Debate: AI Ethics",
            status: "pending",
            difficulty: "hard",
            description: "Engage in a structured debate about AI ethics and data privacy.",
            assignedDate: "2025-01-17",
            tokens: 0
        }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="text-emerald-400" size={18} />;
            case 'in-progress': return <Clock className="text-amber-400" size={18} />;
            default: return <Circle className="text-gray-600" size={18} />;
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <Layout>
            <div className="flex h-full bg-[#0b0d12]">
                {/* Exercises Sidebar List */}
                <div className="w-80 border-r border-gray-800 flex flex-col bg-[#0f1117]/50">
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <BookOpen size={18} />
                            <h2 className="font-semibold text-white">My Exercises</h2>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            {exercises.filter(e => e.status === 'completed').length}/{exercises.length} completed
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {exercises.map((exercise) => (
                            <button
                                key={exercise.id}
                                onClick={() => setSelectedExercise(exercise)}
                                className={`w-full p-5 text-left border-b border-gray-800/50 transition-all hover:bg-gray-800/30 group ${selectedExercise?.id === exercise.id ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition">
                                        {exercise.title}
                                    </h3>
                                    {getStatusIcon(exercise.status)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getDifficultyColor(exercise.difficulty)}`}>
                                        {exercise.difficulty}
                                    </span>
                                    <p className="text-[10px] text-gray-500 truncate">{exercise.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Exercise Detail View */}
                <div className="flex-1 overflow-y-auto p-12 relative">
                    {/* Grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    {selectedExercise ? (
                        <div className="max-w-3xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 text-emerald-400 mb-6">
                                <span className={`px-3 py-1 rounded-lg text-xs font-mono border ${getDifficultyColor(selectedExercise.difficulty)}`}>
                                    {selectedExercise.difficulty.toUpperCase()}
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs text-gray-500">Assigned {selectedExercise.assignedDate}</span>
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4">{selectedExercise.title}</h1>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                {selectedExercise.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(selectedExercise.status)}
                                        <span className="text-sm text-gray-200 capitalize">{selectedExercise.status.replace('-', ' ')}</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                                    <p className="text-xs text-gray-500 mb-1">Tokens Used</p>
                                    <p className="text-sm text-gray-200 font-mono">{selectedExercise.tokens}</p>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition transform hover:scale-[1.02] active:scale-95">
                                {selectedExercise.status === 'completed' ? 'Review Submission' : 'Start Exercise'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <BookOpen size={64} className="mb-4 text-emerald-400" />
                            <h3 className="text-xl font-medium text-white">Select an exercise to view details</h3>
                            <p className="text-sm text-gray-500 mt-2">Pick an assignment from the list on the left to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StudentExercises;