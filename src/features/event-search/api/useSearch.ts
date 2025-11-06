import { useMemo, useState } from 'react';

import { Event } from '../../../../shared/types';
import { getFilteredEvents } from '../model/eventUtils';

/**
 * 일정 검색 기능을 제공하는 커스텀 훅
 */
export const useSearch = (events: Event[], currentDate: Date, view: 'week' | 'month') => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * 검색어와 뷰 타입에 따라 필터링된 일정 목록을 반환합니다.
   */
  const filteredEvents = useMemo(() => {
    return getFilteredEvents(events, searchTerm, currentDate, view);
  }, [events, searchTerm, currentDate, view]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};
