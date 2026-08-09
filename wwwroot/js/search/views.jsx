/* The three placements. F · dedicated results page, D · capabilities scoped,
   E · locations certification lookup. */

const SEC_ABBR = { "Investor Relations": "Investors" };

function ResultRow({ r, showWhy, mobile }) {
  const p = r.p;
  const isAnchor = !!p.anchor;
  return (
    <a href="#" className={"hs-res" + (isAnchor ? " hs-res--anchor" : "")} onClick={e => e.preventDefault()}>
      {isAnchor && <span className="hs-res-m"><Icon name="hash" size={15} sw={1.9} /></span>}
      <span className="hs-res-b">
        <span className="hs-res-t">
          {p.n}
          {isAnchor && <span className="hs-res-in">section of {p.anchor}</span>}
          {p.miss && <span className="hs-chip warm">Page not yet written</span>}
        </span>
        <span className="hs-res-d">{p.k}</span>
        <span className="hs-res-u">{p.u}</span>
        {showWhy && r.hits.length > 0 &&
          <span className="hs-res-w">matched {r.hits.map(h => `“${h[0]}” in ${h[1]}`).join(" · ")}</span>}
      </span>
      <span className="hs-res-go"><Icon name="arrow" size={18} /></span>
    </a>
  );
}

function Group({ g, showWhy, mobile }) {
  const [open, setOpen] = React.useState(false);
  const cap = 5;
  const items = open ? g.items : g.items.slice(0, cap);
  const rest = g.items.length - items.length;
  return (
    <section className="hs-group">
      <h2 className="hs-group-h">{g.section}<span>{g.items.length}</span></h2>
      <div className="hs-group-b">
        {items.map((r, i) => <ResultRow key={r.p.u + i} r={r} showWhy={showWhy} mobile={mobile} />)}
      </div>
      {rest > 0 && <button className="hs-more" onClick={() => setOpen(true)}>Show {rest} more in {g.section}<Icon name="chevron" size={15} style={{ transform: "rotate(90deg)" }} /></button>}
    </section>
  );
}

function EmptyState({ q }) {
  return (
    <section className="hs-empty">
      <h2>No page matches “{q}”.</h2>
      <p>Nothing in the index carries that term. Start from a capability or a market, or ask us directly.</p>
      <div className="hs-empty-g">
        <a href="#" className="hs-empty-c" onClick={e => e.preventDefault()}>
          <span className="hs-empty-l">Browse</span><b>Capabilities</b><small>Six groups, {window.HS.CAP_TREE.reduce((n, g) => n + g.children.length, 0)} processes</small><Icon name="arrow" size={18} /></a>
        <a href="#" className="hs-empty-c" onClick={e => e.preventDefault()}>
          <span className="hs-empty-l">Browse</span><b>Markets</b><small>Eight industries we build for</small><Icon name="arrow" size={18} /></a>
        <a href="#" className="hs-empty-c hs-empty-c--cta" onClick={e => e.preventDefault()}>
          <span className="hs-empty-l">Ask an engineer</span><b>Contact us</b><small>We answer process questions directly</small><Icon name="arrow" size={18} /></a>
      </div>
    </section>
  );
}

/* ── F · /search?q= ───────────────────────────────────────────── */
function ResultsPage({ q, setQ, strip, mobile, onClose }) {
  const [sec, setSec] = React.useState(null);
  const all = React.useMemo(() => window.HS.search(q), [q, window.HS.smart]);
  React.useEffect(() => { setSec(null); }, [q]);
  const groups = sec ? all.groups.filter(g => g.section === sec) : all.groups;
  const shown = groups.reduce((n, g) => n + g.items.length, 0);
  const has = q.trim().length > 0;

  return (
    <div className={"hs-page" + (mobile ? " hs-page--m" : "")}>
      {mobile
        ? <div className="hs-sheet-top">
            <SearchField value={q} onChange={setQ} placeholder="Search" size="sheet" autoFocus />
            <button className="hs-cancel" onClick={onClose}>Cancel</button>
          </div>
        : <div className="hs-searchhead">
            <div className="hs-eyebrow">Search</div>
            <SearchField value={q} onChange={setQ} placeholder="Search capabilities, markets, plants, certifications" autoFocus />
          </div>}

      {has && <div className="hs-countline">
        <b>{all.total}</b> {all.total === 1 ? "result" : "results"} for “{q.trim()}”
        {all.cert && <span className="hs-countline-x">· 1 direct answer</span>}
      </div>}

      {strip && has && <AnalysisStrip res={all} />}

      {has && all.groups.length > 1 && <div className="hs-filters">
        <button className={"hs-fchip" + (sec === null ? " on" : "")} onClick={() => setSec(null)}>All<span>{all.total}</span></button>
        {all.groups.map(g => (
          <button key={g.section} className={"hs-fchip" + (sec === g.section ? " on" : "")} onClick={() => setSec(g.section)}>
            {SEC_ABBR[g.section] || g.section}<span>{g.items.length}</span></button>
        ))}
      </div>}

      {has && all.cert && !sec && <CertCard cert={all.cert} mobile={mobile} />}

      {has && shown === 0 && !all.cert && <EmptyState q={q.trim()} />}
      {groups.map(g => <Group key={g.section} g={g} showWhy={strip} mobile={mobile} />)}

      {has && shown > 0 && <p className="hs-noindex">This page is no-indexed. Searches are logged so we can see what buyers look for and which pages are missing.</p>}
    </div>
  );
}

