import { useEffect, useRef, useState } from "react";

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
const TYPE_INTERVAL_MS = 18;

function getStartupOutput(language) {
  return [
    {
      command: "",
      result: language === "en" ? "Last login: portfolio-web" : "Login terakhir: portfolio-web",
    },
    {
      command: "help",
      result:
        language === "en"
          ? "whoami — profile | ls projects/ — work | cat experience.log — career | curl /skills — stack | help — command list"
          : "whoami — profil | ls projects/ — karya | cat experience.log — karier | curl /skills — keahlian | help — daftar perintah",
    },
  ];
}

function getTypedStartupOutput(language, characterCount) {
  const [login, help] = getStartupOutput(language);
  let remaining = characterCount;

  if (remaining < login.result.length) {
    return [{ ...login, result: login.result.slice(0, remaining) }];
  }

  remaining -= login.result.length;
  if (remaining < help.command.length) {
    return [login, { ...help, command: help.command.slice(0, remaining), result: "" }];
  }

  remaining -= help.command.length;
  return [login, { ...help, result: help.result.slice(0, remaining) }];
}

export default function HeroTerminal() {
  const [language, setLanguage] = useState("id");
  const [value, setValue] = useState("");
  const [activeCommand, setActiveCommand] = useState("whoami");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [booting, setBooting] = useState(false);
  const [typingProgress, setTypingProgress] = useState(null);
  const [output, setOutput] = useState([]);
  const typingTimer = useRef(null);
  const outputRef = useRef(null);
  const typingSequence = useRef(0);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const initialLanguage = document.documentElement.dataset.language || "id";
    setLanguage(initialLanguage);
    const startupOutput = getStartupOutput(initialLanguage);
    const fullTextLength = startupOutput.reduce(
      (total, item) => total + item.command.length + item.result.length,
      0,
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(startupOutput);
    } else {
      setBooting(true);
      setOutput([]);
      let characterCount = 0;
      const sequence = ++typingSequence.current;
      typingTimer.current = window.setInterval(() => {
        if (sequence !== typingSequence.current) return;
        characterCount += 1;
        const partialOutput = getTypedStartupOutput(initialLanguage, characterCount);
        setOutput((items) =>
          sequence === typingSequence.current ? partialOutput : items,
        );
        if (characterCount >= fullTextLength) {
          window.clearInterval(typingTimer.current);
          typingTimer.current = null;
          setOutput((items) =>
            sequence === typingSequence.current ? startupOutput : items,
          );
          setBooting((current) =>
            sequence === typingSequence.current ? false : current,
          );
        }
      }, TYPE_INTERVAL_MS);
    }

    const updateLanguage = (event) => {
      typingSequence.current += 1;
      if (typingTimer.current) {
        window.clearInterval(typingTimer.current);
        typingTimer.current = null;
      }
      setBooting(false);
      setTypingProgress(null);
      setLanguage(event.detail);
      setOutput(getStartupOutput(event.detail));
    };
    window.addEventListener("portfolio-language", updateLanguage);
    return () => {
      if (typingTimer.current) window.clearInterval(typingTimer.current);
      window.removeEventListener("portfolio-language", updateLanguage);
    };
  }, []);

  function stopTyping() {
    typingSequence.current += 1;
    if (typingTimer.current) {
      window.clearInterval(typingTimer.current);
      typingTimer.current = null;
    }
    setTypingProgress(null);
  }

  function run(raw, animate = false) {
    stopTyping();
    setBooting(false);
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
    const result = responses[command] ||
      (language === "en" ? "Unknown command. Type help to see available commands." : "Perintah tidak dikenal. Ketik help untuk melihat daftar perintah.");
    const shouldAnimate = animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (shouldAnimate) {
      const itemIndex = output.length;
      setOutput((items) => [...items, { command, result }]);
      setTypingProgress({ index: itemIndex, characters: 0 });
      let characterCount = 0;
      const totalCharacters = command.length + result.length;
      const sequence = typingSequence.current;
      typingTimer.current = window.setInterval(() => {
        if (sequence !== typingSequence.current) return;
        characterCount += 1;
        const complete = characterCount >= totalCharacters;
        setTypingProgress((current) =>
          sequence === typingSequence.current
            ? complete
              ? null
              : { index: itemIndex, characters: characterCount }
            : current,
        );
        if (complete) {
          window.clearInterval(typingTimer.current);
          typingTimer.current = null;
        }
      }, TYPE_INTERVAL_MS);
    } else {
      setOutput((items) => [...items, { command, result }]);
    }
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
        <h1>{language === "en" ? "I build backend systems that move real work." : "Saya membangun backend yang menggerakkan operasional."}</h1>
        <p className="lead">
          {language === "en"
            ? "I’m Agung Nugraha, a software engineer focused on backend engineering. I work on APIs, marketplace integrations, and the product workflows connected to them."
            : "Saya Agung Nugraha, software engineer dengan fokus pada backend. Saya menangani API, integrasi marketplace, dan alur produk yang terhubung dengannya."}
        </p>
        <div className="hero-proof">
          <strong className="experience-years">8+</strong>
          <span>
            {language === "en"
              ? "years of software engineering experience"
              : "tahun pengalaman software engineering"}
          </span>
        </div>
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
                  run(command, true);
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
        <div ref={outputRef} className="terminal-output" aria-live={booting || typingProgress ? "off" : "polite"}>
          {output.map((item, index) => (
            <div key={index}>
              {(() => {
                const isTypingThisItem = typingProgress?.index === index;
                const visibleCharacters = isTypingThisItem ? typingProgress.characters : Infinity;
                const visibleCommand = item.command.slice(0, Math.min(visibleCharacters, item.command.length));
                const visibleResult = isTypingThisItem
                  ? item.result.slice(
                      0,
                      Math.max(0, visibleCharacters - item.command.length),
                    )
                  : item.result;

                return (
                  <>
              {(visibleCommand || isTypingThisItem) && (
                <p>
                  <span className="prompt">nugraha@dev:~$</span> {visibleCommand}
                </p>
              )}
              <p className="response">{visibleResult}</p>
                  </>
                );
              })()}
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
