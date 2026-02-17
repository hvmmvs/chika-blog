import { useState } from 'react'
import PostCard from './PostCard'
import LanguageToggle from '../common/LanguageToggle'

export default function PostList({ posts, loading, error, language: externalLanguage }) {
  const [internalLanguage, setInternalLanguage] = useState('en')
  const language = externalLanguage ?? internalLanguage
  const isControlled = externalLanguage != null

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-6 h-6 border-2 border-accent-300 border-t-accent-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-16 text-accent-600">Error loading posts</div>
  }

  if (posts.length === 0) {
    return <div className="text-center py-16 text-muted">No posts found</div>
  }

  const hasJapanese = posts.some((p) => p.title_ja || p.excerpt_ja)

  return (
    <div>
      {!isControlled && hasJapanese && (
        <div className="flex justify-end mb-6">
          <LanguageToggle
            language={language}
            onChange={setInternalLanguage}
            hasEnglish
            hasJapanese={hasJapanese}
          />
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} language={language} />
        ))}
      </div>
    </div>
  )
}
