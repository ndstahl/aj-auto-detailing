export type Booking = {
  id: string
  name: string
  email: string
  phone: string
  vehicle: string
  service: string
  date: string
  time: string
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export type Availability = {
  id: string
  day_of_week: number // 0 = Sunday, 6 = Saturday
  start_time: string  // "08:00"
  end_time: string    // "17:00"
  slot_duration_minutes: number
  is_available: boolean
}

export type BlockedDate = {
  id: string
  date: string // "YYYY-MM-DD"
  reason?: string
}

export type GalleryImage = {
  id: string
  storage_path: string
  alt_text?: string
  created_at: string
}

export type QuoteRequest = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  vehicle_year: string
  vehicle_make: string
  vehicle_model: string
  service_requested: string
  notes?: string
  status: 'new' | 'reviewed' | 'quoted'
  created_at: string
}
