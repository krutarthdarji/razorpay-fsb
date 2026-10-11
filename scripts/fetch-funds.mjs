/**
 * Snapshot real NAV history for the funds Kosh shows.
 * Source: api.mfapi.in, a public mirror of AMFI's daily NAV data.
 * Run: node scripts/fetch-funds.mjs   (writes src/data/funds.generated.json)
 * Scheme codes are from AMFI's master list (amfiindia.com/spages/NAVAll.txt).
 *
 * The app is frontend-only, so it reads this snapshot, not the live API.
 */
import { writeFileSync } from 'node:fs';

/** AMFI scheme codes. All Direct Plan, Growth. */
const schemes = [
  // Liquid funds
  { id: 'absl-liquid', code: 119568 },
  { id: 'axis-liquid', code: 120389 },
  { id: 'edelweiss-liquid', code: 140196 },
  { id: 'nippon-liquid', code: 118701 },
  // Short-term debt funds (no exit load)
  { id: 'tata-money-market', code: 119424 },
  { id: 'tata-ultra-short', code: 146075 },
  { id: 'icici-short-term', code: 120754 },
  { id: 'axis-short-duration', code: 120510 },
];

const YEARS = 5;
const DAILY_DAYS = 190; // daily points for the recent past, weekly before that

const toIso = (ddmmyyyy) => ddmmyyyy.split('-').reverse().join('-');
const daysAgo = (iso, latest) => (new Date(latest) - new Date(iso)) / 86_400_000;

const funds = [];
for (const { id, code } of schemes) {
  const res = await fetch(`https://api.mfapi.in/mf/${code}`);
  if (!res.ok) throw new Error(`${code}: HTTP ${res.status}`);
  const { meta, data } = await res.json();
  // API returns newest first
  const all = data.map((d) => [toIso(d.date), Number(d.nav)]).filter(([, nav]) => nav > 0).reverse();
  const latest = all[all.length - 1][0];
  const history = all.filter(([date], i) => {
    const age = daysAgo(date, latest);
    if (age > YEARS * 365.25 + 7) return false;
    return age <= DAILY_DAYS || i % 5 === 0 || i === all.length - 1;
  });
  funds.push({ id, schemeCode: meta.scheme_code, schemeName: meta.scheme_name, fundHouse: meta.fund_house, amfiCategory: meta.scheme_category, history });
  console.log(id, meta.scheme_name, '|', meta.scheme_category, '|', history.length, 'points', history[0][0], '→', latest);
}

const asOf = funds.map((f) => f.history[f.history.length - 1][0]).sort()[0];
writeFileSync(new URL('../src/data/funds.generated.json', import.meta.url), JSON.stringify({ source: 'api.mfapi.in (AMFI NAV data)', asOf, funds }));
console.log('as of', asOf);
