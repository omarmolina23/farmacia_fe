// src/modules/admin/forecasting/components/AiAssistant.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
    getAiAssistant,
    getForecastProductAll,
    getForecastCategoryAll,
} from "../../../../services/SalesService";
import { ArrowLeft, Wand2, Send } from "lucide-react";

function ModalPortal({ children }) {
    if (typeof document === "undefined") return null;
    return ReactDOM.createPortal(children, document.body);
}

function DotsLoader() {
    return (
        <div className="flex items-center space-x-1">
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    className="h-2 w-2 rounded-full bg-gray-400 inline-block animate-bounce-dot"
                    style={{ animationDelay: `${index * 0.2}s` }}
                />
            ))}
        </div>
    );
}

export default function AiAssistant() {
    const [forecastContext, setForecastContext] = useState({ context: { forecasts: [] } });

    useEffect(() => {
        async function fetchForecasts() {
            try {
                const responseProducts = await getForecastProductAll();
                const responseCategories = await getForecastCategoryAll();
                const mergedForecasts = [
                    ...responseCategories.forecasts,
                    ...responseProducts.forecasts,
                ];
                setForecastContext({ context: { forecasts: mergedForecasts } });
            } catch (err) {
                console.error("Error cargando contexto de productos:", err);
            }
        }
        fetchForecasts();
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // para transición

    const [messages, setMessages] = useState([
        { sender: "ai", text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const MAX_TEXTAREA_HEIGHT = 72;

    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const ampm = hours >= 12 ? "pm" : "am";
            if (hours > 12) hours -= 12;
            if (hours === 0) hours = 12;
            setCurrentTime(`${hours}:${minutes}${ampm}`);
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
        inputRef.current?.focus();
    }, [messages, isLoading]);

    const handleSend = async () => {
        const question = inputValue.trim();
        if (!question) return;

        setMessages((prev) => [...prev, { sender: "user", text: question }]);
        setInputValue("");
        setIsLoading(true);
        setMessages((prev) => [...prev, { sender: "ai", text: "", loading: true }]);

        const restrictions =
            "Responde SOLO a lo que se pregunta y no agregues información adicional. " +
            "No hagas preguntas de seguimiento. Sé preciso y breve.";

        try {
            const aiAnswer = await getAiAssistant({
                ...forecastContext,
                question,
                restrictions,
            });

            setMessages((prev) =>
                prev.map((msg) => (msg.loading ? { sender: "ai", text: aiAnswer } : msg))
            );
        } catch (err) {
            console.error("Error obteniendo respuesta de IA:", err);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.loading
                        ? {
                            sender: "ai",
                            text: "Error al obtener la respuesta de IA. Intenta nuevamente.",
                        }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyUp = (e) => {
        e.stopPropagation();
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSend();
    };

    const openAssistant = () => {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
            setMessages([
                { sender: "ai", text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?" },
            ]);
            setIsLoading(false);
            setInputValue("");
        }, 300); // duración de la animación
    };

    return (
        <>
            {!isOpen && (
                <button
                    type="button"
                    onClick={openAssistant}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center 
            rounded-full bg-white shadow-md animate-pulse transition-transform duration-200 ease-in-out"
                    title="Abrir asistente IA"
                >
                    <Wand2 className="h-8 w-8 text-green-600" />
                </button>
            )}

            {isOpen && (
                <ModalPortal>
                    <div className="fixed inset-0 z-50">
                        {/* Fondo oscuro con fade */}
                        <div
                            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                                }`}
                        />

                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div
                                className={`
                  relative w-full max-w-xl h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col
                  transform transition-all duration-300 ease-in-out
                  ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}
                `}
                            >
                                {/* HEADER */}
                                <div className="flex items-center bg-white px-4 py-3 border-b border-gray-200 rounded-t-2xl">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                                        title="Cerrar asistente IA"
                                    >
                                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                                    </button>
                                    <div className="flex items-center ml-2 space-x-2">
                                        <Wand2  className="h-5 w-5 text-green-600" />
                                        <span className="text-base font-medium text-gray-800">
                                            Asistente AI
                                        </span>
                                    </div>
                                </div>

                                {/* CHAT */}
                                <div className="flex-1 overflow-y-auto px-4 py-3">
                                    <div className="flex justify-center mb-2">
                                        <span className="text-xs text-gray-400">{currentTime}</span>
                                    </div>

                                    <div ref={scrollRef} className="space-y-4">
                                        {messages.map((msg, idx) => {
                                            const isUser = msg.sender === "user";
                                            if (msg.loading) {
                                                return (
                                                    <div key={idx} className="flex justify-start">
                                                        <div className="relative max-w-[70%] rounded-lg p-4 bg-white border border-gray-200 shadow-sm">
                                                            <DotsLoader />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`
                              relative max-w-[70%] rounded-lg p-4 
                              ${isUser ? "bg-gray-100" : "bg-white border border-gray-200"}
                              shadow-sm text-gray-800
                            `}
                                                    >
                                                        <p className="text-sm leading-snug whitespace-pre-wrap">
                                                            {msg.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* INPUT */}
                                <form
                                    onSubmit={handleFormSubmit}
                                    className="border-t border-gray-200 px-4 py-3 rounded-b-2xl"
                                >
                                    <div className="relative">
                                        <textarea
                                            ref={inputRef}
                                            rows={1}
                                            value={inputValue}
                                            onChange={(e) => {
                                                setInputValue(e.target.value);
                                                e.target.style.height = "auto";
                                                const height = Math.min(e.target.scrollHeight, MAX_TEXTAREA_HEIGHT);
                                                e.target.style.height = height + "px";
                                            }}
                                            onKeyUp={handleKeyUp}
                                            placeholder="Escribe tu pregunta..."
                                            maxLength={80}
                                            className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm leading-snug
                        focus:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300
                        overflow-y-auto resize-none
                        placeholder:text-xs placeholder:text-gray-400 placeholder:opacity-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="mt-1 text-right text-xs text-gray-400">
                                        {inputValue.length} / 80
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </>
    );
}
