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
  ListOrdered, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Clock,
  Lightbulb,
  Globe
} from 'lucide-react'

interface ProcessStep {
  id: string
  title: string
  description: string
  stepNumber: number
  country: string
  timeline?: string
  tips?: string
}

export default function ProcessStepsAdminPage() {
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [filteredProcessSteps, setFilteredProcessSteps] = useState<ProcessStep[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stepNumber: 1,
    country: '',
    timeline: '',
    tips: ''
  })

  useEffect(() => {
    fetchProcessSteps()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [processSteps, searchTerm, countryFilter])

  const fetchProcessSteps = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/process-steps')
      if (response.ok) {
        const data = await response.json()
        setProcessSteps(data.processSteps || [])
      }
    } catch (error) {
      console.error('Error fetching process steps:', error)
      toast({
        title: "Error",
        description: "Failed to load process steps. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = processSteps

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(s => s.country === countryFilter)
    }

    // Sort by step number
    filtered = filtered.sort((a, b) => a.stepNumber - b.stepNumber)

    setFilteredProcessSteps(filtered)
  }

  const handleSubmit = async () => {
    try {
      const url = editingStep ? `/api/process-steps/${editingStep.id}` : '/api/process-steps'
      const method = editingStep ? 'PUT' : 'POST'

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
          description: `Process step ${editingStep ? 'updated' : 'created'} successfully.`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchProcessSteps()
      } else {
        throw new Error(`Failed to ${editingStep ? 'update' : 'create'} process step`)
      }
    } catch (error) {
      console.error('Error saving process step:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingStep ? 'update' : 'create'} process step. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (step: ProcessStep) => {
    setEditingStep(step)
    setFormData({
      title: step.title,
      description: step.description,
      stepNumber: step.stepNumber,
      country: step.country,
      timeline: step.timeline || '',
      tips: step.tips || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this process step?')) return

    try {
      const response = await fetch(`/api/process-steps/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Process step deleted successfully.",
        })
        fetchProcessSteps()
      } else {
        throw new Error('Failed to delete process step')
      }
    } catch (error) {
      console.error('Error deleting process step:', error)
      toast({
        title: "Error",
        description: "Failed to delete process step. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingStep(null)
    setFormData({
      title: '',
      description: '',
      stepNumber: 1,
      country: '',
      timeline: '',
      tips: ''
    })
  }

  const stats = {
    total: processSteps.length,
    uk: processSteps.filter(s => s.country === 'uk').length,
    italy: processSteps.filter(s => s.country === 'italy').length,
    withTips: processSteps.filter(s => s.tips).length
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
          <h1 className="text-3xl font-bold">Process Steps</h1>
          <p className="text-gray-600 mt-2">Manage A to Z application process steps for students</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Process Step
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingStep ? 'Edit Process Step' : 'Add New Process Step'}</DialogTitle>
              <DialogDescription>
                {editingStep ? 'Update the process step information below.' : 'Create a new process step by filling out the form below.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., University Research"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the step..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stepNumber">Step Number *</Label>
                  <Input
                    id="stepNumber"
                    type="number"
                    value={formData.stepNumber}
                    onChange={(e) => setFormData({...formData, stepNumber: parseInt(e.target.value) || 1})}
                    placeholder="Step order"
                  />
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

              <div>
                <Label htmlFor="timeline">Timeline (Optional)</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  placeholder="e.g., 2-3 weeks"
                />
              </div>

              <div>
                <Label htmlFor="tips">Pro Tips (Optional)</Label>
                <Textarea
                  id="tips"
                  value={formData.tips}
                  onChange={(e) => setFormData({...formData, tips: e.target.value})}
                  placeholder="Helpful tips for students..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingStep ? 'Update Process Step' : 'Create Process Step'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UK Steps</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.uk}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Italy Steps</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.italy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Tips</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.withTips}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search process steps..."
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
          </div>
        </CardContent>
      </Card>

      {/* Process Steps Table */}
      <Card>
        <CardHeader>
          <CardTitle>Process Steps ({filteredProcessSteps.length})</CardTitle>
          <CardDescription>View and manage all application process steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step #</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Tips</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcessSteps.map((step) => (
                  <TableRow key={step.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {step.stepNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{step.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {step.country === 'uk' ? 'UK' : 'Italy'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {step.timeline ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <Badge variant="outline">{step.timeline}</Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {step.tips ? (
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          <Badge className="bg-yellow-100 text-yellow-800">Has Tips</Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(step)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(step.id)}
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

          {filteredProcessSteps.length === 0 && (
            <div className="text-center py-8">
              <ListOrdered className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No process steps found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}