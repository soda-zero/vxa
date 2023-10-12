"use client";
import { posts } from "@/types/mock_data";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const router = useRouter();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newSearchQuery = event.target.value;

    const newURL = newSearchQuery ? `?search=${newSearchQuery}` : "/";

    router.push(newURL, { scroll: false });
  }

  const filteredPosts = searchQuery
    ? posts.filter((post) =>
        post.captions.some((caption) =>
          caption.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : posts;

  return (
    <section className="w-full flex flex-col gap-4">
      <input
        type="text"
        placeholder="buscar..."
        className="p-2 w-full border-2 rounded"
        onChange={handleChange}
      />
      <div className="grid grid-cols-5 gap-4">
        {filteredPosts.map((post) => {
          const date = new Date(Number(post.created_at) * 1000);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;
          return (
            <figure
              className="rounded w-full h-full max-w-[250px] shadow-[5px_5px_0px_0px_rgba(16,185,19,0.5)] hover:scale-105 transition-all bg-zinc-900"
              key={post.id}
            >
              <Link
                href={`https://www.instagram.com/p/${post.shortcode}/?img_index=1`}
                target="_blank"
              >
                <Image
                  src={post.img_src}
                  width={post.dimensions.width}
                  height={post.dimensions.height}
                  alt={`Imagen de: ${post.title}`}
                />
                <figcaption className="bg-zinc-900 p-2 text-white">
                  <header className="text-xs">{formattedDate}</header>
                  {post.title}
                </figcaption>
              </Link>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
