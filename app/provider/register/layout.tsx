import type React from "react"
export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">{children}</div>
}
