"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Heart } from "lucide-react"

interface GPXPoint {
  lat: string
  lon: string
  ele: string
  hr: string
  time: string
}

interface HeartRateChartProps {
  points: GPXPoint[]
}

const chartConfig = {
  hr: {
    label: "Heart Rate",
    color: "hsl(0, 84%, 60%)", // Red color for heart rate
  },
} satisfies ChartConfig

export default function HeartRateChart({ points }: HeartRateChartProps) {
  // Transform points data for the chart
  const chartData = points.map((point, index) => {
    const time = new Date(point.time)
    return {
      index,
      hr: parseInt(point.hr),
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
  })

  // Calculate stats
  const hrValues = chartData.map(d => d.hr)
  const avgHR = Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length)
  const maxHR = Math.max(...hrValues)
  const minHR = Math.min(...hrValues)

  // Sample data for display (show every nth point to avoid overcrowding)
  const sampleRate = Math.max(1, Math.floor(chartData.length / 100))
  const sampledData = chartData.filter((_, i) => i % sampleRate === 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <CardTitle className="text-lg text-foreground">Heart Rate</CardTitle>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Avg</p>
              <p className="font-semibold text-foreground">{avgHR} bpm</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Max</p>
              <p className="font-semibold text-red-500">{maxHR} bpm</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Min</p>
              <p className="font-semibold text-green-500">{minHR} bpm</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={sampledData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={[Math.max(0, minHR - 10), maxHR + 10]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value} bpm`, "Heart Rate"]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="hr"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fill="url(#hrGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
