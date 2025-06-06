"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart";
import { Skeleton } from "../../../components/ui/skeleton";
import { getProductsSold } from "../../../services/DashboardService";

const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export function RadialChart() {
    const [data, setData] = useState([]);
    const [percentChange, setPercentChange] = useState(0);
    const [loading, setLoading] = useState(true);
    const didFetch = useRef(false);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        async function fetchData() {
            try {
                const response = await getProductsSold();
                const json = response;

                const colorMap = {};
                let colorIndex = 0;

                const enriched = json.products.map((p) => {
                    if (!colorMap[p.product]) {
                        colorMap[p.product] =
                            chartColors[colorIndex % chartColors.length];
                        colorIndex++;
                    }

                    return {
                        ...p,
                        fill: colorMap[p.product],
                    };
                });

                setData(enriched);
                setPercentChange(json.percentChange);
            } catch (err) {
                toast.error("No se pudieron cargar los productos vendidos.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    const isEmpty = data.length === 0;

    const isPositive = percentChange >= 0;
    const footerText = isPositive
        ? `Aumento de ${percentChange.toFixed(1)}% este mes`
        : `Descenso de ${Math.abs(percentChange).toFixed(1)}% este mes`;
    const FooterIcon = isPositive ? TrendingUp : TrendingDown;
    const iconColor = isPositive ? "text-green-400" : "text-red-400";

    const dynamicChartConfig = data.reduce((acc, item) => {
        acc[item.product] = {
            label: item.product,
            color: item.fill,
        };
        return acc;
    }, {});

    return (
        <>
            {(loading || isEmpty) ? (
                <Card className="bg-[#f0f0f0e7] text-gray-800 w-full p-4">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-4 w-40 bg-neutral-800" />
                        <Skeleton className="h-4 w-60 bg-neutral-800" />
                    </CardHeader>
                    <CardContent className="flex justify-center items-center aspect-square max-h-[250px]">
                        <Skeleton className="h-full w-full rounded-full bg-neutral-800" />
                    </CardContent>
                    <CardFooter className="flex justify-center items-center gap-2 mt-4">
                        <Skeleton className="h-5 w-44 bg-neutral-800 rounded-md" />
                    </CardFooter>
                </Card>
            ) : (
                <Card className="bg-[#f0f0f0e7] text-gray-800 border-3">
                    <CardHeader className="flex flex-col items-start mb-1">
                        <CardTitle className="text-xl font-bold">Productos vendidos</CardTitle>
                        <CardDescription className="text-gray-400">
                            Últimos 30 días
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-0 -mt-4">
                        <ChartContainer
                            config={dynamicChartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart data={data} innerRadius="30%" outerRadius="100%">
                                    <PolarGrid gridType="circle" stroke="#555" />
                                    <RadialBar dataKey="sales" />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel nameKey="product" />}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>

                    <CardFooter className="flex justify-center items-center gap-2 font-medium leading-none text-3 -mt-4">
                        {footerText} <FooterIcon className={`h-4 w-4 ${iconColor}`} />
                    </CardFooter>
                </Card>
            )}
        </>
    );
}
