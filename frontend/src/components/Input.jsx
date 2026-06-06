function Input({ label, id, className = '', error, ...props }) {
  return (
    <label className="block" htmlFor={id}>
      {label && <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>}
      <input
        id={id}
        className={`w-full min-w-0 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      />
      {error && <span className="mt-1.5 block text-sm text-rose-600">{error}</span>}
    </label>
  )
}

export default Input
