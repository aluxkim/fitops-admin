export type UserRole = "owner" | "manager";

export type BillingCadence = "monthly" | "annual";

export type PlanType = "individual" | "family";

export interface Location {
  id: string;
  name: string;
  city: string;
  memberCount: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  homeLocationId: string;
  planType: PlanType;
  cadence: BillingCadence;
  /** Current period charge in USD */
  currentCharge: number;
  /** Normalized monthly equivalent for dashboards */
  normalizedMrr: number;
  discountLabel: string | null;
  renewalDate: string;
  familySeats?: number;
  attendance: {
    facilityCheckIns: number;
    classSessions: number;
    ptCompleted: number;
  };
}

export interface ClassSession {
  id: string;
  locationId: string;
  name: string;
  start: string;
  capacity: number;
  enrolled: number;
  attended: number;
}

export interface Appointment {
  id: string;
  locationId: string;
  memberName: string;
  trainerName: string;
  start: string;
  status: "scheduled" | "completed" | "no_show" | "cancelled";
}

export interface StaffMember {
  id: string;
  locationId: string;
  name: string;
  role: string;
  email: string;
  certifications: string[];
}

export interface MerchItem {
  id: string;
  sku: string;
  name: string;
  msrp: number;
}

export interface LocationStock {
  locationId: string;
  itemId: string;
  units: number;
  soldThisMonth: number;
}

export interface MarketingCampaign {
  id: string;
  locationId: string;
  name: string;
  instagramUrl: string;
  utm: { source: string; medium: string; campaign: string };
  signupsAttributed: number;
}

export interface AiInsight {
  id: string;
  locationId: string | "all";
  title: string;
  detail: string;
  severity: "info" | "warning" | "success";
}
