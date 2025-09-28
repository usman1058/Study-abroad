'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Download,
  Search,
  Filter
} from 'lucide-react'

interface B2BSubmission {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  serviceType: string
  message: string
  processed: boolean
  createdAt: string
  ipAddress: string
  userAgent: string
}

export default function B2BAdminPage() {
  const [submissions, setSubmissions] = useState<B2BSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<B2BSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [submissions, searchTerm, statusFilter, serviceFilter])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/b2b')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.b2bSubmissions || [])
      }
    } catch (error) {
      console.error('Error fetching B2B submissions:', error)
      toast({
        title: "Error",
        description: "Failed to load B2B submissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = submissions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.processed === (statusFilter === 'processed'))
    }

    // Service type filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(s => s.serviceType === serviceFilter)
    }

    setFilteredSubmissions(filtered)
  }

  const toggleProcessedStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/b2b/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processed: !currentStatus }),
      })

      if (response.ok) {
        setSubmissions(submissions.map(s => 
          s.id === id ? { ...s, processed: !currentStatus } : s
        ))
        toast({
          title: "Success",
          description: `B2B submission marked as ${!currentStatus ? 'processed' : 'unprocessed'}.`,
        })
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating B2B submission:', error)
      toast({
        title: "Error",
        description: "Failed to update submission status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = () => {
    const headers = ['Company Name', 'Contact Person', 'Email', 'Phone', 'Service Type', 'Status', 'Date']
    const csvContent = [
      headers.join(','),
      ...filteredSubmissions.map(s => [
        s.companyName,
        s.contactPerson,
        s.email,
        s.phone,
        s.serviceType,
        s.processed ? 'Processed' : 'Pending',
        new Date(s.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `b2b_submissions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      partnership: 'Strategic Partnership',
      recruitment: 'Student Recruitment',
      training: 'Training Programs',
      consulting: 'Educational Consulting'
    }
    return labels[serviceType] || serviceType
  }

  const getServiceTypeColor = (serviceType: string) => {
    const colors: Record<string, string> = {
      partnership: 'bg-purple-100 text-purple-800',
      recruitment: 'bg-blue-100 text-blue-800',
      training: 'bg-green-100 text-green-800',
      consulting: 'bg-orange-100 text-orange-800'
    }
    return colors[serviceType] || 'bg-gray-100 text-gray-800'
  }

  const stats = {
    total: submissions.length,
    processed: submissions.filter(s => s.processed).length,
    pending: submissions.filter(s => !s.processed).length,
    partnerships: submissions.filter(s => s.serviceType === 'partnership').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">B2B Submissions</h1>
          <p className="text-gray-600 mt-2">Manage business-to-business partnership inquiries</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.processed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.partnerships}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by company, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Types</SelectItem>
                <SelectItem value="partnership">Strategic Partnership</SelectItem>
                <SelectItem value="recruitment">Student Recruitment</SelectItem>
                <SelectItem value="training">Training Programs</SelectItem>
                <SelectItem value="consulting">Educational Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>B2B Submissions ({filteredSubmissions.length})</CardTitle>
          <CardDescription>View and manage all B2B partnership inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.companyName}</TableCell>
                    <TableCell>{submission.contactPerson}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {submission.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {submission.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getServiceTypeColor(submission.serviceType)}>
                        {getServiceTypeLabel(submission.serviceType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={submission.processed ? "default" : "secondary"}>
                        {submission.processed ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Processed
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Pending
                          </div>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleProcessedStatus(submission.id, submission.processed)}
                        className={submission.processed ? "hover:bg-orange-50 hover:text-orange-600" : "hover:bg-green-50 hover:text-green-600"}
                      >
                        {submission.processed ? "Mark Pending" : "Mark Processed"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No B2B submissions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}