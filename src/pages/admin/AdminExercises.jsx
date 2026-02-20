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
    Save
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
