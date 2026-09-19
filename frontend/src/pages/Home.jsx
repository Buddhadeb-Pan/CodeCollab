import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      num: "01",
      title: "real_time_sync",
      desc: "Multiple developers edit the same file simultaneously. See cursors, typing, and changes as they happen.",
    },
    {
      num: "02",
      title: "code_execution",
      desc: "Run JavaScript, Python, and C++ directly in the browser. Isolated sandbox, instant output.",
    },
    {
      num: "03",
      title: "live_chat",
      desc: "Discuss solutions without leaving the room. Threaded conversations with your collaborators.",
    },
    {
      num: "04",
      title: "presence_aware",
      desc: "See who's online, who's typing, and where everyone's cursor is — in real time.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="font-mono text-xs text-muted tracking-wider mb-6">
          <span className="text-amber">//</span> 01. tagline
        </div>

        <h1 className="font-mono text-5xl md:text-7xl font-bold text-cream leading-tight tracking-tight mb-6">
          Code together.
          <br />
          Ship faster.
          <span className="text-amber animate-blink">|</span>
        </h1>

        <p className="text-muted font-mono text-base md:text-lg max-w-2xl leading-relaxed mb-10">
          Real-time collaborative editor with code execution, chat, and presence.
          Built for pair programming, mentoring, and interviews.
        </p>

        <div className="flex flex-wrap gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="font-mono text-sm tracking-wide border border-amber text-amber px-6 py-3 hover:bg-amber hover:text-bg-primary transition-all duration-200"
            >
              [ open_dashboard_ → ]
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="font-mono text-sm tracking-wide border border-amber text-amber px-6 py-3 hover:bg-amber hover:text-bg-primary transition-all duration-200"
              >
                [ create_account_ → ]
              </Link>
              <Link
                to="/login"
                className="font-mono text-sm tracking-wide border border-line text-muted px-6 py-3 hover:border-amber hover:text-amber transition-all duration-200"
              >
                [ login ]
              </Link>
            </>
          )}
        </div>

        {/* Terminal Preview */}
        <div className="mt-16 border border-line bg-bg-surface max-w-3xl">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
            <span className="font-mono text-xs text-muted ml-3">room_abc123.js</span>
          </div>
          <div className="p-5 font-mono text-sm leading-7">
            <div className="text-muted">
              <span className="text-amber/60">1</span>{"  "}
              <span className="text-purple-400">const</span>{" "}
              <span className="text-cream">greet</span>{" "}
              <span className="text-muted">=</span>{" "}
              <span className="text-amber">(</span>
              <span className="text-blue-300">name</span>
              <span className="text-amber">)</span>{" "}
              <span className="text-purple-400">=&gt;</span>{" "}
              <span className="text-amber">{"{"}</span>
            </div>
            <div className="text-muted">
              <span className="text-amber/60">2</span>{"    "}
              <span className="text-purple-400">return</span>{" "}
              <span className="text-green-400">`hello ${name}`</span>
            </div>
            <div className="text-muted">
              <span className="text-amber/60">3</span>{"  "}
              <span className="text-amber">{"}"}</span>
            </div>
            <div className="text-muted">
              <span className="text-amber/60">4</span>
            </div>
            <div className="text-muted">
              <span className="text-amber/60">5</span>{"  "}
              <span className="text-cream">console</span>
              <span className="text-muted">.</span>
              <span className="text-yellow-300">log</span>
              <span className="text-amber">(</span>
              <span className="text-cream">greet</span>
              <span className="text-amber">(</span>
              <span className="text-green-400">"world"</span>
              <span className="text-amber">))</span>
            </div>
            <div className="mt-3 pt-3 border-t border-line text-muted text-xs">
              <span className="text-amber">$</span> node room_abc123.js
            </div>
            <div className="text-green-400 text-xs mt-1">&gt; hello world</div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-line">
        <div className="font-mono text-xs text-muted tracking-wider mb-10">
          <span className="text-amber">//</span> 02. features
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-line">
          {features.map((f, i) => (
            <div
              key={f.num}
              className={`p-8 border-line transition-all duration-200 hover:bg-bg-surface ${
                i % 2 === 0 ? "md:border-r" : ""
              } ${i < 2 ? "border-b" : ""}`}
            >
              <div className="font-mono text-xs text-amber mb-3">{f.num}</div>
              <h3 className="font-mono text-xl font-bold text-cream mb-3">
                {f.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-line">
        <div className="font-mono text-xs text-muted tracking-wider mb-10">
          <span className="text-amber">//</span> 03. how_it_works
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: "01", t: "create_room", d: "Sign up and create a room. Get a unique room code." },
            { n: "02", t: "share_link", d: "Send the link to your collaborator. They join instantly." },
            { n: "03", t: "start_coding", d: "Edit together in real time. Run code. Chat. Ship." },
          ].map((s) => (
            <div key={s.n} className="border border-line p-6 relative">
              <div className="absolute -top-3 left-4 bg-bg-primary px-2 font-mono text-xs text-amber">
                step_{s.n}
              </div>
              <h3 className="font-mono text-lg font-bold text-cream mb-3 mt-2">
                {s.t}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-line">
        <div className="border border-amber/30 bg-bg-surface p-12 text-center">
          <div className="font-mono text-xs text-amber tracking-wider mb-4">
            // 04. get_started
          </div>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-cream mb-4">
            Ready to collaborate?
          </h2>
          <p className="text-muted font-mono text-sm mb-8">
            Free forever. No credit card required.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-block font-mono text-sm tracking-wide border border-amber text-amber px-8 py-3 hover:bg-amber hover:text-bg-primary transition-all duration-200"
          >
            [ {user ? "open_dashboard" : "create_account"}_ → ]
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-sm text-muted">
            <span className="text-amber">⌘</span> CodeCollab — © 2025
          </div>
          <div className="font-mono text-xs text-muted flex gap-6">
            <a
              href="https://github.com/Buddhadeb-Pan/CodeCollab"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber transition-colors"
            >
              [ github ]
            </a>
            <span className="text-muted/50">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
