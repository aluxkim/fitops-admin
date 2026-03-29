import { useMemo } from "react";
import { Box, PageHeader, Table, Text, Button } from "gestalt";
import { staff } from "../data/mock";
import { useAppScope } from "../context/AppContext";
import { getScopedLocationIds, locationName } from "../utils/scope";

export function StaffPage() {
  const { scopeLocationId } = useAppScope();
  const locIds = getScopedLocationIds(scopeLocationId);

  const rows = useMemo(
    () =>
      staff.filter((s) => !locIds || locIds.includes(s.locationId)),
    [locIds],
  );

  return (
    <Box>
      <PageHeader
        title="Staff"
        subtext="Directory, certifications, and weekly schedule (schedule is illustrative)."
        borderStyle="sm"
      />
      <Box marginTop={2}>
        <Button text="Add staff" onClick={() => undefined} />
      </Box>
      <Box marginTop={4} overflow="scrollX">
        <Table accessibilityLabel="Staff" borderStyle="sm" maxHeight="70vh">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold">Name</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Location</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Role</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Email</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Certs</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Schedule</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((s) => (
              <Table.Row key={s.id}>
                <Table.Cell>
                  <Text weight="bold">{s.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{locationName(s.locationId)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{s.role}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{s.email}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{s.certifications.join(", ")}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    text="View week"
                    onClick={() => undefined}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}
