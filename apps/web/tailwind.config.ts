import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1b2852",
          charcoal: "#1a1a1a",
          orange: "#FF983B",
          teal: "#20B2AA",
          green: "#00A184",
          success: "#229954",
          info: "#1877F2",
          error: "#DC2626",
          gray: {
            50: "#F9FAFB",
            100: "#F4F4F5",
            200: "#E9E9E9",
            300: "#E5E5E5",
            400: "#E4E4E7",
            500: "#9CA3AF",
            600: "#71717A",
            700: "#4B5563",
          },
        },
      },
      fontFamily: {
        madefor: ["var(--font-madefor)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 40px -20px rgba(27, 40, 82, 0.25)",
      },
      maxWidth: {
        content: "960px",
      },
    },
  },
  plugins: [],
};

export default config;

