const OutputPanel = ({ output, running, outputBy, onClear }) => {
  const isRemoteRunning = output?.running === true;

  return (
    <div className="border border-line bg-[#1e1e1e] border-t-0">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-line">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-amber">// output</span>
          {(running || isRemoteRunning) && (
            <span className="text-amber animate-pulse">
              ● {running ? "running..." : `${output?.by || "someone"} is running...`}
            </span>
          )}
          {!running && !isRemoteRunning && output && (
            <>
              <span className={output.hasError ? "text-red-500" : "text-green-400"}>
                ● {output.hasError ? "error" : "success"}
              </span>
              {outputBy && (
                <span className="text-muted">by {outputBy}</span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-muted">
          {output && !running && !isRemoteRunning && (
            <>
              <span>exit: {output.exitCode}</span>
              <span>·</span>
              <span>{output.duration}ms</span>
              <button
                onClick={onClear}
                className="ml-2 hover:text-red-500 transition-colors"
              >
                [ clear ]
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 font-mono text-xs leading-relaxed min-h-[120px] max-h-[300px] overflow-y-auto">
        {(running || isRemoteRunning) && (
          <div className="text-muted">
            <span className="text-amber">$</span> executing code...
          </div>
        )}

        {!running && !isRemoteRunning && !output && (
          <div className="text-muted/60">
            // click [ run_▷ ] to execute your code
          </div>
        )}

        {!running && !isRemoteRunning && output && (
          <>
            {output.stdout && (
              <pre className="text-cream whitespace-pre-wrap break-words">
                {output.stdout}
              </pre>
            )}
            {output.stderr && (
              <pre className="text-red-500 whitespace-pre-wrap break-words mt-2">
                {output.stderr}
              </pre>
            )}
            {!output.stdout && !output.stderr && (
              <div className="text-muted/60">
                // no output (program exited silently)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
