import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.fixedWindow(20, '10 s'),
})

export default async function middleware(
	req: NextRequest,
	_event: NextFetchEvent
) {
	const ip = req.ip ?? '127.0.0.1'
	console.log('ip', ip) // eslint-disable-line no-console

	// Early escape if hitting the 'blocked' redirect
	if (req.nextUrl.pathname === '/api/blocked') {
		return NextResponse.next(req)
	}

	const { success, pending, limit, reset, remaining } = await ratelimit.limit(
		`mw:${ip}`
	)
	//event.waitUntil(pending)

	console.log('success', success) // eslint-disable-line no-console

	const res = success
		? NextResponse.next(req)
		: NextResponse.rewrite(new URL('/api/blocked', req.url), req)

	res.headers.set('X-RateLimit-Limit', limit.toString())
	res.headers.set('X-RateLimit-Remaining', remaining.toString())
	res.headers.set('X-RateLimit-Reset', reset.toString())
}

export const config = {
	matcher: '/api/:path',
}
