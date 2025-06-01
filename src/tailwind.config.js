
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
            animation: {
                marquee: 'marquee 5s linear infinite',
            },
        },
    },
    plugins: [],
};
