import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MechanicReviewActions } from "@/components/dashboard/admin/mechanic-review-actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMechanicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: mechanic } = await supabase
    .from("mechanic_profiles")
    .select(
      "profile_id, bio, years_experience, van_description, approval_status, approval_reason, service_radius_miles, profiles!inner(full_name, email, phone)"
    )
    .eq("profile_id", id)
    .single();

  if (!mechanic) notFound();

  const { data: documents } = await supabase
    .from("mechanic_documents")
    .select("id, doc_type, label, status, created_at")
    .eq("mechanic_id", id);

  const profile = mechanic.profiles as unknown as { full_name: string; email: string; phone: string | null };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-text">{profile.full_name}</h1>
            <Badge variant="primary" className="capitalize">
              {mechanic.approval_status.replace("_", " ")}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-text-muted">{profile.email}</p>
          {profile.phone && <p className="text-sm text-text-muted">{profile.phone}</p>}

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/8 pt-4 text-sm">
            <div>
              <p className="text-text-faint">Years experience</p>
              <p className="text-text">{mechanic.years_experience ?? "—"}</p>
            </div>
            <div>
              <p className="text-text-faint">Service radius</p>
              <p className="text-text">{mechanic.service_radius_miles} mi</p>
            </div>
            <div>
              <p className="text-text-faint">Service vehicle</p>
              <p className="text-text">{mechanic.van_description ?? "—"}</p>
            </div>
          </div>
          {mechanic.bio && (
            <p className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-text-muted">
              {mechanic.bio}
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-text">Documents</h2>
          {documents && documents.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-text-faint" />
                    <div>
                      <p className="text-sm text-text capitalize">{doc.doc_type.replace("_", " ")}</p>
                      {doc.label && <p className="text-xs text-text-faint">{doc.label}</p>}
                    </div>
                  </div>
                  <Badge variant={doc.status === "approved" ? "success" : "default"} className="capitalize">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-faint">No documents uploaded yet.</p>
          )}
        </Card>
      </div>

      <Card className="h-fit p-6">
        <h2 className="font-semibold text-text">Review decision</h2>
        <p className="mt-1 text-sm text-text-muted">
          Every decision is written to the audit log automatically.
        </p>
        <div className="mt-4">
          <MechanicReviewActions mechanicId={mechanic.profile_id} />
        </div>
      </Card>
    </div>
  );
}
