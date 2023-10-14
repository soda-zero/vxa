import { Inter, Londrina_Solid } from "next/font/google";

export const londrina = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  preload: true,
  adjustFontFallback: true,
});

export const inter = Inter({ subsets: ["latin"] });
