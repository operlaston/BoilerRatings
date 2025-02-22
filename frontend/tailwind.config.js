module.exports = {
  theme: {
    extend: {
      animation: {
        "star-bounce": "bounce 1s ease-in-out 2",
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
};
