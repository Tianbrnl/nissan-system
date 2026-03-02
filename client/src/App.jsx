import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/login"
import VehicleReports from "./pages/VehicleReports"
import ApplicationApproval from "./pages/ApplicationApproval"
import VehicleSales from "./pages/VehicleSales"
import Pipeline from "./pages/Pipeline"
import ReleasePlan from "./pages/ReleasePlan"
import Team from "./pages/Team"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app/dashboard" element={<Dashboard />} />
      <Route path="/app/vehicle-reports" element={<VehicleReports />} />
      <Route path="/app/applications-approvals" element={<ApplicationApproval />} />
      <Route path="/app/vehicle-sales" element={<VehicleSales />} />
      <Route path="/app/pipeline" element={<Pipeline />} />
      <Route path="/app/release-plan" element={<ReleasePlan />} />
      <Route path="/app/team" element={<Team />} />
    </Routes>
  )
}

export default App
