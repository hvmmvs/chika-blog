import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { trackView } from '../../api/posts'
import LanguageToggle from '../common/LanguageToggle'
import ImageCarousel from '../common/ImageCarousel'
import { useLanguage } from '../../hooks/useLanguage'

// Allow data-image-carousel through DOMPurify
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName === 'data-image-carousel') {
    data.forceKeepAttr = true
  }
})

function parseContentWithCarousels(html) {
  if (!html) return [{ type: 'html', content: '' }]

  const sanitized = DOMPurify.sanitize(html, {
    ADD_TAGS: ['div'],
    ADD_ATTR: ['data-image-carousel'],
  })

  // Use DOM parsing instead of regex to reliably find carousel divs
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${sanitized}</body>`, 'text/html')
  const body = doc.body

  const parts = []
  let htmlBuffer = ''

  for (const node of body.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-image-carousel')) {
      // Flush any buffered HTML
      if (htmlBuffer) {
        parts.push({ type: 'html', content: htmlBuffer })
        htmlBuffer = ''
      }
      try {
        const images = JSON.parse(node.getAttribute('data-image-carousel'))
        parts.push({ type: 'carousel', images })
      } catch {
        htmlBuffer += node.outerHTML
      }
    } else {
      htmlBuffer += node.nodeType === Node.ELEMENT_NODE ? node.outerHTML : node.textContent
    }
  }

  if (htmlBuffer) {
    parts.push({ type: 'html', content: htmlBuffer })
  }

  if (parts.length === 0) {
    parts.push({ type: 'html', content: sanitized })
  }

  return parts
}

export default function PostDetail({ post }) {
  const { language, setLanguage } = useLanguage()

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

  const contentParts = useMemo(() => parseContentWithCarousels(content), [content])
  const hasCarousels = contentParts.some(p => p.type === 'carousel')

  const proseClasses = "prose prose-lg prose-stone max-w-none font-serif prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-accent-300 prose-p:leading-[1.8] prose-li:leading-[1.8]"

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

      {hasCarousels ? (
        <div>
          {contentParts.map((part, i) =>
            part.type === 'carousel' ? (
              <div key={i} className="-mx-4 md:-mx-8 my-8">
                <ImageCarousel images={part.images} />
              </div>
            ) : (
              <div
                key={i}
                className={proseClasses}
                dangerouslySetInnerHTML={{ __html: part.content }}
              />
            )
          )}
        </div>
      ) : (
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: contentParts[0]?.content || '' }}
        />
      )}
    </article>
  )
}
