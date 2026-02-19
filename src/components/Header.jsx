import { useUserDetails } from "../hooks/useUserDetails";
import { useLocation } from "react-router-dom";

const Header = () => {
    const { user, loading } = useUserDetails();
    const location = useLocation();

    const isStudent = location.pathname.startsWith('/home') ||
        location.pathname.startsWith('/chat') ||
        location.pathname.startsWith('/exercises') ||
        location.pathname.startsWith('/history') ||
        location.pathname.startsWith('/settings');

    return (
        <header className="h-16 border-b border-gray-800 bg-[#0f1117] flex items-center justify-between px-8">
            <div className="text-sm font-semibold text-emerald-400 tracking-wide uppercase font-mono">
                {isStudent ? "Student Terminal" : "Admin Command Center"}
            </div>

            {!loading && user && (
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium">{user.email}</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 overflow-hidden">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold">{user.username?.charAt(0)}</span>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
