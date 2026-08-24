import type { Campaign, Donation } from "@/types/database";

/**
 * Fixtures used when Supabase is not configured, so the site and dashboard are
 * browsable on a fresh clone. Mirrors `supabase/seed.sql` — keep them in step.
 *
 * Dates are hard-coded rather than computed from `Date.now()` so server and
 * client render identically.
 */

export const demoCampaigns: Campaign[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "clean-water-for-kalar-valley",
    title: "Clean Water for Kalar Valley",
    summary:
      "Twelve villages currently walk four hours a day for water. Six solar-powered wells would end that.",
    description: `Families in Kalar Valley lose most of a working day to the walk for water — and what they carry back is rarely safe to drink. Waterborne illness is the leading cause of missed school days in the district.

This campaign funds six solar-powered borewells with community-managed distribution points, plus a two-year maintenance fund and training for a local repair team. Each well serves roughly 400 people.

**Where the money goes**

- 62% — drilling, pumps, and solar arrays
- 21% — distribution network and storage tanks
- 11% — maintenance endowment and spare parts
- 6% — technician training and monitoring`,
    category: "Water & Sanitation",
    cover_image_url: null,
    goal_amount: 85000,
    status: "active",
    featured: true,
    starts_at: "2026-03-01T00:00:00Z",
    ends_at: "2026-12-15T00:00:00Z",
    raised_amount: 61480,
    donation_count: 412,
    donor_count: 388,
    created_at: "2026-02-18T09:12:00Z",
    updated_at: "2026-08-10T14:02:00Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "girls-scholarship-fund",
    title: "Girls' Scholarship Fund",
    summary:
      "Full secondary schooling for 120 girls — tuition, books, uniforms, and transport for three years.",
    description: `Nine out of ten girls in our partner districts finish primary school. Fewer than three finish secondary. The gap is almost entirely cost: fees, uniforms, and the bus fare to the nearest secondary school.

The fund covers the whole package for three years, so a family never has to choose between a daughter's schooling and a month's groceries. Scholars are matched with a mentor and tracked through graduation.`,
    category: "Education",
    cover_image_url: null,
    goal_amount: 120000,
    status: "active",
    featured: true,
    starts_at: "2026-01-10T00:00:00Z",
    ends_at: "2027-01-10T00:00:00Z",
    raised_amount: 94250,
    donation_count: 623,
    donor_count: 540,
    created_at: "2025-12-20T11:00:00Z",
    updated_at: "2026-08-14T08:40:00Z",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "monsoon-emergency-relief",
    title: "Monsoon Emergency Relief",
    summary:
      "Shelter kits, clean water, and thirty days of food for families displaced by this season's flooding.",
    description: `Flooding has displaced an estimated 4,000 families across the lower delta. Our field teams are already on the ground with the district administration.

Each relief kit contains a tarpaulin shelter, bedding, a water filter, hygiene supplies, and a thirty-day dry ration for a family of six. Kits are distributed through village committees so the most affected households are reached first.`,
    category: "Emergency Relief",
    cover_image_url: null,
    goal_amount: 60000,
    status: "active",
    featured: false,
    starts_at: "2026-07-05T00:00:00Z",
    ends_at: "2026-10-05T00:00:00Z",
    raised_amount: 23900,
    donation_count: 198,
    donor_count: 186,
    created_at: "2026-07-04T06:30:00Z",
    updated_at: "2026-08-16T19:15:00Z",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "mobile-health-clinic",
    title: "Mobile Health Clinic",
    summary:
      "One fully equipped van running a weekly circuit through eight villages with no resident doctor.",
    description: `The nearest clinic is a ninety-minute drive from most of the villages on this route, which means routine care simply does not happen — antenatal checks, childhood vaccinations, blood pressure, diabetes.

Funding covers the vehicle, a year of fuel and consumables, and salaries for a doctor, a nurse, and a driver.`,
    category: "Healthcare",
    cover_image_url: null,
    goal_amount: 45000,
    status: "completed",
    featured: false,
    starts_at: "2025-06-01T00:00:00Z",
    ends_at: "2026-02-28T00:00:00Z",
    raised_amount: 45000,
    donation_count: 287,
    donor_count: 265,
    created_at: "2025-05-15T10:00:00Z",
    updated_at: "2026-03-01T09:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    slug: "winter-food-parcels-2026",
    title: "Winter Food Parcels 2026",
    summary:
      "Staple parcels for 1,500 households through the coldest three months of the year.",
    description:
      "Draft campaign — copy and budget still under review with the programs team.",
    category: "Food Security",
    cover_image_url: null,
    goal_amount: 38000,
    status: "draft",
    featured: false,
    starts_at: null,
    ends_at: null,
    raised_amount: 0,
    donation_count: 0,
    donor_count: 0,
    created_at: "2026-08-02T13:20:00Z",
    updated_at: "2026-08-12T16:45:00Z",
  },
];

type DemoDonationSeed = {
  ref: string;
  campaign: string | null;
  name: string;
  email: string;
  amount: number;
  status: Donation["status"];
  frequency: Donation["frequency"];
  anonymous: boolean;
  message: string | null;
  at: string;
};

