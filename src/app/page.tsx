import Nav from "@/components/nav";
import Search from "@/components/search";
import type { Posts } from "@/types/posts";
import postsData from "../data/posts_data.json";
import Products from "@/components/products";
import Link from "next/link";
import Header from "@/components/header";
import { GithubIcon } from "@/components/ui/icons";

type Props = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Home({ searchParams }: Props) {
  const posts: Posts = postsData as Posts;
  const { search } = searchParams;
  return (
    <div className="w-full h-full mx-auto custom-scrollbar">
      {/* <Nav /> */}
      <main className="h-full w-full max-w-5xl mx-auto p-3 flex items-center justify-between flex-col sm:overflow-y-scroll">
        <Header />

        <div className="w-full sm:px-10">
          <Search />
        </div>

        <div className="sm:px-12 w-full">
          <Products posts={posts} search={search} />
        </div>

        <footer className="p-4">
          <Link
            href="https://github.com/soda-zero"
            target="_blank"
            className="flex gap-2 hover:text-purple-600"
          >
            <div>
              hecho por <strong>soda-zero </strong>
            </div>
            <GithubIcon />
          </Link>
        </footer>
      </main>
    </div>
  );
}
