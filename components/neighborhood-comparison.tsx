import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface NeighborhoodComparisonProps {
  crimeType: string
  dateRange: string
}

export function NeighborhoodComparison({ crimeType, dateRange }: NeighborhoodComparisonProps) {
  // Mock data representing Toronto neighborhoods
  const data = [
    { name: "Downtown Core", incidents: 485, riskLevel: "high" },
    { name: "Scarborough", incidents: 342, riskLevel: "medium" },
    { name: "North York", incidents: 298, riskLevel: "medium" },
    { name: "Etobicoke", incidents: 234, riskLevel: "low" },
    { name: "East York", incidents: 189, riskLevel: "low" },
    { name: "York", incidents: 167, riskLevel: "low" },
    { name: "Old Toronto", incidents: 432, riskLevel: "high" },
  ]

  const getBarColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhood Crime Comparison</CardTitle>
        <CardDescription>
          Compare incident rates across Toronto districts - {crimeType} incidents over {dateRange}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, "Incidents"]}
                labelFormatter={(label) => `District: ${label}`}
              />
              <Bar dataKey="incidents" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.riskLevel)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-sm">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm">Low Risk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
