"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/ui/chart";
import { MultiSelect } from "../../../components/multi-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "../../../components/ui/skeleton";

const defaultColors = [
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
];

const periodKeyMap = {
  "7d": "ultimos_7_dias",
  "30d": "ultimos_30_dias",
  "90d": "ultimos_3_meses",
};

export function AreaChartSales() {
  const [timeRange, setTimeRange] = useState("7d");
  const [data, setData] = useState([]);
  const [gananciasPorCategoria, setGananciasPorCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resChart, resGan] = await Promise.all([
          fetch("https://run.mocky.io/v3/605f0981-e797-4065-92e0-031ab5101bcb"),
          fetch("https://run.mocky.io/v3/80ea92bd-b6a9-4dca-8656-23bfd164c0a9"),
        ]);
        const chartJson = await resChart.json();
        const ganJson = await resGan.json();

        setData(chartJson);
        setGananciasPorCategoria(ganJson.ganancias_por_categoria);

        const allCats = Object.keys(
          ganJson.ganancias_por_categoria[periodKeyMap["7d"]]
        );
        setSelectedCategories(allCats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const chartConfig = useMemo(() => {
    if (!data.length) return {};
    const keys = Object.keys(data[0]).filter((k) => k !== "date").slice(0, 4);
    return keys.reduce((acc, key, idx) => {
      acc[key] = { label: key, color: defaultColors[idx] };
      return acc;
    }, {});
  }, [data]);

  const filteredData = useMemo(() => {
    const now = Date.now();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    return data.filter((entry) => {
      const diffDays =
        (now - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });
  }, [data, timeRange]);

  const categoryOptions = useMemo(() => {
    if (!gananciasPorCategoria) return [];
    const key = periodKeyMap[timeRange];
    return Object.keys(gananciasPorCategoria[key]).map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    }));
  }, [gananciasPorCategoria, timeRange]);

  const { totalSelectedGanancias, badges } = useMemo(() => {
    if (!gananciasPorCategoria)
      return { totalSelectedGanancias: 0, badges: [] };
    const key = periodKeyMap[timeRange];
    const periodData = gananciasPorCategoria[key];
    let sum = 0;
    const bs = selectedCategories.map((cat) => {
      const { total = 0, porcentaje = 0 } = periodData[cat] || {};
      sum += total;
      return {
        category: cat,
        total,
        porcentaje,
        color: chartConfig[cat]?.color || "#666",
      };
    });
    return { totalSelectedGanancias: sum, badges: bs };
  }, [gananciasPorCategoria, selectedCategories, timeRange, chartConfig]);

  // ─── Loading Skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="bg-black text-white w-full px-1 py-2 overflow-visible relative">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
          {/* Título y monto */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48 bg-neutral-800" />
            <Skeleton className="h-8 w-32 bg-neutral-800" />
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-5 w-20 rounded-full bg-neutral-800"
                />
              ))}
            </div>
          </div>
          {/* Controles */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40 rounded-md bg-neutral-800" />
            <Skeleton className="h-10 w-40 rounded-md bg-neutral-800" />
          </div>
        </CardHeader>
        <CardContent className="px-1 pt-4 sm:px-6 sm:pt-6">
          {/* Gráfica */}
          <Skeleton className="h-40 w-full rounded-md bg-neutral-800" />
        </CardContent>
      </Card>
    );
  }
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Card className="bg-black text-white w-full px-1 py-2 overflow-visible relative">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b pb-2">
        <div className="flex-1 space-y-2">
          <CardTitle className="ml-2 mt-4 sm:mt-2">
            Ventas por categoría
          </CardTitle>
          <div className="text-lg font-semibold ml-2">
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }).format(totalSelectedGanancias)}
          </div>
          <div className="flex flex-wrap gap-2 items-center ml-2">
            {badges.slice(0, 4).map(({ category, porcentaje, color }) => {
              const isPos = porcentaje >= 0;
              return (
                <Badge
                  key={category}
                  variant="ghost"
                  className="px-2 py-0.5 text-xs font-medium border"
                  style={{
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    color: color,
                  }}
                >
                  {porcentaje.toFixed(1)}%{" "}
                  {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                </Badge>
              );
            })}
          </div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 z-10 pr-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Seleccionar rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative z-20 w-full sm:w-[200px]">
            <MultiSelect
              options={categoryOptions}
              defaultValue={selectedCategories}
              onValueChange={setSelectedCategories}
              placeholder="Categorías..."
              animation={2}
              variant="inverted"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-1 pt-2 sm:px-6 sm:pt-6">
        {filteredData.length ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-40 w-full">
            <AreaChart data={filteredData}>
              <CartesianGrid vertical={false} stroke="#ccc" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(val) =>
                  new Date(val).toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(val) =>
                      new Date(val).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })
                    }
                    labelClassName="text-black"
                    indicator="dot"
                  />
                }
              />
              {Object.entries(chartConfig)
                .filter(([key]) => selectedCategories.includes(key))
                .map(([key, { color }]) => (
                  <Area
                    key={key}
                    type="natural"
                    dataKey={key}
                    stroke={color}
                    fillOpacity={0.1}
                    fill={color}
                    dot={{ r: 1.5 }}
                    strokeWidth={2}
                  />
                ))}
            </AreaChart>
          </ChartContainer>
        ) : (
          <p className="text-sm text-center mt-2">
            No hay datos para el rango seleccionado.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
