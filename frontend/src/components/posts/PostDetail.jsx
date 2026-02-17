import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { trackView } from '../../api/posts'
import LanguageToggle from '../common/LanguageToggle'

export default function PostDetail({ post }) {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    if (post?.slug) {
      trackView(post.slug)
    }
  }, [post?.slug])

  if (!post) {
    return <div className="text-center py-16 text-muted">Post not found</div>
  }

  const hasEnglish = Boolean(post.title && post.content)
  const hasJapanese = Boolean(post.title_ja && post.content_ja)

  const title = language === 'ja' && post.title_ja ? post.title_ja : post.title
  const content = language === 'ja' && post.content_ja ? post.content_ja : post.content
  const sanitizedContent = DOMPurify.sanitize(content || '')

  return (
    <article className="max-w-2xl mx-auto">
      {post.featured_image && (
        <div className="-mx-4 md:-mx-8 mb-10">
          <img
            src={`/uploads/${post.featured_image.filename}`}
            alt={title}
            className="w-full h-72 md:h-96 object-cover rounded-2xl"
          />
        </div>
      )}

      <header className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {post.category && (
            <Link
              to={`/category/${post.category.slug}`}
              className="inline-block text-xs font-bold uppercase tracking-widest text-accent-600 hover:text-accent-700 transition-colors"
            >
              {post.category.name}
            </Link>
          )}
          <LanguageToggle
            language={language}
            onChange={setLanguage}
            hasEnglish={hasEnglish}
            hasJapanese={hasJapanese}
          />
        </div>
        <h1 className="font-display text-display-xl text-ink">
          {title}
        </h1>
        <div className="mt-4 text-muted text-sm">
          <time>
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>
        {/* Decorative divider */}
        <div className="mt-8 w-12 h-1 rounded-full bg-gradient-to-r from-accent-400 to-pop" />
      </header>

      <div
        className="prose prose-lg prose-stone max-w-none font-serif
          prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight
          prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-blockquote:border-accent-300
          prose-p:leading-[1.8] prose-li:leading-[1.8]"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article>
  )
}
