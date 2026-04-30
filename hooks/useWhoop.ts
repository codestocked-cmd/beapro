'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWhoopStatus, getWhoopDaily, getWhoopCorrelation, disconnectWhoop } from '@/lib/api/whoop'

export function useWhoopStatus() {
  return useQuery({
    queryKey: ['whoop', 'status'],
    queryFn: getWhoopStatus,
    staleTime: 1000 * 60 * 5,
  })
}

export function useWhoopDaily() {
  return useQuery({
    queryKey: ['whoop', 'daily'],
    queryFn: getWhoopDaily,
    staleTime: 1000 * 60 * 15,
    retry: 2,
  })
}

export function useWhoopCorrelation(days = 30) {
  return useQuery({
    queryKey: ['whoop', 'correlation', days],
    queryFn: () => getWhoopCorrelation(days),
    staleTime: 1000 * 60 * 30,
  })
}

export function useDisconnectWhoop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disconnectWhoop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whoop'] })
    },
  })
}
