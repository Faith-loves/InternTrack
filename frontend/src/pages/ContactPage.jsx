import { useForm } from 'react-hook-form'
import { Button, PublicPageShell, useToast } from '../components'
import api, { getApiErrorMessage } from '../services/api'

function ContactPage() {
  const { showToast } = useToast()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm()

  async function onSubmit(values) {
    try {
      await api.post('/contact', values)
      reset()
      showToast('Message sent successfully')
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to send message'), 'error')
    }
  }

  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Questions, feedback, or deployment help?"
      description="Send a message and the InternTrack team will get back to you. You can ask about setup, features, demos, or anything that feels unclear."
    >
      <section className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-panel p-7">
          <h2 className="text-2xl font-black text-white">Let us help you move faster.</h2>
          <p className="mt-4 leading-7 text-slate-300">
            Whether you are testing the project, reviewing it as a recruiter, or preparing it for deployment, this is the place to reach out.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <p><span className="font-bold text-emerald-300">Support:</span> setup, bugs, and deployment questions</p>
            <p><span className="font-bold text-emerald-300">Product:</span> feature feedback and workflow ideas</p>
            <p><span className="font-bold text-emerald-300">Recruiters:</span> demo account and project review</p>
          </div>
        </div>

        <form className="glass-panel grid gap-4 p-7" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Name</span>
            <input
              id="name"
              className="w-full rounded-md border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="mt-1.5 block text-sm text-rose-300">{errors.name.message}</span>}
          </label>

          <label htmlFor="email">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Email</span>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />
            {errors.email && <span className="mt-1.5 block text-sm text-rose-300">{errors.email.message}</span>}
          </label>

          <label htmlFor="message">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Message</span>
            <textarea
              id="message"
              className="min-h-36 w-full rounded-md border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && <span className="mt-1.5 block text-sm text-rose-300">{errors.message.message}</span>}
          </label>

          <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-white hover:bg-emerald-400">
            {isSubmitting ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      </section>
    </PublicPageShell>
  )
}

export default ContactPage
