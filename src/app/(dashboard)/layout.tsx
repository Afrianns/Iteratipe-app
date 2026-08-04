import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container-wrapper-style">
      <Sidebar />
      {children}
    </div>
  )
}