const devServerPlugin = require('./src/plugins/devServer/index.js');

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Paybill',
  tagline: 'Open Source Apps To Grow Your Business.',
  url: 'https://docs.paybill.dev',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/paybill-favicon.svg',
  trailingSlash: false,
  organizationName: 'paybilldev', // Usually your GitHub org/user name.
  projectName: 'paybill', // Usually your repo name.
  themeConfig: {
    image: 'img/paybill-og-image.png',
    announcementBar: {
      id: 'support_us',
      content:
        'Star our repository on <a target="_blank" rel="noopener noreferrer" href="https://github.com/paybilldev/paybill">GitHub</a> to stay updated with new features and contribute to our platform!',
      backgroundColor: '#ECF0FE',
      textColor: '#4368E3',
      isCloseable: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true
      }
    },
    colorMode: {

    },
    navbar: {
      logo: {
        href: '/docs',
        alt: 'Paybill Logo',
        src: 'img/docs_logo.svg',
        srcDark: `img/docs_logo_dark.svg`,
        width: 120
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://www.paybill.dev/',
          position: 'right',
          label: 'Website',
          className: 'navbar-signin',
          'aria-label': 'Visit Paybill Website',
        },
        {
          href: 'https://www.paybill.dev/login',
          position: 'right',
          label: 'Sign in',
          className: 'navbar-signin',
          'aria-label': 'Signin to Paybill',
        },
        {
          href: 'https://www.paybill.dev/create-account',
          position: 'right',
          label: 'Try for free',
          className: 'navbar-website',
          'aria-label': 'Try Paybill for free',
        },
      ],
    },
    footer: {
      style: 'light', 
      logo: {
        alt: 'Paybill Logo',
        src: '/img/docs_logo.svg',
        srcDark: '/img/docs_logo_dark.svg',
      },
      links: [
        {
          title: 'Developers',
          items: [
            { label: 'Blogs', to: 'https://www.paybill.dev/blog' },
            { label: 'Events', to: 'https://www.paybill.dev/events' },
            { label: 'GitHub', href: 'https://github.com/paybilldev/paybill' },
            { label: 'Discord', href: 'https://discord.gg/v9rYchap' },
          ],
        },
        {
          title: 'Contact us',
          items: [
            { label: 'info@paybill.dev', href: 'mailto:info@paybill.dev' },
            { label: 'support@paybill.dev', href: 'mailto:support@paybill.dev' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Paybill Solutions, Inc. All rights reserved.
        <script>
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','G-JDY5V55YQC');
        </script>
              
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=G-JDY5V55YQC" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      `,
    },    
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || 'change_me',
      apiKey: process.env.ALGOLIA_API_KEY || 'development', // Public API key: it is safe to commit it
      indexName: 'paybilldev',
      contextualSearch: true,
      externalUrlRegex: 'external\\.com|domain\\.com',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/paybilldev/docs/blob/develop/',
          // includeCurrentVersion: true,
          // lastVersion: 'current',
          // versions: {
          //   current: {
          //     label: '0.0.1-Beta 🚧',
          //     path: 'beta',
          //     banner: 'none',
          //     badge: false
          //   }
          // }
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: [],
          filename: 'sitemap.xml',
        },
        googleTagManager: isProd
          ? {
            containerId: process.env.GTM || 'development',
          }
          : undefined,
      },
    ],
  ],
  plugins: [
    devServerPlugin,
    'plugin-image-zoom',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/',
            from: '/',
          },
          {
            to: 'https://discord.gg/v9rYchap',
            from: '/discord',
          }
        ],
      },
    ],
  ],
};