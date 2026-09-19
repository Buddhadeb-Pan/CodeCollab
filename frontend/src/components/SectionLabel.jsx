const SectionLabel = ({ number, text }) => {
  return (
    <div className="font-mono text-xs text-muted tracking-wider mb-4">
      <span className="text-amber">//</span> {number}. {text}
    </div>
  );
};

export default SectionLabel;
