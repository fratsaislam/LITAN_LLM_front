import React, { useState, useRef, useEffect } from "react";
import Layout from "../../components/Layout";
import { Send, Bot, User, ChevronDown, LayoutGrid } from "lucide-react";

const StudentChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: "user", timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: `I'm your AI assistant using ${selectedModel}. How can I help you with your learning today?`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-[#0b0d12] relative">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Chat Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0b0d12]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">AI Chat</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:border-emerald-500/50 transition">
                {selectedModel} <ChevronDown size={14} />
              </button>
              {/* Dropdown would go here */}
            </div>
            <button className="p-2 text-gray-400 hover:text-white transition">
              <LayoutGrid size={18} />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Bot size={48} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">Start a conversation</h3>
                <p className="text-sm text-gray-400 mt-2">Type a message below to begin chatting with {selectedModel}.</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-emerald-500 text-black" : "bg-gray-800 text-emerald-400"
                    }`}>
                    {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`space-y-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                        ? "bg-emerald-600/20 text-emerald-50 border border-emerald-500/20"
                        : "bg-gray-800/50 text-gray-200 border border-gray-700"
                      }`}>
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-gray-500 px-1">{msg.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-[#0b0d12] via-[#0b0d12] to-transparent z-10">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-[#161b22] border border-gray-700 rounded-xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-600">AI can make mistakes. Check important info.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentChat;