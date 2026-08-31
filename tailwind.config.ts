import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        noite: {
          900: "#080B14", // fundo mais profundo
          800: "#0B1020", // fundo base
          700: "#121829", // superficie / cartoes
          600: "#1A2136", // superficie elevada
        },
        // Luz ambar: a unica cor de luz que nao atrapalha o sono. E a cor da marca.
        ambar: {
          300: "#F2D6A2",
          400: "#E7B96B",
          500: "#D9A24E",
          600: "#B8853A",
        },
        texto: {
          DEFAULT: "#E9EAEF",
          suave: "#B4BBCB",
          fraco: "#7E869B",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // Tailwind so' inclui 0,5,10,20,25... nos modificadores de opacidade.
      // Estes tres passos intermedios sao usados nas bordas subtis do tema escuro.
      opacity: {
        8: "0.08",
        12: "0.12",
        16: "0.16",
      },
      maxWidth: {
        leitura: "42rem",
        conteudo: "72rem",
      },
      keyframes: {
        subir: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        respirar: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.06)" },
        },
      },
      animation: {
        subir: "subir 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        respirar: "respirar 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
