"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface GPXPoint {
  lat: string
  lon: string
  ele: string
  hr: string
  time: string
}

interface BoundingBox {
  min_lat: string
  max_lat: string
  min_lon: string
  max_lon: string
}

interface GPXMapProps {
  points: GPXPoint[]
  boundingBox: BoundingBox
}

export default function GPXMap({ points, boundingBox }: GPXMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || points.length === 0) return

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Calculate center from bounding box
    const centerLat = (parseFloat(boundingBox.min_lat) + parseFloat(boundingBox.max_lat)) / 2
    const centerLon = (parseFloat(boundingBox.min_lon) + parseFloat(boundingBox.max_lon)) / 2

    // Create map
    const map = L.map(mapRef.current, {
      center: [centerLat, centerLon],
      zoom: 13,
      zoomControl: true,
    })

    mapInstanceRef.current = map

    // Add OpenStreetMap tiles with outdoor/terrain style
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data: &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      maxZoom: 17,
    }).addTo(map)

    // Create coordinates array for polyline
    const coordinates: L.LatLngExpression[] = points.map(point => [
      parseFloat(point.lat),
      parseFloat(point.lon),
    ])

    // Add the trail polyline
    const trail = L.polyline(coordinates, {
      color: "#22c55e",
      weight: 4,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map)

    // Add start marker
    if (coordinates.length > 0) {
      const startIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const endIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker(coordinates[0], { icon: startIcon })
        .addTo(map)
        .bindPopup("Start")

      L.marker(coordinates[coordinates.length - 1], { icon: endIcon })
        .addTo(map)
        .bindPopup("End")
    }

    // Fit map to trail bounds with padding
    map.fitBounds(trail.getBounds(), { padding: [30, 30] })

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [points, boundingBox])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: "400px" }}
    />
  )
}
