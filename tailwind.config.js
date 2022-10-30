module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "media",
    theme: {
        extend: {
            inset: {
                "1/2": "50%",
            },
            colors: {
                // bulgarian-rose
                accent: "#501408",
                // warhammer underworlds logo red
                accent2: "#920104",
                // frontend-masters red
                accent3: {
                    100: "#F27263",
                    300: "#D94D43",
                    400: "#CC423B",
                    500: "#c02d28",
                    700: "#A61712",
                    900: "#8C0601",
                },
                "objective-gold": "#D38E36",
                swirl: "#d0cec2",
            },
            minWidth: {
                "3/4": "75%",
            },
            width: {
                em: "1em",
            },
            height: {
                em: "1em",
            },
            flex: {
                "1/2": "0 1 50%",
                "1/3": "0 1 33%",
            },
            gridTemplateColumns: {
                "1fr/auto/1fr": "1fr auto 1fr",
                "a/fr/a": "auto 1fr auto",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
};
