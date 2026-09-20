import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "./Button";
import Input from "./Input";

const JoinRoomCard = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || cleanCode.length !== 6) {
      toast.error("Please enter a valid 6-character room code");
      return;
    }
    navigate(`/room/${cleanCode}`);
  };

  return (
    <div className="border border-line p-6 bg-bg-surface mb-8">
      <div className="font-mono text-xs text-muted tracking-wider mb-2">
        <span className="text-amber">//</span> join_existing_room
      </div>
      <h2 className="font-mono text-xl font-bold text-cream mb-4">
        $ join_by_code
      </h2>
      <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1 w-full">
          <Input
            label="room_code"
            placeholder="e.g. ABC123"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
        </div>
        <div>
          <Button type="submit">
            join_room →
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JoinRoomCard;
