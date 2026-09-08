import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  TicketCheck,
} from "lucide-react";
import api from "../services/api.js";

const MyTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/bookings/my");

        const bookings = Array.isArray(response?.data?.bookings)
          ? response.data.bookings
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setTickets(bookings);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError.response?.data?.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.1),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4">
        <div className="w-full max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          <div className="mt-5 space-y-4">
            <div className="h-56 animate-pulse rounded-[24px] bg-slate-200" />
            <div className="h-56 animate-pulse rounded-[24px] bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.15)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100 backdrop-blur-sm">
                <TicketCheck size={14} />
                My bookings
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">Your tickets</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
                Keep track of every event, booking, and QR pass in one place.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">Total bookings</p>
              <p className="mt-1 text-3xl font-black text-white">{tickets.length}</p>
            </div>
          </div>
        </header>

        <div className="mt-8 space-y-6">
          {tickets.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 py-16 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800">No tickets yet</h2>
              <p className="mt-2 text-slate-500">Book an event to see your tickets here.</p>
              <Link
                to="/events"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
              >
                Explore events
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)
          )}
        </div>
      </div>
    </div>
  );
};

const TicketCard = ({ ticket }) => {
  const eventDate = new Date(ticket?.event?.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const bookingStatus = (ticket.bookingStatus || "confirmed").toLowerCase();
  const statusClasses =
    bookingStatus === "confirmed"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : bookingStatus === "pending"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-slate-200 text-slate-700 border-slate-300";

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.07)]">
      <div className="grid md:grid-cols-[0.9fr_1.6fr_0.7fr]">
        <div className="relative min-h-[220px] md:min-h-full">
          {ticket?.event?.banner ? (
            <img
              src={ticket.event.banner}
              alt={ticket?.event?.title || "Event banner"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-100 to-cyan-100 text-sm font-medium text-slate-500">
              No image
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-violet-200 bg-violet-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700">
              {ticket?.event?.category || "Event"}
            </span>

            <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusClasses}`}>
              {bookingStatus}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-[2rem]">
            {ticket?.event?.title || "Event details unavailable"}
          </h2>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <CalendarDays size={16} className="text-violet-600" />
              <span>{eventDate}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 size={16} className="text-violet-600" />
              <span>{ticket?.event?.time || "Time TBA"}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-violet-600" />
              <span>{ticket?.event?.location || "Location TBA"}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tickets</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{ticket.ticketQuantity ?? 1}</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
              <p className="mt-1 text-lg font-black text-violet-700">₹{ticket.totalPrice}</p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">Booking ID: {ticket._id}</p>
        </div>

        <div className="flex flex-col items-center justify-center border-t border-slate-200 bg-slate-50 p-5 md:border-l md:border-t-0">
          {ticket?.qrCode ? (
            <img
              src={ticket.qrCode}
              alt={`QR code for booking ${ticket.bookingReference || ticket._id}`}
              className="h-28 w-28 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-2 text-center text-[10px] font-medium text-slate-500">
              QR unavailable
            </div>
          )}

          <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
            {ticket?.qrCode ? "Scan at entry" : "Awaiting QR"}
          </p>

          <Link
            to={`/my-tickets/${ticket._id}`}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600"
          >
            View details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default MyTicket;