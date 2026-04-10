'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// San Fernando, CA coordinates
const CENTER = { lat: 34.2819, lng: -118.4390 }

// Convert miles to meters for Leaflet circles
const MILES_TO_METERS = 1609.34
const RADIUS_20_MILES = 20 * MILES_TO_METERS
const RADIUS_50_MILES = 50 * MILES_TO_METERS

export default function ServiceAreaMap() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{
        width: '100%',
        height: 500,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888'
      }}>
        Loading map...
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: 500,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <MapContainer
        center={[CENTER.lat, CENTER.lng]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 50-mile radius circle (full service area) */}
        <Circle
          center={[CENTER.lat, CENTER.lng]}
          radius={RADIUS_50_MILES}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
          }}
        />

        {/* 20-mile radius circle (no fee zone) */}
        <Circle
          center={[CENTER.lat, CENTER.lng]}
          radius={RADIUS_20_MILES}
          pathOptions={{
            color: '#22c55e',
            fillColor: '#22c55e',
            fillOpacity: 0.15,
            weight: 2,
          }}
        />

        {/* Center marker */}
        <Marker position={[CENTER.lat, CENTER.lng]} icon={icon}>
          <Popup>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", textAlign: 'center' }}>
              <strong>AJ Auto Detailing</strong><br />
              San Fernando, CA
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
