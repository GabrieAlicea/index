/**
 * Hand-written mirror of supabase/migrations/0001_init.sql + 0002_rls_and_functions.sql.
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
export type DocType = "drivers_license" | "insurance" | "certification" | "w9";
export type DocStatus = "pending" | "approved" | "rejected";
export type OfferStatus = "sent" | "accepted" | "declined" | "expired";
export type PhotoType = "before" | "after";
export type PaymentStatus =
  | "requires_capture"
  | "captured"
  | "refunded"
  | "partially_refunded"
  | "failed";
export type DisputeStatus =
  | "open"
  | "investigating"
  | "resolved_customer"
  | "resolved_mechanic"
  | "resolved_split";

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        },
        { id: string; full_name: string; email: string; role?: UserRole; phone?: string | null }
      >;
      customer_profiles: Table<
        {
          profile_id: string;
          stripe_customer_id: string | null;
          default_address_id: string | null;
          referral_code: string | null;
          created_at: string;
        },
        { profile_id: string; stripe_customer_id?: string | null; default_address_id?: string | null }
      >;
      mechanic_profiles: Table<
        {
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
        },
        { profile_id: string } & Partial<{
          bio: string | null;
          years_experience: number | null;
          van_description: string | null;
          availability: MechanicAvailability;
          service_radius_miles: number;
        }>
      >;
      mechanic_documents: Table<
        {
          id: string;
          mechanic_id: string;
          doc_type: DocType;
          label: string | null;
          file_path: string;
          status: DocStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        },
        { mechanic_id: string; doc_type: DocType; file_path: string; label?: string | null }
      >;
      vehicles: Table<
        {
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
        },
        {
          customer_id: string;
          year: number;
          make: string;
          model: string;
          vin?: string | null;
          mileage?: number | null;
          engine?: string | null;
          license_plate?: string | null;
          color?: string | null;
          transmission?: string | null;
          fuel_type?: string | null;
          nickname?: string | null;
        }
      >;
      addresses: Table<
        {
          id: string;
          customer_id: string | null;
          label: string | null;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          location: unknown;
          lat: number | null;
          lng: number | null;
          is_default: boolean;
          created_at: string;
        },
        {
          customer_id?: string | null;
          label?: string | null;
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          location: string;
          lat?: number | null;
          lng?: number | null;
          is_default?: boolean;
        }
      >;
      service_categories: Table<
        {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          sort_order: number;
        },
        { name: string; slug: string; icon?: string | null; description?: string | null; sort_order?: number }
      >;
      services: Table<
        {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          base_price: number | null;
          price_type: PriceType;
          duration_minutes: number | null;
          is_active: boolean;
        },
        {
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          base_price?: number | null;
          price_type?: PriceType;
          duration_minutes?: number | null;
          is_active?: boolean;
        }
      >;
      mechanic_services: Table<
        { mechanic_id: string; service_id: string; custom_price: number | null },
        { mechanic_id: string; service_id: string; custom_price?: number | null }
      >;
      jobs: Table<
        {
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
          cancelled_by: string | null;
          cancellation_reason: string | null;
          cancellation_fee: number | null;
          created_at: string;
          accepted_at: string | null;
          arrived_at: string | null;
          started_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
        },
        {
          customer_id: string;
          vehicle_id: string;
          address_id: string;
          status?: JobStatus;
          scheduling_type?: SchedulingType;
          scheduled_at?: string | null;
          subtotal?: number;
          platform_fee?: number;
          total?: number;
        }
      >;
      job_services: Table<
        { job_id: string; service_id: string; price: number; quantity: number },
        { job_id: string; service_id: string; price: number; quantity?: number }
      >;
      job_status_history: Table<
        { id: string; job_id: string; status: JobStatus; changed_by: string | null; changed_at: string },
        { job_id: string; status: JobStatus; changed_by?: string | null }
      >;
      job_dispatch_offers: Table<
        {
          id: string;
          job_id: string;
          mechanic_id: string;
          wave: number;
          distance_miles: number | null;
          status: OfferStatus;
          sent_at: string;
          responded_at: string | null;
        },
        { job_id: string; mechanic_id: string; wave: number; distance_miles?: number | null }
      >;
      job_location_pings: Table<
        {
          id: number;
          job_id: string;
          mechanic_id: string;
          heading: number | null;
          speed: number | null;
          recorded_at: string;
        },
        { job_id: string; mechanic_id: string; heading?: number | null; speed?: number | null }
      >;
      job_photos: Table<
        {
          id: string;
          job_id: string;
          type: PhotoType;
          file_path: string;
          uploaded_by: string | null;
          created_at: string;
        },
        { job_id: string; type: PhotoType; file_path: string; uploaded_by?: string | null }
      >;
      messages: Table<
        {
          id: string;
          job_id: string;
          sender_id: string;
          recipient_id: string;
          body: string;
          read_at: string | null;
          created_at: string;
        },
        { job_id: string; sender_id: string; recipient_id: string; body: string }
      >;
      payments: Table<
        {
          id: string;
          job_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          platform_fee_amount: number;
          mechanic_payout_amount: number;
          status: PaymentStatus;
          captured_at: string | null;
          refunded_at: string | null;
          created_at: string;
        },
        {
          job_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          platform_fee_amount: number;
          mechanic_payout_amount: number;
          status?: PaymentStatus;
        }
      >;
      payouts: Table<
        {
          id: string;
          mechanic_id: string;
          stripe_transfer_id: string | null;
          amount: number;
          period_start: string | null;
          period_end: string | null;
          status: string;
          created_at: string;
        },
        { mechanic_id: string; amount: number; stripe_transfer_id?: string | null; status?: string }
      >;
      reviews: Table<
        {
          id: string;
          job_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          visible_at: string | null;
          created_at: string;
        },
        { job_id: string; reviewer_id: string; reviewee_id: string; rating: number; comment?: string | null }
      >;
      favorite_mechanics: Table<
        { customer_id: string; mechanic_id: string; created_at: string },
        { customer_id: string; mechanic_id: string }
      >;
      notifications: Table<
        {
          id: string;
          profile_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Record<string, unknown>;
          read_at: string | null;
          created_at: string;
        },
        { profile_id: string; type: string; title: string; body?: string | null; data?: Record<string, unknown> }
      >;
      disputes: Table<
        {
          id: string;
          job_id: string;
          raised_by: string;
          reason: string;
          status: DisputeStatus;
          resolution: string | null;
          refund_amount: number | null;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        },
        { job_id: string; raised_by: string; reason: string; status?: DisputeStatus }
      >;
      coupons: Table<
        {
          id: string;
          code: string;
          discount_type: "percent" | "fixed";
          discount_value: number;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
          active: boolean;
          created_at: string;
        },
        {
          code: string;
          discount_type: "percent" | "fixed";
          discount_value: number;
          max_uses?: number | null;
          expires_at?: string | null;
          active?: boolean;
        }
      >;
      support_tickets: Table<
        {
          id: string;
          profile_id: string;
          subject: string;
          status: string;
          priority: string;
          assigned_to: string | null;
          created_at: string;
        },
        { profile_id: string; subject: string; status?: string; priority?: string }
      >;
      support_ticket_messages: Table<
        { id: string; ticket_id: string; sender_id: string; body: string; created_at: string },
        { ticket_id: string; sender_id: string; body: string }
      >;
      admin_audit_log: Table<
        {
          id: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        },
        { admin_id: string; action: string; entity_type: string; entity_id?: string | null; metadata?: Record<string, unknown> }
      >;
      blog_posts: Table<
        {
          id: string;
          slug: string;
          title: string;
          content: string;
          author_id: string | null;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
        },
        { slug: string; title: string; content: string; author_id?: string | null; published_at?: string | null }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      accept_job: {
        Args: { p_job_id: string };
        Returns: Database["public"]["Tables"]["jobs"]["Row"];
      };
      cancel_job: {
        Args: { p_job_id: string; p_reason: string };
        Returns: Database["public"]["Tables"]["jobs"]["Row"];
      };
      approve_mechanic: {
        Args: { p_mechanic_id: string; p_decision: MechanicApprovalStatus; p_reason?: string | null };
        Returns: Database["public"]["Tables"]["mechanic_profiles"]["Row"];
      };
    };
  };
}
