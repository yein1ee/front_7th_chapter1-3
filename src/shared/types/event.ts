/**
 * 반복 일정 타입 정의
 */
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * 반복 일정 정보 인터페이스
 */
export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  id?: string;
}

/**
 * 일정 폼 데이터 인터페이스
 */
export interface EventForm {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
}

/**
 * 일정 엔티티 인터페이스
 */
export interface Event extends EventForm {
  id: string;
}
