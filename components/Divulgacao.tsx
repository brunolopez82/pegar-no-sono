/**
 * Divulgacao de afiliacao.
 *
 * Aparece ANTES do corpo, nao no rodape. Uma divulgacao que so' se le depois
 * de a pessoa ja' ter clicado nao e' divulgacao — e' um alibi. Quem chega ao
 * artigo tem de saber que ha' comissao antes de ler a recomendacao.
 *
 * Nao e' opcional nem decorativo: o build falha se um artigo tiver uma ligacao
 * de afiliado sem `afiliacao: true` no frontmatter. Ver lib/artigos.ts.
 */
export default function Divulgacao() {
  return (
    <aside
      className="border-y border-black/10 bg-muted px-6 py-5 lg:px-14"
      aria-label="Divulgação de afiliação"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Este artigo tem ligações de afiliado.</strong>{" "}
        Se comprar através delas, o site recebe uma comissão sem custo acrescido para si. Não
        altera o que aqui está escrito: nada é recomendado por ter comissão, e quando a evidência
        de um produto é fraca isso fica dito na mesma. Se preferir, procure o produto directamente —
        serve-lhe igual.
      </p>
    </aside>
  );
}
