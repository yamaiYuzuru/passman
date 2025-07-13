module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        catppuccin: {
          base: "#1e1e2e",
          surface0: "#313244",
          text: "#cdd6f4",
          overlay0: "#6c7086",
          lavender: "#b4befe",
          rosewater: "#f5e0dc",
          flamingo: "#f2cdcd",
        },
      },
    },
  },
  plugins: [],
};
