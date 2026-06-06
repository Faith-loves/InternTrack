import Button from './Button'

function Modal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <Button variant="ghost" className="px-3" onClick={onClose} aria-label="Close modal">
            x
          </Button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
