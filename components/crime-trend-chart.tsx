import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface CrimeTrendChartProps {
  neighborhood: string
  crimeType: string
  dateRange: string
}

export function CrimeTrendChart({ neighborhood, crimeType, dateRange }: CrimeTrendChartProps) {
  // Mock trend data with seasonal patterns
  const data = [
    { month: "Jan 2024", incidents: 234, forecast: null },
    { month: "Feb 2024", incidents: 198, forecast: null },
    { month: "Mar 2024", incidents: 267, forecast: null },
    { month: "Apr 2024", incidents: 289, forecast: null },
    { month: "May 2024", incidents: 312, forecast: null },
    { month: "Jun 2024", incidents: 356, forecast: null },
    { month: "Jul 2024", incidents: 389, forecast: null },
    { month: "Aug 2024", incidents: 378, forecast: null },
    { month: "Sep 2024", incidents: 334, forecast: null },
    { month: "Oct 2024", incidents: 298, forecast: null },
    { month: "Nov 2024", incidents: 267, forecast: null },
    { month: "Dec 2024", incidents: 245, forecast: null },
    { month: "Jan 2025", incidents: null, forecast: 252 },
    { month: "Feb 2025", incidents: null, forecast: 215 },
    { month: "Mar 2025", incidents: null, forecast: 278 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crime Trend Analysis & Forecasting</CardTitle>
        <CardDescription>
          Monthly incident patterns with 3-month forecast - {crimeType} in {neighborhood}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} fontSize={11} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, name === "incidents" ? "Actual Incidents" : "Forecasted Incidents"]}
              />
              <Area
                type="monotone"
                dataKey="incidents"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorIncidents)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorForecast)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Historical Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded border-dashed border-2 border-amber-500"></div>
            <span>Forecast</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
