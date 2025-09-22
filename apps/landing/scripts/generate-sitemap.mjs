import { writeFileSync } from 'fs'
import { globby } from 'globby'
import prettier from 'prettier'

/*
 * kudos to leerob from vercel
 * https://leerob.io/blog/nextjs-sitemap-robots
 */

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')

  const unsortedPages = await globby([
    'pages/*.js',
    'pages/*.tsx',
    'pages/*.mdx',
    'pages/**/*.tsx',
    '!pages/_*.js',
    '!pages/_*.tsx',
    '!pages/404.tsx',
    'data/**/*.mdx',
    '!data/*.mdx',
    '_blog/*.mdx',
    '.next/server/pages/features/*.html',
  ])

  const pages = unsortedPages.sort((a, b) => a.localeCompare(b))

  const blogUrl = 'blog'
  const eventsUrl = 'events'

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map((page) => {
            const path = page
              .replace('.next/server/pages', '')
              .replace('pages', '')
              .replace('.html', '')
              // add a `/` for blog posts
              .replace('_blog', `/${blogUrl}`)
              .replace('.tsx', '')
              .replace('.mdx', '')
              // replace /{directory}/index with /{directory}
              .replace(/\/([^\/]+)\/index/, '/$1')

            let route = path === '/index' ? '' : path

            if (route === '/features/[slug]') return null
            if (route === '/blog/categories/[category]') return null

            /**
             * Blog based urls
             * handle removal of dates in filename
             */
            if (route.includes(`/${blogUrl}/`)) {
              /**
               * remove directory from route
               */
              const _route = route.replace(`/${blogUrl}/`, '')
              /**
               * remove the date from the file name
               */
              const substring = _route.substring(11)
              /**
               * reconsruct the route
               */
              route = `/${blogUrl}/` + substring
            }

            /**
             * Event based urls
             * handle removal of dates in filename
             */
            if (route.includes(`/${eventsUrl}/`)) {
              // remove finelnames with __
              if (route.includes(`__`)) return null
              /**
               * remove directory from route
               */
              const _route = route.replace(`/${eventsUrl}/`, '')
              /**
               * remove the date from the file name
               */
              const substring = _route.substring(11)
              /**
               * reconsruct the route
               */
              route = `/${eventsUrl}/` + substring
            }

            return `
              <url>
                  <loc>${`https://paybill.dev${route}`}</loc>
                  <changefreq>weekly</changefreq>
                  <priority>0.5</priority>
              </url>
            `
          })
          .join('')}
    </urlset>
    `

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  /**
   * write sitemaps
   */
  // eslint-disable-next-line no-sync
  writeFileSync('public/sitemap.xml', formatted)
}

generate()
