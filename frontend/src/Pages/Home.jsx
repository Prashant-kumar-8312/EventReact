import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../services/api";

import {
  ArrowRight,
  Calendar,
  MapPin,
  Music,
  Mic2,
  Palette,
  PartyPopper,
  Search,
  Sparkles,
  Star,
  Trophy,
  Utensils,
} from "lucide-react";

const CATEGORIES = [
  { label: "Music", icon: Music, count: "128 events" },
  { label: "Comedy", icon: Mic2, count: "42 events" },
  { label: "Arts", icon: Palette, count: "31 events" },
  { label: "Food & Drink", icon: Utensils, count: "57 events" },
  { label: "Nightlife", icon: PartyPopper, count: "89 events" },
  { label: "Sports", icon: Trophy, count: "24 events" },
];

const STEPS = [
  {
    title: "Find your vibe",
    desc: "Browse events by city, category, date, and mood so the night matches exactly what you want.",
  },
  {
    title: "Choose smart",
    desc: "Compare pricing, seats, and timing before you book so you know what you're getting.",
  },
  {
    title: "Ticket in hand",
    desc: "Confirm in minutes and access your QR pass instantly for a fast, smooth entrance.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Found a rooftop jazz night I would never have discovered on my own. Booking it took less than a minute.",
    name: "Aisha R.",
  },
  {
    quote:
      "The event details felt clear and trustworthy. Everything matched what I saw on the page and at the venue.",
    name: "Devansh K.",
  },
  {
    quote:
      "Fast checkout, clear pricing, and a simple QR ticket experience. It feels premium without complications.",
    name: "Priya M.",
  },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
       const response = await api.get("/events");

     //  console.log("home event" , response);

        const data = response.data;

       // console.log("Events:", data.events);

       setEvents(data.events);

       // console.log("Fetched events:", events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] text-slate-900">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-700">
              <Sparkles size={14} />
              Live this week in Pune
            </span>

            <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your next favorite night starts here.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover handpicked events, book in seconds, and get your QR ticket without the usual hassle.
            </p>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
              >
                Explore events
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/my-tickets"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-600"
              >
                My tickets
              </Link>
            </div>

            <div className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
              <Search size={18} className="text-slate-400" />
              <span className="text-sm text-slate-500">Search events, artists, venues, or cities…</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-violet-300/30 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-36 w-36 rounded-full bg-cyan-300/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
              <div className="rounded-[26px] bg-gradient-to-br from-slate-950 via-violet-900 to-violet-700 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">Featured</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">Weekend Pulse</h2>
                  </div>
                  <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                    <Sparkles size={18} className="text-violet-100" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-sm text-violet-100">
                    <span>Sat • Aug 22</span>
                    <span>7:30 PM</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold">Midnight Frequencies</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-200">
                    <MapPin size={14} />
                    The Foundry, Pune
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/30 px-4 py-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-violet-100">From</p>
                    <p className="mt-1 text-2xl font-black">₹1,200</p>
                  </div>

                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-violet-100"
                  >
                    Book now
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Events", value: "280+" },
                  { label: "Cities", value: "12" },
                  { label: "Happy fans", value: "18k" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <p className="text-2xl font-black text-slate-900">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="mx-auto max-w-7xl px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">Featured</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Events worth your time</h2>
          </div>

          <Link to="/events" className="hidden items-center gap-2 text-sm font-semibold text-slate-700 hover:text-violet-600 sm:inline-flex">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          { events.slice(0 , 4).map((event) => (
            <div
              key={event.id}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(79,70,229,0.12)]"
            >
              <div className="relative h-40 overflow-hidden" style={{ background: event.gradient }}>
                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  {event.category}
                </div>
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-2.5 py-1.5 text-center shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">{event.day}</div>
                  <div className="text-sm font-black text-slate-900">{event.date}</div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-violet-600" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-violet-600" />
                    <span>Doors open at 7:30 PM</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Starting at</p>
                    <p className="text-2xl font-black text-violet-700">{event.price}</p>
                  </div>

                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-600"
                  >
                    Book
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}



      <section className="mx-auto max-w-7xl px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24">
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
        Featured
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
        Events worth your time
      </h2>
    </div>

    <Link
      to="/events"
      className="hidden items-center gap-2 text-sm font-semibold text-slate-700 hover:text-violet-600 sm:inline-flex"
    >
      View all
      <ArrowRight size={16} />
    </Link>
  </div>

  {loading ? (
    <p className="text-center text-slate-500">
      Loading events...
    </p>
  ) : events.length === 0 ? (
    <p className="text-center text-slate-500">
      No events available
    </p>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {events.slice(0, 4).map((event) => (
        <div
          key={event._id}
          className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
        >
          {/* Banner */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.banner || "https://via.placeholder.com/500"}
              alt={event.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-600">
              {event.category}
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-xl font-bold text-slate-900">
              {event.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-violet-600" />
                <span>{event.venue}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-violet-600" />
                <span>
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Starting at
                </p>

                <p className="text-2xl font-black text-violet-700">
                  ₹{event.price}
                </p>
              </div>

              <Link
                to={`/events/${event._id}`}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-600"
              >
                View
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      <section className="bg-white py-18">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">Browse</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Find your kind of night</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {CATEGORIES.map(({ label, icon: Icon, count }) => (
              <div key={label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-200 hover:bg-violet-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Icon size={20} />
                </div>
                <p className="mt-4 text-lg font-bold text-slate-900">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">How it works</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Three simple steps</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-sm font-black text-violet-700">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">Reviews</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">People keep coming back</h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-base leading-7 text-slate-600">“{item.quote}”</p>
              <p className="mt-5 text-sm font-semibold text-slate-900">{item.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
