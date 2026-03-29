import { useMemo } from "react";
import { Box, PageHeader, Table, Text } from "gestalt";
import { merchCatalog, stockByLocation } from "../data/mock";
import { useAppScope } from "../context/AppContext";
import { getScopedLocationIds, formatMoney, locationName } from "../utils/scope";

export function CommercePage() {
  const { scopeLocationId } = useAppScope();
  const locIds = getScopedLocationIds(scopeLocationId);

  const rows = useMemo(() => {
    const stocks = stockByLocation.filter(
      (r) => !locIds || locIds.includes(r.locationId),
    );
    return stocks.map((s) => {
      const item = merchCatalog.find((m) => m.id === s.itemId);
      return {
        ...s,
        item,
        revenue: s.soldThisMonth * (item?.msrp ?? 0),
      };
    });
  }, [locIds]);

  return (
    <Box>
      <PageHeader
        title="Commerce"
        subtext="Same catalog network-wide; stock and sales are per location."
        borderStyle="sm"
      />
      <Box marginTop={6}>
        <Text size="200" weight="bold">
          Catalog (MSRP)
        </Text>
        <Box marginTop={2} overflow="scrollX">
          <Table accessibilityLabel="Catalog" borderStyle="sm">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Text weight="bold">SKU</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Product</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">MSRP</Text>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {merchCatalog.map((m) => (
                <Table.Row key={m.id}>
                  <Table.Cell>
                    <Text>{m.sku}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="bold">{m.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{formatMoney(m.msrp)}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Box>
      </Box>

      <Box marginTop={6}>
        <Text size="200" weight="bold">
          Inventory & sales (scoped)
        </Text>
        <Box marginTop={2} overflow="scrollX">
          <Table accessibilityLabel="Inventory" borderStyle="sm" maxHeight="60vh">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Text weight="bold">Location</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Product</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">On hand</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Sold (mo)</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Retail ($)</Text>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((r) => (
                <Table.Row key={`${r.locationId}-${r.itemId}`}>
                  <Table.Cell>
                    <Text>{locationName(r.locationId)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{r.item?.name ?? r.itemId}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{r.units}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{r.soldThisMonth}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{formatMoney(r.revenue)}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
