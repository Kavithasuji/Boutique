import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getProducts, getProductCategories, createProduct, updateProduct, deleteProduct } from "../../services/product.service";

interface ProductVariant {
  size: string;
  color: string;
  imageUrl?: string;
  sku: string;
  stock: number;
  lowStockAlert?: number;
}

interface ProductImage {
  color?: string;
  imageUrl: string;
  isPrimary?: boolean;
}

interface ProductColor {
  id: string;
  color: string;
  imageUrl: string;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  discountPrice?: string;
  brand?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  variants: any[];
  colors: ProductColor[];

  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS = ['Red', 'Black', 'White', 'Blue', 'Green', 'Yellow', 'Pink', 'Gray'];

const Products = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    brand: "",
    isFeatured: false,
    isActive: true,
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const [colorImageFiles, setColorImageFiles] = useState<{
  [color: string]: File;
}>({});
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getProductCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      brand: "",
      isFeatured: false,
      isActive: true,
    });
    setSelectedSizes([]);
    setSelectedColors([]);
    setVariants([]);
    setProductImages([]);
  setColorImageFiles({});      
    setProductImageFiles([]);
    setImagePreviews({});
    setEditingProduct(null);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        categoryId: product.categoryId,
        name: product.name,
        description: product.description || "",
        price: product.price,
        discountPrice: product.discountPrice || "",
        brand: product.brand || "",
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });
   setVariants(
  product.variants.map((v: any) => ({
    size: v.size,
    color: v.color.color,
    sku: v.inventory?.sku || "",
    stock: v.inventory?.stock || 0,
    lowStockAlert: v.inventory?.lowStockAlert || 5,
  }))
);

// Backend now returns "colors", not "images"
setProductImages(product.colors || []);

// Restore uploaded color previews
const previews: Record<string, string> = {};

(product.colors || []).forEach((c: any) => {
  previews[c.color] = c.imageUrl;
});

setImagePreviews(previews);

// Selected sizes
setSelectedSizes([
  ...new Set(product.variants.map((v: any) => v.size)),
]);

// Selected colors
setSelectedColors(
  (product.colors || []).map((c: any) => c.color)
);
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

const handleColorToggle = (color: string) => {
  setSelectedColors((prev) => {
    if (prev.includes(color)) {

      setColorImageFiles((files) => {
        const copy = { ...files };
        delete copy[color];
        return copy;
      });

      setImagePreviews((images) => {
        const copy = { ...images };
        delete copy[color];
        return copy;
      });

      return prev.filter((c) => c !== color);
    }

    return [...prev, color];
  });
};
const handleColorImageChange = (
  color: string,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!e.target.files?.length) return;

  const file = e.target.files[0];

  setColorImageFiles((prev) => ({
    ...prev,
    [color]: file,
  }));

  const reader = new FileReader();

  reader.onload = () => {
    setImagePreviews((prev) => ({
      ...prev,
      [color]: reader.result as string,
    }));
  };

  reader.readAsDataURL(file);
};


