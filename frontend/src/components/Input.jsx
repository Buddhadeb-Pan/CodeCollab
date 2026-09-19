const Input = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-mono text-xs text-muted mb-2 tracking-wider">
          {"> "}{label}
        </label>
      )}
      <input
        {...props}
        className="w-full bg-bg-surface border border-line text-cream font-mono text-sm px-4 py-2.5 focus:outline-none focus:border-amber transition-colors"
      />
      {error && (
        <p className="font-mono text-xs text-red-500 mt-1.5">
          ! {error}
        </p>
      )}
    </div>
  );
};

export default Input;
