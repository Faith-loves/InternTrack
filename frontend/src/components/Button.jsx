const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200',
  secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200',
  ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200',
}

function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
