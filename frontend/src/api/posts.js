import client from './client'

export const getPosts = async (skip = 0, limit = 20) => {
  const response = await client.get('/posts', { params: { skip, limit } })
  return response.data
}

export const getPostBySlug = async (slug) => {
  const response = await client.get(`/posts/${slug}`)
  return response.data
}

export const getAdminPosts = async (skip = 0, limit = 20) => {
  const response = await client.get('/admin/posts', { params: { skip, limit } })
  return response.data
}

export const getAdminPost = async (id) => {
  const response = await client.get(`/admin/posts/${id}`)
  return response.data
}

export const createPost = async (postData) => {
  const response = await client.post('/admin/posts', postData)
  return response.data
}

export const updatePost = async (id, postData) => {
  const response = await client.put(`/admin/posts/${id}`, postData)
  return response.data
}

export const deletePost = async (id) => {
  await client.delete(`/admin/posts/${id}`)
}

export const trackView = (slug) => {
  client.post(`/posts/${slug}/view`).catch(() => {})
}
