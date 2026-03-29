import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  PageHeader,
  Text,
  SegmentedControl,
  Table,
  BannerSlim,
  Badge,
} from "gestalt";
import { members } from "../data/mock";
import { useAppScope } from "../context/AppContext";
import {
  getScopedLocationIds,
  formatMoney,
  formatDate,
  locationName,
} from "../utils/scope";

export function MemberDetailPage() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { scopeLocationId } = useAppScope();
  const locIds = getScopedLocationIds(scopeLocationId);
  const [tab, setTab] = useState(0);

  const member = useMemo(
    () => members.find((m) => m.id === memberId),
    [memberId],
  );

  const allowed =
    member &&
    (!locIds || locIds.includes(member.homeLocationId));

  if (!member) {
    return (
      <Box>
        <BannerSlim type="error" message="Member not found." />
      </Box>
    );
  }

  if (!allowed) {
    return (
      <Box>
        <BannerSlim
          type="warning"
          message="This member is outside your location scope."
        />
        <Box marginTop={4}>
          <Button text="Back to members" onClick={() => navigate("/members")} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={member.name}
        subtext={`Home club: ${locationName(member.homeLocationId)} · ${member.email}`}
        borderStyle="sm"
      />
      <Box marginTop={2}>
        <Button text="Back to list" onClick={() => navigate("/members")} />
      </Box>

      <Box marginTop={4} maxWidth={480}>
        <SegmentedControl
          items={["Overview", "Attendance", "Billing"]}
          selectedItemIndex={tab}
          onChange={({ activeIndex }) => setTab(activeIndex)}
        />
      </Box>

      {tab === 0 && (
        <Box marginTop={4}>
          <Flex gap={4} wrap>
            <Badge
              text={`${member.planType} / ${member.cadence}`}
              type="info"
            />
            {member.discountLabel && (
              <Badge text={member.discountLabel} type="success" />
            )}
          </Flex>
          <Box marginTop={4}>
            <Text>
              {member.planType === "family"
                ? `Household: primary + ${(member.familySeats ?? 3) - 1} dependents (prototype).`
                : "Individual membership."}
            </Text>
          </Box>
        </Box>
      )}

      {tab === 1 && (
        <Box marginTop={4}>
          <Table accessibilityLabel="Attendance breakdown" borderStyle="sm">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Text weight="bold">Source</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Count (rolling)</Text>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Text>Front desk check-in</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{member.attendance.facilityCheckIns}</Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text>Class roster (attended)</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{member.attendance.classSessions}</Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text>PT sessions completed</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{member.attendance.ptCompleted}</Text>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Box>
      )}

      {tab === 2 && (
        <Box marginTop={4}>
          <Table accessibilityLabel="Billing" borderStyle="sm">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Text weight="bold">Field</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Value</Text>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Text>Current period charge</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatMoney(member.currentCharge)}</Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text>Normalized MRR</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatMoney(member.normalizedMrr)}</Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text>Renewal / term end</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatDate(member.renewalDate)}</Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text>Discount</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{member.discountLabel ?? "None"}</Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text>Proration (example)</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>—</Text>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Box marginTop={3}>
            <Text size="200" color="subtle">
              Invoice ledger for mid-cycle changes would appear here in a full
              product.
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
