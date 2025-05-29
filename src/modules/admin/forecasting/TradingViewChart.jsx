"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getForecast } from "../../../services/SalesService";
import { getCategoryAll } from "../../../services/CategoryService";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../../../components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import dayjs from "dayjs";
import "dayjs/locale/es";

export function ForecastByCategory() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [historyData, setHistoryData] = useState([]); // Sólo histórico
    const [projectionData, setProjectionData] = useState([]); // Histórico + forecast
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        getCategoryAll()
            .then((cats) => setCategories(cats))
            .catch(() => setError("No se pudieron cargar las categorías"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;
        setLoading(true);
        setError("");

        // Extrae el nombre real de la categoría (antes del guion)
        const name = selectedCategory.split("-")[0];

        getForecast(name, 4)
            .then((data) => {
                const byDate = (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime();
                const rawHist = [...data.history].sort(byDate);
                const rawFct = [...data.forecasting].sort(byDate);

                const history = rawHist.map((d) => ({
                    originalDate: d.date,
                    date: dayjs(d.date).locale("es").format("D MMM"),
                    value: d.value,
                }));
                const forecast = rawFct.map((d) => ({
                    originalDate: d.date,
                    date: dayjs(d.date).locale("es").format("D MMM"),
                    value: d.value,
                }));

                setHistoryData(history);
                setProjectionData([...history, ...forecast]);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [selectedCategory]);

    const chartHeight = 300;

    return (
        <Card className="w-full bg-black text-white">
            <CardHeader className="flex items-center gap-4">
                <CardTitle>Forecast por categoría</CardTitle>
                <div className="w-64">
                    <Select onValueChange={name => {
    setSelectedCategory(name);
}}>
    <SelectTrigger>
        <SelectValue placeholder="Selecciona una categoría" />
    </SelectTrigger>
    <SelectContent>
        {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.name + "-" + cat.id}>
                {cat.name}
            </SelectItem>
        ))}
    </SelectContent>
</Select>
                </div>
            </CardHeader>

            <CardContent className="relative">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {loading && historyData.length === 0 && (
                    <Skeleton className={`h-${chartHeight} w-full`} />
                )}

                <div style={{ width: "100%", height: chartHeight }}>
                    {projectionData.length > 0 ? (
                        <ChartContainer config={{}} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={projectionData}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                                    <XAxis
                                        dataKey="date"
                                        stroke="#888"
                                        interval={0}
                                        tick={{ angle: -45, textAnchor: "end", fontSize: 12 }}
                                        allowDuplicatedCategory={false}
                                    />

                                    <YAxis stroke="#888" />

                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(val) => {
                                                    // Busca el objeto en projectionData por el campo 'date'
                                                    const item = projectionData.find(d => d.date === val);
                                                    if (!item) return val;
                                                    return dayjs(item.originalDate)
                                                        .locale("es")
                                                        .format("dddd, D [de] MMMM");
                                                }}
                                                labelClassName="text-black"
                                                indicator="dot"
                                            />
                                        }
                                    />

                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{ bottom: -10 }}
                                    />

                                    {/* Proyección */}
                                    <Area
                                        key="projection"
                                        type="monotone"
                                        dataKey="value"
                                        data={projectionData}
                                        stroke="#7c3aed"
                                        fill="#7c3aed"
                                        fillOpacity={0.2}
                                        name="Proyección"
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={false}
                                    />

                                    {/* Histórico encima */}
                                    <Area
                                        key="history"
                                        type="monotone"
                                        dataKey="value"
                                        data={historyData}
                                        stroke="#10b981"
                                        fill="#10b981"
                                        fillOpacity={0.1}
                                        name="Histórico"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : (
                        !loading &&
                        selectedCategory &&
                        !error && (
                            <div className="flex items-center justify-center h-full">
                                No hay datos para mostrar.
                            </div>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
