import { FileText } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCmsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">CMS</h1>
        <p className="mt-1 text-sm text-text-muted">Manage blog posts and marketing content.</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4">
              <p className="text-sm font-medium text-text">{p.title}</p>
              <span className="text-xs text-text-faint">
                {p.published_at ? "Published" : "Draft"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No posts in the database yet"
          body="Blog content currently ships as static pages (lib/data/blog.ts). Move it into blog_posts here once the CMS editor ships."
        />
      )}
    </div>
  );
}
