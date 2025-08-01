import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, MapPin, AlertTriangle, Shield } from "lucide-react"

interface SafetyMetricsProps {
  neighborhood: string
  crimeType: string
  dateRange: string
}

export function SafetyMetrics({ neighborhood, crimeType, dateRange }: SafetyMetricsProps) {
  // Mock data - in real app, this would come from your data source
  const metrics = {
    totalIncidents: 2847,
    changePercent: -12.3,
    avgResponseTime: 8.2,
    responseChange: -5.1,
    highRiskAreas: 3,
    safetyScore: 7.2,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalIncidents.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {metrics.changePercent < 0 ? (
              <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={metrics.changePercent < 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(metrics.changePercent)}% from last period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.avgResponseTime} min</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">{Math.abs(metrics.responseChange)}% faster</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High-Risk Areas</CardTitle>
          <MapPin className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.highRiskAreas}</div>
          <div className="text-xs text-muted-foreground">Neighborhoods requiring attention</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
          <Shield className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.safetyScore}/10</div>
          <div className="flex items-center text-xs">
            <Badge variant={metrics.safetyScore >= 7 ? "default" : "secondary"} className="text-xs">
              {metrics.safetyScore >= 7 ? "Good" : "Fair"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
