"use client";
import { IoMdTrendingUp, IoMdTrendingDown, IoMdCash, IoIosArchive } from "react-icons/io";
import { FaRegHeart, FaOpencart } from "react-icons/fa";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { cn } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { getDailyStatus } from "../../../services/DashboardService";

const icons = {
  Clientes: <FaRegHeart className="text-red-400" />,
  Inventario: <IoIosArchive className="text-blue-400" />,
  Ventas: <FaOpencart className="text-yellow-400" />,
  Ingresos: <IoMdCash className="text-green-500" />,
};

const formatCurrency = (num) => {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`;
  return `$${num}`;
};

export function SectionCards() {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchMetrics = async () => {
      try {
        const data = await getDailyStatus();
        console.log("Data received:", data);
        setMetrics(data);
      } catch (error) {
        toast.error("No se pudieron cargar las métricas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const isEmpty = metrics.length === 0;

  return (
    <>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {(isLoading || isEmpty) ? (
          Array.from({ length: 4 }).map((_, index) => (
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
        ) : (
          metrics.map((metric, index) => {
            const isPositive = metric.change >= 0;
            const FooterIcon = isPositive ? IoMdTrendingUp : IoMdTrendingDown;
            const iconColor = isPositive ? "text-green-400" : "text-red-400";
            const borderColor = isPositive ? "border-green-200/90" : "border-red-200/90";
            const isCurrency = metric.title === "Ingresos";
            const displayValue = isCurrency
              ? formatCurrency(metric.value)
              : metric.value;
            return (
              <Card key={index} className={`@container/card bg-black text-white border-3 ${borderColor}`}>
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <CardDescription className="text-xl font-bold flex items-center gap-2 text-black-200">
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
                      <FooterIcon size={14} className={`ml-0.5${iconColor}`} />
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
    </>
  )
};