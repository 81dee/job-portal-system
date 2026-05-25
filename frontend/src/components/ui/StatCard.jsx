export default function StatCard({ icon: Icon, value, label, tone = "primary" }) {
  return (
    <article className="stat-card animate-in">
      {Icon && (
        <div className={`stat-card__icon stat-card__icon--${tone}`}>
          <Icon aria-hidden />
        </div>
      )}
      <div>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
      </div>
    </article>
  );
}
