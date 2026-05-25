export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
  className = "",
}) {
  return (
    <header
      className={`page-header animate-in ${center ? "page-header--center" : ""} ${className}`}
    >
      {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </header>
  );
}
