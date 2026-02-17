import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-16 w-full animate-fade-in-up">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
