import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Home, MessageSquare, BookOpen, Clock, Settings } from "lucide-react";
import { useUserDetails } from "../hooks/useUserDetails";
import axiosInstance from "../api/axiosInstance";

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, loading } = useUserDetails();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/signout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("authToken");
            localStorage.removeItem("role");
            navigate("/login");
        }
    };

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${isActive
            ? "bg-emerald-500/10 text-emerald-400 font-medium"
            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
        }`;

    return (
        <aside className="w-64 bg-[#0f1117] border-r border-gray-800 flex flex-col h-full z-20">
            {/* Logo */}
            <div className="px-6 py-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
                    L
                </div>
                <span className="text-xl font-bold text-white tracking-tight">LIT</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                <p className="px-4 pt-4 pb-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    Learning
                </p>

                <NavLink to="/home" className={linkClasses}>
                    <Home size={18} />
                    <span>Home</span>
                </NavLink>

                <NavLink to="/chat" className={linkClasses}>
                    <MessageSquare size={18} />
                    <span>Chat</span>
                </NavLink>

                <NavLink to="/exercises" className={linkClasses}>
                    <BookOpen size={18} />
                    <span>Exercises</span>
                </NavLink>

                <NavLink to="/history" className={linkClasses}>
                    <Clock size={18} />
                    <span>History</span>
                </NavLink>

                <NavLink to="/settings" className={linkClasses}>
                    <Settings size={18} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            {/* User info & Logout */}
            <div className="p-4 border-t border-gray-800 space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-emerald-400 font-bold overflow-hidden">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <span>{loading ? "..." : (user?.username?.charAt(0) || "U")}</span>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-medium text-white truncate">
                            {loading ? "Loading..." : (user?.username || "Guest User")}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                            {user?.role || "student"}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
