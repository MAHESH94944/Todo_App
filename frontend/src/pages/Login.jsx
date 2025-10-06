import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      window.location.hash = "#/todos";
    } catch (err) {
      setError(err?.body?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">Sign in to manage your todos</p>
        </div>

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Password
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-95">
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <a href="#/register" className="text-sm text-indigo-600">
            Don't have an account? Create one
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
