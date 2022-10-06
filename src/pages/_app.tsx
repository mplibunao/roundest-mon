//import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import type { AppRouter } from '@/backend/router'
import { isServer } from '@/utils/isServer'

const MyApp = ({ Component, pageProps }: AppProps) => {
	return <Component {...pageProps} />
}

function getBaseUrl() {
	if (isServer()) return ''
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

	return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`

		return {
			url,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		}
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp)
