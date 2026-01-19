/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#0f172a", // Provider usually darker theme
                secondary: "#475569",
                danger: "#dc2626",
                success: "#16a34a",
                background: "#ffffff",
                surface: "#f3f4f6",
            },
        },
    },
    plugins: [],
}
