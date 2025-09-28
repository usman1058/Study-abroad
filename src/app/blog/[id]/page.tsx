'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import GlobalNavigation from '@/components/GlobalNavigation'
import {
  ScrollReveal,
  MicroInteractionButton,
  InteractiveFloatingElements
} from '@/components/animations/ReactBitsIntegration'
import { AnimatedBackground } from '@/components/animations'
import { 
  Calendar, 
  User, 
  Clock,
  Eye,
  Heart,
  Share2,
  BookOpen,
  ArrowLeft,
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

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const blogId = params.id as string
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (blogId) {
      fetchBlog()
    }
  }, [blogId])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blogs/${blogId}`)
      if (response.ok) {
        const data = await response.json()
        setBlog(data.blog)
      } else {
        toast({
          title: "Error",
          description: "Blog post not found.",
          variant: "destructive",
        })
        router.push('/blog')
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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

  const handleLike = () => {
    if (!liked) {
      setLiked(true)
      if (blog) {
        setBlog(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)
      }
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Blog post link has been copied to clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNavigation currentPath="/blog" />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNavigation currentPath="/blog" />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/blog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <AnimatedBackground />
      <InteractiveFloatingElements count={4} />
      
      {/* Navigation */}
        <GlobalNavigation currentPath={`/blog/${blogId}`} />

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <ScrollReveal direction="up" delay={0.1}>
          <MicroInteractionButton
            onClick={() => router.push('/blog')}
            variant="ghost"
            className="mb-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </MicroInteractionButton>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal direction="up" delay={0.2}>
          <header className="mb-12">
            {/* Category and Featured Badge */}
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="text-sm">
                {blog.category}
              </Badge>
              {blog.featured && (
                <Badge className="bg-yellow-500 text-white text-sm">
                  Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {blog.title}
            </motion.h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{getReadTime(blog.readTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{blog.views} views</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Cover Image */}
            {blog.coverImage && (
              <motion.div 
                className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <img 
                  src={blog.coverImage} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </header>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal direction="up" delay={0.5}>
          <motion.div 
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </motion.div>
        </ScrollReveal>

        {/* Engagement Section */}
        <ScrollReveal direction="up" delay={0.7}>
          <motion.div 
            className="mt-16 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <MicroInteractionButton
                  onClick={handleLike}
                  variant="ghost"
                  className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{blog.likes + (liked ? 1 : 0)}</span>
                </MicroInteractionButton>

                <MicroInteractionButton
                  onClick={handleShare}
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </MicroInteractionButton>
              </div>

              <div className="text-sm text-gray-500">
                Last updated: {formatDate(blog.updatedAt)}
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Related Articles */}
        <ScrollReveal direction="up" delay={0.9}>
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placeholder for related articles */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">Study Tips</Badge>
                  <h3 className="text-lg font-semibold mb-2">How to Prepare for University Applications</h3>
                  <p className="text-gray-600 text-sm mb-4">Essential tips and strategies for successful university applications...</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>5 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">Student Life</Badge>
                  <h3 className="text-lg font-semibold mb-2">Living Abroad: A Student's Guide</h3>
                  <p className="text-gray-600 text-sm mb-4">Everything you need to know about living and studying in a foreign country...</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>8 min read</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </ScrollReveal>
      </article>
    </div>
  )
}