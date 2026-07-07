import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/marketing/reveal";
import { BLOG_POSTS, getPostBySlug } from "@/lib/data/blog";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <Link href="/blog" className="text-sm font-medium text-text-muted hover:text-text">
          ← All posts
        </Link>
        <div className="mt-4 flex items-center gap-3 text-xs text-text-faint">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
            {post.category}
          </span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <h1 className="text-balance mt-4 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-10 flex flex-col gap-5">
          {post.content.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </article>
  );
}
