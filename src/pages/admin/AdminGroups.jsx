import React, { useState, useEffect } from 'react';
import {
    Plus,
    Users,
    Settings,
    Eye,
    Copy,
    EyeOff,
    LayoutGrid,
    List,
    X,
    Pencil,
    Trash2,
    Save
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosInstance from '../../api/axiosInstance';

const GROUP_COLORS = [
    { label: 'Emerald', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Gray', value: '#6b7280' },
    { label: 'Purple', value: '#a78bfa' },
    { label: 'Rose', value: '#f43f5e' },
];

/* ─── Group Modal (Create / Edit) ────────────────────────────────────────── */
const GroupModal = ({ onClose, onSaved, group = null }) => {
    const isEdit = Boolean(group);
    const [form, setForm] = useState({
        name: group?.name || '',
        description: group?.description || '',
        promptTweaks: group?.promptTweaks || '',
        color: group?.color || GROUP_COLORS[0].value,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!form.name.trim()) { setError('Group name is required.'); return; }
        if (!form.promptTweaks.trim()) { setError('Prompt Tweaks field is required.'); return; }
        setSubmitting(true);
        try {
            const payload = { name: form.name, description: form.description, promptTweaks: form.promptTweaks };
            let response;
            if (isEdit) {
                response = await axiosInstance.put(`/groups/edit/${group._id}`, payload);
            } else {
                response = await axiosInstance.post('/groups/create', payload);
            }
            if (response.data.success) {
                // Preserve color locally since backend doesn't store it
                const savedGroup = { ...response.data.data, color: form.color };
                onSaved(savedGroup, isEdit);
                onClose();
            } else {
                setError(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} group.`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-lg bg-[#0f1520] border border-gray-800/60 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800/50">
                    <div>
                        <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Group' : 'Create New Group'}</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                            {isEdit ? 'Update the group details below.' : 'Define a group with optional prompt manipulation for experiments.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Group Name */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Group Name</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Group D — Neutral"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-[#0d1218] border border-emerald-500/40 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Description</label>
                        <input
                            type="text"
                            placeholder="Brief description of this group's purpose"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                        />
                    </div>

                    {/* Prompt Manipulation */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">
                            <span className="text-emerald-500/50 mr-1">{'>'}_</span> Prompt Tweaks
                        </label>
                        <textarea
                            rows={4}
                            placeholder="e.g. Always respond with a neutral and balanced tone..."
                            value={form.promptTweaks}
                            onChange={e => setForm({ ...form, promptTweaks: e.target.value })}
                            className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all resize-none font-mono"
                        />
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-3">Color</label>
                        <div className="flex items-center gap-3">
                            {GROUP_COLORS.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setForm({ ...form, color: c.value })}
                                    title={c.label}
                                    className={`w-9 h-9 rounded-full transition-all ${form.color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f1520] scale-110' : 'opacity-70 hover:opacity-100'}`}
                                    style={{ backgroundColor: c.value }}
                                />
                            ))}
                        </div>
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
                        {submitting ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Group')}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Delete Confirmation Modal ──────────────────────────────────────────── */
const DeleteConfirmModal = ({ name, onConfirm, onClose, deleting }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="w-full max-w-sm bg-[#0f1520] border border-gray-800/60 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Group</h3>
            <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">"{name}"</span>? This action cannot be undone.
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
const AdminGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('cards');
    const [visiblePrompts, setVisiblePrompts] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axiosInstance.get('/groups/all');
                if (response.data.success) setGroups(response.data.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const handleSaved = (savedGroup, isEdit) => {
        if (isEdit) {
            setGroups(prev => prev.map(g => g._id === savedGroup._id ? savedGroup : g));
        } else {
            setGroups(prev => [savedGroup, ...prev]);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const response = await axiosInstance.delete(`/groups/delete/${deleteTarget._id}`);
            if (response.data.success) {
                setGroups(prev => prev.filter(g => g._id !== deleteTarget._id));
                setDeleteTarget(null);
            }
        } catch (err) {
            console.error('Error deleting group:', err);
        } finally {
            setDeleting(false);
        }
    };

    const togglePromptVisibility = (groupId) => {
        setVisiblePrompts(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const getDotColor = (group) => {
        if (group.color) return group.color;
        const name = group.name?.toLowerCase() || '';
        if (name.includes('a')) return '#10b981';
        if (name.includes('b')) return '#f59e0b';
        return '#6b7280';
    };

    return (
        <div className="flex h-screen bg-[#0b0f14] text-white overflow-hidden">
            {/* Create modal */}
            {showModal && (
                <GroupModal
                    onClose={() => setShowModal(false)}
                    onSaved={handleSaved}
                />
            )}
            {/* Edit modal */}
            {editingGroup && (
                <GroupModal
                    group={editingGroup}
                    onClose={() => setEditingGroup(null)}
                    onSaved={handleSaved}
                />
            )}
            {/* Delete confirmation */}
            {deleteTarget && (
                <DeleteConfirmModal
                    name={deleteTarget.name}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}

            <AdminSidebar />

            <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0b0f14]">
                <header className="px-8 py-10 flex-shrink-0">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-emerald-500">Groups</h1>
                            <p className="text-gray-500 font-mono text-xs mt-2 tracking-wide uppercase">manage experimental groups</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* View toggle */}
                            <div className="flex bg-[#0d1218] border border-gray-800/50 rounded-xl p-1 mr-2">
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-gray-800 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                                ><LayoutGrid size={18} /></button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gray-800 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                                ><List size={18} /></button>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
                            >
                                <Plus size={18} /> New Group
                            </button>
                        </div>
                    </div>
                </header>

                <div className="px-8 pb-10 space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
                            <p className="text-xs font-mono uppercase tracking-widest">Retrieving group data...</p>
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-20 opacity-40 border border-dashed border-gray-800 rounded-3xl bg-[#0d1218]/30">
                            <Users size={48} className="mx-auto mb-4 text-gray-600" />
                            <p className="text-sm font-medium">No experimental groups configured</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-4 text-emerald-500 text-xs font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors"
                            >
                                Click to create first group
                            </button>
                        </div>
                    ) : (
                        groups.map(group => (
                            <div key={group._id} className="bg-[#0d1218]/40 border border-gray-800/50 rounded-3xl p-6 transition-all hover:bg-[#0d1218]/60 group relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: getDotColor(group), boxShadow: `0 0 10px ${getDotColor(group)}80` }}
                                        />
                                        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-3">
                                            {group.name}
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-800/50 border border-gray-700/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                <Users size={12} />{group.users?.length || 0}
                                            </span>
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditingGroup(group)}
                                            className="p-2 text-gray-600 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                            title="Edit group"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(group)}
                                            className="p-2 text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                            title="Delete group"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                                    {group.description || 'No description provided for this group.'}
                                </p>

                                {group.promptTweaks && (
                                    <div className="bg-[#0b0f14]/80 border border-gray-800/50 rounded-2xl p-4 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                                <span className="text-emerald-500/50">{'>'}_</span> PROMPT MANIPULATION
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => togglePromptVisibility(group._id)} className="p-1.5 text-gray-600 hover:text-emerald-400 transition-colors">
                                                    {visiblePrompts[group._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(group.promptTweaks)}
                                                    className="p-1.5 text-gray-600 hover:text-emerald-400 transition-colors"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`font-mono text-sm leading-relaxed transition-all duration-300 ${visiblePrompts[group._id] ? 'text-gray-300' : 'text-gray-300/10 blur-sm select-none'}`}>
                                            {group.promptTweaks}
                                        </div>
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                            style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminGroups;
