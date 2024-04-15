import { redirect, type LoaderFunctionArgs } from '@remix-run/node';

import { getAuth } from '@clerk/remix/ssr.server';
import { Resource } from 'sst';

export async function getUserId(loaderArgs: LoaderFunctionArgs) {
  const { userId } = await getAuth(loaderArgs, {
    secretKey: Resource.ClerkSecretKey.value,
    publishableKey: Resource.ClerkPublishableKey.value,
  });

  return userId;
}

export async function requireUserId(loaderArgs: LoaderFunctionArgs) {
  const userId = await getUserId(loaderArgs);

  // !If there is no userId, then redirect to the sign-in route
  if (!userId) {
    return redirect(`/sign-in?redirect_url=${loaderArgs.request.url}`);
  }

  return userId;
}
