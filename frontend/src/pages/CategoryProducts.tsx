import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

        discountPrice: Number(product.discountPrice ?? product.price),

        sizes: product.variants
          .filter((variant) => variant.color.color === color.color)
          .map((variant) => variant.size),
      })),
    );
  }, [products]);

  const colors = useMemo(() => {
    return [...new Set(productCards.map((p) => p.color))];
  }, [productCards]);

  const sizes = useMemo(() => {
    return [...new Set(productCards.flatMap((p) => p.sizes))];
  }, [productCards]);

  /*
      Price Range
  */

  const minPrice = useMemo(() => {
    if (!productCards.length) return 0;

    return Math.min(...productCards.map((p) => p.discountPrice));
  }, [productCards]);

  const maxPrice = useMemo(() => {
    if (!productCards.length) return 0;

    return Math.max(...productCards.map((p) => p.discountPrice));
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
        selectedColors.length === 0 || selectedColors.includes(product.color);

      const sizeMatch =
        selectedSizes.length === 0 ||
        product.sizes.some((size) => selectedSizes.includes(size));

      const priceMatch = product.discountPrice <= selectedPrice;

      return colorMatch && sizeMatch && priceMatch;
    });
  }, [productCards, selectedColors, selectedSizes, selectedPrice]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

 if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111]">

      <div className="text-center">

        <div
          className="
          mx-auto
          h-14
          w-14
          animate-spin
          rounded-full
          border-[3px]
          border-[#d72638]/20
          border-t-[#d72638]
          "
        />

        <p
          className="
          mt-8
          text-sm
          uppercase
          tracking-[4px]
          text-gray-400
          "
        >
          Loading Collection...
        </p>

      </div>

    </div>
  );
}


    return (
  <section className="min-h-screen bg-[#111111] py-20">

    <div className="mx-auto max-w-[1500px] px-8">

      {/* Breadcrumb */}

      <div
        className="
        flex
        items-center
        gap-3
        text-sm
        tracking-wide
        text-gray-500
        "
      >

        <Link
          to="/"
          className="transition hover:text-[#d72638]"
        >
          Home
        </Link>

        <span className="text-gray-700">/</span>

        <span className="uppercase tracking-[2px] text-[#d72638]">
          {category?.name}
        </span>

      </div>

      {/* Header */}



      <div className="mt-12 grid grid-cols-[300px_1fr] gap-10">
<aside
  className="
  sticky
  top-28
  h-fit
  overflow-hidden
  rounded-[32px]
  border
  border-white/10
  bg-[#181818]
  p-8
  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
  "
>

  {/* Header */}

  <div className="border-b border-white/10 pb-6">

    <span
      className="
      text-xs
      uppercase
      tracking-[4px]
      text-[#ff7a86]
      "
    >
      Refine Selection
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
      Filters
    </h2>

  </div>

  {/* Price */}

  <div className="mt-8 border-b border-white/10 pb-8">

    <h3
      className="
      mb-6
      text-sm
      font-medium
      uppercase
      tracking-[3px]
      text-white
      "
    >
      Price Range
    </h3>

    <input
      type="range"
      min={minPrice}
      max={maxPrice}
      value={selectedPrice}
      onChange={(e) => setSelectedPrice(Number(e.target.value))}
      className="w-full accent-[#d72638]"
    />

    <div className="mt-5 flex items-center justify-between">

      <span className="text-gray-500">
        ₹{minPrice}
      </span>

      <span
        className="
        rounded-full
        border
        border-[#d72638]/30
        bg-[#d72638]/10
        px-4
        py-1
        text-sm
        text-[#ff7a86]
        "
      >
        ₹{selectedPrice}
      </span>

    </div>

  </div>

  {/* Colors */}

  <div className="mt-8 border-b border-white/10 pb-8">

    <h3
      className="
      mb-6
      text-sm
      font-medium
      uppercase
      tracking-[3px]
      text-white
      "
    >
      Colors
    </h3>

    <div className="space-y-4">

      {colors.map((color) => (

        <label
          key={color}
          className="
          group
          flex
          cursor-pointer
          items-center
          justify-between
          "
        >

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={() => toggleColor(color)}
              className="
              h-4
              w-4
              accent-[#d72638]
              "
            />

            <span
              className="
              text-gray-300
              transition
              group-hover:text-white
              "
            >
              {color}
            </span>

          </div>

        </label>

      ))}

    </div>

  </div>

  {/* Sizes */}

  <div className="mt-8">

    <h3
      className="
      mb-6
      text-sm
      font-medium
      uppercase
      tracking-[3px]
      text-white
      "
    >
      Sizes
    </h3>

    <div className="flex flex-wrap gap-3">

      {sizes.map((size) => (

        <button
          key={size}
          onClick={() => toggleSize(size)}
          className={`
            rounded-full
            border
            px-5
            py-2.5
            text-sm
            uppercase
            tracking-[2px]
            transition-all
            duration-300
            ${
              selectedSizes.includes(size)
                ? "border-[#d72638] bg-[#d72638] text-white shadow-[0_8px_25px_rgba(215,38,56,0.30)]"
                : "border-white/10 bg-transparent text-gray-300 hover:border-[#d72638] hover:text-white"
            }
          `}
        >
          {size}
        </button>

      ))}

    </div>

  </div>

</aside>
{filteredProducts.length === 0 ? (
  <div className="flex min-h-[700px] items-center justify-center rounded-[32px] border border-white/10 bg-[#181818]">
    <div className="text-center">
      <h2
        className="text-4xl font-light uppercase tracking-[4px] text-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        No Products Found
      </h2>

      <p className="mt-5 text-gray-400">
        Try changing the filters.
      </p>
    </div>
  </div>
) : (

  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">

    {filteredProducts.map((product) => (

      <Link
        key={product.id}
        to={`/product/${product.slug}?color=${product.color}`}
        state={{
          selectedColor: product.color,
        }}
        className="group"
      >

       <article
  className="
  overflow-hidden
  rounded-[28px]
  border
  border-white/5
  bg-[#181818]
  transition-all
  duration-500
  hover:-translate-y-2
  hover:border-[#d72638]/40
  hover:shadow-[0_20px_60px_rgba(215,38,56,0.15)]
  "
>

          {/* Image */}

          <div className="relative overflow-hidden">

            <img
              src={product.image}
              alt={product.name}
              className="
h-[360px]
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
              "
            />

            {/* Gradient */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Color Badge */}

            <div
              className="
              absolute
              left-5
              top-5
              rounded-full
              border
              border-[#d72638]/40
              bg-black/70
              px-4
              py-2
              backdrop-blur-xl
              "
            >

              <span
              className="
text-[10px]
uppercase
tracking-[4px]
text-[#ff7a86]
"
              >
                {product.color}
              </span>

            </div>

            {/* View Overlay */}

            <div
              className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-black/40
              opacity-0
              transition
              duration-500
              group-hover:opacity-100
              "
            >

              <div
                className="
                rounded-full
                border
                border-white/20
                bg-white/10
                px-7
                py-3
                backdrop-blur-xl
                "
              >

                <span
                  className="
                  text-sm
                  uppercase
                  tracking-[3px]
                  text-white
                  "
                >
                  View Details
                </span>

              </div>

            </div>

          </div>

          {/* Content */}

          <div className="p-5">

            <p
              className="
              text-xs
              uppercase
              tracking-[3px]
              text-[#ff7a86]
              "
            >
              {product.brand}
            </p>

            <h4
              className="
              line-clamp-2
              text-xl
              font-light
              uppercase
              tracking-[1px]
              text-white
              "
              // style={{
              //   fontFamily: "'Montserrat', sans-serif",
              // }}
            >
              {product.name}
            </h4>

            {/* Sizes */}

            <div className="mt-1 flex flex-wrap gap-2">

              {product.sizes.map((size) => (

                <span
                  key={size}
                  className="
                  rounded-full
                  border
                  border-white/10
                  px-3
                  py-1
                  text-xs
                  uppercase
                  tracking-[2px]
                  text-gray-300
                  "
                >
                  {size}
                </span>

              ))}

            </div>

            {/* Price */}

            <div className="mt-7 flex items-end gap-3">

              {product.discountPrice < product.price ? (
                <>

                  <span className="text-3xl font-semibold text-[#d72638]">
                    ₹{product.discountPrice}
                  </span>

                  <span className="pb-1 text-gray-500 line-through">
                    ₹{product.price}
                  </span>

                </>
              ) : (

                <span className="text-3xl font-semibold text-[#d72638]">
                  ₹{product.price}
                </span>

              )}

            </div>

            {/* Button */}

            {/* <button
              className="
              mt-7
              flex
              w-full
              items-center
              justify-center
              rounded-full
              border
              border-[#d72638]
              bg-[#d72638]/10
              py-3.5
              text-sm
              font-semibold
              uppercase
              tracking-[2px]
              text-white
              transition-all
              duration-300
              hover:bg-[#d72638]
              "
            >
              View Product
            </button> */}

          </div>

        </article>

      </Link>

    ))}

  </div>

)}
<div
  className="
  flex
  min-h-[700px]
  items-center
  justify-center
  rounded-[32px]
  border
  border-white/10
  bg-[#181818]
  p-12
  "
>

  <div className="text-center">

    <div
   className="
text-[10px]
uppercase
tracking-[3px]
text-[#ff7a86]


      "
    >

      <span className="text-5xl">
        ✦
      </span>

    </div>

    <h2
      className="
      mt-10
      text-5xl
      font-light
      uppercase
      tracking-[4px]
      text-white
      "
      style={{
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      No Products Found
    </h2>

    <div
      className="
      mx-auto
      mt-6
      h-[2px]
      w-24
      rounded-full
      bg-[#d72638]
      "
    />

    <p
      className="
      mx-auto
      mt-8
      max-w-md
      leading-8
      text-gray-400
      "
    >
      No products match your current filters.
      Try selecting different sizes, colors,
      or adjusting the price range.
    </p>

  </div>

</div>
</div>
</div>

</section>

    )};
export default CategoryProducts;
