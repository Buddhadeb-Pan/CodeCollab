import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "./Button";
import Input from "./Input";

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Room name must be at least 2 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/rooms", { name, language });
      toast.success("Room created!");
      onRoomCreated(res.data.data.room);
      setName("");
      setLanguage("javascript");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary border border-line w-full max-w-md p-5 md:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-xs text-muted tracking-wider mb-3">
          <span className="text-amber">//</span> new_room
        </div>
        <h2 className="font-mono text-2xl font-bold text-cream mb-6">
          $ create_room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="room_name"
            type="text"
            placeholder="My awesome room"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block font-mono text-xs text-muted mb-2 tracking-wider">
              {"> "}language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-bg-surface border border-line text-cream font-mono text-sm px-4 py-2.5 focus:outline-none focus:border-amber transition-colors"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>
              create →
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-sm tracking-wide border border-line text-muted px-5 py-2.5 hover:border-red-500 hover:text-red-500 transition-all duration-200"
            >
              [ cancel ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
