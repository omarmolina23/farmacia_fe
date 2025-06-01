// src/modules/admin/forecasting/components/AiAssistant.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  getAiAssistant,
  getForecastProductAll,
  getForecastCategoryAll,
} from "../../../../services/SalesService";
import {
  getStockSumary
} from "../../../../services/ProductService";
import { ArrowLeft, Wand2, Send } from "lucide-react";

function ModalPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
}

function DotsLoader() {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

const INITIAL_MESSAGE = {
  sender: "ai",
  text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?",
};

export default function AiAssistant() {
  const [context, setContext] = useState({ forecasts: [] });
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [time, setTime] = useState("");

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const MAX_HEIGHT = 72; // 72px = 4.5rem

  // 1) Traer contexto de pronósticos (productos + categorías)
  useEffect(() => {
    (async () => {
      try {
        const [stock, products, categories] = await Promise.all([
          getStockSumary(),
          getForecastProductAll(),
          getForecastCategoryAll(),
        ]);
        setContext({ forecasts: [...categories.forecasts, ...products.forecasts], stock });
      } catch (error) {
        console.error("Error cargando contexto:", error);
      }
    })();
  }, []);

  // 2) Cuando se abre el chat, guardamos la hora y enfocamos el <textarea>
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours % 12 || 12}:${minutes}${hours >= 12 ? "pm" : "am"}`;
      setTime(formattedTime);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // 3) Cada vez que cambian los mensajes (messages o isLoading), hacemos scroll al fondo
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    inputRef.current?.focus();
  }, [messages, isLoading]);

  // Enviar pregunta al backend de IA
  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    // Agrega el mensaje del usuario
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setIsLoading(true);

    // Coloca “IA escribiendo…” (loading)
    setMessages((prev) => [...prev, { sender: "ai", text: "", loading: true }]);

    try {
      const response = await getAiAssistant({
        context,
        question,
        restrictions: `
    Responde exclusivamente dentro del contexto del negocio: ventas de productos y categorias y sus predicciones proporcionadas en el contexto.
    No respondas preguntas ajenas al negocio, como temas personales, técnicos generales, ni preguntas sobre otros ámbitos.
    El stock mínimo para cada producto es de 20 unidades ESTO para cuando te lo pregunten, y stock en exceso es de 100 unidades. Por si el usuario pregunta. 
    Si el usuario hace una pregunta conceptual relacionada con ventas o predicciones (por ejemplo: ¿qué es una predicción de ventas?), puedes explicarlo brevemente.
    En caso que la pregunta no esté relacionada con el negocio, responde: "Lo siento, no puedo ayudar con eso. ¿Tienes alguna pregunta sobre ventas o pronósticos?"
    Solo sí, el usuario dice Real Madrid en alguna parte del prompt, responde solo con: "¡Hala Madrid!".
    Solo sí, el usuario dice "Barcelona" o algo relacionado sobre ese equipo de fútbol, puedes responder: "15" o "8-2" o "La sexta es inevitable".
    No respondas preguntas sobre otros temas, como deportes, política, religión, etc.
    No respondas preguntas sobre la empresa, como su historia, misión, visión, etc.
    No agregues información adicional no solicitada.
    No hagas preguntas de seguimiento.
    Sé preciso, claro y breve.`,
      });

      // Reemplaza el “loading” con la respuesta real
      setMessages((prev) =>
        prev.map((msg) =>
          msg.loading ? { sender: "ai", text: response } : msg
        )
      );
    } catch (error) {
      console.error("Error IA:", error);
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

  // Capturamos Enter en onKeyDown para evitar salto de línea
  const handleKeyDown = (e) => {
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
      setMessages([INITIAL_MESSAGE]);
      setInput("");
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      {/* Botón flotante para abrir el asistente */}
      {!isOpen && (
        <button
          onClick={openAssistant}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white border-1 border-green-600 shadow-lg hover:scale-105 transition-transform"
          title="Abrir asistente IA"
        >
          <Wand2 className="h-8 w-8 text-green-600" />
        </button>
      )}

      {isOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-50">
            {/* Fondo semitransparente */}
            <div
              className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Contenedor del modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div
                className={`relative w-full max-w-xl h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-2"
                  }`}
              >
                {/* ==================== HEADER ==================== */}
                <div className="flex items-center px-4 py-3 border-b border-gray-200 rounded-t-2xl bg-white">
                  <button
                    onClick={handleClose}
                    className="p-1 rounded hover:bg-gray-100 transition"
                    title="Cerrar"
                  >
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <div className="flex items-center ml-3 space-x-2">
                    <Wand2 className="h-5 w-5 text-green-600" />
                    <span className="text-base font-medium text-gray-800">Asistente AI</span>
                  </div>
                </div>

                {/* ==================== CHAT ==================== */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-3">
                  {/* Hora en la parte superior, centrada */}
                  <div className="flex justify-center mb-2 text-xs text-gray-400">{time}</div>

                  {/* Lista de mensajes */}
                  <div className="space-y-4">
                    {messages.map((msg, idx) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div
                          key={idx}
                          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-4 shadow-sm text-sm whitespace-pre-wrap break-words ${isUser
                              ? "bg-gray-100 text-gray-800"
                              : "bg-white border border-gray-200 text-gray-800"
                              }`}
                          >
                            {msg.loading ? <DotsLoader /> : msg.text}
                          </div>
                        </div>
                      );
                    })}

                    {/* Elemento “fantasma” para hacer scroll al final */}
                    <div ref={bottomRef} />
                  </div>
                </div>

                {/* ==================== INPUT ==================== */}
                <form onSubmit={handleFormSubmit} className="border-t border-gray-200 px-4 py-2 rounded-b-2xl">
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        // Auto-ajustar altura hasta MAX_HEIGHT
                        e.target.style.height = "auto";
                        e.target.style.height =
                          Math.min(e.target.scrollHeight, MAX_HEIGHT) + "px";
                      }}
                      onKeyDown={handleKeyDown}
                      maxLength={80}
                      placeholder="Escribe tu pregunta..."
                      className="
                        w-full 
                        rounded-full 
                        border border-gray-300 
                        px-4 py-2 
                        text-sm 
                        placeholder:text-xs placeholder:text-gray-400 
                        focus:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300 
                        whitespace-pre-wrap break-words 
                        resize-none 
                        overflow-hidden                ← aquí
                      "
                      style={{
                        // Para que nunca aparezca scroll vertical
                        overflowY: "hidden",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="mt-1 text-right text-xs text-gray-400">{input.length} / 80</div>
                </form>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}