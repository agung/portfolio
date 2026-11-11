import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState("id");
  useEffect(() => {
    const initial = document.documentElement.dataset.theme === "dark";
    setDark(initial);
    setLanguage(document.documentElement.dataset.language || "id");
    const updateLanguage = (event) => setLanguage(event.detail);
    window.addEventListener("portfolio-language", updateLanguage);
    return () => window.removeEventListener("portfolio-language", updateLanguage);
  }, []);
  const toggleLabel = dark
    ? language === "en" ? "Switch to light mode" : "Aktifkan mode terang"
    : language === "en" ? "Switch to dark mode" : "Aktifkan mode gelap";
  function toggle(event) {
    const next = !dark;
    const root = document.documentElement;
    const applyTheme = () => {
      flushSync(() => setDark(next));
      if (next) root.dataset.theme = "dark";
      else delete root.dataset.theme;
      try {
        localStorage.setItem("nugraha-theme", next ? "dark" : "light");
      } catch {}
    };

    const transition = document.startViewTransition;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof transition !== "function" || reducedMotion) {
      applyTheme();
      return;
    }

    const buttonBounds = event.currentTarget.getBoundingClientRect();
    const x = buttonBounds.left + buttonBounds.width / 2;
    const y = buttonBounds.top + buttonBounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    root.style.setProperty("--theme-origin-x", `${x}px`);
    root.style.setProperty("--theme-origin-y", `${y}px`);
    root.style.setProperty("--theme-radius", `${radius}px`);
    root.dataset.themeMotion = next ? "expand" : "collapse";

    const cleanup = () => {
      delete root.dataset.themeMotion;
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
      root.style.removeProperty("--theme-radius");
    };

    try {
      transition.call(document, applyTheme).finished.finally(cleanup);
    } catch {
      cleanup();
      applyTheme();
    }
  }
  return (
    <button
      className="theme"
      type="button"
      aria-label={toggleLabel}
      title={toggleLabel}
      onClick={toggle}
    >
      <svg
        className={`theme-icon ${dark ? "is-dark" : "is-light"}`}
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </>
        ) : (
          <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        )}
      </svg>
    </button>
  );
}
