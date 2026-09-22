const LoadingSpinner = ({ text = "loading..." }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="font-mono text-xs text-muted flex items-center gap-3">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
          <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
          <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
        </div>
        <span>
          <span className="text-amber">$</span> {text}
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
