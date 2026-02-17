import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-stone-200/50">
      <nav className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-display font-extrabold tracking-tight text-ink hover:text-accent-500 transition-colors">
            Chika Blog
          </Link>
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-muted hover:text-ink transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent-500 after:transition-all hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to="/bio"
              className="text-sm font-medium text-muted hover:text-ink transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent-500 after:transition-all hover:after:w-full"
            >
              About Chika
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
