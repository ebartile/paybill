import type { NextRequest } from 'next/server'

export const config = {
  matcher: '/api/:function*',
}

// [Joshen] Return 404 for all next.js API endpoints EXCEPT the ones we use in hosted:
const HOSTED_SUPPORTED_API_URLS = [
  '/get-ip-address',
  '/get-utc-time',
  '/check-cname'
]

export function middleware(request: NextRequest) {
  if (!HOSTED_SUPPORTED_API_URLS.some((url) => request.nextUrl.pathname.endsWith(url))) {
    return Response.json(
      { success: false, message: 'Endpoint not supported on hosted' },
      { status: 404 }
    )
  }
}
