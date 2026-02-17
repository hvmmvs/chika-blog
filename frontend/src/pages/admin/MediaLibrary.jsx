import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import MediaUploader from '../../components/admin/MediaUploader'
import { getMedia, deleteMedia } from '../../api/media'

export default function MediaLibrary() {
  const { user } = useAuth()
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadMedia()
    }
  }, [user])

  const loadMedia = async () => {
    try {
      const data = await getMedia()
      setMedia(data)
    } catch (err) {
      console.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = (newMedia) => {
    setMedia([newMedia, ...media])
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return
    try {
      await deleteMedia(id)
      setMedia(media.filter((m) => m.id !== id))
    } catch (err) {
      console.error('Failed to delete media')
    }
  }

  return (
    <div>
      <h1 className="font-display text-display-lg text-ink mb-8">Media Library</h1>
      <div className="mb-8">
        <MediaUploader onUpload={handleUpload} />
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-accent-300 border-t-accent-600 rounded-full animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-8 text-muted">No media uploaded yet</div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={`/uploads/${item.filename}`}
                  alt={item.original_name}
                  className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="text-sm truncate text-ink" title={item.original_name}>
                  {item.original_name}
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium mt-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
