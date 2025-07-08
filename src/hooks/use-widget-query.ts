import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import type { BaseWidgetClass } from '../lib/widget-base'

export function useWidgetQuery<TData = any>(widget: BaseWidgetClass) {
  const queryClient = useQueryClient()
  
  const queryConfig = widget.getQueryConfig()
  
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: queryConfig.queryKey,
    queryFn: () => widget.fetchData(),
    enabled: queryConfig.enabled,
    staleTime: queryConfig.staleTime || 1000 * 60 * 5, // 5 minutes default
    refetchInterval: queryConfig.refetchInterval,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // Invalidate query when settings change
  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryConfig.queryKey })
  }, [queryClient, queryConfig.queryKey])

  // Manual refresh
  const refreshData = useCallback(() => {
    refetch()
  }, [refetch])

  return {
    data,
    isLoading,
    error,
    refetch: refreshData,
    invalidateQuery
  }
} 
