import { createClerkClient } from '@clerk/remix/api.server';
import { Resource } from 'sst';

async function setupClerkClient() {
  const client = await createClerkClient({
    secretKey: Resource.ClerkSecretKey.value,
    publishableKey: Resource.ClerkPublishableKey.value,
  });

  return client;
}

export async function getFacebookUser(userId: string) {
  const clerkClient = await setupClerkClient();

  const user = await clerkClient.users.getUser(userId);

  return user;
}

export async function getFacebookOauthInfo(userId: string) {
  const clerkClient = await setupClerkClient();

  const oauthInfo = await clerkClient.users.getUserOauthAccessToken(
    userId,
    'oauth_facebook',
  );

  return oauthInfo;
}

export async function getFacebookPages(accessToken: string) {
  const url = new URL('https://graph.facebook.com/v19.0/me');

  url.search = new URLSearchParams({
    fields: 'accounts',
    access_token: accessToken,
  }).toString();

  const response = await fetch(url, {
    method: 'GET',
  });

  const data = await response.json();

  return data?.accounts?.data.map((i) => ({
    pageAccessToken: i?.access_token,
    category: i?.category,
    id: i?.id,
    name: i?.name,
  }));
}

// https://developers.facebook.com/docs/graph-api/reference/page/insights/#availmetrics
const FACEBOOK_PAGE_METRICS = [
  // Impressions
  'page_impressions',
  // Reach
  'page_impressions_organic_unique_v2',
  // Page Likes
  'page_actions_post_reactions_like_total',
];

export async function getPageInsightsByPageId(
  accessToken: string,
  pageId: string,
  since: string, // in seconds
  until: string, // in seconds
) {
  const url = new URL(`https://graph.facebook.com/v19.0/${pageId}/insights`);

  url.search = new URLSearchParams({
    access_token: accessToken,
    since,
    until,
    metric: FACEBOOK_PAGE_METRICS.join(','),
    period: 'day',
  }).toString();

  const response = await fetch(url, {
    method: 'GET',
  });

  const data = await response.json();

  return data;
}
