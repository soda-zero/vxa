import { Posts } from "@/types/posts";
import Image from "next/image";
import Link from "next/link";

export default function Products({
  posts,
  search,
}: {
  posts: Posts;
  search: any;
}) {
  const sortedByDateArray = posts.sort((a, b) => b.created_at - a.created_at);
  const newest5Posts = sortedByDateArray.slice(0, 5);

  const filteredPosts = search
    ? sortedByDateArray.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      )
    : newest5Posts;
  const showLast5Message = filteredPosts === newest5Posts;

  return (
    <section className="w-full flex flex-col gap-4">
      {showLast5Message && (
        <header className="text-center pt-4">
          Últimos cinco productos agregados...
        </header>
      )}
      <div className="flex gap-4 flex-col p-4">
        {filteredPosts.map((post) => {
          const date = new Date(Number(post.created_at) * 1000);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;
          if (!post.ignore) {
            return (
              <figure
                className="rounded hover:scale-[1.01] transition-all group/product"
                key={post.id}
              >
                <Link
                  href={`https://www.instagram.com/p/${post.shortcode}/?img_index=1`}
                  target="_blank"
                  className="flex gap-2"
                >
                  <Image
                    src={post.img_src}
                    width={post.dimensions.width}
                    height={post.dimensions.height}
                    alt={`Imagen de: ${post.title}`}
                    className="w-[150px] aspect-[3/4] h-auto shadow-[5px_5px_0px_0px_rgba(16,185,19,0.5)] rounded object-cover"
                  />
                  <figcaption className="bg-inherit p-2">
                    <header className=" h-full w-full text-xl  group-hover/product:text-emerald-500">
                      {post.title}
                    </header>
                    <footer className="text-xs text-zinc-700">
                      {formattedDate}
                    </footer>
                  </figcaption>
                </Link>
                <div className="w-full border-b-2 pt-4 group-hover/product:border-emerald-500 border-black squiggle"></div>
              </figure>
            );
          }
        })}
      </div>
    </section>
  );
}