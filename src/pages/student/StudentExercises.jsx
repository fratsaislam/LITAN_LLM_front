import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';
import { BookOpen, CheckCircle2, Clock, Circle, ChevronRight, Loader2, PlayCircle, MessageSquare, Send, X } from 'lucide-react';

/* ─── Submit Result Modal ────────────────────────────────────────────────── */
const SubmitModal = ({ userExercise, onClose, onSubmitted }) => {
    const [result, setResult] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [loadingChat, setLoadingChat] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);

    // Load the chat history for this exercise
    useEffect(() => {
        const fetchChat = async () => {
            try {
                // Find conversation linked to this userExercise by userExerciseId
                const convRes = await axiosInstance.get('/conv/user');
                if (convRes.data.success) {
                    const allConvs = convRes.data.data;
                    // Find the conversation that matches this userExerciseId
                    const matchingConv = allConvs.find(c => c.userExerciseId === userExercise._id);
                    if (matchingConv) {
                        const fullConv = await axiosInstance.get(`/conv/${matchingConv._id}`);
                        if (fullConv.data.success) {
                            const msgs = fullConv.data.data.messages.filter(m => m.role !== 'system');
                            setChatHistory(msgs);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load chat history:', err);
            } finally {
                setLoadingChat(false);
            }
        };
        fetchChat();
    }, [userExercise]);

    const handleSubmit = async () => {
        if (!result.trim()) { setError('Please write your result before submitting.'); return; }
        setSubmitting(true);
        setError('');
        try {
            const res = await axiosInstance.post(`/exercises/submit/${userExercise._id}`, {
                result: result.trim(),
                chatHistory,
            });
            if (res.data.success) {
                onSubmitted && onSubmitted();
                onClose();
            } else {
                setError(res.data.message || 'Failed to submit.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit result.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-xl bg-[#0f1520] border border-gray-800/60 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800/50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Submit Exercise Result</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">"{userExercise.exerciseId?.title}"</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {/* Chat summary */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">
                            Chat History {loadingChat ? '(loading...)' : `(${chatHistory.length} messages)`}
                        </label>
                        {loadingChat ? (
                            <div className="flex items-center gap-2 py-3">
                                <Loader2 size={14} className="animate-spin text-gray-500" />
                                <span className="text-xs text-gray-500">Loading chat...</span>
                            </div>
                        ) : chatHistory.length === 0 ? (
                            <p className="text-xs text-gray-600 italic">No chat history found. You can still submit your result.</p>
                        ) : (
                            <div className="space-y-1.5 max-h-[180px] overflow-y-auto custom-scrollbar rounded-xl border border-gray-800/50 p-3 bg-[#0b0f14]/50">
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`p-2 rounded-lg text-xs ${msg.role === 'user' ? 'bg-blue-500/10 text-blue-300' : 'bg-gray-800/30 text-gray-400'}`}>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{msg.role}: </span>
                                        {msg.content?.length > 150 ? msg.content.substring(0, 150) + '...' : msg.content}
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-[10px] text-gray-600 mt-1.5">This chat history will be sent along with your result.</p>
                    </div>

                    {/* Result text area */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Your Result / Answer</label>
                        <textarea
                            rows={6}
                            autoFocus
                            placeholder="Write your final answer, conclusions, or findings here..."
                            value={result}
                            onChange={e => setResult(e.target.value)}
                            className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-gray-300 placeholder-gray-700 outline-none transition-all resize-none"
                        />
                    </div>

                    {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800/50 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !result.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={14} />
                        {submitting ? 'Submitting...' : 'Submit Result'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ──────────────────────────────────────────────────────────── */
const StudentExercises = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startingChat, setStartingChat] = useState(false);
    const [submitTarget, setSubmitTarget] = useState(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/exercises/my');
            if (res.data.success) {
                setExercises(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch exercises:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExercise = async (userExercise) => {
        setStartingChat(true);
        try {
            const res = await axiosInstance.post('/conv/exercise', {
                userExerciseId: userExercise._id,
            });
            if (res.data.success) {
                // Navigate to the specific conversation (either existing or newly created)
                navigate(`/chat?conversationId=${res.data.data._id}`);
            }
        } catch (err) {
            console.error('Failed to start exercise chat:', err);
        } finally {
            setStartingChat(false);
        }
    };

    const handleMarkComplete = async (userExerciseId) => {
        // Now handled by SubmitModal instead
        setSubmitTarget(exercises.find(e => e._id === userExerciseId));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="text-emerald-400" size={18} />;
            case 'in_progress': return <Clock className="text-amber-400" size={18} />;
            default: return <Circle className="text-gray-600" size={18} />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in_progress': return 'In Progress';
            default: return 'Assigned';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'in_progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const completedCount = exercises.filter(e => e.status === 'completed').length;

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
                            {completedCount}/{exercises.length} completed
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={24} className="animate-spin text-gray-500" />
                            </div>
                        ) : exercises.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <BookOpen size={32} className="mx-auto text-gray-600 mb-3" />
                                <p className="text-sm text-gray-500">No exercises assigned yet</p>
                                <p className="text-xs text-gray-600 mt-1">Your instructor will assign exercises to you.</p>
                            </div>
                        ) : (
                            exercises.map((ue) => (
                                <button
                                    key={ue._id}
                                    onClick={() => setSelectedExercise(ue)}
                                    className={`w-full p-5 text-left border-b border-gray-800/50 transition-all hover:bg-gray-800/30 group ${selectedExercise?._id === ue._id ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition">
                                            {ue.exerciseId?.title || 'Untitled Exercise'}
                                        </h3>
                                        {getStatusIcon(ue.status)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(ue.status)}`}>
                                            {getStatusLabel(ue.status)}
                                        </span>
                                        {ue.groupId?.name && (
                                            <span className="text-[10px] text-gray-600">{ue.groupId.name}</span>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Exercise Detail View */}
                <div className="flex-1 overflow-y-auto p-12 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    {selectedExercise ? (
                        <div className="max-w-3xl relative z-10">
                            <div className="flex items-center gap-2 text-emerald-400 mb-6">
                                <span className={`px-3 py-1 rounded-lg text-xs font-mono border ${getStatusColor(selectedExercise.status)}`}>
                                    {getStatusLabel(selectedExercise.status).toUpperCase()}
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs text-gray-500">
                                    Assigned {new Date(selectedExercise.createdAt).toLocaleDateString()}
                                </span>
                                {selectedExercise.completedAt && (
                                    <>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-xs text-emerald-500">
                                            Completed {new Date(selectedExercise.completedAt).toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4">
                                {selectedExercise.exerciseId?.title || 'Untitled Exercise'}
                            </h1>

                            <div className="bg-[#0f1218] border border-gray-800 rounded-2xl p-8 mb-8">
                                <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                    {selectedExercise.exerciseId?.markdownContent || 'No content available.'}
                                </pre>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(selectedExercise.status)}
                                        <span className="text-sm text-gray-200 capitalize">
                                            {getStatusLabel(selectedExercise.status)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                                    <p className="text-xs text-gray-500 mb-1">Group</p>
                                    <p className="text-sm text-gray-200">
                                        {selectedExercise.groupId?.name || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {selectedExercise.status !== 'completed' && (
                                    <button
                                        onClick={() => handleStartExercise(selectedExercise)}
                                        disabled={startingChat}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        {startingChat ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                                        {selectedExercise.status === 'in_progress' ? 'Continue Exercise' : 'Start Exercise'}
                                        <ChevronRight size={18} />
                                    </button>
                                )}

                                {selectedExercise.status === 'in_progress' && (
                                    <button
                                        onClick={() => setSubmitTarget(selectedExercise)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/10 transition"
                                    >
                                        <Send size={18} />
                                        Submit Result
                                    </button>
                                )}

                                {selectedExercise.status === 'completed' && (
                                    <>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                                            <CheckCircle2 size={16} />
                                            Submitted
                                        </div>
                                        <button
                                            onClick={() => handleStartExercise(selectedExercise)}
                                            disabled={startingChat}
                                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800/50 transition"
                                        >
                                            <MessageSquare size={18} />
                                            Review with AI
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <BookOpen size={64} className="mb-4 text-emerald-400" />
                            <h3 className="text-xl font-medium text-white">Select an exercise to view details</h3>
                            <p className="text-sm text-gray-500 mt-2">Pick an assignment from the list on the left to get started.</p>
                        </div>
                    )}
                </div>

                {/* Submit modal */}
                {submitTarget && (
                    <SubmitModal
                        userExercise={submitTarget}
                        onClose={() => setSubmitTarget(null)}
                        onSubmitted={() => {
                            fetchExercises();
                            setSelectedExercise(prev => prev ? { ...prev, status: 'completed', completedAt: new Date() } : prev);
                        }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default StudentExercises;