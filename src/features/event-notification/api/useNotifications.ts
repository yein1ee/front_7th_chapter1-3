import { useEffect, useState } from 'react';

import { Event } from '../../../../shared/types';
import { createNotificationMessage, getUpcomingEvents } from '../model/notificationUtils';

/**
 * 일정 알림 기능을 제공하는 커스텀 훅
 */
export const useNotifications = (events: Event[]) => {
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<string[]>([]);

  /**
   * 곧 시작될 일정을 확인하고 알림을 생성합니다.
   */
  const checkUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);

    setNotifications((prev) => [
      ...prev,
      ...upcomingEvents.map((event) => ({
        id: event.id,
        message: createNotificationMessage(event),
      })),
    ]);

    setNotifiedEvents((prev) => [...prev, ...upcomingEvents.map(({ id }) => id)]);
  };

  /**
   * 특정 인덱스의 알림을 제거합니다.
   */
  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 1초마다 곧 시작될 일정을 확인합니다.
   */
  useEffect(() => {
    const interval = setInterval(checkUpcomingEvents, 1000); // 1초마다 체크
    return () => clearInterval(interval);
  }, [events, notifiedEvents]);

  return { notifications, notifiedEvents, setNotifications, removeNotification };
};
