"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "../../../../components/ui/card";
import { toast } from "react-toastify";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
    getForecastCategory,
    getPrescriptiveCategory,
} from "../../../../services/SalesService";
import TypingText from "./typing-text";
import { getCategoryAll } from "../../../../services/CategoryService";
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
} from "../../../../components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select";
import dayjs from "dayjs";
import "dayjs/locale/es";

export function ForecastByCategory() {
    const [categories, setCategories] = useState([]);
    // Inicializamos con "Ninguno-default" para que coincida con el valor del SelectItem
    const [selectedCategory, setSelectedCategory] = useState("Ninguno-default");
    const [prescriptive, setPrescriptive] = useState("");
    const [historyData, setHistoryData] = useState([]); // Sólo histórico
    const [projectionData, setProjectionData] = useState([]); // Histórico + forecast
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAnimating, setIsAnimating] = useState(true);


    // Datos por defecto para "Ninguno"
    const defaultForecastData = {
        category: "Ninguno",
        history: [
            { date: "2025-02-24", value: 5 },
            { date: "2025-03-03", value: 45 },
            { date: "2025-03-10", value: 33 },
            { date: "2025-03-17", value: 41 },
            { date: "2025-03-24", value: 36 },
            { date: "2025-03-31", value: 55 },
            { date: "2025-04-07", value: 35 },
            { date: "2025-04-14", value: 50 },
            { date: "2025-04-21", value: 36 },
            { date: "2025-04-28", value: 43 },
            { date: "2025-05-05", value: 43 },
            { date: "2025-05-12", value: 41 },
            { date: "2025-05-19", value: 20 },
            { date: "2025-05-26", value: 19 },
        ],
        forecasting: [
            { date: "2025-06-01", value: 37 },
            { date: "2025-06-08", value: 38 },
            { date: "2025-06-15", value: 39 },
            { date: "2025-06-22", value: 40 },
        ],
    };

    // Carga inicial de categorías (incluye "Ninguno")
    useEffect(() => {
        setLoading(true);
        getCategoryAll()
            .then((cats) =>
                console.log(cats),
                setCategories([{ id: "default", name: "Ninguno" }, ...cats])
            )
            .catch(() => setError("No se pudieron cargar las categorías"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const svg = document.querySelector(".recharts-wrapper");
        if (!svg) return;

        const areaPaths = svg.querySelectorAll(".recharts-area-area path");

        areaPaths.forEach((path) => {
            if (isAnimating) {
                path.classList.add("animate-pulse-line");
            } else {
                path.classList.remove("animate-pulse-line");
            }
        });
    }, [isAnimating]);

    useEffect(() => {
        // Inicia la animación cada vez que cambia la categoría
        if (!selectedCategory) return;
        setIsAnimating(true);
    }, [selectedCategory]);

    // Si la categoría seleccionada es "Ninguno-default", cargamos datos por defecto
    useEffect(() => {
        if (selectedCategory === "Ninguno-default") {
            const byDate = (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime();
            const rawHist = [...defaultForecastData.history].sort(byDate);
            const rawFct = [...defaultForecastData.forecasting].sort(byDate);

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
            setPrescriptive("No hay recomendaciones disponibles para esta categoría en este momento.");
            setLoading(false);
        }
    }, [selectedCategory]);

    // Cuando cambie la categoría (y no sea "Ninguno-default"), hacemos la llamada a la API
    useEffect(() => {
        if (!selectedCategory || selectedCategory === "Ninguno-default") return;

        setLoading(true);
        setError("");

        // Extrae el nombre real antes del guion
        const name = selectedCategory.split("-")[0];

        getForecastCategory(name)
            .then(async (response) => {
                const selCat = categories.find((p) => p.name === name);
                const categoryName = selCat?.name || name;

                const byDate = (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime();
                const rawHist = [...response.history].sort(byDate);
                const rawFct = [...response.forecasting].sort(byDate);

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

                setLoading(false);
                try {
                    const prescriptiveText = await getPrescriptiveCategory(
                        response,
                        categoryName
                    );
                    setPrescriptive(prescriptiveText);
                } catch (presErr) {
                    console.error("Error en análisis prescriptivo:", presErr);
                }
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
            });
    }, [selectedCategory]);

    // Si hay error, mostramos toast
    useEffect(() => {
        if (error) {
            toast.error(
                "La categoría seleccionada no fue encontrada. Por favor, intenta con otra."
            );
        }
    }, [error]);

    const chartHeight = 300;

    return (
        <Card className="bg-[#f0f0f0e7] text-gray-800 border-3 w-full px-1 py-2 overflow-visible relative h-full">
            <CardHeader className="relative grid grid-cols-1 xl:grid-cols-10 gap-6 items-start mt-5">
                {/* Columna principal: título + select en una fila */}
                <div className="xl:col-span-10 w-full flex flex-col items-center">
                    <div className="w-full flex flex-col xl:flex-row items-center justify-center gap-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 text-center">
                            Predicción de ventas por categoría
                        </CardTitle>
                        <div className="w-64">
                            <Select onValueChange={(name) => setSelectedCategory(name)}>
                                <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2 transition-colors duration-200 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400">
                                    {/* defaultValue coincide con el value del SelectItem para "Ninguno" */}
                                    <SelectValue
                                        placeholder="Selecciona una categoría"
                                        defaultValue="Ninguno-default"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={`${cat.name}-${cat.id}`}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative grid grid-cols-1 xl:grid-cols-10 gap-6 items-start">
                {/* Si está cargando y no hay datos, mostramos Skeleton */}
                {loading && projectionData.length === 0 && !error ? (
                    <>
                        <div className="xl:col-span-7 w-full space-y-4">
                            <Skeleton className="h-6 w-3/4 rounded bg-gray-300" />
                            <Skeleton className="h-6 w-full rounded bg-gray-200" />
                            <Skeleton className="h-[200px] w-full rounded bg-gray-100" />
                        </div>
                        <div className="xl:col-span-3 w-full space-y-4">
                            <Skeleton className="h-5 w-[90%] rounded bg-gray-300" />
                            <Skeleton className="h-5 w-[80%] rounded bg-gray-200" />
                            <Skeleton className="h-5 w-[60%] rounded bg-gray-100" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="xl:col-span-7 w-full">
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
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    minTickGap={32}
                                                    allowDuplicatedCategory={false}
                                                    tickFormatter={(val) => {
                                                        const item = projectionData.find(
                                                            (d) => d.date === val
                                                        );
                                                        if (!item) return val;
                                                        return dayjs(item.originalDate)
                                                            .locale("es")
                                                            .format("D MMM YYYY");
                                                    }}
                                                />
                                                <YAxis stroke="#888" />

                                                {/* Ocultamos el tooltip si la categoría es "Ninguno-default" */}
                                                {selectedCategory !== "Ninguno-default" && (
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={
                                                            <ChartTooltipContent
                                                                labelFormatter={(val) => {
                                                                    const item = projectionData.find(
                                                                        (d) => d.date === val
                                                                    );
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
                                                )}

                                                <Legend
                                                    verticalAlign="bottom"
                                                    align="center"
                                                    wrapperStyle={{
                                                        bottom: 10,
                                                        fontSize: 16,
                                                        fontWeight: "600",
                                                    }}
                                                    iconType="rect"
                                                    iconSize={14}
                                                />

                                                {/* Área de proyección */}
                                                <Area
                                                    key="history"
                                                    type="monotone"
                                                    dataKey="value"
                                                    data={historyData}
                                                    stroke={
                                                        selectedCategory === "Ninguno-default" ? "#737373" : "#96D42C"
                                                    }
                                                    fill={
                                                        selectedCategory === "Ninguno-default" ? "#d4d4d4" : "#96D42C"
                                                    }
                                                    fillOpacity={0.1}
                                                    name="Histórico"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                    isAnimationActive={true}
                                                    animationDuration={1000}
                                                    animationEasing="ease-in-out"
                                                    className={isAnimating ? "animate-pulse-line" : ""}
                                                />

                                                {/* Área de proyección */}
                                                <Area
                                                    key="projection"
                                                    type="monotone"
                                                    dataKey="value"
                                                    data={projectionData}
                                                    stroke={
                                                        selectedCategory === "Ninguno-default" ? "#a3a3a3" : "#6AD466"
                                                    }
                                                    fill={
                                                        selectedCategory === "Ninguno-default" ? "#d4d4d4" : "#6AD466"
                                                    }
                                                    fillOpacity={0.08}
                                                    name="Proyección"
                                                    strokeWidth={2}
                                                    dot={false}
                                                    isAnimationActive={true}
                                                    animationDuration={1000}
                                                    animationEasing="ease-in-out"
                                                    className={isAnimating ? "animate-pulse-line" : ""}
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
                        </div>

                        <div className="xl:col-span-3 w-full h-full">
                            <TypingText text={prescriptive} />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
