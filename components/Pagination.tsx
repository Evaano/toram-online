'use client'

import { useState, useEffect } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
  itemName?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemName = 'items',
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage)

  useEffect(() => {
    setInputPage(currentPage)
  }, [currentPage])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const handlePageInputChange = (value: string) => {
    const page = parseInt(value)
    setInputPage(isNaN(page) ? currentPage : page)
  }

  const handlePageInputSubmit = () => {
    if (inputPage >= 1 && inputPage <= totalPages && inputPage !== currentPage) {
      onPageChange(inputPage)
    } else {
      setInputPage(currentPage)
    }
  }

  const handlePageInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit()
    }
  }

  if (totalPages <= 1) return null

  return (
    <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
      {/* Mobile Pagination */}
      <div className="flex items-center justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 10))}
          disabled={currentPage <= 10}
          className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5 5-5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 17l-5-5 5-5"
            />
          </svg>
          -10
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 10))}
          disabled={currentPage > totalPages - 10}
          className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          +10
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7l5 5-5 5" />
          </svg>
        </button>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden items-center justify-between sm:flex">
        <div className="flex items-center space-x-2">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
            title="First page"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5 5-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 17l-5-5 5-5"
              />
            </svg>
          </button>

          {/* Previous 10 */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 10))}
            disabled={currentPage <= 10}
            className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
            title="Previous 10 pages"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            10
          </button>

          {/* Previous */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
            title="Previous page"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Prev
          </button>
        </div>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
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
                onClick={() => onPageChange(pageNum)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  currentPage === pageNum
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <div className="flex items-center space-x-2">
          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
            title="Next page"
          >
            Next
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Next 10 */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 10))}
            disabled={currentPage > totalPages - 10}
            className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
            title="Next 10 pages"
          >
            10
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
            title="Last page"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5-5 5"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Page Info and Custom Page Input */}
      <div className="mt-4 flex flex-col items-center justify-between space-y-3 border-t border-gray-200 pt-4 sm:flex-row sm:space-y-0 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1}-{endIndex} of {totalItems} {itemName}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={(e) => handlePageInputChange(e.target.value)}
            onBlur={handlePageInputSubmit}
            onKeyPress={handlePageInputKeyPress}
            className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">of {totalPages}</span>
        </div>
      </div>
    </div>
  )
}
