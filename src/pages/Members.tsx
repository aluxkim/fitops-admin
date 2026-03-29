import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  PageHeader,
  Table,
  Text,
  SearchField,
  Button,
  Badge,
  BannerSlim,
} from "gestalt";
import { Link } from "react-router-dom";
import { members } from "../data/mock";
import type { Member } from "../types";
import { useAppScope } from "../context/AppContext";
import {
  getScopedLocationIds,
  formatMoney,
  formatDate,
  locationName,
} from "../utils/scope";

function totalActivity(m: Member) {
  return (
    m.attendance.facilityCheckIns +
    m.attendance.classSessions +
    m.attendance.ptCompleted
  );
}

function generateSummary(scoped: Member[]): string {
  if (!scoped.length) return "No members in scope.";
  const total = scoped.length;
  const avgActivity = Math.round(
    scoped.reduce((s, m) => s + totalActivity(m), 0) / total,
  );
  const familyCount = scoped.filter((m) => m.planType === "family").length;
  const annualCount = scoped.filter((m) => m.cadence === "annual").length;
  const discounted = scoped.filter((m) => m.discountLabel).length;
  const today = new Date("2026-03-29");
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);
  const expiring = scoped.filter((m) => {
    const d = new Date(m.renewalDate);
    return d >= today && d <= in30;
  }).length;
  const sorted = [...scoped].sort(
    (a, b) => totalActivity(b) - totalActivity(a),
  );
  const topName = sorted[0].name;
  const bottomName = sorted[sorted.length - 1].name;
  const avgMrr = Math.round(
    scoped.reduce((s, m) => s + m.normalizedMrr, 0) / total,
  );

  return (
    `You have ${total} members in scope averaging ${avgActivity} total visits (desk + class + PT). ` +
    `${familyCount} are on family plans and ${annualCount} pay annually. ` +
    `${discounted} member${discounted !== 1 ? "s have" : " has"} an active discount. ` +
    `${expiring} membership${expiring !== 1 ? "s expire" : " expires"} in the next 30 days — consider a proactive renewal campaign. ` +
    `Your most active member is ${topName} and your least active is ${bottomName}. ` +
    `Average normalized MRR per member is ${formatMoney(avgMrr)}.`
  );
}

function MiniTable({
  title,
  items,
}: {
  title: string;
  items: Member[];
}) {
  return (
    <Box padding={4} rounding={4} borderStyle="sm" flex="grow" minWidth={260}>
      <Text weight="bold">{title}</Text>
      <Box marginTop={3}>
        <Table accessibilityLabel={title} borderStyle="sm">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold" size="100">
                  Member
                </Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold" size="100">
                  Location
                </Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold" size="100">
                  Activity
                </Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((m) => (
              <Table.Row key={m.id}>
                <Table.Cell>
                  <Link
                    to={`/members/${m.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Text weight="bold" color="link" size="200">
                      {m.name}
                    </Text>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Text size="200">
                    {locationName(m.homeLocationId)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="200">{totalActivity(m)} visits</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}

export function MembersPage() {
  const { scopeLocationId } = useAppScope();
  const locIds = getScopedLocationIds(scopeLocationId);
  const [q, setQ] = useState("");

  const scoped = useMemo(
    () =>
      members.filter(
        (m) => !locIds || locIds.includes(m.homeLocationId),
      ),
    [locIds],
  );

  const sorted = useMemo(
    () =>
      [...scoped].sort(
        (a, b) => totalActivity(b) - totalActivity(a),
      ),
    [scoped],
  );

  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();
  const summary = useMemo(() => generateSummary(scoped), [scoped]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return scoped;
    return scoped.filter(
      (m) =>
        m.name.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s),
    );
  }, [scoped, q]);

  return (
    <Box>
      <PageHeader
        title="Members"
        subtext="Plans include individual and family; monthly and annual cadences; discounts and proration on profile billing."
        borderStyle="sm"
      />

      <Flex marginTop={4} gap={4} wrap>
        <MiniTable title="Top 5 most active" items={top5} />
        <MiniTable title="Top 5 least active" items={bottom5} />
      </Flex>

      <Box marginTop={4}>
        <BannerSlim
          type="recommendation"
          iconAccessibilityLabel="AI summary"
          message={summary}
        />
      </Box>

      <Box marginTop={4}>
        <Button color="red" text="Add member" onClick={() => undefined} />
      </Box>
      <Box marginTop={4} maxWidth={400}>
        <SearchField
          accessibilityLabel="Search members"
          accessibilityClearButtonLabel="Clear search"
          id="member-search"
          label="Search"
          placeholder="Name or email"
          value={q}
          onChange={({ value }) => setQ(value)}
        />
      </Box>
      <Box marginTop={4} overflow="scrollX">
        <Table
          accessibilityLabel="Members table"
          borderStyle="sm"
          maxHeight="70vh"
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold">Member</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Location</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Plan</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Charge</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Norm. MRR</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Renewal</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Discount</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((m) => (
              <Table.Row key={m.id}>
                <Table.Cell>
                  <Link
                    to={`/members/${m.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Text weight="bold" color="link">
                      {m.name}
                    </Text>
                  </Link>
                  <Text size="100" color="subtle">
                    {m.email}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{locationName(m.homeLocationId)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    text={`${m.planType} · ${m.cadence}`}
                    type="neutral"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatMoney(m.currentCharge)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatMoney(m.normalizedMrr)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatDate(m.renewalDate)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{m.discountLabel ?? "—"}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}
