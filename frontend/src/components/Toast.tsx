import { useState, useCallback, useEffect } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
const listeners = new Set<(toast: Omit<Toast, 'id'>) => void>()

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  listeners.forEach((fn) => fn({ message, type }))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++toastId
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    listeners.add(addToast)
    return () => {
      listeners.delete(addToast)
    }
  }, [addToast])

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-xl border shadow-lg animate-slide-up ${styles[toast.type]}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '📦', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
