import React, { useState, useEffect } from 'react';
import {
    FlaskConical,
    Plus,
    Users,
    BookOpen,
    Calendar,
    ChevronRight,
    Activity,
    CheckCircle2,
    X
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosInstance from '../../api/axiosInstance';

/* ─── Create Experiment Modal ─────────────────────────────────────────────── */
const CreateExperimentModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({ name: '', description: '', status: 'draft', startDate: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!form.name.trim()) { setError('Experiment name is required.'); return; }
        setSubmitting(true);
        try {
            const response = await axiosInstance.post('/experiments/create', form);
            if (response.data.success) {
                onCreated(response.data.data);
                onClose();
            } else {
                setError(response.data.message || 'Failed to create experiment.');
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
                        <h2 className="text-lg font-bold text-white">Create New Experiment</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">Set up an A/B test or bias study with group assignments.</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Experiment Name</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Tone Impact Study"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-[#0d1218] border border-emerald-500/40 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Description</label>
                        <textarea
                            rows={4}
                            placeholder="Describe the goal and hypothesis of this experiment..."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Status + Start Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Status</label>
                            <select
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                                className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Start Date</label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={e => setForm({ ...form, startDate: e.target.value })}
                                className="w-full bg-[#0d1218] border border-gray-800/60 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]"
                            />
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
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Creating...' : 'Create Experiment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ──────────────────────────────────────────────────────────── */
const AdminExperiments = () => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                const response = await axiosInstance.get('/experiments/all');
                if (response.data.success) setExperiments(response.data.data);
            } catch (error) {
                console.error('Error fetching experiments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiments();
    }, []);

    const handleCreated = (newExp) => {
        setExperiments(prev => [newExp, ...prev]);
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Activity size={10} />active</span>;
            case 'completed':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20"><CheckCircle2 size={10} />completed</span>;
            default:
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/20">draft</span>;
        }
    };

    return (
        <div className="flex h-screen bg-[#0b0f14] text-white overflow-hidden">
            {showModal && <CreateExperimentModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
            <AdminSidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <header className="px-8 py-10 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-emerald-500">Experiments</h1>
                            <p className="text-gray-500 font-mono text-xs mt-2 tracking-wide uppercase">configure A/B tests & bias studies</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
                        >
                            <Plus size={18} /> New Experiment
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex px-8 pb-10 gap-6 overflow-hidden">
                    {/* Left: list */}
                    <div className="w-1/2 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-40 opacity-50">
                                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
                                <p className="text-xs font-mono uppercase tracking-widest">Loading experiments...</p>
                            </div>
                        ) : experiments.length === 0 ? (
                            <div className="text-center py-20 opacity-40 border border-dashed border-gray-800 rounded-2xl">
                                <FlaskConical size={40} className="mx-auto mb-4 text-gray-600" />
                                <p className="text-sm font-medium">No experiments found</p>
                            </div>
                        ) : (
                            experiments.map(exp => (
                                <div
                                    key={exp._id}
                                    onClick={() => setSelectedExperiment(exp)}
                                    className={`p-5 rounded-2xl border transition-all cursor-pointer group relative ${selectedExperiment?._id === exp._id
                                        ? 'bg-emerald-500/[0.03] border-emerald-500/30'
                                        : 'bg-[#0d1218]/50 border-gray-800/50 hover:border-gray-700 hover:bg-[#0d1218]'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg transition-colors ${selectedExperiment?._id === exp._id ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800/30 text-gray-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400'}`}>
                                                <FlaskConical size={18} />
                                            </div>
                                            <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">{exp.name}</h3>
                                        </div>
                                        {getStatusBadge(exp.status)}
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 ml-[52px]">{exp.description}</p>
                                    <div className="flex items-center gap-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-[52px] mb-4">
                                        <div className="flex items-center gap-1.5"><Users size={12} />{exp.groupsCount || exp.groups?.length || 0} groups</div>
                                        <div className="flex items-center gap-1.5"><BookOpen size={12} />{exp.exercisesCount || exp.exercises?.length || 0} exercises</div>
                                        <div className="flex items-center gap-1.5"><Calendar size={12} />{exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : '—'}</div>
                                    </div>
                                    {exp.completionRate !== undefined && (
                                        <div className="ml-[52px]">
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{exp.completionRate}% complete</span>
                                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1.5">
                                                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${exp.completionRate}%` }} />
                                            </div>
                                        </div>
                                    )}
                                    {selectedExperiment?._id === exp._id && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"><ChevronRight size={20} /></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right: detail / empty */}
                    <div className="w-1/2 bg-[#0d1218]/50 border border-gray-800/50 rounded-2xl flex flex-col overflow-hidden relative">
                        {selectedExperiment ? (
                            <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">{selectedExperiment.name}</h2>
                                    <button className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1">Edit <ChevronRight size={14} /></button>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Status</label>
                                        {getStatusBadge(selectedExperiment.status)}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Description</label>
                                        <p className="text-sm text-gray-400 leading-relaxed">{selectedExperiment.description}</p>
                                    </div>
                                    <div className="pt-6 border-t border-gray-800/50">
                                        <p className="text-gray-600 text-[10px] italic">Experiment data loaded from registry</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-700 mb-6">
                                    <FlaskConical size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-400 mb-2">Select an experiment to view details</h3>
                                <p className="text-sm text-gray-600 max-w-xs mx-auto">Choose a study from the list to inspect its configuration, groups and progress.</p>
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

export default AdminExperiments;
