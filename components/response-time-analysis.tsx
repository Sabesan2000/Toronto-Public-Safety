import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface ResponseTimeAnalysisProps {
  neighborhood: string
  dateRange: string
}

export function ResponseTimeAnalysis({ neighborhood, dateRange }: ResponseTimeAnalysisProps) {
  // Mock response time data
  const trendData = [
    { month: "Jan", police: 7.2, ems: 6.8, fire: 5.4 },
    { month: "Feb", police: 7.8, ems: 7.1, fire: 5.2 },
    { month: "Mar", police: 8.1, ems: 7.3, fire: 5.8 },
    { month: "Apr", police: 7.9, ems: 6.9, fire: 5.6 },
    { month: "May", police: 8.3, ems: 7.4, fire: 6.1 },
    { month: "Jun", police: 8.7, ems: 7.8, fire: 6.3 },
    { month: "Jul", police: 9.1, ems: 8.2, fire: 6.7 },
    { month: "Aug", police: 8.9, ems: 8.0, fire: 6.5 },
    { month: "Sep", police: 8.4, ems: 7.6, fire: 6.2 },
    { month: "Oct", police: 7.8, ems: 7.2, fire: 5.9 },
    { month: "Nov", police: 7.5, ems: 6.8, fire: 5.5 },
    { month: "Dec", police: 7.3, ems: 6.6, fire: 5.3 },
  ]

  const districtData = [
    { district: "Downtown", avgTime: 9.2, target: 8.0 },
    { district: "Scarborough", avgTime: 7.8, target: 8.0 },
    { district: "North York", avgTime: 7.1, target: 8.0 },
    { district: "Etobicoke", avgTime: 6.9, target: 8.0 },
    { district: "East York", avgTime: 6.5, target: 8.0 },
    { district: "York", avgTime: 7.3, target: 8.0 },
    { district: "Old Toronto", avgTime: 8.8, target: 8.0 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Response Time Trends</CardTitle>
          <CardDescription>Monthly average response times by service type - {neighborhood}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${value} min`, ""]} />
                <Line type="monotone" dataKey="police" stroke="#3b82f6" strokeWidth={2} name="Police" />
                <Line type="monotone" dataKey="ems" stroke="#ef4444" strokeWidth={2} name="EMS" />
                <Line type="monotone" dataKey="fire" stroke="#f59e0b" strokeWidth={2} name="Fire" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Time by District</CardTitle>
          <CardDescription>Average police response times compared to 8-minute target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-45} textAnchor="end" height={60} fontSize={12} />
                <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${value} min`, ""]} />
                <Bar dataKey="avgTime" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Target response time: 8 minutes (red dashed line)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
