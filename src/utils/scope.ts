import { locations } from "../data/mock";

/** `null` means all locations (owner “all” scope). */
export function getScopedLocationIds(
  scopeLocationId: string,
): string[] | null {
  if (scopeLocationId === "all") return null;
  return [scopeLocationId];
}

export function locationName(id: string) {
  return locations.find((l) => l.id === id)?.name ?? id;
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
