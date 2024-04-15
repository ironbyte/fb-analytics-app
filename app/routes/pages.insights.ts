import { json, type ActionFunction } from '@remix-run/node';

import { getPageInsightsByPageId } from '~/utils/facebook.server';
import invariant from 'tiny-invariant';

export const action: ActionFunction = async (args) => {
  const formData = await args.request.formData();

  const { pageId, since, until, pageAccessToken } =
    Object.fromEntries(formData);

  invariant(pageId, 'Missing pageId');
  invariant(since, 'Missing since');
  invariant(until, 'Missing until');
  invariant(pageAccessToken, 'Missing pageAccessToken');

  const pageInsights = await getPageInsightsByPageId(
    String(pageAccessToken),
    String(pageId),
    String(since),
    String(until),
  );

  return json({
    ...pageInsights,
  });
};
