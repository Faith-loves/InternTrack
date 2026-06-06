import { useQuery } from '@tanstack/react-query'
import { interviewService } from '../services/interviewService'

export function useInterviews() {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const { data } = await interviewService.getAll()
      return data
    },
  })
}
