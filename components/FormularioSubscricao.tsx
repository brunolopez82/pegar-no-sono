"use client";

import { useState } from "react";
import { subscrever } from "@/lib/subscribe";

export default function FormularioSubscricao({
  variante = "claro",
  etiqueta,
  textoBotao = "Subscrever",
}: {
  /** "claro" para tiles bg-card, "escuro" para o tile preto. */
  variante?: "claro" | "escuro";
  etiqueta?: string;
  textoBotao?: string;
}) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"parado" | "a-enviar" | "feito" | "erro">("parado");
  const [mensagem, setMensagem] = useState("");

  const escuro = variante === "escuro";

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

  const rotulo =
    estado === "a-enviar" ? "A subscrever…" : estado === "feito" ? "Está inscrito ✓" : textoBotao;

  return (
    <div className={escuro ? "mx-auto max-w-xl" : ""}>
      <form
        onSubmit={aoSubmeter}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        {etiqueta && (
          <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-foreground">
            {etiqueta}
          </span>
        )}

        <label htmlFor={`email-${variante}`} className="sr-only">
          O seu endereço de email
        </label>
        <input
          id={`email-${variante}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (estado === "erro") setEstado("parado");
          }}
          placeholder="O seu endereço de email"
          disabled={estado === "a-enviar" || estado === "feito"}
          className={
            escuro
              ? "w-full flex-1 rounded-full border border-background/20 bg-background/10 px-6 py-4 text-sm text-background transition-all placeholder:text-background/30 focus:border-background/40 focus:outline-none focus:ring-2 focus:ring-background/10 disabled:opacity-50"
              : "campo flex-1"
          }
        />

        <button
          type="submit"
          disabled={estado === "a-enviar" || estado === "feito"}
          className={`botao-gradiente shrink-0 ${escuro ? "px-8 py-4 font-bold" : ""}`}
        >
          {estado === "a-enviar" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          )}
          {rotulo}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-3 min-h-[20px] text-center text-xs sm:text-left ${
          escuro ? "text-background/40" : "text-muted-foreground"
        }`}
      >
        {mensagem || "Sem spam. Sai quando quiser, num clique."}
      </p>
    </div>
  );
}
