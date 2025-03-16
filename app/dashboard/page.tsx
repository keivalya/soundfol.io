import { AuthCheck } from "@/components/auth-check"
import DashboardContent from "./dashboard-content"

export default function Dashboard() {
  return (
    <AuthCheck>
      <DashboardContent />
    </AuthCheck>
  )
}

