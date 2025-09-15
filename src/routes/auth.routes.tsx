import { Routes, Route, Navigate } from "react-router-dom";

import { SignIn } from "../pages/sigin"

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />

      <Route path="*" element={<Navigate to={"/login"} />} />
    </Routes>
  )
}

