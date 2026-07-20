interface StockBadgeProps {
  stock: number;
  lowStockAlert: number;
}

const StockBadge = ({
  stock,
  lowStockAlert,
}: StockBadgeProps) => {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        Out of Stock
      </span>
    );
  }

  if (stock <= lowStockAlert) {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
        Low Stock
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      In Stock
    </span>
  );
};

export default StockBadge;