// Ponto unico de ligacao da lista de emails.
//
// Enquanto NEXT_PUBLIC_ENDPOINT_SUBSCRICAO nao estiver definido, o formulario nao envia
// nada para lado nenhum e diz isso ao visitante. Nao ha contadores de subscritores nem
// prova social inventada em lado nenhum deste site.
//
// Para ligar (Kit, Buttondown, Supabase, o que for), defina em .env.local:
//   NEXT_PUBLIC_ENDPOINT_SUBSCRICAO=https://.../subscribe
// e ajuste o corpo do pedido abaixo ao formato que o servico espera.

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT_SUBSCRICAO;

export const listaAtiva = Boolean(ENDPOINT);

export type Resultado = { ok: boolean; mensagem: string };

export async function subscrever(email: string): Promise<Resultado> {
  if (!ENDPOINT) {
    return {
      ok: false,
      mensagem: "A lista ainda não está aberta. Volte dentro de dias.",
    };
  }

  try {
    const resposta = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!resposta.ok) throw new Error(String(resposta.status));

    return { ok: true, mensagem: "Está inscrito. Verifique o email para confirmar." };
  } catch {
    return {
      ok: false,
      mensagem: "Não foi possível inscrever agora. Tente outra vez daqui a pouco.",
    };
  }
}
