'use client'

import { useMemo, useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'

interface Equipment {
  id: number
  name: string
  type: string
  sell_price?: string
  buy_price?: string
  description?: string
}

interface EquipmentAttribute {
  id: number
  equipment_id: number
  label: string
  value: string | number
}

interface EquipmentDrop {
  id: number
  equipment_id: number
  monster_name: string
  monster_url: string
  monster_level: string
  location_name: string
  location_url: string
}

interface EquipmentCompleteView {
  equipment: Equipment
  attributes: EquipmentAttribute[]
  drops: EquipmentDrop[]
}

interface EquipmentDatabaseProps {
  initialData: EquipmentCompleteView[]
}

export default function EquipmentDatabase({ initialData }: EquipmentDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  const uniqueTypes = useMemo(() => {
    const types = initialData.map((i) => i.equipment.type).filter(Boolean)
    return [...new Set(types)].sort()
  }, [initialData])

  const filteredAndSortedData = useMemo(() => {
    const filtered = initialData.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === '' || item.equipment.type === typeFilter

      return matchesSearch && matchesType
    })

    filtered.sort((a, b) => {
      let cmp = 0

      // Helpers to read numeric values from attribute strings
      const readNumeric = (val: string | number): number => {
        if (typeof val === 'number') return val
        const m = String(val).match(/-?\d+(\.\d+)?/)
        return m ? parseFloat(m[0]) : Number.NaN
      }

      const attributeValue = (item: EquipmentCompleteView, labels: RegExp[]): number => {
        for (const attr of item.attributes) {
          for (const re of labels) {
            if (re.test(attr.label)) {
              const v = readNumeric(attr.value)
              if (!Number.isNaN(v)) return v
            }
          }
        }
        return Number.NaN
      }

      const compareWithNaN = (av: number, bv: number): number => {
        const aNaN = Number.isNaN(av)
        const bNaN = Number.isNaN(bv)
        if (aNaN && bNaN) return 0
        if (aNaN) return 1
        if (bNaN) return -1
        return av - bv
      }

      switch (sortBy) {
        case 'name':
          cmp = a.equipment.name.localeCompare(b.equipment.name)
          break
        case 'type':
          cmp = a.equipment.type.localeCompare(b.equipment.type)
          break
        case 'attrCount':
          cmp = a.attributes.length - b.attributes.length
          break
        case 'dropsCount':
          cmp = a.drops.length - b.drops.length
          break
        case 'atk': {
          const av = attributeValue(a, [/^(atk|attack|base atk|weapon atk)\b/i])
          const bv = attributeValue(b, [/^(atk|attack|base atk|weapon atk)\b/i])
          cmp = compareWithNaN(av, bv)
          break
        }
        case 'def': {
          const av = attributeValue(a, [/^(def|defense)\b/i])
          const bv = attributeValue(b, [/^(def|defense)\b/i])
          cmp = compareWithNaN(av, bv)
          break
        }
        case 'stability': {
          const av = attributeValue(a, [/^stability\b/i, /^stab\b/i])
          const bv = attributeValue(b, [/^stability\b/i, /^stab\b/i])
          cmp = compareWithNaN(av, bv)
          break
        }
        default:
          cmp = a.equipment.name.localeCompare(b.equipment.name)
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })

    return filtered
  }, [initialData, searchTerm, typeFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, typeFilter, sortBy, sortOrder])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setTypeFilter('')
    setSortBy('name')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <label
              htmlFor="search"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Search
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search equipment..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="typeFilter"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type
            </label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="sortBy"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="attrCount">Attributes Count</option>
                <option value="dropsCount">Drops Count</option>
                <option value="atk">ATK</option>
                <option value="def">DEF</option>
                <option value="stability">Stability</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={clearFilters}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              Clear Filters
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedData.length} of {initialData.length} items
            </div>
          </div>
        </div>
      </div>

      {currentData.length > 0 ? (
        <div className="space-y-6">
          {currentData.map((data) => (
            <EquipmentCard
              key={data.equipment.id}
              equipment={data.equipment}
              attributes={data.attributes}
              drops={data.drops}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white py-12 text-center dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No equipment match your current filters
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 text-blue-600 hover:underline dark:text-blue-400"
          >
            Clear filters to see all equipment
          </button>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredAndSortedData.length}
        itemsPerPage={itemsPerPage}
        itemName="equipment"
      />
    </div>
  )
}

function getTypeBadgeClass(type: string): string {
  const t = type.toLowerCase()
  // Distinct colors per weapon type
  if (/(^|\b)(1\s*hand(ed)?\s*sword|ohs)(\b|$)/.test(t)) {
    return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  }
  if (/(^|\b)(2\s*hand(ed)?\s*sword|ths)(\b|$)/.test(t)) {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
  }
  if (/\bbowgun\b/.test(t)) {
    return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
  }
  if (/\bbow\b/.test(t)) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
  }
  if (/\bstaff\b/.test(t)) {
    return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200'
  }
  if (/magic\s*device|\bmd\b/.test(t)) {
    return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
  }
  if (/\bknuckle(s)?\b/.test(t)) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  if (/\bhalberd\b/.test(t)) {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  }
  if (/\bkatana\b/.test(t)) {
    return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200'
  }
  if (/dual\s*sword/.test(t)) {
    return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
  }
  if (/(armor|armour|shield)/.test(t)) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  if (/additional/.test(t)) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  if (/special/.test(t)) {
    return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  }
  if (/enhancer|enhance/.test(t)) {
    return 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100'
  }
  if (/normal/.test(t)) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
}

function EquipmentCard({
  equipment,
  attributes,
  drops,
}: {
  equipment: Equipment
  attributes: EquipmentAttribute[]
  drops: EquipmentDrop[]
}) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{equipment.name}</h2>
        <div className="mt-2 flex items-center gap-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getTypeBadgeClass(
              equipment.type
            )}`}
          >
            {equipment.type}
          </span>
          {equipment.sell_price && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sell:{' '}
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {equipment.sell_price}
              </span>
            </span>
          )}
          {equipment.buy_price && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Buy:{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {equipment.buy_price}
              </span>
            </span>
          )}
        </div>
      </div>

      {equipment.description && (
        <div className="mb-4">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {equipment.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {attributes.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Attributes
            </h3>
            <div className="space-y-2">
              {attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-700"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {attr.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {String(attr.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {drops.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Drop Locations
            </h3>
            <div className="space-y-2">
              {drops.map((drop) => (
                <div
                  key={drop.id}
                  className="rounded border-l-4 border-purple-500 bg-gray-50 p-3 dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {drop.monster_url ? (
                        <a
                          href={drop.monster_url}
                          className="text-sm font-semibold text-purple-600 hover:underline dark:text-purple-400"
                        >
                          {drop.monster_name}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {drop.monster_name}
                        </span>
                      )}
                      {drop.monster_level && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          Lv. {drop.monster_level}
                        </span>
                      )}
                    </div>
                  </div>
                  {drop.location_name && (
                    <div className="mt-1">
                      {drop.location_url ? (
                        <a
                          href={drop.location_url}
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                        >
                          📍 {drop.location_name}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          📍 {drop.location_name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {attributes.length === 0 && drops.length === 0 && (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No additional information available</p>
        </div>
      )}
    </div>
  )
}
