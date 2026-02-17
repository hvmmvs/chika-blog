import { Link } from 'react-router-dom'

export default function PostCard({ post, language = 'en' }) {
  const title = language === 'ja' && post.title_ja ? post.title_ja : post.title
  const excerpt = language === 'ja' && post.excerpt_ja ? post.excerpt_ja : post.excerpt

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1">
      {post.featured_image && (
        <div className="relative overflow-hidden">
          <img
            src={`/uploads/${post.featured_image.filename}`}
            alt={title}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {post.category && (
          <Link
            to={`/category/${post.category.slug}`}
            className="inline-block text-xs font-semibold uppercase tracking-wider text-accent-700 bg-accent-50 px-3 py-1 rounded-full hover:bg-accent-100 transition-colors"
          >
            {post.category.name}
          </Link>
        )}
        <h2 className="text-xl font-bold tracking-tight leading-snug mt-3">
          <Link to={`/post/${post.slug}`} className="text-ink hover:text-accent-500 transition-colors">
            {title}
          </Link>
        </h2>
        {excerpt && (
          <p className="text-muted mt-3 leading-relaxed line-clamp-2 text-[0.95rem]">
            {excerpt}
          </p>
        )}
        <div className="mt-5 pt-4 border-t border-stone-100 text-sm text-muted">
          <time>
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>
      </div>
    </article>
  )
}
