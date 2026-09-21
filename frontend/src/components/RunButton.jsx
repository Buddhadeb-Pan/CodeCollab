const RunButton = ({ running, onRun, disabled }) => {
  return (
    <button
      onClick={onRun}
      disabled={running || disabled}
      className={`font-mono text-xs border px-3 py-1.5 transition-all ${
        running
          ? "border-amber text-amber bg-amber/10 cursor-wait"
          : "border-amber text-amber hover:bg-amber hover:text-bg-primary"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {running ? "● running..." : "[ run_▷ ]"}
    </button>
  );
};

export default RunButton;
