import { useMemo, useState } from 'react'
import ToastContext from './toastContext'

const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const value = useMemo(() => ({
    showToast(message, tone = 'success') {
      const id = crypto.randomUUID()
      setToasts((items) => [...items, { id, message, tone }])
      window.setTimeout(() => {
        setToasts((items) => items.filter((item) => item.id !== id))
      }, 3500)
    },
  }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 grid w-[min(360px,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-sm ${toneClasses[toast.tone] || toneClasses.info}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
