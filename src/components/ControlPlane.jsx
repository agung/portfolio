import { useEffect, useState } from "react";

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
const projects = ["Hushpuppies", "ACE & Informa", "OMS support"];
const products = [
  "OMS",
  "PIM",
  "Affiliate",
  "Journal",
  "Marketplace Adapter",
  "Belanjaku",
];
const jobs = [
  { period: "2019—2020", role: "Junior Backend Engineer", company: "ICUBE" },
  {
    period: "2020—2025",
    role: "Software Engineer",
    company: "iCube by SIRCLO",
  },
  { period: "2025—Sekarang", role: "Software Engineer", company: "ICUBE" },
];
const endpoints = ["about", "skills", "projects", "experience", "contact"];
const responseData = {
  about: {
    name: "Agung Nugraha",
    role: "Software Engineer",
    focus: "Backend Engineering",
    open_to_work: true,
  },
  skills,
  projects: {
    products,
    projects,
    integrations: ["Shopee", "TikTok", "Lazada", "Blibli", "Shopify"],
  },
  experience: { roles: jobs, contribution: "Trainer di Kawan Lama" },
  contact: { status: "Contact email", email: "nugraha.an96@gmail.com" },
};
const marketplaces = ["Shopee", "TikTok", "Lazada", "Blibli", "Shopify"];

function HighlightedJson({ value }) {
  const pattern = /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}\[\],:]|\s+|./gs;
  const tokens = [...value.matchAll(pattern)];

  return (
    <>
      {tokens.map((token, index) => {
        const text = token[0];
        let type = "punctuation";

        if (text.startsWith('"')) {
          type = /^\s*:/.test(value.slice(token.index + text.length))
            ? "key"
            : "string";
        } else if (/^-?\d/.test(text)) {
          type = "number";
        } else if (/^(true|false|null)$/.test(text)) {
          type = "literal";
        } else if (/^\s+$/.test(text)) {
          return text;
        }

        return (
          <span className={`json-${type}`} key={`${index}-${token.index}`}>
            {text}
          </span>
        );
      })}
    </>
  );
}

function getResponseText(endpoint, language) {
  const payload =
    endpoint === "experience"
      ? {
          ...responseData.experience,
          roles: responseData.experience.roles.map((job) => ({
            ...job,
            period:
              language === "en"
                ? job.period.replace("Sekarang", "Present")
                : job.period,
          })),
          contribution:
            language === "en" ? "Trainer at Kawan Lama" : "Trainer di Kawan Lama",
        }
      : endpoint === "contact"
        ? {
            ...responseData.contact,
            status: language === "en" ? "Contact email" : "Email kontak",
          }
        : responseData[endpoint];

  return JSON.stringify(payload, null, 2);
}

