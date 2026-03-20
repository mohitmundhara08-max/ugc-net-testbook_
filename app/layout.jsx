import './globals.css'

export const metadata = {
  title: 'UGC NET Telegram Intelligence Hub',
  description: 'Real-time analytics for all 25 UGC NET Testbook Telegram channels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
