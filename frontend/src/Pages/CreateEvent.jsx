import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, Clock3, ImagePlus, MapPin, Ticket, Users } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialFormData = {
  title: "",
  description: "",
  category: "Music",
  venue: "",
  location: "",
  date: "",
  time: "",
  price: 0,
  capacity: 1,
};

const categoryOptions = [
  "Music",
  "Sports",
  "Technology",
  "Business",
  "Arts",
  "Food",
  "Education",
  "Other",
];

export const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isOrganizer = user?.role === "Organizer";
  const minimumDate = new Date().toISOString().split("T")[0];

  const formTitle = useMemo(
    () => (isOrganizer ? "Create a new event" : "Organizer access required"),
    [isOrganizer]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "price" || name === "capacity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setBanner(null);
      setBannerPreview("");
      return;
    }

    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isOrganizer) {
      setError("Only organizers can create events.");
      return;
    }

    const requiredFields = [
      "title",
      "description",
      "category",
      "venue",
      "location",
      "date",
      "time",
    ];

    const missingField = requiredFields.find((field) => !String(formData[field]).trim());

    if (missingField) {
      const fieldLabels = {
        title: "event title",
        description: "description",
        category: "category",
        venue: "venue",
        location: "location",
        date: "date",
        time: "time",
      };
      setError(`Please add an ${fieldLabels[missingField]}.`);
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      setError("Please enter a ticket price of 0 or more.");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) < 1) {
      setError("Capacity must be at least 1.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          payload.append(key, value);
        }
      });

      if (banner) {
        payload.append("banner", banner);
      }

      await api.post("/events", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Event created successfully!");
      setFormData(initialFormData);
      setBanner(null);
      setBannerPreview("");

      setTimeout(() => {
        navigate("/events");
      }, 900);
    } catch (submitError) {
      const message =
        submitError?.response?.data?.message ||
        "Something went wrong while creating the event.";
      setError(message);
      console.error("Create event error:", submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="relative mb-8 overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="flex items-center gap-3 text-sm font-medium text-violet-200">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
                <Ticket size={18} />
              </span>
              Organizer workspace
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">{formTitle}</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Bring your idea to life with the details guests need to show up ready.
            </p>
          </div>
        </header>

        {!isOrganizer ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-[0_16px_40px_rgba(120,53,15,0.08)]">
            <h2 className="text-xl font-bold">Organizer access required</h2>
            <p className="mt-2">
              Please log in with an Organizer account to create an event.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8">
            {error && (
              <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />
                {error}
              </div>
            )}

            {success && (
              <div role="status" className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                {success}
              </div>
            )}

            <div className="space-y-10">
              <section>
                <div className="mb-5 border-b border-slate-100 pb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">01 / The essentials</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">Set the scene</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">Event title <span className="text-violet-600">*</span></label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Summer Music Festival"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Description <span className="text-violet-600">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell people what makes this event special..."
                  required
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">Category <span className="text-violet-600">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="venue" className="mb-2 block text-sm font-semibold text-slate-700">Venue <span className="text-violet-600">*</span></label>
                <input
                  id="venue"
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Central Hall"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="location" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><MapPin size={16} className="text-cyan-600" /> Location <span className="text-violet-600">*</span></label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="New York, NY"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

                </div>
              </section>

              <section>
                <div className="mb-5 border-b border-slate-100 pb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">02 / Practical details</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">When and where</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label htmlFor="date" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><CalendarDays size={16} className="text-cyan-600" /> Date <span className="text-violet-600">*</span></label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={minimumDate}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label htmlFor="time" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Clock3 size={16} className="text-cyan-600" /> Time <span className="text-violet-600">*</span></label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label htmlFor="price" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Ticket size={16} className="text-cyan-600" /> Ticket price</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Users size={16} className="text-cyan-600" /> Capacity</label>
                <input
                  id="capacity"
                  type="number"
                  name="capacity"
                  min="1"
                  step="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="banner" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><ImagePlus size={17} className="text-amber-600" /> Event banner <span className="font-normal text-slate-400">(optional)</span></label>
                <input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="block w-full cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-700"
                />

                {bannerPreview && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                    <img src={bannerPreview} alt="Event banner preview" className="max-h-72 w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
              </section>

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => navigate("/events")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Creating event..." : "Create event"}
              </button>
            </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;