import { Link } from 'react-router-dom'
import { Button } from '../components'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
      <section>
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">404</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>Go home</Button>
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage
