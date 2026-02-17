import { useState, useRef, useEffect } from 'react'

export default function ImageCarousel({ images }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) el.addEventListener('scroll', checkScroll, { passive: true })
    return () => el?.removeEventListener('scroll', checkScroll)
  }, [])

  if (!images || images.length === 0) return null

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-accent-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 mx-auto">
          {images.map((img, i) => (
            <div key={i} className="flex-shrink-0 snap-start">
              <img
                src={typeof img === 'string' ? img : img.src}
                alt={typeof img === 'string' ? '' : img.alt}
                className="h-64 md:h-80 w-auto rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-accent-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )

  function scroll(direction) {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.7
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }
}
