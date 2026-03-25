"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, ShoppingBag, Trash2, Bookmark,
  Shield, Check, Eye,
} from "lucide-react";
import { useCart } from "@/app/cart/CartContext";
 
const PRIMARY_MID  = "#1a4a3a";
const TEAL_ACCENT  = "#0d9488";
const PLATFORM_FEE = 50;
const BTN_GRAD     = "radial-gradient(at 60% 25%, rgb(26,74,58) 0%, rgb(14,34,31) 55%, rgb(8,24,18) 100%)";
 
function formatPrice(n: number): string {
  return "₹" + Number(n).toLocaleString("en-IN");
}

const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

function getWeekDays(baseDate: Date): Date[] {
  const d   = new Date(baseDate);
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(mon);
    dt.setDate(mon.getDate() + i);
    return dt;
  });
}

const TIME_SLOTS = [
  { label: "Morning 9–11 AM",   value: "morning"   },
  { label: "Afternoon 12–3 PM", value: "afternoon" },
  { label: "Evening 4–6 PM",    value: "evening"   },
];
 
interface DisplayItem {
  id: string | number;
  name: string;
  vendor: string;
  color: string;
  price: number;
  originalPrice: number;
  discount: number;
  delivery: string;
  image: string;
  qty: number;
}

interface PaymentMethod {
  id: string;
  label: string;
  sub?: string;
  right?: React.ReactNode;
  cardIcons?: boolean;
  otherIcons?: boolean;
}
 
