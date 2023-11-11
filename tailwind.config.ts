import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {fontFamily: {
      mono: ['Mono Lisa', ...defaultTheme.fontFamily.mono],
    },},
  },
  plugins: [],
} satisfies Config;
