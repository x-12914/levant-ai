/** @type {import('tailwindcss').Config} */
// Colors are CSS variables (OKLCH) defined in src/index.css so the dark/light
// theme can swap at runtime via [data-theme]. See DESIGN.md for the spec.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        sidebar: "var(--sidebar)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        faint: "var(--text-faint)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        pos: "var(--pos)",
        neg: "var(--neg)",
        warn: "var(--warn)",
        info: "var(--info)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        ctl: "10px",
      },
      boxShadow: {
        float: "0 16px 48px -12px oklch(0.05 0.02 265 / 0.6)",
        rail: "0 0 0 1px var(--border)",
      },
      transitionTimingFunction: {
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "toast-in": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "toast-in": "toast-in 220ms cubic-bezier(0.22,1,0.36,1)",
        "fade-in": "fade-in 180ms cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};
