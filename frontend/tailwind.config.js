/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#60A5FA', // Blue-400
                    DEFAULT: '#2563EB', // Blue-600
                    dark: '#1E40AF', // Blue-800
                },
                surface: {
                    white: '#FFFFFF',
                    gray: '#F3F4F6', // Gray-100
                }
            }
        },
    },
    plugins: [],
}
