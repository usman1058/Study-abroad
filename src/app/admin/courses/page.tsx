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
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  BookOpen,
  Globe,
  Euro
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  degreeType: string
  duration: string
  tuitionFee: string
  requirements: string
  universityId: string
  country: string
  featured: boolean
  university?: {
    id: string
    name: string
    country: string
    logo?: string
  }
}

interface University {
  id: string
  name: string
  country: string
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [degreeFilter, setDegreeFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    degreeType: '',
    duration: '',
    tuitionFee: '',
    requirements: '',
    universityId: '',
    country: '',
    featured: false
  })

  useEffect(() => {
    fetchCourses()
    fetchUniversities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [courses, searchTerm, countryFilter, degreeFilter])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities')
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.universities || [])
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
    }
  }

  const applyFilters = () => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(c => c.country === countryFilter)
    }

    // Degree filter
    if (degreeFilter !== 'all') {
      filtered = filtered.filter(c => c.degreeType === degreeFilter)
    }

    setFilteredCourses(filtered)
  }

  const handleSubmit = async () => {
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses'
      const method = editingCourse ? 'PUT' : 'POST'

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
          description: `Course ${editingCourse ? 'updated' : 'created'} successfully.`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchCourses()
      } else {
        throw new Error(`Failed to ${editingCourse ? 'update' : 'create'} course`)
      }
    } catch (error) {
      console.error('Error saving course:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? 'update' : 'create'} course. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      degreeType: course.degreeType,
      duration: course.duration,
      tuitionFee: course.tuitionFee,
      requirements: course.requirements,
      universityId: course.universityId,
      country: course.country,
      featured: course.featured
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Course deleted successfully.",
        })
        fetchCourses()
      } else {
        throw new Error('Failed to delete course')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingCourse(null)
    setFormData({
      title: '',
      description: '',
      degreeType: '',
      duration: '',
      tuitionFee: '',
      requirements: '',
      universityId: '',
      country: '',
      featured: false
    })
  }

  const stats = {
    total: courses.length,
    bachelor: courses.filter(c => c.degreeType === 'bachelor').length,
    master: courses.filter(c => c.degreeType === 'master').length,
    featured: courses.filter(c => c.featured).length
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
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-600 mt-2">Manage bachelor's and master's degree programs</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update the course information below.' : 'Create a new course by filling out the form below.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <Label htmlFor="degreeType">Degree Type *</Label>
                  <Select value={formData.degreeType} onValueChange={(value) => setFormData({...formData, degreeType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelor">Bachelor's</SelectItem>
                      <SelectItem value="master">Master's</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Course description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 3 years, 1 year"
                  />
                </div>
                <div>
                  <Label htmlFor="tuitionFee">Tuition Fee *</Label>
                  <Input
                    id="tuitionFee"
                    value={formData.tuitionFee}
                    onChange={(e) => setFormData({...formData, tuitionFee: e.target.value})}
                    placeholder="e.g., £15,000/year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="universityId">University *</Label>
                  <Select value={formData.universityId} onValueChange={(value) => setFormData({...formData, universityId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities
                        .filter(u => !formData.country || u.country === formData.country)
                        .map(university => (
                          <SelectItem key={university.id} value={university.id}>
                            {university.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="Entry requirements..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Featured Course</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bachelor's</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.bachelor}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Master's</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.master}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <BookOpen className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
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
                placeholder="Search courses..."
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

            <Select value={degreeFilter} onValueChange={setDegreeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by degree type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Degrees</SelectItem>
                <SelectItem value="bachelor">Bachelor's</SelectItem>
                <SelectItem value="master">Master's</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses ({filteredCourses.length})</CardTitle>
          <CardDescription>View and manage all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      <Badge variant={course.degreeType === 'bachelor' ? 'default' : 'secondary'}>
                        {course.degreeType === 'bachelor' ? "Bachelor's" : "Master's"}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.university?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {course.country === 'uk' ? 'UK' : 'Italy'}
                      </div>
                    </TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-gray-400" />
                        {course.tuitionFee}
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
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

          {filteredCourses.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}