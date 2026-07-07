import { updateProfile } from "@/app/dashboard/customer/profile/actions";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function CustomerProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Profile</h1>
        <p className="mt-1 text-sm text-text-muted">Manage your personal information.</p>
      </div>
      <ProfileForm
        action={updateProfile}
        defaultFullName={user!.full_name}
        defaultPhone={user!.phone}
        email={user!.email}
      />
    </div>
  );
}
