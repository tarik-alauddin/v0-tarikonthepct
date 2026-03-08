"use client"

import { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Mountain, Footprints, TrendingUp, Clock, Sun, Moon } from "lucide-react"
import ActivityCard from "@/components/activity-card"
import PCTMap from "@/components/pct-map"

interface Activity {
  activity_date: string
  miles: number
  elevation_gain: number
  elevation_loss: number
  duration: number
}

export default function PCTDashboard() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/activities")
      
      if (!response.ok) {
        throw new Error("Failed to fetch activities")
      }
      
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary stats
  const stats = useMemo(() => {
    const hikingDays = activities.filter(a => a.miles > 0)
    const totalMiles = activities.reduce((sum, a) => sum + a.miles, 0)
    const totalElevationGain = activities.reduce((sum, a) => sum + a.elevation_gain, 0)
    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0)
    const avgMilesPerHikingDay = hikingDays.length > 0 ? totalMiles / hikingDays.length : 0

    return {
      totalMiles,
      totalElevationGain,
      totalDuration,
      avgMilesPerHikingDay,
      totalDays: activities.length,
      hikingDays: hikingDays.length,
      zeroDays: activities.length - hikingDays.length,
    }
  }, [activities])

  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    return `${hours}h`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Loading Trail Data</p>
            <p className="text-sm text-muted-foreground">Preparing your PCT analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Mountain className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium text-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Mountain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">PCT Thru-Hike Tracker</h1>
                <p className="text-sm text-muted-foreground">Mexico to Canada - 2,650 miles</p>
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

        {/* Map and Stats Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PCT Map - Left Side */}
          <PCTMap totalMiles={stats.totalMiles} />

          {/* Stats Cards - Right Side (1 per row) */}
          <div className="flex flex-col gap-4">
            <Card className="bg-card border-border flex-1">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Footprints className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Total Miles</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMiles.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border flex-1">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Total Elevation</p>
                  <p className="text-2xl font-bold text-foreground">{(stats.totalElevationGain / 1000).toFixed(1)}k ft</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border flex-1">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Time on Trail</p>
                  <p className="text-2xl font-bold text-foreground">{formatTotalDuration(stats.totalDuration)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border flex-1">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Mountain className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Miles/Day</p>
                  <p className="text-2xl font-bold text-foreground">{stats.avgMilesPerHikingDay.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity List */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Trail Log</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{stats.hikingDays} hiking days</span>
                <span className="text-border">|</span>
                <span>{stats.zeroDays} zero days</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] px-6 pb-6">
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <ActivityCard
                    key={activity.activity_date}
                    activity={activity}
                    dayNumber={index + 1}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
