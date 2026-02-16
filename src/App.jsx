import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/register/Login";
import Register from "./pages/login/register/Register";
import StudentHome from "./pages/student/StudentHome";
import StudentChat from "./pages/student/StudentChat";
import StudentExercises from "./pages/student/StudentExercises";
import StudentHistory from "./pages/student/StudentHistory";
import StudentSettings from "./pages/student/StudentSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Student routes */}
        <Route path="/home" element={<ProtectedRoute><StudentHome /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><StudentChat /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><StudentExercises /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><StudentHistory /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><StudentSettings /></ProtectedRoute>} />

        {/* Protected Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