function ApiView({ language }) {
  const [expanded, setExpanded] = useState("about");
  const [response, setResponse] = useState(null);
  const [requesting, setRequesting] = useState(null);
  return (
    <div className="view active">
      <div className="view-head">
        <div>
          <p className="meta">OpenAPI 3.1</p>
          <h3>{language === "en" ? "Portfolio API" : "API Portofolio"}</h3>
        </div>
        <span className="tag">BASE /api/v1</span>
      </div>
      <div>
        {endpoints.map((endpoint) => {
          const responseText =
            response === endpoint ? getResponseText(endpoint, language) : null;

          return (
            <details
            key={endpoint}
            className="endpoint"
            open={expanded === endpoint}
            onToggle={(event) => {
              if (event.currentTarget.open) setExpanded(endpoint);
            }}
          >
            <summary>
              <span
                className={`method ${endpoint === "contact" ? "post" : ""}`}
              >
                {endpoint === "contact" ? "POST" : "GET"}
              </span>
              <span className="path">/{endpoint}</span>
              <span className="hint">
                {endpoint === "contact" ? (language === "en" ? "Contact email" : "Email kontak") : (language === "en" ? "Try it out" : "Coba endpoint")}
              </span>
            </summary>
            <div className="endpoint-body">
              <div>
                <p>
                  {endpoint === "about"
                    ? language === "en" ? "Profile and work focus." : "Profil dan fokus kerja."
                    : endpoint === "skills"
                      ? language === "en" ? "Languages and tools." : "Bahasa dan tools."
                      : endpoint === "projects"
                        ? language === "en" ? "Products and projects I have worked on." : "Produk dan project yang pernah ditangani."
                        : endpoint === "experience"
                          ? language === "en" ? "Career timeline." : "Timeline karier."
                          : language === "en" ? "Contact address." : "Alamat kontak."}
                </p>
                <button
                  className="try"
                  type="button"
                  onClick={() => {
                    setRequesting(endpoint);
                    window.setTimeout(() => {
                      setResponse(endpoint);
                      setRequesting(null);
                    }, 360);
                  }}
                >
                  {requesting === endpoint
                    ? language === "en" ? "Requesting…" : "Meminta…"
                    : language === "en" ? "Try it out" : "Coba endpoint"}
                </button>
              </div>
              <pre className="json">
                {requesting === endpoint ? (
                  <span className="request-status">HTTP/1.1 · {language === "en" ? "SENDING REQUEST" : "MENGIRIM REQUEST"}</span>
                ) : responseText ? (
                  <HighlightedJson value={responseText} />
                ) : (
                  language === "en"
                    ? "Run Try it out to display the response."
                    : "Tekan Coba endpoint untuk menampilkan response."
                )}
              </pre>
            </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

function MonitorView({ language }) {
  return (
    <div className="view active">
      <div className="view-head">
        <div>
          <p className="meta">{language === "en" ? "DEMO TELEMETRY — NOT PRODUCTION DATA" : "DEMO TELEMETRY — BUKAN DATA PRODUKSI"}</p>
          <h3>{language === "en" ? "Portfolio request shape" : "Pola request portofolio"}</h3>
        </div>
        <span className="metrics-note">{language === "en" ? "ANALYTICS NOT CONNECTED" : "ANALYTICS BELUM TERHUBUNG"}</span>
      </div>
      <p>
        {language === "en" ? "A monitoring panel concept. It does not show actual uptime, latency, or request data." : "Ilustrasi panel monitoring. Tidak menampilkan uptime, latency, atau request aktual."}
      </p>
      <div className="chart">
        <svg
          viewBox="0 0 900 210"
          role="img"
          aria-label={language === "en" ? "Demo telemetry chart illustration" : "Ilustrasi grafik telemetry demo"}
        >
          <line
            x1="0"
            y1="180"
            x2="900"
            y2="180"
            stroke="currentColor"
            opacity=".2"
          />
          <line
            x1="0"
            y1="100"
            x2="900"
            y2="100"
            stroke="currentColor"
            opacity=".1"
          />
          <polyline
            fill="none"
            stroke="#D9541E"
            strokeWidth="4"
            points="0,155 90,145 180,160 270,105 360,125 450,70 540,95 630,55 720,105 810,75 900,90"
          />
        </svg>
      </div>
      <div className="health-row">
        <b>{language === "en" ? "SERVICE SURFACE" : "AREA LAYANAN"}</b>
        <b>{language === "en" ? "STATE" : "STATUS"}</b>
        <b>{language === "en" ? "SOURCE" : "SUMBER"}</b>
      </div>
      <div className="health-row">
        <span>portfolio-web</span>
        <span>demo</span>
        <span>static</span>
      </div>
      <div className="health-row">
        <span>contact-endpoint</span>
        <span>pending</span>
        <span>not wired</span>
      </div>
    </div>
  );
}

function MapView({ language }) {
  const [selected, setSelected] = useState("Marketplace Adapter");
  const description =
    selected === "Marketplace Adapter"
      ? language === "en" ? "Integrations with Shopee, TikTok, Lazada, Blibli, and Shopify." : "Integrasi dengan Shopee, TikTok, Lazada, Blibli, dan Shopify."
      : language === "en" ? `${selected} connects through the Marketplace Adapter.` : `${selected} terhubung melalui Marketplace Adapter.`;
  return (
    <div className="view active">
      <div className="view-head">
        <div>
          <p className="meta">INTEGRATION FLOW</p>
          <h3>Marketplace Adapter</h3>
        </div>
      </div>
      <div className="map-layout">
        <div className={`map-canvas ${selected !== "Marketplace Adapter" ? "has-selection" : ""}`}>
          <div className="flow-source">
          <span className="flow-label">{language === "en" ? "INTEGRATION LAYER" : "LAPISAN INTEGRASI"}</span>
            <button
              className={`flow-node ${selected === "Marketplace Adapter" ? "selected" : ""}`}
              type="button"
              onClick={() => setSelected("Marketplace Adapter")}
            >
              Marketplace Adapter
            </button>
            <span className="flow-description">Marketplace connections</span>
          </div>
          <div className="flow-connector" aria-hidden="true">
            <span>{language === "en" ? "CONNECTS TO" : "TERHUBUNG KE"}</span>
            <i />
          </div>
          <div className="flow-targets">
            <span className="flow-label">MARKETPLACE</span>
            {marketplaces.map((marketplace) => (
              <button
                key={marketplace}
                className={`flow-node ${selected === marketplace ? "selected" : ""}`}
                type="button"
                onClick={() => setSelected(marketplace)}
              >
                {marketplace}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
        <aside className="node-detail">
          <p className="meta">{language === "en" ? "SELECTED NODE" : "NODE TERPILIH"}</p>
          <h4>{selected}</h4>
          <p>{description}</p>
          <div className="need">
            {language === "en" ? "Architecture details and technical decisions have not been provided." : "Detail arsitektur dan keputusan teknis belum dicantumkan."}
          </div>
        </aside>
      </div>
      <div className="other-products">
        <span className="flow-label">{language === "en" ? "OTHER PRODUCTS I HAVE WORKED ON" : "PRODUK LAIN YANG PERNAH DITANGANI"}</span>
        <div className="product-tags">
          {products
            .filter(
              (product) => !["OMS", "Marketplace Adapter"].includes(product),
            )
            .concat("OMS")
            .map((product) => (
              <span key={product}>{product}</span>
            ))}
        </div>
      </div>
    </div>
  );
}

function LogsView({ language }) {
  return (
    <div className="view active">
      <div id="career-log" className="view-head">
        <div>
          <p className="meta">experience.log</p>
          <h3>{language === "en" ? "Career and field notes" : "Karier dan catatan lapangan"}</h3>
        </div>
      </div>
      {jobs.map((job, index) => (
        <article key={job.period} className={`log-row log-row-${index + 1}`}>
          <time>{language === "en" ? job.period.replace("Sekarang", "Present") : job.period}</time>
            <span className="meta">
            [{index === 2 ? (language === "en" ? "ACTIVE" : "AKTIF") : index === 0 ? (language === "en" ? "START" : "MULAI") : (language === "en" ? "LEVEL" : "LANJUTAN")}]
          </span>
          <div>
            <strong>{job.role}</strong>
            <p>{job.company}</p>
          </div>
        </article>
      ))}
      <article className="log-row log-row-4">
        <time>{language === "en" ? "FIELD NOTE" : "CATATAN"}</time>
        <span>[SHARE]</span>
        <div>
          <strong>{language === "en" ? "Trainer at Kawan Lama" : "Trainer di Kawan Lama"}</strong>
          <p>{language === "en" ? "Knowledge sharing / client enablement" : "Berbagi pengetahuan / pendampingan klien"}</p>
        </div>
      </article>
      <div className="postmortem">
        <p className="meta">{language === "en" ? "POSTMORTEM / EMPTY STATE" : "POSTMORTEM / BELUM DIISI"}</p>
        <b>{language === "en" ? "Add a real incident." : "Tambahkan satu incident nyata."}</b>
        <p>
          {language === "en" ? "Add the problem, root cause, fix, and outcome when the details are ready. No invented stories or metrics." : "Isi problem, root cause, perbaikan, dan hasil setelah detailnya siap. Tidak ada cerita atau angka rekaan."}
        </p>
      </div>
    </div>
  );
}

const views = [
  {
    id: "api",
    label: "API Explorer",
    sub: "request / response",
    Component: ApiView,
  },
  {
    id: "monitor",
    label: "Telemetry",
    sub: "demo signals",
    Component: MonitorView,
  },
  {
    id: "map",
    label: "System Map",
    sub: "product context",
    Component: MapView,
  },
  {
    id: "logs",
    label: "Career Log",
    sub: "timeline / notes",
    Component: LogsView,
  },
];

export default function ControlPlane() {
  const [active, setActive] = useState("api");
  const [language, setLanguage] = useState("id");
  useEffect(() => {
    setLanguage(document.documentElement.dataset.language || "id");
    const updateLanguage = (event) => setLanguage(event.detail);
    const openCareerLog = () => setActive("logs");
    window.addEventListener("portfolio-language", updateLanguage);
    window.addEventListener("portfolio-open-career-log", openCareerLog);
    return () => {
      window.removeEventListener("portfolio-language", updateLanguage);
      window.removeEventListener("portfolio-open-career-log", openCareerLog);
    };
  }, []);
  const labels = language === "en"
    ? [["API Explorer", "request / response"], ["Telemetry", "demo signals"], ["System Map", "product context"], ["Career Log", "timeline / notes"]]
    : [["API Explorer", "request / response"], ["Telemetry", "sinyal demo"], ["Peta Sistem", "konteks produk"], ["Log Karier", "linimasa / catatan"]];
  const ActiveView =
    views.find((view) => view.id === active)?.Component || ApiView;
  return (
    <section id="control-plane" className="control">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="meta">/portfolio/control-plane</p>
            <h2>{language === "en" ? "Inspect the system." : "Jelajahi sistemnya."}</h2>
          </div>
          <p>
            {language === "en" ? "One place to explore my profile, try API endpoints, view demo telemetry, and understand the products and experience behind my work." : "Satu tempat untuk mengenal profil, mencoba endpoint API, melihat telemetry demo, dan memahami produk serta pengalaman kerja saya."}
          </p>
        </div>
        <div className="workspace">
          <nav className="rail" aria-label={language === "en" ? "Control plane views" : "Tampilan control plane"}>
            {views.map((view, index) => (
              <button
                key={view.id}
                className="mode"
                type="button"
                aria-selected={active === view.id}
                onClick={() => setActive(view.id)}
              >
                <span className="no">0{index + 1}</span>
                <span>
                  <b>{labels[index][0]}</b>
                  <small>{labels[index][1]}</small>
                </span>
              </button>
            ))}
          </nav>
          <div className="stage">
            <ActiveView language={language} />
          </div>
        </div>
      </div>
    </section>
  );
}
