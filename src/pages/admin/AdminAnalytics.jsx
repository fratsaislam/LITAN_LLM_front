import React, { useState, useEffect } from 'react';
import {
    Download,
    Activity,
    Zap,
    Layers,
    TrendingUp
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosInstance from '../../api/axiosInstance';

/* ─── Pure-CSS/SVG chart building blocks ─────────────────────────────────── */

const BarChart = ({ data, color = '#10b981', maxValue }) => {
    const max = maxValue || Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex items-end gap-2 h-full w-full">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full rounded-t-md transition-all duration-700"
                        style={{
                            height: `${(item.value / max) * 100}%`,
                            backgroundColor: color,
                            opacity: 0.85,
                            minHeight: '4px'
                        }}
                    />
                    <span className="text-[9px] text-gray-600 font-mono">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const DonutChart = ({ segments }) => {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let cumulative = 0;
    const r = 60;
    const cx = 80, cy = 80;
    const strokeWidth = 22;

    const getArc = (start, end) => {
        const startAngle = (start / total) * 2 * Math.PI - Math.PI / 2;
        const endAngle = (end / total) * 2 * Math.PI - Math.PI / 2;
        const large = end - start > total / 2 ? 1 : 0;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    };

    return (
        <div className="flex items-center gap-6 justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160">
                {/* background ring */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
                {segments.map((seg, i) => {
                    const prev = cumulative;
                    cumulative += seg.value;
                    const d = getArc(prev, cumulative);
                    return (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="butt"
                        />
                    );
                })}
            </svg>
            <div className="space-y-2">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="text-[11px] text-gray-400 font-medium">{seg.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GroupedBarChart = ({ data, groups, colors }) => {
    const allValues = data.flatMap(d => groups.map(g => d[g] || 0));
    const max = Math.max(...allValues, 1);
    return (
        <div className="flex items-end gap-4 h-full w-full">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: '90%' }}>
                        {groups.map((g, gi) => (
                            <div key={g} className="flex-1 rounded-t-sm transition-all duration-700"
                                style={{
                                    height: `${((item[g] || 0) / max) * 100}%`,
                                    backgroundColor: colors[gi],
                                    minHeight: '4px',
                                    opacity: 0.85
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-[9px] text-gray-600 font-mono truncate w-full text-center">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

/* ─── Stat card ───────────────────────────────────────────────────────────── */
const StatCard = ({ title, value, sub, icon: Icon, color }) => (
    <div className="bg-[#0d1218]/50 border border-gray-800/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
            <Icon size={14} style={{ color }} />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">{title}</span>
        </div>
        <p className="text-3xl font-bold text-gray-100 mb-1">{value}</p>
        <p className="text-xs text-gray-500">{sub}</p>
    </div>
);

/* ─── Chart panel wrapper ─────────────────────────────────────────────────── */
const ChartPanel = ({ title, icon: Icon, iconColor = '#10b981', topRight, children, className = '' }) => (
    <div className={`bg-[#0d1218]/50 border border-gray-800/50 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
                <Icon size={15} style={{ color: iconColor }} />
                <span className="text-sm font-bold text-gray-300">{title}</span>
            </div>
            {topRight}
        </div>
        {children}
    </div>
);

/* ─── Main component ──────────────────────────────────────────────────────── */
const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axiosInstance.get('/analytics/overview');
                if (response.data.success) {
                    setAnalytics(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleExport = async (format) => {
        try {
            const response = await axiosInstance.get(`/analytics/export?format=${format}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error exporting ${format}:`, error);
        }
    };

    /* Derived data — falls back to zeros so charts render gracefully when api is not connected */
    const dailyConversations = analytics?.dailyConversations || [];
    const modelDistribution = analytics?.modelDistribution || [];
    const groupComparison = analytics?.groupComparison || [];
    const tokenConsumption = analytics?.tokenConsumption || [];

    const donutSegments = [
        { label: 'GPT-4', color: '#10b981', value: modelDistribution.find(m => m.model === 'GPT-4')?.count || 0 },
        { label: 'GPT-3.5', color: '#3b82f6', value: modelDistribution.find(m => m.model === 'GPT-3.5')?.count || 0 },
        { label: 'DeepSeek', color: '#a78bfa', value: modelDistribution.find(m => m.model === 'DeepSeek')?.count || 0 },
    ].filter(s => s.value > 0);

    const groupMetrics = ['groupA', 'groupB', 'groupC'];
    const groupColors = ['#10b981', '#a78bfa', '#6b7280'];

    return (
        <div className="flex h-screen bg-[#0b0f14] text-white overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0b0f14]">
                {/* Header */}
                <header className="px-8 py-10 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-emerald-500">Analytics</h1>
                            <p className="text-gray-500 font-mono text-xs mt-2 tracking-wide uppercase">
                                data insights & reports
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {['CSV', 'JSON'].map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => handleExport(fmt.toLowerCase())}
                                    className="flex items-center gap-2 bg-[#0d1218] border border-gray-800/50 hover:border-gray-700 text-gray-300 hover:text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
                                >
                                    <Download size={16} />
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50">
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
                        <p className="text-xs font-mono uppercase tracking-widest">Loading analytics...</p>
                    </div>
                ) : (
                    <div className="px-8 pb-10 space-y-6">
                        {/* Summary stat cards */}
                        {analytics?.summary && (
                            <div className="grid grid-cols-4 gap-4">
                                <StatCard title="Total Conversations" value={analytics.summary.totalConversations ?? '—'} sub="All time" icon={Activity} color="#10b981" />
                                <StatCard title="Active Users" value={analytics.summary.activeUsers ?? '—'} sub="Last 30 days" icon={TrendingUp} color="#3b82f6" />
                                <StatCard title="Completion Rate" value={`${analytics.summary.completionRate ?? '—'}%`} sub="Exercise avg" icon={Layers} color="#a78bfa" />
                                <StatCard title="Token Usage" value={analytics.summary.totalTokens?.toLocaleString() ?? '—'} sub="Total tokens" icon={Zap} color="#f59e0b" />
                            </div>
                        )}

                        {/* Row 1: Daily conversations + Model distribution */}
                        <div className="grid grid-cols-2 gap-6">
                            <ChartPanel
                                title="Daily Conversations"
                                icon={Activity}
                                topRight={
                                    <span className="text-[10px] font-bold text-gray-600 border border-gray-800 rounded-full px-2 py-0.5">
                                        last 7 days
                                    </span>
                                }
                            >
                                <div className="h-48 pt-2">
                                    {dailyConversations.length > 0 ? (
                                        <BarChart
                                            data={dailyConversations.map(d => ({ label: d.day, value: d.count }))}
                                            color="#10b981"
                                        />
                                    ) : (
                                        <div className="flex items-end gap-2 h-full w-full opacity-20">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                                    <div className="w-full rounded-t-md bg-gray-700" style={{ height: '30%' }} />
                                                    <span className="text-[9px] text-gray-600 font-mono">{day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ChartPanel>

                            <ChartPanel title="Model Distribution" icon={Layers} iconColor="#a78bfa">
                                <div className="h-48 flex items-center justify-center">
                                    {donutSegments.length > 0 ? (
                                        <DonutChart segments={donutSegments} />
                                    ) : (
                                        <p className="text-xs text-gray-600 italic">No model data yet</p>
                                    )}
                                </div>
                            </ChartPanel>
                        </div>

                        {/* Row 2: Group comparison + Token consumption */}
                        <div className="grid grid-cols-2 gap-6">
                            <ChartPanel title="Group Comparison" icon={Layers} iconColor="#10b981">
                                <div className="h-48 pt-2">
                                    {groupComparison.length > 0 ? (
                                        <GroupedBarChart
                                            data={groupComparison}
                                            groups={groupMetrics}
                                            colors={groupColors}
                                        />
                                    ) : (
                                        <div className="flex items-end gap-4 h-full w-full opacity-20">
                                            {['Engagement', 'Completion', 'Satisfaction', 'Tokens Used'].map(metric => (
                                                <div key={metric} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                                    <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: '90%' }}>
                                                        {groupColors.map((c, gi) => (
                                                            <div key={gi} className="flex-1 rounded-t-sm" style={{ height: `${60 + gi * 10}%`, backgroundColor: c }} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[8px] text-gray-600 font-mono truncate w-full text-center">{metric}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Legend */}
                                <div className="flex items-center gap-4 mt-3">
                                    {['Group A', 'Group B', 'Group C'].map((g, i) => (
                                        <div key={g} className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: groupColors[i] }} />
                                            <span className="text-[10px] text-gray-500">{g}</span>
                                        </div>
                                    ))}
                                </div>
                            </ChartPanel>

                            <ChartPanel title="Token Consumption" icon={Zap} iconColor="#f59e0b">
                                <div className="h-48 pt-2">
                                    {tokenConsumption.length > 0 ? (
                                        <BarChart
                                            data={tokenConsumption.map(d => ({ label: d.day, value: d.tokens }))}
                                            color="#f59e0b"
                                        />
                                    ) : (
                                        <div className="flex items-end gap-2 h-full w-full opacity-20">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                                    <div className="w-full rounded-t-md bg-amber-700" style={{ height: '50%' }} />
                                                    <span className="text-[9px] text-gray-600 font-mono">{day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ChartPanel>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminAnalytics;