/* ── D · /capabilities/ scoped ─────────────────────────────────── */
function CapabilitiesHub({ q, setQ, strip, mobile }) {
  const tree = window.HS.CAP_TREE;
  const totalProc = tree.reduce((n, g) => n + g.children.length, 0);
  const res = React.useMemo(() => window.HS.search(q, { section: "Capabilities", noCert: true }), [q, window.HS.smart]);
  const hitUrls = new Set(res.groups.flatMap(g => g.items.map(r => r.p.u)));
  const hitWhy = {}; res.groups.forEach(g => g.items.forEach(r => { hitWhy[r.p.u] = r.hits; }));
  const has = q.trim().length > 0;

  const groups = tree.map(g => {
    const kids = g.children.filter(c => hitUrls.has(c.u));
    const parentHit = hitUrls.has(g.parent.u);
    return { ...g, kids, match: has ? (kids.length > 0 || parentHit) : true };
  });
  const live = groups.filter(g => g.match);
  const hiddenN = groups.length - live.length;
  const procN = has ? live.reduce((n, g) => n + g.kids.length, 0) : totalProc;

  return (
    <div className={"hs-page" + (mobile ? " hs-page--m" : "")}>
      <div className="hs-hero">
        <div className="hs-eyebrow">Capabilities</div>
        <h1 className="hana-h1 hs-h1">EMS and OSAT under one roof.</h1>
        <p className="hana-subhead">{tree.length} capability groups, {totalProc} processes, across Thailand, China and Cambodia.</p>
      </div>

      <div className="hs-scoped">
        <SearchField value={q} onChange={setQ} size="scoped" label="Find a process"
          placeholder="LGA · wire bond · 01005 · wettable flank · back grind" />
        <div className="hs-scoped-meta">
          {has
            ? <span><b>{live.length}</b>{` of ${tree.length} groups · `}<b>{procN}</b>{` ${procN === 1 ? "process" : "processes"} match`}
                {hiddenN > 0 && <span className="hs-dim">{` · ${hiddenN} groups hidden`}</span>}</span>
            : <span>{`Filters the ${totalProc} processes below. Type the shorthand — the index carries it.`}</span>}
          <a href="#" className="hs-scoped-out" onClick={e => e.preventDefault()}>
            <span>{has ? `Search the whole site for “${q.trim()}”` : "Search the whole site"}</span><Icon name="arrow" size={15} /></a>
        </div>
      </div>

      {strip && has && <AnalysisStrip res={res} />}

      <div className="hs-capgrid">
        {live.map(g => (
          <section key={g.parent.u} className={"hs-cap" + (has ? " on" : "")}>
            <a href="#" className="hs-cap-h" onClick={e => e.preventDefault()}>
              <h2>{g.parent.n}</h2>
              <span className="hs-cap-n">{has ? `${g.kids.length} of ${g.children.length}` : g.children.length}</span>
            </a>
            <div className="hs-cap-l">
              {(has ? g.kids : g.children).map(c => (
                <a key={c.u} href="#" className={"hs-cap-i" + (hitUrls.has(c.u) && has ? " hit" : "")} onClick={e => e.preventDefault()}>
                  <span className="hs-cap-t">{c.n}{c.miss && <span className="hs-chip warm">Not yet written</span>}</span>
                  {has && hitWhy[c.u] && <span className="hs-cap-w">{hitWhy[c.u].map(h => `“${h[0]}” in ${h[1]}`).join(" · ")}</span>}
                </a>
              ))}
              {has && g.kids.length === 0 && <div className="hs-cap-none">Group matches, no single process does</div>}
            </div>
          </section>
        ))}
      </div>
      {has && live.length === 0 && <EmptyState q={q.trim()} />}
    </div>
  );
}

