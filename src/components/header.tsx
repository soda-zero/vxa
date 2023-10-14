import { londrina } from "@/libs/fonts";

export default function Header() {
  return (
    <header
      className={`${londrina.className} font-bold text-6xl sm:text-8xl w-full h-fit text-center max-w-3xl py-4`}
    >
      VEGANO POR ACCIDENTE ARG
    </header>
  );
}
