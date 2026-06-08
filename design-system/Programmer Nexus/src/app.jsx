/* global React, ReactDOM, I, Btn,
   HomePage, ServicesPage, PortfolioPage, AboutPage, CareersPage, BlogPage, ContactPage,
   AdminShell, OverviewPage, AnalyticsPage,
   ServicesAdmin, PortfolioAdmin, BlogAdmin, TestimonialsAdmin, SiteSettingsAdmin,
   TeamAdmin, CareersAdmin, ApplicationsAdmin, InquiriesAdmin, UsersAdmin, SettingsAdmin,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakToggle */

const { useState, useEffect, useRef } = React;

const LOGO = "assets/logo.png";

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "animated",
  "accent": "#3DDC9A",
  "showMarquee": true,
  "darkness": "deep"
}/*EDITMODE-END*/;

// =============================================================
// TOP NAV (marketing)
// =============================================================
function TopNav({ page, onNav }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Work" },
    { id: "about", label: "About" },
    { id: "careers", label: "Careers" },
    { id: "blog", label: "Writing" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <header className="topnav">
      <div className="wrap topnav-inner">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); onNav("home"); }}>
          <img src={LOGO} alt="" />
          <span>Programmer Nexus</span>
          <span className="brand-mark">EST. 2019</span>
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.id} href="#" className={`nav-link ${page === l.id ? "active" : ""}`}
               onClick={(e) => { e.preventDefault(); onNav(l.id); }}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <Btn variant="ghost" size="sm" onClick={() => onNav("admin")}>
            <I.shield style={{ width: 14, height: 14 }} /> Admin
          </Btn>
          <Btn variant="primary" size="sm" onClick={() => onNav("contact")}>
            Start a project <I.arrow style={{ width: 13, height: 13 }} />
          </Btn>
        </div>
      </div>
    </header>
  );
}

// =============================================================
// FOOTER
// =============================================================
function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 20 }}>
              <img src={LOGO} alt="" />
              <span>Programmer Nexus</span>
            </div>
            <p style={{ color: "var(--fg-mute)", fontSize: 14, maxWidth: 360, lineHeight: 1.6 }}>
              A senior-only engineering studio for fintech, health and AI-native products. Engineered in Dhaka, London and Lagos.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 24, color: "var(--fg-mute)", fontSize: 13 }}>
              <span><span className="accent-text">●</span> All systems operational</span>
              <span className="mono">v2.4.1</span>
            </div>
          </div>
          <div className="footer-col">
            <h5>Studio</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("services"); }}>Services</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("portfolio"); }}>Case files</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("about"); }}>About</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("careers"); }}>Careers</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Writing</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("blog"); }}>Field notes</a></li>
              <li><a href="#">Engineering</a></li>
              <li><a href="#">Design</a></li>
              <li><a href="#">RSS feed</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("contact"); }}>Start a project</a></li>
              <li><a href="mailto:partners@programmernexus.com">Partnerships</a></li>
              <li><a href="mailto:press@programmernexus.com">Press inquiries</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("admin"); }}>Admin sign-in</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Offices</h5>
            <ul>
              <li><a href="#">Dhaka — HQ</a></li>
              <li><a href="#">London</a></li>
              <li><a href="#">Lagos</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Programmer Nexus Ltd. All rights reserved.</span>
          <span>
            <a href="#" style={{ marginRight: 24 }}>Privacy</a>
            <a href="#" style={{ marginRight: 24 }}>Terms</a>
            <a href="#">Security</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// =============================================================
