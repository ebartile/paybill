import "@code-hike/mdx/styles";
import "../styles/code-hike.scss";
import "../styles/index.css";
import '../styles/global.css';
import '../styles/dark-combined.css';
import '../styles/light.css';

import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "next-themes";

import MetaFaviconsPagesRouter, {
  DEFAULT_FAVICON_ROUTE,
  DEFAULT_FAVICON_THEME_COLOR,
} from "~/lib/pages-router";
import useThemeSandbox from "~/hooks/useThemeSandbox";
import { TooltipProvider, SonnerToaster, themes } from "~/components/ui";

export default function App({ Component, pageProps }: AppProps) {
  useThemeSandbox();

  const APP_NAME = "Paybill";
  const DEFAULT_META_DESCRIPTION =
  "Build production-grade applications with a any database, Authentication, instant APIs, Functions, Storage and Vector embeddings.";
  const site_title = `${APP_NAME} | Simple is better than complex.`;

  let applicationName = "Paybill";
  let faviconRoute = DEFAULT_FAVICON_ROUTE;
  let themeColor = DEFAULT_FAVICON_THEME_COLOR;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MetaFaviconsPagesRouter
        applicationName={applicationName}
        route={faviconRoute}
        themeColor={themeColor}
        includeManifest
        includeMsApplicationConfig
        includeRssXmlFeed
      />
      <DefaultSeo
        title={site_title}
        description={DEFAULT_META_DESCRIPTION}
        openGraph={{
          type: "website",
          url: "https://paybill.dev/",
          site_name: "Paybill",
          images: [
            {
              url: `https://paybill.dev/logo-preview.png`,
              width: 800,
              height: 600,
              alt: "Paybill Og Image",
            },
          ],
        }}
        twitter={{
          handle: "@paybilldev",
          site: "@paybilldev",
          cardType: "summary_large_image",
        }}
      />

      <ThemeProvider
        themes={themes.map((theme) => theme.value)}
        enableSystem
        disableTransitionOnChange
        defaultTheme="dark"
      >
        <TooltipProvider delayDuration={0}>
          <SonnerToaster position="top-right" />
          <Component {...pageProps} />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
