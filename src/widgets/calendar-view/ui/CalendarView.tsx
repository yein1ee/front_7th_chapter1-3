import { Notifications, Repeat } from '@mui/icons-material';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { WEEK_DAYS, REPEAT_TYPE_LABELS } from '../../../shared/config/constants';
import { Event } from '../../../shared/types';
import {
  formatDate,
  formatMonth,
  formatWeek,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
} from '../../../shared/utils/dateUtils';

/**
 * 일정 박스 스타일 상수
 */
const eventBoxStyles = {
  notified: {
    backgroundColor: '#ffebee',
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  normal: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'normal',
    color: 'inherit',
  },
  common: {
    p: 0.5,
    my: 0.5,
    borderRadius: 1,
    minHeight: '18px',
    width: '100%',
    overflow: 'hidden',
  },
};

/**
 * 반복 타입 라벨을 반환합니다.
 */
const getRepeatTypeLabel = (type: string): string => {
  return REPEAT_TYPE_LABELS[type] || '';
};

/**
 * 캘린더 뷰 컴포넌트의 Props
 */
interface CalendarViewProps {
  /** 현재 날짜 */
  currentDate: Date;
  /** 필터링된 일정 목록 */
  filteredEvents: Event[];
  /** 알림이 표시된 일정 ID 목록 */
  notifiedEvents: string[];
  /** 공휴일 정보 */
  holidays: { [key: string]: string };
  /** 뷰 타입 (주/월) */
  view: 'week' | 'month';
}

/**
 * 캘린더 뷰 위젯 컴포넌트 (주간/월간 뷰)
 */
export const CalendarView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  holidays,
  view,
}: CalendarViewProps) => {
  /**
   * 주간 뷰를 렌더링합니다.
   */
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    return (
      <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatWeek(currentDate)}</Typography>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                {WEEK_DAYS.map((day) => (
                  <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {weekDates.map((date) => (
                  <TableCell
                    key={date.toISOString()}
                    sx={{
                      height: '120px',
                      verticalAlign: 'top',
                      width: '14.28%',
                      padding: 1,
                      border: '1px solid #e0e0e0',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {date.getDate()}
                    </Typography>
                    {filteredEvents
                      .filter(
                        (event) => new Date(event.date).toDateString() === date.toDateString()
                      )
                      .map((event) => {
                        const isNotified = notifiedEvents.includes(event.id);
                        const isRepeating = event.repeat.type !== 'none';

                        return (
                          <Box
                            key={event.id}
                            sx={{
                              ...eventBoxStyles.common,
                              ...(isNotified ? eventBoxStyles.notified : eventBoxStyles.normal),
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              {isNotified && <Notifications fontSize="small" />}
                              {/* ! TEST CASE */}
                              {isRepeating && (
                                <Tooltip
                                  title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
                                    event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                                  }`}
                                >
                                  <Repeat fontSize="small" />
                                </Tooltip>
                              )}
                              <Typography
                                variant="caption"
                                noWrap
                                sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                              >
                                {event.title}
                              </Typography>
                            </Stack>
                          </Box>
                        );
                      })}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    );
  };

  /**
   * 월간 뷰를 렌더링합니다.
   */
  const renderMonthView = () => {
    const weeks = getWeeksAtMonth(currentDate);

    return (
      <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatMonth(currentDate)}</Typography>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                {WEEK_DAYS.map((day) => (
                  <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeks.map((week, weekIndex) => (
                <TableRow key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const dateString = day ? formatDate(currentDate, day) : '';
                    const holiday = holidays[dateString];

                    return (
                      <TableCell
                        key={dayIndex}
                        sx={{
                          height: '120px',
                          verticalAlign: 'top',
                          width: '14.28%',
                          padding: 1,
                          border: '1px solid #e0e0e0',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {day && (
                          <>
                            <Typography variant="body2" fontWeight="bold">
                              {day}
                            </Typography>
                            {holiday && (
                              <Typography variant="body2" color="error">
                                {holiday}
                              </Typography>
                            )}
                            {getEventsForDay(filteredEvents, day).map((event) => {
                              const isNotified = notifiedEvents.includes(event.id);
                              const isRepeating = event.repeat.type !== 'none';

                              return (
                                <Box
                                  key={event.id}
                                  sx={{
                                    p: 0.5,
                                    my: 0.5,
                                    backgroundColor: isNotified ? '#ffebee' : '#f5f5f5',
                                    borderRadius: 1,
                                    fontWeight: isNotified ? 'bold' : 'normal',
                                    color: isNotified ? '#d32f2f' : 'inherit',
                                    minHeight: '18px',
                                    width: '100%',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    {isNotified && <Notifications fontSize="small" />}
                                    {/* ! TEST CASE */}
                                    {isRepeating && (
                                      <Tooltip
                                        title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
                                          event.repeat.endDate
                                            ? ` (종료: ${event.repeat.endDate})`
                                            : ''
                                        }`}
                                      >
                                        <Repeat fontSize="small" />
                                      </Tooltip>
                                    )}
                                    <Typography
                                      variant="caption"
                                      noWrap
                                      sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                                    >
                                      {event.title}
                                    </Typography>
                                  </Stack>
                                </Box>
                              );
                            })}
                          </>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    );
  };

  return <>{view === 'week' ? renderWeekView() : renderMonthView()}</>;
};
