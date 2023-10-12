import SearchInput from "@/components/search-input";
import Squiggly from "@/components/squiggly";
import { Londrina_Solid } from "next/font/google";

const londrina = Londrina_Solid({
  weight: "900",
  subsets: ["latin"],
  preload: true,
  adjustFontFallback: true,
});
export default function Home() {
  return (
    <main className="min-h-screen max-w-5xl mx-auto px-3 py-3 flex items-center justify-between h-16 flex-col">
      <header
        className={`${londrina.className} font-bold text-7xl w-full h-fit`}
      >
        VEGANO POR ACCIDENTE ARG
      </header>
      <SearchInput />
      <Squiggly />
    </main>
  );
}
