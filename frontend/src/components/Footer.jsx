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
  Hospital
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
      name: "Home",
      href: "/",
      icon: Navigation,
    },
    {
      name: "Campus Map",
      href: "/map",
      icon: Map,
    },
    {
      name: "Locations",
      href: "/locations",
      icon: MapPin,
    },
    {
      name: "Directions",
      href: "/directions",
      icon: Compass,
    },
    isAuthenticated
      ? {
          name: "Feedback",
          href: "/adminfeedback",
          icon: MessageSquare,
        }
      : {
          name: "Feedback",
          href: "/feedback",
          icon: MessageSquare,
        },
  ];

  // =========================================================
  // CAMPUS RESOURCES
  // =========================================================

  const campusResources = [
    {
      name: "Academic Buildings",
      icon: Building2,
    },
    {
      name: "Library",
      icon: Map,
    },
    {
      name: "Hostels",
      icon: Building2,
    },
    {
      name: "Departments",
      icon: Compass,
    },
    {
      name: "Labs & Classrooms",
      icon: Search,
    },
     {
      name: "Hospital",
      icon: Hospital,
    },
  ];

  // =========================================================
  // SOCIAL LINKS
  // Replace these with your official campus social links
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

  // =========================================================
  // SCROLL TO TOP
  // =========================================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // SOCIAL ICON
  // Inline SVG keeps this independent from lucide-react
  // =========================================================

  const SocialIcon = ({ type }) => {
    if (type === "linkedin") {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.57V9H3.56v11.45Z" />
        </svg>
      );
    }

    if (type === "youtube") {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.51 3.55 12 3.55 12 3.55s-7.51 0-9.38.52A3.01 3.01 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.01 3.01 0 0 0 2.12 2.13c1.87.52 9.38.52 9.38.52s7.51 0 9.38-.52a3.01 3.01 0 0 0 2.12-2.13C24 15.93 24 12 24 12s0-3.93-.5-5.8ZM9.55 15.58V8.42L15.82 12l-6.27 3.58Z" />
        </svg>
      );
    }

    if (type === "instagram") {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.49 22H3.38l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.86h1.72L8.27 4h-1.85l11.38 15.86Z" />
      </svg>
    );
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* =========================================================
          BACKGROUND EFFECTS
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue glow */}
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />

        {/* Indigo glow */}
        <div className="absolute -bottom-48 -left-48 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-3xl" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.025] blur-3xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

        {/* Decorative dots */}
        <div className="absolute left-[12%] top-[20%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 shadow-[0_0_18px_4px_rgba(96,165,250,0.25)]" />

        <div className="absolute right-[18%] top-[32%] h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400 shadow-[0_0_18px_4px_rgba(129,140,248,0.25)]" />

        <div className="absolute bottom-[22%] left-[42%] h-1 w-1 animate-pulse rounded-full bg-blue-300 shadow-[0_0_15px_4px_rgba(96,165,250,0.2)]" />

        <div className="absolute bottom-[15%] right-[35%] h-1 w-1 animate-pulse rounded-full bg-indigo-300" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            TOP BRAND SECTION
        ========================================================= */}

        <div className="border-b border-white/10 py-10 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="group relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-xl transition-all duration-500 group-hover:bg-blue-500/50" />

                {/* Logo */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-900/30 transition-transform duration-500 group-hover:scale-105">
                  <Navigation
                    size={27}
                    strokeWidth={2}
                    className="transition-transform duration-500 group-hover:rotate-12"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Campus Navigator
                  </h2>

                  <Sparkles size={16} className="text-blue-400" />
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  Smart Digital Campus Guide
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="max-w-xl text-sm leading-7 text-slate-400 lg:text-right">
              Discover your campus with ease. Explore buildings, classrooms,
              departments and facilities through an interactive digital
              navigation experience.
            </p>
          </div>
        </div>

        {/* =========================================================
            MAIN FOOTER GRID
        ========================================================= */}

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* =====================================================
              ABOUT
          ===================================================== */}

          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />

              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                About Navigator
              </h3>
            </div>

            <p className="text-sm leading-7 text-slate-400">
              A smart campus navigation platform designed to help students,
              faculty, staff and visitors quickly discover places and navigate
              around the university campus.
            </p>

            {/* System Status */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-2 text-xs font-medium text-slate-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              Navigation System Active
            </div>

            {/* =====================================================
                SOCIAL MEDIA
            ===================================================== */}

            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Connect with us
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
                    className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white hover:shadow-lg hover:shadow-blue-950/30"
                  >
                    {/* Shine animation */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {/* Glow */}
                    <span className="absolute inset-0 rounded-xl bg-blue-500/0 blur-md transition-all duration-300 group-hover:bg-blue-500/10" />

                    <span className="relative transition-transform duration-300 group-hover:scale-110">
                      <SocialIcon type={social.type} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ===================================================== */}

          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />

              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Explore
              </h3>
            </div>

            <div className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-400 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03] transition-all duration-300 group-hover:bg-blue-500/10">
                        <Icon
                          size={15}
                          className="text-slate-500 transition-colors duration-300 group-hover:text-blue-400"
                        />
                      </span>

                      {link.name}
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              CAMPUS RESOURCES
          ===================================================== */}

          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />

              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Campus Resources
              </h3>
            </div>

            <div className="space-y-3">
              {campusResources.map((resource) => {
                const Icon = resource.icon;

                return (
                  <div
                    key={resource.name}
                    className="group flex cursor-default items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-slate-200"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/10"
                    >
                      <Icon
                        size={14}
                        className="text-blue-400 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <span>{resource.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

         {/* =====================================================
    CAMPUS INFORMATION
===================================================== */}

<div>
  <div className="mb-5 flex items-center gap-2">
    <span className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />

    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
      Campus Information
      <p className="text-gray-500">Ramchandra Chandrawanshi University</p>
    </h3>
  </div>

  <div className="space-y-4">
    {/* Address */}
    <a
      href="https://www.google.com/maps/search/?api=1&query=Ramchandra+Chandravansi+University+Kosiar+Jharkhand+822132"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
        <MapPin size={17} className="text-blue-400" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Address
        </p>

        <p className="mt-1 text-sm leading-5 text-slate-300 transition-colors group-hover:text-blue-400">
          6WXV+6CR, Kosiar, Jharkhand 822132
        </p>
      </div>
    </a>

    {/* Founded */}
    <div className="group flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
        <Building2 size={17} className="text-blue-400" />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Founded
        </p>

        <p className="mt-1 text-sm text-slate-300">
          2018
        </p>
      </div>
    </div>

    {/* Enrollment */}
    <div className="group flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
        <Search size={17} className="text-blue-400" />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Total Enrollment
        </p>

        <p className="mt-1 text-sm text-slate-300">
          7,403 students
          <span className="ml-1 text-xs text-slate-500">
            (2024)
          </span>
        </p>
      </div>
    </div>

    {/* Phone */}
    <a
      href="tel:09334406228"
      className="group flex items-start gap-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
        <svg
          viewBox="0 0 24 24"
          className="h-[17px] w-[17px] text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Phone
        </p>

        <p className="mt-1 text-sm text-slate-300 transition-colors group-hover:text-blue-400">
          093344 06228
        </p>
      </div>
    </a>

    {/* Email */}
    <a
      href="mailto:info.rcit@gmail.com"
      className="group flex items-start gap-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
        <Mail size={17} className="text-blue-400" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Email
        </p>

        <p className="mt-1 break-all text-sm text-slate-300 transition-colors group-hover:text-blue-400">
          info.rcit@gmail.com
        </p>
      </div>
    </a>

    {/* Campus Hours */}
    <div className="group flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
        <Clock size={17} className="text-blue-400" />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Campus Hours
        </p>

        <p className="mt-1 text-sm leading-5 text-slate-300">
          Mon - Sat · 10:00 AM - 4:00 PM
        </p>
      </div>
    </div>
  </div>
</div>
</div>
        {/* =========================================================
            MAP CTA
        ========================================================= */}

        <div className="relative mb-10 overflow-hidden rounded-3xl border border-blue-400/10 bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-slate-900/30 p-5 shadow-2xl shadow-blue-950/20 sm:p-8">
          {/* CTA Background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

            {/* Route Line */}
            <div className="absolute left-[8%] right-[8%] top-1/2 hidden h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent sm:block" />

            {/* Small route dots */}
            <div className="absolute left-[15%] top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-blue-400/40 sm:block" />

            <div className="absolute right-[20%] top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-indigo-400/40 sm:block" />
          </div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15">
                <span className="absolute inset-0 animate-ping rounded-2xl bg-blue-500/5" />

                <Navigation
                  size={22}
                  className="relative text-blue-400"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Find your destination
                  </h3>

                  <Sparkles size={15} className="text-blue-400" />
                </div>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                  Search for a building or location and get directions through
                  the interactive campus map.
                </p>
              </div>
            </div>

            <a
              href="/map"
              className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-900/50 sm:w-fit"
            >
              <Map size={17} />

              Explore Campus

              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================= */}

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Copyright */}
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-500 sm:text-sm">
                © {new Date().getFullYear()} Campus Navigator. All rights
                reserved.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Smart navigation for a smarter campus.
              </p>
            </div>

            {/* Back To Top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group mx-auto inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-400 sm:mx-0"
            >
              Back to top

              <ChevronUp
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;