import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Compass, LockKeyhole, Sparkles, UserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import RoleDropdown from "../components/RoleDropdown.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
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
    if (
      !formData.name.trim() ||
      !formData.role ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete every field to create your account.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Redirect
       
      navigate("/login");
      
    } catch (error) {
      console.error(error);
      const isConnectionError = error?.code === "ERR_NETWORK" || !error?.response;
      const message = isConnectionError
        ? "Connection error. Please make sure the backend server is running."
        : error?.response?.data?.message || "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_55%,#ecfeff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-sm lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 text-sm font-semibold text-cyan-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Compass size={19} />
              </span>
              Eventify
            </div>
            <p className="mt-20 max-w-sm text-sm font-bold uppercase tracking-[0.22em] text-violet-200">Your next chapter starts here</p>
            <h2 className="mt-5 max-w-md text-4xl font-black leading-tight tracking-tight xl:text-5xl">Find your people. Make it an event.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">A single place to discover memorable experiences or bring your own gathering to life.</p>
          </div>
          <div className="relative space-y-4 text-sm text-slate-200">
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Discover events that match your world</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Create a profile in under a minute</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Choose how you want to participate</div>
          </div>
        </aside>

        <main className="p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3 text-sm font-bold text-violet-700"><Sparkles size={18} /> Eventify</div>
            </div>
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><UserRound size={22} /></div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Create your account</h1>
              <p className="mt-3 text-slate-500">Join Eventify and start finding experiences worth showing up for.</p>
            </div>

        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <LockKeyhole className="mt-0.5 shrink-0" size={17} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
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

          <RoleDropdown
            value={formData.role}
            onChange={(role) =>
              setFormData((current) => ({
                ...current,
                role,
              }))
            }
          />

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength="6"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength="6"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="mt-7 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-700 hover:text-violet-900"
          >
            Login
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
      </div>
    </div>
  );
};

export default Register;