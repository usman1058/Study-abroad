'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'

interface Newsletter {
  id: string
  email: string
  name?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface NewsletterFormData {
  email: string
  name?: string
  active: boolean
}

export default function AdminNewsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null)
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    name: '',
    active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    active: '',
    search: ''
  })

  useEffect(() => {
    checkAuth()
    fetchNewsletters()
  }, [])

  useEffect(() => {
    fetchNewsletters()
  }, [filters])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token || !user) {
      window.location.href = '/admin'
      return
    }
  }

  const fetchNewsletters = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/newsletters?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNewsletters(data.newsletters || [])
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
      toast({
        title: "Error",
        description: "Failed to load newsletters",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingNewsletter 
        ? `/api/newsletters/${editingNewsletter.id}`
        : '/api/newsletters'
      
      const method = editingNewsletter ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: editingNewsletter ? 'Newsletter subscription updated successfully' : 'Newsletter subscription created successfully',
        })
        setIsDialogOpen(false)
        resetForm()
        fetchNewsletters()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save newsletter subscription')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save newsletter subscription",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter)
    setFormData({
      email: newsletter.email,
      name: newsletter.name || '',
      active: newsletter.active
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter subscription?')) {
      return
    }

    try {
      const response = await fetch(`/api/newsletters/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: 'Newsletter subscription deleted successfully',
        })
        fetchNewsletters()
      } else {
        throw new Error('Failed to delete newsletter subscription')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete newsletter subscription",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/newsletters/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Newsletter subscription ${active ? 'activated' : 'deactivated'} successfully`,
        })
        fetchNewsletters()
      } else {
        throw new Error('Failed to update newsletter subscription')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update newsletter subscription",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingNewsletter(null)
    setFormData({
      email: '',
      name: '',
      active: true
    })
  }

  const handleInputChange = (field: keyof NewsletterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const exportToCSV = () => {
    const headers = ['Email', 'Name', 'Status', 'Subscription Date']
    
    const csvContent = [
      headers.join(','),
      ...newsletters.map(newsletter => [
        newsletter.email,
        newsletter.name || '',
        newsletter.active ? 'Active' : 'Inactive',
        new Date(newsletter.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter_subscriptions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilters({
      active: '',
      search: ''
    })
  }

  const totalSubscribers = newsletters.length
  const activeSubscribers = newsletters.filter(n => n.active).length
  const recentSubscribers = newsletters.filter(n => {
    const subDate = new Date(n.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return subDate > weekAgo
  }).length

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
              <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <span className="text-2xl">📧</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  {recentSubscribers} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  {totalSubscribers > 0 ? ((activeSubscribers / totalSubscribers) * 100).toFixed(1) : 0}% active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <span className="text-2xl">⏸️</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubscribers - activeSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  Need re-engagement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <div>
                <Label htmlFor="active">Status</Label>
                <select
                  id="active"
                  value={filters.active}
                  onChange={(e) => setFilters({...filters, active: e.target.value})}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by email or name..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <Button variant="outline" onClick={clearFilters} className="mt-6">
                Clear Filters
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>Add Subscriber</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingNewsletter ? 'Edit Subscriber' : 'Add New Subscriber'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingNewsletter 
                      ? 'Update the subscriber information below'
                      : 'Add a new newsletter subscriber'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => handleInputChange('active', checked)}
                    />
                    <Label htmlFor="active">Active (will receive newsletters)</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : (editingNewsletter ? 'Update' : 'Create')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Subscribers Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading subscribers...</p>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsletters.map((newsletter) => (
                      <TableRow key={newsletter.id}>
                        <TableCell className="font-medium">{newsletter.email}</TableCell>
                        <TableCell>{newsletter.name || '-'}</TableCell>
                        <TableCell>
                          {newsletter.active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(newsletter.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Switch
                              checked={newsletter.active}
                              onCheckedChange={(checked) => toggleActive(newsletter.id, checked)}
                              size="sm"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(newsletter)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(newsletter.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}