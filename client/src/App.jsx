import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import VehicleReports from "./pages/VehicleReports"
import ApplicationApproval from "./pages/ApplicationApproval"
import VehicleSales from "./pages/VehicleSales"
import Pipeline from "./pages/Pipeline"
import ReleasePlan from "./pages/ReleasePlan"
import Team from "./pages/Team"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/app/vehicle-reports" element={<ProtectedRoute><VehicleReports /></ProtectedRoute>} />
      <Route path="/app/applications-approvals" element={<ProtectedRoute><ApplicationApproval /></ProtectedRoute>} />
      <Route path="/app/vehicle-sales" element={<ProtectedRoute><VehicleSales /></ProtectedRoute>} />
      <Route path="/app/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
      <Route path="/app/release-plan" element={<ProtectedRoute><ReleasePlan /></ProtectedRoute>} />
      <Route path="/app/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
