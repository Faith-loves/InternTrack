import { useQuery } from '@tanstack/react-query'
import { interviewService } from '../services/interviewService'
import { isDemoSession } from '../utils/authStorage'
import { demoInterviews } from '../utils/demoData'

export function useInterviews() {
  const isDemo = isDemoSession()

  return useQuery({
    queryKey: ['interviews', isDemo ? 'demo' : 'live'],
    queryFn: async () => {
      if (isDemo) return demoInterviews

      const { data } = await interviewService.getAll()
      return data
    },
  })
}
