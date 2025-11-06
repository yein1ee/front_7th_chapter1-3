/* global RequestInit */

import { Event } from '../../../../shared/types';

/**
 * API 엔드포인트 상수
 */
const API_ENDPOINTS = {
  events: '/api/events',
  recurringEvents: '/api/recurring-events',
} as const;

/**
 * HTTP 메서드 상수
 */
const HTTP_METHODS = {
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

/**
 * 반복 일정이 아닌 일정의 기본 반복 설정
 */
const DEFAULT_REPEAT_CONFIG = {
  type: 'none' as const,
  interval: 0,
};

/**
 * 반복 일정 작업을 관리하는 커스텀 훅
 */
export const useRecurringEventOperations = (
  events: Event[],
  updateEvents: (events: Event[]) => void
) => {
  /**
   * 일정이 반복 일정인지 확인합니다.
   */
  const isRecurringEvent = (event: Event): boolean => {
    return event.repeat.type !== 'none' && event.repeat.interval > 0;
  };

  /**
   * 두 일정이 같은 반복 시리즈에 속하는지 확인합니다.
   */
  const isSameRecurringSeries = (eventA: Event, eventB: Event): boolean => {
    return (
      eventA.repeat.type === eventB.repeat.type &&
      eventA.repeat.interval === eventB.repeat.interval &&
      eventA.title === eventB.title &&
      eventA.startTime === eventB.startTime &&
      eventA.endTime === eventB.endTime &&
      eventA.description === eventB.description &&
      eventA.location === eventB.location &&
      eventA.category === eventB.category
    );
  };

  /**
   * 대상 일정과 같은 반복 시리즈에 속한 일정 목록을 찾습니다.
   */
  const findRelatedRecurringEvents = (targetEvent: Event): Event[] => {
    if (!isRecurringEvent(targetEvent)) {
      return [];
    }

    // 같은 반복 시리즈에 속한 모든 일정을 찾습니다
    const seriesEvents = events.filter(
      (event) => isRecurringEvent(event) && isSameRecurringSeries(event, targetEvent)
    );

    // 시리즈에 일정이 하나뿐이면 빈 배열 반환
    // 여러 개면 모든 일정 반환 (대상 일정 포함)
    return seriesEvents.length > 1 ? seriesEvents : [];
  };

  /**
   * API 요청을 처리하는 제네릭 함수 (에러 처리 포함)
   */
  const makeApiRequest = async (url: string, method: string, body?: unknown): Promise<boolean> => {
    try {
      const config: RequestInit = { method };

      if (body !== undefined) {
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);
      return response.ok;
    } catch (error) {
      console.error(`API request failed: ${method} ${url}`, error);
      return false;
    }
  };

  /**
   * 서버에서 일정을 수정합니다.
   */
  const updateEventOnServer = async (event: Event): Promise<boolean> => {
    return makeApiRequest(`${API_ENDPOINTS.events}/${event.id}`, HTTP_METHODS.PUT, event);
  };

  /**
   * 서버에서 일정을 삭제합니다.
   */
  const deleteEventOnServer = async (eventId: string): Promise<boolean> => {
    return makeApiRequest(`${API_ENDPOINTS.events}/${eventId}`, HTTP_METHODS.DELETE);
  };

  /**
   * 서버에서 반복 일정을 삭제합니다.
   */
  const deleteRecurringEventOnServer = async (repeatId: string): Promise<boolean> => {
    return makeApiRequest(`${API_ENDPOINTS.recurringEvents}/${repeatId}`, HTTP_METHODS.DELETE);
  };

  /**
   * 서버에서 반복 일정을 수정합니다.
   */
  const updateRecurringEventOnServer = async (
    repeatId: string,
    updateData: Partial<Event>
  ): Promise<boolean> => {
    return makeApiRequest(
      `${API_ENDPOINTS.recurringEvents}/${repeatId}`,
      HTTP_METHODS.PUT,
      updateData
    );
  };

  /**
   * 단일 일정 수정용 일정을 생성합니다 (반복 설정 제거).
   */
  const createSingleEditEvent = (updatedEvent: Event): Event => ({
    ...updatedEvent,
    repeat: DEFAULT_REPEAT_CONFIG,
  });

  /**
   * 반복 시리즈를 수정합니다 (repeatId가 있으면 반복 API 사용, 없으면 개별 수정).
   */
  const updateRecurringSeries = async (
    originalEvent: Event,
    updatedEvent: Event,
    relatedEvents: Event[]
  ): Promise<boolean> => {
    const repeatId = originalEvent.repeat.id;

    if (repeatId) {
      const updateData = {
        title: updatedEvent.title,
        description: updatedEvent.description,
        location: updatedEvent.location,
        category: updatedEvent.category,
        notificationTime: updatedEvent.notificationTime,
      };
      return await updateRecurringEventOnServer(repeatId, updateData);
    } else {
      const results = await Promise.all(
        relatedEvents.map((event) => updateEventOnServer({ ...event, title: updatedEvent.title }))
      );
      return results.every((result) => result);
    }
  };

  /**
   * 반복 일정 수정을 처리합니다 (사용자가 단일 또는 전체 시리즈 중 선택).
   * @param updatedEvent - 수정된 일정 정보
   * @param editSingleOnly - true면 단일 일정만 수정, false면 전체 시리즈 수정
   */
  const handleRecurringEdit = async (
    updatedEvent: Event,
    editSingleOnly: boolean
  ): Promise<void> => {
    const originalEvent = events.find((e) => e.id === updatedEvent.id);

    if (!originalEvent) {
      await updateEventOnServer(updatedEvent);
      updateEvents([]);
      return;
    }

    const relatedEvents = findRelatedRecurringEvents(originalEvent);

    if (relatedEvents.length === 0 || editSingleOnly) {
      const singleEvent = createSingleEditEvent(updatedEvent);
      await updateEventOnServer(singleEvent);
      updateEvents([]);
      return;
    }

    await updateRecurringSeries(originalEvent, updatedEvent, relatedEvents);
    updateEvents([]);
  };

  /**
   * 반복 시리즈를 삭제합니다 (repeatId가 있으면 반복 API 사용, 없으면 개별 삭제).
   */
  const deleteRecurringSeries = async (
    eventToDelete: Event,
    relatedEvents: Event[]
  ): Promise<boolean> => {
    const repeatId = eventToDelete.repeat.id;

    if (repeatId) {
      return await deleteRecurringEventOnServer(repeatId);
    } else {
      const results = await Promise.all(
        relatedEvents.map((event) => deleteEventOnServer(event.id))
      );
      return results.every((result) => result);
    }
  };

  /**
   * 삭제 작업을 실행하고 이벤트 목록을 새로고침합니다.
   */
  const executeDeleteAndRefresh = async (
    deleteOperation: () => Promise<boolean>
  ): Promise<void> => {
    await deleteOperation();
    updateEvents([]);
  };

  /**
   * 반복 일정 삭제를 처리합니다 (사용자가 단일 또는 전체 시리즈 중 선택).
   * @param eventToDelete - 삭제할 일정
   * @param deleteSingleOnly - true면 단일 일정만 삭제, false면 전체 시리즈 삭제
   */
  const handleRecurringDelete = async (
    eventToDelete: Event,
    deleteSingleOnly: boolean
  ): Promise<void> => {
    const relatedEvents = findRelatedRecurringEvents(eventToDelete);

    if (relatedEvents.length === 0) {
      await executeDeleteAndRefresh(() => deleteEventOnServer(eventToDelete.id));
      return;
    }

    if (deleteSingleOnly) {
      await executeDeleteAndRefresh(() => deleteEventOnServer(eventToDelete.id));
    } else {
      await executeDeleteAndRefresh(() => deleteRecurringSeries(eventToDelete, relatedEvents));
    }
  };

  return {
    handleRecurringEdit,
    handleRecurringDelete,
    findRelatedRecurringEvents,
  };
};
