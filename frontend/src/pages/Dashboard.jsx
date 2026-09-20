import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import SectionLabel from "../components/SectionLabel";
import Button from "../components/Button";
import RoomCard from "../components/RoomCard";
import CreateRoomModal from "../components/CreateRoomModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchRooms();
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionLabel number="01" text="welcome" />
        <h1 className="font-mono text-4xl font-bold text-cream mb-3">
          Hello, <span className="text-amber">{user?.name}</span>
        </h1>
        <p className="font-mono text-muted text-sm mb-12">
          $ your workspace is ready
        </p>

        <div className="flex items-center justify-between mb-6">
          <SectionLabel number="02" text={`your_rooms (${rooms.length})`} />
          <Button onClick={() => setModalOpen(true)}>
            create_room_ +
          </Button>
        </div>

        {loading ? (
          <div className="border border-line border-dashed p-12 text-center">
            <p className="font-mono text-muted text-sm">
              <span className="text-amber">$</span> loading_rooms...
            </p>
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
