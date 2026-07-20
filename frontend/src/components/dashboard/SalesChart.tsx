import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { SalesOverview } from '../../types/dashboard';

interface SalesChartProps {
  data: SalesOverview[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-gray-900">
          Sales Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Revenue for the last 7 days
        </p>

      </div>

      <div className="h-96">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
            />

            <YAxis />
{/* 
            <Tooltip
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                'Revenue',
              ]}
            /> */}

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default SalesChart;