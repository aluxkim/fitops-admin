import { useMemo } from "react";
import { Box, Flex, PageHeader, Table, Text, BannerSlim } from "gestalt";
import { classSessions } from "../data/mock";
import type { ClassSession } from "../types";
import { useAppScope } from "../context/AppContext";
import {
  getScopedLocationIds,
  formatDateTime,
  locationName,
} from "../utils/scope";
import { Link } from "react-router-dom";

function fillRate(c: ClassSession) {
  return c.capacity > 0 ? c.attended / c.capacity : 0;
}

function generateClassSummary(scoped: ClassSession[]): string {
  if (!scoped.length) return "No classes in scope.";
  const totalCap = scoped.reduce((s, c) => s + c.capacity, 0);
  const totalAtt = scoped.reduce((s, c) => s + c.attended, 0);
  const totalEnr = scoped.reduce((s, c) => s + c.enrolled, 0);
  const avgFill = Math.round((totalAtt / totalCap) * 100);
  const noShows = totalEnr - totalAtt;

  const byName: Record<string, { att: number; cap: number }> = {};
  for (const c of scoped) {
    if (!byName[c.name]) byName[c.name] = { att: 0, cap: 0 };
    byName[c.name].att += c.attended;
    byName[c.name].cap += c.capacity;
  }
  const names = Object.keys(byName);
  const best = names.reduce((b, n) =>
    byName[n].att / byName[n].cap > byName[b].att / byName[b].cap ? n : b,
  );
  const worst = names.reduce((w, n) =>
    byName[n].att / byName[n].cap < byName[w].att / byName[w].cap ? n : w,
  );

  return (
    `${scoped.length} class sessions in scope across ${names.length} class types. ` +
    `Overall fill rate is ${avgFill}% (${totalAtt}/${totalCap} seats). ` +
    `${totalEnr} enrolled, ${noShows} no-show${noShows !== 1 ? "s" : ""}. ` +
    `Best performing class type: ${best} (${Math.round((byName[best].att / byName[best].cap) * 100)}% fill). ` +
    `Weakest: ${worst} (${Math.round((byName[worst].att / byName[worst].cap) * 100)}% fill) — consider adjusting time slots or running an Instagram push.`
  );
}

function MiniClassTable({
  title,
  items,
}: {
  title: string;
  items: ClassSession[];
}) {
  return (
    <Box padding={4} rounding={4} borderStyle="sm" flex="grow" minWidth={260}>
      <Text weight="bold">{title}</Text>
      <Box marginTop={3}>
        <Table accessibilityLabel={title} borderStyle="sm">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold" size="100">Class</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold" size="100">Location</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold" size="100">Fill</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell>
                  <Text size="200" weight="bold">{c.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="200">{locationName(c.locationId)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="200">
                    {Math.round(fillRate(c) * 100)}%
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}

export function ClassesPage() {
  const { scopeLocationId } = useAppScope();
  const locIds = getScopedLocationIds(scopeLocationId);

  const scoped = useMemo(
    () =>
      classSessions.filter(
        (c) => !locIds || locIds.includes(c.locationId),
      ),
    [locIds],
  );

  const sorted = useMemo(
    () => [...scoped].sort((a, b) => fillRate(b) - fillRate(a)),
    [scoped],
  );

  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();
  const summary = useMemo(() => generateClassSummary(scoped), [scoped]);

  return (
    <Box>
      <PageHeader
        title="Classes"
        subtext="Attendance from class rosters; compare to capacity."
        borderStyle="sm"
      />

      <Flex marginTop={4} gap={4} wrap>
        <MiniClassTable title="Top 5 highest fill rate" items={top5} />
        <MiniClassTable title="Top 5 lowest fill rate" items={bottom5} />
      </Flex>

      <Box marginTop={4}>
        <BannerSlim
          type="recommendation"
          iconAccessibilityLabel="AI class summary"
          message={summary}
        />
      </Box>

      <Box marginTop={4} overflow="scrollX">
        <Table accessibilityLabel="Classes" borderStyle="sm" maxHeight="70vh">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold">Class</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Location</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Start</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Capacity</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Enrolled</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Attended</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Fill</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {scoped.map((c) => {
              const fill = Math.round(fillRate(c) * 100);
              return (
                <Table.Row key={c.id}>
                  <Table.Cell>
                    <Text weight="bold">{c.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{locationName(c.locationId)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{formatDateTime(c.start)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{c.capacity}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{c.enrolled}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{c.attended}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{fill}%</Text>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Box>

      <Box marginTop={4}>
        <Text size="200" color="subtle">
          <Link to="/insights">View AI insights</Link>
        </Text>
      </Box>
    </Box>
  );
}
