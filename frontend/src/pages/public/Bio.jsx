import LanguageToggle from '../../components/common/LanguageToggle'
import ImageCarousel from '../../components/common/ImageCarousel'
import { useLanguage } from '../../hooks/useLanguage'

const bioImages = [
  { src: '/bio/1.jpeg', alt: 'Chika Martino' },
  { src: '/bio/4.jpeg', alt: 'Chika Martino' },
  { src: '/bio/3.jpeg', alt: 'Chika Martino' },
  { src: '/bio/2.jpeg', alt: 'Chika Martino' },
]

export default function Bio() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-500">
            {language === 'ja' ? '自己紹介' : 'About Chika'}
          </p>
          <LanguageToggle language={language} onChange={setLanguage} alwaysShow />
        </div>
        <h1 className="font-display text-display-xl text-ink">
          {language === 'ja' ? 'マルティーノ 知佳' : 'Chika Martino'}
        </h1>
        <div className="mt-6 w-12 h-1 rounded-full bg-gradient-to-r from-accent-400 to-pop" />
      </header>

      {language === 'en' ? (
        <div className="prose prose-stone max-w-none font-serif prose-p:leading-[1.8] prose-p:text-muted">
          <p>
            My name is Chika Martino, a certified sake sommelier and sake specialist based in California. I currently work with Breakthru Beverage Group, where I focus on sake education and community-focused consulting for restaurants and retailers across the state.
          </p>
          <p>
            I was born in Iwate, Japan, a region known for its rich natural environment and deep-rooted hospitality. Some of my earliest memories are of evenings at my grandmother's home, where meals were shared slowly and generously—many small dishes prepared with care, accompanied by sake, conversation, and laughter. Those moments shaped my belief that food and drink are not simply consumed, but experienced as a way to connect people and create lasting memories.
          </p>
          <p>
            My perspective was further shaped by living in Germany as a child. Returning to Japan at a young age, I experienced my own culture from an outsider's point of view—seeing its beauty, thoughtfulness, and uniqueness in a new way. That experience continues to influence how I share Japanese culture today, helping make it more approachable and meaningful for others.
          </p>
          <p>
            After moving to the United States, I built my career in restaurants and sake retail, gaining hands-on experience in both hospitality and education. In 2022, I founded Chika & Sake, a sake bar in San Francisco dedicated to showcasing small, family-owned breweries and creating approachable, educational sake experiences. Through this work, I witnessed firsthand how sake could bring people together across cultures and backgrounds.
          </p>
          <p>
            Today, as a sake specialist with Breakthru Beverage Group, I travel throughout California supporting accounts ranging from small local restaurants to Michelin-starred establishments. By understanding each business's identity, cuisine, and community, I help develop sake programs that are authentic, sustainable, and aligned with their long-term growth.
          </p>
          <p>
            My work is guided by two core pillars: empowering sake professionals through practical education, and supporting local businesses through thoughtful, community-focused consulting.
          </p>
          <p>
            I see my role not simply as teaching or selling sake, but as translating culture—bridging the philosophy of Japanese brewers with the evolving hospitality landscape in the United States.
          </p>
          <p>
            Through this work, I hope to help nurture a future where sake grows naturally within local communities, supported by knowledgeable professionals who carry its story forward.
          </p>
        </div>
      ) : (
        <div className="prose prose-stone max-w-none font-serif prose-p:leading-[1.8] prose-p:text-muted">
          <p>
            岩手県出身、カリフォルニアを拠点に活動する日本酒ソムリエ、マルティーノ知佳。現在はBreakthru Beverage Groupにて酒スペシャリストとして、日本酒教育と地域密着型コンサルティングを通じて、日本酒文化の普及と次世代の育成に取り組んでいます。
          </p>
          <p>
            岩手で育った私の原点は、祖母の家で囲んだ食卓にあります。季節の食材や郷土料理とともに酒を楽しみながら、家族や人々が語り合う時間。その光景は、食と酒、そして文化が人と人をつなぎ、豊かな時間を生み出すものであることを教えてくれました。
          </p>
          <p>
            幼少期にはドイツで暮らした経験もあり、日本へ戻った際、自国の文化を外から見るような新鮮な視点を得ました。その経験は、日本文化の美しさや繊細さを再認識すると同時に、日本文化をどのようにわかりやすく伝えるかを考える原点となりました。
          </p>
          <p>
            アメリカ移住後は、レストランや酒販業界で経験を積み、日本酒ソムリエ資格を英語で取得。2022年にはサンフランシスコに日本酒バー「Chika & Sake」をオープンし、小規模で個性豊かな酒蔵の日本酒を紹介しながら、教育と文化体験を融合させた提供を行いました。この経験を通じて、日本酒が文化を越えて人々をつなぐ力を持つことを改めて実感しました。
          </p>
          <p>
            現在はBreakthru Beverage Groupの酒スペシャリストとして、カリフォルニア全土を訪れながら、小さな飲食店からミシュラン星付きレストランまで幅広い現場で教育とコンサルティングを提供しています。それぞれの地域や料理、コミュニティを深く理解し、そのお店に合った持続可能な日本酒プログラムの構築をサポートしています。
          </p>
          <p>
            私の活動の軸は、日本酒プロフェッショナルの育成と、地域に根ざしたコンサルティングです。
          </p>
          <p>
            日本酒を単に売るのではなく、日本文化体験としてその価値と背景を伝え、次世代へとつないでいくこと。そして、日本酒を通じて地域の食文化とビジネスが共に成長していく未来を支えることが、私の目指す役割です。
          </p>
        </div>
      )}

      {/* Photo carousel */}
      <div className="mt-16 -mx-4 md:-mx-8">
        <ImageCarousel images={bioImages} />
      </div>
    </div>
  )
}
