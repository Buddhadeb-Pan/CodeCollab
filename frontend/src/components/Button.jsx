const Button = ({ children, variant = "primary", loading, ...props }) => {
  const variants = {
    primary: "border-amber text-amber hover:bg-amber hover:text-bg-primary",
    ghost: "border-line text-muted hover:border-amber hover:text-amber",
    danger: "border-red-500 text-red-500 hover:bg-red-500 hover:text-bg-primary",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`font-mono text-sm tracking-wide border px-5 py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {loading ? "loading..." : <>[ {children} ]</>}
    </button>
  );
};

export default Button;
