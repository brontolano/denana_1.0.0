import { useState, useEffect } from 'react'

export function LoadingSkeleton() {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 animate-pulse">Memuat{dots}</p>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mt-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  )
}

export function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[1, 2, 3].map((row) => (
          <div key={row} className="p-4">
            <div className="flex gap-4">
              {[...Array(columns)].map((_, col) => (
                <div key={col} className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
        </div>
      ))}
      <div className="h-10 w-full bg-gray-100 rounded animate-pulse mt-6"></div>
    </div>
  )
}
