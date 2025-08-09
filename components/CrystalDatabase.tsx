'use client'

import { useState, useMemo, useEffect } from 'react'
import CrystalCard from './CrystalCard'

interface Crystal {
  id: number
  name: string
  type: string
  sell_price: string
  process_cost: string
  description: string
}

interface CrystalStat {
  id: number
  crystal_id: number
  stat_name: string
  stat_value: number
  is_upgrade_specific: boolean
  upgrade_type: string
}

interface CrystalDrop {
  id: number
  crystal_id: number
  monster_name: string
  monster_url: string
  monster_level: string
  location_name: string
  location_url: string
}

interface CrystalUsage {
  id: number
  crystal_id: number
  usage_type: string
  item_name: string
  item_url: string
  location_name: string
  location_url: string
}

interface CrystalCompleteView {
  crystal: Crystal
  stats: CrystalStat[]
  drops: CrystalDrop[]
  usage: CrystalUsage[]
}

interface CrystalDatabaseProps {
  initialData: CrystalCompleteView[]
}

export default function CrystalDatabase({ initialData }: CrystalDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statFilter, setStatFilter] = useState('')
  const [usageFilter, setUsageFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Get unique values for filters
  const uniqueTypes = useMemo(() => {
    const types = initialData.map(item => item.crystal.type).filter(Boolean)
    return [...new Set(types)].sort()
  }, [initialData])

  const uniqueStats = useMemo(() => {
    const stats = initialData.flatMap(item => item.stats.map(stat => stat.stat_name))
    return [...new Set(stats)].sort()
  }, [initialData])

  const uniqueUsageTypes = useMemo(() => {
    const usageTypes = initialData.flatMap(item => item.usage.map(usage => usage.usage_type))
    return [...new Set(usageTypes)].filter(Boolean).sort()
  }, [initialData])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = initialData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.crystal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.crystal.type.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === '' || item.crystal.type === typeFilter
      
      const matchesStat = statFilter === '' || 
        item.stats.some(stat => stat.stat_name === statFilter)
      
      const matchesUsage = usageFilter === '' || 
        item.usage.some(usage => usage.usage_type === usageFilter)

      return matchesSearch && matchesType && matchesStat && matchesUsage
    })

    // Sort data
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.crystal.name.localeCompare(b.crystal.name)
          break
        case 'type':
          comparison = a.crystal.type.localeCompare(b.crystal.type)
          break
        case 'statsCount':
          comparison = a.stats.length - b.stats.length
          break
        case 'dropsCount':
          comparison = a.drops.length - b.drops.length
          break
        case 'usageCount':
          comparison = a.usage.length - b.usage.length
          break
        default:
          comparison = a.crystal.name.localeCompare(b.crystal.name)
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [initialData, searchTerm, typeFilter, statFilter, usageFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, typeFilter, statFilter, usageFilter, sortBy, sortOrder])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setTypeFilter('')
    setStatFilter('')
    setUsageFilter('')
    setSortBy('name')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search crystals..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Stat Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Has Stat
            </label>
            <select
              value={statFilter}
              onChange={(e) => setStatFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Stats</option>
              {uniqueStats.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          {/* Usage Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Used For
            </label>
            <select
              value={usageFilter}
              onChange={(e) => setUsageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Uses</option>
              {uniqueUsageTypes.map(usage => (
                <option key={usage} value={usage}>{usage}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and Actions */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="statsCount">Stats Count</option>
                <option value="dropsCount">Drops Count</option>
                <option value="usageCount">Usage Count</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear Filters
            </button>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedData.length} of {initialData.length} crystals
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {currentData.length > 0 ? (
        <div className="space-y-6">
          {currentData.map((data) => (
            <CrystalCard
              key={data.crystal.id}
              crystal={data.crystal}
              stats={data.stats}
              drops={data.drops}
              usage={data.usage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No crystals match your current filters</p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear filters to see all crystals
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 text-sm border rounded-md ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
          
          <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  )
}