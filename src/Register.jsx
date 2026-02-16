import React, { useState } from "react";
import { ShieldCheck, UserPlus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-gray-200 flex items-center justify-center relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-md px-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={20} />
            <span className="font-semibold tracking-wide">LIT</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3 text-emerald-400">
            <UserPlus size={22} />
          </div>
          <h2 className="text-2xl font-semibold">Create Account</h2>
          <p className="text-gray-400 mt-1">
            Join the research platform
          </p>
        </div>

        {/* Role selector */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 mb-3 tracking-wide text-center">
            ACCOUNT TYPE
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setRole("user")}
              className={`flex-1 rounded-lg border py-2 text-sm transition ${
                role === "user"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              User
            </button>

            <button
              onClick={() => setRole("admin")}
              className={`flex-1 rounded-lg border py-2 text-sm transition ${
                role === "admin"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Full name */}
        <div className="mb-5">
          <label className="block text-xs text-gray-400 mb-2">
            FULL NAME
          </label>
          <input
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-xs text-gray-400 mb-2">
            EMAIL
          </label>
          <input
            type="email"
            placeholder="you@university.edu"
            className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
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
          />
        </div>

        {/* Confirm password */}
        <div className="mb-7">
          <label className="block text-xs text-gray-400 mb-2">
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg bg-[#111827] border border-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Sign up */}
        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-medium py-3 hover:brightness-110 transition">
          Sign up <ArrowRight size={16} />
        </button>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:underline"
            > Sign in
         </Link>

        </p>
      </div>
    </div>
  );
}
