import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme.ts'
import { AudioPlayerProvider } from 'react-use-audio-player'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioPlayerProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AudioPlayerProvider>
  </StrictMode>,
)
