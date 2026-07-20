import { useEffect, useState } from "react";



import {
    getCategories,  type Category,

} from "../../services/category.service"

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const CategoryFilter = ({
  value,
  onChange,
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      console.log("Categories:", data);

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  fetchCategories();
}, []);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
    >
      <option value="">All Categories</option>

     {Array.isArray(categories) &&
  categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
))}
    </select>
  );
};

export default CategoryFilter;