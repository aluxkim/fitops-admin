import { useMemo } from "react";
import { Box, PageHeader, Table, Text, Link } from "gestalt";
import { campaigns } from "../data/mock";
import { useAppScope } from "../context/AppContext";
import { getScopedLocationIds, locationName } from "../utils/scope";

export function MarketingPage() {
  const { scopeLocationId } = useAppScope();
  const locIds = getScopedLocationIds(scopeLocationId);

  const rows = useMemo(
    () =>
      campaigns.filter(
        (c) => !locIds || locIds.includes(c.locationId),
      ),
    [locIds],
  );

  return (
    <Box>
      <PageHeader
        title="Marketing"
        subtext="Instagram destination + UTM parameters for attribution (first-touch in a full build)."
        borderStyle="sm"
      />
      <Box marginTop={4} overflow="scrollX">
        <Table accessibilityLabel="Campaigns" borderStyle="sm" maxHeight="70vh">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold">Campaign</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Location</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Instagram</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">UTM</Text>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Text weight="bold">Signups</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell>
                  <Text weight="bold">{c.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{locationName(c.locationId)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={c.instagramUrl}
                    display="inline"
                    target="blank"
                    rel="nofollow"
                  >
                    Open link
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Text size="100">
                    utm_source={c.utm.source} · utm_medium={c.utm.medium} ·
                    utm_campaign={c.utm.campaign}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{c.signupsAttributed}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}
