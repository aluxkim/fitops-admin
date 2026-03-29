import { Box, Text } from "gestalt";
import type { Location } from "../types";

const CITY_GEO: Record<string, [number, number]> = {
  Austin: [-97.74, 30.27],
  Denver: [-104.99, 39.74],
  Seattle: [-122.33, 47.61],
  Miami: [-80.19, 25.76],
  Chicago: [-87.63, 41.88],
  Portland: [-122.68, 45.52],
  Phoenix: [-112.07, 33.45],
  Boston: [-71.06, 42.36],
  Nashville: [-86.78, 36.16],
  "San Diego": [-117.16, 32.72],
};

const US_PATH =
  "M 82,190 L 82,175 90,168 105,160 118,155 125,148 130,130 136,122 148,118 " +
  "168,118 180,112 195,108 220,102 248,96 272,92 298,88 324,86 348,84 " +
  "370,82 394,80 416,78 440,76 462,75 484,76 506,78 526,82 544,80 560,80 " +
  "576,82 588,86 600,90 614,96 628,106 640,112 652,120 660,126 " +
  "680,128 698,130 710,134 720,140 732,148 744,154 754,160 764,168 " +
  "776,178 786,188 794,198 802,210 808,222 814,230 816,240 818,252 " +
  "818,264 820,276 820,288 822,302 824,318 826,332 826,340 " +
  "824,352 822,358 820,366 816,372 808,380 800,388 " +
  "792,394 784,398 774,400 764,400 752,398 740,396 732,392 726,388 " +
  "720,384 716,378 712,372 706,366 700,362 692,360 684,358 " +
  "676,356 666,354 656,352 648,352 640,354 634,358 628,360 " +
  "622,362 616,362 608,360 600,356 590,352 580,350 568,350 " +
  "554,352 542,354 530,358 518,362 506,364 494,366 484,370 " +
  "478,374 472,378 466,380 460,384 452,388 444,390 434,394 " +
  "424,396 414,398 404,400 392,400 382,400 372,398 364,396 " +
  "354,392 344,390 332,390 320,392 310,398 300,400 290,402 " +
  "278,402 268,400 258,398 248,396 238,394 226,390 218,388 " +
  "210,390 200,394 192,398 184,402 178,408 170,412 " +
  "162,416 154,418 144,420 134,418 124,414 116,410 " +
  "108,406 102,400 96,394 90,388 84,380 80,370 76,358 " +
  "72,344 68,330 66,316 66,302 66,288 68,274 70,260 " +
  "72,246 74,232 76,218 78,206 80,196 Z";

const FL_PATH =
  "M 688,358 L 700,362 712,372 720,384 732,392 740,396 752,398 " +
  "764,400 774,406 780,412 784,420 786,430 788,440 " +
  "790,448 792,456 794,462 798,468 802,472 808,476 816,478 " +
  "820,476 824,472 826,466 828,458 830,450 832,444 " +
  "830,438 826,432 822,426 818,420 816,414 812,408 " +
  "808,400 802,394 796,388 788,384 780,380 770,374 762,370 " +
  "754,366 744,362 734,358 722,356 712,356 700,356 Z";

function lonLatToXY(lon: number, lat: number): [number, number] {
  const lonMin = -125, lonMax = -66.5, latMin = 24.5, latMax = 49.5;
  const pad = 40;
  const w = 920 - pad * 2;
  const h = 500 - pad * 2;
  const x = pad + ((lon - lonMin) / (lonMax - lonMin)) * w;
  const y = pad + ((latMax - lat) / (latMax - latMin)) * h;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

export function UsNetworkMap({ locations }: { locations: Location[] }) {
  return (
    <Box padding={4} rounding={4} borderStyle="sm">
      <Box marginBottom={3}>
        <Text weight="bold">Network map</Text>
        <Text size="200" color="subtle">
          {locations.length} clubs across 10 US cities · hover a pin for
          details
        </Text>
      </Box>
      <svg
        viewBox="0 0 920 500"
        role="img"
        aria-label="Map of United States with gym locations"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: 10,
          background: "linear-gradient(180deg, #eef3fb 0%, #e4edf8 100%)",
        }}
      >
        <defs>
          <linearGradient id="usWash" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e8eef6" />
            <stop offset="100%" stopColor="#dbe7f3" />
          </linearGradient>
        </defs>
        <path
          fill="url(#usWash)"
          stroke="#9eb6d6"
          strokeWidth={1.5}
          d={US_PATH}
        />
        <path
          fill="url(#usWash)"
          stroke="#9eb6d6"
          strokeWidth={1.5}
          d={FL_PATH}
        />
        {locations.map((loc, i) => {
          const base = CITY_GEO[loc.city] ?? [-98, 38.5];
          const lon =
            base[0] + (((i * 17) % 9) - 4) * 0.08 + (i % 3) * 0.03;
          const lat =
            base[1] + (((i * 11) % 7) - 3) * 0.06 + ((i >> 1) % 2) * 0.04;
          const [x, y] = lonLatToXY(lon, lat);
          const title = `${loc.name} · ${loc.city} · ${loc.memberCount} members`;
          return (
            <g key={loc.id} transform={`translate(${x} ${y})`}>
              <title>{title}</title>
              <circle r={16} cx={0} cy={0} fill="#e60023" opacity={0.22} />
              <circle
                r={8}
                cx={0}
                cy={0}
                fill="#e60023"
                stroke="#ffffff"
                strokeWidth={2}
              />
              <circle r={3} cx={0} cy={0} fill="#ffffff" />
            </g>
          );
        })}
      </svg>
    </Box>
  );
}
