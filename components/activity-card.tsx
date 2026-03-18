"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, TrendingUp, TrendingDown, Clock, Footprints } from "lucide-react"

export interface Activity {
  activity_date: string
  miles: number
  elevation_gain: number
  elevation_loss: number
  duration: number
}

interface ActivityCardProps {
  activity: Activity
  dayNumber: number
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
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export default function ActivityCard({ activity, dayNumber }: ActivityCardProps) {
  const isZeroDay = activity.miles === 0

  return (
    <Link href={`/activity/${activity.activity_date}`}>
      <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="p-4 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-bold text-primary">D{dayNumber}</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-foreground">{formatDate(activity.activity_date)}</p>
              <p className="text-xs text-muted-foreground">{activity.activity_date}</p>
            </div>
          </div>
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

        {isZeroDay ? (
          <div className="flex items-center justify-center py-4 text-muted-foreground">
            <Mountain className="h-5 w-5 mr-2" />
            <span className="text-sm">Rest & Recovery</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-secondary/50">
              <Footprints className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="text-sm font-semibold text-foreground">{activity.miles.toFixed(1)} mi</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-secondary/50">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-semibold text-foreground">{formatDuration(activity.duration)}</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-secondary/50">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Elevation Gain</p>
              <p className="text-sm font-semibold text-foreground">+{activity.elevation_gain.toLocaleString()} ft</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-secondary/50">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <p className="text-xs text-muted-foreground">Elevation Loss</p>
              <p className="text-sm font-semibold text-foreground">-{activity.elevation_loss.toLocaleString()} ft</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  )
}
