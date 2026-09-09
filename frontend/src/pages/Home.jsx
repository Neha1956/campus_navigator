import {
  MapPinned,
  Navigation,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Utensils,
  School,
  Box,
  Plus,
  Minus,
  RotateCcw,
  Quote,
  Search,
  Compass,
  ShieldCheck,
  Map,
  Hospital,
} from "lucide-react";

import universityImage from "../assets/university.png";
import chairmanImage from "../assets/chairman.png";

const Home = () => {
  const quickAccess = [
    {
      title: "Campus Map",
      badge: "Interactive 2D/3D View",
      description:
        "Explore academic departments, healthcare centers, lecture halls and campus facilities in real-time.",
      icon: MapPinned,
      href: "/map",
      iconStyle: "bg-[#edf4ff] text-[#0d60ff]",
      tag: "Live Map",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200/70",
      accentGlow: "from-blue-500/10 to-indigo-500/0",
    },
    {
      title: "Get Directions",
      badge: "Smart Wayfinding",
      description:
        "Find the easiest walking route and turn-by-turn navigation directly to your destination.",
      icon: Navigation,
      href: "/directions",
      iconStyle: "bg-[#effaf6] text-[#08a66c]",
      tag: "Navigation",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
      accentGlow: "from-emerald-500/10 to-teal-500/0",
    },
  ];

  const navigationFeatures = [
    {
      title: "Interactive Campus Map",
      description:
        "Explore buildings, academic areas and important campus facilities in one place.",
      icon: Map,
    },
    {
      title: "Smart Directions",
      description:
        "Get clear directions and quickly reach your destination inside the campus.",
      icon: Compass,
    },
    {
      title: "Easy Place Search",
      description:
        "Search important campus locations without wasting time.",
      icon: Search,
    },
    {
      title: "Simple & Reliable",
      description:
        "A clean navigation experience designed for students, visitors and staff.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fbff]">
      {/* ========================================================= */}
      {/* ANIMATION STYLES */}
      {/* ========================================================= */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(35px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeRight {
          0% {
            opacity: 0;
            transform: translateX(-35px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeLeft {
          0% {
            opacity: 0;
            transform: translateX(35px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes markerFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            opacity: .42;
            transform: scale(1);
          }
          50% {
            opacity: .72;
            transform: scale(1.08);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-140%);
          }
          100% {
            transform: translateX(170%);
          }
        }

        .animate-fade-up {
          animation: fadeUp .8s ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight .85s ease-out both;
        }

        .animate-fade-left {
          animation: fadeLeft .9s ease-out both;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-marker {
          animation: markerFloat 3.2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 5s ease-in-out infinite;
        }

        .shine-effect::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.18),
            transparent
          );
          transform: translateX(-140%);
        }

        .shine-effect:hover::before {
          animation: shine .85s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* ========================================================= */}
      {/* HERO (100% ORIGINAL DESIGN & ELEMENTS PRESERVED) */}
      {/* ========================================================= */}
      <section className="relative min-h-[680px] overflow-hidden bg-[#03275f] lg:min-h-[720px]">
        <img
          src={universityImage}
          alt="University Campus"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#01245e]/95 via-[#013f7c]/68 to-[#046bb0]/24" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001d4b]/92 via-transparent to-[#002c66]/32" />

        <div className="animate-pulse-soft absolute -left-32 top-20 h-[450px] w-[450px] rounded-full bg-blue-500/20 blur-[110px]" />
        <div className="animate-pulse-soft absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-cyan-400/15 blur-[120px]" />

        {/* DOT GRID PATTERN */}
        <div
          className="absolute left-0 top-10 hidden h-[170px] w-[90px] opacity-30 lg:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, #42d4ff 1.7px, transparent 1.7px)",
            backgroundSize: "13px 13px",
          }}
        />

        {/* FLOATING LEAF 1 */}
        <div className="absolute -left-10 top-[140px] hidden rotate-[32deg] lg:block">
          <div className="animate-float h-14 w-28 rounded-[100%_0_100%_0] bg-gradient-to-br from-lime-300 to-green-600 opacity-80" />
        </div>

        {/* FLOATING LEAF 2 */}
        <div className="absolute -right-8 top-[110px] hidden -rotate-[28deg] lg:block">
          <div className="animate-float h-12 w-24 rounded-[100%_0_100%_0] bg-gradient-to-br from-lime-300 to-green-600" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[680px] w-full max-w-[1600px] items-center gap-12 px-5 pb-28 pt-12 sm:px-8 md:pt-16 lg:grid-cols-[1fr_.9fr] lg:px-12 lg:pb-32 xl:px-16">
          {/* LEFT */}
          <div className="animate-fade-right w-full max-w-[700px]">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md sm:text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,.9)]" />
              Smart Campus Navigation
            </div>

            <h1 className="text-[40px] font-extrabold leading-[1.08] tracking-[-1.5px] text-white sm:text-[50px] md:text-[58px] lg:text-[64px]">
              Navigate. Discover.
              <span className="mt-2 block bg-gradient-to-r from-[#00afff] via-[#00d7e8] to-[#66e386] bg-clip-text text-transparent">
                Experience Campus
              </span>
            </h1>

            <p className="mt-7 w-full max-w-[650px] text-[15px] font-medium leading-7 text-white/90 sm:text-[17px]">
              Explore academic areas, healthcare facilities and important places
              across campus with our smart and interactive campus navigation system.
            </p>

            <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row">
              <a
                href="/map"
                className="group inline-flex min-h-[55px] items-center justify-center gap-3 rounded-xl bg-[#0e60ff] px-7 text-sm font-bold text-white shadow-[0_15px_35px_rgba(0,80,255,.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#004fe2]"
              >
                <MapPinned size={19} />
                Explore Campus Map
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="/directions"
                className="group inline-flex min-h-[55px] items-center justify-center gap-3 rounded-xl border border-white/80 bg-white px-7 text-sm font-bold text-[#08234c] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50"
              >
                <Navigation size={19} className="text-[#153f86]" />
                Get Directions
              </a>
            </div>
          </div>

          {/* RIGHT MAP PREVIEW */}
          <div className="animate-fade-left relative mx-auto w-full max-w-[550px] lg:ml-auto lg:mr-0">
            <div className="absolute -inset-5 rounded-[42px] bg-blue-400/15 blur-3xl" />

            <div className="animate-float relative overflow-hidden rounded-[28px] border-[5px] border-white bg-white shadow-[0_30px_90px_rgba(0,18,70,.4)]">
              <div className="relative h-[300px] overflow-hidden bg-[#dceefa] sm:h-[370px]">
                <img
                  src={universityImage}
                  alt="Interactive Campus Map"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0054aa]/40 via-transparent to-white/10" />

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/95 px-4 py-2 text-[11px] font-bold text-[#17479d] shadow-lg backdrop-blur sm:left-5 sm:top-5 sm:text-xs">
                  <Box size={15} className="text-[#155cff]" />
                  Interactive Campus Map
                </div>

                <MapMarker
                  className="left-[14%] top-[34%]"
                  delay="0s"
                  icon={<BookOpen size={16} />}
                />

                <MapMarker
                  className="left-[50%] top-[40%]"
                  delay=".5s"
                  icon={<School size={16} />}
                />

                <MapMarker
                  className="right-[16%] top-[18%]"
                  delay="1s"
                  icon={<Hospital size={16} />}
                />

                <MapMarker
                  className="right-[18%] top-[50%]"
                  delay="1.5s"
                  icon={<Utensils size={16} />}
                />

                <div className="absolute bottom-5 right-4 overflow-hidden rounded-xl bg-white shadow-[0_10px_30px_rgba(0,36,100,.25)]">
                  <button
                    type="button"
                    aria-label="Zoom in"
                    className="flex h-10 w-10 items-center justify-center border-b border-slate-100 text-[#123774] transition hover:bg-blue-50"
                  >
                    <Plus size={18} />
                  </button>

                  <button
                    type="button"
                    aria-label="Zoom out"
                    className="flex h-10 w-10 items-center justify-center border-b border-slate-100 text-[#123774] transition hover:bg-blue-50"
                  >
                    <Minus size={18} />
                  </button>

                  <button
                    type="button"
                    aria-label="Reset"
                    className="flex h-10 w-10 items-center justify-center text-[#123774] transition hover:bg-blue-50"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-[#164cb3] via-[#073d99] to-[#082f7c] px-5 py-5 text-white sm:px-6">
                <div className="absolute -right-20 -top-20 h-[220px] w-[280px] rounded-full bg-blue-500/25" />

                <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold">
                      Explore Campus
                    </h3>

                    <p className="mt-2 max-w-[290px] text-sm leading-6 text-white/80">
                      Find academic and healthcare facilities quickly with
                      interactive campus navigation.
                    </p>
                  </div>

                  <a
                    href="/map"
                    className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#153673] shadow-lg transition-all hover:-translate-y-1"
                  >
                    Open Map
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* STATS + CHAIRMAN */}
      {/* ========================================================= */}
      <section className="relative z-20 mx-auto -mt-16 w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <div className="animate-fade-up grid overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_18px_50px_rgba(11,47,95,.13)] sm:grid-cols-3">
            <StatCard
              icon={GraduationCap}
              value="Multi"
              label="Academic Programs"
              description="Diverse Learning"
            />

            <StatCard
              icon={Hospital}
              value="Medical"
              label="Healthcare Campus"
              description="Teaching & Care"
            />

            <StatCard
              icon={Navigation}
              value="Smart"
              label="Campus Navigation"
              description="Find Your Way"
            />
          </div>

          <ChairmanCard chairmanImage={chairmanImage} />
        </div>
      </section>

      {/* ========================================================= */}
      {/* QUICK ACCESS (REMOVED NOTICE & HELPDESK -> PREMIUM 2-CARD ACTION) */}
      {/* ========================================================= */}
      <section className="bg-white py-14 sm:py-20 border-b border-slate-100">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mb-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#075cff]">
              Quick Navigation
            </p>
            <h2 className="mt-2 text-[27px] font-extrabold tracking-tight text-[#071c44] sm:text-[34px]">
              Everything You Need
            </h2>
            <p className="mt-2 max-w-[650px] text-sm leading-6 text-[#7185a2]">
              Quickly access important campus navigation tools and useful university directions.
            </p>
          </div>

          {/* 2-Column Responsive Card Grid */}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {quickAccess.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="animate-fade-up group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#e6edf7] bg-[#fbfdff] p-6 shadow-[0_10px_30px_rgba(20,55,100,.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:bg-white hover:shadow-[0_20px_45px_rgba(20,55,100,.12)] sm:p-8"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <div
                    className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${item.accentGlow} blur-2xl transition-transform group-hover:scale-125`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] transition-transform duration-300 group-hover:scale-105 ${item.iconStyle}`}
                      >
                        <Icon size={27} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold border ${item.tagColor}`}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-bold text-[#075cff]">
                        {item.badge}
                      </p>
                      <h3 className="mt-1 text-2xl font-extrabold text-[#10274e]">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#7b8da8]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center justify-between border-t border-[#edf1f6] pt-5 text-sm font-bold text-[#075cff] transition-colors group-hover:text-blue-700">
                    <span>Open Now</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f8fd] text-[#075cff] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#075cff] group-hover:text-white">
                      <ArrowRight size={17} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SMART NAVIGATION */}
      {/* ========================================================= */}
      <section className="bg-[#f8fbff] py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
            <div className="animate-fade-right shine-effect group relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#052963] via-[#08439c] to-[#0870dc] p-7 text-white shadow-[0_25px_60px_rgba(12,67,155,.22)] sm:p-9 lg:p-10">
              <div className="absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full border-[52px] border-white/5" />

              <div className="absolute -bottom-20 right-10 h-[200px] w-[200px] rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative z-10">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                  <Navigation size={25} />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-cyan-300">
                  Smart Navigation
                </p>

                <h2 className="mt-3 text-[28px] font-extrabold leading-tight sm:text-[36px]">
                  Never Get Lost
                  <br />
                  On Campus
                </h2>

                <p className="mt-4 max-w-[520px] text-sm leading-7 text-white/80 sm:text-[15px]">
                  Get quick directions to academic buildings, healthcare
                  facilities, libraries and other important campus places from
                  one simple navigation system.
                </p>

                <a
                  href="/directions"
                  className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#063879] shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  Start Navigation
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>

            <div className="animate-fade-left">
              <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#075cff]">
                Campus Navigator
              </p>

              <h2 className="mt-3 max-w-[650px] text-[29px] font-extrabold leading-tight tracking-tight text-[#071c44] sm:text-[38px]">
                A Better Way To Explore Your University
              </h2>

              <p className="mt-4 max-w-[700px] text-sm leading-7 text-[#6d829f] sm:text-[15px]">
                Navigate academic areas, medical facilities and important
                campus destinations quickly and conveniently.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {navigationFeatures.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-[20px] border border-[#e8eef7] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_15px_35px_rgba(20,55,100,.08)]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ff] text-[#075cff] transition-all duration-300 group-hover:bg-[#075cff] group-hover:text-white">
                        <Icon size={21} />
                      </div>

                      <h3 className="mt-4 text-sm font-extrabold text-[#10264a]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-[#7185a2]">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="animate-fade-up relative overflow-hidden rounded-[28px] border border-[#dce8fa] bg-gradient-to-r from-[#eef5ff] via-white to-[#eefaff] px-6 py-10 text-center shadow-[0_15px_45px_rgba(20,55,100,.07)] sm:px-10 sm:py-14">
            <div className="relative z-10 mx-auto max-w-[760px]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#075cff] text-white shadow-[0_12px_30px_rgba(7,92,255,.25)]">
                <MapPinned size={27} />
              </div>

              <h2 className="mt-6 text-[27px] font-extrabold tracking-tight text-[#071c44] sm:text-[36px]">
                Ready To Explore The Campus?
              </h2>

              <p className="mx-auto mt-3 max-w-[630px] text-sm leading-7 text-[#7185a2]">
                Open the campus map or get directions and quickly reach your
                academic, medical or campus destination.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="/map"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#075cff] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(7,92,255,.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#004ee0]"
                >
                  <MapPinned size={18} />
                  Explore Map
                </a>

                <a
                  href="/directions"
                  className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#dce5f1] bg-white px-7 py-3.5 text-sm font-bold text-[#19375f] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200"
                >
                  <Navigation size={18} />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================= */
/* MAP MARKER */
/* ============================================================= */
const MapMarker = ({ className, icon, delay = "0s" }) => {
  return (
    <div
      className={`animate-marker absolute ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="relative">
        <div className="flex h-11 w-10 rotate-[-45deg] items-center justify-center rounded-[50%_50%_50%_8px] border-[3px] border-white bg-[#075cff] text-white shadow-[0_8px_18px_rgba(0,56,160,.4)] sm:h-12 sm:w-11">
          <div className="rotate-[45deg]">{icon}</div>
        </div>

        <div className="absolute -bottom-2 left-1/2 h-2 w-7 -translate-x-1/2 rounded-full bg-[#17315f]/25 blur-[2px]" />
      </div>
    </div>
  );
};

