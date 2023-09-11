import { type Options } from "$fresh/plugins/twind.ts";

const colors = {
  shamrock: {
    DEFAULT: "#4ADE80",
    50: "#E5FAED",
    100: "#D4F7E1",
    200: "#B2F1C9",
    300: "#8FEBB0",
    400: "#6DE498",
    500: "#4ADE80",
    600: "#25CB62",
    700: "#1C9B4B",
    800: "#146C34",
    900: "#0B3D1D",
    950: "#072512",
  },
};

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      colors: {
        primary: colors.shamrock,
      },
    },
    fontFamily: {
      body: [
        "Nanum Gothic",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Nanum Gothic",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      mono: [
        "Fira Code",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
  },
  preflight: {
    "@import":
      "url('https://fonts.googleapis.com/css2?family=Fira+Code&family=Nanum+Gothic&display=swap')",
  },
} as Options;
