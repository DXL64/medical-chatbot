/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  daisyui: {
    themes: ["light", "dark", "winter"],
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar"), require("tailwindcss-animate")],
  variants: {
    scrollbar: ["rounded"],
  },
};
