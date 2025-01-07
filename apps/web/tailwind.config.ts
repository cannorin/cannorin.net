import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{html,js,svelte,ts,md}"],

  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Zen Kaku Gothic New", ...fontFamily.sans],
        display: ["Poiret One"],
      },
      animation: {
        blink: "blink 0.6s ease both",
        "fade-in": "fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both",
      },
      keyframes: {
        blink: {
          "0%,50%,to": {
            opacity: "1",
          },
          "25%,75%": {
            opacity: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--foreground))",
            "--tw-prose-headings": "rgb(var(--foreground))",
            "--tw-prose-lead": "rgb(var(--accent))",
            "--tw-prose-links": "rgb(var(--primary))",
            "--tw-prose-bold": "rgb(var(--foreground))",
            "--tw-prose-counters": "rgb(var(--primary))",
            "--tw-prose-bullets": "rgb(var(--primary))",
            "--tw-prose-hr": "rgb(var(--muted-foreground))",
            "--tw-prose-quotes": "rgb(var(--muted-foreground))",
            "--tw-prose-quote-borders": "rgb(var(--muted-foreground))",
            "--tw-prose-captions": "rgb(var(--muted))",
            "--tw-prose-code": "rgb(var(--foreground))",
            "--tw-prose-pre-code": "rgb(var(--muted))",
            "--tw-prose-pre-bg": "rgb(var(--muted))",
            "--tw-prose-th-borders": "transparent",
            "--tw-prose-td-borders": "rgb(var(--primary))",
          },
        },
      }),
    },
  },

  plugins: [typography],
} satisfies Config;
