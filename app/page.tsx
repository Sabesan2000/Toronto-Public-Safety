"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, TrendingUp, Clock, AlertTriangle, Shield } from "lucide-react"
import { NeighborhoodComparison } from "@/components/neighborhood-comparison"
import { ResponseTimeAnalysis } from "@/components/response-time-analysis"
import { CrimeTrendChart } from "@/components/crime-trend-chart"
import { CrimeTypeDistribution } from "@/components/crime-type-distribution"
import { SafetyMetrics } from "@/components/safety-metrics"
import { IncidentMap } from "@/components/incident-map"

const neighborhoods = [
  "All Districts",
  "Downtown Core",
  "Scarborough",
  "North York",
  "Etobicoke",
  "East York",
  "York",
  "Old Toronto",
]

const crimeTypes = [
  "All Types",
  "Auto Theft",
  "Drug Offenses",
  "Assault",
  "Break & Enter",
  "Robbery",
  "Fraud",
  "Vandalism",
]

export default function Dashboard() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("All Districts")
  const [selectedCrimeType, setSelectedCrimeType] = useState("All Types")
  const [dateRange, setDateRange] = useState("12months")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Toronto Public Safety Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interactive data visualization tool for analyzing crime patterns, emergency response times, and safety
            trends across Toronto neighborhoods
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Data Filters
            </CardTitle>
            <CardDescription>
              Customize your analysis by selecting specific neighborhoods, crime types, and time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Neighborhood</label>
                <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods.map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Crime Type</label>
                <Select value={selectedCrimeType} onValueChange={setSelectedCrimeType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="24months">Last 24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <SafetyMetrics neighborhood={selectedNeighborhood} crimeType={selectedCrimeType} dateRange={dateRange} />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="neighborhoods" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Neighborhoods
            </TabsTrigger>
            <TabsTrigger value="response" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Response Times
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Crime Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CrimeTypeDistribution neighborhood={selectedNeighborhood} dateRange={dateRange} />
              <IncidentMap neighborhood={selectedNeighborhood} crimeType={selectedCrimeType} />
            </div>
            <CrimeTrendChart neighborhood={selectedNeighborhood} crimeType={selectedCrimeType} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="neighborhoods">
            <NeighborhoodComparison crimeType={selectedCrimeType} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="response">
            <ResponseTimeAnalysis neighborhood={selectedNeighborhood} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-6">
              <CrimeTrendChart
                neighborhood={selectedNeighborhood}
                crimeType={selectedCrimeType}
                dateRange={dateRange}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Crime Types</CardTitle>
                    <CardDescription>Toronto-specific concerns requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Auto Theft</span>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Drug Offenses</span>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Break & Enter</span>
                      <Badge variant="secondary">Medium Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fraud</span>
                      <Badge variant="secondary">Medium Priority</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Patterns</CardTitle>
                    <CardDescription>Crime trends by season</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Summer (Jun-Aug)</span>
                      <Badge variant="destructive">Peak Season</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Winter (Dec-Feb)</span>
                      <Badge variant="outline">Low Season</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Spring/Fall</span>
                      <Badge variant="secondary">Moderate</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600">
              <p>Data sourced from Toronto Police Service (TPS) and Toronto Emergency Medical Services</p>
              <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
