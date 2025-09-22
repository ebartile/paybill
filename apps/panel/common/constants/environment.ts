export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'api'
export const STRIPE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_XVwg5IZH3I9Gti98hZw6KRzd00v5858heG'
