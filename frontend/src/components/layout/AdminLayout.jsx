import { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Header from './Header'
import Footer from './Footer'

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="inline-block w-6 h-6 border-2 border-accent-300 border-t-accent-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      {/* Admin nav bar */}
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-sm font-medium text-muted hover:text-ink transition-colors">
              Dashboard
            </Link>
            <Link to="/admin/posts" className="text-sm font-medium text-muted hover:text-ink transition-colors">
              Posts
            </Link>
            <Link to="/admin/media" className="text-sm font-medium text-muted hover:text-ink transition-colors">
              Media
            </Link>
            <Link to="/admin/categories" className="text-sm font-medium text-muted hover:text-ink transition-colors">
              Categories
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full animate-fade-in-up">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
