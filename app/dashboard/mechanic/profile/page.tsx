import { updateProfile } from "@/app/dashboard/customer/profile/actions";
import { MechanicDetailsForm } from "@/components/dashboard/mechanic/details-form";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function MechanicProfilePage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: mechanicProfile } = await supabase
    .from("mechanic_profiles")
    .select("bio, years_experience, van_description")
    .eq("profile_id", user!.id)
    .single();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Profile</h1>
        <p className="mt-1 text-sm text-text-muted">
          This is what customers see when you&apos;re dispatched to their job.
        </p>
      </div>
      <ProfileForm
        action={updateProfile}
        defaultFullName={user!.full_name}
        defaultPhone={user!.phone}
        email={user!.email}
      />
      <MechanicDetailsForm
        defaultBio={mechanicProfile?.bio ?? null}
        defaultYears={mechanicProfile?.years_experience ?? null}
        defaultVan={mechanicProfile?.van_description ?? null}
      />
    </div>
  );
}
