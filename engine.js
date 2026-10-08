/* Miso math - exact arithmetic on labeled published norms.
   Salt keeps miso safe; these percentages are labeled norms, not a safety verdict. */
const STYLES = {
  shiro:   { saltPct: 0.05, kojiRatio: 1.2, monthsLo: 1, monthsHi: 3,  note: 'sweet white - the impatient miso' },
  shinshu: { saltPct: 0.08, kojiRatio: 1.0, monthsLo: 4, monthsHi: 8,  note: 'mellow yellow - the everyday' },
  aka:     { saltPct: 0.12, kojiRatio: 0.8, monthsLo: 9, monthsHi: 18, note: 'red - the long game' },
};
const ABSORB = 2.2; // cooked+soaked weight per dry bean weight (labeled norm)
const r1 = x => Math.round(x * 10) / 10;
const r2 = x => Math.round(x * 100) / 100;
const bad = m => { throw new Error(m); };

function plan(dryG, styleKey) {
  const s = STYLES[styleKey];
  if (!s) bad('unknown style');
  if (!Number.isFinite(dryG) || dryG <= 0) bad('dry bean weight must be positive');
  const cookedG = dryG * ABSORB;
  const kojiG = dryG * s.kojiRatio;
  const baseG = cookedG + kojiG;
  const saltG = s.saltPct * baseG;
  const yieldG = baseG + saltG;
  let verdict;
  if (s.monthsHi <= 3) verdict = 'young and sweet - taste it monthly from month 1 (labeled)';
  else if (s.monthsHi <= 8) verdict = 'patience - first taste around month 4 (labeled)';
  else verdict = 'a long ferment - write the pack date on the lid (labeled)';
  return {
    cookedG: r1(cookedG), kojiG: r1(kojiG), saltG: r1(saltG), yieldG: r1(yieldG),
    monthsLo: s.monthsLo, monthsHi: s.monthsHi, saltPct: r2(s.saltPct * 100),
    verdict, note: s.note,
  };
}

function saltcheck(totalG, saltG) {
  if (!Number.isFinite(totalG) || totalG <= 0) bad('batch weight must be positive');
  if (!Number.isFinite(saltG) || saltG <= 0) bad('salt weight must be positive');
  if (saltG >= totalG) bad('salt cannot outweigh the batch');
  const pct = (saltG / totalG) * 100;
  let band;
  if (pct < 5) band = 'below published norms for aged miso - treat as a fresh, refrigerated, eat-soon batch (labeled)';
  else if (pct < 8) band = 'sweet-style range - short ferment, watch it (labeled)';
  else if (pct <= 13) band = 'inside the published norm range for aged miso (labeled)';
  else band = 'saltier than published norms - slow ferment, salty result (labeled)';
  return { pct: r2(pct), band };
}

function timeline(styleKey, monthsSoFar) {
  const s = STYLES[styleKey];
  if (!s) bad('unknown style');
  if (!Number.isFinite(monthsSoFar) || monthsSoFar < 0) bad('months must be zero or positive');
  let status;
  if (monthsSoFar < s.monthsLo) status = 'wait ' + r1(s.monthsLo - monthsSoFar) + ' more months before the first taste (labeled)';
  else if (monthsSoFar <= s.monthsHi) status = 'in the window - taste it now (labeled)';
  else status = 'past the classic window - older miso keeps and deepens (labeled)';
  return { monthsLo: s.monthsLo, monthsHi: s.monthsHi, status, note: s.note };
}

const api = { STYLES, ABSORB, plan, saltcheck, timeline };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.Misomath = api;
