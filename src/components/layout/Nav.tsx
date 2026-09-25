import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/agents", label: "The council" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/history", label: "History" },
];

export default function Nav() {
  const location = useLocation();

  return (
    <header className="relative z-10 w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-xl tracking-tight text-ivory">
            VERITAS
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-copper/80 group-hover:text-amber transition-colors">
            AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  active
                    ? "text-amber"
                    : "text-ivory-dim hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/verify"
          className="text-sm border border-chamber-line hover:border-amber/60 text-ivory hover:text-amber transition-colors px-4 py-2 rounded-sm"
        >
          Begin a verification
        </Link>
      </div>
    </header>
  );
}
