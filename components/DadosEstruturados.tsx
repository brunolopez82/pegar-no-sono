/**
 * JSON-LD. Os crawlers de IA leem HTML em bruto — este bloco e' entregue
 * no HTML estatico, sem depender de JavaScript no cliente.
 */
export default function DadosEstruturados({ dados }: { dados: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
