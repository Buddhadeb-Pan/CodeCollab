const RoomCardSkeleton = () => {
  return (
    <div className="border border-line p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-line w-3/4 mb-2"></div>
          <div className="h-3 bg-line w-1/2"></div>
        </div>
      </div>
      <div className="bg-bg-surface border border-line px-3 py-2 mb-4">
        <div className="h-3 bg-line w-1/3 mb-2"></div>
        <div className="h-6 bg-line w-1/2 mb-1"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-line flex-1"></div>
        <div className="h-8 bg-line w-16"></div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
