import type { TopCategory } from '../../types/dashboard';

interface TopCategoriesProps {
  categories: TopCategory[];
}

const TopCategories = ({
  categories,
}: TopCategoriesProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-gray-900">
          Top Categories
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Categories with the most products
        </p>

      </div>

      <div className="space-y-4">

        {categories.length === 0 ? (
          <p className="text-center text-gray-500">
            No categories found.
          </p>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {index + 1}
                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {category.products} Products
                  </p>

                </div>

              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                #{index + 1}
              </span>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default TopCategories;