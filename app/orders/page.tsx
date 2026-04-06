"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Package, Loader2 } from "lucide-react";
import { commerceApi, Order } from "@/lib/api/commerce";
import AuthGuard from "@/providers/AuthGuard";
import { useAuth } from "@/providers/AuthContext";
import { resolveCustomerIdFromAccessToken } from "@/lib/resolveCustomerId";

export default function OrdersPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      setError("Please log in to view your orders");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("p4u_token");
    const customerId =
      localStorage.getItem("p4u_customer_id") || resolveCustomerIdFromAccessToken(token) || "";
    if (!customerId) {
      setError("Customer profile not linked. Please log out and log in again.");
      setLoading(false);
      return;
    }
    if (!localStorage.getItem("p4u_customer_id")) {
      localStorage.setItem("p4u_customer_id", customerId);
    }
    commerceApi
      .getOrders(customerId, { limit: 50 })
      .then((res) => {
        setError(null);
        // Backend stores line items in metadata.lines, map them to the items field
        const normalized = res.data.map((o: any) => ({
          ...o,
          items: Array.isArray(o.items) ? o.items
            : Array.isArray(o.metadata?.lines) ? o.metadata.lines.map((l: any, idx: number) => ({
                id: idx,
                productId: l.productId,
                productName: l.productName ?? `Product #${l.productId}`,
                quantity: l.quantity,
                price: Number(l.unitPrice || l.lineTotal || 0),
              }))
            : [],
        }));
        setOrders(normalized);
      })
      .catch(() => setError("Unable to load orders"))
      .finally(() => setLoading(false));
  }, [isLoggedIn, authLoading]);

  const cancelOrder = async (id: string) => {
    try {
      const updated = await commerceApi.cancelOrder(id);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o))
      );
    } catch {
      alert("Failed to cancel order");
    }
  };

  return (
    <AuthGuard>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6" /> My Orders
        </h1>

        {(loading || authLoading) && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        )}

        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && !authLoading && !error && orders.length === 0 && (
          <p className="text-center text-gray-400 py-20">No orders yet.</p>
        )}

        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-4 rounded-xl border bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order #{o.id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(o.createdAt).toLocaleDateString()} &middot;{" "}
                    {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">&#8377;{o.totalAmount}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      o.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : o.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {o.items.map((item) => (
                  <div key={item.id} className="text-sm flex justify-between text-gray-600">
                    <span>
                      {item.productName ?? `Product #${item.productId}`} x {item.quantity}
                    </span>
                    <span>&#8377;{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {o.status !== "delivered" && o.status !== "cancelled" && (
                <button
                  onClick={() => cancelOrder(o.id)}
                  className="mt-3 text-xs text-red-500 hover:underline"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
    </AuthGuard>
  );
}
