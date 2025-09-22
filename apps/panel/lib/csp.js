const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
  : ''
const PAYBILL_URL = process.env.NEXT_PUBLIC_PAYBILL_URL
  ? new URL(process.env.NEXT_PUBLIC_PAYBILL_URL).origin
  : ''
const PAYBILL_PROJECTS_URL = 'https://*.cloud.paybill.dev'
const PAYBILL_PROJECTS_URL_WS = 'wss://*.cloud.paybill.dev'

// construct the URL for the Websocket Local URLs
let PAYBILL_LOCAL_PROJECTS_URL_WS = ''
if (PAYBILL_URL) {
  const url = new URL(PAYBILL_URL)
  const wsUrl = `${url.hostname}:${url.port}`
  PAYBILL_LOCAL_PROJECTS_URL_WS = `ws://${wsUrl} wss://${wsUrl}`
}

// Needed to test docs search in local dev
const PAYBILL_DOCS_PROJECT_URL = "https://docs.paybill.dev"

// Needed to test docs content API in local dev
const PAYBILL_CONTENT_API_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL
  ? new URL(process.env.NEXT_PUBLIC_CONTENT_API_URL).origin
  : ''

const PAYBILL_STAGING_PROJECTS_URL = 'https://*.staging.paybill.dev'
const PAYBILL_STAGING_PROJECTS_URL_WS = 'wss://*.staging.paybill.dev'
const PAYBILL_COM_URL = 'https://cloud.paybill.dev'
const CLOUDFLARE_CDN_URL = 'https://cdnjs.cloudflare.com'
const HCAPTCHA_SUBDOMAINS_URL = 'https://*.hcaptcha.com'
const HCAPTCHA_ASSET_URL = 'https://newassets.hcaptcha.com'
const HCAPTCHA_JS_URL = 'https://js.hcaptcha.com'
const CONFIGCAT_URL = 'https://cdn-global.configcat.com'
const CONFIGCAT_PROXY_URL = ['staging', 'local'].includes(process.env.NEXT_PUBLIC_ENVIRONMENT ?? '')
  ? 'https://localhost:5000'
  : 'https://configcat.paybill.dev'
const STRIPE_SUBDOMAINS_URL = 'https://*.stripe.com'
const STRIPE_JS_URL = 'https://js.stripe.com'
const STRIPE_NETWORK_URL = 'https://*.stripe.network'
const CLOUDFLARE_URL = 'https://www.cloudflare.com'
const VERCEL_URL = 'https://vercel.com'
const VERCEL_INSIGHTS_URL = 'https://*.vercel-insights.com'
const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_USER_CONTENT_URL = 'https://raw.githubusercontent.com'
const GITHUB_USER_AVATAR_URL = 'https://avatars.githubusercontent.com'
const GOOGLE_USER_AVATAR_URL = 'https://lh3.googleusercontent.com'

const VERCEL_LIVE_URL = 'https://vercel.live'
const SENTRY_URL =
  'https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io'
const PAYBILL_ASSETS_URL =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging'
    ? 'http://localhost:4000'
    : 'https://frontend-assets.paybill.dev'

const USERCENTRICS_URLS = 'https://*.usercentrics.eu'
const USERCENTRICS_APP_URL = 'https://app.usercentrics.eu'

// used by vercel live preview
const PUSHER_URL = 'https://*.pusher.com'
const PUSHER_URL_WS = 'wss://*.pusher.com'

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com'

module.exports.getCSP = function getCSP() {
  const DEFAULT_SRC_URLS = [
    API_URL,
    PAYBILL_URL,
    PAYBILL_LOCAL_PROJECTS_URL_WS,
    PAYBILL_PROJECTS_URL,
    PAYBILL_PROJECTS_URL_WS,
    HCAPTCHA_SUBDOMAINS_URL,
    CONFIGCAT_URL,
    CONFIGCAT_PROXY_URL,
    STRIPE_SUBDOMAINS_URL,
    STRIPE_NETWORK_URL,
    CLOUDFLARE_URL,
    VERCEL_INSIGHTS_URL,
    GITHUB_API_URL,
    GITHUB_USER_CONTENT_URL,
    PAYBILL_ASSETS_URL,
    USERCENTRICS_URLS,
    GOOGLE_MAPS_API_URL,
  ]
  const SCRIPT_SRC_URLS = [
    CLOUDFLARE_CDN_URL,
    HCAPTCHA_JS_URL,
    STRIPE_JS_URL,
    PAYBILL_ASSETS_URL,
  ]
  const FRAME_SRC_URLS = [HCAPTCHA_ASSET_URL, STRIPE_JS_URL]
  const IMG_SRC_URLS = [
    PAYBILL_URL,
    PAYBILL_COM_URL,
    PAYBILL_PROJECTS_URL,
    GITHUB_USER_AVATAR_URL,
    GOOGLE_USER_AVATAR_URL,
    PAYBILL_ASSETS_URL,
    USERCENTRICS_APP_URL,
  ]
  const STYLE_SRC_URLS = [CLOUDFLARE_CDN_URL, PAYBILL_ASSETS_URL]
  const FONT_SRC_URLS = [CLOUDFLARE_CDN_URL, PAYBILL_ASSETS_URL]

  const isDevOrStaging =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'local' ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging'

  const defaultSrcDirective = [
    `default-src 'self'`,
    ...DEFAULT_SRC_URLS,
    ...(isDevOrStaging
      ? [
          PAYBILL_STAGING_PROJECTS_URL,
          PAYBILL_STAGING_PROJECTS_URL_WS,
          VERCEL_LIVE_URL,
          PAYBILL_DOCS_PROJECT_URL,
          PAYBILL_CONTENT_API_URL,
        ]
      : []),
    PUSHER_URL_WS,
    SENTRY_URL,
  ].join(' ')

  const imgSrcDirective = [
    `img-src 'self'`,
    `blob:`,
    `data:`,
    ...IMG_SRC_URLS,
    ...(isDevOrStaging ? [PAYBILL_STAGING_PROJECTS_URL, VERCEL_URL] : []),
  ].join(' ')

  const scriptSrcDirective = [
    `script-src 'self'`,
    `'unsafe-eval'`,
    `'unsafe-inline'`,
    ...SCRIPT_SRC_URLS,
    VERCEL_LIVE_URL,
    PUSHER_URL,
    GOOGLE_MAPS_API_URL,
  ].join(' ')

  const frameSrcDirective = [`frame-src 'self'`, ...FRAME_SRC_URLS, VERCEL_LIVE_URL].join(' ')

  const styleSrcDirective = [
    `style-src 'self'`,
    `'unsafe-inline'`,
    ...STYLE_SRC_URLS,
    VERCEL_LIVE_URL,
  ].join(' ')

  const fontSrcDirective = [`font-src 'self'`, ...FONT_SRC_URLS, VERCEL_LIVE_URL].join(' ')

  const workerSrcDirective = [`worker-src 'self'`, `blob:`, `data:`].join(' ')

  const cspDirectives = [
    defaultSrcDirective,
    imgSrcDirective,
    scriptSrcDirective,
    frameSrcDirective,
    styleSrcDirective,
    fontSrcDirective,
    workerSrcDirective,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `block-all-mixed-content`,
    ...(process.env.NEXT_PUBLIC_IS_PLATFORM === 'true' &&
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod'
      ? [`upgrade-insecure-requests`]
      : []),
  ]

  const csp = cspDirectives.join('; ') + ';'

  // Replace newline characters and spaces
  return csp.replace(/\s{2,}/g, ' ').trim()
}
