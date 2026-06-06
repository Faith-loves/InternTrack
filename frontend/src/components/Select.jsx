function Select({ label, id, options = [], className = '', error, ...props }) {
  return (
    <label className="block" htmlFor={id}>
      {label && <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>}
      <select
        id={id}
        className={`w-full min-w-0 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1.5 block text-sm text-rose-600">{error}</span>}
    </label>
  )
}

export default Select
