/**
 * The funds Kosh invests in: only liquid and short-term debt funds. No equity.
 *
 * - NAV history: `funds.generated.json`, a snapshot of AMFI NAV data via api.mfapi.in
 *   (refresh with `node scripts/fetch-funds.mjs`).
 * - Rating (Groww, out of 5), fund size, minimum and exit load: as published on 9 Oct 2026.
 * All Direct Plan, Growth. Nothing here is invented; returns are computed from the NAVs.
 */
import snapshot from './funds.generated.json';

export type FundId =
  | 'absl-liquid'
  | 'axis-liquid'
  | 'edelweiss-liquid'
  | 'nippon-liquid'
  | 'tata-money-market'
  | 'tata-ultra-short'
  | 'icici-short-term'
  | 'axis-short-duration';

export type Fund = {
  id: FundId;
  name: string;
  fundHouse: string;
  group: 'liquid' | 'debt';
  /** Plain category */
  kind: string;
  /** Groww rating out of 5 */
  rating: number;
  /** One plain line on what it does with the money */
  what: string;
  fundSizeCr: number;
  minInvestment: number;
  exitLoad: string;
  benchmark: string;
  /** [ISO date, NAV], oldest first */
  history: [string, number][];
};

type Meta = Omit<Fund, 'history'>;

/** Every liquid fund in India has the same tiny, regulator-set exit load for the first 6 days */
const LIQUID_EXIT = 'None after 6 days. Under 0.01% before that.';

const meta: Meta[] = [
  {
    id: 'absl-liquid',
    name: 'Aditya Birla Sun Life Liquid Fund',
    fundHouse: 'Aditya Birla Sun Life Mutual Fund',
    group: 'liquid',
    kind: 'Liquid fund',
    rating: 5,
    what: 'Lends to banks and large companies for up to 91 days. Small, steady gains every day.',
    fundSizeCr: 61_167,
    minInvestment: 100,
    exitLoad: LIQUID_EXIT,
    benchmark: 'NIFTY Liquid Index A-I',
  },
  {
    id: 'axis-liquid',
    name: 'Axis Liquid Fund',
    fundHouse: 'Axis Mutual Fund',
    group: 'liquid',
    kind: 'Liquid fund',
    rating: 5,
    what: 'Lends to banks and large companies for up to 91 days. Small, steady gains every day.',
    fundSizeCr: 53_470,
    minInvestment: 100,
    exitLoad: LIQUID_EXIT,
    benchmark: 'NIFTY Liquid Index A-I',
  },
  {
    id: 'edelweiss-liquid',
    name: 'Edelweiss Liquid Fund',
    fundHouse: 'Edelweiss Mutual Fund',
    group: 'liquid',
    kind: 'Liquid fund',
    rating: 5,
    what: 'Lends to banks and large companies for up to 91 days. Small, steady gains every day.',
    fundSizeCr: 11_741,
    minInvestment: 1_000,
    exitLoad: LIQUID_EXIT,
    benchmark: 'CRISIL Liquid Debt A-I Index',
  },
  {
    id: 'nippon-liquid',
    name: 'Nippon India Liquid Fund',
    fundHouse: 'Nippon India Mutual Fund',
    group: 'liquid',
    kind: 'Liquid fund',
    rating: 4,
    what: 'Lends to banks and large companies for up to 91 days. Small, steady gains every day.',
    fundSizeCr: 43_125,
    minInvestment: 1_000,
    exitLoad: LIQUID_EXIT,
    benchmark: 'NIFTY Liquid Index A-I',
  },
  {
    id: 'tata-money-market',
    name: 'Tata Money Market Fund',
    fundHouse: 'Tata Mutual Fund',
    group: 'debt',
    kind: 'Money market fund',
    rating: 5,
    what: 'Lends to banks and companies for up to a year. A little more than a liquid fund.',
    fundSizeCr: 31_690,
    minInvestment: 5_000,
    exitLoad: 'None',
    benchmark: 'CRISIL Money Market A-I Index',
  },
  {
    id: 'tata-ultra-short',
    name: 'Tata Ultra Short Term Fund',
    fundHouse: 'Tata Mutual Fund',
    group: 'debt',
    kind: 'Ultra short duration fund',
    rating: 5,
    what: 'Lends for 3 to 6 months on average. Suits money parked for a few months.',
    fundSizeCr: 5_404,
    minInvestment: 5_000,
    exitLoad: 'None',
    benchmark: 'CRISIL Ultra Short Duration Debt A-I Index',
  },
  {
    id: 'icici-short-term',
    name: 'ICICI Prudential Short Term Fund',
    fundHouse: 'ICICI Prudential Mutual Fund',
    group: 'debt',
    kind: 'Short duration fund',
    rating: 5,
    what: 'Lends for 1 to 3 years on average. Suits money you can leave for a year.',
    fundSizeCr: 18_890,
    minInvestment: 500,
    exitLoad: 'None',
    benchmark: 'NIFTY Short Duration Debt Index A-II',
  },
  {
    id: 'axis-short-duration',
    name: 'Axis Short Duration Fund',
    fundHouse: 'Axis Mutual Fund',
    group: 'debt',
    kind: 'Short duration fund',
    rating: 5,
    what: 'Lends for 1 to 3 years on average. Suits money you can leave for a year.',
    fundSizeCr: 7_425,
    minInvestment: 100,
    exitLoad: 'None',
    benchmark: 'NIFTY Short Duration Debt Index A-II',
  },
];

const histories = new Map(snapshot.funds.map((f) => [f.id, f.history as [string, number][]]));

export const funds: Fund[] = meta.map((m) => ({ ...m, history: histories.get(m.id) ?? [] }));
export const fundById = Object.fromEntries(funds.map((f) => [f.id, f])) as Record<FundId, Fund>;

/** Date of the latest NAV in the snapshot, e.g. "2026-10-09" */
export const fundsAsOf: string = snapshot.asOf;
export const fundsSource: string = snapshot.source;
