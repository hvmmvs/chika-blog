export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-3">
          <span className="font-display font-bold text-ink">Chika Blog</span>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Chika Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
