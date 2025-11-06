/**
 * 애플리케이션 전역 상수 정의
 */

/**
 * 일정 카테고리 목록
 */
export const CATEGORIES = ['업무', '개인', '가족', '기타'] as const;

/**
 * 요일 목록
 */
export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 알림 옵션 목록 (분 단위)
 */
export const NOTIFICATION_OPTIONS = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
] as const;

/**
 * 반복 타입 라벨 매핑
 */
export const REPEAT_TYPE_LABELS: Record<string, string> = {
  daily: '일',
  weekly: '주',
  monthly: '월',
  yearly: '년',
} as const;
