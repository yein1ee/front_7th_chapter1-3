import { useEffect, useState } from 'react';

import { fetchHolidays } from '../../../shared/api/fetchHolidays';

/**
 * 캘린더 뷰 상태를 관리하는 커스텀 훅
 */
export const useCalendarView = () => {
  const [view, setView] = useState<'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  /**
   * 캘린더 네비게이션 (이전/다음 주 또는 월로 이동)
   */
  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else if (view === 'month') {
        newDate.setDate(1); // 항상 1일로 설정
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  /**
   * 현재 날짜가 변경될 때 공휴일 정보를 업데이트합니다.
   */
  useEffect(() => {
    setHolidays(fetchHolidays(currentDate));
  }, [currentDate]);

  return { view, setView, currentDate, setCurrentDate, holidays, navigate };
};
