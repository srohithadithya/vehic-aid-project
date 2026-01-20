/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: '#09090b', // zinc-950 (Dark mode default)
                foreground: '#f8fafc', // zinc-50
                primary: {
                    DEFAULT: '#14b8a6', // teal-500
                    foreground: '#020617', // zinc-950
                },
                secondary: {
                    DEFAULT: '#fbbf24', // amber-400
                    foreground: '#020617', // zinc-950
                },
                muted: {
                    DEFAULT: '#1e293b', // slate-800
                    foreground: '#94a3b8', // slate-400
                },
                accent: {
                    DEFAULT: '#111827', // gray-900
                    foreground: '#14b8a6', // teal-500
                },
                destructive: {
                    DEFAULT: '#7f1d1d', // red-900
                    foreground: '#f8fafc', // zinc-50
                },
                border: '#1e293b', // slate-800
                input: '#1e293b', // slate-800
                ring: '#14b8a6', // teal-500
            },
        },
    },
    plugins: [],
}
