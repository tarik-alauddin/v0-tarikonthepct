"use client"

import { useMemo, useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { MapPin, Landmark, ChevronDown } from "lucide-react"

// PCT detailed route coordinates with extensive waypoints for accurate trail representation
// Includes Seiad Valley correction and proper Northern California routing
const PCT_ROUTE = [
  // Southern California - Campo to Kennedy Meadows (Mile 0-702)
  [-116.4667, 32.5892], // Southern Terminus (Campo)
  [-116.48, 32.65],
  [-116.5, 32.72],
  [-116.52, 32.8],
  [-116.55, 32.88],
  [-116.58, 32.95],
  [-116.6, 33.02],
  [-116.62, 33.1],
  [-116.65, 33.18],
  [-116.68, 33.26],
  [-116.72, 33.35],
  [-116.76, 33.44],
  [-116.8, 33.52],
  [-116.85, 33.6],
  [-116.9, 33.68],
  [-116.95, 33.78],
  [-117.0, 33.88],
  [-117.05, 33.96],
  [-117.1, 34.04],
  [-117.15, 34.12],
  [-117.2, 34.2],
  [-117.28, 34.26],
  [-117.35, 34.32],
  [-117.42, 34.38],
  [-117.5, 34.42],
  [-117.58, 34.46],
  [-117.66, 34.5],
  [-117.75, 34.55],
  [-117.84, 34.6],
  [-117.92, 34.66],
  [-118.0, 34.72],
  [-118.08, 34.8],
  [-118.16, 34.88],
  [-118.24, 34.96],
  [-118.3, 35.04],
  [-118.32, 35.14],
  [-118.32, 35.24],
  [-118.3, 35.34],
  [-118.28, 35.44],
  [-118.26, 35.54],
  [-118.24, 35.64],
  [-118.22, 35.74],
  [-118.2, 35.84],
  [-118.18, 35.94],
  [-118.16, 36.0], // Kennedy Meadows (Mile 702)
  
  // High Sierra - Kennedy Meadows to Lake Tahoe (Mile 702-1092)
  [-118.18, 36.1],
  [-118.22, 36.2],
  [-118.26, 36.32],
  [-118.32, 36.44],
  [-118.38, 36.56],
  [-118.44, 36.68],
  [-118.5, 36.8],
  [-118.58, 36.9],
  [-118.66, 37.0],
  [-118.74, 37.1],
  [-118.82, 37.2],
  [-118.9, 37.3],
  [-118.96, 37.4],
  [-119.04, 37.5],
  [-119.12, 37.58],
  [-119.2, 37.66],
  [-119.28, 37.74],
  [-119.36, 37.82],
  [-119.44, 37.9],
  [-119.52, 37.98],
  [-119.6, 38.06],
  [-119.68, 38.16],
  [-119.76, 38.26],
  [-119.84, 38.38],
  [-119.92, 38.5],
  [-119.98, 38.62],
  [-120.02, 38.74],
  [-120.02, 38.86],
  [-120.0, 38.94], // Lake Tahoe area (Mile 1092)
  
  // Northern Sierra to Lassen (Mile 1092-1350)
  [-120.04, 39.04],
  [-120.1, 39.14],
  [-120.16, 39.24],
  [-120.22, 39.34],
  [-120.3, 39.44],
  [-120.38, 39.54],
  [-120.46, 39.64],
  [-120.54, 39.72],
  [-120.62, 39.8],
  [-120.72, 39.88],
  [-120.82, 39.96],
  [-120.92, 40.04],
  [-121.02, 40.12],
  [-121.12, 40.2],
  [-121.2, 40.3],
  [-121.26, 40.42], // Lassen area
  
  // Northern California - Lassen to Seiad Valley (Mile 1350-1655)
  [-121.32, 40.52],
  [-121.36, 40.62],
  [-121.38, 40.72],
  [-121.4, 40.82],
  [-121.44, 40.92],
  [-121.5, 41.02],
  [-121.56, 41.12],
  [-121.62, 41.2],
  [-121.68, 41.28],
  [-121.74, 41.36],
  [-121.8, 41.44],
  [-121.86, 41.5],
  [-121.92, 41.56],
  [-122.0, 41.62],
  [-122.1, 41.68],
  [-122.2, 41.72],
  [-122.32, 41.76],
  [-122.44, 41.8],
  [-122.54, 41.84],
  [-122.64, 41.88],
  [-122.72, 41.92],
  [-122.82, 41.93], // Seiad Valley (Mile 1655) - westward jog
  [-122.88, 41.94],
  [-122.92, 41.96],
  [-122.94, 41.98],
  [-122.94, 42.0], // CA/OR Border (Mile 1691)
  
  // Oregon Section (Mile 1691-2144)
  [-122.9, 42.06],
  [-122.84, 42.12],
  [-122.76, 42.18],
  [-122.68, 42.24], // Near Ashland (Mile 1718)
  [-122.58, 42.32],
  [-122.48, 42.4],
  [-122.38, 42.5],
  [-122.3, 42.6],
  [-122.24, 42.7],
  [-122.2, 42.8],
  [-122.16, 42.9],
  [-122.12, 43.0],
  [-122.08, 43.1], // Crater Lake area
  [-122.04, 43.2],
  [-121.98, 43.32],
  [-121.92, 43.44],
  [-121.86, 43.56],
  [-121.8, 43.68],
  [-121.76, 43.8],
  [-121.72, 43.92],
  [-121.7, 44.04],
  [-121.72, 44.16],
  [-121.76, 44.28],
  [-121.8, 44.4],
  [-121.84, 44.52],
  [-121.86, 44.64],
  [-121.88, 44.76],
  [-121.88, 44.88],
  [-121.86, 45.0],
  [-121.84, 45.12],
  [-121.82, 45.24],
  [-121.8, 45.36],
  [-121.78, 45.48],
  [-121.78, 45.58],
  [-121.8, 45.66],
  [-121.82, 45.72], // Cascade Locks (Mile 2144)
  [-121.8, 45.78],
  [-121.76, 45.86],
  [-121.72, 45.94],
  [-121.68, 46.0], // OR/WA Border (Mile 2147)
  
  // Washington Section (Mile 2147-2650)
  [-121.62, 46.08],
  [-121.56, 46.16],
  [-121.5, 46.24],
  [-121.46, 46.34],
  [-121.42, 46.44],
  [-121.38, 46.54],
  [-121.34, 46.64],
  [-121.3, 46.74],
  [-121.24, 46.84],
  [-121.18, 46.94],
  [-121.12, 47.04],
  [-121.06, 47.14],
  [-121.02, 47.26],
  [-120.98, 47.38],
  [-120.96, 47.5],
  [-120.94, 47.62],
  [-120.92, 47.74],
  [-120.9, 47.86],
  [-120.88, 47.98],
  [-120.88, 48.1],
  [-120.9, 48.22],
  [-120.92, 48.34],
  [-120.94, 48.46],
  [-120.96, 48.58],
  [-120.98, 48.7],
  [-121.0, 48.82],
  [-121.0, 48.94],
  [-121.0, 49.0], // Northern Terminus - Manning Park (Mile 2650)
]

// Key landmarks/waypoints
const LANDMARKS = [
  { name: "Southern Terminus", coordinates: [-116.4667, 32.5892] as [number, number], mile: 0 },
  { name: "Mt San Jacinto", coordinates: [-116.68, 33.82] as [number, number], mile: 179 },
  { name: "Kennedy Meadows", coordinates: [-118.16, 36.0] as [number, number], mile: 702 },
  { name: "Forester Pass", coordinates: [-118.38, 36.7] as [number, number], mile: 779 },
  { name: "Lake Tahoe", coordinates: [-120.0, 38.94] as [number, number], mile: 1092 },
  { name: "Halfway There!", coordinates: [-121.26, 40.42] as [number, number], mile: 1325, isSpecial: true },
  { name: "Seiad Valley", coordinates: [-122.82, 41.93] as [number, number], mile: 1655 },
  { name: "CA/OR Border", coordinates: [-122.94, 42.0] as [number, number], mile: 1691 },
  { name: "Ashland", coordinates: [-122.68, 42.24] as [number, number], mile: 1718 },
  { name: "Crater Lake", coordinates: [-122.1, 43.0] as [number, number], mile: 1830 },
  { name: "Mt Hood", coordinates: [-121.76, 45.37] as [number, number], mile: 2095 },
  { name: "OR/WA Border", coordinates: [-121.68, 46.0] as [number, number], mile: 2147 },
  { name: "Mt Rainier", coordinates: [-121.76, 46.85] as [number, number], mile: 2300 },
  { name: "Stevens Pass", coordinates: [-121.09, 47.75] as [number, number], mile: 2464 },
  { name: "Harts Pass", coordinates: [-120.66, 48.72] as [number, number], mile: 2610 },
  { name: "Northern Terminus", coordinates: [-121.0, 49.0] as [number, number], mile: 2650 },
]

// Western US states to show (only these three)
const WESTERN_STATES = ["California", "Oregon", "Washington"]

interface PCTMapProps {
  totalMiles: number
  gpxData?: { lat: number; lng: number }[]
  className?: string
}

export default function PCTMap({ totalMiles, gpxData, className }: PCTMapProps) {
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null)
  const [landmarksOpen, setLandmarksOpen] = useState(false)
  
  // Calculate progress along the trail
  const progressPercentage = Math.min((totalMiles / 2650) * 100, 100)
  
  // Calculate which point on the route we've reached
  const progressIndex = useMemo(() => {
    const index = Math.floor((totalMiles / 2650) * (PCT_ROUTE.length - 1))
    return Math.min(index, PCT_ROUTE.length - 1)
  }, [totalMiles])

  // Get the completed portion of the trail
  const completedRoute = PCT_ROUTE.slice(0, progressIndex + 1)
  const remainingRoute = PCT_ROUTE.slice(progressIndex)

  // Current position
  const currentPosition = PCT_ROUTE[progressIndex]

  return (
    <Card className={`bg-card border-border h-full ${className || ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold text-foreground">Trail Progress</CardTitle>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalMiles.toFixed(1)} / 2,650 miles ({progressPercentage.toFixed(1)}%)
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col h-[calc(100%-5rem)]">
        {/* Map container - taller aspect ratio, only showing West Coast */}
        <div className="relative w-full flex-1 min-h-[400px] bg-secondary/20 rounded-lg overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 1400,
              center: [-120.5, 41],
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Geographies geography="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json">
              {({ geographies }) =>
                geographies
                  .filter((geo) => WESTERN_STATES.includes(geo.properties.name))
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "hsl(var(--secondary))" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
              }
            </Geographies>

            {/* State border lines for CA/OR and OR/WA - trimmed to land */}
            <Line
              coordinates={[[-124.2, 42.0], [-120.0, 42.0]]}
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
              strokeOpacity={0.4}
            />
            <Line
              coordinates={[[-124.0, 46.0], [-117.0, 46.0]]}
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
              strokeOpacity={0.4}
            />

            {/* Remaining trail (gray) */}
            {remainingRoute.length > 1 && (
              <Line
                coordinates={remainingRoute as [number, number][]}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 2"
              />
            )}

            {/* Completed trail (primary color) */}
            {completedRoute.length > 1 && (
              <Line
                coordinates={completedRoute as [number, number][]}
                stroke="hsl(var(--primary))"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* GPX data overlay if provided */}
            {gpxData && gpxData.length > 1 && (
              <Line
                coordinates={gpxData.map(p => [p.lng, p.lat] as [number, number])}
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeLinecap="round"
              />
            )}

            {/* Landmarks with hover tooltips */}
            {LANDMARKS.map((landmark) => {
              const isBorderMilestone = landmark.name.includes("Border")
              return (
                <Marker 
                  key={landmark.name} 
                  coordinates={landmark.coordinates}
                >
                  <g
                    onMouseEnter={() => setHoveredLandmark(landmark.name)}
                    onMouseLeave={() => setHoveredLandmark(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Larger hit area for hover */}
                    <circle
                      r={18}
                      fill="transparent"
                    />
                    {/* Visible marker */}
                    <circle
                      r={isBorderMilestone ? 8 : 7}
                      fill={landmark.mile <= totalMiles ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      stroke="hsl(var(--background))"
                      strokeWidth={2.5}
                    />
                    {/* Border milestone indicator */}
                    {isBorderMilestone && (
                      <circle
                        r={12}
                        fill="none"
                        stroke={landmark.mile <= totalMiles ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                        strokeWidth={2}
                        strokeDasharray="3 2"
                      />
                    )}
                    {/* Tooltip */}
                    {hoveredLandmark === landmark.name && (
                      <g>
                        <rect
                          x={10}
                          y={-14}
                          width={landmark.name.length * 7 + 16}
                          height={28}
                          rx={4}
                          fill="hsl(var(--popover))"
                          stroke="hsl(var(--border))"
                          strokeWidth={1}
                        />
                        <text
                          x={18}
                          y={0}
                          fontSize={11}
                          fontWeight={500}
                          fill="hsl(var(--popover-foreground))"
                          dominantBaseline="middle"
                        >
                          {landmark.name}
                        </text>
                        <text
                          x={18}
                          y={10}
                          fontSize={9}
                          fill="hsl(var(--muted-foreground))"
                          dominantBaseline="middle"
                        >
                          Mile {landmark.mile.toLocaleString()}
                        </text>
                      </g>
                    )}
                  </g>
                </Marker>
              )
            })}

            {/* Current position marker */}
            {totalMiles > 0 && (
              <Marker coordinates={currentPosition as [number, number]}>
                <circle
                  r={10}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
                <circle
                  r={5}
                  fill="hsl(var(--background))"
                />
              </Marker>
            )}
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-primary rounded-full" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-muted-foreground rounded-full" />
            <span>Remaining</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Current</span>
          </div>
        </div>

        {/* Collapsible Landmarks Section */}
        <Collapsible open={landmarksOpen} onOpenChange={setLandmarksOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Landmark className="h-4 w-4" />
              <span>Key Landmarks</span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${landmarksOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="max-h-[200px] overflow-y-auto pr-1">
              <div className="flex flex-col gap-2">
                {LANDMARKS.map((landmark, index) => (
                  <div 
                    key={landmark.name}
                    className={`flex items-center gap-3 p-2 rounded-lg border ${
                      landmark.mile <= totalMiles 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-secondary/50 border-border text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-mono w-6 text-center opacity-60">{index + 1}</span>
                    <span className="font-medium text-sm flex-1">{landmark.name}</span>
                    <span className="text-xs">Mile {landmark.mile.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
