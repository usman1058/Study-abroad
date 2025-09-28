'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import GlobalNavigation from '@/components/GlobalNavigation'
import {
  Enhanced3DCard,
  ScrollReveal,
  ParallaxContainer,
  MicroInteractionButton,
  InteractiveFloatingElements
} from '@/components/animations/ReactBitsIntegration'
import { AnimatedBackground } from '@/components/animations'
import { 
  Calendar, 
  User, 
  Search, 
  Filter,
  Clock,
  Eye,
  Heart,
  Share2,
  BookOpen,
  ArrowRight,
  Tag
} from 'lucide-react'

interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  updatedAt: string
  status: 'published' | 'draft'
  featured: boolean
  category: string
  tags: string[]
  readTime: number
  views: number
  likes: number
  coverImage?: string
}

interface Filters {
  category: string
  status: string
  sortBy: string
  featured: boolean
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    status: 'published',
    sortBy: 'latest',
    featured: false
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [blogs, filters, searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blogs')
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast({
        title: "Error",
        description: "Failed to load blogs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = blogs.filter(blog => blog.status === 'published')

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(blog => blog.category === filters.category)
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(blog => blog.featured)
    }

    // Sort
    switch (filters.sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'most_liked':
        filtered.sort((a, b) => b.likes - a.likes)
        break
    }

    setFilteredBlogs(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadTime = (minutes: number) => {
    if (minutes < 1) return 'Less than 1 min read'
    if (minutes === 1) return '1 min read'
    return `${minutes} min read`
  }

  const categories = Array.from(new Set(blogs.map(blog => blog.category)))
  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)))

  const stats = [
    { icon: <BookOpen className="w-6 h-6" />, value: blogs.length, label: "Total Articles" },
    { icon: <User className="w-6 h-6" />, value: new Set(blogs.map(blog => blog.author)).size, label: "Authors" },
    { icon: <Eye className="w-6 h-6" />, value: blogs.reduce((sum, blog) => sum + blog.views, 0), label: "Total Views" },
    { icon: <Heart className="w-6 h-6" />, value: blogs.reduce((sum, blog) => sum + blog.likes, 0), label: "Total Likes" }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <AnimatedBackground />
      <InteractiveFloatingElements count={4} />
      
      {/* Navigation */}
      <GlobalNavigation currentPath="/blog" />

      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10"></div>
        
        <div className="max-w-7xl mx-auto text-center z-10 relative">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Latest Insights
              </Badge>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Study Abroad
              </span>
              <br />
              <span className="text-gray-900">Blog</span>
            </motion.h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto">
              Discover the latest insights, tips, and stories about studying abroad. 
              From university guides to student experiences, we've got you covered.
            </p>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex justify-center mb-3 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="most_liked">Most Liked</SelectItem>
                  </SelectContent>
                </Select>

                {/* Featured Filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={filters.featured}
                    onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Only
                  </label>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <ScrollReveal key={blog.id} direction="up" delay={index * 0.1}>
                  <Enhanced3DCard>
                    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group cursor-pointer">
                      {/* Cover Image */}
                      {blog.coverImage && (
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {blog.featured && (
                            <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                              Featured
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <CardContent className="flex-1 p-6 flex flex-col">
                        {/* Category and Tags */}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {blog.category}
                          </Badge>
                          {blog.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Title */}
                        <CardTitle className="text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </CardTitle>

                        {/* Excerpt */}
                        <CardDescription className="text-gray-600 mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </CardDescription>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(blog.publishedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{getReadTime(blog.readTime)}</span>
                          </div>
                        </div>

                        {/* Stats and Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{blog.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{blog.likes}</span>
                            </div>
                          </div>
                          
                          <MicroInteractionButton
                            onClick={() => window.location.href = `/blog/${blog.id}`}
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </MicroInteractionButton>
                        </div>
                      </CardContent>
                    </Card>
                  </Enhanced3DCard>
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}