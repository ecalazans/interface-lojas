import { Routes, Route, Navigate } from "react-router-dom";

import { AdminRoutes } from "./admin.routes";
import { Painel } from "../pages/painel";
import { Admin } from "../pages/admin"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/lojas" element={<Painel />} />
      <Route
        path="/admin"
        element={
          <AdminRoutes>
            <Admin />
          </AdminRoutes>
        } />

      < Route path="*" element={< Navigate to={"/lojas"} />} />
    </Routes >
  )
}