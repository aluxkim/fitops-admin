import type {
  AiInsight,
  Appointment,
  ClassSession,
  Location,
  MarketingCampaign,
  Member,
  MerchItem,
  LocationStock,
  StaffMember,
} from "../types";

const cities = [
  "Austin",
  "Denver",
  "Seattle",
  "Miami",
  "Chicago",
  "Portland",
  "Phoenix",
  "Boston",
  "Nashville",
  "San Diego",
];

export const locations: Location[] = Array.from({ length: 20 }, (_, i) => ({
  id: `loc-${i + 1}`,
  name: `FitCore ${cities[i % cities.length]} ${i >= 10 ? "West" : "Central"}`,
  city: cities[i % cities.length],
  memberCount: 95 + ((i * 7) % 12),
}));

const firstNames = [
  "Jordan",
  "Riley",
  "Morgan",
  "Casey",
  "Avery",
  "Quinn",
  "Skyler",
  "Reese",
  "Drew",
  "Jamie",
];
const lastNames = [
  "Nguyen",
  "Patel",
  "Garcia",
  "Kim",
  "Silva",
  "Brown",
  "Lee",
  "Martinez",
  "Chen",
  "Walker",
];

function hashPick<T>(seed: string, arr: T[]): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return arr[Math.abs(h) % arr.length];
}

export const members: Member[] = Array.from({ length: 48 }, (_, i) => {
  const id = `m-${i + 1}`;
  const homeLocationId = locations[i % locations.length].id;
  const planType = hashPick(id, ["individual", "family"] as const);
  const cadence = hashPick(id + "c", ["monthly", "annual"] as const);
  const base = cadence === "annual" ? 899 : 79;
  const discount =
    i % 7 === 0 ? "Founding 15%" : i % 11 === 0 ? "Corporate 10%" : null;
  const discountMult = discount ? (discount.includes("15") ? 0.85 : 0.9) : 1;
  const currentCharge =
    planType === "family"
      ? Math.round(base * discountMult * 1.35 * 100) / 100
      : Math.round(base * discountMult * 100) / 100;
  const normalizedMrr =
    cadence === "annual"
      ? Math.round((currentCharge / 12) * 100) / 100
      : currentCharge;
  const renewal = new Date(2026, (i % 12) + 1, 10 + (i % 15));
  return {
    id,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `member${i + 1}@example.com`,
    homeLocationId,
    planType,
    cadence,
    currentCharge,
    normalizedMrr,
    discountLabel: discount,
    renewalDate: renewal.toISOString().slice(0, 10),
    familySeats: planType === "family" ? 3 + (i % 2) : undefined,
    attendance: {
      facilityCheckIns: 4 + (i % 12),
      classSessions: 2 + (i % 8),
      ptCompleted: i % 4,
    },
  };
});

export const classSessions: ClassSession[] = locations.slice(0, 8).flatMap(
  (loc, li) =>
    ["HIIT", "Yoga Flow", "Spin", "Strength"].map((name, ci) => ({
      id: `cls-${loc.id}-${ci}`,
      locationId: loc.id,
      name,
      start: new Date(
        2026,
        2,
        29 + li,
        9 + ci * 2,
        0,
      ).toISOString(),
      capacity: 24,
      enrolled: 18 + ((li + ci) % 6),
      attended: 16 + ((li + ci) % 7),
    })),
);

export const appointments: Appointment[] = members.slice(0, 24).map((m, i) => ({
  id: `apt-${i + 1}`,
  locationId: m.homeLocationId,
  memberName: m.name,
  trainerName: `Coach ${firstNames[(i + 3) % firstNames.length]}`,
  start: new Date(2026, 2, 30 + (i % 5), 10 + (i % 6), 0).toISOString(),
  status: hashPick(`apt-${i}`, [
    "scheduled",
    "completed",
    "no_show",
    "cancelled",
  ] as const),
}));

const roles = ["Trainer", "Front desk", "Manager"];

export const staff: StaffMember[] = locations.flatMap((loc, li) =>
  [0, 1, 2].map((j) => ({
    id: `st-${loc.id}-${j}`,
    locationId: loc.id,
    name: `${firstNames[(li + j) % firstNames.length]} ${lastNames[(li + j + 1) % lastNames.length]}`,
    role: roles[j],
    email: `staff-${loc.id}-${j}@fitcore.com`,
    certifications:
      j === 0 ? ["NASM CPT", "CPR"] : j === 1 ? ["CPR"] : ["Leadership"],
  })),
);

