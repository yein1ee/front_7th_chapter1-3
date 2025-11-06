import { Event, EventForm } from '../../../../shared/types';

/**
 * 날짜와 시간 문자열을 Date 객체로 변환합니다.
 */
export function parseDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

/**
 * 일정을 시작 시간과 종료 시간으로 변환합니다.
 */
export function convertEventToDateRange({ date, startTime, endTime }: Event | EventForm) {
  return {
    start: parseDateTime(date, startTime),
    end: parseDateTime(date, endTime),
  };
}

/**
 * 두 일정이 시간상 겹치는지 확인합니다.
 */
export function isOverlapping(event1: Event | EventForm, event2: Event | EventForm) {
  const { start: start1, end: end1 } = convertEventToDateRange(event1);
  const { start: start2, end: end2 } = convertEventToDateRange(event2);

  return start1 < end2 && start2 < end1;
}

/**
 * 새 일정과 겹치는 기존 일정 목록을 찾습니다.
 */
export function findOverlappingEvents(newEvent: Event | EventForm, events: Event[]) {
  return events.filter(
    (event) => event.id !== (newEvent as Event)?.id && isOverlapping(event, newEvent)
  );
}
