"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";
import { getForecastProduct, getPrescriptiveProduct } from "../../../../services/SalesService";
import TypingText from "./typing-text";
import { getProductAll } from "../../../../services/ProductService";
import { toast } from "react-toastify";
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

export function ForecastByProduct() {
    const [products, setProducts] = useState([]);
    // Inicializamos con "default" para que coincida con el SelectItem de "Ninguno"
    const [selectedProductId, setSelectedProductId] = useState("default");
    const [prescriptive, setPrescriptive] = useState("");
    const [historyData, setHistoryData] = useState([]);
    const [projectionData, setProjectionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Datos por defecto para "Ninguno"
    const defaultForecastData = {
        product_id: "d1f06e5a-9b35-4144-b639-7b2d113ff1e3",
        history: [
            { date: "2024-12-16", value: 0 },
            { date: "2024-12-23", value: 0 },
            { date: "2024-12-30", value: 0 },
            { date: "2025-01-06", value: 0 },
            { date: "2025-01-13", value: 0 },
            { date: "2025-01-20", value: 0 },
            { date: "2025-01-27", value: 0 },
            { date: "2025-02-03", value: 0 },
            { date: "2025-02-10", value: 0 },
            { date: "2025-02-17", value: 0 },
            { date: "2025-02-24", value: 2 },
            { date: "2025-03-03", value: 36 },
            { date: "2025-03-10", value: 13 },
            { date: "2025-03-17", value: 37 },
            { date: "2025-03-24", value: 25 },
            { date: "2025-03-31", value: 55 },
            { date: "2025-04-07", value: 35 },
            { date: "2025-04-14", value: 50 },
            { date: "2025-04-21", value: 35 },
            { date: "2025-04-28", value: 35 },
            { date: "2025-05-05", value: 29 },
            { date: "2025-05-12", value: 28 },
            { date: "2025-05-19", value: 6 },
            { date: "2025-05-26", value: 6 },
        ],
        forecasting: [
            { date: "2025-06-01", value: 13 },
            { date: "2025-06-08", value: 13 },
            { date: "2025-06-15", value: 13 },
            { date: "2025-06-22", value: 13 },
        ],
        weeks: 4,
    };

    // Carga inicial de productos (incluye "Ninguno")
    useEffect(() => {
        setLoading(true);
        getProductAll()
            .then((prods) => {
                setProducts([{ id: "default", name: "Ninguno" }, ...prods]);
            })
            .catch(() => setError("No se pudieron cargar los productos"))
            .finally(() => setLoading(false));
    }, []);

    // Si la selección es "default" (Ninguno), usamos los datos por defecto
    useEffect(() => {
        if (selectedProductId === "default") {
            setLoading(true);
            setPrescriptive(""); // Borramos texto anterior antes de poner el fijo

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
            setPrescriptive("No hay recomendaciones disponibles para este producto en este momento.");
            setLoading(false);
        }
    }, [selectedProductId]);

    // Si la selección NO es "default", hacemos la llamada a la API
    useEffect(() => {
        if (!selectedProductId || selectedProductId === "default") return;

        setLoading(true);
        setError("");
        setPrescriptive(""); // Borramos texto anterior antes de fetch

        getForecastProduct(selectedProductId)
            .then(async (response) => {
                const selProd = products.find((p) => p.id === selectedProductId);
                const productName = selProd?.name || selectedProductId;

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
                    const prescriptiveText = await getPrescriptiveProduct(
                        response,
                        productName
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
    }, [selectedProductId, products]);

    // Mostrar toast si hay error
    useEffect(() => {
        if (error) {
            toast.error(
                "El producto seleccionado no fue encontrado. Por favor, intenta con otro."
            );
        }
    }, [error]);

    const chartHeight = 300;

    return (
        <Card className="bg-[#f0f0f0e7] text-gray-800 border-3 w-full px-1 py-2 overflow-visible relative h-full">
            <CardHeader className="relative grid grid-cols-1 xl:grid-cols-10 gap-6 items-start mt-5">
                {/* Columna principal: título + select */}
                <div className="xl:col-span-10 w-full flex flex-col items-center">
                    <div className="w-full flex flex-col xl:flex-row items-center justify-center gap-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 text-center">
                            Predicción de ventas por producto
                        </CardTitle>
                        <div className="w-64">
                            <Select onValueChange={(id) => setSelectedProductId(id)}>
                                <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2 transition-colors duration-200 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400">
                                    <SelectValue
                                        placeholder="Selecciona un producto"
                                        defaultValue="default"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((prod) => (
                                        <SelectItem key={prod.id} value={prod.id}>
                                            {prod.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative grid grid-cols-1 xl:grid-cols-10 gap-6 items-start">
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
                                                        const item = projectionData.find((d) => d.date === val);
                                                        if (!item) return val;
                                                        return dayjs(item.originalDate)
                                                            .locale("es")
                                                            .format("D MMM YYYY");
                                                    }}
                                                />

                                                <YAxis stroke="#888" />

                                                {/* Ocultamos el tooltip si selectedProductId === "default" */}
                                                {selectedProductId !== "default" && (
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={
                                                            <ChartTooltipContent
                                                                labelFormatter={(val) => {
                                                                    const item = projectionData.find((d) => d.date === val);
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

                                                {/* Área de Proyección */}
                                                <Area
                                                    key="projection"
                                                    type="monotone"
                                                    dataKey="value"
                                                    data={projectionData}
                                                    stroke={
                                                        selectedProductId === "default" ? "#a3a3a3" : "#6AD466"
                                                    }
                                                    fill={
                                                        selectedProductId === "default" ? "#d4d4d4" : "#6AD466"
                                                    }
                                                    fillOpacity={0.08}
                                                    name="Proyección"
                                                    strokeWidth={2}
                                                    dot={false}
                                                    isAnimationActive={false}
                                                    className={
                                                        selectedProductId === "default" ? "animate-pulse-slow" : ""
                                                    }
                                                />

                                                {/* Área Histórica */}
                                                <Area
                                                    key="history"
                                                    type="monotone"
                                                    dataKey="value"
                                                    data={historyData}
                                                    stroke={
                                                        selectedProductId === "default" ? "#737373" : "#96D42C"
                                                    }
                                                    fill={
                                                        selectedProductId === "default" ? "#d4d4d4" : "#96D42C"
                                                    }
                                                    fillOpacity={0.1}
                                                    name="Histórico"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                    isAnimationActive={false}
                                                    className={
                                                        selectedProductId === "default" ? "animate-pulse-slow" : ""
                                                    }
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                ) : (
                                    !loading &&
                                    selectedProductId &&
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
