import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const [language, setLanguage] = useState("id");

  useEffect(() => {
    setLanguage(document.documentElement.dataset.language || "id");
  }, []);

  function selectLanguage(next) {
    setLanguage(next);
    document.documentElement.dataset.language = next;
    document.documentElement.lang = next;
    try {
      localStorage.setItem("nugraha-language", next);
    } catch {}
    window.dispatchEvent(new CustomEvent("portfolio-language", { detail: next }));
  }

  return (
    <div className="language-toggle" role="group" aria-label="Pilih bahasa / Choose language">
      {["id", "en"].map((item) => (
        <button key={item} type="button" aria-pressed={language === item} onClick={() => selectLanguage(item)}>
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
