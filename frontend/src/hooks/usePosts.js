import { useState, useEffect } from 'react'
import { getPosts, getPostBySlug } from '../api/posts'

export function usePosts(skip = 0, limit = 20) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPosts(skip, limit)
      .then(setPosts)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [skip, limit])

  return { posts, loading, error }
}

export function usePost(slug) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug)
        .then(setPost)
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [slug])

  return { post, loading, error }
}
