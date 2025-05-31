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


        </motion.div>
    );
}
