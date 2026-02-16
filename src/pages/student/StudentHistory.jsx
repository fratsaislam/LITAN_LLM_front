import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { MessageSquare, Calendar, Cpu, Hash, Search, Trash2, ArrowUpRight } from 'lucide-react';

const StudentHistory = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Mock dynamic data structure for chat history
    const history = [
        {
            id: 1,
            title: "Can you explain photosynthesis like I'm five?",
            model: "GPT-4",
            tokens: 1250,
            date: "2025-01-16",
            messages: [
                { role: 'user', text: "Can you explain photosynthesis like I'm five?" },
                { role: 'ai', text: "Imagine plants have tiny little kitchens inside their leaves. They use sunlight, water, and air to cook their own food. That's photosynthesis!" }
            ]
        },
        {
            id: 2,
            title: "React Hooks vs Class Components",
            model: "GPT-3.5",
            tokens: 2800,
            date: "2025-01-14",
            messages: [
                { role: 'user', text: "What's the difference between hooks and classes?" },
                { role: 'ai', text: "Hooks allow you to use state and other React features without writing a class. They make code more reusable and readable." }
            ]
        },
        {
            id: 3,
            title: "Cybersecurity Best Practices",
            model: "Claude 3",
            tokens: 4200,
            date: "2025-01-10",
            messages: [
                { role: 'user', text: "How to stay safe online?" },
                { role: 'ai', text: "Use strong passwords, enable 2FA, and be wary of phishing emails." }
            ]
        }
    ];

    const filteredHistory = history.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        {filteredHistory.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full p-5 text-left border-b border-gray-800/30 transition-all hover:bg-gray-800/30 group relative ${selectedChat?.id === chat.id ? 'bg-emerald-500/5' : ''
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
                                            <Hash size={10} /> {chat.tokens}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} /> {chat.date}
                                        </span>
                                    </div>
                                </div>
                                {selectedChat?.id === chat.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                                )}
                            </button>
                        ))}
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
                                        <span>{selectedChat.tokens} tokens</span>
                                        <span>•</span>
                                        <span>{selectedChat.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-500 hover:text-red-400 transition hover:bg-red-400/10 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm hover:bg-emerald-500/20 transition">
                                        Continue <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedChat.messages.map((msg, i) => (
                                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                                ? 'bg-emerald-600/10 text-emerald-50 border border-emerald-500/20 rounded-tr-none'
                                                : 'bg-gray-800/40 text-gray-300 border border-gray-700 rounded-tl-none'
                                            }`}>
                                            <p className="font-mono text-[10px] uppercase text-gray-500 mb-1">{msg.role}</p>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
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