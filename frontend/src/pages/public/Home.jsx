import { useState } from 'react'
import PostList from '../../components/posts/PostList'
import LanguageToggle from '../../components/common/LanguageToggle'
import SEO from '../../components/common/SEO'
import { usePosts } from '../../hooks/usePosts'
import { useLanguage } from '../../hooks/useLanguage'

export default function Home() {
  const { posts, loading, error } = usePosts()
  const { language, setLanguage } = useLanguage()
  const [heroOpen, setHeroOpen] = useState(true)

  return (
    <div>
      <SEO
        title="Chika Blog"
        url="/"
      />
      {/* Hero section */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-200/40 to-pop/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-pop/20 to-accent-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-500 max-w-[10rem] sm:max-w-none leading-tight">
              {language === 'ja' ? 'ようこそ !' : 'Welcome to Chika\'s Blog'}
            </p>
            <div className="flex items-center gap-3">
              <LanguageToggle language={language} onChange={setLanguage} alwaysShow />
              <button
                type="button"
                onClick={() => setHeroOpen(!heroOpen)}
                className="text-accent-400 hover:text-accent-600 transition-colors p-1"
                aria-label={heroOpen ? 'Collapse welcome text' : 'Expand welcome text'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 transition-transform duration-300 ${heroOpen ? '' : '-rotate-90'}`}
                >
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              heroOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {language === 'en' ? (
              <div className="mt-4 text-base text-muted leading-relaxed max-w-2xl space-y-3">
                <p>
                  This blog is a space where I share my experiences, insights, and reflections as a sake specialist based in California. Through my work in education and consulting, I collaborate with restaurants, retailers, and professionals across the state—from small local communities to Michelin-starred restaurants.
                </p>
                <p>My mission is centered on two goals:</p>
                <p>
                  <strong className="text-ink">Empowering Sake Professionals</strong><br />
                  Through practical, real-world education, I help professionals build the knowledge and confidence to share sake and Japanese culture with purpose.
                </p>
                <p>
                  <strong className="text-ink">Supporting Local Businesses Through Sake</strong><br />
                  By understanding each region's food, people, and culture, I provide community-focused consulting that helps businesses grow sustainably and connect more deeply with their communities.
                </p>
                <p>
                  This blog is where I share what I learn along the way—<br />
                  from the field, from the people I meet, and from sake itself.
                </p>
              </div>
            ) : (
              <div className="mt-4 text-base text-muted leading-relaxed max-w-2xl space-y-3">
                <p>
                  このブログは、カリフォルニアを拠点に活動する日本酒スペシャリストとしての経験、学び、そして考えを共有する場所です。小さな地域の飲食店からサンフランシスコのミシュラン星付きレストランまで、教育やコンサルティングを通じて、さまざまな現場で日本酒に携わっています。
                </p>
                <p>私のミッションは、大きく2つあります。</p>
                <p>
                  <strong className="text-ink">日本酒プロフェッショナルを育てること</strong><br />
                  実践的な教育を通じて、日本酒と日本文化を自信をもって伝えられる人材を育てること。
                </p>
                <p>
                  <strong className="text-ink">日本酒を通じて地域のビジネスを支えること</strong><br />
                  地域の文化や人を理解しながら、日本酒を通じてお店と地域が共に成長していくサポートを行うこと。
                </p>
                <p>
                  このブログでは、現場での経験や日々の気づきを通じて、<br />
                  日本酒の魅力とその可能性を共有していきます。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts section */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-8">
          {language === 'ja' ? '最新の投稿' : 'Latest Posts'}
        </h2>
        <PostList posts={posts} loading={loading} error={error} language={language} />
      </section>
    </div>
  )
}