/* ── E · /locations/ certification lookup ──────────────────────── */
function LocationsHub({ q, setQ, strip, mobile }) {
  const { SITES, CERTS } = window.HS;
  const cert = React.useMemo(() => window.HS.findCert(q), [q]);
  const has = q.trim().length > 0;
  const siteKeys = Object.keys(SITES);
  const filtered = has ? CERTS.filter(c => (c.id + " " + c.full + " " + c.alias).toLowerCase().includes(q.trim().toLowerCase())) : CERTS;
  const rows = cert ? [] : (filtered.length ? filtered : CERTS);

  return (
    <div className={"hs-page" + (mobile ? " hs-page--m" : "")}>
      <div className="hs-hero">
        <div className="hs-eyebrow">Locations</div>
        <h1 className="hana-h1 hs-h1">Five plants. Three countries.</h1>
        <p className="hana-subhead">Dual-sourcing from multiple countries inside one company — Thailand, China and Cambodia, with RFID and optical in Ohio.</p>
      </div>

      <div className="hs-lookup">
        <SearchField value={q} onChange={setQ} size="scoped" label="Which of our plants holds…"
          placeholder="ISO 13485 · IATF 16949 · ISO 27001 · ITAR" />
        <div className="hs-sugg">
          {["ISO 9001", "ISO 13485", "IATF 16949", "ISO 27001", "ITAR"].map(s => (
            <button key={s} className={"hs-fchip" + (q === s ? " on" : "")} onClick={() => setQ(s)}>{s}</button>
          ))}
        </div>
      </div>

      {strip && has && <AnalysisStrip res={window.HS.search(q, { noCert: true })} />}

      {cert
        ? <>
            <CertCard cert={cert} mobile={mobile} />
            <button className="hs-more hs-more--back" onClick={() => setQ("")}>
              <Icon name="chevron" size={15} style={{ transform: "rotate(180deg)" }} />Back to the full matrix</button>
          </>
        : <section className="hs-matrix-wrap">
            <div className="hs-matrix-h">
              <h2 className="hana-h3">Certifications by site</h2>
              <p className="hana-caption">{has ? `${rows.length} of ${CERTS.length} standards match “${q.trim()}”. Select one for certificate numbers and dates.` : "Select a standard for certificate numbers, issuing bodies and dates."}</p>
            </div>
            {mobile
              ? <div className="hs-mxm">
                  {rows.map(c => {
                    const held = c.sites.filter(s => !s.unconfirmed).length;
                    return (
                      <button key={c.id} className="hs-mxm-c" onClick={() => setQ(c.id)}>
                        <span className="hs-mxm-h">
                          <b>{c.full}</b>
                          <small>{c.scope}</small>
                          <em>{held ? `${held} of ${siteKeys.length} sites` : "none confirmed"}</em>
                        </span>
                        <span className="hs-mxm-l">
                          {c.sites.map(s => (
                            <span key={s.s} className="hs-mxm-r">
                              <span className="hs-mxm-s"><b>{SITES[s.s].n}</b><small>{SITES[s.s].c}</small></span>
                              {s.unconfirmed
                                ? <span className="hs-chip warm">To confirm</span>
                                : <span className="hs-chip ok"><Icon name="check" size={13} sw={2.2} />Recorded</span>}
                            </span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              : <div className="hs-matrix" style={{ "--cols": siteKeys.length }}>
              <div className="hs-mx-hd">
                <span />
                {siteKeys.map(k => <span key={k} className="hs-mx-site"><b>{SITES[k].n}</b><small>{SITES[k].c}</small><em>{SITES[k].r}</em></span>)}
              </div>
              {rows.map(c => (
                <button key={c.id} className="hs-mx-row" onClick={() => setQ(c.id)}>
                  <span className="hs-mx-std"><b>{c.full}</b><small>{c.scope}</small></span>
                  {siteKeys.map(k => {
                    const h = c.sites.find(s => s.s === k);
                    return <span key={k} className={"hs-mx-c" + (h ? (h.unconfirmed ? " tbc" : " yes") : " no")}>
                      {h ? (h.unconfirmed ? "?" : <Icon name="check" size={16} sw={2.2} />) : <Icon name="dash" size={14} sw={2} />}
                    </span>;
                  })}
                </button>
              ))}
            </div>}
            <div className="hs-mx-key">
              {!mobile && <><span><span className="hs-mx-c yes"><Icon name="check" size={13} sw={2.2} /></span>Recorded</span>
              <span><span className="hs-mx-c tbc">?</span>To confirm — flagged as conflicting or undated</span>
              <span><span className="hs-mx-c no"><Icon name="dash" size={12} sw={2} /></span>Not held</span></>}
              <span className="hs-mx-src">Sourced from the current quality pages and the 2026 company deck. No plant has confirmed its own row.</span>
            </div>
          </section>}
    </div>
  );
}

Object.assign(window, { ResultRow, Group, EmptyState, ResultsPage, CapabilitiesHub, LocationsHub });
