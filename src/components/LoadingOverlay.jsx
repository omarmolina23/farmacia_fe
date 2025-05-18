import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LoadingOverlay = () => {
    const overlayRef = useRef(null);
    const boxRef = useRef(null);
    const spinnerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Entrada del contenedor
        tl.fromTo(
            overlayRef.current,
            { opacity: 0, scale: 0.9, filter: "blur(8px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }
        );

        // Spinner girando suavemente
        gsap.to(spinnerRef.current, {
            rotate: 360,
            duration: 1.2,
            repeat: -1,
            ease: "power1.inOut",
        });

        // Texto por letra animado
        const chars = textRef.current.querySelectorAll("span");
        gsap.fromTo(
            chars,
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                delay: 0.2,
                duration: 0.4,
                ease: "power2.out",
            }
        );
    }, []);

    const text = "Procesando..";

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
            <div
                ref={boxRef}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center w-[90%] max-w-sm border border-gray-200"
            >
                <div
                    ref={spinnerRef}
                    className="w-16 h-16 border-[5px] border-gray-300 border-t-[#8B83BA] rounded-full mb-6"
                ></div>

                <p
                    ref={textRef}
                    className="text-gray-800 font-semibold text-xl text-center flex flex-wrap justify-center"
                >
                    {text.split("").map((char, idx) => (
                        <span key={idx} className="inline-block">
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
