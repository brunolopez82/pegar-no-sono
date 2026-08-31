"use client";

import { useState } from "react";
import { subscrever } from "@/lib/subscribe";

export default function FormularioSubscricao({ compacto = false }: { compacto?: boolean }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"parado" | "a-enviar" | "feito" | "erro">("parado");
  const [mensagem, setMensagem] = useState("");

  async function aoSubmeter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setEstado("erro");
      setMensagem("Escreva um email válido.");
      return;
    }
    setEstado("a-enviar");
    const r = await subscrever(email);
    setEstado(r.ok ? "feito" : "erro");
    setMensagem(r.mensagem);
    if (r.ok) setEmail("");
  }

  return (
    <div className={compacto ? "" : "mx-auto max-w-md"}>
      <form onSubmit={aoSubmeter} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email-subscricao" className="sr-only">
          O seu email
        </label>
        <input
          id="email-subscricao"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="o.seu@email.pt"
          className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5 text-[15px]
                     text-texto placeholder:text-texto-fraco transition
                     focus:border-ambar-400/60 focus:bg-white/[0.06]"
        />
        <button
          type="submit"
          disabled={estado === "a-enviar"}
          className="botao-primario shrink-0 disabled:opacity-60"
        >
          {estado === "a-enviar" ? "A enviar…" : "Subscrever"}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-3 min-h-[20px] text-[13.5px] ${
          estado === "feito" ? "text-ambar-300" : estado === "erro" ? "text-texto-suave" : "text-texto-fraco"
        }`}
      >
        {mensagem || "Um email por semana. Sem spam, e sai quando quiser."}
      </p>
    </div>
  );
}
