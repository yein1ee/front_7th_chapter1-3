import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { Event } from '../types';

/**
 * 반복 일정 다이얼로그의 동작 모드
 */
type DialogMode = 'edit' | 'delete';

/**
 * 다이얼로그 모드별 설정
 */
const DIALOG_CONFIG = {
  edit: {
    title: '반복 일정 수정',
    message: '해당 일정만 수정하시겠어요?',
  },
  delete: {
    title: '반복 일정 삭제',
    message: '해당 일정만 삭제하시겠어요?',
  },
} as const;

/**
 * 버튼 텍스트 상수
 */
const BUTTON_TEXT = {
  cancel: '취소',
  no: '아니오',
  yes: '예',
} as const;

/**
 * 반복 일정 다이얼로그 컴포넌트의 Props
 */
interface RecurringEventDialogProps {
  /** 다이얼로그 열림 여부 */
  open: boolean;
  /** 다이얼로그 닫기 콜백 */
  onClose: () => void;
  /** 확인 버튼 클릭 콜백 */
  onConfirm: (editSingleOnly: boolean) => void;
  /** 작업 대상 일정 */
  event: Event | null;
  /** 다이얼로그 모드 */
  mode?: DialogMode;
}

/**
 * 반복 일정 수정/삭제 시 단일 일정 또는 전체 시리즈 중 선택할 수 있는 다이얼로그 컴포넌트
 */
const RecurringEventDialog = ({
  open,
  onClose,
  onConfirm,
  mode = 'edit',
}: RecurringEventDialogProps) => {
  /**
   * 단일 일정만 처리하는 버튼 클릭 핸들러
   */
  const handleSingleOperation = () => {
    onConfirm(true); // true = 단일 일정만 처리
  };

  /**
   * 전체 시리즈를 처리하는 버튼 클릭 핸들러
   */
  const handleSeriesOperation = () => {
    onConfirm(false); // false = 전체 시리즈 처리
  };

  // 다이얼로그가 닫혀있으면 렌더링하지 않음
  if (!open) return null;

  const config = DIALOG_CONFIG[mode];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="recurring-event-dialog-title"
      aria-describedby="recurring-event-dialog-description"
    >
      <DialogTitle id="recurring-event-dialog-title">{config.title}</DialogTitle>

      <DialogContent>
        <Typography id="recurring-event-dialog-description">{config.message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {BUTTON_TEXT.cancel}
        </Button>
        <Button onClick={handleSeriesOperation} variant="outlined" color="primary">
          {BUTTON_TEXT.no}
        </Button>
        <Button onClick={handleSingleOperation} variant="contained" color="primary">
          {BUTTON_TEXT.yes}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecurringEventDialog;
