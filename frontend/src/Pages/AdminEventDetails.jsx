import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, DollarSign, MapPin, Save, Trash2, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

const categories = ["Music", "Sports", "Technology", "Business", "Arts", "Food", "Education", "Other"];
const fieldClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const AdminEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
   const [bookedTickets, setBookedTickets] = useState(0);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("admin event fetch");
      const response = await api.get(`/events/your-events/${id}`);
      console.log(response);
      setEvent(response.data.event);
      setLoading(false);
      setBookedTickets(Math.max(0, Number(response.data.event.capacity || 0) - Number(response.data.event.availableSeats || 0)));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load event.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleChange = ({ target }) => {
    const numericFields = ["price", "capacity"];
    setEvent((current) => ({
      ...current,
      [target.name]: numericFields.includes(target.name) ? Number(target.value) : target.value,
    }));
    setSuccess("");
    setError("");
  };

  const handleUpdate = async (submitEvent) => {
    submitEvent.preventDefault();
    setError("");
    setSuccess("");

    if (event.price < 0) {
      setError("Ticket price cannot be negative.");
      return;
    }

    if (Number(event.capacity) < bookedTickets) {
      setError("Capacity cannot be less than the tickets already sold.");
      return;
    }

    try {
      setSaving(true);
      const response = await api.put(`/events/${id}`, {
        title: event.title,
        description: event.description,
        category: event.category,
        venue: event.venue,
        location: event.location,
        date: event.date,
        time: event.time,
        price: Number(event.price),
        capacity: Number(event.capacity),
        availableSeats: Number(event.capacity) - bookedTickets,
      });
      setEvent(response.data.event);
      setBookedTickets(Math.max(0, Number(response.data.event.capacity || 0) - Number(response.data.event.availableSeats || 0)));
      setSuccess("Event details and ticket price updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setDeleting(true);
      await api.delete(`/events/${id}`);
      navigate("/admin");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to delete event.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 text-slate-600">Loading event details...</div>;
  }

  if (!event) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Event unavailable</h1>
        <p className="mt-2 text-slate-500">{error || "This event could not be found."}</p>
        <button type="button" onClick={() => navigate("/admin")} className="mt-5 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-blue-700">Back to dashboard</button>
      </div>
    );
  }  

  const formattedDate = event.date ? new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Date not set";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => navigate("/admin")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" /> Back to dashboard</button>
        <header className="mb-8 rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-lg sm:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Event management</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1><p className="mt-2 max-w-2xl text-slate-300">Update the event details, capacity, or ticket price from one place.</p></header>

        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <form onSubmit={handleUpdate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center justify-between border-b border-slate-100 pb-5"><div><h2 className="text-xl font-bold text-slate-900">Edit event</h2><p className="mt-1 text-sm text-slate-500">Changes are visible to ticket buyers immediately.</p></div><DollarSign className="h-6 w-6 text-blue-600" /></div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Event title" name="title" value={event.title || ""} onChange={handleChange} required className="md:col-span-2" />
              <label className="md:col-span-2"><span className="mb-2 block text-sm font-semibold text-slate-700">Description</span><textarea name="description" value={event.description || ""} onChange={handleChange} rows="5" required className={`${fieldClass} resize-y`} /></label>
              <label><span className="mb-2 block text-sm font-semibold text-slate-700">Category</span><select name="category" value={event.category || "Other"} onChange={handleChange} className={fieldClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <Field label="Venue" name="venue" value={event.venue || ""} onChange={handleChange} required />
              <Field label="Location" name="location" value={event.location || ""} onChange={handleChange} required />
              <Field label="Date" name="date" type="date" value={event.date?.substring(0, 10) || ""} onChange={handleChange} required />
              <Field label="Time" name="time" type="time" value={event.time || ""} onChange={handleChange} required />
              <Field label="Ticket price (INR)" name="price" type="number" min="0" value={event.price ?? 0} onChange={handleChange} required />
              <Field label="Total capacity" name="capacity" type="number" min={bookedTickets || 1} value={event.capacity ?? ""} onChange={handleChange} required />
            </div>
            <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row"><button type="button" onClick={handleDelete} disabled={deleting || saving} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" />{deleting ? "Deleting..." : "Delete event"}</button><button type="submit" disabled={saving || deleting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Saving changes..." : "Save changes"}</button></div>
          </form>

          <aside className="space-y-4"><div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm font-semibold text-blue-800">Current ticket price</p><p className="mt-2 text-4xl font-black text-slate-900">₹{Number(event.price || 0).toLocaleString("en-IN")}</p><p className="mt-1 text-sm text-blue-700">per ticket</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Event snapshot</h2><div className="mt-4 space-y-4"><Summary icon={CalendarDays} label="Date" value={formattedDate} /><Summary icon={Clock3} label="Time" value={event.time || "Not set"} /><Summary icon={MapPin} label="Venue" value={event.venue || "Not set"} /><Summary icon={Users} label="Tickets booked" value={`${bookedTickets} of ${event.capacity || 0}`} /></div></div></aside>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, className = "", ...props }) => <label className={className}><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><input {...props} className={fieldClass} /></label>;
const Summary = ({ icon: Icon, label, value }) => <div className="flex items-start gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-medium text-slate-700">{value}</p></div></div>;

export default AdminEventDetails;
