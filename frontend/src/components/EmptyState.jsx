import Button from './Button'

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
        +
      </div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {actionLabel && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
