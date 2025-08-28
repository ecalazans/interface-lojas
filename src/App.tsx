import { createBrowserRouter } from "react-router-dom"
import { Painel } from "./pages/painel"

const router = createBrowserRouter([
  {
    path: '/',
    element: < Painel />
  },
])

export { router }
