import { defer, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import { Await, useFetcher, useLoaderData } from '@remix-run/react';

import * as React from 'react';

import { UTCDate } from '@date-fns/utc';
import { format, getUnixTime } from 'date-fns';
import invariant from 'tiny-invariant';

import { Loading } from '~/components/loading';
import { PageInsightsChart } from '~/components/page-insights-chart.tsx';
import { Spacer } from '~/components/spacer';
import { Button } from '~/components/ui/button.tsx';
import { Calendar } from '~/components/ui/calendar.tsx';
import { Card, CardContent, CardHeader } from '~/components/ui/card.tsx';
import { CalendarDaysIcon } from '~/components/ui/icons.tsx';
import { Label } from '~/components/ui/label.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select.tsx';
import { requireUserId } from '~/utils/auth.server.ts';
import {
  getFacebookOauthInfo,
  getFacebookPages,
} from '~/utils/facebook.server.ts';

type Page = {
  pageAccessToken: string;
  category: string;
  id: string;
  name: string;
};

type Pages = Page[];

const convertToUTCZone = (date: Date): UTCDate => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const utcZoned = new UTCDate(year, month, day);

  return utcZoned;
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard | Page Insights' },
    { name: 'description', content: 'Page Insights' },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const userId = await requireUserId(args);
  const oauthInfo = await getFacebookOauthInfo(userId);

  const accessTokenId = oauthInfo[0]?.token;
  const pages = getFacebookPages(accessTokenId);

  return defer({ pages });
};

export default function DashboardRoute() {
  const [sinceDate, setSinceDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [untilDate, setUntilDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [selectedPageId, setSelectedPageId] = React.useState<
    string | undefined
  >();

  const [selectedPageAccessToken, setSelectedPageAccessToken] = React.useState<
    string | undefined
  >();

  const pagesInsightsFetcher = useFetcher();
  const loaderData = useLoaderData<typeof loader>();
  const pages: Promise<Pages> = loaderData.pages ?? [];
  const pagesInsightsFetcherData = pagesInsightsFetcher.data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    invariant(selectedPageId, 'page is required');
    invariant(sinceDate, 'since date is required');
    invariant(untilDate, 'until date is required');
    invariant(selectedPageAccessToken, 'page access token is required');

    const sinceDateValue = getUnixTime(convertToUTCZone(sinceDate));
    const untilDateValue = getUnixTime(convertToUTCZone(untilDate));

    formData.append('pageId', selectedPageId);
    formData.append('pageAccessToken', selectedPageAccessToken);
    formData.append('since', sinceDateValue.toString());
    formData.append('until', untilDateValue.toString());

    pagesInsightsFetcher.submit(formData, {
      navigate: false,
      method: 'POST',
      action: '/pages/insights',
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative mb-4 flex flex-col items-center gap-8 border-b pb-8">
        <Spacer size="xl" />
        <h1 className="text-2xl font-semibold text-violet-800  md:text-4xl">
          Facebook Page Analytics
        </h1>
        <Card className="w-full max-w-lg">
          <CardHeader className="pb-0">
            <div className="flex gap-2 border-b py-4">
              <div>
                <div className="font-semibold text-violet-800">
                  Page Insights
                </div>
                <span className="text-sm text-muted-foreground">
                  Page Likes, Reach, and Impressions.
                </span>
              </div>
            </div>
            <CardContent className="space-y-2 p-0 pb-6 pt-2">
              <div className="m-0">
                Select a Facebook Page and specify the date range for the
                Insights data.
              </div>
            </CardContent>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <React.Suspense fallback={<Loading />}>
              <pagesInsightsFetcher.Form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="space-y-1">
                  <Label className="text-sm text-violet-800" htmlFor="page">
                    Facebook Page
                  </Label>
                  <Await resolve={pages}>
                    {(resolvedPages) => (
                      <Select
                        name="page_id"
                        required
                        onValueChange={(value) => {
                          setSelectedPageId(value);
                          const page = resolvedPages.find(
                            (page) => page.id === value,
                          );
                          setSelectedPageAccessToken(page?.pageAccessToken);
                        }}
                      >
                        <SelectTrigger
                          id="model"
                          className="items-start [&_[data-description]]:hidden"
                        >
                          <SelectValue placeholder="Select a Facebook Page" />
                        </SelectTrigger>
                        <SelectContent>
                          {resolvedPages.map((page) => (
                            <SelectItem value={page.id} key={page.id}>
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                      {page.name}
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    {page.category}
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Await>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-violet-800" htmlFor="since">
                    Since (Not Inclusive)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full justify-start text-left font-normal"
                        id="since"
                        variant="outline"
                      >
                        <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                        {sinceDate ? (
                          format(sinceDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        required
                        initialFocus
                        mode="single"
                        selected={sinceDate}
                        onSelect={setSinceDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-violet-800" htmlFor="until">
                    Until
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full justify-start text-left font-normal"
                        id="until"
                        variant="outline"
                      >
                        <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                        {untilDate ? (
                          format(untilDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        required
                        initialFocus
                        mode="single"
                        selected={untilDate}
                        onSelect={setUntilDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    name="intent"
                    value="fetch_page_insights"
                    disabled={pagesInsightsFetcher.state !== 'idle'}
                  >
                    {pagesInsightsFetcher.state !== 'idle'
                      ? 'Fetching...'
                      : 'Fetch'}
                  </Button>
                </div>
              </pagesInsightsFetcher.Form>
            </React.Suspense>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-2">
        {pagesInsightsFetcher.state !== 'idle' ? (
          <Loading />
        ) : (
          pagesInsightsFetcherData?.data.length > 0 &&
          pagesInsightsFetcherData?.data.map((i) => (
            <PageInsightsChart
              key={i.title}
              title={i.title}
              timeSeriesValues={i.values}
              description={i.description}
            />
          ))
        )}
      </div>
    </div>
  );
}