// ADMIN ROUTER
// =============================================================
function AdminApp() {
  const [section, setSection] = useState("overview");
  window.__adminNav = setSection;

  let body;
  switch (section) {
    case "overview": body = <OverviewPage />; break;
    case "analytics": body = <AnalyticsPage />; break;
    case "services": body = <ServicesAdmin />; break;
    case "portfolio": body = <PortfolioAdmin />; break;
    case "blog": body = <BlogAdmin />; break;
    case "testimonials": body = <TestimonialsAdmin />; break;
    case "site": body = <SiteSettingsAdmin />; break;
    case "team": body = <TeamAdmin />; break;
    case "careers": body = <CareersAdmin />; break;
    case "applications": body = <ApplicationsAdmin />; break;
    case "inquiries": body = <InquiriesAdmin />; break;
    case "users": body = <UsersAdmin />; break;
    case "settings": body = <SettingsAdmin />; break;
    default: body = <OverviewPage />;
  }

  return <AdminShell section={section} setSection={setSection} logo={LOGO}>{body}</AdminShell>;
}

// =============================================================
// MARKETING APP
// =============================================================
function MarketingApp({ page, heroVariant, onNav }) {
  let body;
  switch (page) {
    case "home": body = <HomePage heroVariant={heroVariant} />; break;
    case "services": body = <ServicesPage />; break;
    case "portfolio": body = <PortfolioPage />; break;
    case "about": body = <AboutPage />; break;
    case "careers": body = <CareersPage />; break;
    case "blog": body = <BlogPage />; break;
    case "contact": body = <ContactPage />; break;
    default: body = <HomePage heroVariant={heroVariant} />;
  }

  // Scroll to top when page changes
  useEffect(() => {
    const main = document.querySelector(".marketing-scroll");
    if (main) main.scrollTop = 0;
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  return (
    <div className="app">
      <TopNav page={page} onNav={onNav} />
      {body}
      <Footer onNav={onNav} />
    </div>
  );
}

// =============================================================
// ROOT
// =============================================================
function Root() {
  const [page, setPage] = useState("home");
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent token
  useEffect(() => {
    if (t.accent) document.documentElement.style.setProperty("--accent", t.accent);
    if (t.accent) {
      // Derive a glow
      const r = parseInt(t.accent.slice(1, 3), 16);
      const g = parseInt(t.accent.slice(3, 5), 16);
      const b = parseInt(t.accent.slice(5, 7), 16);
      document.documentElement.style.setProperty("--accent-glow", `rgba(${r},${g},${b},0.16)`);
    }
  }, [t.accent]);

  // Darkness shifts the bg/surface scale slightly
  useEffect(() => {
    const root = document.documentElement;
    if (t.darkness === "deep") {
      root.style.setProperty("--bg", "#07090C");
      root.style.setProperty("--surface-0", "#0B1016");
      root.style.setProperty("--surface-1", "#10161E");
    } else if (t.darkness === "soft") {
      root.style.setProperty("--bg", "#0F141B");
      root.style.setProperty("--surface-0", "#141A22");
      root.style.setProperty("--surface-1", "#1A212A");
    } else {
      root.style.setProperty("--bg", "#000000");
      root.style.setProperty("--surface-0", "#080A0E");
      root.style.setProperty("--surface-1", "#0D1118");
    }
  }, [t.darkness]);

  const nav = (p) => setPage(p);
  window.__nav = nav;

  return (
    <>
      {page === "admin"
        ? <AdminApp />
        : <MarketingApp page={page} heroVariant={t.hero} onNav={nav} />
      }
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero treatment">
          <TweakRadio label="Variant" value={t.hero} onChange={(v) => setT("hero", v)} options={[
            { value: "animated", label: "Grid" },
            { value: "split", label: "Code" },
            { value: "editorial", label: "Serif" },
          ]} />
        </TweakSection>
        <TweakSection label="Brand">
          <TweakColor label="Accent" value={t.accent} onChange={(v) => setT("accent", v)}
            options={["#3DDC9A", "#4F7BE6", "#F5A524", "#C792EA", "#FF5A5F", "#F2F5F8"]} />
          <TweakRadio label="Depth" value={t.darkness} onChange={(v) => setT("darkness", v)} options={[
            { value: "deep", label: "Deep" },
            { value: "soft", label: "Soft" },
            { value: "ink", label: "Ink" },
          ]} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
