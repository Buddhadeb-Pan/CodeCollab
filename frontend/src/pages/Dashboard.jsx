import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import SectionLabel from "../components/SectionLabel";
import Button from "../components/Button";
import RoomCard from "../components/RoomCard";
import CreateRoomModal from "../components/CreateRoomModal";
import JoinRoomCard from "../components/JoinRoomCard";
import RoomCardSkeleton from "../components/RoomCardSkeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/rooms/my");
      setRooms(res.data.data.rooms);
    } catch (err) {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRoomCreated = (newRoom) => {
    setRooms([newRoom, ...rooms]);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await api.delete(`/api/rooms/${roomId}`);
      setRooms(rooms.filter((r) => r.id !== roomId));
      toast.success("Room deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete room");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <SectionLabel number="01" text="welcome" />
        <h1 className="font-mono text-2xl md:text-4xl font-bold text-cream mb-3">
          Hello, <span className="text-amber">{user?.name}</span>
        </h1>
        <p className="font-mono text-muted text-sm mb-8 flex items-center gap-2">
          <span>$ your workspace is ready · {rooms.length} room{rooms.length !== 1 ? "s" : ""}</span>
          <span className="hidden sm:inline text-xs text-muted/60">
            · <kbd className="border border-line px-1.5 py-0.5 text-cream bg-bg-surface text-[10px]">Ctrl+K</kbd> to create room
          </span>
        </p>

        <JoinRoomCard />

        <div className="flex items-center justify-between mb-6">
          <SectionLabel number="02" text={`your_rooms (${rooms.length})`} />
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="font-mono text-xs border border-line text-muted px-3 py-2 hover:border-amber hover:text-amber transition-all disabled:opacity-50"
            >
              {refreshing ? "● refreshing..." : "[ ↻ ]"}
            </button>
            <Button onClick={() => setModalOpen(true)}>
              create_room_ +
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            <RoomCardSkeleton />
            <RoomCardSkeleton />
            <RoomCardSkeleton />
          </div>
        ) : rooms.length === 0 ? (
          <div className="border border-line border-dashed p-12 text-center">
            <p className="font-mono text-muted text-sm mb-2">
              // no rooms yet
            </p>
            <p className="font-mono text-xs text-muted/60 mb-6">
              create your first room to start coding together
            </p>
            <Button onClick={() => setModalOpen(true)}>
              create_first_room_ +
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onDelete={handleDeleteRoom}
              />
            ))}
          </div>
        )}
      </div>

      <CreateRoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
};

export default Dashboard;
