import { json, type LinksFunction, type LoaderFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import { ClerkApp } from '@clerk/remix';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import tailwindHref from '~/tailwind.css?url';
import { getFacebookUser } from '~/utils/facebook.server';
import { Resource } from 'sst';

import { Footer } from './components/footer';
import { Header } from '~/components/header.tsx';
import { useOptionalUser } from '~/utils/user.ts';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindHref },
];

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(
    args,
    async ({ request }) => {
      let user = null;

      const { userId } = request.auth;

      if (userId) {
        user = await getFacebookUser(userId);
      }
      // fetch data
      return json({
        user,
      });
    },
    {
      secretKey: Resource.ClerkSecretKey.value,
      publishableKey: Resource.ClerkPublishableKey.value,
    },
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const user = useOptionalUser();

  return (
    <div className="flex h-screen flex-col justify-between overflow-y-scroll">
      <Header user={user ? `${user?.firstName} ${user.lastName}` : ''} />
      <main className="flex-1 flex-col gap-4 p-4 md:gap-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ClerkApp(App);
