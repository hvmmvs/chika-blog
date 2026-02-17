import { useState, useRef } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import LanguageToggle from '../common/LanguageToggle'
import RichTextEditor from './RichTextEditor'
import MediaPicker from './MediaPicker'
import { insertImageCarousel } from './extensions/ImageCarouselExtension'

export default function PostEditor({ post, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    title_ja: post?.title_ja || '',
    content_ja: post?.content_ja || '',
    excerpt_ja: post?.excerpt_ja || '',
    status: post?.status || 'draft',
    category_id: post?.category_id || '',
  })
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [langTab, setLangTab] = useState('en')
  const editorRef = useRef(null)
  const editorJaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleImagesSelect = (imageUrls) => {
    const ref = langTab === 'ja' ? editorJaRef : editorRef
    if (!ref.current) return
    insertImageCarousel(ref.current, imageUrls)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Slug"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        required
      />

      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium text-gray-700">Language</span>
        <LanguageToggle language={langTab} onChange={setLangTab} alwaysShow />
      </div>

      {langTab === 'en' && (
        <>
          <Input
            label="Title (EN)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (EN)
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              onImagesClick={() => setMediaPickerOpen(true)}
              editorRef={editorRef}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt (EN)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {langTab === 'ja' && (
        <>
          <Input
            label="Title (JA)"
            value={formData.title_ja}
            onChange={(e) => setFormData({ ...formData, title_ja: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (JA)
            </label>
            <RichTextEditor
              content={formData.content_ja}
              onChange={(html) => setFormData({ ...formData, content_ja: html })}
              onImagesClick={() => setMediaPickerOpen(true)}
              editorRef={editorJaRef}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt (JA)
            </label>
            <textarea
              value={formData.excerpt_ja}
              onChange={(e) => setFormData({ ...formData, excerpt_ja: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="flex gap-4">
        <Button type="submit">Save</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleImagesSelect}
        multiple
      />
    </form>
  )
}
