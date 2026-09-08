import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";
import api from "../services/api.js";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

const TicketDetails = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/bookings/${id}`);
        setTicket(response.data);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError.response?.data?.message || "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.1),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4">
        <div className="w-full max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.1),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 text-center">
        <div className="rounded-[28px] border border-red-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <h1 className="text-3xl font-black text-red-600">{error}</h1>
          <p className="mt-2 text-slate-500">Please try again or head back to your ticket list.</p>
          <Link
            to="/my-tickets"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-violet-600"
          >
            <ChevronLeft size={18} />
            Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket || !ticket.event) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xl font-semibold text-slate-800">Ticket not found.</p>
          <Link
            to="/my-tickets"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-violet-600"
          >
            <ChevronLeft size={18} />
            Return to tickets
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(ticket.event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const bookingDate = new Date(ticket.bookingDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusTone =
    ticket.bookingStatus === "confirmed"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : ticket.bookingStatus === "pending"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-slate-200 text-slate-700 border-slate-300";

  const paymentTone =
    ticket.paymentStatus === "paid"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/my-tickets"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-violet-600"
          >
            <ChevronLeft size={18} />
            Back to My Tickets
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone}`}>
              {ticket.bookingStatus || "Booked"}
            </span>
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${paymentTone}`}>
              {ticket.paymentStatus || "Pending"}
            </span>
          </div>
        </div>

        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
          <header className="relative h-72 overflow-hidden sm:h-80">
            <img
              src={ticket.event.banner}
              alt={ticket.event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-900/10" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  {ticket.event.category && (
                    <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                      {ticket.event.category}
                    </span>
                  )}
                  <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {ticket.event.title}
                  </h1>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200">Total paid</p>
                  <p className="mt-1 text-2xl font-black">{formatCurrency(ticket.totalPrice)}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.7fr_0.9fr] lg:p-8">
            <div className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <Ticket className="text-violet-600" size={18} />
                  <h2 className="text-xl font-bold text-slate-900">Event details</h2>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoItem icon={<CalendarDays size={18} />} label="Date" value={eventDate} />
                  <InfoItem icon={<Clock3 size={18} />} label="Time" value={ticket.event.time || "Time TBA"} />
                  <InfoItem icon={<MapPin size={18} />} label="Venue" value={ticket.event.venue || "Venue TBA"} />
                  <InfoItem icon={<ShieldCheck size={18} />} label="Location" value={ticket.event.location || "Location TBA"} />
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <ReceiptText className="text-violet-600" size={18} />
                  <h2 className="text-xl font-bold text-slate-900">Booking summary</h2>
                </div>

                <div className="mt-4 space-y-4">
                  <Row label="Booking ID" value={ticket._id} />
                  <Row label="Booking date" value={bookingDate} />
                  <Row label="Tickets" value={ticket.ticketQuantity ?? 1} />
                  <Row label="Total price" value={formatCurrency(ticket.totalPrice)} />
                  <Row
                    label="Payment status"
                    value={<span className="font-semibold capitalize text-emerald-600">{ticket.paymentStatus || "Pending"}</span>}
                  />
                  <Row
                    label="Booking status"
                    value={<span className="font-semibold capitalize text-slate-800">{ticket.bookingStatus || "Confirmed"}</span>}
                  />
                </div>
              </section>

              {ticket.user && (
                <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <UserRound className="text-violet-600" size={18} />
                    <h2 className="text-xl font-bold text-slate-900">Ticket holder</h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm">
                      <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                        <UserRound size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{ticket.user.name}</p>
                        <p className="text-sm text-slate-500">Guest ticket owner</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                      <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                        <Mail size={18} />
                      </div>
                      <p className="text-sm text-slate-600">{ticket.user.email}</p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-slate-900 bg-slate-900 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Your ticket</h2>
                  <div className="rounded-full bg-violet-500/20 p-2 text-violet-200">
                    <BadgeCheck size={18} />
                  </div>
                </div>

                <p className="mt-2 text-sm text-slate-300">Scan this QR code at the venue entrance.</p>

                {ticket.qrCode ? (
                  <img
                    src={ticket.qrCode}
                    alt="Ticket QR code"
                    className="mt-6 h-56 w-full rounded-[22px] bg-white p-3 object-contain shadow-lg"
                  />
                ) : (
                  <div className="mt-6 flex h-56 w-full items-center justify-center rounded-[22px] border border-dashed border-slate-700 bg-slate-800/60 text-sm text-slate-300">
                    QR code unavailable
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Booking ID</p>
                  <p className="mt-2 break-all text-sm font-semibold text-white">{ticket._id}</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-violet-600" size={18} />
                  <h3 className="text-lg font-bold text-slate-900">Need help?</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Have questions about this booking or need to make an update? Visit your ticket list for the latest information.
                </p>
                <Link
                  to="/my-tickets"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600"
                >
                  View all tickets
                </Link>
              </div>
            </aside>
          </div>

          <footer className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Paid</p>
                <p className="mt-1 text-2xl font-black text-violet-700">{formatCurrency(ticket.totalPrice)}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/my-tickets"
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  All My Tickets
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
      {icon}
    </div>

    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex flex-col gap-1 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="break-all text-sm font-semibold text-slate-900">{value}</span>
  </div>
);

export default TicketDetails;