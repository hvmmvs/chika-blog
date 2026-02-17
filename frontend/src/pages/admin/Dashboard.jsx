import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <h1 className="font-display text-display-lg text-ink mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          to="/admin/posts"
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <h2 className="text-xl font-bold mb-2">Posts</h2>
          <p className="text-muted">Manage blog posts</p>
        </Link>
        <Link
          to="/admin/media"
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <h2 className="text-xl font-bold mb-2">Media</h2>
          <p className="text-muted">Manage uploaded images</p>
        </Link>
        <Link
          to="/admin/categories"
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          <p className="text-muted">Manage post categories</p>
        </Link>
      </div>
    </div>
  )
}
