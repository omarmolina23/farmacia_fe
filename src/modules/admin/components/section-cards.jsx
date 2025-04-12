import {
  IoMdNotificationsOutline ,
  IoMdTrendingUp,
  IoMdTrendingDown,
} from "react-icons/io";
import { FaRegHeart, FaOpencart, FaCashRegister } from "react-icons/fa";
import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const icons = {
  Clientes: <FaRegHeart className="text-red-400" />,
  Inventario: <FaOpencart className="text-blue-400" />,
  Ventas: <IoMdNotificationsOutline className="text-yellow-400" />,
  Ingresos: <FaCashRegister className="text-green-500" />,
};

const formatCurrency = (num) => {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`;
  return `$${num}`;
};

export function SectionCards() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch("https://run.mocky.io/v3/55dc086e-69f8-4ff1-885b-235a8e234031") // test
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error fetching metrics:", err));
  }, []);

  const isLoading = metrics.length === 0;

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="@container/card bg-black text-white border border-neutral-800"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full bg-neutral-800" />
                  <Skeleton className="h-4 w-20 bg-neutral-800" />
                </div>
                <Skeleton className="h-8 w-28 bg-neutral-800" />
                <Skeleton className="h-5 w-16 bg-neutral-800 rounded" />
              </CardHeader>
            </Card>
          ))
        : metrics.map((metric, index) => {
            const isPositive = metric.change >= 0;
            const isCurrency = metric.title === "Ingresos";
            const displayValue = isCurrency
              ? formatCurrency(metric.value)
              : metric.value;
            return (
              <Card key={index} className="@container/card bg-black text-white">
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <CardDescription className="flex items-center gap-2 text-sm text-black-200">
                      {icons[metric.title] || null}
                      {metric.title}
                    </CardDescription>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 w-full">
                    <CardTitle className="text-3xl font-bold tabular-nums">
                      {displayValue}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "rounded-[6px] px-2 py-0.5 text-xs font-medium border",
                        isPositive
                          ? "bg-green-900/80 text-green-300 border-green-300"
                          : "bg-red-900/80 text-red-300 border-red-300"
                      )}
                      variant="ghost"
                    >
                      {metric.change}%
                      {isPositive ? (
                        <IoMdTrendingUp size={14} className="ml-0.5" />
                      ) : (
                        <IoMdTrendingDown size={14} className="ml-0.5" />
                      )}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
    </div>
  );
}
