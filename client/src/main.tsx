import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AudioPlayerProvider } from 'react-use-audio-player'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioPlayerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AudioPlayerProvider>
  </StrictMode>,
)
