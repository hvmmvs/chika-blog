import client from './client'

export const getCategories = async () => {
  const response = await client.get('/categories')
  return response.data
}

export const getPostsByCategory = async (slug, skip = 0, limit = 20) => {
  const response = await client.get(`/categories/${slug}/posts`, {
    params: { skip, limit },
  })
  return response.data
}

export const createCategory = async (categoryData) => {
  const response = await client.post('/admin/categories', categoryData)
  return response.data
}

export const updateCategory = async (id, categoryData) => {
  const response = await client.put(`/admin/categories/${id}`, categoryData)
  return response.data
}

export const deleteCategory = async (id) => {
  await client.delete(`/admin/categories/${id}`)
}
