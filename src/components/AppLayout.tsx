import { Box, Flex, Text, Button, Divider } from "gestalt";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppScope } from "../context/AppContext";
import { locations } from "../data/mock";

const nav: { to: string; label: string }[] = [
  { to: "/", label: "Overview" },
  { to: "/members", label: "Members" },
  { to: "/classes", label: "Classes" },
  { to: "/appointments", label: "Appointments" },
  { to: "/staff", label: "Staff" },
  { to: "/commerce", label: "Commerce" },
  { to: "/marketing", label: "Marketing" },
  { to: "/insights", label: "Insights" },
];

function NavLink({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link to={to} style={{ textDecoration: "none", display: "block" }}>
      <Box
        padding={2}
        rounding={2}
        color={active ? "selected" : "transparent"}
      >
        <Text weight="bold" color={active ? "default" : "subtle"}>
          {label}
        </Text>
      </Box>
    </Link>
  );
}

function locationLabel(id: string) {
  return locations.find((l) => l.id === id)?.name ?? id;
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const {
    role,
    setRole,
    scopeLocationId,
    setScopeLocationId,
    isOwner,
    allowedLocationIds,
  } = useAppScope();

  return (
    <Flex width="100%" minHeight="100vh">
      <Box
        as="aside"
        width={260}
        padding={4}
        color="secondary"
        borderStyle="sm"
        rounding={4}
        margin={2}
      >
        <Box marginBottom={4}>
          <Text size="400" weight="bold">
            FitOps
          </Text>
          <Text size="100" color="subtle">
            Membership admin
          </Text>
        </Box>
        <Flex direction="column" gap={{ column: 0, row: 1 }}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              label={item.label}
              active={
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to)
              }
            />
          ))}
        </Flex>
        <Box marginTop={6} paddingY={2}>
          <Divider />
        </Box>
        <Box marginTop={4}>
          <Text size="100" weight="bold" color="subtle">
            Prototype
          </Text>
          <Box marginTop={2} maxWidth={220}>
            <Flex gap={{ column: 2, row: 2 }} wrap>
              <Button
                size="sm"
                color={role === "owner" ? "red" : "gray"}
                text="Owner"
                onClick={() => setRole("owner")}
              />
              <Button
                size="sm"
                color={role === "manager" ? "red" : "gray"}
                text="Manager"
                onClick={() => setRole("manager")}
              />
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box flex="grow" padding={6} minWidth={0}>
        <Flex
          justifyContent="end"
          alignItems="center"
          gap={{ column: 3, row: 2 }}
          wrap
        >
          <Text size="200" color="subtle">
            Location scope
          </Text>
          <select
            aria-label="Location scope"
            value={scopeLocationId}
            onChange={(e) => setScopeLocationId(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
              minWidth: 220,
              background: "#fff",
            }}
          >
            {isOwner && <option value="all">All locations</option>}
            {(isOwner ? locations.map((l) => l.id) : allowedLocationIds).map(
              (id) => (
                <option key={id} value={id}>
                  {locationLabel(id)}
                </option>
              ),
            )}
          </select>
        </Flex>
        <Box marginTop={4}>{children}</Box>
      </Box>
    </Flex>
  );
}
