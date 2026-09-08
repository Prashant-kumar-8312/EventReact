// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../services/api.js";
// import eventData from "../data/eventData.js";

// function normalizeEventsResponse(payload) {
//   if (Array.isArray(payload)) {
//     return payload;
//   }

//   if (Array.isArray(payload?.events)) {
//     return payload.events;
//   }

//   if (Array.isArray(payload?.data?.events)) {
//     return payload.data.events;
//   }

//   if (payload?.event && typeof payload.event === "object") {
//     return [payload.event];
//   }

//   return [];
// }

// const Events = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [sort, setSort] = useState("");

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await api.get("/events");
//         console.log("events " , response);
//         const fetchedEvents = normalizeEventsResponse(response?.data);

//         if (fetchedEvents.length > 0) {
//           setEvents(fetchedEvents);
//         } else {
//           setEvents(eventData);
//           setError("No live events found yet. Showing sample events.");
//         }
//       } catch (fetchError) {
//         console.error(fetchError);
//         setEvents(eventData);
//         setError("Could not load live events. Showing sample events.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const categories = useMemo(() => {
//     return [...new Set(events.map((event) => event.category).filter(Boolean))].sort();
//   }, [events]);

//   const visibleEvents = useMemo(() => {
//     const normalizedSearch = search.trim().toLowerCase();

//     let filtered = events.filter((event) => {
//       const matchesCategory = !category || event.category === category;
//       const matchesSearch =
//         !normalizedSearch ||
//         event.title?.toLowerCase().includes(normalizedSearch) ||
//         event.description?.toLowerCase().includes(normalizedSearch) ||
//         event.location?.toLowerCase().includes(normalizedSearch);

//       return matchesCategory && matchesSearch;
//     });

//     if (sort === "dateAsc") {
//       filtered = [...filtered].sort(
//         (first, second) => new Date(first.date) - new Date(second.date)
//       );
//     }

//     if (sort === "dateDesc") {
//       filtered = [...filtered].sort(
//         (first, second) => new Date(second.date) - new Date(first.date)
//       );
//     }

//     if (sort === "priceAsc") {
//       filtered = [...filtered].sort((first, second) => first.price - second.price);
//     }

//     if (sort === "priceDesc") {
//       filtered = [...filtered].sort((first, second) => second.price - first.price);
//     }

//     return filtered;
//   }, [events, search, category, sort]);

//   const hasActiveFilters = Boolean(search.trim() || category || sort);

//   const clearFilters = () => {
//     setSearch("");
//     setCategory("");
//     setSort("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-12">
//       <div className="mx-auto max-w-7xl">
//         <div
//           className="mb-8 rounded-2xl bg-indigo-600 p-7 text-white shadow-lg"
//           style={{
//             backgroundImage:
//               "linear-gradient(90deg, rgb(79 70 229) 0%, rgb(99 102 241) 48%, rgb(59 130 246) 100%)",
//           }}
//         >
//           <h1 className="text-4xl font-bold text-white">Browse Events</h1>

//           <p className="mt-2 text-indigo-100">Find and book your next event</p>

//           <p className="mt-4 text-sm text-indigo-100">
//             Showing {visibleEvents.length} of {events.length} events
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
//             {error}
//           </div>
//         )}

//         <div className="mb-8 grid gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-3">
//           <input
//             type="text"
//             placeholder="Search events..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
//           />

//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All Categories</option>
//             {categories.map((categoryOption) => (
//               <option key={categoryOption} value={categoryOption}>
//                 {categoryOption}
//               </option>
//             ))}
//           </select>

//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">Sort By</option>
//             <option value="dateAsc">Date: Earliest</option>
//             <option value="dateDesc">Date: Latest</option>
//             <option value="priceAsc">Price: Low to High</option>
//             <option value="priceDesc">Price: High to Low</option>
//           </select>

//           <button
//             type="button"
//             onClick={clearFilters}
//             disabled={!hasActiveFilters}
//             className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-3"
//           >
//             Clear Filters
//           </button>
//         </div>

