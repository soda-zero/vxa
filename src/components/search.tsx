"use client";

import useDebounce from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react";
import { SearchIcon, Spinner } from "./ui/icons";

export default function Search() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    const newURL = newSearchQuery ? `?search=${newSearchQuery}` : "/";
    startTransition(() => router.push(newURL, { scroll: false }));
  }, 300);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
        {!isPending ? <SearchIcon /> : <Spinner />}
      </div>
      <input
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
        onChange={handleChange}
        placeholder="Buscar..."
      />
    </div>
  );
}
