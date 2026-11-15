import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/register/Login";
import Register from "./pages/login/register/Register";
import StudentHome from "./pages/student/StudentHome";
import StudentChat from "./pages/student/StudentChat";
import StudentExercises from "./pages/student/StudentExercises";
import StudentHistory from "./pages/student/StudentHistory";
import StudentSettings from "./pages/student/StudentSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGroups from "./pages/admin/AdminGroups";
import AdminExercises from "./pages/admin/AdminExercises";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthBypassEnabled } from "./authBypass";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthBypassEnabled() ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Student routes */}
        <Route path="/home" element={<ProtectedRoute><StudentHome /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><StudentChat /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><StudentExercises /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><StudentHistory /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><StudentSettings /></ProtectedRoute>} />

        {/* Protected Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/groups" element={<ProtectedRoute adminOnly={true}><AdminGroups /></ProtectedRoute>} />
        <Route path="/admin/exercises" element={<ProtectedRoute adminOnly={true}><AdminExercises /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute adminOnly={true}><AdminSettings /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
