-- ============================================================
-- AJ Auto Detailing — Supabase Schema
-- Run this in your Supabase SQL editor: Dashboard → SQL Editor
-- ============================================================

-- BOOKINGS
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  vehicle text not null,
  service text not null,
  date date not null,
  time text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);
-- Unique index prevents double-booking
create unique index if not exists bookings_date_time_idx on bookings (date, time) where status != 'cancelled';

-- AVAILABILITY (AJ's weekly schedule)
create table if not exists availability (
  id uuid default gen_random_uuid() primary key,
  day_of_week int not null unique check (day_of_week between 0 and 6),
  start_time text not null default '08:00',
  end_time text not null default '17:00',
  slot_duration_minutes int not null default 120,
  is_available boolean not null default true
);
-- Seed default schedule: Mon–Sat, 8am–5pm, 2hr slots
insert into availability (day_of_week, start_time, end_time, slot_duration_minutes, is_available)
values
  (0, '08:00', '17:00', 120, false),  -- Sunday: closed
  (1, '08:00', '17:00', 120, true),   -- Monday
  (2, '08:00', '17:00', 120, true),   -- Tuesday
  (3, '08:00', '17:00', 120, true),   -- Wednesday
  (4, '08:00', '17:00', 120, true),   -- Thursday
  (5, '08:00', '17:00', 120, true),   -- Friday
  (6, '09:00', '15:00', 120, true)    -- Saturday
on conflict (day_of_week) do nothing;

-- BLOCKED DATES (one-off closures)
create table if not exists blocked_dates (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  reason text,
  created_at timestamptz default now()
);

-- GALLERY IMAGES
create table if not exists gallery_images (
  id uuid default gen_random_uuid() primary key,
  storage_path text not null unique,
  alt_text text,
  category text not null default 'gallery' check (category in ('gallery', 'carousel')),
  created_at timestamptz default now()
);
-- If you already ran the schema, add the column with:
-- alter table gallery_images add column if not exists category text not null default 'gallery' check (category in ('gallery', 'carousel'));

-- QUOTE REQUESTS
create table if not exists quote_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  vehicle_year text not null,
  vehicle_make text not null,
  vehicle_model text not null,
  service_requested text not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'quoted')),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Bookings: anyone can insert, only authenticated can read/update
alter table bookings enable row level security;
create policy "Anyone can create a booking" on bookings for insert with check (true);
create policy "Authenticated can read bookings" on bookings for select using (auth.role() = 'authenticated');
create policy "Authenticated can update bookings" on bookings for update using (auth.role() = 'authenticated');

-- Availability: public read (needed for calendar), authenticated write
alter table availability enable row level security;
create policy "Public can read availability" on availability for select using (true);
create policy "Authenticated can update availability" on availability for update using (auth.role() = 'authenticated');
create policy "Authenticated can insert availability" on availability for insert with check (auth.role() = 'authenticated');

-- Blocked dates: public read, authenticated write
alter table blocked_dates enable row level security;
create policy "Public can read blocked dates" on blocked_dates for select using (true);
create policy "Authenticated can manage blocked dates" on blocked_dates for all using (auth.role() = 'authenticated');

-- Gallery: public read, authenticated write
alter table gallery_images enable row level security;
create policy "Public can read gallery" on gallery_images for select using (true);
create policy "Authenticated can manage gallery" on gallery_images for all using (auth.role() = 'authenticated');

-- Quote requests: anyone can insert, only authenticated can read
alter table quote_requests enable row level security;
create policy "Anyone can submit a quote" on quote_requests for insert with check (true);
create policy "Authenticated can read quotes" on quote_requests for select using (auth.role() = 'authenticated');
create policy "Authenticated can update quotes" on quote_requests for update using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- Create this manually in Supabase Dashboard → Storage:
--   Bucket name: gallery
--   Public: true
-- Or run:
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
-- ============================================================
