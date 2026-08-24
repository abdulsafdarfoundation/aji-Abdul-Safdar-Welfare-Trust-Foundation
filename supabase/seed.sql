-- ============================================================================
-- Sample content. Mirrors src/lib/data/demo.ts so a connected project looks the
-- same as demo mode. Safe to re-run — every insert is idempotent by slug/ref.
--
-- Run AFTER 0001_init.sql.
-- ============================================================================

insert into public.campaigns
  (id, slug, title, summary, description, category, goal_amount, status, featured, starts_at, ends_at)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'clean-water-for-kalar-valley',
    'Clean Water for Kalar Valley',
    'Twelve villages currently walk four hours a day for water. Six solar-powered wells would end that.',
    E'Families in Kalar Valley lose most of a working day to the walk for water — and what they carry back is rarely safe to drink. Waterborne illness is the leading cause of missed school days in the district.\n\nThis campaign funds six solar-powered borewells with community-managed distribution points, plus a two-year maintenance fund and training for a local repair team. Each well serves roughly 400 people.\n\n**Where the money goes**\n\n- 62% — drilling, pumps, and solar arrays\n- 21% — distribution network and storage tanks\n- 11% — maintenance endowment and spare parts\n- 6% — technician training and monitoring',
    'Water & Sanitation',
    85000, 'active', true,
    '2026-03-01T00:00:00Z', '2026-12-15T00:00:00Z'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'girls-scholarship-fund',
    'Girls'' Scholarship Fund',
    'Full secondary schooling for 120 girls — tuition, books, uniforms, and transport for three years.',
    E'Nine out of ten girls in our partner districts finish primary school. Fewer than three finish secondary. The gap is almost entirely cost: fees, uniforms, and the bus fare to the nearest secondary school.\n\nThe fund covers the whole package for three years, so a family never has to choose between a daughter''s schooling and a month''s groceries. Scholars are matched with a mentor and tracked through graduation.',
    'Education',
    120000, 'active', true,
    '2026-01-10T00:00:00Z', '2027-01-10T00:00:00Z'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'monsoon-emergency-relief',
    'Monsoon Emergency Relief',
    'Shelter kits, clean water, and thirty days of food for families displaced by this season''s flooding.',
    E'Flooding has displaced an estimated 4,000 families across the lower delta. Our field teams are already on the ground with the district administration.\n\nEach relief kit contains a tarpaulin shelter, bedding, a water filter, hygiene supplies, and a thirty-day dry ration for a family of six. Kits are distributed through village committees so the most affected households are reached first.',
    'Emergency Relief',
    60000, 'active', false,
    '2026-07-05T00:00:00Z', '2026-10-05T00:00:00Z'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'mobile-health-clinic',
    'Mobile Health Clinic',
    'One fully equipped van running a weekly circuit through eight villages with no resident doctor.',
    E'The nearest clinic is a ninety-minute drive from most of the villages on this route, which means routine care simply does not happen — antenatal checks, childhood vaccinations, blood pressure, diabetes.\n\nFunding covers the vehicle, a year of fuel and consumables, and salaries for a doctor, a nurse, and a driver.',
    'Healthcare',
    45000, 'completed', false,
    '2025-06-01T00:00:00Z', '2026-02-28T00:00:00Z'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'winter-food-parcels-2026',
    'Winter Food Parcels 2026',
    'Staple parcels for 1,500 households through the coldest three months of the year.',
    'Draft campaign — copy and budget still under review with the programs team.',
    'Food Security',
    38000, 'draft', false,
    null, null
  )
on conflict (slug) do nothing;

insert into public.donations
  (reference, campaign_id, donor_name, donor_email, amount, frequency, status, message, is_anonymous, created_at)
