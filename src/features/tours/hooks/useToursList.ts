import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { TOURS_DETECTIONS_QUERY_KEY } from '../interfaces';
import type { TourPeriod } from '../interfaces';
import { fetchTourDetections } from '../services/tours.service';
import { groupToursByWeekday } from '../utils/group-tours-by-weekday';

export function useToursList(period: TourPeriod) {
  const query = useQuery({
    queryKey: [...TOURS_DETECTIONS_QUERY_KEY, period],
    queryFn: () => fetchTourDetections(period),
  });

  const weekDayGroups = useMemo(
    () => groupToursByWeekday(query.data ?? []),
    [query.data],
  );

  return {
    rows: query.data ?? [],
    weekDayGroups,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
