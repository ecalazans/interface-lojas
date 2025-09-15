import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// import { router } from './App'
// import { RouterProvider } from 'react-router-dom'


import { AuthProvider } from "./hooks/auth"
import { Routes } from "./routes"

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider >
      <Routes />
    </AuthProvider>
  </StrictMode>,
)
