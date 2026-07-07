import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { BLOG_POSTS } from "@/lib/data/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on mobile auto repair, mechanic trust & safety, and what to expect from on-demand car care.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Notes from the road" />
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col divide-y divide-white/8">
          {BLOG_POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-2 py-8">
                <div className="flex items-center gap-3 text-xs text-text-faint">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    {post.category}
                  </span>
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span>{post.readMinutes} min read</span>
                </div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-text transition-colors group-hover:text-primary">
                  {post.title}
                  <ArrowUpRight className="size-4 text-text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </h2>
                <p className="text-sm leading-relaxed text-text-muted">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
