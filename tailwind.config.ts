import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1760CB",
          "blue-hover": "#134fa8",
          "blue-light": "#EBF3FC",
          green: "#8BCB42",
          "green-hover": "#77b235",
          "green-light": "#F2F9EC",
          charcoal: "#1F2937",
          neutral: "#F8FAFC",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
