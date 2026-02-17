import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import Home from './pages/public/Home'
import PostPage from './pages/public/PostPage'
import CategoryPage from './pages/public/CategoryPage'
import Bio from './pages/public/Bio'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import PostsManager from './pages/admin/PostsManager'
import MediaLibrary from './pages/admin/MediaLibrary'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="post/:slug" element={<PostPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="bio" element={<Bio />} />
          </Route>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsManager />} />
            <Route path="posts/new" element={<PostsManager />} />
            <Route path="posts/:id/edit" element={<PostsManager />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="categories" element={<PostsManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
