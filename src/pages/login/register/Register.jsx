import React, { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setIsLoading(true);

        try {
            const response = await axiosInstance.post("/auth/signup", {
                username,
                email,
                phone,
                password,
            });

            if (response.data.success) {
                // Backend signup returns success: true and data: result
                // We could automatically log them in or redirect to login
                // Let's redirect to login for simplicity, as backend signup doesn't set cookie/token usually
                // Actually, backend signup in authController.js doesn't set cookie.
                navigate("/login");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError("");
        setIsLoading(true);

        try {
            const response = await axiosInstance.post("/auth/google", {
                idToken: credentialResponse.credential,
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
            setError(err.response?.data?.message || "Google sign-up failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google sign-up was unsuccessful");
    };

    return (
        <div className="min-h-screen w-full bg-[#0b0f14] text-gray-200 flex">
            {/* ... left side stays same ... */}
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
                            <span className="text-emerald-400">Join the</span>
                            <br />
                            Network
                        </h1>

                        <p className="mt-6 text-gray-400 max-w-md">
                            Create an account to start tracking, analyzing, and experimenting within the ecosystem.
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

            <div className="w-full lg:w-1/2 flex items-center justify-center relative py-12">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

                <div className="relative z-10 w-full max-w-md px-8">
                    <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
                    <p className="text-gray-400 mb-8">Sign up to get started</p>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        {/* Username */}
                        <div className="mb-5">
                            <label className="block text-xs text-gray-400 mb-2">
                                USERNAME
                            </label>
                            <input
                                type="text"
                                placeholder="JhonDoe"
                                className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                pattern="^[A-Za-z]+$"
                                title="Username should only contain letters"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Email */}
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

                        {/* Phone */}
                        <div className="mb-5">
                            <label className="block text-xs text-gray-400 mb-2">
                                PHONE
                            </label>
                            <input
                                type="tel"
                                placeholder="05XXXXXXXX"
                                className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                pattern="^\d{10}$"
                                title="Phone number should be 10 digits"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-5">
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
                            <p className="text-[10px] text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="block text-xs text-gray-400 mb-2">
                                CONFIRM PASSWORD
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-medium py-3 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Sign up"} <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0b0f14] px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            size="large"
                            width="100%"
                            text="signup_with"
                        />
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-emerald-400 cursor-pointer hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
