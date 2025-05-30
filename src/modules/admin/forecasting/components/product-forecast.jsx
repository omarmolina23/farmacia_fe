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
    const [prescriptive, setPrescriptive] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(""); // Cambia a guardar el id
    const [historyData, setHistoryData] = useState([]);
    const [projectionData, setProjectionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        getProductAll()
            .then((prods) => setProducts(prods))
            .catch(() => setError("No se pudieron cargar los productos"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedProductId) return;
        setLoading(true);
        setError("");

        getForecastProduct(selectedProductId)
            .then(async (response) => {
                const selProd = products.find((p) => p.id === selectedProductId);
                const productName = selProd?.name || selectedProductId;

                try {
                    const prescriptive = await getPrescriptiveProduct(response, productName);
                    setPrescriptive(prescriptive);
                } catch (presErr) {
                    console.error("Error en análisis prescriptivo:", presErr);
                }

                const byDate = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();
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
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [selectedProductId, products]);

    useEffect(() => {
        if (error) {
            toast.error("La categoría seleccionada no fue encontrada. Por favor, intenta con otra.");
        }
    }, [error]);

    const chartHeight = 300;

    return (
        <Card className="bg-[#f0f0f0e7] text-gray-800 border-3 w-full px-1 py-2 overflow-visible relative h-full ">
            <CardHeader className="flex items-center justify-center gap-6 p-2">
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Predicción de ventas por producto
                </CardTitle>

                <div className="w-64">
                    <Select onValueChange={id => setSelectedProductId(id)}>
                        <SelectTrigger
                            className="border border-gray-300 rounded-md px-3 py-2 transition-colors duration-200 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(prod => (
                                <SelectItem key={prod.id} value={prod.id}>
                                    {prod.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="relative grid grid-cols-1 xl:grid-cols-10 gap-6 items-start">
                {loading || !selectedProductId || error ? (
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
                        <div className="@xl/main:col-span-7 w-full">
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
                                                        return dayjs(item.originalDate).locale("es").format("D MMM YYYY");
                                                    }}
                                                />


                                                <YAxis stroke="#888" />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent
                                                            labelFormatter={(val) => {
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
                                                    wrapperStyle={{
                                                        bottom: 10,
                                                        fontSize: 16,
                                                        fontWeight: '600',
                                                    }}
                                                    iconType="rect"
                                                    iconSize={14}
                                                />
                                                <Area
                                                    key="projection"
                                                    type="monotone"
                                                    dataKey="value"
                                                    data={projectionData}
                                                    stroke="#6AD466"
                                                    fill="#6AD466"
                                                    fillOpacity={0.08}
                                                    name="Proyección"
                                                    strokeWidth={2}
                                                    dot={false}
                                                    isAnimationActive={false}
                                                />
                                                <Area
                                                    key="history"
                                                    type="monotone"
                                                    dataKey="value"
                                                    data={historyData}
                                                    stroke="#96D42C"
                                                    fill="#96D42C"
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
                                    selectedProductId &&
                                    !error && (
                                        <div className="flex items-center justify-center h-full">
                                            No hay datos para mostrar.
                                        </div>
                                    )
                                )}
                            </div>

                        </div>
                        <div className="@xl/main:col-span-3 w-full h-full">
                            <TypingText text={prescriptive} />
                        </div>
                    </>
                )}
            </CardContent>

        </Card>


    );
}
