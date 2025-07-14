import "./DarkmodeSwitch.css";

export default function DarkmodeSwitch({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  return (
    <div className="darkmode-switch-container">
      <label className="darkmode-switch">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={e => setTheme(e.target.checked ? "dark" : "light")}
          aria-label="Toggle dark mode"
        />
        <span className="darkmode-slider">
          <span className="darkmode-icon sun">☀️</span>
          <span className="darkmode-icon moon">🌙</span>
          <span className="darkmode-thumb"></span>
        </span>
      </label>
      <span className="darkmode-label">{theme === "dark" ? "Dark" : "Light"}</span>
    </div>
  );
}