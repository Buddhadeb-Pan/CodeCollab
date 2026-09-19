import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SectionLabel from "../components/SectionLabel";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionLabel number="01" text="welcome" />
        <h1 className="font-mono text-4xl font-bold text-cream mb-3">
          Hello, <span className="text-amber">{user?.name}</span>
        </h1>
        <p className="font-mono text-muted text-sm mb-12">
          $ your workspace is ready
        </p>

        <SectionLabel number="02" text="your_rooms" />
        <div className="border border-line border-dashed p-12 text-center">
          <p className="font-mono text-muted text-sm mb-4">
            // no rooms yet
          </p>
          <p className="font-mono text-xs text-muted/60">
            room feature coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
