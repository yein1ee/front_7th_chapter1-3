import { Event } from '../../../../shared/types';

/**
 * 시간 상수 정의
 */
const 초 = 1000;
const 분 = 초 * 60;

/**
 * 곧 시작될 일정 목록을 반환합니다 (알림 시간 내에 있는 일정).
 */
export function getUpcomingEvents(events: Event[], now: Date, notifiedEvents: string[]) {
  return events.filter((event) => {
    const eventStart = new Date(`${event.date}T${event.startTime}`);
    const timeDiff = (eventStart.getTime() - now.getTime()) / 분;
    return timeDiff > 0 && timeDiff <= event.notificationTime && !notifiedEvents.includes(event.id);
  });
}

/**
 * 일정 알림 메시지를 생성합니다.
 */
export function createNotificationMessage({ notificationTime, title }: Event) {
  return `${notificationTime}분 후 ${title} 일정이 시작됩니다.`;
}