function PrimaryBtn({
  children,
  onClick,
  style = {},
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: BTN_GRAD,
        color: "white",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        fontWeight: 700,
        borderRadius: 10,
        transition: "opacity 0.15s, transform 0.1s",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.88"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      onMouseDown={e  => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e    => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}
 
function AddressBar({ address, onChangeAddress }: { address: string; onChangeAddress?: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderRadius: 10, padding: "10px 14px", marginBottom: 12,
      border: "1px solid #e5e7eb", background: "white", flexWrap: "wrap", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 600 }}>Delivered To:</span>
        <span style={{ color: "#6b7280" }}>{address}</span>
      </div>
      <button
        onClick={onChangeAddress}
        style={{
          fontSize: 11, fontWeight: 600, border: "1px solid #d1d5db",
          borderRadius: 6, padding: "4px 10px", background: "white", color: "#374151",
          cursor: "pointer", transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = TEAL_ACCENT; e.currentTarget.style.color = TEAL_ACCENT; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}>
        Change
      </button>
    </div>
  );
} 
export default function CartCheckout({
  onBack,
  address = "P4U Complex - 605001",
}: {
  onBack?: () => void;
  address?: string;
}) {
  const pageRef = useRef<HTMLDivElement>(null);
  const { items: cartItems, removeFromCart, updateQty } = useCart(); 
  const [step, setStep]               = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 10, 11));
  const [weekBase, setWeekBase]       = useState<Date>(new Date(2026, 10, 7));
  const [selectedTime, setSelectedTime] = useState<string>("morning");
  const [redeemInput, setRedeemInput] = useState<string>("");
  const [redeemApplied, setRedeemApplied] = useState<boolean>(false);
  const [redeemPoints, setRedeemPoints] = useState<number>(0);
  const [payMethod, setPayMethod]     = useState<string>("card");
  const [cardNum, setCardNum]         = useState<string>("");
  const [cardExp, setCardExp]         = useState<string>("");
  const [cardCvv, setCardCvv]         = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>(address);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [addressInput, setAddressInput] = useState<string>(""); 
  const items: DisplayItem[] = useMemo(() => cartItems.map(i => ({
    id:            i.id,
    name:          i.name,
    vendor:        i.vendor,
    color:         i.color || "",
    price:         i.price,
    originalPrice: i.originalPrice,
    discount:      i.originalPrice > i.price
                     ? Math.round((1 - i.price / i.originalPrice) * 100)
                     : 0,
    delivery:      i.delivery || "Standard delivery",
    image:         i.imageUrl || i.image || "",
    qty:           i.qty,
  })), [cartItems]);

  const itemTotal  = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const redeemSave = redeemApplied ? redeemPoints : 0;
  const total      = itemTotal + PLATFORM_FEE - redeemSave;
  const weekDays   = useMemo(() => getWeekDays(weekBase), [weekBase]);

  const scrollToTop = useCallback(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function goToStep(n: number) {
    setStep(n);
    scrollToTop();
  }

  function changeQty(id: string | number, delta: number) {
    const item = cartItems.find(i => i.id === id);
    if (item) updateQty(id, Math.max(1, item.qty + delta));
  }

  function removeItem(id: string | number) {
    removeFromCart(id);
  }
 
  const stepLabels = [
    { short: "Cart"    },
    { short: "Payment" },
    { short: "Confirm" },
  ];

  function Stepper() { 
    if (items.length === 0) return null;

    return (
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, padding: "4px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 400 }}>
          {stepLabels.map((s, i) => {
            const done   = step > i;
            const active = step === i;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? "1" : "0 0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                    background: done || active ? BTN_GRAD : "#e5e7eb",
                    color: done || active ? "white" : "#9ca3af",
                    boxShadow: active ? "0 2px 8px rgba(14,34,31,0.4)" : "none",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}>
                    {done ? <Check size={10} /> : i + 1}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
                    color: active ? PRIMARY_MID : done ? "#374151" : "#9ca3af",
                  }}>{s.short}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div style={{
                    flex: 1, height: 2, margin: "0 6px", marginBottom: 14,
                    background: done ? `linear-gradient(90deg, ${PRIMARY_MID}, ${TEAL_ACCENT})` : "#e5e7eb",
                    borderRadius: 99, transition: "background 0.3s",
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } 
  function Sidebar({ showRedeem = true }: { showRedeem?: boolean }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {showRedeem && (
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e5e7eb", padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>Redeem Points</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input
                value={redeemInput}
                onChange={e => setRedeemInput(e.target.value)}
                placeholder="Enter Points"
                style={{
                  flex: 1, border: "1px solid #e5e7eb", borderRadius: 8,
                  padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", minWidth: 0,
                }}
              />
              <PrimaryBtn
                onClick={() => {
                  const pts = parseInt(redeemInput) || 0;
                  if (pts > 0) { setRedeemPoints(pts); setRedeemApplied(true); }
                }}
                style={{ padding: "8px 14px", fontSize: 12, borderRadius: 8, flexShrink: 0 }}>
                Apply
              </PrimaryBtn>
            </div>
            {redeemApplied
              ? <p style={{ fontSize: 10, color: "#059669", fontWeight: 500 }}>Applied: {formatPrice(redeemPoints)} off</p>
              : <p style={{ fontSize: 10, color: TEAL_ACCENT }}>You have 3104 reward points</p>
            }
          </div>
        )}

        <div style={{ background: "white", borderRadius: 10, border: "1px solid #e5e7eb", padding: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>Price details</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {([
              { label: `Price (${items.length} item${items.length !== 1 ? "s" : ""})`, val: formatPrice(itemTotal), color: "#374151" },
              { label: "Platform Fee", val: formatPrice(PLATFORM_FEE), color: "#374151" },
              ...(redeemApplied ? [{ label: "Redeem Points", val: `-${formatPrice(redeemSave)}`, color: "#059669" }] : []),
            ] as { label: string; val: string; color: string }[]).map(({ label, val, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
                <span>{label}</span>
                <span style={{ fontWeight: 600, color }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#111827" }}>
              <span>Total Amount</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          {redeemApplied && (
            <p style={{ fontSize: 11, fontWeight: 600, marginTop: 8, color: TEAL_ACCENT }}>
              You will save {formatPrice(redeemSave)} on this order
            </p>
          )}
          <PrimaryBtn
            disabled={items.length === 0}
            onClick={() => goToStep(Math.min(step + 1, 2))}
            style={{ width: "100%", marginTop: 14, padding: "11px 0", fontSize: 13, borderRadius: 10, display: "block" }}>
            Proceed to Buy
          </PrimaryBtn>
        </div>
      </div>
    );
  }
 
  function Breadcrumb() {
    const crumbs = ["Home", "Cart", "Checkout"];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af", marginBottom: 16, flexWrap: "wrap" }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {i > 0 && <span style={{ color: "#d1d5db" }}>›</span>}
            <span
              style={{
                color: i === crumbs.length - 1 ? "#374151" : undefined,
                fontWeight: i === crumbs.length - 1 ? 600 : 400,
                cursor: i < crumbs.length - 1 ? "pointer" : "default",
              }}
              onMouseEnter={e => { if (i < crumbs.length - 1) (e.target as HTMLElement).style.color = TEAL_ACCENT; }}
              onMouseLeave={e => { if (i < crumbs.length - 1) (e.target as HTMLElement).style.color = ""; }}>
              {c}
            </span>
          </span>
        ))}
      </div>
    );
  }
 
  function CartStep() {
    if (items.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "60px 16px" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>Add some products to get started!</p>
          <PrimaryBtn onClick={onBack} style={{ padding: "10px 24px", fontSize: 13 }}>
            Continue Shopping
          </PrimaryBtn>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1f2937", margin: 0 }}>Review Your Order</h1>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
            Please verify your order and payment details before completing your purchase.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="cart-layout">
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <AddressBar address={currentAddress} onChangeAddress={() => setShowAddressModal(true)} />
            {items.map(item => (
              <div key={item.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", border: "1px solid #f3f4f6", flexShrink: 0, background: "#f9fafb" }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>📦</div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", lineHeight: 1.4, margin: 0, wordBreak: "break-word" }}>{item.name}</p>
                        {item.color && <p style={{ fontSize: 10, color: "#9ca3af", margin: "3px 0 0" }}>{item.color}</p>}
                        <p style={{ fontSize: 10, color: "#9ca3af", margin: "1px 0 0" }}>
                          Vendor: <span style={{ fontWeight: 600, color: TEAL_ACCENT }}>{item.vendor}</span>
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{formatPrice(item.price * item.qty)}</p>
                        {item.discount > 0 && (
                          <>
                            <p style={{ fontSize: 10, color: "#9ca3af", textDecoration: "line-through", margin: "2px 0" }}>{formatPrice(item.originalPrice * item.qty)}</p>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#059669" }}>{item.discount}% Off</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: "#6b7280", margin: "8px 0 2px" }}>
                      Eligible for <span style={{ fontWeight: 600, color: TEAL_ACCENT }}>FREE Shipping.</span>
                    </p>
                    <p style={{ fontSize: 10, color: "#059669", fontWeight: 600, margin: "0 0 8px" }}>{item.delivery}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                        {([
                          { label: "−", action: () => changeQty(item.id, -1) },
                          { label: String(item.qty), action: null as (() => void) | null },
                          { label: "+", action: () => changeQty(item.id, +1) },
                        ]).map((btn, bi) => (
                          <button key={bi} onClick={btn.action ?? undefined}
                            style={{
                              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, fontWeight: 700, background: "white",
                              border: "none", borderLeft: bi > 0 ? "1px solid #e5e7eb" : "none",
                              cursor: btn.action ? "pointer" : "default", color: "#374151", fontFamily: "inherit",
                            }}>
                            {btn.label}
                          </button>
                        ))}
                      </div>
                      <button
                        style={{ fontSize: 10, fontWeight: 600, color: "#6b7280", display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = TEAL_ACCENT)}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#6b7280")}>
                        <Bookmark size={10} /> Save for later
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#ef4444")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#9ca3af")}>
                        <Trash2 size={10} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sidebar-col">
            <Sidebar showRedeem={true} />
          </div>
        </div>
      </div>
    );
  }
 
  function PaymentStep() {
    const methods: PaymentMethod[] = [
      {
        id: "razorpay", label: "Razorpay",
        sub: "You will be redirected to the Razorpay website after submitting your order.",
        right: <span style={{ fontSize: 14, fontWeight: 900, color: "#2d6df6", fontFamily: "sans-serif" }}>✦Razorpay</span>,
      },
      { id: "card",  label: "Pay with Credit Card", cardIcons: true },
      { id: "bank",  label: "Direct Bank Transfer",  sub: "Make payment directly through bank account." },
      { id: "other", label: "Other Payment Methods", sub: "Make payment through Gpay, Phonepay, Paytm etc.", otherIcons: true },
      { id: "cod",   label: "Cash on Delivery" },
    ];

    return (
      <div style={{ display: "flex", gap: 16, flexDirection: "column" }} className="cart-layout">
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <AddressBar address={currentAddress} onChangeAddress={() => setShowAddressModal(true)} />
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 14 }}>Payment Method</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {methods.map(pm => (
                <div key={pm.id} onClick={() => setPayMethod(pm.id)}
                  style={{
                    borderRadius: 10, padding: 12, cursor: "pointer",
                    border: `1px solid ${payMethod === pm.id ? PRIMARY_MID : "#e5e7eb"}`,
                    background: payMethod === pm.id ? "#f0fdf4" : "white",
                    transition: "all 0.15s",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: `2px solid ${payMethod === pm.id ? PRIMARY_MID : "#d1d5db"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {payMethod === pm.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: BTN_GRAD }} />}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#1f2937", flex: 1 }}>{pm.label}</span>
                    {pm.right}
                    {pm.cardIcons && (
                      <div style={{ display: "flex", gap: 4 }}>
                        {([ ["#1a1f71","VISA"], ["#f97316","DISC"], ["#eb001b","MC"], ["#ff5f00","MS"] ] as [string,string][]).map(([bg, t], i) => (
                          <div key={i} style={{ width: 30, height: 18, borderRadius: 4, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 6, fontWeight: 900, color: "white" }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {pm.otherIcons && (
                      <div style={{ display: "flex", gap: 4 }}>
                        {([ ["#5f259f","P"], ["#00b9f1","N"], ["#4285f4","G"] ] as [string,string][]).map(([bg, t], i) => (
                          <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 8, fontWeight: 900, color: "white" }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {pm.sub && payMethod !== pm.id && (
                    <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4, marginLeft: 26 }}>{pm.sub}</p>
                  )}
                  {pm.id === "card" && payMethod === "card" && (
                    <div style={{ marginTop: 12, marginLeft: 26, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <p style={{ fontSize: 9, color: "#9ca3af", marginBottom: 4 }}>Card number</p>
                        <div style={{ position: "relative" }}>
                          <input value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="1234 5678 9012 3456"
                            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 36px 8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                          {cardNum.length >= 16 && (
                            <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: "50%", background: BTN_GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Check size={10} style={{ color: "white" }} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <p style={{ fontSize: 9, color: "#9ca3af", marginBottom: 4 }}>Expiration Date</p>
                          <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY"
                            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 100 }}>
                          <p style={{ fontSize: 9, color: "#9ca3af", marginBottom: 4 }}>Security Code</p>
                          <input value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="•••" type="password"
                            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={12} style={{ color: "#9ca3af" }} />
              </div>
              <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                We protect your payment information using encryption to provide bank-level security.
              </p>
            </div>

            <PrimaryBtn onClick={() => goToStep(2)} style={{ width: "100%", marginTop: 14, padding: "12px 0", fontSize: 13, display: "block" }}>
              Pay {formatPrice(total)}
            </PrimaryBtn>
          </div>
        </div>

        <div className="sidebar-col">
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 14 }}>Payment summary</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {([
                { label: "Item total",   val: formatPrice(itemTotal),    dash: true },
                { label: "Platform Fee", val: formatPrice(PLATFORM_FEE), dash: true },
              ] as { label: string; val: string; dash: boolean }[]).map(({ label, val, dash }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280",
                  paddingBottom: 10, borderBottom: dash ? "1px dashed #e5e7eb" : "none",
                }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#111827" }}>
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  function SuccessStep() {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", padding: "0 16px" }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%", background: BTN_GRAD,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(14,34,31,0.35)",
          }}>
            <Check size={40} style={{ color: "white" }} strokeWidth={2.5} />
          </div>
          <div style={{
            display: "inline-block", padding: "3px 14px", borderRadius: 99, fontSize: 11,
            fontWeight: 600, background: "#f0fdf4", color: "#059669", border: "1px solid #d1fae5", marginBottom: 16,
          }}>
            Order Confirmed
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
            Your order of {formatPrice(itemTotal)}
          </h2>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: "0 0 32px" }}>has been successfully placed!</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={onBack ?? (() => goToStep(0))}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10,
                border: "2px solid #e5e7eb", fontSize: 13, fontWeight: 700, color: "#374151",
                background: "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = PRIMARY_MID; (e.currentTarget as HTMLElement).style.color = PRIMARY_MID; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.color = "#374151"; }}>
              <ShoppingBag size={14} /> Back to Home
            </button>
            <PrimaryBtn style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 13 }}>
              <Eye size={14} /> View Order
            </PrimaryBtn>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div ref={pageRef} style={{  }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .cart-layout { display: flex; flex-direction: column; gap: 16px; }
        .sidebar-col { width: 100%; }
        @media (min-width: 768px) {
          .cart-layout { flex-direction: row; }
          .sidebar-col { width: 280px; min-width: 280px; flex-shrink: 0; }
        }
        @media (min-width: 1024px) {
          .sidebar-col { width: 300px; min-width: 300px; }
        }
        input:focus {
          border-color: ${TEAL_ACCENT} !important;
          box-shadow: 0 0 0 2px rgba(13,148,136,0.12);
        }
      `}</style>

      {/* ── Address Change Modal ── */}
      {showAddressModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.45)", display: "flex",
            alignItems: "center", justifyContent: "center", padding: 16,
          }}
          onClick={() => setShowAddressModal(false)}
        >
          <div
            style={{ background: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}>Change Delivery Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, fontSize: 18, lineHeight: 1 }}>
                ✕
              </button>
            </div> 
            <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Saved Addresses</p>
            {[
              "P4U Complex - 605001",
              "SF No.250/2 JJ Nagar, Coimbatore - 641016",
            ].map((addr, i) => (
              <div
                key={i}
                onClick={() => { setCurrentAddress(addr); setShowAddressModal(false); }}
                style={{
                  padding: "10px 14px", borderRadius: 10, marginBottom: 8, cursor: "pointer",
                  border: `1px solid ${currentAddress === addr ? PRIMARY_MID : "#e5e7eb"}`,
                  background: currentAddress === addr ? "#f0fdf4" : "white",
                  fontSize: 12, color: "#374151", transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (currentAddress !== addr) e.currentTarget.style.borderColor = TEAL_ACCENT; }}
                onMouseLeave={e => { if (currentAddress !== addr) e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{addr}</span>
                  {currentAddress === addr && <Check size={13} style={{ color: PRIMARY_MID, flexShrink: 0 }} />}
                </div>
              </div>
            ))}
 
            <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", margin: "14px 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enter New Address</p>
            <input
              value={addressInput}
              onChange={e => setAddressInput(e.target.value)}
              placeholder="Type your delivery address..."
              style={{
                width: "100%", border: "1px solid #e5e7eb", borderRadius: 10,
                padding: "10px 14px", fontSize: 12, outline: "none",
                fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12,
              }}
            />
            <PrimaryBtn
              disabled={!addressInput.trim()}
              onClick={() => {
                if (addressInput.trim()) {
                  setCurrentAddress(addressInput.trim());
                  setAddressInput("");
                  setShowAddressModal(false);
                }
              }}
              style={{ width: "100%", padding: "10px 0", fontSize: 13 }}>
              Save Address
            </PrimaryBtn>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 12px" }}>
        {step < 2 && items.length > 0 && <Breadcrumb />}
        {step < 2 && <Stepper />}
        {step === 0 && <CartStep />}
        {step === 1 && <PaymentStep />}
        {step === 2 && <SuccessStep />}
      </div>
    </div>
  );
}