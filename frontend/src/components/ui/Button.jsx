export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  block = false,
  ...props
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size === "lg" && "btn--lg",
    size === "sm" && "btn--sm",
    block && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
