import React from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
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

            <div className="w-full lg:w-1/2 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

                <div className="relative z-10 w-full max-w-md px-8">
                    <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
                    <p className="text-gray-400 mb-8">Sign up to get started</p>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block text-xs text-gray-400 mb-2">
                            EMAIL
                        </label>
                        <input
                            type="email"
                            placeholder="you@estin.dz"
                            className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-xs text-gray-400 mb-2">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs text-gray-400 mb-2">
                            CONFIRM PASSWORD
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                        />
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-medium py-3 hover:brightness-110 transition">
                        Sign up <ArrowRight size={16} />
                    </button>
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
