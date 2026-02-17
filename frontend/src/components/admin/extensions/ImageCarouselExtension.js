import { Node, mergeAttributes } from '@tiptap/core'

export const ImageCarouselExtension = Node.create({
  name: 'imageCarousel',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (element) => {
          const attr = element.getAttribute('data-image-carousel')
          if (attr) {
            try { return JSON.parse(attr) } catch { return [] }
          }
          return Array.from(element.querySelectorAll('img')).map(img => img.getAttribute('src'))
        },
        renderHTML: (attributes) => ({
          'data-image-carousel': JSON.stringify(attributes.images),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-image-carousel]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const images = HTMLAttributes['data-image-carousel']
      ? JSON.parse(HTMLAttributes['data-image-carousel'])
      : []
    const imgTags = images.map(src => ['img', { src }])
    return ['div', mergeAttributes(HTMLAttributes), ...imgTags]
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div')
      dom.className = 'image-carousel-node'
      dom.style.cssText = 'position:relative;border:2px dashed #93c5fd;border-radius:8px;padding:8px;margin:8px 0;background:#eff6ff;'

      const label = document.createElement('div')
      label.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;'
      label.innerHTML = `<span style="font-size:12px;font-weight:600;color:#2563eb;">Gallery (${node.attrs.images.length} images)</span>`

      const deleteBtn = document.createElement('button')
      deleteBtn.type = 'button'
      deleteBtn.textContent = 'Remove'
      deleteBtn.style.cssText = 'font-size:11px;color:#dc2626;background:none;border:none;cursor:pointer;padding:2px 6px;'
      deleteBtn.addEventListener('click', () => {
        const pos = getPos()
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
      })
      label.appendChild(deleteBtn)
      dom.appendChild(label)

      const grid = document.createElement('div')
      grid.style.cssText = 'display:flex;gap:4px;overflow-x:auto;padding-bottom:4px;'
      node.attrs.images.forEach(src => {
        const img = document.createElement('img')
        img.src = src
        img.style.cssText = 'height:80px;width:auto;border-radius:4px;object-fit:cover;flex-shrink:0;'
        grid.appendChild(img)
      })
      dom.appendChild(grid)

      return { dom }
    }
  },
})

export function insertImageCarousel(editor, images) {
  if (editor && images.length > 0) {
    editor.chain().focus().insertContent({
      type: 'imageCarousel',
      attrs: { images },
    }).run()
  }
}
