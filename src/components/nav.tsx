import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-[999] bg-zinc-50 h-16 w-full">
      <div className="flex justify-between max-w-4xl w-full items-center h-full mx-auto">
        <Link href="/" className="px-5">
          <Image
            src={"/vxa.webp"}
            alt="conejo logo de veganoporaccidente.arg"
            width={150}
            height={150}
            className="w-12 h-12"
          />
        </Link>
      </div>
      <div className="w-full border-b-2 border-black squiggle"></div>
    </nav>
  );
}
