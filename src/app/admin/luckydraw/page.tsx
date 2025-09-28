'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

interface LuckyDrawEntry {
  id: string
  name: string
  email: string
  phone: string
  isWinner: boolean
  drawDate?: string
  prize?: string
  notified: boolean
  createdAt: string
  updatedAt: string
}

interface DrawResult {
  winners: LuckyDrawEntry[]
  drawDate: string
  prize: string
}

export default function AdminLuckyDraw() {
  const [entries, setEntries] = useState<LuckyDrawEntry[]>([])
  const [winners, setWinners] = useState<LuckyDrawEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [filters, setFilters] = useState({
    isWinner: '',
    search: ''
  })
  const [drawConfig, setDrawConfig] = useState({
    prize: 'Free Consultation',
    numberOfWinners: 1
  })

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [filters])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token || !user) {
      window.location.href = '/admin'
      return
    }
  }

  const fetchData = async () => {
    await Promise.all([fetchEntries(), fetchWinners()])
  }

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/luckydraw/entries?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
      toast({
        title: "Error",
        description: "Failed to load lucky draw entries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchWinners = async () => {
    try {
      const response = await fetch('/api/luckydraw/entries?isWinner=true')
      if (response.ok) {
        const data = await response.json()
        setWinners(data.entries || [])
      }
    } catch (error) {
      console.error('Error fetching winners:', error)
    }
  }

  const runDraw = async () => {
    if (!confirm(`Are you sure you want to run a lucky draw with ${drawConfig.numberOfWinners} winner(s)?\nPrize: ${drawConfig.prize}`)) {
      return
    }

    setIsDrawing(true)
    
    try {
      // Add some animation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const response = await fetch('/api/luckydraw/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prize: drawConfig.prize,
          numberOfWinners: drawConfig.numberOfWinners
        }),
      })

      if (response.ok) {
        const result: DrawResult = await response.json()
        
        toast({
          title: "🎉 Draw Complete!",
          description: `Successfully selected ${result.winners.length} winner(s) for "${result.prize}"`,
        })
        
        setWinners(prev => [...prev, ...result.winners])
        fetchEntries()
      } else {
        throw new Error('Failed to run draw')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run lucky draw. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDrawing(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Winner', 'Prize', 'Draw Date', 'Notified', 'Entry Date']
    
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        entry.name,
        entry.email,
        entry.phone,
        entry.isWinner ? 'Yes' : 'No',
        entry.prize || '',
        entry.drawDate ? new Date(entry.drawDate).toLocaleDateString() : '',
        entry.notified ? 'Yes' : 'No',
        new Date(entry.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lucky_draw_entries_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilters({
      isWinner: '',
      search: ''
    })
  }

  const totalEntries = entries.length
  const totalWinners = entries.filter(e => e.isWinner).length
  const recentEntries = entries.filter(e => {
    const entryDate = new Date(e.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate > weekAgo
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
              <h1 className="text-2xl font-bold text-gray-900">Lucky Draw Management</h1>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <span className="text-2xl">🎯</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEntries}</div>
                <p className="text-xs text-muted-foreground">
                  {recentEntries} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Winners</CardTitle>
                <span className="text-2xl">🏆</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWinners}</div>
                <p className="text-xs text-muted-foreground">
                  {winners.filter(w => w.notified).length} notified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalEntries > 0 ? ((totalWinners / totalEntries) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  of total entries
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Draw Configuration */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Run New Draw</CardTitle>
                  <CardDescription>
                    Configure and run a new lucky draw
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prize">Prize</Label>
                    <Input
                      id="prize"
                      value={drawConfig.prize}
                      onChange={(e) => setDrawConfig({...drawConfig, prize: e.target.value})}
                      placeholder="Free Consultation"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="numberOfWinners">Number of Winners</Label>
                    <Input
                      id="numberOfWinners"
                      type="number"
                      min="1"
                      max="10"
                      value={drawConfig.numberOfWinners}
                      onChange={(e) => setDrawConfig({...drawConfig, numberOfWinners: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  
                  <Button 
                    onClick={runDraw}
                    disabled={isDrawing || totalEntries === 0}
                    className="w-full"
                  >
                    {isDrawing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Drawing...</span>
                      </div>
                    ) : (
                      <span>🎲 Run Lucky Draw</span>
                    )}
                  </Button>
                  
                  {totalEntries === 0 && (
                    <p className="text-sm text-red-600 text-center">
                      No entries available to draw from
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Winners */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Winners</CardTitle>
                  <CardDescription>
                    Latest lucky draw winners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {winners.length === 0 ? (
                      <p className="text-sm text-gray-600 text-center py-4">
                        No winners yet
                      </p>
                    ) : (
                      winners.slice(0, 10).map((winner) => (
                        <motion.div
                          key={winner.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{winner.name}</p>
                            <p className="text-xs text-gray-600">{winner.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              {winner.prize}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(winner.drawDate || winner.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Entries List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Lucky Draw Entries ({entries.length})</CardTitle>
                  <CardDescription>
                    Manage all lucky draw entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="isWinner">Filter by Status</Label>
                      <select
                        id="isWinner"
                        value={filters.isWinner}
                        onChange={(e) => setFilters({...filters, isWinner: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">All entries</option>
                        <option value="true">Winners only</option>
                        <option value="false">Non-winners only</option>
                      </select>
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
                  
                  <div className="mb-4 flex justify-end">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>

                  {/* Entries List */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-600">Loading entries...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {entries.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600">No lucky draw entries found.</p>
                        </div>
                      ) : (
                        entries.map((entry) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                              entry.isWinner ? 'bg-yellow-50 border-yellow-200' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold">{entry.name}</h3>
                                  {entry.isWinner && (
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                      🏆 Winner
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">Email:</span> {entry.email}
                                  </div>
                                  <div>
                                    <span className="font-medium">Phone:</span> {entry.phone}
                                  </div>
                                </div>
                                
                                {entry.isWinner && (
                                  <div className="mt-2 p-2 bg-yellow-100 rounded text-sm">
                                    <div><span className="font-medium">Prize:</span> {entry.prize}</div>
                                    <div><span className="font-medium">Draw Date:</span> {new Date(entry.drawDate || '').toLocaleDateString()}</div>
                                    <div><span className="font-medium">Notified:</span> {entry.notified ? 'Yes' : 'No'}</div>
                                  </div>
                                )}
                                
                                <div className="text-xs text-gray-500 mt-2">
                                  Entered: {new Date(entry.createdAt).toLocaleString()}
                                </div>
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