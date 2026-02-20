import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';
import { MessageSquare, Calendar, Cpu, Search, Trash2, ArrowUpRight, Bot, User, Loader2 } from 'lucide-react';

const StudentHistory = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/conv/user");
            if (res.data.success) {
                setConversations(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadConversationDetail = async (conv) => {
        setSelectedChat(conv);
        setDetailLoading(true);
        try {
            const res = await axiosInstance.get(`/conv/${conv._id}`);
            if (res.data.success) {
                const msgs = res.data.data.messages.filter((m) => m.role !== "system");
                setSelectedMessages(msgs);
            }
        } catch (err) {
            console.error("Failed to load conversation:", err);
        } finally {
            setDetailLoading(false);
        }
    };

    const deleteConversation = async (convId, e) => {
        e.stopPropagation();
        try {
            const res = await axiosInstance.delete(`/conv/${convId}`);
            if (res.data.success) {
                setConversations((prev) => prev.filter((c) => c._id !== convId));
                if (selectedChat?._id === convId) {
                    setSelectedChat(null);
                    setSelectedMessages([]);
                }
            }
        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
    };

    const continueChat = (convId) => {
        navigate('/chat');
    };

    const filteredHistory = conversations.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <Layout>
            <div className="flex h-full bg-[#0b0d12]">
                {/* History List */}
                <div className="w-96 border-r border-gray-800 flex flex-col bg-[#0f1117]/50">
                    <div className="p-6 border-b border-gray-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <MessageSquare size={18} />
                                <h2 className="font-semibold text-white">Chat History</h2>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#161b22] border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={24} className="animate-spin text-gray-500" />
                            </div>
                        ) : filteredHistory.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <MessageSquare size={32} className="mx-auto text-gray-600 mb-3" />
                                <p className="text-sm text-gray-500">
                                    {searchQuery ? "No matching conversations" : "No conversations yet"}
                                </p>
                            </div>
                        ) : (
                            filteredHistory.map((chat) => (
                                <button
                                    key={chat._id}
                                    onClick={() => loadConversationDetail(chat)}
                                    className={`w-full p-5 text-left border-b border-gray-800/30 transition-all hover:bg-gray-800/30 group relative ${
                                        selectedChat?._id === chat._id ? 'bg-emerald-500/5' : ''
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-200 group-hover:text-emerald-400 transition line-clamp-1">
                                            {chat.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Cpu size={10} /> {chat.model}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare size={10} /> {chat.messageCount} msgs
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={10} /> {formatDate(chat.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedChat?._id === chat._id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Detail View */}
                <div className="flex-1 overflow-y-auto p-12 relative flex flex-col">
                    {/* Grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    {selectedChat ? (
                        <div className="max-w-4xl w-full mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{selectedChat.title}</h1>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700">{selectedChat.model}</span>
                                        <span>•</span>
                                        <span>{selectedChat.messageCount} messages</span>
                                        <span>•</span>
                                        <span>{formatDate(selectedChat.updatedAt)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => deleteConversation(selectedChat._id, e)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition hover:bg-red-400/10 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => continueChat(selectedChat._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm hover:bg-emerald-500/20 transition"
                                    >
                                        Continue <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </div>

                            {detailLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 size={24} className="animate-spin text-gray-500" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {selectedMessages.map((msg, i) => (
                                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                    msg.role === 'user' ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-emerald-400'
                                                }`}>
                                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                                </div>
                                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                                    msg.role === 'user'
                                                        ? 'bg-emerald-600/10 text-emerald-50 border border-emerald-500/20'
                                                        : 'bg-gray-800/40 text-gray-300 border border-gray-700'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <MessageSquare size={64} className="mb-4 text-emerald-400" />
                            <h3 className="text-xl font-medium text-white">Select a conversation</h3>
                            <p className="text-sm text-gray-500 mt-2">Browse your past interactions on the left.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StudentHistory;