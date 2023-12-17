import type { Metadata } from "next"
import "./globals.scss"

export const metadata: Metadata = {
  title: "Atlas",
  description: "Powering education, one classroom at a time.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
