import { type Config } from "tailwindcss";

const colors = {
  candlelight: {
    DEFAULT: "#FACC15",
    50: "#FEF3C9",
    100: "#FDEFB5",
    200: "#FDE68D",
    300: "#FCDD65",
    400: "#FBD53D",
    500: "#FACC15",
    600: "#D2A904",
    700: "#9B7D03",
    800: "#655102",
    900: "#2E2501",
    950: "#120F00",
  },
  froly: {
    DEFAULT: "#F87171",
    50: "#FFFFFF",
    100: "#FFFFFF",
    200: "#FEE6E6",
    300: "#FCBFBF",
    400: "#FA9898",
    500: "#F87171",
    600: "#F53C3C",
    700: "#ED0C0C",
    800: "#B80909",
    900: "#820606",
    950: "#670505",
  },
  "gray-chateau": {
    DEFAULT: "#A9AEB4",
    50: "#F5F6F7",
    100: "#EAECED",
    200: "#D5D7DA",
    300: "#BFC3C7",
    400: "#A9AEB4",
    500: "#8B929A",
    600: "#6E767E",
    700: "#545A61",
    800: "#3A3E43",
    900: "#202225",
    950: "#131416",
  },
  heliotrope: {
    DEFAULT: "#A78BFA",
    50: "#FFFFFF",
    100: "#FFFFFF",
    200: "#E2D9FD",
    300: "#C5B2FC",
    400: "#A78BFA",
    500: "#7E55F8",
    600: "#551FF5",
    700: "#3C09D4",
    800: "#2D079E",
    900: "#1E0468",
    950: "#16034D",
  },
  malibu: {
    DEFAULT: "#60A5FA",
    50: "#FFFFFF",
    100: "#FEFFFF",
    200: "#D7E8FE",
    300: "#AFD2FC",
    400: "#88BBFB",
    500: "#60A5FA",
    600: "#2A86F8",
    700: "#0769E3",
    800: "#0550AC",
    900: "#043776",
    950: "#032A5B",
  },
  "magenta-/-fuchsia": {
    DEFAULT: "#FF00FF",
    50: "#FFB8FF",
    100: "#FFA3FF",
    200: "#FF7AFF",
    300: "#FF52FF",
    400: "#FF29FF",
    500: "#FF00FF",
    600: "#C700C7",
    700: "#8F008F",
    800: "#570057",
    900: "#1F001F",
    950: "#030003",
  },
  "neon-carrot": {
    DEFAULT: "#FB923C",
    50: "#FFF7F0",
    100: "#FEEBDC",
    200: "#FDD5B4",
    300: "#FDBF8C",
    400: "#FCA864",
    500: "#FB923C",
    600: "#FA7305",
    700: "#C35A04",
    800: "#8C4103",
    900: "#552702",
    950: "#391A01",
  },
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
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  safelist: [
    // these are dynamically assigned to kv value types
    "bg-blue-200",
    "bg-gray-200",
    "bg-green-200",
    "bg-indigo-200",
    "bg-orange-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-red-200",
    "bg-yellow-200",
    "text-blue-800",
    "text-gray-800",
    "text-green-800",
    "text-indigo-800",
    "text-orange-800",
    "text-pink-800",
    "text-purple-800",
    "text-red-800",
    "text-yellow-800",
    "dark:bg-blue-900",
    "dark:bg-gray-900",
    "dark:bg-green-900",
    "dark:bg-indigo-900",
    "dark:bg-orange-900",
    "dark:bg-pink-900",
    "dark:bg-purple-900",
    "dark:bg-red-900",
    "dark:bg-yellow-900",
    "dark:text-blue-300",
    "dark:text-gray-300",
    "dark:text-green-300",
    "dark:text-indigo-300",
    "dark:text-orange-300",
    "dark:text-pink-300",
    "dark:text-purple-300",
    "dark:text-red-300",
    "dark:text-yellow-300",
    // these are dynamically assigned to some icons
    "w-6",
    "w-7",
    "w-10",
    "w-12",
    "h-6",
    "h-7",
    "h-10",
    "h-12",
    // these are dynamically assigned to some tree objects
    "ml-4",
    "ml-8",
    "ml-12",
    "ml-16",
    "ml-20",
    "ml-24",
    "ml-28",
    "ml-32",
    "ml-36",
    "ml-40",
    "ml-44",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.shamrock,
        blue: colors.malibu,
        red: colors.froly,
        orange: colors["neon-carrot"],
        yellow: colors.candlelight,
        green: colors.shamrock,
        purple: colors.heliotrope,
        magenta: colors["magenta-/-fuchsia"],
        gray: colors["gray-chateau"],
      },
      spacing: {
        "108": "27rem",
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
} satisfies Config;
