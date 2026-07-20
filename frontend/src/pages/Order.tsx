import { useEffect, useState } from "react";
import { getMyOrders } from "../services/cart.service";

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111]">
        <div className="rounded-3xl border border-white/10 bg-[#181818] px-12 py-10">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-[#d72638] border-t-transparent" />

          <p
            className="mt-6 text-center text-[12px] uppercase tracking-[4px] text-[#ff7a86]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Loading Orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4">
        <div className="rounded-3xl border border-[#d72638]/20 bg-[#181818] px-10 py-10 text-center">
          <h2
            className="text-2xl font-light uppercase tracking-[2px] text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {error}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12 ">
      <div className="mx-auto max-w-6xl px-4">
         <p className="mt-9 text-sm text-gray-400">
        </p>
        <p className="text-[11px] uppercase tracking-[4px] text-[#ff7a86]">
          Cupidanza Boutique
        </p>

        <h1
          className="mt-3 text-4xl font-light uppercase tracking-[3px] text-white"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          My Orders
        </h1>

        <p className="mt-4 text-sm text-gray-400">
          View your recent purchases and payment details.
        </p>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-[#181818] p-12 text-center backdrop-blur-xl">
            <h2
              className="text-2xl font-light uppercase tracking-[2px] text-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              No Orders Found
            </h2>

            <p className="mt-4 text-gray-400">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#181818] backdrop-blur-xl"
              >
                {/* Header */}

                <div className="flex flex-col gap-6 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[4px] text-[#ff7a86]">
                      Order
                    </p>

                    <h2
                      className="mt-2 text-2xl font-light uppercase tracking-[2px] text-white"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      #{order.id.slice(0, 8)}
                    </h2>

                    <p className="mt-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="rounded-full border border-[#d72638]/30 bg-[#d72638]/10 px-4 py-2 text-[11px] uppercase tracking-[3px] text-[#ff7a86]">
                      {order.orderStatus}
                    </span>

                    <p className="mt-4 text-sm text-gray-300">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>

                {/* Products */}

                <div className="divide-y divide-white/10">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-5 p-6 md:flex-row"
                    >
                      <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
                        <img
                          src={item.variant.color.imageUrl}
                          alt={item.variant.product.name}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-white">
                          {item.variant.product.name}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <span className="rounded-full border border-white/10 bg-[#111111] px-4 py-1 text-xs uppercase tracking-[2px] text-gray-300">
                            {item.variant.color.color}
                          </span>

                          <span className="rounded-full border border-white/10 bg-[#111111] px-4 py-1 text-xs uppercase tracking-[2px] text-gray-300">
                            Size {item.variant.size}
                          </span>

                          <span className="rounded-full border border-white/10 bg-[#111111] px-4 py-1 text-xs uppercase tracking-[2px] text-gray-300">
                            Qty {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-xl font-semibold text-[#ff7a86]">
                        ₹{Number(item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}

                <div className="flex flex-col gap-6 border-t border-white/10 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[3px] text-gray-500">
                      Total Amount
                    </p>

                    <h2 className="mt-2 text-3xl font-semibold text-[#ff7a86]">
                      ₹{Number(order.totalAmount).toLocaleString()}
                    </h2>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400 md:text-right">
                    <p>
                      <span className="text-white">Payment:</span>{" "}
                      {order.payment?.paymentMethod}
                    </p>

                    <p className="break-all">
                      <span className="text-white">Transaction:</span>{" "}
                      {order.payment?.transactionId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;