import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h2>

        </div>

        <div className="rounded-full bg-blue-100 p-4">

          <Icon
            size={28}
            className="text-blue-600"
          />

        </div>

      </div>

    </div>
  );
};

export default StatCard;