import { createCookieSessionStorage } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.secrets],
    secure: process.env.NODE_ENV === 'production',
  },
});
