import { ClipLoader } from "react-spinners";

export default function Loader({ label = "Loading…" }) {
  return (
    <div className="loader-page" role="status" aria-live="polite">
      <ClipLoader color="var(--color-primary)" size={44} aria-hidden />
      <span className="loader-page__label">{label}</span>
    </div>
  );
}
