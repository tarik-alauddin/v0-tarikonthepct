"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Mountain, 
  Footprints, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Sun, 
  Moon, 
  ArrowLeft,
  Calendar
} from "lucide-react"
import HeartRateChart from "@/components/heart-rate-chart"

// Dynamically import the map component to avoid SSR issues with Leaflet
const GPXMap = dynamic(() => import("@/components/gpx-map"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-secondary/50 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
})

interface Activity {
  activity_date: string
  miles: number
  elevation_gain: number
  elevation_loss: number
  duration: number
}

interface GPXPoint {
  lat: string
  lon: string
  ele: string
  hr: string
  time: string
}

interface GPXData {
  created_at: string
  gpx_s3_key: string
  bounding_box: {
    min_lat: string
    max_lat: string
    min_lon: string
    max_lon: string
  }
  points: GPXPoint[]
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "Rest Day"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const date = params.date as string
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const [activity, setActivity] = useState<Activity | null>(null)
  const [gpxData, setGpxData] = useState<GPXData | null>(null)
  const [dayNumber, setDayNumber] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!date) return
    
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch activity data
        const activitiesRes = await fetch("/api/activities")
        if (!activitiesRes.ok) throw new Error("Failed to fetch activities")
        const activitiesData = await activitiesRes.json()
        
        const activities = activitiesData.activities || []
        const activityIndex = activities.findIndex((a: Activity) => a.activity_date === date)
        
        if (activityIndex === -1) {
          setError("Activity not found")
          setLoading(false)
          return
        }
        
        setActivity(activities[activityIndex])
        setDayNumber(activityIndex + 1)
        
        // Fetch GPX data
        const gpxRes = await fetch(`/api/activities/gpx/${date}`)
        if (!gpxRes.ok) throw new Error("Failed to fetch GPX data")
        const gpxJson = await gpxRes.json()
        setGpxData(gpxJson.gpx)
        
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load activity data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [date])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Loading Activity</p>
            <p className="text-sm text-muted-foreground">Fetching trail data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Mountain className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium text-foreground">{error || "Activity not found"}</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isZeroDay = activity.miles === 0

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to dashboard</span>
                </Button>
              </Link>
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Mountain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Day {dayNumber}</h1>
                  {isZeroDay ? (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Zero Day
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Hiking Day
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(activity.activity_date)}</p>
              </div>
            </div>
          </div>
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>

        {isZeroDay ? (
          /* Zero Day View */
          <Card className="bg-card border-border">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-yellow-500/10 rounded-full mb-4">
                <Mountain className="h-12 w-12 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Rest & Recovery Day</h2>
              <p className="text-muted-foreground max-w-md">
                No hiking recorded for this day. Zero days are essential for recovery, 
                resupply, and enjoying trail towns along the PCT.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Map and Stats Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GPX Map - Left Side */}
              <Card className="bg-card border-border overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-foreground">Route Map</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {gpxData && gpxData.points.length > 0 ? (
                    <GPXMap points={gpxData.points} boundingBox={gpxData.bounding_box} />
                  ) : (
                    <div className="w-full h-[400px] bg-secondary/50 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">No GPS data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Cards - Right Side (2 per row) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Distance */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Footprints className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-2xl font-bold text-foreground">{activity.miles.toFixed(1)} mi</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Duration */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-2xl font-bold text-foreground">{formatDuration(activity.duration)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Elevation Gain */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Elevation Gain</p>
                      <p className="text-2xl font-bold text-foreground">+{activity.elevation_gain.toLocaleString()} ft</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Elevation Loss */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Elevation Loss</p>
                      <p className="text-2xl font-bold text-foreground">-{activity.elevation_loss.toLocaleString()} ft</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Date */}
                <Card className="bg-card border-border col-span-2">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-xl font-bold text-foreground">{activity.activity_date}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Heart Rate Chart */}
            {gpxData && gpxData.points.length > 0 && (
              <HeartRateChart points={gpxData.points} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
