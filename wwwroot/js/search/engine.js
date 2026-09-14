/* Ranking engine — the rules from 03-search-spec.md, unchanged. Upgraded 13 Aug 2026 to
   the hana-search-plus-package-finder pack: section weights, exact-phrase matching, the
   "what we specialize in" and hub "product examples" sources, and the parametric handoff
   to the package finder. Exposed as window.HS so every search surface shares it. */
(function(){
const D = window.HS_DATA;
const {PAGES, TERMS, SECONDARY, SPECIALISE, HUBPRODUCTS, SITES, CERTS, ALL, N, blob, DF, isNoise, TYPEW, SECTIONW, SYN, INTENT} = D;
const PACKAGES = window.HS_PACKAGES || [];

let smart = true;
const setSmart = v => { smart = v; };

/* English function words. An explicit list rather than a minimum length, so genuine
   two-letter terms — RF, IC — still search. */
const STOP = new Set(["on","of","in","to","at","is","it","we","do","an","or","by","be","as","if","so","up","no","the","and","for","with","from","can","you","your","are","our","does","what","which","who","how","any","all"]);

function analyse(raw){
  const words = (raw.toLowerCase().match(/[a-z0-9.]{2,}/g)||[]).filter(w=>!STOP.has(w));
  return words.map(w=>{
    const mapped = smart && SYN[w] ? SYN[w] : w;
    return {raw:w, w:mapped, noise: smart && isNoise(mapped), df:DF[mapped]||0, pc:Math.round(100*(DF[mapped]||0)/N), intent: smart?INTENT[mapped]:null};
  });
}

/* ── certification lookup ─────────────────────────────────────────────────────
   A cert card only appears on a confident match: the standard's number or its
   distinctive name. Soft words like "medical" only trigger it alongside a
   certification word, so "automotive" still returns the market page. */
const CERTWORD = /\b(cert|certs|certified|certificate|certification|certifications|accredited|accreditation|standard|standards|approval|approved|iso|iatf|qualified|compliance)\b/;
const strongTokens = c => c.id.toLowerCase().split(/[^a-z0-9.]+/).filter(t=>t.length>=3 && t!=="iso" && t!=="iec");

function findCert(raw){
  const q = raw.toLowerCase();
  const toks = q.match(/[a-z0-9.\/]{2,}/g)||[];
  if(!toks.length) return null;
  const hasCertWord = CERTWORD.test(q);
  const scored = CERTS.map(c=>{
    const strong = strongTokens(c).filter(s=>toks.includes(s)).length;
    const soft = hasCertWord ? c.alias.split(" ").filter(a=>a.length>3 && toks.includes(a)).length : 0;
    return {c, hit:strong*10 + soft};
  }).filter(x=>x.hit>0).sort((a,b)=>b.hit-a.hit);
  if(!scored.length) return null;
  if(scored.length>1 && scored[0].hit === scored[1].hit) return null;   // ambiguous — no card
  return scored[0].c;
}

/* ── parametric handoff ───────────────────────────────────────────────────────
   The one site-wide box recognises a package query and answers with rows, not pages.
   Fires only on a real dimension ("3x3", "0.6 x 1.0"), a known package family or an
   automotive grade, so ordinary text searches are untouched. */
const PKFAMS = [...new Set(PACKAGES.map(r=>(r.pkg||"").toLowerCase().split(/[\s-]/)[0]).filter(f=>f.length>2))];

function findPackages(raw){
  const q = (raw||"").toLowerCase();
  const d = q.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/);
  const grade = (q.match(/grade\s*([012])/)||[])[1];
  const fam = PKFAMS.find(f=>new RegExp("\\b"+f).test(q));
  /* Lead counts only for families whose digits ARE the lead count. SOT/SOD digits are body
     codes (SOT23 is a size, not 23 leads), so they stay out of this list. */
  const lm = q.match(/(?:qfn|dfn|lga|soic|msop)\s*-?(\d{1,3})\b/) || q.match(/\b(\d{1,3})\s*l\b/);
  if(!d && !fam && !grade) return null;                 // not a package query
  const leads = lm ? parseInt(lm[1]) : null;
  const rows = PACKAGES.filter(r=>{
    if(grade && r.grade !== "Grade "+grade) return false;
    if(fam && !(r.pkg||"").toLowerCase().includes(fam)) return false;
    if(leads && !r.leads.includes(leads)) return false;
    if(d){
      if(!r.x) return false;
      const a=parseFloat(d[1]), b=parseFloat(d[2]), tol=0.06;
      if(!((Math.abs(r.x-a)<tol&&Math.abs(r.y-b)<tol)||(Math.abs(r.x-b)<tol&&Math.abs(r.y-a)<tol))) return false;
    }
    return true;
  }).sort((m,n)=>(m.x?m.x*m.y:1e9)-(n.x?n.x*n.y:1e9));
  if(!rows.length) return null;
  return {rows, dims:d?[d[1],d[2]]:null, fam, leads, grade, raw};
}

/* Punctuation-insensitive normalisation, so "fiber-optic" and "fiber optic" are the same
   string. Used only for whole-phrase matching. */
const flatten = s => s.toLowerCase().replace(/[^a-z0-9. ]+/g," ").replace(/\s+/g," ").trim();

function score(p, toks, hint, raw){
  const b = smart ? blob(p) : (p.n+" "+(p.k||"")).toLowerCase();
  const name = p.n.toLowerCase(), kw = (p.k||"").toLowerCase();
  const terms = (p.x||TERMS[p.u]||"").toLowerCase();
  const sec2 = (SECONDARY[p.u]||"").toLowerCase();
  const spec = (SPECIALISE[p.u]||"").toLowerCase();
  const hub  = (HUBPRODUCTS[p.u]||"").toLowerCase();
  let s = 0, hits = [], sharpHits = 0;
  const sharpCount = toks.filter(t=>!(smart && t.noise)).length;
  toks.forEach(t=>{
    const w = t.w;
    if(smart && t.noise){ if(b.includes(w)) s += 4; return; }   // common word: almost ignored
    let got = 0;
    if(name === w){ got = 120; hits.push([t.raw,"page name"]); }
    else if(new RegExp("\\b"+w.replace(/\./g,"\\.")).test(name)){ got = 95; hits.push([t.raw,"page name"]); }
    else if(smart && terms.includes(w)){ got = 70; hits.push([t.raw,"search terms"]); }
    else if(smart && spec.includes(w)){ got = 50; hits.push([t.raw,"what we specialize in"]); }
    else if(smart && hub.includes(w)){ got = 50; hits.push([t.raw,"product examples"]); }
    else if(kw.includes(w)){ got = 45; hits.push([t.raw,"SEO keyword"]); }
    else if(smart && sec2.includes(w)){ got = 38; hits.push([t.raw,"secondary keyword"]); }
    else if(b.includes(w)){ got = 20; hits.push([t.raw,"page text"]); }
    if(got) sharpHits++;
    s += got;
  });
  /* Whole-phrase match beats scattered single words. Without it "on-metal" scores on the
     loose word "metal" and RF Assembly outranks the RFID pages that actually say it. */
  const nq = flatten(raw||"");
  const phrase = smart && nq.includes(" ") && flatten(b).includes(nq);
  if(phrase) hits.unshift([(raw||"").trim(),"exact phrase"]);
  /* Matching a WHOLE term in the SEARCH TERMS list beats matching inside a longer one —
     what keeps a page that absorbed another page's vocabulary ranking first for it. */
  const owns = smart && nq && terms.split(",").some(t=>flatten(t)===nq);
  if(owns) hits.unshift([(raw||"").trim(),"listed term"]);

  if(!s && !phrase && !owns) return null;
  if(smart && sharpCount && !sharpHits && !phrase && !owns) return null;
  if(smart){
    /* Type weight favours hubs and parents, which is right for a vague query and wrong on
       an exact phrase — there, specificity decides. */
    s *= phrase ? 1 : (TYPEW[p.t] ?? 1);
    s *= (SECTIONW[p.s] ?? 1);      // Capabilities lead — Rupert, Aug 2026
    if(p.p === "HIGH") s += 6;
    if(hint) s *= (p.s === hint ? 1.6 : 0.7);
    /* Phrase bonus lands after the multipliers, so a parent's type weight can't amplify it
       past its own child. Deeper URL = more specific = small edge. */
    if(phrase) s += 130 + 8 * (p.u.split("/").filter(Boolean).length);
    if(owns)   s += 70;
  }
  return {p, s, hits};
}

const SECTION_ORDER = ["Capabilities","Markets","Locations","About","Corporate","Insights","Investor Relations","Careers","Contact"];

function search(raw, opts){
  opts = opts || {};
  const toks = analyse(raw);
  const hint = smart ? (toks.find(t=>t.intent)||{}).intent || null : null;
  let pool = ALL.filter(p=>p.t!=="Template");
  if(opts.section) pool = pool.filter(p=>p.s===opts.section);
  const rows = pool.map(p=>score(p, toks, hint, raw)).filter(Boolean).sort((a,b)=>b.s-a.s);
  const bySection = {};
  rows.forEach(r=>{ (bySection[r.p.s] = bySection[r.p.s] || []).push(r); });
  const groups = SECTION_ORDER.filter(s=>bySection[s]).map(s=>({section:s, items:bySection[s]}));
  Object.keys(bySection).forEach(s=>{ if(!SECTION_ORDER.includes(s)) groups.push({section:s, items:bySection[s]}); });
  return {raw, toks, hint, groups, total:rows.length,
    cert: opts.noCert ? null : findCert(raw),
    pkg: opts.noPkg ? null : (smart ? findPackages(raw) : null)};
}

/* Capability tree for the scoped field on the capabilities hub. */
const capParents = PAGES.filter(p=>p.s==="Capabilities" && p.t==="Cap Parent");
const CAP_TREE = capParents.map(parent=>({
  parent,
  children: ALL.filter(p=>p.s==="Capabilities" && p.u!==parent.u && p.u.startsWith(parent.u))
}));

window.HS = {setSmart, get smart(){return smart}, analyse, findCert, findPackages, score, search,
  SITES, CERTS, CAP_TREE, N, SECTION_ORDER, PACKAGES,
  terms: p => (p.x||TERMS[p.u]||""), PAGES, ALL};
})();
