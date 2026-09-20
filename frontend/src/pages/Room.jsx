import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SectionLabel from "../components/SectionLabel";

const Room = () => {
  const { code } = useParams();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionLabel number="01" text="room" />
        <h1 className="font-mono text-4xl font-bold text-cream mb-3">
          Room: <span className="text-amber">{code}</span>
        </h1>
        <p className="font-mono text-muted text-sm mb-12">
          $ editor coming soon...
        </p>

        <Link
          to="/dashboard"
          className="font-mono text-sm border border-line text-muted px-4 py-2 hover:border-amber hover:text-amber transition-all"
        >
          [ ← back_to_dashboard ]
        </Link>
      </div>
    </div>
  );
};

export default Room;
