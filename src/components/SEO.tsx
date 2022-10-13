import { getUrl } from '@/utils/getUrl'
import { Helmet } from 'react-helmet'

export interface SEOProps {
	title?: string
	description?: string
}

const siteTitle = 'Roundest Pokemon - Public Poll'
const siteDescription =
	"We're here to answer the eternal question: What Pokemon is the roundest?"
const twitterUsername = '@mpradorbrandy'

export const SEO = ({ title = '', description }: SEOProps): JSX.Element => {
	const siteUrl = getUrl()
	const image = `${siteUrl}/spheal.png`

	return (
		<Helmet htmlAttributes={{ lang: 'en' }} title={`${title} | ${siteTitle}`}>
			<meta name='description' content={description || siteDescription} />
			<meta name='image' content={image} />

			{/* facebook cards */}
			<meta property='og:url' content={siteUrl} />
			<meta property='og:type' content='website' />
			<meta property='og:title' content={siteTitle} />
			<meta property='og:description' content={siteDescription} />
			<meta property='og:image' content={`${image}`} />
			<meta property='og:image:width' content='400' />
			<meta property='og:image:height' content='300' />

			{/* twitter card */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:creator' content={twitterUsername} />
			<meta name='twitter:title' content={siteTitle} />
			<meta name='twitter:description' content={siteDescription} />
			<meta name='twitter:image' content={`${image}`} />
		</Helmet>
	)
}

export default SEO
