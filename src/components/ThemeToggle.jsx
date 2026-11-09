import { useEffect, useState } from "react";

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
  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem("nugraha-theme", next ? "dark" : "light");
    } catch {}
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
