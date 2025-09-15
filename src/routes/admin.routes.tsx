import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { UseAuth } from "../hooks/auth";

interface AdminRoutesProps {
  children: ReactNode;
}

export function AdminRoutes({ children }: AdminRoutesProps) {
  const { user } = UseAuth()
  // console.log(user)

  if (!user) {
    return <Navigate to={"/login"} replace />
  }

  if (user.perfil !== "admin") {
    return <Navigate to={"/lojas"} replace />
  }

  return children
}