import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostList from '../../components/posts/PostList'
import SEO from '../../components/common/SEO'
import { getPostsByCategory } from '../../api/categories'

export default function CategoryPage() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPostsByCategory(slug)
      .then(setPosts)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div>
      <SEO
        title={`${slug.charAt(0).toUpperCase() + slug.slice(1)}`}
        description={`Browse posts in the ${slug} category on Chika Blog.`}
        url={`/category/${slug}`}
      />
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-500 mb-3">
          Category
        </p>
        <h1 className="font-display text-display-lg text-ink capitalize">{slug}</h1>
      </div>
      <PostList posts={posts} loading={loading} error={error} />
    </div>
  )
}
