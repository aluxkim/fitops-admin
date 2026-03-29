import { useState } from "react";
import {
  Box,
  Flex,
  PageHeader,
  Datapoint,
  Text,
  BannerSlim,
} from "gestalt";
import { Link } from "react-router-dom";
import {
  aggregateStats,
  PERIOD_CONFIG,
  getScopedMembers,
  expiringInNextDays,
  type OverviewPeriod,
} from "../data/mock";
import { useAppScope } from "../context/AppContext";
import { getScopedLocationIds, formatMoney } from "../utils/scope";
import { TrendBars } from "../components/TrendBars";

export function OverviewPage() {
  const { scopeLocationId } = useAppScope();
  const [period, setPeriod] = useState<OverviewPeriod>("30d");
  const locIds = getScopedLocationIds(scopeLocationId);
  const cfg = PERIOD_CONFIG[period];
  const s = aggregateStats(locIds);
  const ms = getScopedMembers(locIds);

  const checkIns = Math.max(0, Math.round(s.checkIns * cfg.activityMult));
  const classAttended = Math.max(
    0,
    Math.round(s.classAttended * cfg.activityMult),
  );
  const ptCompleted = Math.max(
    0,
    Math.round(s.ptCompleted * cfg.activityMult),
  );
  const renewals = expiringInNextDays(ms, cfg.days);

  const membershipTrend = [42, 45, 48, 50, 52, 55].map(
    (k) => k * 180 * cfg.activityMult,
  );
  const salesTrend = [8, 9, 8.5, 10, 11, 12].map(
    (k) => k * 1200 * cfg.activityMult,
  );

  const renewalTitle =
    cfg.days >= 360 ? "Renewals (next 12 mo)" : `Renewals (next ${cfg.days}d)`;

  return (
    <Box>
      <PageHeader
        title="Overview"
        subtext="Attendance sources: front desk check-in, class roster, and completed PT sessions."
        borderStyle="sm"
      />

      <Flex marginTop={4} alignItems="center" gap={4} wrap>
        <label htmlFor="overview-period">
          <Text weight="bold">Time period</Text>
        </label>
        <select
          id="overview-period"
          value={period}
          aria-label="Overview time period"
          onChange={(e) => setPeriod(e.target.value as OverviewPeriod)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 14,
            minWidth: 200,
            background: "#fff",
          }}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="12m">Last 12 months</option>
        </select>
        <Box maxWidth={480}>
          <Text size="200" color="subtle">
            Activity metrics and trends scale to this window. MRR is a current
            snapshot.
          </Text>
        </Box>
      </Flex>

      <Box marginTop={6}>
        <Flex
          gap={{ column: 4, row: 4 }}
          wrap
          justifyContent="start"
        >
          <Box minWidth={200}>
            <Datapoint
              title="Normalized MRR (scope)"
              value={formatMoney(s.mrr)}
              trend={{ value: 4.2, accessibilityLabel: "Up 4.2% vs prior period" }}
              trendSentiment="good"
              tooltipText="Current snapshot; not tied to the time window."
            />
          </Box>
          <Box minWidth={200}>
            <Datapoint
              title="Facility check-ins"
              value={String(checkIns)}
              trend={{ value: 2.1, accessibilityLabel: "Up 2.1% vs prior period" }}
              trendSentiment="good"
              tooltipText={`Front desk check-ins estimated for ${cfg.label} within scope.`}
            />
          </Box>
          <Box minWidth={200}>
            <Datapoint
              title="Class sessions attended"
              value={String(classAttended)}
              trend={{ value: -5.8, accessibilityLabel: "Down 5.8% vs prior period" }}
              trendSentiment="bad"
              tooltipText={`Class roster attendance estimated for ${cfg.label} within scope.`}
            />
          </Box>
          <Box minWidth={200}>
            <Datapoint
              title="PT sessions completed"
              value={String(ptCompleted)}
              trend={{ value: 1.5, accessibilityLabel: "Up 1.5% vs prior period" }}
              trendSentiment="good"
              tooltipText={`Completed PT sessions estimated for ${cfg.label} within scope.`}
            />
          </Box>
          <Box minWidth={200}>
            <Datapoint
              title={renewalTitle}
              value={String(renewals)}
              trend={
                renewals > 2
                  ? { value: 12, accessibilityLabel: "Up 12% upcoming" }
                  : undefined
              }
              trendSentiment="neutral"
              badge={
                renewals > 0
                  ? { text: "Action", type: "warning" }
                  : undefined
              }
              tooltipText="Renewal dates falling in the forward window for the selected period length."
            />
          </Box>
        </Flex>
      </Box>

      <Box marginTop={6} padding={4} rounding={4} borderStyle="sm">
        <BannerSlim
          type="recommendation"
          message="AI: Class fill rate is softening network-wide. See Insights for suggested Instagram UTMs and time-slot ideas."
          primaryAction={{
            accessibilityLabel: "Open insights",
            label: "Open insights",
            href: "/insights",
            role: "link",
          }}
        />
      </Box>

      <Flex marginTop={6} gap={{ column: 6, row: 4 }} wrap>
        <Box width="100%" minWidth={280} maxWidth={560}>
          <Text size="200" color="subtle">
            Trends scaled · {cfg.label}
          </Text>
          <TrendBars
            label="Membership revenue (normalized)"
            values={membershipTrend}
          />
        </Box>
        <Box width="100%" minWidth={280} maxWidth={560}>
          <Text size="200" color="subtle">
            Trends scaled · {cfg.label}
          </Text>
          <TrendBars label="Retail sales ($)" values={salesTrend} />
        </Box>
      </Flex>

      <Box marginTop={6}>
        <Text size="200" color="subtle">
          Prototype data —{" "}
          <Link to="/members">View members</Link> ·{" "}
          <Link to="/classes">Class attendance</Link>
        </Text>
      </Box>
    </Box>
  );
}
