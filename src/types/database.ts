/**
 * Hand-written mirror of `supabase/migrations/0001_init.sql`.
 *
 * Once your Supabase project is linked, regenerate with:
 *   npm run db:types
 */

export type CampaignStatus = "draft" | "active" | "completed" | "archived";
export type DonationStatus = "pending" | "completed" | "failed" | "refunded";
export type DonationFrequency = "one_time" | "monthly";
export type UserRole = "admin" | "editor" | "viewer";

/**
 * These are `type` aliases rather than `interface`s on purpose: supabase-js
 * constrains every row to `Record<string, unknown>`, and TypeScript only gives
 * implicit index signatures to type aliases. An interface here silently
 * collapses every query result to `never`.
 */
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
};

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  goal_amount: number;
  status: CampaignStatus;
  featured: boolean;
  starts_at: string | null;
  ends_at: string | null;
  /** Rollups of *completed* donations, maintained by a DB trigger. Read-only. */
  raised_amount: number;
  donation_count: number;
  donor_count: number;
  created_at: string;
  updated_at: string;
};

export type Donation = {
  id: string;
  reference: string;
  campaign_id: string | null;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  amount: number;
  currency: string;
  frequency: DonationFrequency;
  status: DonationStatus;
  payment_provider: string;
  payment_reference: string | null;
  message: string | null;
  is_anonymous: boolean;
  created_at: string;
  completed_at: string | null;
};

/** A donation row with the campaign title resolved for table display. */
export type DonationWithCampaign = Donation & {
  campaign_title: string | null;
};

/**
 * Shape matters here: supabase-js only produces typed results when the schema
 * carries all five keys (Tables/Views/Functions/Enums/CompositeTypes) and every
 * table declares `Relationships`. Miss one and every query silently degrades to
 * `never`. `npm run db:types` regenerates this file once the project is linked.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "email">;
        Update: Partial<Profile>;
        Relationships: [];
      };
      campaigns: {
        Row: Campaign;
        // Only slug and title have no default in the schema.
        Insert: Partial<Campaign> & Pick<Campaign, "slug" | "title">;
        Update: Partial<Campaign>;
        Relationships: [];
      };
      donations: {
        Row: Donation;
        Insert: Partial<Donation> &
          Pick<Donation, "reference" | "donor_name" | "donor_email" | "amount">;
        Update: Partial<Donation>;
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      donation_totals: {
        Args: Record<never, never>;
        Returns: {
          total_raised: number;
          donation_count: number;
          donor_count: number;
          pending_count: number;
          monthly_recurring: number;
        }[];
      };
    };
    Enums: {
      campaign_status: CampaignStatus;
      donation_status: DonationStatus;
      donation_frequency: DonationFrequency;
      user_role: UserRole;
    };
    CompositeTypes: Record<never, never>;
  };
};