const generateVariants = () => {
  setVariants((prevVariants) => {
    const newVariants: ProductVariant[] = [];

    selectedSizes.forEach((size) => {
      selectedColors.forEach((color) => {
        const existing = prevVariants.find(
          (v) => v.size === size && v.color === color
        );

        newVariants.push(
          existing ?? {
            size,
            color,
            imageUrl: "",
            sku: `${size}-${color}-${Date.now()}`,
            stock: 0,
            lowStockAlert: 5,
          }
        );
      });
    });

    return newVariants;
  });
};
  // const generateVariants = () => {
  //   const newVariants: ProductVariant[] = [];
  //   selectedSizes.forEach(size => {
  //     selectedColors.forEach(color => {
  //       const existingVariant = variants.find(v => v.size === size && v.color === color);
  //       newVariants.push({
  //         size,
  //         color,
  //         imageUrl: existingVariant?.imageUrl || '',
  //         sku: existingVariant?.sku || `${size}-${color}-${Date.now()}`,
  //         stock: existingVariant?.stock || 0,
  //         lowStockAlert: existingVariant?.lowStockAlert || 5,
  //       });
  //     });
  //   });
  //   setVariants(newVariants);
  // };

  useEffect(() => {
    if (selectedSizes.length > 0 && selectedColors.length > 0) {
      generateVariants();
    } else {
      setVariants([]);
    }
  }, [selectedSizes, selectedColors]);

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };


  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProductImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => ({ ...prev, [file.name]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
const handleSubmit = async () => {
  try {
    const data = new FormData();

    // Basic product info
    data.append("categoryId", formData.categoryId);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.discountPrice) {
      data.append("discountPrice", formData.discountPrice);
    }

    if (formData.brand) {
      data.append("brand", formData.brand);
    }

    data.append("isFeatured", String(formData.isFeatured));
    data.append("isActive", String(formData.isActive));

    // Variants
    data.append("variants", JSON.stringify(variants));

    // Images JSON (backend expects it)
    data.append("images", JSON.stringify([]));

    // Upload ONE image for EACH color
selectedColors.forEach((color) => {
    data.append("colorNames", color);

    const file = colorImageFiles[color];

    if (file) {
        data.append("colorImages", file);
        data.append("colorImageNames", color);
    }
});

    console.log("========= FORM DATA =========");

    for (const pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    console.log("=============================");

    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }

    await loadProducts();
    handleCloseModal();

  } catch (error) {
    console.error("Error saving product:", error);
    alert("Error saving product. Please try again.");
  }
};

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      await loadProducts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Brand</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Variants</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">{product.category.name}</td>
                  <td className="px-6 py-4 text-gray-600">${product.price}</td>
                  <td className="px-6 py-4 text-gray-600">{product.brand || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{product.variants.length} variants</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-semibold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-2xl text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Category</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Discount Price</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Enter brand"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5"
                    />
                    <span className="text-sm font-medium">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_SIZES.map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="h-5 w-5"
                      />
                      <span className="text-sm font-medium">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors */}
             {/* Colors */}
<div className="space-y-4">
  <h3 className="text-lg font-semibold border-b pb-2">
    Colors & Images
  </h3>

  <div className="space-y-4">
    {AVAILABLE_COLORS.map((color) => {
      const checked = selectedColors.includes(color);

      return (
        <div
          key={color}
          className="rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleColorToggle(color)}
              className="h-5 w-5"
            />

            <span className="font-medium w-24">
              {color}
            </span>

            {checked && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleColorImageChange(color, e)
                  }
                  className="text-sm"
                />

                {imagePreviews[color] && (
                  <img
                    src={imagePreviews[color]}
                    alt={color}
                    className="h-16 w-16 rounded-lg border object-cover"
                  />
                )}
              </>
            )}

          </div>
        </div>
      );
    })}
  </div>
</div>

              {/* Inventory */}
              {variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Inventory Management</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Color</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Size</th>
                          {/* <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Image</th> */}
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">SKU</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stock</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Low Stock Alert</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {variants.map((variant, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{variant.color}</td>
                            <td className="px-4 py-2">{variant.size}</td>
                            {/* <td className="px-4 py-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleVariantImageChange(index, e)}
                                className="text-sm"
                              />
                              {imagePreviews[`${variant.size}-${variant.color}`] && (
                                <img
                                  src={imagePreviews[`${variant.size}-${variant.color}`]}
                                  alt="Preview"
                                  className="mt-2 h-12 w-12 rounded object-cover"
                                />
                              )}
                            </td> */}
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={variant.lowStockAlert}
                                onChange={(e) => handleVariantChange(index, 'lowStockAlert', parseInt(e.target.value) || 5)}
                                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* Product Images */}
              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Product Images</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProductImageChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {productImageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {productImageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imagePreviews[file.name]}
                          alt="Preview"
                          className="h-20 w-20 rounded object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={handleCloseModal}
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
              >
                {editingProduct ? "Update Product" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Delete Product</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
