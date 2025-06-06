"use client";

import React, { useEffect, useState, useRef } from "react";
import NiceAvatar, { genConfig } from "react-nice-avatar";
import { SlOptions } from "react-icons/sl";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { getRecentSales } from "../../../services/DashboardService";

export function RecentSalesCard() {
    const item_per_page = 6;

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAvatar, setShowAvatar] = useState(true);
    const [showDate, setShowDate] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    
    const didFetch = useRef(false);
    
    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        
        async function fetchSales() {
            setLoading(true);
            try {
                const data = await getRecentSales();
                const sortedData = [...data].sort(
                    (a, b) => new Date(b.fecha) - new Date(a.fecha)
                );
                const last20 = sortedData.slice(0, 200);
                setSales(last20);
            } catch (error) {
                toast.error("No se pudieron cargar las ventas recientes.");
            } finally {
                setLoading(false);
            }
        }
        fetchSales();
    }, []);

    const [avatarConfigs, setAvatarConfigs] = useState([]);
    useEffect(() => {
        if (sales.length > 0) {
            const newConfigs = sales.map(() => genConfig());
            setAvatarConfigs(newConfigs);
        }
    }, [sales]);

    const totalSales = sales.length;
    const totalPages = Math.ceil(totalSales / item_per_page);
    const startIndex = (currentPage - 1) * item_per_page;
    const endIndex = startIndex + item_per_page;
    const currentSales = sales.slice(startIndex, endIndex);

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleToggleAvatar = () => {
        setShowAvatar((prev) => !prev);
    };

    const handleToggleDate = () => {
        setShowDate((prev) => !prev);
    };

    const isEmpty = sales.length === 0;

    return (
        <>
            {(loading || isEmpty) ? (
                <div className="w-full bg-[#f0f0f0e7] text-gray-800 p-4 rounded-md shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-6 w-1/2 bg-neutral-800" />
                        <Skeleton className="h-8 w-8 rounded-full bg-neutral-800" />
                    </div>
                    <Skeleton className="h-4 w-3/4 mb-4 bg-neutral-800" />
                    <ul className="space-y-7">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <li
                                key={idx}
                                className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-md"
                            >
                                {showAvatar && (
                                    <Skeleton className="h-10 w-10 rounded-full bg-neutral-700" />
                                )}
                                <div className="flex-1 ml-4 space-y-2">
                                    <Skeleton className="h-4 w-1/2 bg-neutral-700" />
                                    <Skeleton className="h-3 w-1/3 bg-neutral-700" />
                                </div>
                                {showDate && (
                                    <Skeleton className="h-4 w-12 bg-neutral-700 mr-4" />
                                )}
                                <Skeleton className="h-5 w-14 bg-neutral-700" />
                            </li>
                        ))}
                    </ul>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <Skeleton className="h-8 w-20 bg-neutral-800 rounded-md" />
                            <Skeleton className="h-8 w-20 bg-neutral-800 rounded-md" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full bg-[#f0f0f0e7] text-gray-800 border-3 p-4 rounded-md shadow-md">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xl font-bold">Ventas recientes</h2>
      {/*                   <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="bg-gray-800 p-2 hover:bg-gray-700">
                                    <SlOptions className="text-white" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bbg-[#f0f0f0e7] border-black text-gray-800">
                                <DropdownMenuCheckboxItem
                                    checked={showAvatar}
                                    onCheckedChange={handleToggleAvatar}
                                >
                                    <div className="flex items-center">Avatar</div>
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showDate}
                                    onCheckedChange={handleToggleDate}
                                >
                                    <div className="flex items-center">Hora</div>
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                    </div>

                    <p className="text-sm text-gray-400 mb-2">
                        {totalSales === 1 ? "Última" : "Últimas"} {totalSales}{" "}
                        {totalSales === 1 ? "venta" : "ventas"} realizadas
                    </p>
                    <ul className="space-y-2">
                        {currentSales.length === 0 ? (
                            <li className="text-sm text-gray-300">No hay ventas recientes.</li>
                        ) : (
                            currentSales.map((sale, index) => {
                                const { nombre, correo, monto_total, fecha } = sale;
                                const dateObj = new Date(fecha);
                                const hours = dateObj.getHours().toString().padStart(2, "0");
                                const mins = dateObj.getMinutes().toString().padStart(2, "0");
                                const displayTime = `${hours}:${mins}`;
                                const avatarConfig =
                                    avatarConfigs[startIndex + index] || genConfig();

                                return (
                                    <li
                                        key={`${fecha}-${correo}-${index}`}
                                        className="flex items-center justify-between bg-[#f0f0f0e7] px-2 py-2 rounded"
                                    >
                                        {showAvatar && (
                                            <NiceAvatar
                                                style={{ width: 35, height: 35 }}
                                                {...avatarConfig}
                                            />
                                        )}
                                        <div className="flex-1 ml-2 overflow-hidden">
                                            <p className="truncate font-semibold text-sm">{nombre}</p>
                                            <p className="truncate text-xs text-gray-400">{correo}</p>
                                        </div>
                                        {showDate && (
                                            <p className="text-xs text-gray-300 mr-2">{displayTime}</p>
                                        )}
                                        <p className="text-sm font-medium">+${monto_total}</p>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className="text-black"
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="text-black"
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
