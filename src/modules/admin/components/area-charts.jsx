"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart";
import { MultiSelect } from "../../../components/multi-select";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Skeleton } from "../../../components/ui/skeleton";
import { getProfitByCategory, getSalesByCategory } from "../../../services/DashboardService";

const defaultColors = [
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
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
  const didFetch = useRef(false);

  // Calcular dominio dinamico del eje Y
  const filteredData = useMemo(() => {
    const now = Date.now();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    return data.filter((entry) => {
      const diffDays = (now - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });
  }, [data, timeRange]);

  const yDomain = useMemo(() => {
    if (!filteredData.length) return ["auto", "auto"];
    const allValues = filteredData.flatMap((e) =>
      Object.keys(e).filter((k) => k !== "date").map((cat) => e[cat])
    );
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    return [min * 0.9, max * 1.1];
  }, [filteredData]);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    async function fetchChartData() {
      setLoading(true);
      try {
        const [chartData, gananciasData] = await Promise.all([
          getSalesByCategory(),
          getProfitByCategory(),
        ]);

        // Ordenar por fecha
        chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 1) Normalizar datos para que todas las categorías aparezcan en cada fecha
        const allCats = Array.from(
          new Set(
            chartData.flatMap((e) => Object.keys(e).filter((k) => k !== "date"))
          )
        );
        const normalized = chartData.map((e) => {
          const entry = { date: e.date };
          allCats.forEach((cat) => {
            entry[cat] = e[cat] ?? 0;
          });
          return entry;
        });

        setData(normalized);
        setGananciasPorCategoria(gananciasData?.ganancias_por_categoria);

        // Seleccionar categorías por defecto
        const defaultCats = Object.keys(
          gananciasData?.ganancias_por_categoria?.[periodKeyMap["7d"]] || {}
        );
        setSelectedCategories(defaultCats);

        // Validar existencia de datos recientes
        const days = 7;
        const now = Date.now();
        const hasAny = normalized.some((entry) => {
          const diff = (now - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
          return diff <= days;
        });
        if (normalized.length > 0 && !hasAny) {
          toast.error("No hay datos en este rango.");
        }
      } catch (err) {
        toast.error("No se pudieron cargar las ventas por categoría.");
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  const chartConfig = useMemo(() => {
    if (!data.length) return {};
    // 2) Todas las categorías disponibles
    const keys = Object.keys(data[0]).filter((k) => k !== "date");
    return keys.reduce((acc, key, idx) => {
      acc[key] = {
        label: key,
        color: defaultColors[idx % defaultColors.length],
      };
      return acc;
    }, {});
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (!gananciasPorCategoria) return [];
    const key = periodKeyMap[timeRange];
    const categoriasRaw = gananciasPorCategoria?.[key] ?? {};
    return Object.keys(categoriasRaw).map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    }));
  }, [gananciasPorCategoria, timeRange]);

  const { totalSelectedGanancias, badges } = useMemo(() => {
    if (!gananciasPorCategoria) return { totalSelectedGanancias: 0, badges: [] };
    const key = periodKeyMap[timeRange];
    const periodData = gananciasPorCategoria?.[key] ?? {};
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

  const isEmpty = data.length === 0;

  return (
    <>
      {loading || isEmpty ? (
        <Card className="bg-gray-100 text-gray-900 w-full px-1 py-2 overflow-visible relative">
          {/* Skeleton */}
          <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48 bg-neutral-800" />
              <Skeleton className="h-8 w-32 bg-neutral-800" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-20 rounded-full bg-neutral-800" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-40 rounded-md bg-neutral-800" />
              <Skeleton className="h-10 w-40 rounded-md bg-neutral-800" />
            </div>
          </CardHeader>
          <CardContent className="px-1 pt-4 sm:px-6 sm:pt-6">
            <Skeleton className="h-40 w-full rounded-md bg-neutral-800" />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#f0f0f0e7] text-gray-800 border-3 w-full px-1 py-2 overflow-visible relative h-full">

          <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mt-2">
            <div>
              <CardTitle className="text-xl font-bold">Ventas por categoría</CardTitle>
              <div className="text-2xl font-extrabold mt-2">
                ${new Intl.NumberFormat("es-ES", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(totalSelectedGanancias)}
              </div>
              <div className="flex flex-wrap gap-2 justify-center items-center ml-3 mt-3">
                {badges.slice(0, 4).map(({ category, porcentaje, color }) => {
                  const isPos = porcentaje >= 0;
                  return (
                    <Badge
                      key={category}
                      variant="ghost"
                      className="px-2 py-0.5 text-ls font-black border-3"
                      style={{ borderColor: color, backgroundColor: `${color}20`, color: color }}
                    >
                      {porcentaje.toFixed(1)}% {isPos ? <TrendingUp size={20} className="inline align-middle ml-1" /> : <TrendingDown size={20} className="inline align-middle ml-1" />}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap mt-1">
              <div className="w-full">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar rango" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 3 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
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
          <CardContent className="pl-0 pr-1 pt-2 -sm:pl-10 sm:pr-5 sm:pt-2">
            <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full p-1 pl-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData}>
                  <CartesianGrid vertical={false} stroke="#ccc" strokeDasharray="3 4" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(val) =>
                      new Date(`${val}T00:00:00`).toLocaleDateString("es-ES", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    domain={yDomain}
                    tickFormatter={(val) => {
                      if (val >= 1000) return `${val.toLocaleString("es-ES")}`;
                      if (val >= 1) return val.toFixed(0);
                      if (val >= 0.1) return val.toFixed(1);
                      return val.toFixed(2); 
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent
                      labelFormatter={(val) =>
                        new Date(`${val}T00:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })
                      }
                      labelClassName="text-black"
                      indicator="dot"
                    />}
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
                        dot={{ r: 2 }}
                        strokeWidth={2}
                      />
                    ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
