import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import PostEditor from '../../components/admin/PostEditor'
import { getAdminPosts, getAdminPost, createPost, updatePost, deletePost } from '../../api/posts'

export default function PostsManager() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const [saving, setSaving] = useState(false)

  const isNewPost = location.pathname === '/admin/posts/new'
  const isEditPost = location.pathname.includes('/edit')
  const showEditor = isNewPost || isEditPost

  useEffect(() => {
    if (user) {
      loadPosts()
    }
  }, [user])

  useEffect(() => {
    if (isEditPost && id) {
      getAdminPost(id).then(setEditingPost).catch(() => {
        console.error('Failed to load post')
      })
    } else if (isNewPost) {
      setEditingPost(null)
    }
  }, [isEditPost, isNewPost, id])

  const loadPosts = async () => {
    try {
      const data = await getAdminPosts()
      setPosts(data)
    } catch (err) {
      console.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData) => {
    setSaving(true)
    try {
      const payload = {
        ...formData,
        category_id: formData.category_id || null,
      }
      if (isEditPost && id) {
        await updatePost(id, payload)
      } else {
        await createPost(payload)
      }
      navigate('/admin/posts')
      loadPosts()
    } catch (err) {
      console.error('Failed to save post:', err)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/posts')
  }

  const handleDelete = async (postId) => {
    if (!confirm('Delete this post?')) return
    try {
      await deletePost(postId)
      loadPosts()
    } catch (err) {
      console.error('Failed to delete post')
    }
  }

  if (showEditor) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/posts" className="text-muted hover:text-ink transition-colors">
            &larr; Back to Posts
          </Link>
          <h1 className="font-display text-xl font-bold">
            {isNewPost ? 'New Post' : 'Edit Post'}
          </h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 overflow-visible">
          {isEditPost && !editingPost ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-accent-300 border-t-accent-600 rounded-full animate-spin" />
            </div>
          ) : (
            <PostEditor
              post={editingPost}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-display-lg text-ink">Posts</h1>
        <Link to="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-accent-300 border-t-accent-600 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-muted">No posts yet</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Views</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted text-sm">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-muted text-sm">
                    {post.view_count} / {post.unique_view_count} unique
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="text-accent-600 hover:text-accent-700 text-sm font-medium mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