const seeds: DemoDonationSeed[] = [
  { ref: "HF-8KQ2M1", campaign: "11111111-1111-4111-8111-111111111111", name: "Amara Okafor", email: "amara.okafor@example.com", amount: 250, status: "completed", frequency: "one_time", anonymous: false, message: "For the well at Kalar. Good luck to the team.", at: "2026-08-16T18:22:00Z" },
  { ref: "HF-3VN7P4", campaign: "22222222-2222-4222-8222-222222222222", name: "Daniel Reyes", email: "d.reyes@example.com", amount: 50, status: "completed", frequency: "monthly", anonymous: false, message: null, at: "2026-08-16T14:05:00Z" },
  { ref: "HF-9XT5L8", campaign: "33333333-3333-4333-8333-333333333333", name: "Priya Nandakumar", email: "priya.n@example.com", amount: 500, status: "completed", frequency: "one_time", anonymous: true, message: "In memory of my father.", at: "2026-08-16T09:47:00Z" },
  { ref: "HF-2RW6C3", campaign: "11111111-1111-4111-8111-111111111111", name: "Tom Whitfield", email: "tom.whitfield@example.com", amount: 100, status: "pending", frequency: "one_time", anonymous: false, message: null, at: "2026-08-15T21:10:00Z" },
  { ref: "HF-6BD1J9", campaign: "22222222-2222-4222-8222-222222222222", name: "Lucía Fernández", email: "lucia.f@example.com", amount: 1000, status: "completed", frequency: "one_time", anonymous: false, message: "Keep going. This matters.", at: "2026-08-15T17:33:00Z" },
  { ref: "HF-4HM8Z2", campaign: null, name: "Kwame Mensah", email: "kwame.mensah@example.com", amount: 75, status: "completed", frequency: "monthly", anonymous: false, message: null, at: "2026-08-15T11:58:00Z" },
  { ref: "HF-7PC3K5", campaign: "33333333-3333-4333-8333-333333333333", name: "Sarah Lindqvist", email: "s.lindqvist@example.com", amount: 25, status: "completed", frequency: "one_time", anonymous: false, message: null, at: "2026-08-14T20:15:00Z" },
  { ref: "HF-1JF9Q7", campaign: "11111111-1111-4111-8111-111111111111", name: "Ahmed Farouk", email: "ahmed.farouk@example.com", amount: 300, status: "failed", frequency: "one_time", anonymous: false, message: null, at: "2026-08-14T13:41:00Z" },
  { ref: "HF-5GL4X1", campaign: "22222222-2222-4222-8222-222222222222", name: "Mei Chen", email: "mei.chen@example.com", amount: 150, status: "completed", frequency: "one_time", anonymous: false, message: "For the scholarship fund.", at: "2026-08-13T16:02:00Z" },
  { ref: "HF-8NS2V6", campaign: "44444444-4444-4444-8444-444444444444", name: "Robert Achebe", email: "r.achebe@example.com", amount: 200, status: "completed", frequency: "one_time", anonymous: false, message: null, at: "2026-08-12T10:27:00Z" },
  { ref: "HF-3QY7B8", campaign: "33333333-3333-4333-8333-333333333333", name: "Ines Duarte", email: "ines.duarte@example.com", amount: 60, status: "pending", frequency: "one_time", anonymous: true, message: null, at: "2026-08-11T19:50:00Z" },
  { ref: "HF-9TK1D4", campaign: "22222222-2222-4222-8222-222222222222", name: "Jonas Berg", email: "jonas.berg@example.com", amount: 40, status: "completed", frequency: "monthly", anonymous: false, message: null, at: "2026-08-10T08:14:00Z" },
  { ref: "HF-6VZ5N3", campaign: "11111111-1111-4111-8111-111111111111", name: "Fatima Al-Rashid", email: "fatima.ar@example.com", amount: 425, status: "completed", frequency: "one_time", anonymous: false, message: "Zakat contribution.", at: "2026-08-09T22:38:00Z" },
  { ref: "HF-2WP8H7", campaign: null, name: "Grace Mutiso", email: "grace.mutiso@example.com", amount: 90, status: "refunded", frequency: "one_time", anonymous: false, message: null, at: "2026-08-08T12:09:00Z" },
  { ref: "HF-7CM3R2", campaign: "44444444-4444-4444-8444-444444444444", name: "Oliver Hayes", email: "oliver.hayes@example.com", amount: 120, status: "completed", frequency: "one_time", anonymous: false, message: null, at: "2026-08-07T15:44:00Z" },
  { ref: "HF-4XB6T9", campaign: "22222222-2222-4222-8222-222222222222", name: "Nadia Petrova", email: "nadia.p@example.com", amount: 800, status: "completed", frequency: "one_time", anonymous: false, message: "Please send the annual report.", at: "2026-08-06T09:21:00Z" },
  { ref: "HF-1LD9F5", campaign: "33333333-3333-4333-8333-333333333333", name: "Samuel Boateng", email: "s.boateng@example.com", amount: 35, status: "completed", frequency: "one_time", anonymous: false, message: null, at: "2026-08-05T18:56:00Z" },
  { ref: "HF-8RJ2K6", campaign: "11111111-1111-4111-8111-111111111111", name: "Elena Rossi", email: "elena.rossi@example.com", amount: 175, status: "completed", frequency: "monthly", anonymous: false, message: null, at: "2026-08-04T11:33:00Z" },
];

export const demoDonations: Donation[] = seeds.map((seed, index) => ({
  id: `d0000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  reference: seed.ref,
  campaign_id: seed.campaign,
  donor_name: seed.name,
  donor_email: seed.email,
  donor_phone: null,
  amount: seed.amount,
  currency: "USD",
  frequency: seed.frequency,
  status: seed.status,
  payment_provider: "stub",
  payment_reference: seed.status === "completed" ? `stub_${seed.ref.toLowerCase()}` : null,
  message: seed.message,
  is_anonymous: seed.anonymous,
  created_at: seed.at,
  completed_at: seed.status === "completed" ? seed.at : null,
}));
