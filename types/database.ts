/**
 * Hand-written subset of the Supabase schema (supabase/migrations/0001_init.sql).
 * Once a live project exists, replace this with the generated types:
 *   supabase gen types typescript --project-id <id> > types/database.ts
 */

export type UserRole = "customer" | "mechanic" | "admin" | "support_agent" | "finance";
export type MechanicApprovalStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_more_info"
  | "suspended";
export type MechanicAvailability = "offline" | "online" | "busy";
export type JobStatus =
  | "draft"
  | "pending_payment"
  | "searching"
  | "scheduled"
  | "accepted"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";
export type SchedulingType = "asap" | "scheduled";
export type PriceType = "fixed" | "estimate" | "quote_only";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      customer_profiles: {
        Row: {
          profile_id: string;
          stripe_customer_id: string | null;
          default_address_id: string | null;
          referral_code: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["customer_profiles"]["Row"]> & {
          profile_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["customer_profiles"]["Row"]>;
      };
      mechanic_profiles: {
        Row: {
          profile_id: string;
          bio: string | null;
          years_experience: number | null;
          van_description: string | null;
          stripe_connect_account_id: string | null;
          stripe_payouts_enabled: boolean;
          approval_status: MechanicApprovalStatus;
          approval_reason: string | null;
          approved_by: string | null;
          approved_at: string | null;
          availability: MechanicAvailability;
          service_radius_miles: number;
          current_heading: number | null;
          location_updated_at: string | null;
          rating_avg: number;
          rating_count: number;
          jobs_completed: number;
          member_since: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["mechanic_profiles"]["Row"]> & {
          profile_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["mechanic_profiles"]["Row"]>;
      };
      vehicles: {
        Row: {
          id: string;
          customer_id: string;
          year: number;
          make: string;
          model: string;
          vin: string | null;
          mileage: number | null;
          engine: string | null;
          license_plate: string | null;
          color: string | null;
          transmission: string | null;
          fuel_type: string | null;
          nickname: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["vehicles"]["Row"]> & {
          customer_id: string;
          year: number;
          make: string;
          model: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Row"]>;
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string | null;
          label: string | null;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["addresses"]["Row"]> & {
          line1: string;
          city: string;
          state: string;
          postal_code: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Row"]>;
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["service_categories"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["service_categories"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          base_price: number | null;
          price_type: PriceType;
          duration_minutes: number | null;
          is_active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & {
          category_id: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      jobs: {
        Row: {
          id: string;
          customer_id: string;
          mechanic_id: string | null;
          vehicle_id: string;
          address_id: string;
          status: JobStatus;
          scheduling_type: SchedulingType;
          scheduled_at: string | null;
          subtotal: number;
          platform_fee: number;
          total: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          cancellation_reason: string | null;
          cancellation_fee: number | null;
          created_at: string;
          accepted_at: string | null;
          arrived_at: string | null;
          started_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["jobs"]["Row"]> & {
          customer_id: string;
          vehicle_id: string;
          address_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          job_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          visible_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          job_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Record<string, unknown>;
          read_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          profile_id: string;
          type: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
    };
  };
}
