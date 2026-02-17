import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import MediaUploader from './MediaUploader'
import { getMedia } from '../../api/media'

export default function MediaPicker({ isOpen, onClose, onSelect, multiple = false }) {
  const [activeTab, setActiveTab] = useState('library')
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [selectedMultiple, setSelectedMultiple] = useState([])

  useEffect(() => {
    if (isOpen) {
      loadMedia()
      setSelected(null)
      setSelectedMultiple([])
    }
  }, [isOpen])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const data = await getMedia()
      setMedia(data)
    } catch (err) {
      console.error('Failed to load media:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = (newMedia) => {
    setMedia([newMedia, ...media])
    if (multiple) {
      setSelectedMultiple(prev => [...prev, newMedia])
    } else {
      setSelected(newMedia)
    }
    setActiveTab('library')
  }

  const handleToggleMultiple = (item) => {
    setSelectedMultiple(prev => {
      const exists = prev.find(m => m.id === item.id)
      if (exists) return prev.filter(m => m.id !== item.id)
      return [...prev, item]
    })
  }

  const handleSelect = () => {
    if (multiple) {
      if (selectedMultiple.length > 0) {
        onSelect(selectedMultiple.map(m => `/uploads/${m.filename}`))
        onClose()
        setSelectedMultiple([])
      }
    } else {
      if (selected) {
        onSelect(`/uploads/${selected.filename}`)
        onClose()
        setSelected(null)
      }
    }
  }

  const handleClose = () => {
    onClose()
    setSelected(null)
    setSelectedMultiple([])
  }

  const isItemSelected = (item) => {
    if (multiple) return selectedMultiple.some(m => m.id === item.id)
    return selected?.id === item.id
  }

  const canInsert = multiple ? selectedMultiple.length > 0 : !!selected
  const buttonLabel = multiple && selectedMultiple.length > 0
    ? `Insert ${selectedMultiple.length} Image${selectedMultiple.length > 1 ? 's' : ''}`
    : 'Insert Image'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={multiple ? 'Select Images' : 'Select Image'} size="lg">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'library'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Library
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'upload'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload
        </button>
      </div>

      {/* Content */}
      {activeTab === 'library' ? (
        <div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : media.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No images yet.{' '}
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="text-blue-600 hover:underline"
              >
                Upload one
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
              {media.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => multiple ? handleToggleMultiple(item) : setSelected(item)}
                  className={`relative aspect-square overflow-hidden rounded border-2 ${
                    isItemSelected(item)
                      ? 'border-blue-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={`/uploads/${item.filename}`}
                    alt={item.original_filename}
                    className="w-full h-full object-cover"
                  />
                  {multiple && isItemSelected(item) && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {selectedMultiple.findIndex(m => m.id === item.id) + 1}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Insert button */}
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSelect}
              disabled={!canInsert}
              className={`px-4 py-2 rounded font-medium ${
                canInsert
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      ) : (
        <MediaUploader onUpload={handleUpload} />
      )}
    </Modal>
  )
}
