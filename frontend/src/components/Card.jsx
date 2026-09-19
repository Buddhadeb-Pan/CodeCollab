const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-bg-surface border border-line p-6 transition-all duration-200 hover:border-amber/50 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
