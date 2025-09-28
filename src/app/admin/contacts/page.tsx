'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  education: string
  countryToGo: string
  budget: string
  timeline: string
  message: string
  universityId?: string
  university?: {
    id: string
    name: string
    country: string
  }
  sourcePage: string
  ipAddress: string
  userAgent: string
  processed: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    country: '',
    timeline: '',
    processed: '',
    search: ''
  })
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    checkAuth()
    fetchContacts()
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [filters])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token || !user) {
      window.location.href = '/admin'
      return
    }
  }

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/contact?${params}`)
      if (response.ok) {
        const data = await response.json()
        setContacts(data.submissions || [])
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleProcessed = async (id: string, processed: boolean) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processed })
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Contact marked as ${processed ? 'processed' : 'unprocessed'}`,
        })
        fetchContacts()
      } else {
        throw new Error('Failed to update contact status')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Education', 'Country', 'Budget', 
      'Timeline', 'University', 'Source', 'Processed', 'Date'
    ]
    
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        contact.name,
        contact.email,
        contact.phone,
        contact.education,
        contact.countryToGo,
        contact.budget,
        contact.timeline,
        contact.university?.name || '',
        contact.sourcePage,
        contact.processed ? 'Yes' : 'No',
        new Date(contact.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact_submissions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilters({
      country: '',
      timeline: '',
      processed: '',
      search: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="mr-4"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={exportToCSV} variant="outline">
                Export CSV
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                View Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter contact submissions by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => setFilters({...filters, country: value})} value={filters.country}>
                    <SelectTrigger>
                      <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All countries</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select onValueChange={(value) => setFilters({...filters, timeline: value})} value={filters.timeline}>
                    <SelectTrigger>
                      <SelectValue placeholder="All timelines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All timelines</SelectItem>
                      <SelectItem value="Immediate (Next 3 months)">Immediate</SelectItem>
                      <SelectItem value="Soon (3–6 months)">Soon</SelectItem>
                      <SelectItem value="Medium (6–12 months)">Medium</SelectItem>
                      <SelectItem value="Long (1+ year)">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="processed">Status</Label>
                  <Select onValueChange={(value) => setFilters({...filters, processed: value})} value={filters.processed}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="true">Processed</SelectItem>
                      <SelectItem value="false">Unprocessed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, email..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contacts List */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions ({contacts.length})</CardTitle>
              <CardDescription>
                Manage all contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading contacts...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {contacts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No contact submissions found.</p>
                    </div>
                  ) : (
                    contacts.map((contact) => (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{contact.name}</h3>
                              <Badge variant={contact.processed ? "default" : "secondary"}>
                                {contact.processed ? "Processed" : "New"}
                              </Badge>
                              <Badge variant="outline">{contact.countryToGo}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <span className="font-medium">Email:</span> {contact.email}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {contact.phone}
                              </div>
                              <div>
                                <span className="font-medium">Education:</span> {contact.education}
                              </div>
                              <div>
                                <span className="font-medium">Budget:</span> {contact.budget}
                              </div>
                              <div>
                                <span className="font-medium">Timeline:</span> {contact.timeline}
                              </div>
                              {contact.university && (
                                <div>
                                  <span className="font-medium">University:</span> {contact.university.name}
                                </div>
                              )}
                            </div>
                            
                            <div className="mb-3">
                              <span className="font-medium">Message:</span>
                              <p className="text-gray-600 mt-1 text-sm">{contact.message}</p>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              <div>Source: {contact.sourcePage} | IP: {contact.ipAddress}</div>
                              <div>Submitted: {new Date(contact.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={contact.processed}
                                onCheckedChange={(checked) => toggleProcessed(contact.id, checked)}
                              />
                              <Label className="text-sm">Processed</Label>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedContact(contact)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Details Modal */}
          {selectedContact && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Contact Details</CardTitle>
                      <CardDescription>{selectedContact.name}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedContact(null)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm text-gray-600">{selectedContact.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-gray-600">{selectedContact.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-gray-600">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Education</Label>
                      <p className="text-sm text-gray-600">{selectedContact.education}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Preferred Country</Label>
                      <p className="text-sm text-gray-600">{selectedContact.countryToGo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Budget Range</Label>
                      <p className="text-sm text-gray-600">{selectedContact.budget}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Timeline</Label>
                      <p className="text-sm text-gray-600">{selectedContact.timeline}</p>
                    </div>
                    {selectedContact.university && (
                      <div>
                        <Label className="text-sm font-medium">University</Label>
                        <p className="text-sm text-gray-600">{selectedContact.university.name}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Message</Label>
                    <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                      {selectedContact.message}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <Label className="text-sm font-medium">Source Page</Label>
                      <p className="text-gray-600">{selectedContact.sourcePage}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">IP Address</Label>
                      <p className="text-gray-600">{selectedContact.ipAddress}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">User Agent</Label>
                      <p className="text-gray-600 truncate">{selectedContact.userAgent}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Submitted</Label>
                      <p className="text-gray-600">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setSelectedContact(null)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}