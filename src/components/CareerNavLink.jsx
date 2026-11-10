export default function CareerNavLink() {
  function openCareerLog() {
    window.dispatchEvent(new Event("portfolio-open-career-log"));
  }

  return (
    <a href="#control-plane" onClick={openCareerLog}>
      <span className="lang-id">Karier</span>
      <span className="lang-en">Career</span>
    </a>
  );
}
