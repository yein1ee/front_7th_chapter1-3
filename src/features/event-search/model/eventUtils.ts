import { Event } from '../../../shared/types';
import { getWeekDates, isDateInRange } from '../../../shared/utils/dateUtils';

/**
 * 날짜 범위에 해당하는 일정 목록을 필터링합니다.
 */
function filterEventsByDateRange(events: Event[], start: Date, end: Date): Event[] {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return isDateInRange(eventDate, start, end);
  });
}

/**
 * 문자열에 검색어가 포함되어 있는지 확인합니다 (대소문자 무시).
 */
function containsTerm(target: string, term: string) {
  return target.toLowerCase().includes(term.toLowerCase());
}

/**
 * 검색어로 일정을 필터링합니다 (제목, 설명, 위치에서 검색).
 */
function searchEvents(events: Event[], term: string) {
  return events.filter(
    ({ title, description, location }) =>
      containsTerm(title, term) || containsTerm(description, term) || containsTerm(location, term)
  );
}

/**
 * 주간 뷰에서 현재 주에 해당하는 일정을 필터링합니다.
 */
function filterEventsByDateRangeAtWeek(events: Event[], currentDate: Date) {
  const weekDates = getWeekDates(currentDate);
  return filterEventsByDateRange(events, weekDates[0], weekDates[6]);
}

/**
 * 월간 뷰에서 현재 월에 해당하는 일정을 필터링합니다.
 */
function filterEventsByDateRangeAtMonth(events: Event[], currentDate: Date) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return filterEventsByDateRange(events, monthStart, monthEnd);
}

/**
 * 검색어와 뷰 타입에 따라 일정을 필터링합니다.
 */
export function getFilteredEvents(
  events: Event[],
  searchTerm: string,
  currentDate: Date,
  view: 'week' | 'month'
): Event[] {
  const searchedEvents = searchEvents(events, searchTerm);

  if (view === 'week') {
    return filterEventsByDateRangeAtWeek(searchedEvents, currentDate);
  }

  if (view === 'month') {
    return filterEventsByDateRangeAtMonth(searchedEvents, currentDate);
  }

  return searchedEvents;
}