//         {loading && (
//           <div className="py-20 text-center text-gray-500">Loading events...</div>
//         )}

//         {!loading && visibleEvents.length === 0 && (
//           <div className="py-20 text-center">
//             <h2 className="text-2xl font-semibold">No events found</h2>

//             <p className="mt-2 text-gray-500">Try changing your search or filters.</p>
//           </div>
//         )}

//         {!loading && visibleEvents.length > 0 && (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {visibleEvents.map((event) => (
//               <EventCard key={event._id} event={event} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const EventCard = ({ event }) => {
//   const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   const formattedPrice = new Intl.NumberFormat("en-IN").format(event.price ?? 0);

//   return (
//     <div className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
//       <div className="h-52 bg-gray-200">
//         {event.banner ? (
//           <img src={event.banner} alt={event.title} className="h-full w-full object-cover" />
//         ) : (
//           <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
//         )}
//       </div>

//       <div className="p-5">
//         <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">
//           {event.category}
//         </span>

//         <h2 className="mt-3 line-clamp-1 text-xl font-bold">{event.title}</h2>

//         <p className="mt-2 line-clamp-2 text-sm text-gray-600">{event.description}</p>

//         <div className="mt-4 space-y-2 text-sm text-gray-600">
//           <p>📅 {formattedDate}</p>
//           <p>🕐 {event.time || "Time TBA"}</p>
//           <p>📍 {event.location || "Location TBA"}</p>
//           <p>🏛️ {event.venue || "Venue TBA"}</p>
//         </div>

//         <div className="mt-5 flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-500">Price</p>
//             <p className="text-xl font-bold text-indigo-600">₹{formattedPrice}</p>
//           </div>

//           <div className="text-right">
//             <p className="text-sm text-gray-500">Seats</p>
//             <p
//               className={
//                 (event.availableSeats ?? 0) > 0
//                   ? "font-semibold text-green-600"
//                   : "font-semibold text-red-600"
//               }
//             >
//               {(event.availableSeats ?? 0) > 0
//                 ? `${event.availableSeats} left`
//                 : "Sold Out"}
//             </p>
//           </div>
//         </div>

//         <Link
//           to={`/events/${event._id}`}
//           className="mt-5 block rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
//         >
//           View Details
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Events;







import { memo, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Ticket,
} from "lucide-react";
import api from "../services/api.js";
import eventData from "../data/eventData.js";

function normalizeEventsResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.events)) {
    return payload.events;
  }

  if (Array.isArray(payload?.data?.events)) {
    return payload.data.events;
  }

  if (payload?.event && typeof payload.event === "object") {
    return [payload.event];
  }

  return [];
}

