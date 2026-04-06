"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import authIllustration from "../../images/auth/login.png"; 
type Step = "login" | "otp" | "success";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (phone: string) => void;
}

// ─── Constants ────── 
const TEAL      = "#0d9488";
const TEAL_DARK = "#0f766e";
const OTP_LEN   = 6;
const RESEND_S  = 30;

// ─── Helpers ─────────
function validatePhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (!d)              return "Mobile number is required.";
  if (d.length !== 10) return "Enter a valid 10-digit mobile number.";
  if (!/^[6-9]/.test(d)) return "Number must start with 6, 7, 8 or 9.";
  return "";
}
function maskPhone(p: string) {
  return `+91-0${p.slice(0, 3)}***${p.slice(-3)}`;
}

// ─── Spinner ─────────────
function Spinner() {
  return (
    <span style={{
      width: 13, height: 13,
      border: "2px solid rgba(255,255,255,0.35)",
      borderTopColor: "white",
      borderRadius: "50%",
      display: "inline-block",
      animation: "auth-spin 0.65s linear infinite",
    }} />
  );
}

function BrandIcon() {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%",
      border: "2px solid #e5e7eb",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "white",
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    </div>
  );
}

function LoginStep({ onSendOtp, onPasswordLogin }: { onSendOtp: (phone: string) => void; onPasswordLogin: (username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitLock = useRef(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function submit() {
    if (submitLock.current || cooldown > 0) return;
    if (!username.trim()) { setError("Username is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setError("");
    submitLock.current = true;
    setLoading(true);
    try {
      await onPasswordLogin(username.trim(), password);
    } catch (e: any) {
      if (e?.status === 429) {
        const waitSec = 30;
        setCooldown(waitSec);
        setError(`Too many attempts. Please wait ${waitSec}s before trying again.`);
      } else {
        setError(e?.message || "Login failed. Check your credentials.");
      }
    } finally {
      submitLock.current = false;
      setLoading(false);
    }
  }

  const SOCIALS = [
    {
      name: "Google",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: "Apple",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", textAlign: "center", margin: "0 0 20px" }}>
        Log in
      </h2>

      <input
        ref={inputRef}
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => { setUsername(e.target.value); if (error) setError(""); }}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{
          width: "100%", padding: "10px 12px",
          borderRadius: 8, border: `1.5px solid ${error && !username ? "#ef4444" : "#e5e7eb"}`,
          fontSize: 12.5, color: "#111827", background: "white",
          outline: "none", fontFamily: "inherit", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => { setPassword(e.target.value); if (error) setError(""); }}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{
          marginTop: 10, width: "100%", padding: "10px 12px",
          borderRadius: 8, border: `1.5px solid ${error && !password ? "#ef4444" : "#e5e7eb"}`,
          fontSize: 12.5, color: "#111827", background: "white",
          outline: "none", fontFamily: "inherit", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />

      {error && (
        <p style={{ fontSize: 10.5, color: "#ef4444", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="#ef4444">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z"/>
          </svg>
          {error}
        </p>
      )}
      <button
        onClick={submit}
        disabled={loading || cooldown > 0}
        style={{
          marginTop: 13, width: "100%", padding: "11px 0",
          borderRadius: 8, border: "none",
          background: (loading || cooldown > 0) ? "#9ca3af" : TEAL,
          color: "white", fontSize: 15,  letterSpacing: "0.01em",
          cursor: (loading || cooldown > 0) ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          fontFamily: "inherit", transition: "background 0.15s",
          boxShadow: (loading || cooldown > 0) ? "none" : `0 3px 14px rgba(13,148,136,0.35)`,
        }}
        onMouseEnter={e => { if (!loading && cooldown <= 0) e.currentTarget.style.background = TEAL_DARK; }}
        onMouseLeave={e => { if (!loading && cooldown <= 0) e.currentTarget.style.background = TEAL; }}
      >
        {loading ? <><Spinner /> Logging in…</> : cooldown > 0 ? `Retry in ${cooldown}s` : "Log in  →"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "15px 0" }}>
        <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SOCIALS.map(({ name, icon }) => (
          <button
            key={name}
            style={{
              width: "100%", padding: "9px 16px",
              borderRadius: 8, border: "1.5px solid #e5e7eb",
              background: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontSize: 12, fontWeight: 500, color: "#374151",
              fontFamily: "inherit", transition: "all 0.13s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#f9fafb"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "white"; }}
          >
            {icon} Sign up with {name}
          </button>
        ))}
      </div>
    </>
  );
}

function OtpStep({ phone, onVerify, onBack }: { phone: string; onVerify: () => void; onBack: () => void }) {
  const [otp,       setOtp]       = useState<string[]>(Array(OTP_LEN).fill(""));
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [timer,     setTimer]     = useState(RESEND_S);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const filled = otp.every(d => d !== "");

  function change(i: number, val: string) {
    const d = val.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[i] = d; setOtp(next); setError("");
    if (d && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  }

  function keyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!otp[i] && i > 0) {
        const next = [...otp]; next[i - 1] = ""; setOtp(next);
        refs.current[i - 1]?.focus();
      } else {
        const next = [...otp]; next[i] = ""; setOtp(next);
      }
    }
    if (e.key === "ArrowLeft"  && i > 0)           refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
    if (e.key === "Enter" && filled) verify();
  }

  function paste(e: React.ClipboardEvent) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!p) return;
    const next = Array(OTP_LEN).fill("");
    p.split("").forEach((d, idx) => { next[idx] = d; });
    setOtp(next);
    refs.current[Math.min(p.length, OTP_LEN - 1)]?.focus();
  }

  function verify() {
    if (!filled) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onVerify(); }, 1000);
  }

  function resend() {
    setResending(true);
    setOtp(Array(OTP_LEN).fill("")); setError("");
    setTimeout(() => { setResending(false); setTimer(RESEND_S); refs.current[0]?.focus(); }, 800);
  }

  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 6px", textAlign: "center" }}>
        OTP Verification
      </h2>
      <p style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", margin: "0 0 3px", textAlign: "center" }}>
        Enter confirmation code
      </p>
      <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: 0, lineHeight: 1.55 }}>
        A 6-digit code was sent to
      </p>
      <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "0 0 1px", lineHeight: 1.55 }}>
        Mobile Number
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "2px 0 2px", textAlign: "center" }}>
        {maskPhone(phone)}
      </p>
 
      <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 20px", textAlign: "center" }}>
        {timer > 0 ? `${mm}:${ss}` : "00:00"}
      </p>
 
      <div style={{ display: "flex", gap: 8, marginBottom: 6, width: "100%", justifyContent: "center" }} onPaste={paste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => change(i, e.target.value)}
            onKeyDown={e => keyDown(i, e)}
            style={{
              width: 38, height: 42, textAlign: "center",
              fontSize: 16, fontWeight: 600, color: "#111827",
              border: `1.5px solid ${digit ? TEAL : error ? "#ef4444" : "#e2e8f0"}`,
              borderRadius: 7, outline: "none",
              background: "white",
              transition: "all 0.13s", fontFamily: "inherit",
              boxShadow: digit ? `0 0 0 3px rgba(13,148,136,0.08)` : "none",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = TEAL;
              e.currentTarget.style.boxShadow = `0 0 0 3px rgba(13,148,136,0.1)`;
            }}
            onBlur={e => {
              if (!digit) {
                e.currentTarget.style.borderColor = error ? "#ef4444" : "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ fontSize: 10.5, color: "#ef4444", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 3 }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="#ef4444">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z"/>
          </svg>
          {error}
        </p>
      )} 
      {filled && !error && (
        <button
          onClick={verify}
          disabled={loading}
          style={{
            width: "100%", padding: "10px 0", marginTop: 14,
            borderRadius: 8, border: "none",
            background: loading ? "#9ca3af" : TEAL,
            color: "white", fontSize: 12.5, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            fontFamily: "inherit", transition: "all 0.15s",
            boxShadow: `0 3px 12px rgba(13,148,136,0.28)`,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = TEAL_DARK; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = TEAL; }}
        >
          {loading ? <><Spinner /> Verifying…</> : "Verify OTP"}
        </button>
      )}
 
      <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 18, textAlign: "center" }}>
        Don&apos;t get the OTP?{" "}
        {timer > 0 ? (
          <span style={{ color: TEAL, fontWeight: 600, cursor: "default" }}>Resend Code</span>
        ) : (
          <button
            onClick={resend}
            disabled={resending}
            style={{
              background: "none", border: "none", padding: 0,
              cursor: resending ? "default" : "pointer",
              color: resending ? "#9ca3af" : TEAL,
              fontWeight: 600, fontSize: 11.5,
              fontFamily: "inherit",
            }}
          >
            {resending ? "Sending…" : "Resend Code"}
          </button>
        )}
      </p>

      <button
        onClick={onBack}
        style={{
          marginTop: 6, background: "none", border: "none",
          cursor: "pointer", color: "#9ca3af",
          fontSize: 10.5, fontFamily: "inherit",
          padding: 0, textDecoration: "underline",
        }}
      >
        ← Change number
      </button>
    </div>
  );
}
 
