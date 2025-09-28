'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

interface DashboardStats {
  totalUniversities: number
  featuredUniversities: number
  totalContacts: number
  unprocessedContacts: number
  totalLuckyDrawEntries: number
  winners: number
  totalNewsletters: number
  activeNewsletters: number
  totalB2BSubmissions: number
  unprocessedB2BSubmissions: number
  totalCourses: number
  totalBlogs: number
  publishedBlogs: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUniversities: 0,
    featuredUniversities: 0,
    totalContacts: 0,
    unprocessedContacts: 0,
    totalLuckyDrawEntries: 0,
    winners: 0,
    totalNewsletters: 0,
    activeNewsletters: 0,
    totalB2BSubmissions: 0,
    unprocessedB2BSubmissions: 0,
    totalCourses: 0,
    totalBlogs: 0,
    publishedBlogs: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token || !user) {
      window.location.href = '/admin'
      return
    }
    
    try {
      const userData = JSON.parse(user)
      if (userData.role !== 'admin') {
        window.location.href = '/admin'
        return
      }
    } catch (error) {
      window.location.href = '/admin'
      return
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch universities count
      const uniResponse = await fetch('/api/universities')
      const uniData = await uniResponse.json()
      const universities = uniData.universities || []
      
      // Fetch contacts count
      const contactsResponse = await fetch('/api/contact')
      const contactsData = await contactsResponse.json()
      const contacts = contactsData.submissions || []
      
      // Fetch lucky draw entries
      const entriesResponse = await fetch('/api/luckydraw/entries')
      const entriesData = await entriesResponse.json()
      const entries = entriesData.entries || []

      // Fetch newsletters
      const newslettersResponse = await fetch('/api/newsletters')
      const newslettersData = await newslettersResponse.json()
      const newsletters = newslettersData.newsletters || []

      // Fetch B2B submissions
      const b2bResponse = await fetch('/api/b2b')
      const b2bData = await b2bResponse.json()
      const b2bSubmissions = b2bData.b2bSubmissions || []

      // Fetch courses
      const coursesResponse = await fetch('/api/courses')
      const coursesData = await coursesResponse.json()
      const courses = coursesData.courses || []

      // Fetch blogs
      const blogsResponse = await fetch('/api/blogs')
      const blogsData = await blogsResponse.json()
      const blogs = blogsData.blogs || []

      setStats({
        totalUniversities: universities.length,
        featuredUniversities: universities.filter((u: any) => u.featured).length,
        totalContacts: contacts.length,
        unprocessedContacts: contacts.filter((c: any) => !c.processed).length,
        totalLuckyDrawEntries: entries.length,
        winners: entries.filter((e: any) => e.isWinner).length,
        totalNewsletters: newsletters.length,
        activeNewsletters: newsletters.filter((n: any) => n.active).length,
        totalB2BSubmissions: b2bSubmissions.length,
        unprocessedB2BSubmissions: b2bSubmissions.filter((b: any) => !b.processed).length,
        totalCourses: courses.length,
        totalBlogs: blogs.length,
        publishedBlogs: blogs.filter((b: any) => b.published).length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.location.href = '/admin'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative w-8 h-8">
                <img
                  src="/logo.svg"
                  alt="Admin Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/'}>
                View Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to the Study Abroad Mentor admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
              <span className="text-2xl">🎓</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUniversities}</div>
              <p className="text-xs text-muted-foreground">
                {stats.featuredUniversities} featured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
              <span className="text-2xl">📧</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unprocessedContacts} unprocessed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">B2B Submissions</CardTitle>
              <span className="text-2xl">🤝</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalB2BSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unprocessedB2BSubmissions} unprocessed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <span className="text-2xl">📚</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Bachelor's & Master's
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <span className="text-2xl">📝</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBlogs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedBlogs} published
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/universities'}>
            <CardHeader>
              <CardTitle className="text-lg">Manage Universities</CardTitle>
              <CardDescription>
                Add, edit, or remove universities from the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Universities
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/courses'}>
            <CardHeader>
              <CardTitle className="text-lg">Manage Courses</CardTitle>
              <CardDescription>
                Add, edit, or remove bachelor's and master's courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Courses
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/documentation'}>
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
              <CardDescription>
                Manage required documents for visa applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Documentation
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/process-steps'}>
            <CardHeader>
              <CardTitle className="text-lg">Process Steps</CardTitle>
              <CardDescription>
                Manage A to Z application process steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Process Steps
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/contacts'}>
            <CardHeader>
              <CardTitle className="text-lg">Contact Submissions</CardTitle>
              <CardDescription>
                View and manage contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Contacts
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/b2b'}>
            <CardHeader>
              <CardTitle className="text-lg">B2B Submissions</CardTitle>
              <CardDescription>
                Manage business-to-business partnership inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View B2B Submissions
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/luckydraw'}>
            <CardHeader>
              <CardTitle className="text-lg">Lucky Draw</CardTitle>
              <CardDescription>
                Manage lucky draw entries and run draws
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Lucky Draw
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/blogs'}>
            <CardHeader>
              <CardTitle className="text-lg">Blog Posts</CardTitle>
              <CardDescription>
                Manage blog content and publications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Blog Posts
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/newsletters'}>
            <CardHeader>
              <CardTitle className="text-lg">Newsletters</CardTitle>
              <CardDescription>
                Manage newsletter subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Newsletters
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/testimonials'}>
            <CardHeader>
              <CardTitle className="text-lg">Testimonials</CardTitle>
              <CardDescription>
                Manage student testimonials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Testimonials
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">New contact submission received</span>
                  </div>
                  <Badge variant="outline">Just now</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">University updated: Technical University of Munich</span>
                  </div>
                  <Badge variant="outline">2 hours ago</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">New lucky draw entry received</span>
                  </div>
                  <Badge variant="outline">5 hours ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}