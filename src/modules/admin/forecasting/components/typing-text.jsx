import { useEffect, useState, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { motion } from "framer-motion";

export default function TypingText({ text = "" }) {
    const [displayedText, setDisplayedText] = useState("");
    const containerRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!text || typeof text !== "string") return;

        setDisplayedText("");
        setIsTyping(true);

        let currentIndex = 0;
        let currentText = "";

        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                currentText += text[currentIndex];
                setDisplayedText(currentText);
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [text]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [displayedText]);

    return (
        <motion.div
            className="relative bg-white text-gray-800 rounded-xl border border-gray-200 shadow-md p-4 max-w-2xl w-full h-64 overflow-y-auto font-mono text-sm md:text-base leading-relaxed flex flex-col"
            ref={containerRef}
            initial={{ opacity: 0, y: 0.4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            whileHover={{
                scale: 1.01,
                boxShadow: "0 8px 20px rgba(34,197,94,0.4)",
            }}
        >
            <pre className="whitespace-pre-wrap flex-grow">
                {displayedText}
                <span className="text-[#6AD466] animate-blink">|</span>
            </pre>

            {/* Icono con animación solo mientras escribe */}
            <motion.div
                animate={
                    isTyping
                        ? {
                              scale: [1, 1.3, 1],
                              rotate: [0, 10, -10, 0],
                              color: ["#16a34a", "#4ade80", "#22c55e", "#16a34a"],
                          }
                        : { scale: 1, rotate: 0, color: "#000" }
                }
                transition={{
                    duration: isTyping ? 1.5 : 0.3,
                    repeat: isTyping ? Infinity : 0,
                    ease: "easeInOut",
                }}
                whileHover={{ scale: 1.3, rotate: 15 }}
                className="absolute bottom-3 right-2 cursor-pointer"
            >
                <BsStars size={30} className="opacity-80" />
            </motion.div>
        </motion.div>
    );
}
