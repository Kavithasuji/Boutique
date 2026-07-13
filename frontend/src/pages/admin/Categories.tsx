import { useState } from "react";
import { Plus } from "lucide-react";
import { createCategory } from "../../services/category.service";

const Categories = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

const handleSubmit = async () => {
  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("isActive", String(formData.isActive));

    if (imageFile) {
      data.append("image", imageFile);
    }

    const response = await createCategory(data);

    console.log(response);

    setFormData({
      name: "",
      description: "",
      isActive: true,
    });

    setImageFile(null);

    setIsOpen(false);

  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>

       <button
  onClick={() => setIsOpen(true)}
  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
>
  <Plus size={18} strokeWidth={2.5} />
  <span>Add Category</span>
</button>
      </div>

      {/* Modal */}
      {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-xl font-semibold">
                    Add New Category
                </h2>

                <button
                    onClick={() => setIsOpen(false)}
                    className="text-2xl text-gray-500 hover:text-red-500"
                >
                    ×
                </button>
                </div>

                {/* Body */}
                <div className="space-y-5 p-6">
                {/* Category Name */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                    Category Name
                    </label>

                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                    Description
                    </label>

                    <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter category description"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                    Category Image
                    </label>

                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700"
                    />

                    {imageFile && (
                    <p className="mt-2 text-sm text-green-600">
                        Selected: {imageFile.name}
                    </p>
                    )}
                </div>

                {/* Active */}
                <div className="flex items-center gap-3">
                    <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5"
                    />

                    <label className="text-sm font-medium">
                    Active Category
                    </label>
                </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                >
                    Save Category
                </button>
                </div>
            </div>
            </div>
      )}
    </div>
  );
};

export default Categories;