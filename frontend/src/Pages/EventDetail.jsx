import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import api from "../services/api.js";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError.response?.data?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      setBooking(true);

      await api.post("/bookings", {
        eventId: event._id,
        ticketQuantity: quantity,
      });

      navigate("/my-tickets");
    } catch (bookingError) {
      console.error(bookingError);
      alert(bookingError.response?.data?.message || "Failed to book ticket");
    } finally {
      setBooking(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < event.availableSeats) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4">
        <div className="w-full max-w-6xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="h-80 animate-pulse rounded-[28px] bg-slate-200" />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="h-80 animate-pulse rounded-2xl bg-slate-200 md:col-span-2" />
            <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
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
          <Link
            to="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-violet-600"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-800">Event not found</h1>
          <Link
            to="/events"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-violet-600"
          >
            <ArrowLeft size={18} />
            Explore events
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = event.price * quantity;
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="space-y-6">
            <header className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="relative h-72 overflow-hidden sm:h-96">
                <img src={event.banner} alt={event.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/10" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    {event.category && (
                      <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                        {event.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100 backdrop-blur-sm">
                      <Sparkles size={12} />
                      {event.availableSeats > 0 ? `${event.availableSeats} seats left` : "Sold out"}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
                    {event.title}
                  </h1>
                </div>
              </div>
            </header>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-7">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoItem icon={<CalendarDays size={18} />} title="Date" value={formattedDate} />
                <InfoItem icon={<Clock3 size={18} />} title="Time" value={event.time || "Time TBA"} />
                <InfoItem icon={<MapPin size={18} />} title="Venue" value={event.venue || "Venue TBA"} />
                <InfoItem icon={<ShieldCheck size={18} />} title="Location" value={event.location || "Location TBA"} />
              </div>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-900">About this event</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{event.description}</p>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <h2 className="text-xl font-bold text-slate-900">Event availability</h2>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Total capacity</span>
                    <span className="font-semibold text-slate-900">{event.capacity ?? "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Available seats</span>
                    <span className="font-semibold text-emerald-600">{event.availableSeats ?? 0}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="
            lg:pl-2
          ">
            <div className="sticky top-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="flex items-center gap-2 text-violet-600">
                <Ticket size={18} />
                <h2 className="text-2xl font-bold text-slate-900">Book tickets</h2>
              </div>

              <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">Ticket price</p>
                <p className="mt-2 text-4xl font-black text-slate-900">₹{event.price}</p>
                <p className="text-sm text-slate-500">per ticket</p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-700">Number of tickets</p>
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="text-xl font-bold text-slate-900">{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= event.availableSeats}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>
                    {event.price} × {quantity}
                  </span>
                  <span className="font-semibold text-slate-900">₹{totalPrice}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-violet-700">₹{totalPrice}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBooking}
                disabled={booking || event.availableSeats === 0}
                className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {booking ? "Booking..." : event.availableSeats === 0 ? "Sold Out" : "Book tickets"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Secure checkout and instant ticket confirmation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, title, value }) => (
  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
      {icon}
    </div>

    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

export default EventDetail;