import { useEffect, useState } from "react";

const commands = [
  "whoami",
  "ls projects/",
  "cat about.md",
  "cat experience.log",
  "curl /skills",
  "help",
  "clear",
];
const skills = [
  "PHP",
  "Golang",
  "REST API",
  "MySQL",
  "Git",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "React",
];
const jobs = [
  "2019—2020 Junior Backend Engineer @ ICUBE",
  "2020—2025 Software Engineer @ iCube by SIRCLO",
  "2025—Sekarang Software Engineer @ ICUBE",
];

export default function HeroTerminal() {
  const [language, setLanguage] = useState("id");
  const [value, setValue] = useState("");
  const [activeCommand, setActiveCommand] = useState("whoami");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [output, setOutput] = useState([
    { command: "", result: "Last login: portfolio-web" },
    {
      command: "help",
      result:
        "whoami — profile | ls projects/ — work | cat experience.log — career | curl /skills — stack | help — command list",
    },
  ]);

  useEffect(() => {
    const initialLanguage = document.documentElement.dataset.language || "id";
    setLanguage(initialLanguage);
    setOutput([
      { command: "", result: initialLanguage === "en" ? "Last login: portfolio-web" : "Login terakhir: portfolio-web" },
      {
        command: "help",
        result: initialLanguage === "en"
          ? "whoami — profile | ls projects/ — work | cat experience.log — career | curl /skills — stack | help — command list"
          : "whoami — profil | ls projects/ — karya | cat experience.log — karier | curl /skills — keahlian | help — daftar perintah",
      },
    ]);
    const updateLanguage = (event) => {
      setLanguage(event.detail);
      setOutput([
        { command: "", result: event.detail === "en" ? "Last login: portfolio-web" : "Login terakhir: portfolio-web" },
        {
          command: "help",
          result: event.detail === "en"
            ? "whoami — profile | ls projects/ — work | cat experience.log — career | curl /skills — stack | help — command list"
            : "whoami — profil | ls projects/ — karya | cat experience.log — karier | curl /skills — keahlian | help — daftar perintah",
        },
      ]);
    };
    window.addEventListener("portfolio-language", updateLanguage);
    return () => window.removeEventListener("portfolio-language", updateLanguage);
  }, []);

  function run(raw) {
    const command = raw.trim();
    if (!command) return;
    if (command === "clear") {
      setOutput([]);
      setValue("");
      return;
    }
    const responses = {
      whoami: language === "en"
        ? "Agung Nugraha — Software Engineer | backend-focused | open to work"
        : "Agung Nugraha — Software Engineer | fokus backend | terbuka untuk kerja",
      "ls projects/": "hushpuppies/  ace-informa/  oms-support/",
      "cat about.md": language === "en"
        ? "Software engineer focused on backend engineering, APIs, and marketplace integrations. Practical frontend capability."
        : "Software engineer yang berfokus pada backend, API, dan integrasi marketplace. Memiliki kemampuan frontend praktis.",
      "cat experience.log": `${jobs.map((job) => language === "en" ? job.replace("Sekarang", "Present") : job).join(" | ")} | ${language === "en" ? "Trainer at Kawan Lama" : "Trainer di Kawan Lama"}`,
      "curl /skills": skills.join(" · "),
      help: `Commands: ${commands.join(" | ")}`,
    };
    setOutput((items) => [
      ...items,
      {
        command,
        result:
          responses[command] ||
          (language === "en" ? "Unknown command. Type help to see available commands." : "Perintah tidak dikenal. Ketik help untuk melihat daftar perintah."),
      },
    ]);
    setHistory((items) => [...items, command]);
    setHistoryIndex(history.length + 1);
    setValue("");
  }

  function onKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      const match = commands.find((item) => item.startsWith(value));
      if (match) setValue(match);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next] || "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = Math.min(history.length, historyIndex + 1);
      setHistoryIndex(next);
      setValue(history[next] || "");
    }
  }

  return (
    <section id="console" className="wrap hero">
      <div>
        <p className="eyebrow">HTTP/1.1 200 AVAILABLE</p>
        <h1>{language === "en" ? "I build the layer behind the interface." : "Saya membangun sistem di balik antarmuka."}</h1>
        <p className="lead">
          {language === "en"
            ? "I’m Nugraha, a software engineer focused on backend systems. I build APIs, marketplace integrations, and the systems that connect products to day-to-day operations."
            : "Saya Nugraha, software engineer dengan fokus backend. Saya menangani API, integrasi marketplace, dan sistem yang menghubungkan produk dengan operasional sehari-hari."}
        </p>
        <div className="chips">
          {commands
            .slice(0, 2)
            .concat(commands[4])
            .map((command) => (
              <button
                key={command}
                type="button"
                aria-pressed={activeCommand === command}
                onClick={() => {
                  setActiveCommand(command);
                  run(command);
                }}
              >
                {command}
              </button>
            ))}
        </div>
      </div>
      <div className="terminal">
        <div className="terminal-head">
          <span>portfolio-shell — {language === "en" ? "interactive" : "interaktif"}</span>
          <span>{language === "en" ? "session active" : "sesi aktif"}</span>
        </div>
        <div className="terminal-output" aria-live="polite">
          {output.map((item, index) => (
            <div key={`${index}-${item.command}`}>
              {item.command && (
                <p>
                  <span className="prompt">nugraha@dev:~$</span> {item.command}
                </p>
              )}
              <p className="response">{item.result}</p>
            </div>
          ))}
        </div>
        <form
          className="terminal-form"
          onSubmit={(event) => {
            event.preventDefault();
            run(value);
          }}
        >
          <label className="prompt" htmlFor="terminal-input">
            $
          </label>
          <input
            id="terminal-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={language === "en" ? "Type a command or press Tab" : "Ketik perintah atau tekan Tab"}
            autoComplete="off"
            aria-label={language === "en" ? "Terminal command" : "Perintah terminal"}
          />
          <span style={{ color: "#aaa" }}>↑↓</span>
        </form>
      </div>
    </section>
  );
}
