interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusFilter = ({
  value,
  onChange,
}: StatusFilterProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-black md:w-56"
    >
      <option value="">All Status</option>
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
};

export default StatusFilter;