import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Plus,
    Calendar,
    Search,
    ChevronRight,
    X,
    Code,
    Eye,
    Trash2,
    Pencil,
    Save,
    Users,
    Send,
    CheckCircle2,
    Clock,
    Circle,
    FileText,
    Loader2,
    MessageSquare
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosInstance from '../../api/axiosInstance';

/* ─── Exercise Modal (Create / Edit) ─────────────────────────────────────── */
const ExerciseModal = ({ onClose, onSaved, exercise = null }) => {
    const isEdit = Boolean(exercise);
    const [form, setForm] = useState({
        title: exercise?.title || '',
        markdownContent: exercise?.markdownContent || '',
    });
    const [tab, setTab] = useState('edit'); // 'edit' | 'preview'
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!form.title.trim()) { setError('Title is required.'); return; }
        if (!form.markdownContent.trim()) { setError('Markdown content is required.'); return; }
        setSubmitting(true);
        try {
            let response;
            if (isEdit) {
                response = await axiosInstance.put(`/exercises/edit/${exercise._id}`, {
                    title: form.title,
                    markdownContent: form.markdownContent,
                });
            } else {
                response = await axiosInstance.post('/exercises/create', {
                    title: form.title,
                    markdownContent: form.markdownContent,
                });
            }
            if (response.data.success) {
                onSaved(response.data.data, isEdit);
                onClose();
            } else {
                setError(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} exercise.`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-xl bg-[#0f1520] border border-gray-800/60 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800/50">
                    <div>
                        <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Exercise' : 'Create New Exercise'}</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                            {isEdit ? 'Update the exercise details below.' : 'Write a markdown-based activity for students.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Title</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Analyze a Security Report"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-[#0d1218] border border-emerald-500/40 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                        />
                    </div>

                    {/* Markdown Content */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Markdown Content</label>
                        <div className="flex gap-1 mb-2">
                            <button
                                onClick={() => setTab('edit')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'edit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Code size={12} /> Edit
                            </button>
                            <button
                                onClick={() => setTab('preview')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'preview' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Eye size={12} /> Preview
                            </button>
                        </div>
                        {tab === 'edit' ? (
                            <textarea
                                rows={8}
                                placeholder={`# Exercise Title\n## Objective\nDescribe the goal...\n\n## Instructions\n1. Step one\n2. Step two`}
                                value={form.markdownContent}
                                onChange={e => setForm({ ...form, markdownContent: e.target.value })}
                                className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono placeholder-gray-700 outline-none transition-all resize-none"
                            />
                        ) : (
                            <div className="w-full bg-[#0d1218] border border-gray-800/60 rounded-xl px-4 py-3 min-h-[168px] text-sm text-gray-400 font-mono whitespace-pre-wrap">
                                {form.markdownContent || <span className="text-gray-700 italic">Nothing to preview yet...</span>}
                            </div>
                        )}
                    </div>

                    {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isEdit ? <Save size={14} /> : <Plus size={14} />}
                        {submitting ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Exercise')}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Delete Confirmation Modal ──────────────────────────────────────────── */
const DeleteConfirmModal = ({ title, onConfirm, onClose, deleting }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="w-full max-w-sm bg-[#0f1520] border border-gray-800/60 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Exercise</h3>
            <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">"{title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={deleting}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-all disabled:opacity-50"
                >
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
);

/* ─── Assign Exercise Modal (Users + Group quick-select) ─────────────────── */
const AssignModal = ({ exercise, onClose, onAssigned }) => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [filterGroup, setFilterGroup] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, groupsRes] = await Promise.all([
                    axiosInstance.get('/auth/all-users'),
                    axiosInstance.get('/groups/all'),
                ]);
                if (usersRes.data.success) setUsers(usersRes.data.data);
                if (groupsRes.data.success) setGroups(groupsRes.data.data);
            } catch (err) {
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGroup = !filterGroup || u.groupIdValue === filterGroup;
        return matchesSearch && matchesGroup;
    });

    const toggleUser = (userId) => {
        setSelectedUsers(prev => {
            const next = new Set(prev);
            if (next.has(userId)) next.delete(userId);
            else next.add(userId);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedUsers.size === filteredUsers.length && filteredUsers.length > 0) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map(u => u._id)));
        }
    };

    const selectGroup = (groupId) => {
        const groupUsers = users.filter(u => u.groupIdValue === groupId);
        setSelectedUsers(prev => {
            const next = new Set(prev);
            groupUsers.forEach(u => next.add(u._id));
            return next;
        });
    };

    const handleAssign = async () => {
        if (selectedUsers.size === 0) { setError('Select at least one user.'); return; }
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const res = await axiosInstance.post('/exercises/assign', {
                exerciseId: exercise._id,
                userIds: Array.from(selectedUsers),
            });
            if (res.data.success) {
                const assigned = res.data.data?.length || 0;
                const skipped = res.data.skipped || 0;
                setSuccess(`Assigned to ${assigned} user(s)${skipped > 0 ? ` (${skipped} already had it)` : ''}!`);
                onAssigned && onAssigned();
                setTimeout(onClose, 1800);
            } else {
                setError(res.data.message || 'Failed to assign.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign exercise.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-lg bg-[#0f1520] border border-gray-800/60 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800/50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Assign Exercise</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">"{exercise.title}" — pick users or groups</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Quick group assign buttons */}
                {groups.length > 0 && (
                    <div className="px-6 pt-4 flex-shrink-0">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Quick assign by group</label>
                        <div className="flex flex-wrap gap-2">
                            {groups.map(g => (
                                <button
                                    key={g._id}
                                    onClick={() => selectGroup(g._id)}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all font-semibold"
                                >
                                    + {g.name} ({g.users?.length || 0})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="px-6 pt-3 pb-2 flex-shrink-0 space-y-3">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none transition-all"
                            />
                        </div>
                        <select
                            value={filterGroup}
                            onChange={e => setFilterGroup(e.target.value)}
                            className="bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none transition-all"
                        >
                            <option value="">All groups</option>
                            {groups.map(g => (
                                <option key={g._id} value={g._id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggleAll}
                            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition-colors"
                        >
                            {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? 'Deselect All' : 'Select All'}
                        </button>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                            {selectedUsers.size} selected
                        </span>
                    </div>
                </div>

                {/* User list */}
                <div className="flex-1 overflow-y-auto px-6 pb-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="w-6 h-6 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-center text-xs text-gray-600 py-10">No users found.</p>
                    ) : (
                        <div className="space-y-1">
                            {filteredUsers.map(user => (
                                <label
                                    key={user._id}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                        selectedUsers.has(user._id)
                                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                                            : 'border border-transparent hover:bg-gray-800/30'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.has(user._id)}
                                        onChange={() => toggleUser(user._id)}
                                        className="accent-emerald-500 w-4 h-4 rounded flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">{user.username}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {user.groupName && (
                                        <span className="text-[10px] font-bold text-gray-600 bg-gray-800/50 px-2 py-0.5 rounded-full flex-shrink-0">
                                            {user.groupName}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-800/50 px-6 py-4 flex-shrink-0">
                    {error && <p className="text-xs text-rose-400 font-medium mb-3">{error}</p>}
                    {success && <p className="text-xs text-emerald-400 font-medium mb-3">{success}</p>}
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">Cancel</button>
                        <button
                            onClick={handleAssign}
                            disabled={submitting || selectedUsers.size === 0}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={14} />
                            {submitting ? 'Assigning...' : `Assign to ${selectedUsers.size} User${selectedUsers.size !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Submission View Modal ──────────────────────────────────────────────── */
const SubmissionViewModal = ({ assignment, onClose }) => {
    const [tab, setTab] = useState('conversation'); // 'conversation' | 'result'
    const [conversation, setConversation] = useState([]);
    const [loadingConv, setLoadingConv] = useState(true);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await axiosInstance.get(`/exercises/conversation/${assignment._id}`);
                if (res.data.success && res.data.data.found) {
                    setConversation(res.data.data.messages);
                }
            } catch (err) {
                console.error('Failed to load conversation:', err);
            } finally {
                setLoadingConv(false);
            }
        };
        fetchConversation();
    }, [assignment._id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-2xl bg-[#0f1520] border border-gray-800/60 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800/50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Submission — {assignment.username}</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                            Completed {assignment.completedAt ? new Date(assignment.completedAt).toLocaleString() : 'N/A'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-6 pt-4 pb-2 border-b border-gray-800/30">
                    <button
                        onClick={() => setTab('conversation')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'conversation' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`}
                    >
                        <MessageSquare size={13} /> Full Conversation
                        {!loadingConv && <span className="ml-1 text-[10px] opacity-60">({conversation.length})</span>}
                    </button>
                    <button
                        onClick={() => setTab('result')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'result' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`}
                    >
                        <FileText size={13} /> Submitted Result
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {tab === 'conversation' ? (
                        loadingConv ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={20} className="animate-spin text-gray-500 mr-2" />
                                <span className="text-xs text-gray-500">Loading conversation...</span>
                            </div>
                        ) : conversation.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare size={32} className="mx-auto text-gray-700 mb-3" />
                                <p className="text-sm text-gray-500">No conversation found</p>
                                <p className="text-xs text-gray-600 mt-1">The student may not have chatted with the AI for this exercise.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {conversation.map((msg, i) => (
                                    <div key={i} className={`p-4 rounded-xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-500/10 border border-blue-500/15 text-blue-200 ml-8'
                                        : 'bg-gray-800/30 border border-gray-800/50 text-gray-300 mr-8'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/50 text-gray-500'}`}>
                                                {msg.role === 'user' ? '👤 Student' : '🤖 AI'}
                                            </span>
                                        </div>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Student's Submitted Result</label>
                                <pre className="text-sm text-gray-300 font-mono bg-[#0b0f14]/80 border border-gray-800/50 rounded-xl p-4 whitespace-pre-wrap">
                                    {assignment.result || <span className="text-gray-600 italic">No result text submitted.</span>}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ──────────────────────────────────────────────────────────── */
const AdminExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [assignTarget, setAssignTarget] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [loadingAssigned, setLoadingAssigned] = useState(false);
    const [viewingResult, setViewingResult] = useState(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axiosInstance.get('/exercises/all');
                if (response.data.success) setExercises(response.data.data);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    // Fetch assigned users whenever selected exercise changes
    useEffect(() => {
        if (!selectedExercise) { setAssignedUsers([]); return; }
        const fetchAssigned = async () => {
            setLoadingAssigned(true);
            try {
                const res = await axiosInstance.get(`/exercises/assigned/${selectedExercise._id}`);
                if (res.data.success) setAssignedUsers(res.data.data);
            } catch (err) {
                console.error('Error fetching assigned users:', err);
                setAssignedUsers([]);
            } finally {
                setLoadingAssigned(false);
            }
        };
        fetchAssigned();
    }, [selectedExercise?._id]);

    const handleSaved = (savedExercise, isEdit) => {
        if (isEdit) {
            setExercises(prev => prev.map(e => e._id === savedExercise._id ? savedExercise : e));
            setSelectedExercise(savedExercise);
        } else {
            setExercises(prev => [savedExercise, ...prev]);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const response = await axiosInstance.delete(`/exercises/delete/${deleteTarget._id}`);
            if (response.data.success) {
                setExercises(prev => prev.filter(e => e._id !== deleteTarget._id));
                if (selectedExercise?._id === deleteTarget._id) setSelectedExercise(null);
                setDeleteTarget(null);
            }
        } catch (err) {
            console.error('Error deleting exercise:', err);
        } finally {
            setDeleting(false);
        }
    };

    const refreshAssigned = async () => {
        if (!selectedExercise) return;
        try {
            const res = await axiosInstance.get(`/exercises/assigned/${selectedExercise._id}`);
            if (res.data.success) setAssignedUsers(res.data.data);
        } catch (err) { /* silent */ }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={14} className="text-emerald-400" />;
            case 'in_progress': return <Clock size={14} className="text-amber-400" />;
            default: return <Circle size={14} className="text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'in_progress': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const filteredExercises = exercises.filter(e =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#0b0f14] text-white overflow-hidden">
            {/* Create modal */}
            {showModal && (
                <ExerciseModal
                    onClose={() => setShowModal(false)}
                    onSaved={handleSaved}
                />
            )}
            {/* Edit modal */}
            {editingExercise && (
                <ExerciseModal
                    exercise={editingExercise}
                    onClose={() => setEditingExercise(null)}
                    onSaved={handleSaved}
                />
            )}
            {/* Delete confirmation */}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}
            {/* Assign modal */}
            {assignTarget && (
                <AssignModal
                    exercise={assignTarget}
                    onClose={() => setAssignTarget(null)}
                    onAssigned={refreshAssigned}
                />
            )}
            {/* Result viewer modal */}
            {viewingResult && (
                <SubmissionViewModal
                    assignment={viewingResult}
                    onClose={() => setViewingResult(null)}
                />
            )}

            <AdminSidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <header className="px-8 py-10 flex-shrink-0">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-emerald-500">Exercises</h1>
                            <p className="text-gray-500 font-mono text-xs mt-2 tracking-wide uppercase">create & manage markdown activities</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
                        >
                            <Plus size={18} /> New Exercise
                        </button>
                    </div>

                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            className="w-full bg-[#0d1218] border border-gray-800/50 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-emerald-500/50 focus:bg-[#0f151c] transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="flex-1 flex px-8 pb-10 gap-6 overflow-hidden">
                    {/* Left: list */}
                    <div className="w-1/2 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-40 opacity-50">
                                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
                                <p className="text-xs font-mono uppercase tracking-widest">Loading exercises...</p>
                            </div>
                        ) : filteredExercises.length === 0 ? (
                            <div className="text-center py-20 opacity-40 border border-dashed border-gray-800 rounded-2xl">
                                <p className="text-sm font-medium">No exercises found</p>
                            </div>
                        ) : (
                            filteredExercises.map(exercise => (
                                <div
                                    key={exercise._id}
                                    onClick={() => setSelectedExercise(exercise)}
                                    className={`p-5 rounded-2xl border transition-all cursor-pointer group relative ${selectedExercise?._id === exercise._id
                                        ? 'bg-emerald-500/[0.03] border-emerald-500/30'
                                        : 'bg-[#0d1218]/50 border-gray-800/50 hover:border-gray-700 hover:bg-[#0d1218]'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg transition-colors ${selectedExercise?._id === exercise._id ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 bg-gray-800/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-400'}`}>
                                                <BookOpen size={20} />
                                            </div>
                                            <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">{exercise.title}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${exercise.isActive !== false ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                                            {exercise.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 font-mono">
                                        {exercise.markdownContent?.substring(0, 120)}
                                        {exercise.markdownContent?.length > 120 ? '...' : ''}
                                    </p>
                                    <div className="flex items-center gap-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5"><Calendar size={12} />{new Date(exercise.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    {selectedExercise?._id === exercise._id && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"><ChevronRight size={20} /></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right: detail / empty */}
                    <div className="w-1/2 bg-[#0d1218]/50 border border-gray-800/50 rounded-2xl flex flex-col overflow-hidden relative">
                        {selectedExercise ? (
                            <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold">{selectedExercise.title}</h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setAssignTarget(selectedExercise)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all"
                                        >
                                            <Users size={14} /> Assign
                                        </button>
                                        <button
                                            onClick={() => setEditingExercise(selectedExercise)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-all"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(selectedExercise)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Status</label>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${selectedExercise.isActive !== false ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                                            {selectedExercise.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Markdown Content</label>
                                        <pre className="text-xs text-gray-400 font-mono bg-[#0b0f14]/80 border border-gray-800/50 rounded-xl p-4 overflow-auto whitespace-pre-wrap">
                                            {selectedExercise.markdownContent}
                                        </pre>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Created</label>
                                        <p className="text-sm text-gray-400">{new Date(selectedExercise.createdAt).toLocaleString()}</p>
                                    </div>
                                    {selectedExercise.updatedAt && selectedExercise.updatedAt !== selectedExercise.createdAt && (
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Last Updated</label>
                                            <p className="text-sm text-gray-400">{new Date(selectedExercise.updatedAt).toLocaleString()}</p>
                                        </div>
                                    )}

                                    {/* Assigned Users Section */}
                                    <div className="pt-6 border-t border-gray-800/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                                <Users size={12} /> Assigned Users
                                            </label>
                                            <span className="text-[10px] font-bold text-gray-600">{assignedUsers.length} total</span>
                                        </div>
                                        {loadingAssigned ? (
                                            <div className="flex items-center gap-2 py-3">
                                                <div className="w-4 h-4 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                                                <span className="text-xs text-gray-500">Loading...</span>
                                            </div>
                                        ) : assignedUsers.length === 0 ? (
                                            <p className="text-xs text-gray-600 italic py-2">No users assigned yet. Click "Assign" to add users.</p>
                                        ) : (
                                            <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                                                {assignedUsers.map(au => (
                                                    <div key={au._id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-800/20 border border-gray-800/40">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-white font-medium truncate">{au.username}</p>
                                                            <p className="text-[10px] text-gray-500 truncate">{au.email}</p>
                                                        </div>
                                                        {au.groupName && (
                                                            <span className="text-[10px] text-gray-600 bg-gray-800/50 px-2 py-0.5 rounded-full flex-shrink-0">{au.groupName}</span>
                                                        )}
                                                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(au.status)}`}>
                                                            {getStatusIcon(au.status)}
                                                            {au.status === 'in_progress' ? 'In Progress' : au.status === 'completed' ? 'Done' : 'Assigned'}
                                                        </span>
                                                        {au.status === 'completed' && au.result && (
                                                            <button
                                                                onClick={() => setViewingResult(au)}
                                                                className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 px-2 py-0.5 rounded-lg hover:bg-blue-500/10 transition-all flex-shrink-0"
                                                            >
                                                                <FileText size={12} /> View
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-gray-800/50">
                                        <p className="text-gray-600 text-[10px] italic">Exercise ID: {selectedExercise._id}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-700 mb-6">
                                    <BookOpen size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-400 mb-2">Select an exercise to edit</h3>
                                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                                    Choose an activity from the side list to view its configuration and management options.
                                </p>
                            </div>
                        )}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminExercises;
