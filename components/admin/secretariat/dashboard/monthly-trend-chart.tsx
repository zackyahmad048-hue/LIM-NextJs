"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface TrendDatum {
  label: string;
  incoming: number;
  outgoing: number;
}

const chartConfig = {
  incoming: {
    label: "Surat Masuk",
    color: "hsl(var(--chart-1))",
  },
  outgoing: {
    label: "Surat Keluar",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function MonthlyTrendChart({ series }: { series: TrendDatum[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[280px] w-full"
    >
      <AreaChart data={series} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={32}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="incoming"
          type="monotone"
          stroke="var(--color-incoming)"
          fill="var(--color-incoming)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Area
          dataKey="outgoing"
          type="monotone"
          stroke="var(--color-outgoing)"
          fill="var(--color-outgoing)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
