"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
    Stock: {
        label: "Stock",
        color: "hsl(var(--chart-6))",
    },
};

export function RadarChartStock() {
    const [chartData, setChartData] = useState([]);
    const [percentChange, setPercentChange] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchChartData() {
            try {
                const res = await fetch(
                    "https://run.mocky.io/v3/deb503d6-1651-4bbe-9641-be4aeef69038" //test
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                setChartData(data);

                if (data.length >= 2) {
                    const first = data[0].Stock;
                    const last = data[data.length - 1].Stock;
                    const change = ((last - first) / first) * 100;
                    setPercentChange(change);
                }
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los datos.");
            } finally {
                setLoading(false);
            }
        }

        fetchChartData();
    }, []);

    if (loading) {
        return (
            <Card className="bg-black text-white w-full p-4">
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
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-8 text-red-400">
                {error}
            </div>
        );
    }

    const isPositive = percentChange >= 0;
    const FooterIcon = isPositive ? TrendingDown : TrendingUp;
    const footerText = isPositive
        ? `Aumento de ${percentChange.toFixed(1)}% este mes`
        : `Descenso de ${Math.abs(percentChange).toFixed(1)}% este mes`;
    const iconColor = isPositive ? "text-red-400" : "text-green-400";
    const borderColor = isPositive ? "border-red-200/90" : "border-green-200/90";

    return (
        <Card
            className={`bg-black text-white border-3 ${borderColor}`}
        >
            <CardHeader className="flex flex-col items-start mb-1">
                <CardTitle className="text-xl font-bold">Stock mínimo</CardTitle>
                <CardDescription className="text-sm text-gray-400 mb-2">
                    Stock mínimo en los últimos 6 meses
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 -mt-6">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                            className="text-black"
                        />
                        <PolarGrid
                            className="fill-[--color-Stock] opacity-20"
                            gridType="circle"
                        />
                        <PolarAngleAxis dataKey="month" />
                        <Radar
                            dataKey="Stock"
                            fill="var(--color-Stock)"
                            fillOpacity={1}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex justify-center items-center gap-2 font-medium leading-none text-3 -mt-6">
                {footerText} <FooterIcon className={`h-4 w-4 ${iconColor}`} />
            </CardFooter>
        </Card>
    );
}