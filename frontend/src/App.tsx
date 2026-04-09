import { useEffect, useState } from "react";
import RoutesApp from "./routes/routes";
import { ToastContainer } from "./Components/Toast";
import DarkmodeSwitch from "./Components/DarkModeSwitch";

function getSystemTheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div>
      <DarkmodeSwitch theme={theme} setTheme={setTheme} />
      <RoutesApp/>
      <ToastContainer />
    </div>
  );
}

export default App;