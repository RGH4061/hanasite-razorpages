/* Ranking engine — the rules from 03-search-spec.md, unchanged.
   Exposed as window.HS so the placement concepts all share one implementation. */
(function(){
const D = window.HS_DATA;
const {PAGES, TERMS, SECONDARY, SITES, CERTS, ALL, N, blob, DF, isNoise, TYPEW, SYN, INTENT} = D;

let smart = true;
const setSmart = v => { smart = v; };

const STOP = new Set(["on","of","in","to","at","is","it","we","do","an","or","by","be","as","if","so","up","no","the","and","for","with","from","can","you","your","are","our","does","what","which","who","how","any","all"]);

function analyse(raw){
  const words = (raw.toLowerCase().match(/[a-z0-9.]{2,}/g)||[]).filter(w=>!STOP.has(w));
  return words.map(w=>{
    const mapped = smart && SYN[w] ? SYN[w] : w;
    return {raw:w, w:mapped, noise: smart && isNoise(mapped), df:DF[mapped]||0, pc:Math.round(100*(DF[mapped]||0)/N), intent: smart?INTENT[mapped]:null};
  });
}

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
  if(scored.length>1 && scored[0].hit === scored[1].hit) return null;
  return scored[0].c;
}

function score(p, toks, hint){
  const b = smart ? blob(p) : (p.n+" "+(p.k||"")).toLowerCase();
  const name = p.n.toLowerCase(), kw = (p.k||"").toLowerCase();
  const terms = (p.x||TERMS[p.u]||"").toLowerCase();
  const sec2 = (SECONDARY[p.u]||"").toLowerCase();
  let s = 0, hits = [], sharpHits = 0;
  const sharpCount = toks.filter(t=>!(smart && t.noise)).length;
  toks.forEach(t=>{
    const w = t.w;
    if(smart && t.noise){ if(b.includes(w)) s += 4; return; }
    let got = 0;
    if(name === w){ got = 120; hits.push([t.raw,"page name"]); }
    else if(new RegExp("\\b"+w.replace(/\./g,"\\.")).test(name)){ got = 95; hits.push([t.raw,"page name"]); }
    else if(smart && terms.includes(w)){ got = 70; hits.push([t.raw,"search terms"]); }
    else if(kw.includes(w)){ got = 45; hits.push([t.raw,"SEO keyword"]); }
    else if(smart && sec2.includes(w)){ got = 38; hits.push([t.raw,"secondary keyword"]); }
    else if(b.includes(w)){ got = 20; hits.push([t.raw,"page text"]); }
    if(got) sharpHits++;
    s += got;
  });
  if(!s) return null;
  if(smart && sharpCount && !sharpHits) return null;
  if(smart){
    s *= (TYPEW[p.t] ?? 1);
    if(p.p === "HIGH") s += 6;
    if(hint) s *= (p.s === hint ? 1.6 : 0.7);
  }
  return {p, s, hits};
}

const SECTION_ORDER = ["Capabilities","Markets","Locations","About","Corporate","Investor Relations","Careers","Contact"];

function search(raw, opts){
  opts = opts || {};
  const toks = analyse(raw);
  const hint = smart ? (toks.find(t=>t.intent)||{}).intent || null : null;
  let pool = ALL.filter(p=>p.t!=="Template");
  if(opts.section) pool = pool.filter(p=>p.s===opts.section);
  const rows = pool.map(p=>score(p, toks, hint)).filter(Boolean).sort((a,b)=>b.s-a.s);
  const bySection = {};
  rows.forEach(r=>{ (bySection[r.p.s] = bySection[r.p.s] || []).push(r); });
  const groups = SECTION_ORDER.filter(s=>bySection[s]).map(s=>({section:s, items:bySection[s]}));
  Object.keys(bySection).forEach(s=>{ if(!SECTION_ORDER.includes(s)) groups.push({section:s, items:bySection[s]}); });
  return {raw, toks, hint, groups, total:rows.length, cert: opts.noCert ? null : findCert(raw)};
}

/* Capability tree for placement D — parents with their sub-pillars, from the index. */
const capParents = PAGES.filter(p=>p.s==="Capabilities" && p.t==="Cap Parent");
const CAP_TREE = capParents.map(parent=>({
  parent,
  children: ALL.filter(p=>p.s==="Capabilities" && p.u!==parent.u && p.u.startsWith(parent.u))
}));

window.HS = {setSmart, get smart(){return smart}, analyse, findCert, score, search, SITES, CERTS, CAP_TREE, N, SECTION_ORDER,
  terms: p => (p.x||TERMS[p.u]||""), PAGES, ALL};
})();
