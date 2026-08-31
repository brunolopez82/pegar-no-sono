"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revelacao ao scroll (fade + subida + desfoque), igual ao movimento do template.
 * Usa IntersectionObserver em vez de uma biblioteca de animacao: ~1 kB em vez de ~50 kB.
 * As criancas sao renderizadas no servidor, por isso o texto continua no HTML estatico.
 */
export default function Revelar({
  children,
  atraso = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Atraso em segundos, para escalonar elementos de uma lista. */
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // Sem suporte ou com movimento reduzido: mostrar de imediato.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisivel(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${visivel ? "visivel" : ""} ${className}`}
      style={atraso ? { animationDelay: `${atraso}s` } : undefined}
    >
      {children}
    </div>
  );
}
