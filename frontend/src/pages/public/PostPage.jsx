import { useParams } from 'react-router-dom'
import PostDetail from '../../components/posts/PostDetail'
import SEO from '../../components/common/SEO'
import { usePost } from '../../hooks/usePosts'

export default function PostPage() {
  const { slug } = useParams()
  const { post, loading, error } = usePost(slug)

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading post</div>
  }

  return (
    <>
      <SEO
        title={post?.title || 'Post'}
        description={post?.excerpt || ''}
        image={post?.featured_image?.url}
        url={`/post/${slug}`}
        type="article"
      />
      <PostDetail post={post} />
    </>
  )
}
