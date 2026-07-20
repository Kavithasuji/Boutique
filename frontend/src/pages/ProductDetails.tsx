
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
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
import { addToCart } from "../services/cart.service";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

const handleAddToCart = async () => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  if (!token) {
    navigate("/login");
    return;
  }

  if (!selectedVariant) {
    toast.error("Please select a size.");
    return;
  }

  try {
    const response = await addToCart({
      variantId: selectedVariant.id,
      quantity,
    });

    toast.success(response.message || "Product added to cart.");

    navigate("/cart");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
      "Failed to add product to cart."
    );
  }
};
//   const handleAddToCart = async () => {
//   if (!selectedVariant) {
//     alert("Please select a size.");
//     return;
//   }

//   try {
//     await addToCart({
//       variantId: selectedVariant.id,
//       quantity,
//     });

//     alert("Product added to cart successfully.");
//   } catch (error) {
//     console.error(error);
//     alert("Failed to add product to cart.");
//   }
// };
  return (

    <section className="min-h-screen bg-[#111111] py-12">

  {/* Background */}

  <div className="absolute inset-0 overflow-hidden pointer-events-none">

    <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#d72638]/10 blur-[180px]" />

    <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-[#d72638]/10 blur-[160px]" />

  </div>

  <div className="relative z-10 mx-auto max-w-[1450px] px-8">

    {/* Breadcrumb */}

    <div
      className="
      flex
      items-center
      gap-3
      text-[13px]
      uppercase
      tracking-[2px]
      text-gray-500
      "
    >

      <Link
        to="/"
        className="transition hover:text-[#d72638]"
      >
        Home
      </Link>

      <span>/</span>

      <Link
        to={`/category/${product.category.slug}`}
        className="transition hover:text-[#d72638]"
      >
        {product.category.name}
      </Link>

      <span>/</span>

      <span className="text-white">
        {product.name}
      </span>

    </div>

    {/* Main */}

    <div
      className="
      mt-8
      grid
      gap-10
      xl:grid-cols-[52%_48%]
      items-start
      "
    >
      {/* LEFT */}

<div className="sticky top-24">

  {/* Main Image */}

  <div
    className="
    overflow-hidden
    rounded-[28px]
    border
    border-white/10
    bg-[#181818]
    transition-all
    duration-500
    hover:border-[#d72638]/40
    "
  >

    <img
      src={selectedImage}
      alt={product.name}
      className="
      aspect-[4/5]
      w-full
      object-cover
      transition-all
      duration-500
      hover:scale-[1.02]
      "
    />

  </div>

  {/* Gallery */}

  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

    {product.colors.map((color) => (

      <button
        key={color.id}
        onClick={() => {
          setSelectedImage(color.imageUrl);
          setSelectedColor(color.color);
        }}
        className={`
        shrink-0
        overflow-hidden
        rounded-2xl
        border
        transition-all
        duration-300
        ${
          selectedColor === color.color
            ? "border-[#d72638] shadow-[0_0_20px_rgba(215,38,56,0.25)]"
            : "border-white/10 hover:border-[#d72638]/50"
        }
        `}
      >

        <img
          src={color.imageUrl}
          alt={color.color}
          className="
          h-18
          w-16
          object-cover
          transition
          duration-300
          hover:scale-105
          "
        />

      </button>

    ))}

  </div>

  {/* Selected Color */}

  <div className="mt-4 flex items-center justify-between">

    <span
      className="
      text-[11px]
      uppercase
      tracking-[3px]
      text-gray-500
      "
    >
      Selected Color
    </span>

    <span
      className="
      rounded-full
      border
      border-[#d72638]/30
      bg-[#d72638]/10
      px-4
      py-1
      text-[11px]
      uppercase
      tracking-[3px]
      text-[#ff7a86]
      "
    >
      {selectedColor}
    </span>

  </div>

</div>
{/* RIGHT */}

<div>

  {/* Collection */}

  <span
    className="
    inline-flex
    rounded-full
    border
    border-[#d72638]
    bg-[#d72638]/10
    px-4
    py-1.5
    text-[10px]
    uppercase
    tracking-[4px]
    text-[#ff7a86]
    "
  >
    Cupidanza Boutique
  </span>

  {/* Product Name */}

  <h1
    className="
    mt-5
    max-w-xl
    text-[34px]
    font-light
    uppercase
    leading-[1.15]
    tracking-[2px]
    text-white
    lg:text-[40px]
    "
    style={{
      fontFamily: "'Montserrat', sans-serif",
    }}
  >
    {product.name}
  </h1>

  {/* Brand */}

  <p
    className="
    mt-3
    text-[12px]
    uppercase
    tracking-[4px]
    text-gray-500
    "
  >
    {product.brand}
  </p>

  {/* Rating + Stock */}

  <div
    className="
    mt-6
    flex
    flex-wrap
    items-center
    gap-6
    "
  >

    <div className="flex items-center gap-1 text-yellow-400">

      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          fill="currentColor"
          size={15}
        />
      ))}

      <span className="ml-2 text-sm text-gray-400">
        4.9
      </span>

    </div>

    <span
      className="
      rounded-full
      border
      border-green-500/30
      bg-green-500/10
      px-3
      py-1
      text-[11px]
      uppercase
      tracking-[2px]
      text-green-400
      "
    >
      {selectedVariant?.inventory?.stock ?? 0} In Stock
    </span>

  </div>

  {/* Price */}

  <div
    className="
    mt-8
    flex
    items-end
    gap-4
    "
  >

    {product.discountPrice ? (

      <>

        <span
          className="
          text-[38px]
          font-semibold
          leading-none
          text-[#d72638]
          "
        >
          ₹{product.discountPrice}
        </span>

        <span
          className="
          pb-1
          text-lg
          text-gray-500
          line-through
          "
        >
          ₹{product.price}
        </span>

      </>

    ) : (

      <span
        className="
        text-[38px]
        font-semibold
        text-[#d72638]
        "
      >
        ₹{product.price}
      </span>

    )}

  </div>

  {/* Description */}

  <p
    className="
    mt-7
    max-w-xl
    text-[15px]
    leading-7
    text-gray-400
    "
  >
    {product.description}
  </p>

  {/* Divider */}

  <div className="my-8 border-t border-white/10" />
  {/* Size */}

<div>

  <div className="mb-4 flex items-center justify-between">

    <h3
      className="
      text-[12px]
      uppercase
      tracking-[3px]
      text-white
      "
    >
      Select Size
    </h3>

    <span
      className="
      text-[11px]
      uppercase
      tracking-[2px]
      text-gray-500
      "
    >
      {availableSizes.length} Available
    </span>

  </div>

  <div className="flex flex-wrap gap-2">

    {availableSizes.map((variant) => (

      <button
        key={variant.id}
        onClick={() => setSelectedSize(variant.size)}
        className={`
          h-10
          min-w-[52px]
          rounded-full
          border
          text-sm
          uppercase
          tracking-[2px]
          transition-all
          duration-300
          ${
            selectedSize === variant.size
              ? "border-[#d72638] bg-[#d72638] text-white shadow-[0_6px_18px_rgba(215,38,56,.25)]"
              : "border-white/10 bg-[#181818] text-gray-300 hover:border-[#d72638]"
          }
        `}
      >
        {variant.size}
      </button>

    ))}

  </div>

</div>

{/* Colors */}

<div className="mt-8">

  <div className="mb-4 flex items-center justify-between">

    <h3
      className="
      text-[12px]
      uppercase
      tracking-[3px]
      text-white
      "
    >
      Colors
    </h3>

    <span
      className="
      text-[11px]
      uppercase
      tracking-[2px]
      text-[#ff7a86]
      "
    >
      {selectedColor}
    </span>

  </div>

  <div className="flex flex-wrap gap-3">

    {product.colors.map((color) => (

      <button
        key={color.id}
        onClick={() => {
          setSelectedColor(color.color);
          setSelectedImage(color.imageUrl);
        }}
        className={`
          overflow-hidden
          rounded-xl
          border
          transition-all
          duration-300
          ${
            selectedColor === color.color
              ? "border-[#d72638] scale-105"
              : "border-white/10 hover:border-[#d72638]/50"
          }
        `}
      >

        <img
          src={color.imageUrl}
          alt={color.color}
          className="
          h-14
          w-12
          object-cover
          "
        />

      </button>

    ))}

  </div>

</div>

{/* Product Info */}

<div
  className="
  mt-8
  rounded-[24px]
  border
  border-white/10
  bg-[#181818]
  p-5
  "
>

  <div className="space-y-4">

    <div className="flex justify-between">

      <span className="text-gray-500">
        Brand
      </span>

      <span className="text-white">
        {product.brand}
      </span>

    </div>

    <div className="flex justify-between">

      <span className="text-gray-500">
        Color
      </span>

      <span className="text-[#ff7a86]">
        {selectedColor}
      </span>

    </div>

    <div className="flex justify-between">

      <span className="text-gray-500">
        Size
      </span>

      <span className="text-white">
        {selectedSize}
      </span>

    </div>

    <div className="flex justify-between">

      <span className="text-gray-500">
        Stock
      </span>

      <span className="text-green-400">
        {selectedVariant?.inventory?.stock ?? 0}
      </span>

    </div>

  </div>

</div>

{/* Quantity */}

<div className="mt-8">

  <h3
    className="
    mb-3
    text-[12px]
    uppercase
    tracking-[3px]
    text-white
    "
  >
    Quantity
  </h3>

  <div className="flex items-center gap-3">

    <button
      onClick={decreaseQty}
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      border
      border-white/10
      bg-[#181818]
      text-white
      transition-all
      hover:border-[#d72638]
      "
    >
      <Minus size={16} />
    </button>

    <div
      className="
      flex
      h-10
      min-w-[52px]
      items-center
      justify-center
      rounded-full
      border
      border-white/10
      bg-[#181818]
      text-white
      "
    >
      {quantity}
    </div>

    <button
      onClick={increaseQty}
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      border
      border-white/10
      bg-[#181818]
      text-white
      transition-all
      hover:border-[#d72638]
      "
    >
      <Plus size={16} />
    </button>

  </div>

</div>
{/* Actions */}

<div className="mt-8 flex gap-3">

  {/* Add To Cart */}

  <button
    onClick={handleAddToCart}
    disabled={!selectedVariant}
    className="
    group
    flex-1
    rounded-full
    border
    border-[#d72638]
    bg-[#d72638]
    py-3
    text-[12px]
    font-semibold
    uppercase
    tracking-[3px]
    text-white
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:bg-[#bf2030]
    disabled:cursor-not-allowed
    disabled:opacity-40
    "
  >
    Add To Cart
  </button>

  {/* Buy */}

  <button
    className="
    flex-1
    rounded-full
    border
    border-white/10
    bg-[#181818]
    py-3
    text-[12px]
    font-semibold
    uppercase
    tracking-[3px]
    text-white
    transition-all
    duration-300
    hover:border-[#d72638]
    hover:bg-[#d72638]/10
    "
  >
    Buy Now
  </button>

  {/* Wishlist */}

  <button
    className="
    flex
    h-11
    w-11
    shrink-0
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    bg-[#181818]
    text-gray-300
    transition-all
    duration-300
    hover:border-[#d72638]
    hover:text-[#d72638]
    "
  >
    <Heart size={18} />
  </button>

</div>

{/* Service Cards */}

<div className="mt-8 grid gap-3">

  <div
    className="
    flex
    items-center
    gap-4
    rounded-2xl
    border
    border-white/10
    bg-[#181818]
    px-5
    py-4
    transition-all
    duration-300
    hover:border-[#d72638]/40
    "
  >

    <div
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      bg-[#d72638]/10
      text-[#d72638]
      "
    >
      <Truck size={18} />
    </div>

    <div>

      <h4 className="text-sm font-medium text-white">
        Free Shipping
      </h4>

      <p className="mt-1 text-xs text-gray-400">
        Orders above ₹999
      </p>

    </div>

  </div>

  <div
    className="
    flex
    items-center
    gap-4
    rounded-2xl
    border
    border-white/10
    bg-[#181818]
    px-5
    py-4
    transition-all
    duration-300
    hover:border-[#d72638]/40
    "
  >

    <div
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      bg-[#d72638]/10
      text-[#d72638]
      "
    >
      <ShieldCheck size={18} />
    </div>

    <div>

      <h4 className="text-sm font-medium text-white">
        Secure Payment
      </h4>

      <p className="mt-1 text-xs text-gray-400">
        100% encrypted checkout
      </p>

    </div>

  </div>

  <div
    className="
    flex
    items-center
    gap-4
    rounded-2xl
    border
    border-white/10
    bg-[#181818]
    px-5
    py-4
    transition-all
    duration-300
    hover:border-[#d72638]/40
    "
  >

    <div
      className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      bg-[#d72638]/10
      text-[#d72638]
      "
    >
      <RotateCcw size={18} />
    </div>

    <div>

      <h4 className="text-sm font-medium text-white">
        Easy Returns
      </h4>

      <p className="mt-1 text-xs text-gray-400">
        7-day return policy
      </p>

    </div>

  </div>

</div>
{/* ================= Related Products ================= */}

<div className="mt-20">

  <div className="mb-10 flex items-end justify-between">

    <div>

      <span
        className="
        text-[11px]
        uppercase
        tracking-[4px]
        text-[#ff7a86]
        "
      >
        Complete Your Look
      </span>

      <h2
        className="
        mt-3
        text-3xl
        font-light
        uppercase
        tracking-[3px]
        text-white
        "
        style={{
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Related Products
      </h2>

    </div>

  </div>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    {relatedProducts.map((item) => (

      <Link
        key={item.id}
        to={`/product/${item.slug}`}
        className="group"
      >

        <article
          className="
          overflow-hidden
          rounded-[24px]
          border
          border-white/10
          bg-[#181818]
          transition-all
          duration-500
          hover:-translate-y-2
          hover:border-[#d72638]/40
          hover:shadow-[0_20px_50px_rgba(215,38,56,.15)]
          "
        >

          {/* Image */}

          <div className="relative overflow-hidden">

            <img
              src={item.colors[0]?.imageUrl}
              alt={item.name}
              className="
              h-[300px]
              w-full
              object-cover
              transition-all
              duration-700
              group-hover:scale-105
              "
            />

            <div
              className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/60
              via-transparent
              to-transparent
              "
            />

          </div>

          {/* Content */}

          <div className="p-5">

            <p
              className="
              text-[10px]
              uppercase
              tracking-[3px]
              text-[#ff7a86]
              "
            >
              {item.brand}
            </p>

            <h3
              className="
              mt-2
              line-clamp-2
              text-lg
              font-light
              uppercase
              leading-snug
              tracking-[1px]
              text-white
              "
              style={{
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {item.name}
            </h3>

            <div className="mt-4 flex items-center gap-3">

              {item.discountPrice ? (
                <>

                  <span className="text-xl font-semibold text-[#d72638]">
                    ₹{item.discountPrice}
                  </span>

                  <span className="text-sm text-gray-500 line-through">
                    ₹{item.price}
                  </span>

                </>

              ) : (

                <span className="text-xl font-semibold text-[#d72638]">
                  ₹{item.price}
                </span>

              )}

            </div>

          </div>

        </article>

      </Link>

    ))}

  </div>

</div>

{/* Continue Shopping */}

<div className="mt-16 flex justify-center">

  <Link
    to={`/category/${product.category.slug}`}
    className="
    rounded-full
    border
    border-[#d72638]
    bg-[#d72638]/10
    px-8
    py-3
    text-[12px]
    font-semibold
    uppercase
    tracking-[3px]
    text-white
    transition-all
    duration-300
    hover:bg-[#d72638]
    hover:scale-105
    "
  >
    Continue Shopping
  </Link>

</div>

</div>
</div>
</div>
</section>
  
  );
};

export default ProductDetails;
