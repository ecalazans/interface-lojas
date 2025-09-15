import { BrowserRouter } from "react-router-dom";

// Verificar se está autenticado com o auth
import { UseAuth } from "../hooks/auth"

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { user } = UseAuth()

  return (
    <BrowserRouter>
      {user ? <AppRoutes /> : <AuthRoutes />}
    </BrowserRouter >
  )
}