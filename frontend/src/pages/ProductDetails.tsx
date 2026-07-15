import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import {
  getProductBySlug,
  getProductsByCategory,
} from "../services/product.service";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: number;
  discountPrice: number | null;

  category: Category;

  colors: ProductColor[];

  variants: Variant[];
}

const ProductDetails = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const selectedColorFromUrl = searchParams.get("color");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState<Product | null>(null);

  const [selectedImage, setSelectedImage] = useState("");

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  const [quantity, setQuantity] = useState(1);

  // Load Product

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
    }
  }, [slug]);

  const loadProduct = async (slug: string) => {
    try {
      setLoading(true);

      const data = await getProductBySlug(slug);

      setProduct(data);
      loadRelatedProducts(data.category.slug, data.id);

      if (data.colors.length > 0) {
        const selected =
          data.colors.find(
            (c: { color: string | null }) => c.color === selectedColorFromUrl,
          ) || data.colors[0];

        setSelectedColor(selected.color);

        setSelectedImage(selected.imageUrl);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const loadRelatedProducts = async (
    categorySlug: string,
    currentProductId: string,
  ) => {
    try {
      const data = await getProductsByCategory(categorySlug);

      const related = data.products.filter(
        (item: Product) => item.id !== currentProductId,
      );

      setRelatedProducts(related.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };

  // Available sizes for selected color

  const availableSizes = useMemo(() => {
    if (!product) return [];

    return product.variants.filter(
      (variant) => variant.color.color === selectedColor,
    );
  }, [product, selectedColor]);

  // Auto select first size

  useEffect(() => {
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0].size);
    }
  }, [availableSizes]);

  // Current Variant

  const selectedVariant = useMemo(() => {
    return availableSizes.find((variant) => variant.size === selectedSize);
  }, [availableSizes, selectedSize]);

  // Quantity

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Loading

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-3xl font-bold text-gray-700">
          Loading Product...
        </div>
      </div>
    );
  }

  // Product Not Found

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-3xl font-bold text-red-600">Product Not Found</div>
      </div>
    );
  }
  return (
    <section className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}

        <div className="mb-10 flex items-center gap-3 text-sm text-gray-500">
          <Link to="/" className="transition hover:text-red-600">
            Home
          </Link>

          <span>/</span>

          <Link
            to={`/category/${product.category.slug}`}
            className="transition hover:text-red-600"
          >
            {product.category.name}
          </Link>

          <span>/</span>

          <span className="font-medium text-gray-900">{product.name}</span>
        </div>

        {/* Main Layout */}

        <div
          className="
grid
grid-cols-1
xl:grid-cols-[55%_45%]
gap-10
items-start
          "
        >
          {/* LEFT */}

          <div className="sticky top-28">
            {/* Main Image */}

            <div
              className="
relative
overflow-hidden
rounded-2xl
bg-white
shadow-lg
border
border-gray-200
"
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="
h-[420px]
sm:h-[520px]
lg:h-[620px]
w-full
object-cover
transition
duration-300
"
              />
            </div>

            {/* Gallery */}

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    setSelectedImage(color.imageUrl);

                    setSelectedColor(color.color);
                  }}
                  className={`
                    overflow-hidden
rounded-xl
           border-2
                    bg-white
                    shadow-md
                    transition-all
                    duration-300

                   h-20
w-20
lg:h-24
lg:w-24
                    shrink-0

                    ${
                      selectedColor === color.color
                        ? "border-red-600 scale-105"
                        : "border-transparent hover:border-red-300"
                    }
                  `}
                >
                  <img
                    src={color.imageUrl}
                    alt={color.color}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}

          <div>
            {/* Collection */}

            <span
              className="
                uppercase
                tracking-[6px]
                text-sm
                text-red-600
                font-medium
              "
            >
              Cupidanza Boutique
            </span>

            {/* Product Name */}

            <h1
              className="
