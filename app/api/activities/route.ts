import { NextResponse } from "next/server"

// Mock activity data for PCT thru-hike
const mockActivities = [
  {
    activity_date: "2025-04-15",
    miles: 18.5,
    elevation_gain: 2450,
    elevation_loss: 1800,
    duration: 28800, // 8 hours in seconds
  },
  {
    activity_date: "2025-04-16",
    miles: 22.3,
    elevation_gain: 3100,
    elevation_loss: 2900,
    duration: 34200, // 9.5 hours
  },
  {
    activity_date: "2025-04-17",
    miles: 15.7,
    elevation_gain: 1200,
    elevation_loss: 2800,
    duration: 25200, // 7 hours
  },
  {
    activity_date: "2025-04-18",
    miles: 0,
    elevation_gain: 0,
    elevation_loss: 0,
    duration: 0, // Zero day
  },
  {
    activity_date: "2025-04-19",
    miles: 24.1,
    elevation_gain: 4200,
    elevation_loss: 3500,
    duration: 39600, // 11 hours
  },
  {
    activity_date: "2025-04-20",
    miles: 19.8,
    elevation_gain: 2800,
    elevation_loss: 2100,
    duration: 30600, // 8.5 hours
  },
  {
    activity_date: "2025-04-21",
    miles: 21.2,
    elevation_gain: 3400,
    elevation_loss: 3200,
    duration: 32400, // 9 hours
  },
  {
    activity_date: "2025-04-22",
    miles: 16.9,
    elevation_gain: 1800,
    elevation_loss: 2400,
    duration: 27000, // 7.5 hours
  },
  {
    activity_date: "2025-04-23",
    miles: 23.5,
    elevation_gain: 3800,
    elevation_loss: 3100,
    duration: 36000, // 10 hours
  },
  {
    activity_date: "2025-04-24",
    miles: 17.4,
    elevation_gain: 2200,
    elevation_loss: 1900,
    duration: 28800, // 8 hours
  },
  {
    activity_date: "2025-04-25",
    miles: 20.6,
    elevation_gain: 2950,
    elevation_loss: 2700,
    duration: 31500, // 8.75 hours
  },
  {
    activity_date: "2025-04-26",
    miles: 0,
    elevation_gain: 0,
    elevation_loss: 0,
    duration: 0, // Zero day - resupply
  },
  {
    activity_date: "2025-04-27",
    miles: 14.2,
    elevation_gain: 3600,
    elevation_loss: 800,
    duration: 27000, // 7.5 hours - big climb day
  },
  {
    activity_date: "2025-04-28",
    miles: 25.8,
    elevation_gain: 1400,
    elevation_loss: 4100,
    duration: 36000, // 10 hours - downhill day
  },
  {
    activity_date: "2025-04-29",
    miles: 18.9,
    elevation_gain: 2600,
    elevation_loss: 2300,
    duration: 30000, // 8.3 hours
  },
]

export async function GET() {
  return NextResponse.json({
    activities: mockActivities,
  })
}
