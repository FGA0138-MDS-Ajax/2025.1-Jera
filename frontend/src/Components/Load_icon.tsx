import "./Load_icon.css";

export default function Loading() {
  return (
    <div className="loading-container">
      <svg className="loading-spinner" viewBox="0 0 50 50">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      <span className="loading-text">Carregando…</span>
    </div>
  );
}