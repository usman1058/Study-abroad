'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  GraduationCap, 
  Globe, 
  Euro, 
  Clock, 
  Users, 
  Star,
  Filter,
  Search,
  ExternalLink,
  Phone,
  MapPin,
  Award,
  BookOpen,
  CheckCircle,
  FileText,
  ListOrdered,
  Target,
  Heart,
  Coffee,
  Palette
} from 'lucide-react'

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
}

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

interface Documentation {
  id: string
  title: string
  description: string
  category: string
  country: string
  required: boolean
  order: number
}

interface ProcessStep {
  id: string
  title: string
  description: string
  stepNumber: number
  country: string
  timeline?: string
  tips?: string
}

interface Filters {
  degree: string
  tuitionRange: string
  studyMode: string
  duration: string
  featured: boolean
}

export default function StudyInItaly() {
  const [universities, setUniversities] = useState<University[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([])
  const [bachelorCourses, setBachelorCourses] = useState<Course[]>([])
  const [masterCourses, setMasterCourses] = useState<Course[]>([])
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [filters, setFilters] = useState<Filters>({
    degree: 'all',
    tuitionRange: 'all',
    studyMode: 'all',
    duration: 'all',
    featured: false
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [universities, filters, searchTerm])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch universities
      const uniResponse = await fetch('/api/universities?country=italy')
      if (uniResponse.ok) {
        const uniData = await uniResponse.json()
        setUniversities(uniData.universities || [])
      }

      // Fetch courses
      const bachelorResponse = await fetch('/api/courses?country=italy&degreeType=bachelor')
      if (bachelorResponse.ok) {
        const bachelorData = await bachelorResponse.json()
        setBachelorCourses(bachelorData.courses || [])
      }

      const masterResponse = await fetch('/api/courses?country=italy&degreeType=master')
      if (masterResponse.ok) {
        const masterData = await masterResponse.json()
        setMasterCourses(masterData.courses || [])
      }

      // Fetch documentation
      const docResponse = await fetch('/api/documentation?country=italy')
      if (docResponse.ok) {
        const docData = await docResponse.json()
        setDocumentation(docData.documentation || [])
      }

      // Fetch process steps
      const processResponse = await fetch('/api/process-steps?country=italy')
      if (processResponse.ok) {
        const processData = await processResponse.json()
        setProcessSteps(processData.processSteps || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = universities

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.featured) {
      filtered = filtered.filter(u => u.featured)
    }

    if (filters.studyMode !== 'all') {
      filtered = filtered.filter(u => 
        u.studyMode.toLowerCase().includes(filters.studyMode.toLowerCase())
      )
    }

    if (filters.duration !== 'all') {
      filtered = filtered.filter(u => 
        u.duration.toLowerCase().includes(filters.duration.toLowerCase())
      )
    }

    if (filters.tuitionRange !== 'all') {
      filtered = filtered.filter(u => {
        const tuition = u.tuitionFee.toLowerCase()
        if (filters.tuitionRange === 'low') {
          return tuition.includes('000') && !tuition.includes('20,000')
        }
        if (filters.tuitionRange === 'medium') {
          return tuition.includes('000') && tuition.includes('20,000') && !tuition.includes('30,000')
        }
        if (filters.tuitionRange === 'high') {
          return tuition.includes('30,000')
        }
        return true
      })
    }

    setFilteredUniversities(filtered)
  }

  const handleContactClick = (universityId: string) => {
    sessionStorage.setItem('selectedUniversity', universityId)
    window.location.href = '/contact'
  }

  const getTuitionRange = (tuition: string): string => {
    const num = parseInt(tuition.replace(/[^0-9]/g, ''))
    if (num < 20000) return 'low'
    if (num < 30000) return 'medium'
    return 'high'
  }

  const stats = [
    { icon: <GraduationCap className="w-6 h-6" />, value: "90+", label: "Universities" },
    { icon: <Heart className="w-6 h-6" />, value: "Top 10", label: "Art & Design" },
    { icon: <Users className="w-6 h-6" />, value: "100K+", label: "International Students" },
    { icon: <Award className="w-6 h-6" />, value: "Ancient", label: "Heritage" }
  ]

  const benefits = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Rich Cultural Heritage",
      description: "Study in the birthplace of Renaissance with unparalleled artistic and historical treasures."
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Exceptional Lifestyle",
      description: "Experience the famous Italian 'dolce vita' with amazing food, fashion, and quality of life."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Strategic Location",
      description: "Perfect location in Europe with easy access to travel and explore other countries."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Academic Excellence",
      description: "World-renowned universities especially in arts, design, architecture, and engineering."
    }
  ]

  const docCategories = {
    visa: { icon: <FileText className="w-6 h-6" />, title: "Visa Requirements", color: "green" },
    academic: { icon: <GraduationCap className="w-6 h-6" />, title: "Academic Documents", color: "blue" },
    financial: { icon: <Euro className="w-6 h-6" />, title: "Financial Proof", color: "yellow" },
    accommodation: { icon: <MapPin className="w-6 h-6" />, title: "Accommodation", color: "purple" }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <AnimatedBackground />
      <InteractiveFloatingElements count={4} />
      
      {/* Navigation */}
      <GlobalNavigation currentPath="/study-in-italy" />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-600/10"></div>
        
        <div className="max-w-7xl mx-auto text-center z-10 relative">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-lg">
                <Heart className="w-4 h-4 mr-2" />
                Cultural Excellence
              </Badge>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Study in
              </span>
              <br />
              <span className="text-gray-900">Italy</span>
            </motion.h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto">
              Discover world-class education in the heart of Europe. Italy offers 
              exceptional universities, rich culture, and unforgettable experiences in the birthplace of Renaissance.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Enhanced3DCard>
                <MicroInteractionButton
                  onClick={() => window.location.href = '/contact'}
                  size="lg"
                  className="px-12 py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Get Guidance for Italian Universities
                </MicroInteractionButton>
              </Enhanced3DCard>
              
              <Enhanced3DCard>
                <MicroInteractionButton
                  onClick={() => document.getElementById('study-sections')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  size="lg"
                  className="px-12 py-4 text-lg border-2 border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Explore Study Options
                </MicroInteractionButton>
              </Enhanced3DCard>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={0.5}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex justify-center mb-3 text-green-600">
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

      {/* Benefits Section */}
      <ParallaxContainer speed={0.2}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Study in Italy?</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Italy offers an exceptional combination of academic excellence, cultural richness, and Mediterranean lifestyle.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <Enhanced3DCard>
                    <Card className="h-full text-center p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white">
                          {benefit.icon}
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-3">{benefit.title}</CardTitle>
                      <CardDescription className="text-gray-600">{benefit.description}</CardDescription>
                    </Card>
                  </Enhanced3DCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ParallaxContainer>

      {/* Study Sections */}
      <section id="study-sections" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Complete Italy Study Guide</h2>
              <p className="text-xl text-gray-600">Everything you need to know about studying in Italy</p>
            </div>
          </ScrollReveal>

          <Tabs defaultValue="universities" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="universities" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Universities
              </TabsTrigger>
              <TabsTrigger value="bachelor" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Bachelor's
              </TabsTrigger>
              <TabsTrigger value="master" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Master's
              </TabsTrigger>
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="process" className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4" />
                Process
              </TabsTrigger>
            </TabsList>

            {/* Universities Tab */}
            <TabsContent value="universities" className="space-y-6">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Top Italian Universities</h3>
                  <p className="text-lg text-gray-600">Discover prestigious universities across Italy</p>
                </div>
              </ScrollReveal>

              {/* Search and Filters */}
              <ScrollReveal direction="up" delay={0.3}>
                <Card className="mb-8 bg-gray-50 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                      <div className="lg:col-span-2">
                        <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search Universities</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="search"
                            placeholder="Search by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="degree" className="text-sm font-medium mb-2 block">Degree Level</Label>
                        <Select onValueChange={(value) => setFilters({...filters, degree: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Degrees" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Degrees</SelectItem>
                            <SelectItem value="bachelor">Bachelor's</SelectItem>
                            <SelectItem value="master">Master's</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="tuition" className="text-sm font-medium mb-2 block">Tuition Range</Label>
                        <Select onValueChange={(value) => setFilters({...filters, tuitionRange: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Ranges" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Ranges</SelectItem>
                            <SelectItem value="low">Under €20,000</SelectItem>
                            <SelectItem value="medium">€20,000 - €30,000</SelectItem>
                            <SelectItem value="high">Over €30,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={filters.featured}
                            onChange={(e) => setFilters({...filters, featured: e.target.checked})}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <Label htmlFor="featured" className="text-sm font-medium">Featured Only</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {filteredUniversities.length} universities found
                      </div>
                      <Button variant="outline" onClick={fetchData} className="flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span>Reset Filters</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Universities List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Loading universities...</p>
                </div>
              ) : (
                <>
                  {filteredUniversities.length === 0 ? (
                    <ScrollReveal direction="up" delay={0.4}>
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎓</div>
                        <p className="text-gray-600 text-lg mb-4">No universities found matching your criteria.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setFilters({
                              degree: 'all',
                              tuitionRange: 'all',
                              studyMode: 'all',
                              duration: 'all',
                              featured: false
                            })
                            setSearchTerm('')
                          }}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </ScrollReveal>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredUniversities.map((university, index) => (
                        <ScrollReveal key={university.id} direction="up" delay={index * 0.1}>
                          <Enhanced3DCard>
                            <Card className="h-full flex flex-col bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                              <CardHeader className="pb-4">
                                <div className="flex items-start justify-between mb-3">
                                  <CardTitle className="text-lg line-clamp-2">{university.name}</CardTitle>
                                  {university.featured && (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                      <Star className="w-3 h-3 mr-1" />
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <CardDescription className="text-sm line-clamp-3">
                                  {university.description}
                                </CardDescription>
                              </CardHeader>
                              
                              <CardContent className="flex-1 flex flex-col">
                                <div className="space-y-3 text-sm mb-6">
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center text-gray-600">
                                      <Clock className="w-4 h-4 mr-2" />
                                      Duration:
                                    </span>
                                    <span className="font-medium">{university.duration}</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center text-gray-600">
                                      <Euro className="w-4 h-4 mr-2" />
                                      Tuition:
                                    </span>
                                    <span className="font-medium">{university.tuitionFee}</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center text-gray-600">
                                      <Users className="w-4 h-4 mr-2" />
                                      Study Mode:
                                    </span>
                                    <span className="font-medium">{university.studyMode}</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center text-gray-600">
                                      <BookOpen className="w-4 h-4 mr-2" />
                                      English Test:
                                    </span>
                                    <span className="font-medium">{university.englishTest}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-auto space-y-3">
                                  {university.website && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="w-full"
                                      onClick={() => window.open(university.website, '_blank')}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Visit Website
                                    </Button>
                                  )}
                                  
                                  <MicroInteractionButton 
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                    onClick={() => handleContactClick(university.id)}
                                  >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Apply Now
                                  </MicroInteractionButton>
                                </div>
                              </CardContent>
                            </Card>
                          </Enhanced3DCard>
                        </ScrollReveal>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Bachelor's Courses Tab */}
            <TabsContent value="bachelor" className="space-y-6">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Bachelor's Degree Programs</h3>
                  <p className="text-lg text-gray-600">3-year undergraduate programs across various disciplines</p>
                </div>
              </ScrollReveal>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Loading courses...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {bachelorCourses.map((course, index) => (
                    <ScrollReveal key={course.id} direction="up" delay={index * 0.1}>
                      <Enhanced3DCard>
                        <Card className="h-full flex flex-col bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between mb-3">
                              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                              {course.featured && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-sm line-clamp-3">
                              {course.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="flex-1 flex flex-col">
                            <div className="space-y-3 text-sm mb-6">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Duration:
                                </span>
                                <span className="font-medium">{course.duration}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="flex items-center text-gray-600">
                                  <Euro className="w-4 h-4 mr-2" />
                                  Tuition:
                                </span>
                                <span className="font-medium">{course.tuitionFee}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="flex items-center text-gray-600">
                                  <GraduationCap className="w-4 h-4 mr-2" />
                                  University:
                                </span>
                                <span className="font-medium">{course.university?.name}</span>
                              </div>
                            </div>
                            
                            <div className="mt-auto">
                              <MicroInteractionButton 
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                onClick={() => handleContactClick(course.universityId)}
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Inquire Now
                              </MicroInteractionButton>
                            </div>
                          </CardContent>
                        </Card>
                      </Enhanced3DCard>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Master's Courses Tab */}
            <TabsContent value="master" className="space-y-6">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Master's Degree Programs</h3>
                  <p className="text-lg text-gray-600">2-year postgraduate programs for advanced specialization</p>
                </div>
              </ScrollReveal>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Loading courses...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {masterCourses.map((course, index) => (
                    <ScrollReveal key={course.id} direction="up" delay={index * 0.1}>
                      <Enhanced3DCard>
                        <Card className="h-full flex flex-col bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between mb-3">
                              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                              {course.featured && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-sm line-clamp-3">
                              {course.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="flex-1 flex flex-col">
                            <div className="space-y-3 text-sm mb-6">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Duration:
                                </span>
                                <span className="font-medium">{course.duration}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="flex items-center text-gray-600">
                                  <Euro className="w-4 h-4 mr-2" />
                                  Tuition:
                                </span>
                                <span className="font-medium">{course.tuitionFee}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="flex items-center text-gray-600">
                                  <GraduationCap className="w-4 h-4 mr-2" />
                                  University:
                                </span>
                                <span className="font-medium">{course.university?.name}</span>
                              </div>
                            </div>
                            
                            <div className="mt-auto">
                              <MicroInteractionButton 
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                onClick={() => handleContactClick(course.universityId)}
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Inquire Now
                              </MicroInteractionButton>
                            </div>
                          </CardContent>
                        </Card>
                      </Enhanced3DCard>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="documentation" className="space-y-6">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Required Documentation</h3>
                  <p className="text-lg text-gray-600">Complete guide to all documents needed for Italian study visa</p>
                </div>
              </ScrollReveal>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Loading documentation...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(docCategories).map(([categoryKey, categoryInfo]) => {
                    const categoryDocs = documentation.filter(doc => doc.category === categoryKey)
                    if (categoryDocs.length === 0) return null

                    return (
                      <ScrollReveal key={categoryKey} direction="up" delay={0.1}>
                        <Card className="h-full bg-white border-0 shadow-lg">
                          <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-12 h-12 bg-${categoryInfo.color}-100 rounded-full flex items-center justify-center text-${categoryInfo.color}-600`}>
                                {categoryInfo.icon}
                              </div>
                              <CardTitle className="text-xl">{categoryInfo.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {categoryDocs.map((doc) => (
                                <div key={doc.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                  <CheckCircle className={`w-5 h-5 mt-0.5 text-${doc.required ? 'green' : 'gray'}-500`} />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">{doc.title}</h4>
                                    <p className="text-sm text-gray-600">{doc.description}</p>
                                    {doc.required && (
                                      <Badge variant="destructive" className="mt-2 text-xs">Required</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="space-y-6">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">A to Z Application Process</h3>
                  <p className="text-lg text-gray-600">Step-by-step guide to your Italian study journey</p>
                </div>
              </ScrollReveal>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Loading process steps...</p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-6">
                    {processSteps.map((step, index) => (
                      <ScrollReveal key={step.id} direction="up" delay={index * 0.1}>
                        <Card className="bg-white border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex gap-6">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                                  {step.stepNumber}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                                  {step.timeline && (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                      {step.timeline}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-4">{step.description}</p>
                                {step.tips && (
                                  <div className="bg-green-50 p-4 rounded-lg">
                                    <h5 className="font-medium text-green-900 mb-2">💡 Pro Tips:</h5>
                                    <p className="text-sm text-green-800">{step.tips}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <ParallaxContainer speed={0.1}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up" delay={0.2}>
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Italian Education Journey?</h2>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Let our expert mentors guide you through every step of the application process. 
                From university selection to visa approval, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Enhanced3DCard>
                  <MicroInteractionButton
                    onClick={() => window.location.href = '/contact'}
                    size="lg"
                    className="px-12 py-4 text-lg bg-white text-green-600 hover:bg-gray-100 shadow-xl"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Get Free Consultation
                  </MicroInteractionButton>
                </Enhanced3DCard>
                
                <Enhanced3DCard>
                  <MicroInteractionButton
                    onClick={() => window.location.href = '/study-in-uk'}
                    variant="outline"
                    size="lg"
                    className="px-12 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-green-600"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Explore UK
                  </MicroInteractionButton>
                </Enhanced3DCard>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxContainer>
    </div>
  )
}