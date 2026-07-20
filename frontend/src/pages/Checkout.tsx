

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCheckoutSummary } from "../services/address.service";
import { createPaymentOrder,verifyPayment } from "../services/payment.service";
import logo from "../assets/logo/cupi.webp";

const Checkout = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [checkout, setCheckout] = useState<any>(null);

  useEffect(() => {
    fetchCheckout();
  }, []);

  const fetchCheckout = async () => {
    try {
      const res = await getCheckoutSummary();

      setCheckout(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



    const handlePayment = async () => {
  try {
    const order = await createPaymentOrder();

    const options = {
      key: order.key,

      amount: order.amount,

      currency: order.currency,

      order_id: order.orderId,

      name: "Cupidanza Boutique",

      description: "Fashion Purchase",
      // image: logo,
      prefill: {
        name: checkout.customer.name,
        email: checkout.customer.email,
        contact: checkout.address.phone,
      },
      theme: {
        color: "#dc2626",
      },

handler: async (response: any) => {
  try {
    const result = await verifyPayment({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    });


    // Refresh checkout/cart
    await fetchCheckout();

    // Navigate to Orders page
    navigate("/orders");
  } catch (error) {
    console.error(error);
  }
},

      modal: {
        ondismiss: () => {
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  } catch (error) {
    console.error(error);
    alert("Unable to initiate payment.");
  }
};

if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#111111]">

            <div
                className="
                rounded-[30px]
                border
                border-white/10
                bg-[#181818]
                px-14
                py-12
                text-center
                "
            >

                <div
                    className="
                    mx-auto
                    h-14
                    w-14
                    animate-spin
                    rounded-full
                    border-[3px]
                    border-[#d72638]
                    border-t-transparent
                    "
                />

                <p
                    className="
                    mt-8
                    text-[12px]
                    uppercase
                    tracking-[5px]
                    text-[#ff7a86]
                    "
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    Loading Checkout...
                </p>

            </div>

        </div>
    );
}

if (!checkout) {
    return (

        <div className="flex min-h-screen items-center justify-center bg-[#111111]">

            <div
                className="
                rounded-[30px]
                border
                border-white/10
                bg-[#181818]
                px-14
                py-12
                text-center
                "
            >

                <h2
                    className="
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
                    Unable to Load Checkout
                </h2>

            </div>

        </div>

    );
}

return (

<div className="min-h-screen bg-[#111111] py-12">

    <div className="mx-auto max-w-7xl px-4">

        {/* Header */}

        <div className="mb-10">

            <Link
                to="/cart"
                className="
                text-[11px]
                uppercase
                tracking-[4px]
                text-[#ff7a86]
                transition
                hover:text-white
                "
            >
                ← Back to Cart
            </Link>

            <p
                className="
                mt-6
                text-[11px]
                uppercase
                tracking-[5px]
                text-[#ff7a86]
                "
            >
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
                Secure Checkout
            </h1>

         
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

  {/* Left Section */}

  <div className="space-y-8 lg:col-span-2">

    {/* Customer */}

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
        Customer
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
        Contact Information
    </h2>

    <div className="mt-8 space-y-6">

        <div>

            <p
                className="
                text-[11px]
                uppercase
                tracking-[3px]
                text-gray-500
                "
            >
                Full Name
            </p>

            <h3 className="mt-2 text-xl font-medium text-white">
                {checkout.customer.name}
            </h3>

        </div>

        <div>

            <p
                className="
                text-[11px]
                uppercase
                tracking-[3px]
                text-gray-500
                "
            >
                Email Address
            </p>

            <h3 className="mt-2 text-xl font-medium text-white">
                {checkout.customer.email}
            </h3>

        </div>

    </div>

</div>

    {/* Address */}

   {/* Customer */}

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
        Customer
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
        Contact Information
    </h2>

    <div className="mt-8 space-y-6">

        <div>

            <p
                className="
                text-[11px]
                uppercase
                tracking-[3px]
                text-gray-500
                "
            >
                Full Name
            </p>

            <h3
                className="
                mt-2
                text-xl
                font-medium
                text-white
                "
            >
                {checkout.customer.name}
            </h3>

        </div>

        <div>

            <p
                className="
                text-[11px]
                uppercase
                tracking-[3px]
                text-gray-500
                "
            >
                Email Address
            </p>

            <h3
                className="
                mt-2
                text-xl
                font-medium
                text-white
                "
            >
                {checkout.customer.email}
            </h3>

        </div>

    </div>

</div>

{/* Address */}

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

    <div className="flex items-center justify-between">

        <div>

            <p
                className="
                text-[11px]
                uppercase
                tracking-[4px]
                text-[#ff7a86]
                "
            >
                Shipping
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
                Delivery Address
            </h2>

        </div>

        <button
            onClick={() => navigate("/profile")}
            className="
            rounded-full
            border
            border-white/10
            bg-[#111111]
            px-6
            py-2
            text-[11px]
            uppercase
            tracking-[3px]
            text-gray-300
            transition-all
            duration-300
            hover:border-[#d72638]
            hover:text-[#ff7a86]
            "
        >
            Change
        </button>

    </div>

    {checkout.address ? (

        <div
            className="
            mt-8
            rounded-2xl
            border
            border-white/10
            bg-[#111111]
            p-6
            "
        >

            <div className="flex items-center gap-3">

                <h3
                    className="
                    text-xl
                    font-medium
                    text-white
                    "
                >
                    {checkout.address.fullName}
                </h3>

                {checkout.address.isDefault && (

                    <span
                        className="
                        rounded-full
                        border
                        border-green-500/30
                        bg-green-500/10
                        px-3
                        py-1
                        text-[10px]
                        uppercase
                        tracking-[2px]
                        text-green-400
                        "
                    >
                        Default
                    </span>

                )}

            </div>

            <p
                className="
                mt-5
                text-gray-300
                "
            >
                {checkout.address.phone}
            </p>

            <div
                className="
                mt-5
                space-y-2
                text-gray-400
                "
            >

                <p>{checkout.address.addressLine1}</p>

                {checkout.address.addressLine2 && (
                    <p>{checkout.address.addressLine2}</p>
                )}

                <p>
                    {checkout.address.city}, {checkout.address.state}
                </p>

                <p>
                    {checkout.address.country} - {checkout.address.postalCode}
                </p>

            </div>

        </div>

    ) : (

        <div
            className="
            mt-8
            rounded-2xl
            border
            border-[#d72638]/20
            bg-[#d72638]/10
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
                Address Required
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
                No Delivery Address
            </h3>

            <p
                className="
                mt-4
                text-sm
                leading-7
                text-gray-400
                "
            >
                Please add a delivery address before placing your order.
            </p>

            <button
                onClick={() => navigate("/profile")}
                className="
                mt-6
                rounded-full
                bg-[#d72638]
                px-8
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
                Add Address
            </button>

        </div>

    )}

</div>

    {/* Cart Items */}
{/* Cart Items */}

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
        Your Order
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
        Order Items
    </h2>

    <div className="mt-8 space-y-6">

        {checkout.items.map((item: any) => {

            const price = Number(
                item.variant.product.discountPrice ??
                item.variant.product.price
            );

            return (

                <div
                    key={item.id}
                    className="
                    flex
                    flex-col
                    gap-6
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#111111]
                    p-5
                    transition-all
                    duration-300
                    hover:border-[#d72638]/30
                    md:flex-row
                    "
                >

                    {/* Image */}

                    <div
                        className="
                        h-40
                        w-full
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#181818]
                        md:w-36
                        "
                    >

                        <img
                            src={item.variant.color.imageUrl}
                            alt={item.variant.product.name}
                            className="h-full w-full object-contain p-3"
                        />

                    </div>

                    {/* Details */}

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

                            <h3
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
                            </h3>

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
                                    bg-[#181818]
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

                        </div>

                        {/* Bottom */}

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">

                            <div>

                                <p
                                    className="
                                    text-[11px]
                                    uppercase
                                    tracking-[3px]
                                    text-gray-500
                                    "
                                >
                                    Quantity
                                </p>

                                <h3 className="mt-2 text-lg font-medium text-white">
                                    {item.quantity}
                                </h3>

                            </div>

                            <div>

                                <p
                                    className="
                                    text-[11px]
                                    uppercase
                                    tracking-[3px]
                                    text-gray-500
                                    "
                                >
                                    Price
                                </p>

                                <h3 className="mt-2 text-lg font-semibold text-[#d72638]">
                                    ₹{price.toLocaleString()}
                                </h3>

                            </div>

                            <div>

                                <p
                                    className="
                                    text-[11px]
                                    uppercase
                                    tracking-[3px]
                                    text-gray-500
                                    "
                                >
                                    Total
                                </p>

                                <h3 className="mt-2 text-2xl font-semibold text-white">
                                    ₹{(price * item.quantity).toLocaleString()}
                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

            );

        })}

    </div>

</div>
</div>

  {/* Right Side */}

  <div>

<div className="sticky top-28">

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

            <div className="flex items-center justify-between">

                <span className="text-gray-400">
                    Items
                </span>

                <span className="font-medium text-white">
                    {checkout.items.length}
                </span>

            </div>

            <div className="flex items-center justify-between">

                <span className="text-gray-400">
                    Subtotal
                </span>

                <span className="font-medium text-white">
                    ₹{checkout.subtotal.toLocaleString()}
                </span>

            </div>

            <div className="flex items-center justify-between">

                <span className="text-gray-400">
                    Shipping
                </span>

                <span className="font-medium text-green-400">
                    FREE
                </span>

            </div>

            <div className="flex items-center justify-between">

                <span className="text-gray-400">
                    GST
                </span>

                <span className="font-medium text-white">
                    Included
                </span>

            </div>

            <div className="border-t border-white/10 pt-6">

                <div
                    className="
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
                            Grand Total
                        </span>

                        <span
                            className="
                            text-3xl
                            font-semibold
                            text-[#ff7a86]
                            "
                        >
                            ₹{checkout.total.toLocaleString()}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    {/* Address Warning */}

{/* Address Warning */}

{!checkout.address && (

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
            Action Required
        </p>

        <h3
            className="
            mt-3
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
            Delivery Address Required
        </h3>

        <p
            className="
            mt-3
            text-sm
            leading-7
            text-gray-400
            "
        >
            Please add a delivery address before proceeding to payment.
        </p>

    </div>

)}

{/* Payment Button */}

<div className="mt-10">

    <button
        onClick={handlePayment}
        disabled={!checkout.address}
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
        hover:border-[#bf2030]
        hover:bg-[#bf2030]
        disabled:cursor-not-allowed
        disabled:border-white/10
        disabled:bg-[#2a2a2a]
        disabled:text-gray-500
        "
    >
        Proceed to Secure Payment
    </button>

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
        Why Choose Us
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
                Free Shipping
            </span>

        </div>

        <div className="flex items-center gap-3 border-b border-white/5 pb-3">

            <div className="h-2 w-2 rounded-full bg-[#d72638]" />

            <span className="text-sm text-gray-300">
                Secure Razorpay Payment
            </span>

        </div>

        <div className="flex items-center gap-3 border-b border-white/5 pb-3">

            <div className="h-2 w-2 rounded-full bg-[#d72638]" />

            <span className="text-sm text-gray-300">
                100% Authentic Products
            </span>

        </div>

        <div className="flex items-center gap-3">

            <div className="h-2 w-2 rounded-full bg-[#d72638]" />

            <span className="text-sm text-gray-300">
                Easy Returns
            </span>

        </div>

    </div>

</div>

  </div>

</div>
  </div>

</div>
      </div>

    </div>
  );
};

export default Checkout;