export const merchCatalog: MerchItem[] = [
  { id: "sku-1", sku: "FC-TANK-01", name: "Performance Tank", msrp: 32 },
  { id: "sku-2", sku: "FC-BTL-01", name: "Insulated Bottle 24oz", msrp: 28 },
  { id: "sku-3", sku: "FC-MAT-01", name: "Studio Mat", msrp: 45 },
  { id: "sku-4", sku: "FC-HOOD-01", name: "Zip Hoodie", msrp: 58 },
];

export const stockByLocation: LocationStock[] = locations.flatMap((loc) =>
  merchCatalog.map((item, ii) => ({
    locationId: loc.id,
    itemId: item.id,
    units: 20 + ((loc.memberCount + ii * 5) % 40),
    soldThisMonth: 3 + ((ii + loc.memberCount) % 18),
  })),
);

export const campaigns: MarketingCampaign[] = locations.slice(0, 12).map(
  (loc, i) => ({
    id: `cmp-${i + 1}`,
    locationId: loc.id,
    name: `Spring push — ${loc.city}`,
    instagramUrl: "https://instagram.com/fitcore",
    utm: {
      source: "instagram",
      medium: "social",
      campaign: `spring-hiit-${loc.city.toLowerCase()}`,
    },
    signupsAttributed: 4 + (i % 9),
  }),
);

export const aiInsights: AiInsight[] = [
  {
    id: "ai-1",
    locationId: "all",
    title: "Network: class fill rate softening",
    detail:
      "Average class attendance vs capacity is down 6% month-over-month across locations. Consider promoting Tuesday evening HIIT with UTM spring-hiit bundles.",
    severity: "warning",
  },
  {
    id: "ai-2",
    locationId: "loc-3",
    title: "Seattle: PT no-shows elevated",
    detail:
      "No-show rate for PT is 14% this week vs 8% network average. Send reminder SMS and tighten 24h cancellation policy messaging.",
    severity: "warning",
  },
  {
    id: "ai-3",
    locationId: "all",
    title: "Retail attach opportunity",
    detail:
      "Members who attend 6+ classes/month buy bottles 2.3× more often. Merchandise bottles near studio exits on high-traffic days.",
    severity: "success",
  },
];

export type OverviewPeriod = "7d" | "30d" | "90d" | "12m";

export const PERIOD_CONFIG: Record<
  OverviewPeriod,
  { label: string; days: number; activityMult: number }
> = {
  "7d": { label: "Last 7 days", days: 7, activityMult: 0.28 },
  "30d": { label: "Last 30 days", days: 30, activityMult: 1 },
  "90d": { label: "Last 90 days", days: 90, activityMult: 2.85 },
  "12m": { label: "Last 12 months", days: 365, activityMult: 11 },
};

export function getScopedMembers(locIds: string[] | null): Member[] {
  return members.filter(
    (m) => !locIds || locIds.includes(m.homeLocationId),
  );
}

export function expiringInNextDays(
  ms: Member[],
  daysAhead: number,
): number {
  const today = new Date("2026-03-29");
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + daysAhead);
  return ms.filter((m) => {
    const d = new Date(m.renewalDate);
    d.setHours(0, 0, 0, 0);
    return d >= today && d <= end;
  }).length;
}

export function aggregateStats(
  locIds: string[] | null,
): {
  mrr: number;
  checkIns: number;
  classAttended: number;
  ptCompleted: number;
  expiring30: number;
} {
  const today = new Date("2026-03-29");
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);
  const ms = members.filter(
    (m) => !locIds || locIds.includes(m.homeLocationId),
  );
  const mrr = ms.reduce((s, m) => s + m.normalizedMrr, 0);
  const checkIns = ms.reduce((s, m) => s + m.attendance.facilityCheckIns, 0);
  const classAttended = ms.reduce(
    (s, m) => s + m.attendance.classSessions,
    0,
  );
  const ptCompleted = ms.reduce(
    (s, m) => s + m.attendance.ptCompleted,
    0,
  );
  const expiring30 = ms.filter((m) => {
    const d = new Date(m.renewalDate);
    return d >= today && d <= in30;
  }).length;
  return { mrr, checkIns, classAttended, ptCompleted, expiring30 };
}
