import { getUrl } from '@/utils/getUrl'
import Head from 'next/head'

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
		<Head>
			<title>{`${title} | ${siteTitle}`}</title>
			<meta
				name='description'
				content={description || siteDescription}
				key='description'
			/>
			<meta name='image' content={image} key='image' />

			{/* facebook cards */}
			<meta property='og:url' content={siteUrl} key='og:url' />
			<meta property='og:type' content='website' key='og:type' />
			<meta property='og:title' content={siteTitle} key='og:title' />
			<meta
				property='og:description'
				content={siteDescription}
				key='og:description'
			/>
			<meta property='og:image' content={`${image}`} key='og:image' />
			<meta property='og:image:width' content='400' key='og:image:width' />
			<meta property='og:image:height' content='300' key='og:image:height' />

			{/* twitter card */}
			<meta
				name='twitter:card'
				content='summary_large_image'
				key='twitter:card'
			/>
			<meta
				name='twitter:creator'
				content={twitterUsername}
				key='twitter:creator'
			/>
			<meta name='twitter:title' content={siteTitle} key='twitter:title' />
			<meta
				name='twitter:description'
				content={siteDescription}
				key='twitter:description'
			/>
			<meta name='twitter:image' content={`${image}`} key='twitter:image' />
		</Head>
	)
}

export default SEO
