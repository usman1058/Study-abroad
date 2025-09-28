'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

interface University {
  id: string
  name: string
  country: string
  description: string
  duration: string
  tuitionFee: string
  applicationFee: string
  studyMode: string
  englishTest: string
  website?: string
  featured: boolean
  logo?: string
  createdAt: string
  updatedAt: string
}

export default function AdminUniversities() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    duration: '',
    tuitionFee: '',
    applicationFee: '',
    studyMode: '',
    englishTest: '',
    website: '',
    featured: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchUniversities()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token || !user) {
      window.location.href = '/admin'
      return
    }
  }

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities?limit=100')
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.universities || [])
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
      toast({
        title: "Error",
        description: "Failed to load universities",
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
      const url = isEditing && editingUniversity 
        ? `/api/universities/${editingUniversity.id}`
        : '/api/universities'
      
      const method = isEditing ? 'PUT' : 'POST'
      
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
          description: isEditing ? "University updated successfully" : "University created successfully",
        })
        resetForm()
        fetchUniversities()
      } else {
        throw new Error('Failed to save university')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save university. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (university: University) => {
    setEditingUniversity(university)
    setFormData({
      name: university.name,
      country: university.country,
      description: university.description,
      duration: university.duration,
      tuitionFee: university.tuitionFee,
      applicationFee: university.applicationFee,
      studyMode: university.studyMode,
      englishTest: university.englishTest,
      website: university.website || '',
      featured: university.featured
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) {
      return
    }

    try {
      const response = await fetch(`/api/universities/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "University deleted successfully",
        })
        fetchUniversities()
      } else {
        throw new Error('Failed to delete university')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete university. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      description: '',
      duration: '',
      tuitionFee: '',
      applicationFee: '',
      studyMode: '',
      englishTest: '',
      website: '',
      featured: false
    })
    setIsEditing(false)
    setEditingUniversity(null)
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
              <h1 className="text-2xl font-bold text-gray-900">University Management</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              View Site
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isEditing ? 'Edit University' : 'Add New University'}
                  </CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? 'Update the university information below'
                      : 'Create a new university entry'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">University Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="University of Example"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select onValueChange={(value) => setFormData({...formData, country: value})} value={formData.country}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Italy">Italy</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Brief description of the university..."
                        required
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="2 years"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="tuitionFee">Tuition Fee *</Label>
                      <Input
                        id="tuitionFee"
                        value={formData.tuitionFee}
                        onChange={(e) => setFormData({...formData, tuitionFee: e.target.value})}
                        placeholder="€15,000 per year"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="applicationFee">Application Fee *</Label>
                      <Input
                        id="applicationFee"
                        value={formData.applicationFee}
                        onChange={(e) => setFormData({...formData, applicationFee: e.target.value})}
                        placeholder="€50"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="studyMode">Study Mode *</Label>
                      <Select onValueChange={(value) => setFormData({...formData, studyMode: value})} value={formData.studyMode}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select study mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="englishTest">English Test Requirement *</Label>
                      <Input
                        id="englishTest"
                        value={formData.englishTest}
                        onChange={(e) => setFormData({...formData, englishTest: e.target.value})}
                        placeholder="IELTS 6.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://university.edu"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                      />
                      <Label htmlFor="featured">Featured University</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                      </Button>
                      {isEditing && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Universities List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Universities ({universities.length})</CardTitle>
                  <CardDescription>
                    Manage all universities in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-600">Loading universities...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {universities.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600">No universities found.</p>
                        </div>
                      ) : (
                        universities.map((university) => (
                          <motion.div
                            key={university.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{university.name}</h3>
                                  <Badge variant={university.featured ? "default" : "secondary"}>
                                    {university.country}
                                  </Badge>
                                  {university.featured && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{university.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Duration:</span> {university.duration}
                                  </div>
                                  <div>
                                    <span className="font-medium">Tuition:</span> {university.tuitionFee}
                                  </div>
                                  <div>
                                    <span className="font-medium">Study Mode:</span> {university.studyMode}
                                  </div>
                                  <div>
                                    <span className="font-medium">English Test:</span> {university.englishTest}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(university)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(university.id)}
                                >
                                  Delete
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}