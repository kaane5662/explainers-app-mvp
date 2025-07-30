/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './app/**/*.{js,tsx,ts,jsx}','./components/**/*.{js,tsx,ts,jsx}'
  ],
  safelist: [
    {
      pattern: /-purple4/,
    },
    {
      pattern: /-orange/,
    },
    {
      pattern: /-red2/,
    },
    {
      pattern: /-indigo-600/,
    },
    {
      pattern: /-fuchsia/,
    },
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FCFCFC",
        primaryDark: "#574A7B",
        secondary: "#2F2F2F",
        purple: "#AB9FF2",
        green: "#079455",
        orange: "#FFA500",
        white: "#FFFFFF",
        white2: "#F5F2FF",
        red2: "#EB6661",
        purple2: "#A79BEB",
        purple3: "#E3DDF5",
        purple4: "#978FFE",
        blue: "#6387FF",
        blue2: "#2956BD",
        yellow: "#FFD13F",
        yellow2: "#eeb500",
        lightBeige: "#FFF5DD",
        lightpurple: "#EFECF9",
        realwhite: "#FFFFFF",
        dark: "#18181b",
        dark2: "#27272a",
        fuchsia: "#9b1482",
        'red-700':"#D92D20"
      },
      aspectRatio: true, // enable aspectRatio plugin
      animation: {
        stripes: "stripes 10s linear infinite",
        "shake-small": "shake-small 0.5s ease-in-out infinite",
        jiggle: "jiggle 0.5s ease-in-out infinite",
        "jiggle-slow": "jiggle 1s ease-in-out infinite",
        "draw-svg-line": "draw-svg-line 1s ease-in-out",
        flameMain: "flameMain 1s ease-in-out infinite",
        flameInner: "flameInner 1s ease-in-out infinite",
        pulse2: "pulse2 1s ease-in-out infinite",
        dotLoading: "dotLoading 1.5s ease-in-out infinite",
        slideLeft: "slideLeft 0.5s forwards",
        slideRight: "slideRight 0.5s forwards",
      },
      keyframes: {
        ["shake-small"]: {
          "0%": {
            rotate: "-5deg",
          },
          "50%": {
            rotate: "5deg",
          },
        },
        stripes: {
          "0%": {
            backgroundPosition: "0 0",
          },
          "100%": {
            backgroundPosition: "100% 0",
          },
        },
        jiggle: {
          "0%, 100%": { transform: "rotate(-3deg) scale(1.1)" },
          "50%": { transform: "rotate(3deg) scale(1.1)" },
        },
        "draw-svg-line": {
          "0%": {
            clipPath: "inset(0 100% 0 0)",
          },
          "100%": {
            clipPath: "inset(0 0% 0 0)",
          },
        },
        flameMain: {
          "50%": {
            filter: "brightness(1.2)",
          },
        },
        flameInner: {
          "50%": {
            filter: "brightness(1.3)",
          },
        },
        pulse2: {
          "50%": {
            transform: "scale(1.05)",
          },
        },
        dotLoading: {
          "50%": {
            opacity: 0,
          },
        },
        slideLeft: {
          "0%": {
            transform: "translateX(100%) rotateY(180deg)",
          },
          "100%": {
            transform: "translateX(0) rotateY(0deg)",
          },
        },
        slideRight: {
          "0%": {
            transform: "translateX(-100%) rotateY(-180deg)",
          },
          "100%": {
            transform: "translateX(0) rotateY(0deg)",
          },
        },
      },
    },
  },
  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
};
