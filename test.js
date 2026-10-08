const M = require('./engine.js');
const E = require('./expected.json');
let n = 0, fail = 0;
const eq = (a, b, tag) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.error('FAIL', tag, JSON.stringify(a), '!=', JSON.stringify(b)); }
};
for (const c of E.plan) { let r; try { r = M.plan(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'plan ' + c.in); }
for (const c of E.saltcheck) { let r; try { r = M.saltcheck(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'saltcheck ' + c.in); }
for (const c of E.timeline) { let r; try { r = M.timeline(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'timeline ' + c.in); }
// anchors
const a = M.plan(1000, 'shiro');
eq(a.cookedG, 2200, 'anchor cooked'); eq(a.kojiG, 1200, 'anchor koji'); eq(a.saltG, 170, 'anchor salt'); eq(a.yieldG, 3570, 'anchor yield');
eq(M.saltcheck(3570, 170).pct, 4.76, 'anchor pct');
eq(M.timeline('aka', 12).status, 'in the window - taste it now (labeled)', 'anchor window');
// monotonic: salt grams rise with dry weight for every style
for (const k of Object.keys(M.STYLES)) {
  n++; if (!(M.plan(2000, k).saltG > M.plan(1000, k).saltG)) { fail++; console.error('FAIL monotone', k); }
  n++; if (!(M.plan(1000, k).yieldG > M.plan(500, k).yieldG)) { fail++; console.error('FAIL monotone yield', k); }
}
// error cases
const errs = [
  () => M.plan(0, 'shiro'), () => M.plan(-5, 'aka'), () => M.plan(NaN, 'shiro'), () => M.plan(100, 'nope'),
  () => M.saltcheck(0, 10), () => M.saltcheck(100, 0), () => M.saltcheck(100, 150), () => M.saltcheck(-1, 5),
  () => M.timeline('shiro', -1), () => M.timeline('nope', 3),
];
const msgs = ['dry bean weight must be positive','dry bean weight must be positive','dry bean weight must be positive','unknown style',
  'batch weight must be positive','salt weight must be positive','salt cannot outweigh the batch','batch weight must be positive',
  'months must be zero or positive','unknown style'];
errs.forEach((f, i) => {
  n++;
  try { f(); fail++; console.error('FAIL no-throw', i); }
  catch (e) { if (e.message !== msgs[i]) { fail++; console.error('FAIL msg', i, e.message); } }
});
console.log(fail ? fail + ' FAILURES / ' + n : n + '/' + n + ' checks pass');
process.exit(fail ? 1 : 0);