mt-3
text-3xl
sm:text-4xl
lg:text-5xl
font-bold
leading-tight
text-gray-900
"
            >
              {product.name}
            </h1>

            {/* Brand */}

            <p
              className="
                mt-5
                text-xl
                text-gray-500
              "
            >
              {product.brand}
            </p>

            {/* Rating */}

            <div
              className="
                mt-8
                flex
                items-center
                gap-4
              "
            >
              <div className="flex text-yellow-400">
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
              </div>

              <span className="text-gray-500">4.9 (128 Reviews)</span>
            </div>

            {/* Price */}

            <div
              className="
                mt-10
                flex
                items-center
                gap-6
              "
            >
              {product.discountPrice ? (
                <>
                  <span
                    className="
text-5xl
               font-bold
                      text-red-600
                    "
                  >
                    ₹{product.discountPrice}
                  </span>

                  <span
                    className="
text-xl lg:text-2xl
    text-gray-400
                      line-through
                    "
                  >
                    ₹{product.price}
                  </span>
                </>
              ) : (
                <span
                  className="
                    text-5xl
                    font-bold
                    text-red-600
                  "
                >
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* Description */}

            <p
              className="
                mt-10
               text-base
leading-7
                text-gray-600
              "
            >
              {product.description}
            </p>

            <div className="my-12 border-t" />
            {/* Size */}

            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Select Size</h3>

                <span className="text-gray-500">
                  {availableSizes.length} Sizes Available
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                {availableSizes.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`
                    h-11
min-w-[56px]
rounded-xl
text-base
                      border
                      font-semibold
                      text-lg
                      transition-all
                      duration-300
                      ${
                        selectedSize === variant.size
                          ? "border-red-600 bg-red-600 text-white shadow-lg"
                          : "border-gray-300 bg-white hover:border-red-600 hover:text-red-600"
                      }
                    `}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}

            <div className="mt-12">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Available Colors</h3>

                <span className="text-gray-500">{selectedColor}</span>
              </div>

              <div className="flex flex-wrap gap-5">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color.color);

                      setSelectedImage(color.imageUrl);
                    }}
                    className={`
                      overflow-hidden
h-16
w-16
rounded-xl   border-2
                      shadow-md
                      transition-all
                      duration-300

                  

                      ${
                        selectedColor === color.color
                          ? "border-red-600 scale-105"
                          : "border-gray-200 hover:border-red-300"
                      }
                    `}
                  >
                    <img
                      src={color.imageUrl}
                      alt={color.color}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}

            <div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Brand</span>

                  <span className="font-medium">{product.brand}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Selected Color
                  </span>

                  <span className="font-medium text-red-600">
                    {selectedColor}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Selected Size
                  </span>

                  <span className="font-medium">{selectedSize}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Stock</span>

                  <span className="font-bold text-green-600">
                    {selectedVariant?.inventory?.stock ?? 0} Available
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity */}

            <div className="mt-12">
              <h3 className="mb-5 text-xl font-semibold">Quantity</h3>

              <div className="flex items-center gap-5">
                <button
                  onClick={decreaseQty}
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    bg-white
                    shadow
                    transition
                    hover:border-red-600
                    hover:text-red-600
                  "
                >
                  <Minus size={20} />
                </button>

                <span className="w-10 text-center text-3xl font-bold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQty}
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    bg-white
                    shadow
                    transition
                    hover:border-red-600
                    hover:text-red-600
                  "
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}

            <div className="mt-14 flex gap-5">
              <button
                className="
                  flex-1
                  rounded-full
                  bg-red-600
                  py-5
                  text-lg
                  font-semibold
                  text-white
                  shadow-xl
                  transition
                  hover:bg-red-700
                "
              >
                Add To Cart
              </button>

              <button
                className="
                  flex-1
                  rounded-full
                  border-2
                  border-red-600
                  bg-white
                  py-5
                  text-lg
                  font-semibold
                  text-red-600
                  transition
                  hover:bg-red-600
                  hover:text-white
                "
              >
                Buy Now
              </button>

              <button
                className="
                  flex
                  h-[68px]
                  w-[68px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  bg-white
                  shadow-lg
                  transition
                  hover:border-red-600
                  hover:text-red-600
                "
              >
                <Heart size={26} />
              </button>
            </div>

            <div className="my-14 border-t" />
            {/* Delivery Services */}

            <div className="space-y-5">
              <div className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Truck size={28} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold">Free Shipping</h4>

                  <p className="mt-1 text-gray-500">
                    Free delivery on orders above ₹999.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold">Secure Payment</h4>

                  <p className="mt-1 text-gray-500">
                    100% secure online payment gateway.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <RotateCcw size={28} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold">Easy Returns</h4>

                  <p className="mt-1 text-gray-500">
                    7 Days easy return and exchange.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}

        {/* Related Products */}

        <div className="mt-28">
          <div className="mb-12 text-center">
            <span className="uppercase tracking-[5px] text-red-600">
              More Collections
            </span>

            <h2 className="mt-3 text-5xl font-bold">You May Also Like</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.slug}`}
                className="
          group
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-lg
          transition
          duration-500
          hover:-translate-y-3
          hover:shadow-2xl
        "
              >
                <div className="overflow-hidden">
                  <img
                    src={item.colors[0]?.imageUrl}
                    alt={item.name}
                    className="
              h-[350px]
              w-full
              object-cover
              transition
              duration-700
              group-hover:scale-110
            "
                  />
                </div>

                <div className="p-6">
                  <h3 className="line-clamp-2 text-2xl font-bold">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-gray-500">{item.brand}</p>

                  <div className="mt-5">
                    {item.discountPrice ? (
                      <div className="flex gap-3 items-center">
                        <span className="text-2xl font-bold text-red-600">
                          ₹{item.discountPrice}
                        </span>

                        <span className="text-gray-400 line-through">
                          ₹{item.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-red-600">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back */}

        <div className="mt-16 flex justify-center">
          <Link
            to={`/category/${product.category.slug}`}
            className="
              rounded-full
              border-2
              border-red-600
              px-10
              py-4
              text-lg
              font-semibold
              text-red-600
              transition
              hover:bg-red-600
              hover:text-white
            "
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
