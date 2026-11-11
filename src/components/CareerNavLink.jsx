export default function CareerNavLink({ isHome = true }) {
  function openCareerLog() {
    if (isHome) window.dispatchEvent(new Event("portfolio-open-career-log"));
  }

  return (
    <a href={isHome ? "#control-plane" : "/#control-plane"} onClick={openCareerLog}>
      <span className="lang-id">Karier</span>
      <span className="lang-en">Career</span>
    </a>
  );
}
