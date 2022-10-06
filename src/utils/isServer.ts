export const isServer = () => {
	//return process.browser
	return typeof window === 'undefined'
}
