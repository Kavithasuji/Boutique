
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
// import { getCart } from "../services/cart.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartQuantity,
  removeCartItem,
} from "../services/cart.service";

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
  price: string;
  discountPrice: string | null;
  category: Category;
}

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
  product: Product;
  color: ProductColor;
  inventory: Inventory;
}

interface CartItem {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  variant: Variant;
}

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      setCartItems(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const availableItems = useMemo(() => {
    return cartItems.filter((item) => item.variant.inventory.stock > 0);
  }, [cartItems]);

  const outOfStockItems = useMemo(() => {
    return cartItems.filter((item) => item.variant.inventory.stock === 0);
  }, [cartItems]);

  const hasOutOfStockItems = outOfStockItems.length > 0;

  const subtotal = useMemo(() => {
    return availableItems.reduce((total, item) => {
      const price = Number(
        item.variant.product.discountPrice ?? item.variant.product.price,
      );

      return total + price * item.quantity;
    }, 0);
  }, [availableItems]);

  const handleIncrease = async (item: CartItem) => {
    try {
      await updateCartQuantity(item.id, item.quantity + 1);

      toast.success("Quantity updated.");

      loadCart();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Unable to update quantity.",
      );
    }
  };
  const handleDecrease = async (item: CartItem) => {
    if (item.quantity === 1) return;

    try {
      await updateCartQuantity(item.id, item.quantity - 1);

      toast.success("Quantity updated.");

      loadCart();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Unable to update quantity.",
      );
    }
  };
  const handleRemove = async (cartId: string) => {
    try {
      await removeCartItem(cartId);

      toast.success("Item removed.");

      loadCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to remove item.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111111]">
        <div
          className="
                rounded-[28px]
                border
                border-white/10
                bg-[#181818]
                px-12
                py-10
                text-center
                "
        >
          <h1
            className="
                    text-[13px]
                    uppercase
                    tracking-[5px]
                    text-[#ff7a86]
                    "
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Loading Cart...
          </h1>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#111111]">
        <div
          className="
                rounded-[32px]
                border
                border-white/10
                bg-[#181818]
                px-14
                py-14
                text-center
                "
        >
          <ShoppingBag size={80} className="mx-auto text-[#d72638]" />

          <p
            className="
                    mt-8
                    text-[11px]
                    uppercase
                    tracking-[5px]
                    text-[#ff7a86]
                    "
          >
            Cupidanza Boutique
          </p>

          <h2
            className="
                    mt-4
                    text-4xl
                    font-light
                    uppercase
                    tracking-[3px]
                    text-white
                    "
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Your Cart Is Empty
          </h2>

          <p
            className="
                    mt-5
                    text-sm
                    leading-7
                    text-gray-400
                    "
          >
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/"
            className="
                    mt-10
                    inline-flex
                    rounded-full
                    bg-[#d72638]
                    px-10
                    py-3
                    text-[12px]
                    uppercase
                    tracking-[3px]
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[#bf2030]
                    "
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#111111] py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}

        <div className="mb-12">
          <p
            className="
                text-[11px]
                uppercase
                tracking-[5px]
                text-[#ff7a86]
                "
          >
            Cupidanza Boutique
          </p>
           <p
            className="
                text-[11px]
                uppercase
                tracking-[5px]
                text-[#ff7a86]
                "
          >
            Cupidanza Boutique
          </p>

          <h1
            className="
                mt-3
                text-4xl
                font-light
                uppercase
                tracking-[3px]
                text-white
                "
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Shopping Cart
          </h1>

          <p
            className="
                mt-3
                text-sm
                uppercase
                tracking-[3px]
                text-gray-500
                "
          >
            {cartItems.length} Item(s)
          </p>
        </div>

        {/* Main Layout */}

        {/* Main Layout */}

        <div className="grid gap-10 lg:grid-cols-[65%_35%]">
          {/* LEFT */}

          <div className="space-y-6">
            {availableItems.map((item) => {
              const price = Number(
                item.variant.product.discountPrice ??
                  item.variant.product.price,
              );

              return (
                <div
                  key={item.id}
                  className="
            rounded-3xl
            border
            border-white/10
            bg-[#181818]
            p-6
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-[#d72638]/40
            "
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Product Image */}

                    <div
                      className="
                    h-52
                    w-full
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#111111]
                    md:h-52
                    md:w-40
                    "
                    >
                      <img
                        src={item.variant.color.imageUrl}
                        alt={item.variant.product.name}
                        className="h-full w-full object-contain p-3"
                      />
                    </div>

                    {/* Product Details */}

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p
                          className="
                            text-[11px]
                            uppercase
                            tracking-[4px]
                            text-[#ff7a86]
                            "
                        >
                          {item.variant.product.brand}
                        </p>

                        <h2
                          className="
                            mt-3
                            text-2xl
                            font-light
                            uppercase
                            tracking-[2px]
                            text-white
                            "
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          {item.variant.product.name}
                        </h2>

                        <div className="mt-5 flex flex-wrap gap-3">
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
                                tracking-[2px]
                                text-[#ff7a86]
                                "
                          >
                            Color : {item.variant.color.color}
                          </span>

                          <span
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-[#111111]
                                px-4
                                py-1
                                text-[11px]
                                uppercase
                                tracking-[2px]
                                text-gray-300
                                "
                          >
                            Size : {item.variant.size}
                          </span>
                        </div>

                        <div className="mt-5">
                          {item.variant.inventory.stock > 0 ? (
                            <span
                              className="
                                    rounded-full
                                    border
                                    border-green-500/30
                                    bg-green-500/10
                                    px-4
                                    py-1
                                    text-[11px]
                                    uppercase
                                    tracking-[2px]
                                    text-green-400
                                    "
                            >
                              In Stock ({item.variant.inventory.stock})
                            </span>
                          ) : (
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
                                    tracking-[2px]
                                    text-[#ff7a86]
                                    "
                            >
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom */}

                      <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* Quantity */}

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-[#111111]
                                text-white
                                transition
                                hover:border-[#d72638]
                                "
                          >
                            −
                          </button>

                          <span
                            className="
                                flex
                                h-10
                                min-w-[55px]
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-white/10
                                bg-[#111111]
                                font-semibold
                                text-white
                                "
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleIncrease(item)}
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-[#111111]
                                text-white
                                transition
                                hover:border-[#d72638]
                                "
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}

                        <div className="text-right">
                          <p className="text-sm uppercase tracking-[2px] text-gray-500">
                            Price
                          </p>

                          <h3 className="text-2xl font-semibold text-[#d72638]">
                            ₹{price.toLocaleString()}
                          </h3>
                        </div>

                        {/* Subtotal */}

                        <div className="text-right">
                          <p className="text-sm uppercase tracking-[2px] text-gray-500">
                            Subtotal
                          </p>

                          <h3 className="text-2xl font-semibold text-white">
                            ₹{(price * item.quantity).toLocaleString()}
                          </h3>
                        </div>

                        {/* Remove */}

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="
                            rounded-full
                            border
                            border-white/10
                            bg-[#111111]
                            px-6
                            py-2
                            text-[12px]
                            uppercase
                            tracking-[3px]
                            text-gray-300
                            transition-all
                            duration-300
                            hover:border-[#d72638]
                            hover:text-[#d72638]
                            "
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {outOfStockItems.length > 0 && (
              <div className="mt-14">
                <div
                  className="
            mb-6
            rounded-2xl
            border
            border-[#d72638]/20
            bg-[#181818]
            p-5
            "
                >
                  <p
                    className="
                text-[11px]
                uppercase
                tracking-[4px]
                text-[#ff7a86]
                "
                  >
                    Cupidanza Boutique
                  </p>

                  <h2
                    className="
                mt-3
                text-2xl
                font-light
                uppercase
                tracking-[2px]
                text-white
                "
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    Out of Stock Items
                  </h2>

                  <p
                    className="
                mt-3
                text-sm
                leading-7
                text-gray-400
                "
                  >
                    These items are currently unavailable. Remove them before
                    proceeding to checkout.
                  </p>
                </div>

                <div className="space-y-6">
                  {outOfStockItems.map((item) => {
                    const price = Number(
                      item.variant.product.discountPrice ??
                        item.variant.product.price,
                    );

                    return (
                      <div
                        key={item.id}
                        className="
                        rounded-3xl
                        border
                        border-[#d72638]/20
                        bg-[#181818]
                        p-6
                        "
                      >
                        <div className="flex flex-col gap-6 md:flex-row">
                          {/* Image */}

                          <div
                            className="
                                h-52
                                w-full
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#111111]
                                md:h-52
                                md:w-40
                                "
                          >
                            <img
                              src={item.variant.color.imageUrl}
                              alt={item.variant.product.name}
                              className="h-full w-full object-contain p-3 opacity-60"
                            />
                          </div>

                          {/* Details */}

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h2
                                  className="
                                            text-2xl
                                            font-light
                                            uppercase
                                            tracking-[2px]
                                            text-white
                                            "
                                  style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                  }}
                                >
                                  {item.variant.product.name}
                                </h2>

                                <span
                                  className="
                                            rounded-full
                                            border
                                            border-[#d72638]/30
                                            bg-[#d72638]/10
                                            px-3
                                            py-1
                                            text-[11px]
                                            uppercase
                                            tracking-[2px]
                                            text-[#ff7a86]
                                            "
                                >
                                  Out of Stock
                                </span>
                              </div>

                              <p
                                className="
                                        mt-3
                                        text-[11px]
                                        uppercase
                                        tracking-[4px]
                                        text-[#ff7a86]
                                        "
                              >
                                {item.variant.product.brand}
                              </p>

                              <div className="mt-5 flex flex-wrap gap-3">
                                <span
                                  className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-[#111111]
                                            px-4
                                            py-1
                                            text-[11px]
                                            uppercase
                                            tracking-[2px]
                                            text-gray-300
                                            "
                                >
                                  Color : {item.variant.color.color}
                                </span>

                                <span
                                  className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-[#111111]
                                            px-4
                                            py-1
                                            text-[11px]
                                            uppercase
                                            tracking-[2px]
                                            text-gray-300
                                            "
                                >
                                  Size : {item.variant.size}
                                </span>
                              </div>

                              <p
                                className="
                                        mt-5
                                        text-sm
                                        text-[#ff7a86]
                                        "
                              >
                                This item is currently unavailable.
                              </p>
                            </div>

                            <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
                              <div className="text-right">
                                <p className="text-sm uppercase tracking-[2px] text-gray-500">
                                  Price
                                </p>

                                <h3 className="text-2xl font-semibold text-[#d72638]">
                                  ₹{price.toLocaleString()}
                                </h3>
                              </div>

                              <button
                                onClick={() => handleRemove(item.id)}
                                className="
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-[#111111]
                                        px-8
                                        py-3
                                        text-[12px]
                                        uppercase
                                        tracking-[3px]
                                        text-gray-300
                                        transition-all
                                        duration-300
                                        hover:border-[#d72638]
                                        hover:text-[#d72638]
                                        "
                              >
                                Remove Item
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}

       <div className="sticky top-28 h-fit">

    <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#181818]
        p-8
        backdrop-blur-xl
        "
    >

        <p
            className="
            text-[11px]
            uppercase
            tracking-[4px]
            text-[#ff7a86]
            "
        >
            Cupidanza Boutique
        </p>

        <h2
            className="
            mt-3
            border-b
            border-white/10
            pb-5
            text-2xl
            font-light
            uppercase
            tracking-[2px]
            text-white
            "
            style={{
                fontFamily: "'Montserrat', sans-serif",
            }}
        >
            Order Summary
        </h2>

        {/* Summary */}

        <div className="mt-8 space-y-6">

            {/* Products */}

            <div className="space-y-4">

                {availableItems.map((item) => {

                    const price = Number(
                        item.variant.product.discountPrice ??
                        item.variant.product.price
                    );

                    return (

                        <div
                            key={item.id}
                            className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#111111]
                            p-4
                            "
                        >

                            <div className="flex-1">

                                <h4
                                    className="
                                    font-medium
                                    text-white
                                    "
                                >
                                    {item.variant.product.name}
                                </h4>

                                <p
                                    className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                    "
                                >
                                    {item.variant.color.color} • {item.variant.size}
                                </p>

                                <p
                                    className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                    "
                                >
                                    Qty : {item.quantity}
                                </p>

                            </div>

                            <div className="text-right">

                                <p
                                    className="
                                    font-semibold
                                    text-[#d72638]
                                    "
                                >
                                    ₹{(price * item.quantity).toLocaleString()}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

            {/* Totals */}

            <div className="border-t border-white/10 pt-5">

                <div className="mb-4 flex items-center justify-between">

                    <span className="text-gray-400">
                        Items
                    </span>

                    <span className="font-medium text-white">
                        {availableItems.reduce(
                            (total, item) => total + item.quantity,
                            0
                        )}
                    </span>

                </div>

                <div className="mb-4 flex items-center justify-between">

                    <span className="text-gray-400">
                        Subtotal
                    </span>

                    <span className="font-medium text-white">
                        ₹{subtotal.toLocaleString()}
                    </span>

                </div>

                <div className="mb-4 flex items-center justify-between">

                    <span className="text-gray-400">
                        Shipping
                    </span>

                    <span className="font-medium text-green-400">
                        FREE
                    </span>

                </div>

                <div className="mb-4 flex items-center justify-between">

                    <span className="text-gray-400">
                        GST
                    </span>

                    <span className="font-medium text-white">
                        Included
                    </span>

                </div>

                <div
                    className="
                    mt-6
                    rounded-2xl
                    border
                    border-[#d72638]/20
                    bg-[#d72638]/10
                    p-5
                    "
                >

                    <div className="flex items-center justify-between">

                        <span
                            className="
                            text-lg
                            font-light
                            uppercase
                            tracking-[2px]
                            text-white
                            "
                        >
                            Total
                        </span>

                        <span
                            className="
                            text-3xl
                            font-semibold
                            text-[#ff7a86]
                            "
                        >
                            ₹{subtotal.toLocaleString()}
                        </span>

                    </div>

                </div>
                {/* Warning */}

{hasOutOfStockItems && (

    <div
        className="
        mt-8
        rounded-2xl
        border
        border-[#d72638]/20
        bg-[#d72638]/10
        p-5
        "
    >

        <p
            className="
            text-[11px]
            uppercase
            tracking-[4px]
            text-[#ff7a86]
            "
        >
            Attention
        </p>

        <h3
            className="
            mt-2
            text-lg
            font-light
            uppercase
            tracking-[2px]
            text-white
            "
            style={{
                fontFamily: "'Montserrat', sans-serif",
            }}
        >
            Checkout Unavailable
        </h3>

        <p
            className="
            mt-3
            text-sm
            leading-7
            text-gray-400
            "
        >
            One or more items in your cart are currently out of stock.
            Please remove those items before proceeding to checkout.
        </p>

    </div>

)}

{/* Buttons */}

<div className="mt-10 space-y-4">

    <button
        onClick={() => navigate("/checkout")}
        disabled={hasOutOfStockItems}
        className="
        flex
        w-full
        items-center
        justify-center
        rounded-full
        border
        border-[#d72638]
        bg-[#d72638]
        py-4
        text-[12px]
        uppercase
        tracking-[3px]
        text-white
        transition-all
        duration-300
        hover:bg-[#bf2030]
        hover:border-[#bf2030]
        disabled:cursor-not-allowed
        disabled:border-white/10
        disabled:bg-[#2a2a2a]
        disabled:text-gray-500
        "
    >
        Proceed to Checkout
    </button>

    <Link
        to="/"
        className="
        flex
        w-full
        items-center
        justify-center
        rounded-full
        border
        border-white/10
        bg-[#111111]
        py-4
        text-[12px]
        uppercase
        tracking-[3px]
        text-gray-300
        transition-all
        duration-300
        hover:border-[#d72638]
        hover:text-[#ff7a86]
        "
    >
        Continue Shopping
    </Link>

</div>

{/* Benefits */}

<div
    className="
    mt-10
    rounded-3xl
    border
    border-white/10
    bg-[#111111]
    p-6
    "
>

    <p
        className="
        text-[11px]
        uppercase
        tracking-[4px]
        text-[#ff7a86]
        "
    >
        Why Shop With Us
    </p>

    <h3
        className="
        mt-3
        text-xl
        font-light
        uppercase
        tracking-[2px]
        text-white
        "
        style={{
            fontFamily: "'Montserrat', sans-serif",
        }}
    >
        Shopping Benefits
    </h3>

    <div className="mt-6 space-y-4">

        <div className="flex items-center gap-3 border-b border-white/5 pb-3">

            <div className="h-2 w-2 rounded-full bg-[#d72638]" />

            <span className="text-sm text-gray-300">
                Free Shipping on all orders
            </span>

        </div>

        <div className="flex items-center gap-3 border-b border-white/5 pb-3">

            <div className="h-2 w-2 rounded-full bg-[#d72638]" />

            <span className="text-sm text-gray-300">
                7 Days Easy Return
            </span>

        </div>

        <div className="flex items-center gap-3 border-b border-white/5 pb-3">

            <div className="h-2 w-2 rounded-full bg-[#d72638]" />

            <span className="text-sm text-gray-300">
                Secure Online Payment
            </span>

        </div>

        <div className="flex items-center gap-3">

            <div className="h-2 w-2 rounded-full bg-[#d72638]" />

            <span className="text-sm text-gray-300">
                100% Authentic Products
            </span>

        </div>

    </div>

</div>

            </div>

        </div>
        </div></div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
