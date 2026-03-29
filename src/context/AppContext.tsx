import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserRole } from "../types";
import { locations } from "../data/mock";

const MANAGER_LOCATION_IDS = ["loc-1", "loc-3", "loc-5"];

type AppContextValue = {
  role: UserRole;
  setRole: (r: UserRole) => void;
  /** Owner: 'all' or a location. Manager: always a specific assigned location. */
  scopeLocationId: string;
  setScopeLocationId: (id: string) => void;
  allowedLocationIds: string[];
  isOwner: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("owner");
  const [scopeLocationId, setScopeLocationId] = useState<string>("all");

  const allowedLocationIds = useMemo(
    () =>
      role === "owner"
        ? locations.map((l) => l.id)
        : MANAGER_LOCATION_IDS,
    [role],
  );

  const enforceManagerScope = useCallback(
    (r: UserRole) => {
      if (r === "manager") {
        setScopeLocationId((prev) =>
          prev === "all" || !MANAGER_LOCATION_IDS.includes(prev)
            ? MANAGER_LOCATION_IDS[0]
            : prev,
        );
      } else {
        setScopeLocationId("all");
      }
    },
    [],
  );

  const handleSetRole = useCallback(
    (r: UserRole) => {
      enforceManagerScope(r);
      setRole(r);
    },
    [enforceManagerScope],
  );

  const handleSetScope = useCallback(
    (id: string) => {
      if (role === "manager" && !MANAGER_LOCATION_IDS.includes(id)) return;
      setScopeLocationId(id);
    },
    [role],
  );

  const value = useMemo(
    () => ({
      role,
      setRole: handleSetRole,
      scopeLocationId,
      setScopeLocationId: handleSetScope,
      allowedLocationIds,
      isOwner: role === "owner",
    }),
    [
      role,
      handleSetRole,
      scopeLocationId,
      handleSetScope,
      allowedLocationIds,
    ],
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useAppScope() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppScope must be used within AppProvider");
  return ctx;
}
