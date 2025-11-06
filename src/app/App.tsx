import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';

import { MainPage } from '../pages/main-page/ui/MainPage';

/**
 * Material-UI 테마 설정
 */
const theme = createTheme();

/**
 * 애플리케이션 루트 컴포넌트
 * 프로바이더 설정 및 메인 페이지 렌더링
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <MainPage />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
