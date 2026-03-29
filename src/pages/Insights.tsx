import { useMemo } from "react";
import { Box, Flex, PageHeader, Text, BannerSlim } from "gestalt";
import { aiInsights } from "../data/mock";
import { useAppScope } from "../context/AppContext";

export function InsightsPage() {
  const { scopeLocationId } = useAppScope();

  const visible = useMemo(() => {
    return aiInsights.filter((i) => {
      if (i.locationId === "all") return true;
      if (scopeLocationId === "all") return true;
      return i.locationId === scopeLocationId;
    });
  }, [scopeLocationId]);

  return (
    <Box>
      <PageHeader
        title="AI insights"
        subtext="Rule-detected signals with narrative copy; scope follows your location filter."
        borderStyle="sm"
      />
      <Flex direction="column" gap={4} marginTop={4}>
        {visible.map((i) => (
          <BannerSlim
            key={i.id}
            type={
              i.severity === "warning"
                ? "warning"
                : i.severity === "success"
                  ? "success"
                  : "info"
            }
            message={
              <Box>
                <Text weight="bold">{i.title}</Text>
                <Box marginTop={2}>
                  <Text>{i.detail}</Text>
                </Box>
              </Box>
            }
          />
        ))}
      </Flex>
    </Box>
  );
}
