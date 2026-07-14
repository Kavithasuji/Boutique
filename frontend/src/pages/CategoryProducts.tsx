import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import { getProductsByCategory } from "../services/product.service";

interface ProductColor {
  id: string;
  color: string;
  imageUrl: string;
}

interface Inventory {
  stock: number;
}

interface Variant {
  id: string;
  size: string;
  color: ProductColor;
  inventory?: Inventory;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: number;
  discountPrice: number | null;

  colors: ProductColor[];

  variants: Variant[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductCard {
  id: string;

  productId: string;

  slug: string;

  name: string;

  brand: string;

  image: string;

  color: string;

  price: number;

  discountPrice: number;

  sizes: string[];
}

const CategoryProducts = () => {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<Category | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const [selectedPrice, setSelectedPrice] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProducts(slug);
    }
  }, [slug]);

  const loadProducts = async (slug: string) => {
    try {
      setLoading(true);

      const data = await getProductsByCategory(slug);

      setCategory(data.category);

      setProducts(data.products);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  const productCards: ProductCard[] = useMemo(() => {
    return products.flatMap((product) =>
      product.colors.map((color) => ({
        id: `${product.id}-${color.id}`,

        productId: product.id,

        slug: product.slug,

        name: product.name,

        brand: product.brand,

        image: color.imageUrl,

        color: color.color,

        price: Number(product.price),

        discountPrice: Number(
          product.discountPrice ?? product.price
        ),

        sizes: product.variants
          .filter((variant) => variant.color.color === color.color)
          .map((variant) => variant.size),
      }))
    );
  }, [products]);

  /*
      Available Colors
  */

  const colors = useMemo(() => {
    return [...new Set(productCards.map((p) => p.color))];
  }, [productCards]);

  /*
      Available Sizes
  */

  const sizes = useMemo(() => {
    return [...new Set(productCards.flatMap((p) => p.sizes))];
  }, [productCards]);

  /*
      Price Range
  */

  const minPrice = useMemo(() => {
    if (!productCards.length) return 0;

    return Math.min(
      ...productCards.map((p) => p.discountPrice)
    );
  }, [productCards]);

  const maxPrice = useMemo(() => {
    if (!productCards.length) return 0;

    return Math.max(
      ...productCards.map((p) => p.discountPrice)
    );
  }, [productCards]);

  useEffect(() => {
    setSelectedPrice(maxPrice);
  }, [maxPrice]);

  /*
      Filter Products
  */

  const filteredProducts = useMemo(() => {
    return productCards.filter((product) => {
      const colorMatch =
        selectedColors.length === 0 ||
        selectedColors.includes(product.color);

      const sizeMatch =
        selectedSizes.length === 0 ||
        product.sizes.some((size) =>
          selectedSizes.includes(size)
        );

      const priceMatch =
        product.discountPrice <= selectedPrice;

      return (
        colorMatch &&
        sizeMatch &&
        priceMatch
      );
    });
  }, [
    productCards,
    selectedColors,
    selectedSizes,
    selectedPrice,
  ]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }
    return (
    <section className="min-h-screen bg-[#FAF7F2] py-16">

      <div className="mx-auto max-w-[1450px] px-8">

        {/* Breadcrumb */}

        <div className="mb-4 text-sm text-gray-500">

          <Link to="/">Home</Link>

          <span className="mx-2">/</span>

          <span className="font-medium">
            {category?.name}
          </span>

        </div>

        {/* Header */}

        <div className="mb-12 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-bold text-gray-900">
              {category?.name}
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Showing {filteredProducts.length} Variants
            </p>

          </div>

          <button className="flex items-center gap-2 rounded-xl border bg-white px-5 py-3 shadow">

            <SlidersHorizontal size={18} />

            Filters

          </button>

        </div>

        {/* Layout */}

        <div className="grid grid-cols-[300px_1fr] gap-10">

          {/* Sidebar */}

          <aside className="rounded-3xl bg-white p-8 shadow-xl h-fit sticky top-28">

            <h2 className="mb-8 text-2xl font-bold">

              Filters

            </h2>

            {/* Price */}

            <div className="mb-10">

              <h3 className="mb-4 text-lg font-semibold">

                Price

              </h3>

              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={selectedPrice}
                onChange={(e) =>
                  setSelectedPrice(Number(e.target.value))
                }
                className="w-full accent-red-600"
              />
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>
                  ₹{minPrice}
                </span>
                <span>
                  ₹{selectedPrice}
                </span>

              </div>

            </div>
            <div className="mb-10">

              <h3 className="mb-5 text-lg font-semibold">

                Colors

              </h3>
              <div className="space-y-3">

                {colors.map((color) => (

                  <label
                    key={color}
                    className="flex cursor-pointer items-center gap-3"
                  >

                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="h-4 w-4 accent-red-600"
                    />

                    <span>
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-5 text-lg font-semibold">
                Sizes
              </h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`rounded-full border px-5 py-2 transition

                    ${
                      selectedSizes.includes(size)

                        ? "bg-red-600 text-white border-red-600"

                        : "bg-white hover:bg-red-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

<div>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

    {filteredProducts.map((product) => (

      <Link
        key={product.id}
        to={`/product/${product.slug}`}
        className="group overflow-hidden rounded-[30px] bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      >

        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-[430px] w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow">
            {product.color}
          </div>

        </div>

        {/* Details */}

        <div className="p-6">
          <h2 className="line-clamp-2 text-2xl font-bold text-gray-900">
            {product.name}
          </h2>
          <p className="mt-2 text-gray-500">
            {product.brand}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="rounded-full border bg-gray-50 px-3 py-1 text-xs"
              >
                {size}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            {product.discountPrice < product.price ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  ₹{product.discountPrice}
                </span>

                <span className="text-gray-400 line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-red-600">
                ₹{product.price}
              </span>
            )}
          </div>
          <button
            className="
              mt-6
              w-full
              rounded-full
              bg-red-600
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
            "
          >
            View Product
          </button>
        </div>
      </Link>
    ))}
  </div>
</div>
            {filteredProducts.length === 0 && (
              <div className="rounded-3xl bg-white p-20 text-center shadow-xl">
                <h2 className="text-3xl font-bold">
                  No Products Found
                </h2>
                <p className="mt-5 text-gray-500">
                  Try changing the filters.
                </p>
              </div>
            )}

          </div>

        </div>


    </section>
  );
};

export default CategoryProducts;