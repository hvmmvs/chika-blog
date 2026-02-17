import client from './client'

export const login = async (email, password) => {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await client.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}

export const logout = async () => {
  await client.post('/auth/logout')
  localStorage.removeItem('token')
}

export const getMe = async () => {
  const response = await client.get('/auth/me')
  return response.data
}
