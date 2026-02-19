import React, { useEffect, useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    if (token) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signin", {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        const authCheck = await axiosInstance.get("/auth/check");
        if (authCheck.data.success) {
          const user = authCheck.data.user;
          localStorage.setItem('role', user.role);

          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/home');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    // Keep demo login for testing if needed, or remove it for production
    const token = role === 'admin' ? 'dummy-admin-token' : 'dummy-student-token';
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', role);

    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-gray-200 flex">
      <div className="hidden lg:flex w-1/2 relative p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e1320] to-[#070a10]" />

        <div className="relative z-10 flex flex-col justify-between w-full">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={20} />
            <span className="font-semibold tracking-wide">LIT</span>
          </div>
          <div>
            <p className="text-emerald-400 text-sm mb-4 font-mono">
              &gt; system.init()
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              <span className="text-emerald-400">LLM Interaction</span>
              <br />
              Tracker
            </h1>

            <p className="mt-6 text-gray-400 max-w-md">
              Track, analyze, and experiment with AI conversations.
              Built for cybersecurity researchers and AI educators.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck size={14} /> Encrypted
            </span>
            <span>Privacy-first</span>
            <span>Open Research</span>
          </div>
        </div>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center relative">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 w-full max-w-md px-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to your account</p>


          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-xs text-gray-400 mb-2">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="you@estin.dz"
                className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>


            <div className="mb-6">
              <label className="block text-xs text-gray-400 mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>


            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-medium py-3 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"} <ArrowRight size={16} />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0b0f14] px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#111827] border border-gray-700 py-3 text-sm font-medium hover:border-emerald-400 transition"
              onClick={() => window.location.href = 'https://innotrack.onrender.com/api/auth/google'}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-emerald-400 cursor-pointer hover:underline">
              Sign up
            </Link>
          </p>
          <div className="mt-10">
            <p className="text-xs text-gray-500 mb-3 tracking-wide">
              QUICK DEMO ACCESS (DEV ONLY)
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => handleDemoLogin('student')}
                className="flex-1 rounded-lg border border-gray-700 py-2 text-sm hover:border-emerald-400 transition"
              >
                Student View
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="flex-1 rounded-lg border border-gray-700 py-2 text-sm hover:border-emerald-400 transition"
              >
                Admin View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
