import { useState } from 'react'
import Button from '../common/Button'
import { uploadMedia } from '../../api/media'

export default function MediaUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const media = await uploadMedia(file)
      onUpload(media)
    } catch (err) {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="media-upload"
        disabled={uploading}
      />
      <label htmlFor="media-upload" className="cursor-pointer">
        <div className="text-gray-600">
          {uploading ? (
            'Uploading...'
          ) : (
            <>
              <p>Click to upload an image</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      </label>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  )
}
