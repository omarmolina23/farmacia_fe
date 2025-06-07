import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import ClientLayout from "../../modules/clients/layouts/ClientLayout";
import CategorySection from "../../modules/clients/components/CategorySection";
import MainSection from "../../modules/clients/components/MainSection";

// Atajos configurados vía .env (Vite debe exponer variables con prefijo VITE_)
const CLIENT_SHORTCUT = {
  ctrl: import.meta.env.VITE_EGG_CTRL === 'true',
  alt: import.meta.env.VITE_EGG_ALT === 'true',
  key: (import.meta.env.VITE_EGG_KEY || 'h').toLowerCase()
};
const COOLDOWN_MS = Number(import.meta.env.VITE_EGG_COOLDOWN_MS) || 10000;

const ClientHome = () => {
  useEffect(() => {
    let cooldown = false;

    const handleKeyDown = (e) => {
      if (cooldown) return;
      if (e.ctrlKey === CLIENT_SHORTCUT.ctrl &&
          e.altKey === CLIENT_SHORTCUT.alt &&
          e.key.toLowerCase() === CLIENT_SHORTCUT.key) {
        cooldown = true;
        setTimeout(() => { cooldown = false; }, COOLDOWN_MS);

        const rand = Math.random();
        if (rand < 1/3) showEgg1();
        else if (rand < 2/3) showEgg2();
        else showEgg3();
      }
    };

    // Egg 1: sólo confeti, múltiples ráfagas
    const showEgg1 = () => {
      for (let i = 0; i < 3; i++) {
        confetti({ particleCount: 200, spread: 360, origin: { x: Math.random(), y: Math.random() * 0.6 } });
      }
    };

    // Egg 2: lluvia de emojis por toda la pantalla
    const showEgg2 = () => {
      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        overflow: "hidden", pointerEvents: "none", zIndex: 9999,
      });
      document.body.appendChild(container);

      const emojis = ["💻","🔒","🛡️","💥","🎉","🚀"];
      Array.from({ length: 200 }).forEach(() => {
        const span = document.createElement("span");
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        const size = 20 + Math.random() * 40;
        Object.assign(span.style, {
          position: "absolute",
          top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
          fontSize: `${size}px`, opacity: Math.random() * 0.8 + 0.2,
          transform: `translateY(-100px)`,
          animation: `emojiFall ${3 + Math.random() * 3}s linear forwards`,
        });
        container.appendChild(span);
      });
      setTimeout(() => container.remove(), 6000);
    };

    // Egg 3: pantalla de glitch estático, luego prompt y loading falso
    const showEgg3 = () => {
      const overlay = document.createElement("div");
      Object.assign(overlay.style, {
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%", background: "#000",
        color: "#0f0", fontFamily: "monospace", padding: "20px",
        boxSizing: "border-box", zIndex: 9999, overflowY: "auto",
      });

      // Generar líneas de "código"
      Array.from({ length: 20 }).forEach(() => {
        const line = document.createElement("pre");
        const text = Array.from({ length: 60 })
          .map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase())
          .join(' ');
        line.textContent = text;
        overlay.appendChild(line);
      });

      // Prompt para continuar
      const prompt = document.createElement("div");
      prompt.innerText = "[Pulse ENTER para continuar]";
      Object.assign(prompt.style, { marginTop: "20px", color: "#ff0", fontSize: "1.2rem" });
      overlay.appendChild(prompt);
      document.body.appendChild(overlay);

      const onEnter = (e) => {
        if (e.key === "Enter") {
          window.removeEventListener("keydown", onEnter);
          overlay.remove();
          showLoading();
        }
      };
      window.addEventListener("keydown", onEnter);
    };

    // Loading falso con barra de progreso
    const showLoading = () => {
      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "80%", maxWidth: "400px", background: "#222", padding: "20px",
        borderRadius: "8px", zIndex: 9999,
      });
      const bg = document.createElement("div");
      Object.assign(bg.style, {
        width: "100%", height: "20px", background: "#555", borderRadius: "10px", overflow: "hidden",
      });
      const bar = document.createElement("div");
      Object.assign(bar.style, {
        width: "0%", height: "100%", background: "#0f0", transition: "width 3s linear",
      });
      bg.appendChild(bar);
      container.appendChild(bg);
      document.body.appendChild(container);
      setTimeout(() => { bar.style.width = "100%"; }, 100);
      setTimeout(() => { container.remove(); }, 3200);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ClientLayout title="Client Home">
      <MainSection />
      <CategorySection />
    </ClientLayout>
  );
};

export default ClientHome;
