import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Chika Blog'
const SITE_URL = 'https://chikablog.com'
const DEFAULT_DESCRIPTION = 'Insights and reflections from Chika Martino, a sake specialist based in California — exploring sake education, community-focused consulting, and Japanese culture.'

export default function SEO({ title, description, image, url, type = 'website' }) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const metaDescription = description || DEFAULT_DESCRIPTION
  const metaUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const metaImage = image
    ? image.startsWith('http') ? image : `${SITE_URL}${image}`
    : `${SITE_URL}/favicon.png`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  )
}
