'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  GripVertical,
  CheckCircle,
  Globe
} from 'lucide-react'

interface Documentation {
  id: string
  title: string
  description: string
  category: string
  country: string
  required: boolean
  order: number
}

export default function DocumentationAdminPage() {
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [filteredDocumentation, setFilteredDocumentation] = useState<Documentation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    country: '',
    required: true,
    order: 0
  })

  useEffect(() => {
    fetchDocumentation()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [documentation, searchTerm, countryFilter, categoryFilter])

  const fetchDocumentation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documentation')
      if (response.ok) {
        const data = await response.json()
        setDocumentation(data.documentation || [])
      }
    } catch (error) {
      console.error('Error fetching documentation:', error)
      toast({
        title: "Error",
        description: "Failed to load documentation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = documentation

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(d => d.country === countryFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(d => d.category === categoryFilter)
    }

    setFilteredDocumentation(filtered)
  }

  const handleSubmit = async () => {
    try {
      const url = editingDoc ? `/api/documentation/${editingDoc.id}` : '/api/documentation'
      const method = editingDoc ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Documentation ${editingDoc ? 'updated' : 'created'} successfully.`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchDocumentation()
      } else {
        throw new Error(`Failed to ${editingDoc ? 'update' : 'create'} documentation`)
      }
    } catch (error) {
      console.error('Error saving documentation:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingDoc ? 'update' : 'create'} documentation. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (doc: Documentation) => {
    setEditingDoc(doc)
    setFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      country: doc.country,
      required: doc.required,
      order: doc.order
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this documentation item?')) return

    try {
      const response = await fetch(`/api/documentation/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Documentation deleted successfully.",
        })
        fetchDocumentation()
      } else {
        throw new Error('Failed to delete documentation')
      }
    } catch (error) {
      console.error('Error deleting documentation:', error)
      toast({
        title: "Error",
        description: "Failed to delete documentation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingDoc(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      country: '',
      required: true,
      order: 0
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      visa: 'Visa Requirements',
      academic: 'Academic Documents',
      financial: 'Financial Proof',
      accommodation: 'Accommodation'
    }
    return labels[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      visa: 'bg-blue-100 text-blue-800',
      academic: 'bg-green-100 text-green-800',
      financial: 'bg-yellow-100 text-yellow-800',
      accommodation: 'bg-purple-100 text-purple-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const stats = {
    total: documentation.length,
    uk: documentation.filter(d => d.country === 'uk').length,
    italy: documentation.filter(d => d.country === 'italy').length,
    required: documentation.filter(d => d.required).length
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
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="text-gray-600 mt-2">Manage required documents for study visa applications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Documentation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDoc ? 'Edit Documentation' : 'Add New Documentation'}</DialogTitle>
              <DialogDescription>
                {editingDoc ? 'Update the documentation information below.' : 'Create a new documentation item by filling out the form below.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Passport Copy"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description of the document..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa Requirements</SelectItem>
                      <SelectItem value="academic">Academic Documents</SelectItem>
                      <SelectItem value="financial">Financial Proof</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="italy">Italy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    placeholder="Display order"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="required"
                    checked={formData.required}
                    onChange={(e) => setFormData({...formData, required: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="required">Required Document</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingDoc ? 'Update Documentation' : 'Create Documentation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UK Documents</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.uk}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Italy Documents</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.italy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required</CardTitle>
            <CheckCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.required}</div>
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
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="italy">Italy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="visa">Visa Requirements</SelectItem>
                <SelectItem value="academic">Academic Documents</SelectItem>
                <SelectItem value="financial">Financial Proof</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation ({filteredDocumentation.length})</CardTitle>
          <CardDescription>View and manage all required documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocumentation.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(doc.category)}>
                        {getCategoryLabel(doc.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {doc.country === 'uk' ? 'UK' : 'Italy'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        {doc.order}
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.required ? (
                        <Badge variant="destructive">Required</Badge>
                      ) : (
                        <Badge variant="secondary">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(doc)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDocumentation.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documentation found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}