/* ============================================================= */
/* STAT CARD */
/* ============================================================= */
const StatCard = ({ icon: Icon, value, label, description }) => {
  return (
    <div className="group relative flex min-h-[135px] items-center gap-4 border-b border-[#edf1f6] px-5 py-5 transition-colors hover:bg-[#f9fbff] sm:border-b-0 sm:border-r sm:last:border-r-0 md:px-6">
      <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1165ff] to-[#034de3] text-white shadow-[0_10px_22px_rgba(0,85,255,.22)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
        <Icon size={26} />
      </div>

      <div>
        <p className="text-[22px] font-extrabold leading-none text-[#081b41] sm:text-[24px]">
          {value}
        </p>

        <p className="mt-2 text-[13px] font-bold text-[#1b2d4f]">
          {label}
        </p>

        <p className="mt-2 text-[10px] text-[#7185a2]">
          {description}
        </p>
      </div>
    </div>
  );
};

/* ============================================================= */
/* CHAIRMAN CARD */
/* ============================================================= */
const ChairmanCard = ({ chairmanImage }) => {
  return (
    <div className="animate-fade-up relative min-h-[190px] overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_18px_50px_rgba(11,47,95,.13)]">
      <div className="grid h-full grid-cols-[110px_1fr] sm:grid-cols-[180px_1fr]">
        <div className="relative overflow-hidden bg-gradient-to-t from-[#ecf1f8] to-white">
          <img
            src={chairmanImage}
            alt="Chairman"
            className="absolute bottom-0 left-1/2 h-[95%] w-full -translate-x-1/2 object-contain object-bottom transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-center px-4 py-5 sm:px-6">
          <p className="text-[10px] font-bold text-[#1765ef]">
            Welcome Message
          </p>

          <h3 className="mt-1 text-[16px] font-extrabold text-[#0a1f46] sm:text-[18px]">
            From The Chairman
          </h3>

          <div className="mt-3 flex gap-2">
            <Quote
              size={24}
              fill="currentColor"
              className="hidden shrink-0 text-[#91b6ff] sm:block"
            />

            <p className="line-clamp-4 text-[10px] leading-[1.65] text-[#253b5f] sm:text-[11px]">
              “Our vision is to provide quality education that empowers
              students to become compassionate professionals and responsible
              global citizens.”
            </p>
          </div>

          <p className="mt-3 text-[10px] font-extrabold text-[#0756e8] sm:text-[11px]">
            Shri. Ramchandra Chandrawanshi
          </p>

          <p className="mt-0.5 text-[9px] text-[#31486d] sm:text-[10px]">
            Chairman
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;