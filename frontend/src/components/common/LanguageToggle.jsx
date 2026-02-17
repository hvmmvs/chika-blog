export default function LanguageToggle({ language, onChange, hasEnglish = true, hasJapanese = true, alwaysShow = false }) {
  if (!alwaysShow && (!hasEnglish || !hasJapanese)) {
    return null
  }

  return (
    <div className="inline-flex rounded-full border border-accent-200 bg-white overflow-hidden text-sm">
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`px-3 py-1 font-medium transition-colors ${
          language === 'en'
            ? 'bg-accent-600 text-white'
            : 'text-accent-600 hover:bg-accent-50'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange('ja')}
        className={`px-3 py-1 font-medium transition-colors ${
          language === 'ja'
            ? 'bg-accent-600 text-white'
            : 'text-accent-600 hover:bg-accent-50'
        }`}
      >
        日本語
      </button>
    </div>
  )
}
