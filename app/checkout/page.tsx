"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CreditCard, Tag, Loader2, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import { useCart } from "@/providers/CartContext";
import { commerceApi, CheckoutQuote } from "@/lib/api/commerce";
import { paymentsApi } from "@/lib/api/payments";
import AuthGuard from "@/providers/AuthGuard";
import type { ApiError } from "@/lib/api/client";
import { useAppLoading } from "@/providers/AppLoadingProvider";

function messageFromApiError(e: unknown, fallback: string): string {
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as ApiError).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return fallback;
}

export default function CheckoutPage() {
  const { runWithLoading } = useAppLoading();
  const { items, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"idle" | "success" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const fetchQuote = useCallback(async (discount = couponDiscount) => {
    if (!subtotal) return;
    setLoading(true);
    setError(null);
    try {
      const q = await commerceApi.getCheckoutQuote({
        itemTotal: subtotal,
        discount,
      });
      setQuote(q);
    } catch {
      setError("Unable to fetch quote");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [subtotal, couponDiscount]);

  // Auto-fetch quote when items change
  useEffect(() => {
    if (items.length > 0) {
      fetchQuote();
    }
  }, [items.length, subtotal]);

  const applyCoupon = async () => {
    const code = coupon.trim();
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const validation = await commerceApi.validateCoupon(code, subtotal);
      if (!validation.valid) {
        setError(validation.message ?? "Invalid coupon");
        setCouponDiscount(0);
        return;
      }
      const discount = validation.discount ?? 0;
      setCouponDiscount(discount);
      await fetchQuote(discount);
    } catch {
      setError("Unable to validate coupon");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    setError(null);
    try {
      await runWithLoading(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("p4u_token") : null;
        if (!token) {
          setError("Please sign in to place an order.");
          return;
        }
        if (items.length > 0) {
          await commerceApi.updateCart(
            items.map((i) => ({
              productId: i.productId ?? i.id,
              quantity: i.qty,
              unitPrice: i.price,
              vendorId: i.vendorId || null,
            })),
          );
        }
        const order = await commerceApi.createOrderFromCart();
        const intent = await paymentsApi.createIntent({
          orderId: order.id,
          amount: quote?.total ?? subtotal,
        });

        let attempts = 0;
        const maxAttempts = 10;
        const pollPayment = async (): Promise<boolean> => {
          attempts++;
          try {
            const status = await paymentsApi.getIntent(intent.id);
            if (status.status === "succeeded" || status.status === "completed") return true;
            if (status.status === "failed" || status.status === "cancelled") return false;
          } catch {
            // continue polling
          }
          if (attempts < maxAttempts) {
            await new Promise((r) => setTimeout(r, 2000));
            return pollPayment();
          }
          return true;
        };

        const paid = await pollPayment();
        if (paid) {
          clearCart();
          setOrderStatus("success");
        } else {
          setOrderStatus("failed");
          setError("Payment was not completed. Please check your orders page.");
        }
      });
    } catch (e: unknown) {
      setError(messageFromApiError(e, "Failed to place order. Please try again."));
    } finally {
      setPlacing(false);
    }
  };

  if (orderStatus === "success") {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Order Placed!</h2>
            <p className="text-gray-500">Thank you for your purchase. Payment completed successfully.</p>
            <div className="flex gap-3 mt-4">
              <a href="/orders" className="px-6 py-2 rounded-xl border border-teal-600 text-teal-600 font-medium">
                View Orders
              </a>
              <a href="/" className="px-6 py-2 rounded-xl bg-teal-600 text-white font-medium">
                Continue Shopping
              </a>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  if (orderStatus === "failed") {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold">Payment Issue</h2>
            <p className="text-gray-500 text-center max-w-md">
              Your order was created but payment could not be confirmed. Please check your orders page for status.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="/orders" className="px-6 py-2 rounded-xl bg-teal-600 text-white font-medium">
                View Orders
              </a>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-20">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-4 space-y-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Order Summary
                </h2>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.qty}
                    </span>
                    <span>&#8377;{item.price * item.qty}</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Subtotal</span>
                  <span>&#8377;{subtotal}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-4">
                <h2 className="font-semibold flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5" /> Coupon Code
                </h2>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code (optional)"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </button>
                </div>
              </div>

              {quote && (
                <div className="bg-white rounded-xl border p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>&#8377;{quote.itemTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee</span>
                    <span>&#8377;{quote.platformFee}</span>
                  </div>
                  {quote.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-&#8377;{quote.discount}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>&#8377;{quote.total}</span>
                  </div>
                  {quote.currency && (
                    <p className="text-xs text-gray-400">Currency: {quote.currency}</p>
                  )}
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {placing
                  ? "Placing Order..."
                  : `Pay ₹${quote?.total ?? subtotal}`}
              </button>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
