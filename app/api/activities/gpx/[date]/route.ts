import { NextResponse } from "next/server"

// Generate mock GPX points along a trail
function generateMockGPXPoints(date: string) {
  // Base coordinates for different dates (simulating different trail sections)
  const baseCoordinates: Record<string, { lat: number; lon: number }> = {
    "2025-04-15": { lat: 32.5891, lon: -116.4679 }, // Southern terminus area
    "2025-04-16": { lat: 32.6523, lon: -116.4234 },
    "2025-04-17": { lat: 32.7189, lon: -116.3891 },
    "2025-04-18": { lat: 32.7189, lon: -116.3891 }, // Zero day
    "2025-04-19": { lat: 32.7856, lon: -116.3512 },
    "2025-04-20": { lat: 32.8534, lon: -116.3156 },
    "2025-04-21": { lat: 32.9212, lon: -116.2789 },
    "2025-04-22": { lat: 32.9891, lon: -116.2423 },
    "2025-04-23": { lat: 33.0567, lon: -116.2056 },
    "2025-04-24": { lat: 33.1245, lon: -116.1689 },
    "2025-04-25": { lat: 33.1923, lon: -116.1323 },
    "2025-04-26": { lat: 33.1923, lon: -116.1323 }, // Zero day
    "2025-04-27": { lat: 33.2601, lon: -116.0956 },
    "2025-04-28": { lat: 33.3278, lon: -116.0589 },
    "2025-04-29": { lat: 33.3956, lon: -116.0223 },
  }

  const base = baseCoordinates[date] || { lat: 32.5891, lon: -116.4679 }
  const points = []
  const numPoints = 150 // Number of GPS points for the day

  // Generate a trail-like path with some variation
  let currentLat = base.lat
  let currentLon = base.lon
  let currentEle = 1500 + Math.random() * 1000 // Starting elevation in feet
  let currentHR = 90 + Math.floor(Math.random() * 20) // Starting heart rate

  const startTime = new Date(`${date}T06:30:00.000Z`)

  for (let i = 0; i < numPoints; i++) {
    // Add some randomness to simulate real GPS data
    const latVariation = (Math.random() - 0.4) * 0.002 // Slight northward bias
    const lonVariation = (Math.random() - 0.5) * 0.001

    currentLat += latVariation
    currentLon += lonVariation

    // Elevation changes (simulate climbing and descending)
    const eleChange = (Math.sin(i / 10) * 50 + (Math.random() - 0.5) * 30)
    currentEle = Math.max(500, Math.min(8000, currentEle + eleChange))

    // Heart rate varies with elevation gain and time
    const hrBase = 100 + Math.abs(eleChange) * 0.5
    const hrVariation = (Math.random() - 0.5) * 20
    currentHR = Math.max(70, Math.min(175, hrBase + hrVariation))

    // Time increments (average about 3-4 minutes between points)
    const timeIncrement = (180 + Math.random() * 120) * 1000 // milliseconds
    const pointTime = new Date(startTime.getTime() + i * timeIncrement)

    points.push({
      lat: currentLat.toFixed(6),
      lon: currentLon.toFixed(6),
      ele: currentEle.toFixed(2),
      hr: Math.round(currentHR).toString(),
      time: pointTime.toISOString(),
    })
  }

  // Calculate bounding box
  const lats = points.map(p => parseFloat(p.lat))
  const lons = points.map(p => parseFloat(p.lon))

  return {
    points,
    bounding_box: {
      min_lat: Math.min(...lats).toFixed(6),
      max_lat: Math.max(...lats).toFixed(6),
      min_lon: Math.min(...lons).toFixed(6),
      max_lon: Math.max(...lons).toFixed(6),
    },
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD" },
      { status: 400 }
    )
  }

  const gpxData = generateMockGPXPoints(date)

  return NextResponse.json({
    gpx: {
      created_at: new Date().toISOString(),
      gpx_s3_key: `raw-gpx/${date}-mock.gpx`,
      bounding_box: gpxData.bounding_box,
      points: gpxData.points,
    },
  })
}
