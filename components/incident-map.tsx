import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle } from "lucide-react"

interface IncidentMapProps {
  neighborhood: string
  crimeType: string
}

export function IncidentMap({ neighborhood, crimeType }: IncidentMapProps) {
  // Mock incident hotspots data
  const hotspots = [
    {
      area: "Yonge & Dundas Square",
      incidents: 45,
      severity: "high",
      coordinates: "43.6561° N, 79.3802° W",
    },
    {
      area: "Scarborough Town Centre",
      incidents: 32,
      severity: "medium",
      coordinates: "43.7764° N, 79.2584° W",
    },
    {
      area: "North York Centre",
      incidents: 28,
      severity: "medium",
      coordinates: "43.7615° N, 79.4111° W",
    },
    {
      area: "Etobicoke Centre",
      incidents: 19,
      severity: "low",
      coordinates: "43.6205° N, 79.5132° W",
    },
    {
      area: "East York Square",
      incidents: 15,
      severity: "low",
      coordinates: "43.6890° N, 79.3269° W",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Incident Hotspots Map
        </CardTitle>
        <CardDescription>
          Geographic distribution of {crimeType} incidents in {neighborhood}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder for actual map - in real implementation, use Leaflet, Mapbox, or Google Maps */}
        <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center text-gray-600">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Interactive Map View</p>
            <p className="text-sm">Toronto Crime Hotspots</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Current Hotspots
          </h4>
          {hotspots.map((hotspot, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{hotspot.area}</div>
                <div className="text-sm text-gray-600">{hotspot.coordinates}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{hotspot.incidents} incidents</span>
                <Badge variant={getSeverityColor(hotspot.severity)}>{hotspot.severity}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
