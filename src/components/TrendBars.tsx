import { Box, Flex, Text } from "gestalt";

const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

/** Simple bar sparkline for prototype trends. */
export function TrendBars({
  label,
  values,
}: {
  label: string;
  values: number[];
}) {
  const max = Math.max(...values, 1);
  return (
    <Box>
      <Text size="200" weight="bold">
        {label}
      </Text>
      <Flex alignItems="end" gap={2} height={80} marginTop={2}>
        {values.map((v, i) => {
          const barH = Math.max(6, Math.round((v / max) * 56));
          return (
            <Flex
              key={months[i] ?? i}
              direction="column"
              justifyContent="end"
              alignItems="center"
              height={72}
              minWidth={36}
            >
              <Box
                color="brand"
                rounding={2}
                width="100%"
                height={barH}
              />
              <Box marginTop={1}>
                <Text size="100" color="subtle" align="center">
                  {months[i]}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}
