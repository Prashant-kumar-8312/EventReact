import React from "react";
import { Ticket, Mail, MapPin, ArrowRight } from "lucide-react";

/* Inline social icons (avoids relying on lucide-react's icon set, which varies by version) */
const InstagramIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.6" />
    <circle cx="17.2" cy="6.8" r="1.1" fill={color} />
  </svg>
);

const FacebookIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 21v-7h2.3l.4-3H14V9c0-.9.3-1.5 1.6-1.5H17V4.9C16.7 4.9 15.8 4.8 14.8 4.8c-2.1 0-3.6 1.3-3.6 3.7V11H9v3h2.2v7h2.8z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const YoutubeIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="12" rx="4" stroke={color} strokeWidth="1.6" />
    <path d="M10.5 9.5L15 12l-4.5 2.5v-5z" fill={color} />
  </svg>
);

const COLUMNS = [
  {
    heading: "Explore",
    links: ["Browse events", "Venues", "Cities", "Gift cards", "Trending now"],
  },
  {
    heading: "For organizers",
    links: ["List your event", "Pricing", "Organizer dashboard", "Success stories"],
  },
  {
    heading: "Support",
    links: ["Help center", "Refund policy", "Contact us", "Trust & safety", "Accessibility"],
  },
  {
    heading: "Company",
    links: ["About Encore", "Careers", "Press", "Blog"],
  },
];

const CITIES = ["Pune", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Goa"];

const SOCIALS = [InstagramIcon, FacebookIcon, YoutubeIcon];

export default function Footer () {
  const vars = {
    "--bg": "#F4F5F7",
    "--surface": "#FFFFFF",
    "--accent": "#FFB648",
    "--accent2": "#8C7FF5",
    "--text": "#1C1E24",
    "--muted": "#646A76",
    "--line": "#D9DDE3",
  };

  return (
    <footer
      style={{
        ...vars,
        background: "linear-gradient(180deg, #FFFFFF 0%, var(--bg) 100%)",
        color: "var(--text)",
        borderTop: "1px solid var(--line)",
        width: "100%",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .display { font-family: 'Fraunces', serif; }
        .footer-link { transition: color 0.2s ease; }
        .footer-link:hover { color: #111827; }
        .city-pill { transition: background 0.2s ease, border-color 0.2s ease; }
        .city-pill:hover { background: #F9FAFB; border-color: var(--accent2); }
        .social-icon { transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
        .social-icon:hover { background: #F2ECFF; transform: translateY(-2px); box-shadow: 0 8px 18px rgba(140, 127, 245, 0.12); }
        .footer-cta { transition: transform 0.2s ease; }
        .footer-cta:hover { transform: scale(1.03); }
        .footer-input:focus { outline: none; border-color: var(--accent2) !important; }
        ::selection { background: rgba(140, 127, 245, 0.18); color: #1C1E24; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px 0" }}>
        {/* top: brand + newsletter */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "space-between",
            paddingBottom: 40,
            borderBottom: "1px dashed var(--line)",
          }}
        >
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Ticket size={20} color= "var(--accent2)" />
              <span className="display" style={{ fontSize: 20, fontWeight: 700 }}>
                Encore
              </span>
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>
              The nights worth remembering, booked in a minute. New shows added every week.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIALS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="social-icon"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#F8F9FB",
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={15} color="var(--text)" />
                </a>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 280 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Get the lineup in your inbox</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
              One email a week. New shows, presale codes, no spam.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FFFFFF",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  flex: 1,
                }}
              >
                <Mail size={14} color="var(--muted)" />
                <input
                  className="footer-input"
                  placeholder="you@email.com"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text)",
                    fontSize: 13,
                    width: "100%",
                  }}
                />
              </div>
              <button
                className="footer-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background : "var(--accent2)" , 
                  color: "#111827",
                  border: "none",
                  borderRadius: 8,
                  padding: "0 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Subscribe
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* middle: link columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 32,
            padding: "40px 0",
          }}
        >
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--accent2)", fontWeight: 600, marginBottom: 14 }}>
                {col.heading.toUpperCase()}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer-link" style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none" }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* popular cities */}
        <div style={{ padding: "8px 0 40px", borderTop: "1px" }}>
          {/* <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "24px 0 14px" }}>
            <MapPin size={13} color="var(--muted)" />
            <p style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 600, margin: 0 }}>
              POPULAR CITIES
            </p>
          </div> */}
          {/* <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CITIES.map((city) => (
              <a
                key={city}
                href="#"
                className="city-pill"
                style={{
                  fontSize: 13,
                  color: "var(--text)",
                  textDecoration: "none",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  padding: "6px 14px",
                }}
              >
                {city}
              </a>
            ))}
          </div> */}
        </div>

        {/* bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 0 28px",
            borderTop: "1px solid var(--line)",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--muted)" }}>© {new Date().getFullYear()} Encore. All tickets, all night.</span>

          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" className="footer-link" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="#" className="footer-link" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
              Terms
            </a>
            <a href="#" className="footer-link" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
