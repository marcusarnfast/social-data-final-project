import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { Providers } from '~/components/providers'
import { FULL_NARRATIVE_IMAGE_URL } from '~/features/story-introduction/story-asset-urls'

const SITE_TITLE =
  'Social Data Final Project'
const SITE_DESCRIPTION =
  'Social Data Final Project'

function rootHeadMeta() {
  const originRaw = import.meta.env.VITE_SITE_ORIGIN as string | undefined
  const origin = originRaw?.replace(/\/$/, '') ?? ''
  const shareImage = origin ? `${origin}${FULL_NARRATIVE_IMAGE_URL}` : ''
  const canonical = origin ? `${origin}/` : ''

  const meta: Array<
    | { charSet: 'utf-8' }
    | { name: string; content: string }
    | { title: string }
    | { property: string; content: string }
  > = [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: SITE_TITLE,
      },
      {
        name: 'description',
        content: SITE_DESCRIPTION,
      },
      {
        name: 'theme-color',
        content: '#0a0a0a',
      },
      { property: 'og:title', content: SITE_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE_TITLE },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
    ]

  if (canonical) {
    meta.push({ property: 'og:url', content: canonical })
    meta.push({ name: 'twitter:url', content: canonical })
  }
  if (shareImage) {
    meta.push({ property: 'og:image', content: shareImage })
    meta.push({ name: 'twitter:image', content: shareImage })
  }

  return meta
}

export const Route = createRootRoute({
  head: () => ({
    meta: rootHeadMeta(),
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}


function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className='min-h-svh'>
        <Providers>
          {children}
        </Providers>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
