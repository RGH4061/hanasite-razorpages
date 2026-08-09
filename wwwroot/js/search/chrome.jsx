/* Shared chrome + search components for the Hana site-search placement concepts. */

const HS_ICON = {
  search: "M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16M21 21l-4.35-4.35",
  x: "M18 6 6 18M6 6l12 12",
  arrow: "M5 12h14M12 5l7 7-7 7",
  hash: "M4 9h16M4 15h16M10 3 8 21M16 3l-2 18",
  check: "M20 6 9 17l-5-5",
  dash: "M5 12h14",
  chevron: "M9 6l6 6-6 6",
  filter: "M3 6h18M7 12h10M11 18h2",
  menu: "M3 6h18M3 12h18M3 18h18",
  help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 17h.01M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6"
};

function Icon({ name, size = 20, sw = 1.7, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {HS_ICON[name].split("M").filter(Boolean).map((d, i) => <path key={i} d={"M" + d} />)}
    </svg>
  );
}

/* ── The input. One component, three sizes: page (F), scoped (D/E), sheet (mobile). ── */
function SearchField({ value, onChange, placeholder, size = "page", label, autoFocus, right }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);
  return (
    <div className={"hs-fieldwrap hs-fieldwrap--" + size}>
      {label && <div className="hs-fieldlabel">{label}</div>}
      <div className="hs-field">
        <span className="hs-field-ico"><Icon name="search" size={size === "scoped" ? 19 : 21} /></span>
        <input ref={ref} value={value} placeholder={placeholder} spellCheck="false"
          onChange={e => onChange(e.target.value)} />
        {value && <button className="hs-field-x" onClick={() => onChange("")} aria-label="Clear"><Icon name="x" size={17} /></button>}
        {right}
      </div>
    </div>
  );
}

/* ── Query analysis strip. Optional by tweak — see 01-placement-brief.md. ── */
function AnalysisStrip({ res }) {
  if (!res.raw || !res.toks.length) return null;
  const hint = res.hint;
  return (
    <div className="hs-parse">
      <div className="hs-parse-lb">How the search reads this</div>
      <div className="hs-parse-row">
        {res.toks.map((t, i) => (
          <span key={i} className={"hs-tok" + (t.noise ? " noise" : t.df ? " sharp" : " dead")}>
            <b>{t.raw}</b>
            <span className="why">{t.noise
              ? `on ${t.pc}% of pages${t.raw !== t.w ? ` · read as “${t.w}”` : ""} · sets a filter`
              : t.df ? `on ${t.df} page${t.df === 1 ? "" : "s"} · ranks` : "not in the index"}</span>
          </span>
        ))}
        {hint && <span className="hs-tok-hint">→ boosting <b>{hint}</b></span>}
      </div>
    </div>
  );
}

/* ── The certification card. The direct answer, above page results. ── */
function CertCard({ cert, compact, mobile }) {
  const SITES = window.HS.SITES;
  const total = Object.keys(SITES).length;
  const open = cert.sites.filter(s => s.unconfirmed).length;
  const firm = cert.sites.length - open;
  const none = firm === 0;
  return (
    <section className={"hs-cert" + (none ? " hs-cert--none" : "") + (mobile ? " hs-cert--m" : "")}>
      <div className="hs-cert-h">
        <div className="hs-cert-lb">Direct answer · certification</div>
        <h2 className="hs-cert-n">{cert.full}</h2>
        <p className="hs-cert-s">{cert.scope}</p>
        <div className="hs-cert-c">
          <span className={"hs-dot" + (none ? " warm" : "")} />
          <span>{none
            ? `Stated in the 2026 deck for ${cert.sites.length} of ${total} sites. No certificate supplied for any of them — not publishable yet.`
            : `Held at ${cert.sites.length} of ${total} Hana sites`}</span>
            {!none && open > 0 && <span>{` · ${open} awaiting certificate detail from the plant`}</span>}
        </div>
      </div>
      <div className="hs-cert-tb">
        {!mobile && <div className="hs-cert-hr">
          <span>Site</span><span>Certificate</span><span>Date</span><span />
        </div>}
        {cert.sites.map((s, i) => {
          const S = SITES[s.s];
          const tbc = !!s.unconfirmed;
          return (
            <a key={i} href="#" className={"hs-cert-r" + (tbc ? " tbc" : "")} onClick={e => e.preventDefault()}>
              <span className="hs-c-site"><b>{S.n}</b><small>{S.c}</small></span>
              {tbc
                ? <span className="hs-c-tbc"><span className="hs-chip warm">To confirm</span></span>
                : <><span className="hs-c-num">{s.num}</span>
                   <span className="hs-c-body">{s.date}</span></>}
              <span className="hs-c-go"><Icon name="arrow" size={17} /></span>
              {s.note && <span className="hs-c-note">{s.note}</span>}
            </a>
          );
        })}
      </div>
      <div className="hs-cert-f">
        <p>Each site links to its location page, where the certificate PDF can be downloaded.</p>
        <p className="hs-src">Sourced from the current quality pages and the 2026 company overview deck. Not yet confirmed by any plant.</p>
      </div>
    </section>
  );
}

Object.assign(window, { Icon, HS_ICON, SearchField, AnalysisStrip, CertCard });