function formatEventDate(date) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date TBA";
  }

  return parsed.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const SEARCH_DEBOUNCE_MS = 300;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/events");
        if (!isMounted) return;

        const fetchedEvents = normalizeEventsResponse(response?.data);

        if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
        } else {
          setEvents(eventData);
          setError("No live events found yet. Showing sample events.");
        }
      } catch (fetchError) {
        if (!isMounted) return;
        console.error("Failed to fetch events:", fetchError);
        setEvents(eventData);
        setError("Could not load live events. Showing sample events.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const categories = useMemo(() => {
    return [...new Set(events.map((event) => event.category).filter(Boolean))].sort();
  }, [events]);

  const visibleEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesCategory = !category || event.category === category;
      const matchesSearch =
        !debouncedSearch ||
        event.title?.toLowerCase().includes(debouncedSearch) ||
        event.description?.toLowerCase().includes(debouncedSearch) ||
        event.location?.toLowerCase().includes(debouncedSearch);

      return matchesCategory && matchesSearch;
    });

    if (sort === "dateAsc") {
      filtered = [...filtered].sort(
        (first, second) => new Date(first.date) - new Date(second.date)
      );
    }

    if (sort === "dateDesc") {
      filtered = [...filtered].sort(
        (first, second) => new Date(second.date) - new Date(first.date)
      );
    }

    if (sort === "priceAsc") {
      filtered = [...filtered].sort((first, second) => (first.price ?? 0) - (second.price ?? 0));
    }

    if (sort === "priceDesc") {
      filtered = [...filtered].sort((first, second) => (second.price ?? 0) - (first.price ?? 0));
    }

    return filtered;
  }, [events, debouncedSearch, category, sort]);

  const hasActiveFilters = Boolean(search.trim() || category || sort);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[32px] border border-white/40 bg-slate-950 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-cyan-500/25 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-violet-100 backdrop-blur-sm">
                <Sparkles size={14} /> Curated experiences
              </span>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Find your next unforgettable event
              </h1>

              <p className="mt-3 max-w-xl text-base text-slate-200 sm:text-lg">
                Discover music nights, festivals, workshops, and premium local experiences designed to match your vibe.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-100">
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-2 backdrop-blur-sm">
                  {visibleEvents.length} live events
                </div>
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-2 backdrop-blur-sm">
                  {categories.length} categories
                </div>
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-2 backdrop-blur-sm">
                  Easy booking
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Trending this week</p>
                <Ticket className="text-violet-200" size={18} />
              </div>

              <div className="mt-4 space-y-3">
                {visibleEvents.slice(0, 3).map((event) => (
                  <div key={event._id ?? event.title} className="rounded-2xl border border-white/10 bg-slate-900/50 p-3">
                    <p className="text-sm font-semibold text-white">{event.title}</p>
                    <p className="mt-1 text-xs text-slate-300">
                      {event.category || "Featured event"} • {event.location || "Location TBA"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
          >
            {error}
          </div>
        )}

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="event-search"
                type="text"
                placeholder="Search events, venues, or moods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                id="event-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              >
                <option value="">All Categories</option>
                {categories.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
              </select>
            </div>

            <select
              id="event-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            >
              <option value="">Sort by</option>
              <option value="dateAsc">Date: Earliest</option>
              <option value="dateDesc">Date: Latest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-violet-700">
                {visibleEvents.length} results
              </span>
              {category && (
                <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-cyan-700">{category}</span>
              )}
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear filters
            </button>
          </div>
        </section>

        {loading && <EventGridSkeleton />}

        {!loading && visibleEvents.length === 0 && (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white/70 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">No events match your search</h2>
            <p className="mt-2 text-slate-500">Try a different keyword or clear the filters to explore more options.</p>
          </div>
        )}

        {!loading && visibleEvents.length > 0 && (
          <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleEvents.map((event, index) => (
              <EventCard key={event._id ?? `${event.title}-${index}`} event={event} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

const EventGridSkeleton = () => (
  <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="h-56 animate-pulse bg-slate-200" />
        <div className="space-y-3 p-5">
          <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
);

const EventCard = memo(({ event }) => {
  const formattedDate = formatEventDate(event.date);
  const formattedPrice = new Intl.NumberFormat("en-IN").format(event.price ?? 0);
  const seats = event.availableSeats ?? 0;
  const isAvailable = seats > 0;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(79,70,229,0.14)]">
      <div className="relative h-56 overflow-hidden">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title || "Event banner"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-100 to-cyan-100 text-slate-400">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

        <div className="absolute left-4 top-4">
          {event.category && (
            <span className="rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {event.category}
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {formattedDate}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isAvailable ? "bg-emerald-400 text-emerald-950" : "bg-rose-400 text-rose-950"
            }`}
          >
            {isAvailable ? `${seats} left` : "Sold out"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-2 min-h-[3.1rem] text-2xl font-bold tracking-tight text-slate-900">
          {event.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{event.description}</p>

        <div className="mt-5 space-y-2.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-violet-500" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={16} className="text-violet-500" />
            <span>{event.time || "Time TBA"}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-violet-500" />
            <span>{event.location || "Location TBA"}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">From</p>
            <p className="mt-1 text-2xl font-black text-slate-900">₹{formattedPrice}</p>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600"
          >
            Reserve
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
});

EventCard.displayName = "EventCard";

export default Events;

