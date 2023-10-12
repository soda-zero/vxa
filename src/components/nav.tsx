export default function Nav() {
  return (
    <nav className="sticky top-0 bg-zinc-50">
      <div className="max-w-5xl mx-auto px-3 py-3 flex items-center justify-between h-16">
        <a href="/" className="font-bold text-xl hover:text-emerald-500">
          VEGANO POR ACCIDENTE ARG.
        </a>
        <a href="/search" className="hover:text-emerald-500"></a>
      </div>
      <div className="w-full border-b-2 border-black squiggle"></div>
    </nav>
  );
}

