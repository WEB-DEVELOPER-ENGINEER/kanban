import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/AppProviders'

export const metadata: Metadata = {
  title: 'Kanban ToDo Dashboard',
  description: 'A modern task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
