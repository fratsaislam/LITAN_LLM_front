import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../api/axiosInstance";
import { Send, Bot, User, Plus, Trash2, MessageSquare, Loader2 } from "lucide-react";

const StudentChat = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Check for conversationId in URL and load it
  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId && conversations.length > 0) {
      // Check if this conversation exists in the list
      const exists = conversations.find(c => c._id === conversationId);
      if (exists) {
        loadConversation(conversationId);
        // Clear the query parameter after loading
        setSearchParams({});
      }
    }
  }, [searchParams, conversations]);

  const fetchConversations = async () => {
    setSidebarLoading(true);
    try {
      const res = await axiosInstance.get("/conv/user");
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setSidebarLoading(false);
    }
  };

  const loadConversation = async (convId) => {
    setIsLoading(true);
    setActiveConversationId(convId);
    try {
      const res = await axiosInstance.get(`/conv/${convId}`);
      if (res.data.success) {
        // Filter out system messages for display
        const displayMessages = res.data.data.messages.filter(
          (msg) => msg.role !== "system"
        );
        setMessages(displayMessages);
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const res = await axiosInstance.post("/conv/create");
      if (res.data.success) {
        const newConv = res.data.data;
        setConversations((prev) => [
          {
            _id: newConv._id,
            title: newConv.title,
            model: newConv.model,
            messageCount: 0,
            lastMessage: "",
            createdAt: newConv.createdAt,
            updatedAt: newConv.updatedAt,
          },
          ...prev,
        ]);
        setActiveConversationId(newConv._id);
        setMessages([]);
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    try {
      const res = await axiosInstance.delete(`/conv/${convId}`);
      if (res.data.success) {
        setConversations((prev) => prev.filter((c) => c._id !== convId));
        if (activeConversationId === convId) {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    // If no active conversation, create one first
    let convId = activeConversationId;
    if (!convId) {
      try {
        const res = await axiosInstance.post("/conv/create");
        if (res.data.success) {
          const newConv = res.data.data;
          convId = newConv._id;
          setConversations((prev) => [
            {
              _id: newConv._id,
              title: newConv.title,
              model: newConv.model,
              messageCount: 0,
              lastMessage: "",
              createdAt: newConv.createdAt,
              updatedAt: newConv.updatedAt,
            },
            ...prev,
          ]);
          setActiveConversationId(convId);
        }
      } catch (err) {
        console.error("Failed to create conversation:", err);
        return;
      }
    }

    const userContent = input.trim();
    setInput("");

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userContent }]);
    setIsSending(true);

    try {
      const res = await axiosInstance.post(`/conv/${convId}/message`, {
        content: userContent,
      });

      if (res.data.success) {
        const { assistantMessage, title } = res.data.data;
        setMessages((prev) => [...prev, assistantMessage]);

        // Update conversation title in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c._id === convId
              ? {
                  ...c,
                  title: title,
                  lastMessage: assistantMessage.content.substring(0, 100),
                  messageCount: c.messageCount + 2,
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      const status = err.response?.status;
      let errorMsg = err.response?.data?.message || "Failed to get AI response. Please try again.";
      if (status === 429) {
        errorMsg = "⏳ Rate limit reached. Please wait a minute and try again.";
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const activeConv = conversations.find((c) => c._id === activeConversationId);

  return (
    <Layout>
      <div className="flex h-full bg-[#0b0d12] relative">
        {/* Conversation Sidebar */}
        <div className="w-72 border-r border-gray-800 flex flex-col bg-[#0f1117]/50">
          <div className="p-4 border-b border-gray-800">
            <button
              onClick={createNewConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium hover:bg-emerald-500/20 transition"
            >
              <Plus size={16} /> New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {sidebarLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-gray-500" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare size={24} className="mx-auto text-gray-600 mb-2" />
                <p className="text-xs text-gray-500">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => loadConversation(conv._id)}
                  className={`w-full group p-3 text-left border-b border-gray-800/30 transition hover:bg-gray-800/30 relative ${
                    activeConversationId === conv._id ? "bg-emerald-500/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate group-hover:text-emerald-400 transition">
                        {conv.title}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">
                        {conv.lastMessage || "Empty conversation"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteConversation(conv._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {activeConversationId === conv._id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Chat Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0b0d12]/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                {activeConv?.title || "AI Chat"}
              </h2>
            </div>
            {activeConv && (
              <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-[10px] text-gray-400">
                {activeConv.model}
              </span>
            )}
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-emerald-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Bot size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    Start a conversation
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Type a message below to begin chatting with AI.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === "user"
                          ? "bg-emerald-500 text-black"
                          : "bg-gray-800 text-emerald-400"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div
                      className={`space-y-1 ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-emerald-600/20 text-emerald-50 border border-emerald-500/20"
                            : "bg-gray-800/50 text-gray-200 border border-gray-700"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isSending && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800 text-emerald-400">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-gradient-to-t from-[#0b0d12] via-[#0b0d12] to-transparent z-10">
            <form
              onSubmit={handleSend}
              className="max-w-4xl mx-auto relative group"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isSending}
                className="w-full bg-[#161b22] border border-gray-700 rounded-xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-gray-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
              >
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
            <div className="mt-2 text-center">
              <p className="text-[10px] text-gray-600">
                AI can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentChat;