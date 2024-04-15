import { parse } from 'path';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { add, format, parseISO } from 'date-fns';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type PageInsightsTimeValue = {
  end_time: string;
  value: number;
};

export type PageInsights = {
  description: string;
  id: string;
  name: string;
  period: 'day' | 'week';
  title: string;
  values: PageInsightsTimeValue[];
};

const formatISODateString = (endTime: string) => {
  const parsedDate = parseISO(endTime);

  return format(parsedDate, 'dd-MM-yy');
};

export function PageInsightsChart({
  title,
  timeSeriesValues,
  description,
}: {
  title: string;
  description: string;
  timeSeriesValues: PageInsightsTimeValue[];
}) {
  return (
    <div className="">
      <Card>
        <CardHeader className="flex flex-col space-y-0 pb-2">
          <CardTitle className="text-base font-normal">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesValues.map((i) => {
                  return {
                    ...i,
                    end_time: formatISODateString(i.end_time),
                  };
                })}
              >
                <XAxis dataKey="end_time" />
                <YAxis />
                <Tooltip />

                <Line dataKey="value" type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
