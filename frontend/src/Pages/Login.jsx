import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Compass, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
 
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login({
      
        email: formData.email,
        password: formData.password,
       
      });



      navigate("/events");

    } catch (error) {
      console.error(error);
      const isConnectionError = error?.code === "ERR_NETWORK" || !error?.response;
      setError(
        isConnectionError
          ? "Connection error. Please make sure the backend server is running."
          : error?.response?.data?.message || "Those details did not work. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_32%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_55%,#ecfeff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr]">
        <main className="order-2 p-6 sm:p-10 lg:order-1 lg:p-14">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3 text-sm font-bold text-violet-700"><Sparkles size={18} /> Eventify</div>
            </div>
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><LockKeyhole size={22} /></div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome back</h1>
              <p className="mt-3 text-slate-500">Sign in to pick up where your next experience begins.</p>
            </div>

        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <LockKeyhole className="mt-0.5 shrink-0" size={17} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Mail size={16} className="text-cyan-600" /> Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

         

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-7 text-center text-sm text-slate-600">
          New to Eventify?{" "}
          <Link
            to="/register"
            className="font-semibold text-violet-700 hover:text-violet-900"
          >
            Create Account
          </Link>

        </div>

        <div className="mt-5 text-center">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ← Back to Home
          </Link>

        </div>

          </div>
        </main>

        <aside className="relative order-1 hidden overflow-hidden bg-slate-950 p-10 text-white lg:order-2 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 text-sm font-semibold text-cyan-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Compass size={19} /></span>
              Eventify
            </div>
            <p className="mt-20 max-w-sm text-sm font-bold uppercase tracking-[0.22em] text-violet-200">The good stuff is waiting</p>
            <h2 className="mt-5 max-w-md text-4xl font-black leading-tight tracking-tight xl:text-5xl">Your next memorable night is closer than you think.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">Return to your saved events, tickets, and the experiences you have not discovered yet.</p>
          </div>
          <div className="relative space-y-4 text-sm text-slate-200">
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> One account for every experience</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Keep your tickets close at hand</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Pick up right where you left off</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Login;