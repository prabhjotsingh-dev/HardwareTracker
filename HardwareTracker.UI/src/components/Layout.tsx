import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-4">
        <main className="flex-1 pb-3">
          <Outlet />
        </main>
      </div>
      <footer className="border-t border-white/10 bg-black/50 py-4 text-center text-sm text-gray-500">
        &copy; 2026 HardwareTracker Diagnostics &mdash; Built with .NET 10 Clean Architecture
      </footer>
    </>
  )
}