function SuccessStep({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 2200);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 10px" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "radial-gradient(at 60% 25%, #1a4a3a 0%, #0e221f 55%, #081812 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
        boxShadow: "0 8px 24px rgba(14,34,31,0.28)",
        animation: "auth-pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>Verified!</h3>
      <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>Login successful. Redirecting…</p>
    </div>
  );
}
 
export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step,  setStep]  = useState<Step>("login");
  const [phone, setPhone] = useState("");

  const customerIdFromJwt = useCallback((accessToken: string): string | null => {
    try {
      const parts = accessToken.split(".");
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      const payload = JSON.parse(json) as { customer_id?: string | number; customerId?: string | number };
      const id = payload.customer_id ?? payload.customerId;
      return id != null ? String(id) : null;
    } catch {
      return null;
    }
  }, []);

  const reset = useCallback(() => { setStep("login"); setPhone(""); }, []);
  const close = useCallback(() => { onClose(); setTimeout(reset, 260); }, [onClose, reset]);

  const handlePasswordLogin = useCallback(async (username: string, pwd: string) => {
    const { authApi } = await import("@/lib/api/auth");
    const res = await authApi.login(username, pwd);
    localStorage.setItem("p4u_token", res.accessToken);
    localStorage.setItem("p4u_refresh_token", res.refreshToken);
    localStorage.setItem("p4u_token_expires_in", String(res.expiresIn));
    localStorage.setItem("p4u_loggedIn", "true");
    localStorage.setItem("p4u_phone", username);
    const customerId = res.customerId ? String(res.customerId) : customerIdFromJwt(res.accessToken);
    if (customerId) localStorage.setItem("p4u_customer_id", customerId);
    setPhone(username);
    setStep("success");
    onSuccess?.(username);
  }, [customerIdFromJwt, onSuccess]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes auth-spin { to { transform: rotate(360deg); } }
        @keyframes auth-pop  { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes auth-up   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auth-bg   { from { opacity: 0; } to { opacity: 1; } }
        .auth-overlay { animation: auth-bg 0.2s ease; }
        .auth-card    { animation: auth-up 0.28s ease; }

        /* Left panel: visible only on md+ */
        .auth-left { display: flex; }
        @media (max-width: 560px) {
          .auth-left  { display: none !important; }
          .auth-card  { max-width: 340px !important; }
          .auth-right { border-radius: 16px !important; }
        }
      `}</style>
 
      <div
        className="auth-overlay"
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.46)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
      > 
        <div
          className="auth-card"
          onClick={e => e.stopPropagation()}
          style={{
            display: "flex",
            width: "100%",
            maxWidth: 660,
            borderRadius: 16,
            boxShadow: "0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
            overflow: "hidden",      
            minHeight: 430,
          }}
        > 
          <div
            className="auth-left"
            style={{
              width: "50%",
              flexShrink: 0,
              background: "#f0f4f8",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
    
            }}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
              <Image
                src={authIllustration}
                alt="Shopping illustration"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
 
          <div
            className="auth-right"
            style={{
              flex: 1,
              background: "white",
              padding: "24px 26px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0, 
            }}
          > 
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "flex-end",
              marginBottom: 20,
            }}>
               
              <button
                onClick={close}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9ca3af", padding: 4, borderRadius: 7,
                  display: "flex", alignItems: "center", transition: "all 0.13s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                <X size={17} />
              </button>
            </div> 
            {step === "login"   && <LoginStep onSendOtp={ph => { setPhone(ph); setStep("otp"); }} onPasswordLogin={handlePasswordLogin} />}
            {step === "otp"     && <OtpStep phone={phone} onVerify={() => { setStep("success"); onSuccess?.(phone); }} onBack={() => setStep("login")} />}
            {step === "success" && <SuccessStep onClose={close} />}
          </div>
        </div>
      </div>
    </>
  );
}