import { useEffect, useState } from "react";
import { CalendarDays, ChevronRight, IndianRupee, RefreshCw, Ticket, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [bookedTickets, setBookedTickets] = useState(0);
  const [eventSales, setEventSales] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsRes, eventsRes, salesRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/events/my-events"),
        api.get("/dashboard/event-sales"),
      ]);

      setStats(statsRes.data || {});
      setUpcomingEvents(eventsRes.data?.events || []);
      setEventSales(salesRes.data?.salesData || []);
    } catch (requestError) {
      console.error("Error loading dashboard:", requestError);
      const message = requestError.response?.data?.message;
      setError(message || "We could not load the dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const metricCards = [
    { label: "Events hosted", value: stats.totalEvents || 0, icon: CalendarDays, color: "text-blue-700 bg-blue-50" },
    { label: "Paid bookings", value: stats.totalBookings || 0, icon: Users, color: "text-emerald-700 bg-emerald-50" },
    { label: "Tickets sold", value: stats.ticketSold || 0, icon: Ticket, color: "text-amber-700 bg-amber-50" },
    { label: "Total revenue", value: currency.format(stats.totalRevenue || 0), icon: IndianRupee, color: "text-rose-700 bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Organizer workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Dashboard overview</h1>
            <p className="mt-2 text-slate-500">Keep an eye on your events, ticket volume, and earnings.</p>
          </div>
          {/* <button type="button" onClick={fetchDashboardData} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700">
            <RefreshCw className="h-4 w-4" />
            Refresh data
          </button> */}
        </header>

        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard metrics">
          {metricCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`rounded-lg p-2 ${color}`}><Icon className="h-5 w-5" /></span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.45fr]">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div><h2 className="font-semibold text-slate-900">Your events</h2><p className="mt-1 text-sm text-slate-500">Upcoming events at a glance</p></div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{upcomingEvents.length}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingEvents.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">No events created yet.</p> : upcomingEvents.slice(0, 5).map((event) => (
                <button key={event._id} type="button" onClick={() => navigate(`/admin/events/${event._id}`)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50">
                  <span className="min-w-0"><span className="block truncate font-semibold text-slate-800">{event.title}</span><span className="mt-1 block truncate text-sm text-slate-500">{event.venue}</span></span>
                  <span className="flex shrink-0 items-center gap-2 text-right text-sm text-slate-500">{new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Event performance</h2><p className="mt-1 text-sm text-slate-500">Paid tickets and revenue by event</p></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-130 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Event</th><th className="px-5 py-3 font-semibold">Tickets</th><th className="px-5 py-3 text-right font-semibold">Revenue</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {eventSales.length === 0 ? <tr><td colSpan="3" className="px-5 py-10 text-center text-slate-500">No paid ticket sales yet.</td></tr> : eventSales.map((sale) => <tr key={sale.eventId} className="text-slate-700"><td className="max-w-65 truncate px-5 py-4 font-medium text-slate-800">{sale.title}</td><td className="px-5 py-4">{sale.ticketSold || 0}</td><td className="px-5 py-4 text-right font-semibold text-slate-900">{currency.format(sale.revenue || 0)}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashBoard;