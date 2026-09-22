import React from "react";
import { useSelector } from "react-redux";
import {
  Map,
  Navigation,
  MapPin,
  Mail,
  Clock,
  ArrowUpRight,
  Compass,
  Building2,
  Search,
  MessageSquare,
  Sparkles,
  ChevronUp,
  Hospital,
  PhoneCall,
  CalendarDays,
  ExternalLink
} from "lucide-react";

const Footer = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth?.isAuthenticated
  );

  // =========================================================
  // QUICK LINKS
  // =========================================================

  const quickLinks = [
    {
      name: "Home Page",
      href: "/",
      icon: Navigation,
      desc: "Return to homepage"
    },
    {
      name: "Interactive Campus Map",
      href: "/map",
      icon: Map,
      desc: "Explore 2D & 3D buildings"
    },
    {
      name: "Campus Locations",
      href: "/locations",
      icon: MapPin,
      desc: "Find specific rooms & places"
    },
    {
      name: "Route Directions",
      href: "/directions",
      icon: Compass,
      desc: "Step-by-step navigation"
    },
    isAuthenticated
      ? {
          name: "Admin Feedback",
          href: "/adminfeedback",
          icon: MessageSquare,
          desc: "View & manage feedback"
        }
      : {
          name: "Send Feedback",
          href: "/userfeedback",
          icon: MessageSquare,
          desc: "Share your thoughts"
        },
  ];

  // =========================================================
  // CAMPUS RESOURCES
  // =========================================================

  const campusResources = [
    { name: "Academic Buildings", icon: Building2, info: "Lecture halls & offices" },
    { name: "Central Library", icon: Map, info: "Study & research hub" },
    { name: "Student Hostels", icon: Building2, info: "Residential blocks" },
    { name: "Departments", icon: Compass, info: "Engineering & Science" },
    { name: "Labs & Classrooms", icon: Search, info: "Practical study zones" },
    { name: "Campus Hospital", icon: Hospital, info: "24/7 Medical support" },
  ];

  // =========================================================
  // SOCIAL LINKS
  // =========================================================

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/ramchandra-chandravanshi-university-3b0796211/",
      label: "Connect with us on LinkedIn",
      type: "linkedin",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/channel/UCeFqnDYhEUZvSZNKibY6SVw",
      label: "Watch us on YouTube",
      type: "youtube",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/ramchandra_chandravanshi_uni/",
      label: "Follow us on Instagram",
      type: "instagram",
    },
    {
      name: "Twitter / X",
      href: "https://x.com/RamChan89665104",
      label: "Follow us on Twitter / X",
      type: "twitter",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const SocialIcon = ({ type }) => {
    if (type === "linkedin") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.57V9H3.56v11.45Z" />
        </svg>
      );
    }
    if (type === "youtube") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.51 3.55 12 3.55 12 3.55s-7.51 0-9.38.52A3.01 3.01 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.01 3.01 0 0 0 2.12 2.13c1.87.52 9.38.52 9.38.52s7.51 0 9.38-.52a3.01 3.01 0 0 0 2.12-2.13C24 15.93 24 12 24 12s0-3.93-.5-5.8ZM9.55 15.58V8.42L15.82 12l-6.27 3.58Z" />
        </svg>
      );
    }
    if (type === "instagram") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.49 22H3.38l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.86h1.72L8.27 4h-1.85l11.38 15.86Z" />
      </svg>
    );
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white border-t border-slate-800">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* TOP BRAND HEADER */}
        <div className="border-b border-slate-800 py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-900/40">
                <Navigation size={26} strokeWidth={2.2} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl text-white">
                    Campus Navigator
                  </h2>
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
                    Official Portal
                  </span>
                </div>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-400 font-medium">
                  Ramchandra Chandravanshi University (RCU)
                </p>
              </div>
            </div>

            {/* Status & Quick Tag */}
         
           <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-400 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                 Navigation System Online
              </div>
            </div>
          </div>
        </div>

        {/* MAIN 4-COLUMN GRID (Structured & Easy to Read) */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* COLUMN 1: ABOUT & SOCIALS */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                About Platform
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                An advanced smart campus guide built to help students, staff, and visitors seamlessly locate buildings, classrooms, and university facilities.
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Official Social Channels
              </p>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.name}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                  >
                    <SocialIcon type={social.type} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION LINKS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Quick Navigation
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center justify-between rounded-xl border border-transparent bg-slate-900/60 px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-600/10 hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          <Icon size={15} />
                        </span>
                        <div>
                          <p className="text-xs font-bold leading-tight">{link.name}</p>
                          <p className="text-[10px] text-slate-400">{link.desc}</p>
                        </div>
                      </span>
                      <ArrowUpRight size={14} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 3: CAMPUS RESOURCES */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Campus Facilities
            </h3>
            <ul className="space-y-2.5">
              {campusResources.map((res) => {
                const Icon = res.icon;
                return (
                  <li
                    key={res.name}
                    className="flex items-center gap-3 rounded-xl border border-slate-900 bg-slate-900/40 px-3.5 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-900"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{res.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{res.info}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & LOCATION INFO */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              University Contact
            </h3>
            <div className="space-y-3 text-xs">
              
              {/* Address */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ramchandra+Chandravansi+University+Kosiar+Jharkhand+822132"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl bg-slate-900/60 p-3 border border-slate-800 transition hover:border-blue-500/40 group"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <MapPin size={15} />
                </div>
                <div>
                  <p className="font-bold text-slate-300 group-hover:text-blue-400 flex items-center gap-1">
                    Campus Address <ExternalLink size={10} />
                  </p>
                  <p className="mt-0.5 text-slate-400 leading-snug">Kosiar, Jharkhand 822132</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:09334406228"
                className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-3 border border-slate-800 transition hover:border-blue-500/40 group"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <PhoneCall size={14} />
                </div>
                <div>
                  <p className="font-bold text-slate-300 group-hover:text-emerald-400">Phone Support</p>
                  <p className="mt-0.5 text-slate-400">093344 06228</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info.rcit@gmail.com"
                className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-3 border border-slate-800 transition hover:border-blue-500/40 group"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Mail size={14} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-300 group-hover:text-indigo-400">Official Email</p>
                  <p className="mt-0.5 text-slate-400 truncate">info.rcit@gmail.com</p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-900/40 p-3 border border-slate-800/80">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="font-bold text-slate-300">Office Hours</p>
                  <p className="mt-0.5 text-slate-400">Mon - Sat · 10:00 AM - 4:00 PM</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* MAP CTA BANNER */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 p-5 sm:p-6 shadow-xl">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <Navigation size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  Looking for a specific room or lab? <Sparkles size={14} className="text-blue-400" />
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Use our interactive map to get optimized indoor and outdoor directions instantly.
                </p>
              </div>
            </div>

            <a
              href="/map"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              <Map size={15} />
              Launch Campus Map
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & BACK TO TOP BAR */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} Campus Navigator · Ramchandra Chandravanshi University. All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 font-semibold text-slate-300 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white self-center sm:self-auto"
            >
              Back to top
              <ChevronUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;