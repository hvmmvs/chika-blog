import client from './client'

export const getMedia = async (skip = 0, limit = 50) => {
  const response = await client.get('/admin/media', { params: { skip, limit } })
  return response.data
}

export const uploadMedia = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await client.post('/admin/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const deleteMedia = async (id) => {
  await client.delete(`/admin/media/${id}`)
}
