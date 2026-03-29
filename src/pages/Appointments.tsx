import { useMemo } from "react";
import {
  Box,
  Flex,
  PageHeader,
  Table,
  Text,
  Button,
  Badge,
  BannerSlim,
} from "gestalt";
import { Link } from "react-router-dom";
import { appointments } from "../data/mock";
import type { Appointment } from "../types";
import { useAppScope } from "../context/AppContext";
import {
  getScopedLocationIds,
  formatDateTime,
  locationName,
} from "../utils/scope";

function statusBadge(s: Appointment["status"]) {
  switch (s) {
    case "completed":
      return <Badge text="Completed" type="success" />;
    case "scheduled":
      return <Badge text="Scheduled" type="info" />;
    case "no_show":
      return <Badge text="No-show" type="warning" />;
    case "cancelled":
      return <Badge text="Cancelled" type="neutral" />;
    default:
      return null;
  }
}

type TrainerStats = {
  name: string;
  total: number;
  completed: number;
  noShow: number;
};

function buildTrainerStats(scoped: Appointment[]): TrainerStats[] {
  const map: Record<string, TrainerStats> = {};
  for (const a of scoped) {
    if (!map[a.trainerName])
      map[a.trainerName] = { name: a.trainerName, total: 0, completed: 0, noShow: 0 };
    map[a.trainerName].total++;
    if (a.status === "completed") map[a.trainerName].completed++;
    if (a.status === "no_show") map[a.trainerName].noShow++;
  }
  return Object.values(map);
}

function generateApptSummary(scoped: Appointment[]): string {
  if (!scoped.length) return "No appointments in scope.";
  const total = scoped.length;
  const completed = scoped.filter((a) => a.status === "completed").length;
  const noShow = scoped.filter((a) => a.status === "no_show").length;
  const cancelled = scoped.filter((a) => a.status === "cancelled").length;
  const scheduled = scoped.filter((a) => a.status === "scheduled").length;
  const completionRate = Math.round((completed / total) * 100);
  const noShowRate = Math.round((noShow / total) * 100);

  const stats = buildTrainerStats(scoped);
  const topTrainer = stats.length
    ? stats.reduce((best, t) =>
        t.completed / t.total > best.completed / best.total ? t : best,
      )
    : null;

  return (
    `${total} PT appointments in scope. ` +
    `${completed} completed (${completionRate}%), ` +
    `${noShow} no-show${noShow !== 1 ? "s" : ""} (${noShowRate}%), ` +
    `${cancelled} cancelled, ${scheduled} upcoming. ` +
    (noShowRate > 10
      ? "No-show rate exceeds 10% — consider tightening cancellation policies and sending reminder texts 24 hours before sessions. "
      : "No-show rate is healthy. ") +
    `${stats.length} trainers are handling sessions. ` +
    (topTrainer
      ? `Top trainer by completion: ${topTrainer.name} (${Math.round((topTrainer.completed / topTrainer.total) * 100)}%).`
      : "")
  );
}

function TrainerMiniTable({
  title,
  stats,
  mode,
}: {
  title: string;
  stats: TrainerStats[];
  mode: "completion" | "noshow";
}) {
  return (
    <Box padding={4} rounding={4} borderStyle="sm" flex="grow" minWidth={260}>
      <Text weight="bold">{title}</Text>
      <Box marginTop={3}>
        <Table accessibilityLabel={title} borderStyle="sm">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold" size="100">Trainer</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold" size="100">
                  {mode === "completion" ? "Sessions" : "No-shows"}
                </Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold" size="100">Rate</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {stats.map((t) => (
              <Table.Row key={t.name}>
                <Table.Cell>
                  <Text size="200" weight="bold">{t.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="200">
                    {mode === "completion"
                      ? t.total
                      : `${t.noShow}/${t.total}`}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="200">
                    {mode === "completion"
                      ? `${Math.round((t.completed / t.total) * 100)}%`
                      : `${t.noShow > 0 ? Math.round((t.noShow / t.total) * 100) : 0}%`}
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

export function AppointmentsPage() {
  const { scopeLocationId } = useAppScope();
  const locIds = getScopedLocationIds(scopeLocationId);

  const scoped = useMemo(
    () =>
      appointments.filter(
        (a) => !locIds || locIds.includes(a.locationId),
      ),
    [locIds],
  );

  const trainerStats = useMemo(() => buildTrainerStats(scoped), [scoped]);
  const topCompletion = useMemo(
    () =>
      [...trainerStats]
        .sort((a, b) => b.completed / b.total - a.completed / a.total)
        .slice(0, 5),
    [trainerStats],
  );
  const worstNoShow = useMemo(
    () =>
      [...trainerStats]
        .sort((a, b) => b.noShow / b.total - a.noShow / a.total)
        .slice(0, 5),
    [trainerStats],
  );

  const summary = useMemo(() => generateApptSummary(scoped), [scoped]);

  return (
    <Box>
      <PageHeader
        title="Appointments"
        subtext="Personal training sessions; completion drives PT attendance metrics."
        borderStyle="sm"
      />

      <Flex marginTop={4} gap={4} wrap>
        <TrainerMiniTable
          title="Top trainers (completion rate)"
          stats={topCompletion}
          mode="completion"
        />
        <TrainerMiniTable
          title="Highest no-show rate"
          stats={worstNoShow}
          mode="noshow"
        />
      </Flex>

      <Box marginTop={4}>
        <BannerSlim
          type="recommendation"
          iconAccessibilityLabel="AI appointment summary"
          message={summary}
        />
      </Box>

      <Box marginTop={4}>
        <Button
          color="red"
          text="New appointment"
          onClick={() => undefined}
        />
      </Box>
      <Box marginTop={4} overflow="scrollX">
        <Table
          accessibilityLabel="Appointments"
          borderStyle="sm"
          maxHeight="70vh"
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold">When</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Location</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Member</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Trainer</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Status</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Actions</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {scoped.map((a) => (
              <Table.Row key={a.id}>
                <Table.Cell>
                  <Text>{formatDateTime(a.start)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{locationName(a.locationId)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text weight="bold">{a.memberName}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{a.trainerName}</Text>
                </Table.Cell>
                <Table.Cell>{statusBadge(a.status)}</Table.Cell>
                <Table.Cell>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      text="Edit"
                      onClick={() => undefined}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
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
