import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatRelativeTime } from "../utils/formatDate";

const RoomCard = ({ room, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const copyCode = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  const copyLink = (e) => {
    e.preventDefault();
    const link = `${window.location.origin}/#/room/${room.code}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    onDelete(room.id);
  };

  return (
    <>
      <div className="border border-line p-5 hover:border-amber bg-bg-surface/20 hover:bg-bg-surface transition-all duration-200 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-lg font-bold text-cream truncate">
              {room.name}
            </h3>
            <div className="font-mono text-xs text-muted mt-1">
              {room.language} · {formatRelativeTime(room.created_at)}
            </div>
          </div>
          <button
            onClick={handleDeleteClick}
            className="text-muted hover:text-red-500 font-mono text-xs transition-colors"
          >
            [ x ]
          </button>
        </div>

        <div
          onClick={copyCode}
          className="bg-bg-surface border border-line px-3 py-2 mb-4 cursor-pointer hover:border-amber/50 transition-all"
        >
          <div className="font-mono text-xs text-muted mb-1">// room_code</div>
          <div className="font-mono text-xl font-bold text-amber tracking-widest">
            {room.code}
          </div>
          <div className="font-mono text-xs text-muted/60 mt-1">
            {copied ? "✓ copied!" : "click to copy"}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/room/${room.code}`}
            className="flex-1 text-center font-mono text-xs border border-amber text-amber px-3 py-2 hover:bg-amber hover:text-bg-primary transition-all duration-200"
          >
            [ open_ → ]
          </Link>
          <button
            onClick={copyLink}
            className="font-mono text-xs border border-line text-muted px-3 py-2 hover:border-amber hover:text-amber transition-all duration-200"
          >
            [ link ]
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-bg-primary border border-red-500/50 max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-xs text-red-500 mb-3">
              // confirm_delete
            </div>
            <h3 className="font-mono text-lg font-bold text-cream mb-3">
              Delete "{room.name}"?
            </h3>
            <p className="font-mono text-xs text-muted mb-6">
              This action cannot be undone. The room and its code will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="font-mono text-xs border border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-bg-primary transition-all"
              >
                [ delete_forever ]
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="font-mono text-xs border border-line text-muted px-4 py-2 hover:border-amber hover:text-amber transition-all"
              >
                [ cancel ]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;