values
  ('HF-8KQ2M1', '11111111-1111-4111-8111-111111111111', 'Amara Okafor',     'amara.okafor@example.com', 250,  'one_time', 'completed', 'For the well at Kalar. Good luck to the team.', false, '2026-08-16T18:22:00Z'),
  ('HF-3VN7P4', '22222222-2222-4222-8222-222222222222', 'Daniel Reyes',     'd.reyes@example.com',       50,  'monthly',  'completed', null, false, '2026-08-16T14:05:00Z'),
  ('HF-9XT5L8', '33333333-3333-4333-8333-333333333333', 'Priya Nandakumar', 'priya.n@example.com',      500,  'one_time', 'completed', 'In memory of my father.', true,  '2026-08-16T09:47:00Z'),
  ('HF-2RW6C3', '11111111-1111-4111-8111-111111111111', 'Tom Whitfield',    'tom.whitfield@example.com',100,  'one_time', 'pending',   null, false, '2026-08-15T21:10:00Z'),
  ('HF-6BD1J9', '22222222-2222-4222-8222-222222222222', 'Lucía Fernández',  'lucia.f@example.com',     1000,  'one_time', 'completed', 'Keep going. This matters.', false, '2026-08-15T17:33:00Z'),
  ('HF-4HM8Z2', null,                                   'Kwame Mensah',     'kwame.mensah@example.com',  75,  'monthly',  'completed', null, false, '2026-08-15T11:58:00Z'),
  ('HF-7PC3K5', '33333333-3333-4333-8333-333333333333', 'Sarah Lindqvist',  's.lindqvist@example.com',   25,  'one_time', 'completed', null, false, '2026-08-14T20:15:00Z'),
  ('HF-1JF9Q7', '11111111-1111-4111-8111-111111111111', 'Ahmed Farouk',     'ahmed.farouk@example.com', 300,  'one_time', 'failed',    null, false, '2026-08-14T13:41:00Z'),
  ('HF-5GL4X1', '22222222-2222-4222-8222-222222222222', 'Mei Chen',         'mei.chen@example.com',     150,  'one_time', 'completed', 'For the scholarship fund.', false, '2026-08-13T16:02:00Z'),
  ('HF-8NS2V6', '44444444-4444-4444-8444-444444444444', 'Robert Achebe',    'r.achebe@example.com',     200,  'one_time', 'completed', null, false, '2026-08-12T10:27:00Z'),
  ('HF-3QY7B8', '33333333-3333-4333-8333-333333333333', 'Ines Duarte',      'ines.duarte@example.com',   60,  'one_time', 'pending',   null, true,  '2026-08-11T19:50:00Z'),
  ('HF-9TK1D4', '22222222-2222-4222-8222-222222222222', 'Jonas Berg',       'jonas.berg@example.com',    40,  'monthly',  'completed', null, false, '2026-08-10T08:14:00Z'),
  ('HF-6VZ5N3', '11111111-1111-4111-8111-111111111111', 'Fatima Al-Rashid', 'fatima.ar@example.com',    425,  'one_time', 'completed', 'Zakat contribution.', false, '2026-08-09T22:38:00Z'),
  ('HF-2WP8H7', null,                                   'Grace Mutiso',     'grace.mutiso@example.com',  90,  'one_time', 'refunded',  null, false, '2026-08-08T12:09:00Z'),
  ('HF-7CM3R2', '44444444-4444-4444-8444-444444444444', 'Oliver Hayes',     'oliver.hayes@example.com', 120,  'one_time', 'completed', null, false, '2026-08-07T15:44:00Z'),
  ('HF-4XB6T9', '22222222-2222-4222-8222-222222222222', 'Nadia Petrova',    'nadia.p@example.com',      800,  'one_time', 'completed', 'Please send the annual report.', false, '2026-08-06T09:21:00Z'),
  ('HF-1LD9F5', '33333333-3333-4333-8333-333333333333', 'Samuel Boateng',   's.boateng@example.com',     35,  'one_time', 'completed', null, false, '2026-08-05T18:56:00Z'),
  ('HF-8RJ2K6', '11111111-1111-4111-8111-111111111111', 'Elena Rossi',      'elena.rossi@example.com',  175,  'monthly',  'completed', null, false, '2026-08-04T11:33:00Z')
on conflict (reference) do nothing;

-- The trigger on `donations` keeps these current, but recount explicitly in case
-- rows were loaded with the trigger disabled.
select public.recount_campaign(id) from public.campaigns;
