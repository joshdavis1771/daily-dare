"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthMethod = "email" | "phone";
type EmailMode = "signup" | "signin";
const TERMS_VERSION = "2026-09-26";
const countryCodes = [["US", "+1"], ["CA", "+1"], ["GB", "+44"], ["AU", "+61"], ["NZ", "+64"], ["IE", "+353"], ["IN", "+91"], ["DE", "+49"], ["FR", "+33"], ["ES", "+34"], ["BR", "+55"], ["MX", "+52"], ["JP", "+81"], ["SG", "+65"], ["ZA", "+27"]] as const;

export default function AuthPage() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>("email");
  const [emailMode, setEmailMode] = useState<EmailMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState<"identifier" | "code">("identifier");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function resetForm() {
    setEmail(""); setPassword(""); setConfirmPassword(""); setPhoneNumber(""); setVerificationCode(""); setTermsAccepted(false); setStep("identifier"); setMessage("");
  }
  function changeMethod(nextMethod: AuthMethod) { setMethod(nextMethod); resetForm(); }
  function changeEmailMode(nextMode: EmailMode) { setEmailMode(nextMode); setPassword(""); setConfirmPassword(""); setTermsAccepted(false); setMessage(""); }
  function fullPhoneNumber() { return `${countryCode}${phoneNumber.replace(/\D/g, "")}`; }
  function termsRequired() { return method === "phone" || emailMode === "signup"; }

  async function submitIdentifier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (termsRequired() && !termsAccepted) { setMessage("Please read and accept the Terms of Service before creating an account."); return; }
    if (!isSupabaseConfigured || !supabase) { setMessage("Demo mode is ready. Add Supabase variables to enable accounts."); return; }
    setBusy(true); setMessage("");
    const termsData = { termsAcceptedAt: new Date().toISOString(), termsVersion: TERMS_VERSION };
    if (method === "email") {
      if (password.length < 8) { setMessage("Your password must be at least 8 characters."); setBusy(false); return; }
      if (emailMode === "signup" && password !== confirmPassword) { setMessage("Passwords do not match."); setBusy(false); return; }
      const result = emailMode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: termsData } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) setMessage(result.error.message);
      else if (emailMode === "signup" && !result.data.session) setMessage("Account created. Check your email to confirm your account.");
      else router.push("/");
      setBusy(false);
      return;
    }
    const target = fullPhoneNumber();
    if (!/^\+?[1-9]\d{7,14}$/.test(target)) { setMessage("Enter a valid phone number after selecting your country code."); setBusy(false); return; }
    const result = await supabase.auth.signInWithOtp({ phone: target, options: { shouldCreateUser: true, data: termsData } });
    setMessage(result.error ? result.error.message : "We sent a confirmation code to your phone.");
    if (!result.error) setStep("code");
    setBusy(false);
  }

  async function verifyPhoneCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setMessage("");
    const result = await supabase.auth.verifyOtp({ phone: fullPhoneNumber(), token: verificationCode, type: "sms" });
    if (result.error) setMessage(result.error.message); else router.push("/");
    setBusy(false);
  }

  const inputClass = "mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-[#525252]";
  return <main className="min-h-screen bg-[#171717] px-5 py-8 text-white"><div className="mx-auto max-w-md"><Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-white/60"><ArrowLeft size={16} /> back to today</Link><div className="mt-24"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#525252] text-white">{method === "email" ? <Mail /> : <Phone />}</div><h1 className="font-display mt-8 text-3xl font-black leading-none tracking-[-0.07em]">Come on in.</h1><p className="mt-4 text-white/60">{method === "email" ? "Use your email and password to access Daily Dare." : "Use your phone number and a confirmation code."}</p><div className="mt-8 grid grid-cols-2 rounded-2xl border border-white/15 p-1"><button type="button" onClick={() => changeMethod("email")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${method === "email" ? "bg-white text-[#171717]" : "text-white/60"}`}><Mail size={16} /> Email</button><button type="button" onClick={() => changeMethod("phone")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${method === "phone" ? "bg-white text-[#171717]" : "text-white/60"}`}><Phone size={16} /> Phone</button></div>{method === "email" && <div className="mt-4 grid grid-cols-2 rounded-2xl border border-white/15 p-1"><button type="button" onClick={() => changeEmailMode("signup")} className={`rounded-xl px-3 py-2.5 text-sm font-bold ${emailMode === "signup" ? "bg-white/15 text-white" : "text-white/50"}`}>Create account</button><button type="button" onClick={() => changeEmailMode("signin")} className={`rounded-xl px-3 py-2.5 text-sm font-bold ${emailMode === "signin" ? "bg-white/15 text-white" : "text-white/50"}`}>Sign in</button></div>}{method === "phone" && step === "code" ? <form onSubmit={verifyPhoneCode} className="mt-6 grid gap-4"><label className="text-sm font-bold">Confirmation code<input type="text" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))} placeholder="123456" className={`${inputClass} text-center text-2xl tracking-[0.3em]`} /></label><button disabled={busy} className="w-full rounded-2xl bg-[#525252] px-5 py-4 font-bold text-white disabled:opacity-50">{busy ? "checking..." : "confirm code"}</button><button type="button" onClick={() => { setStep("identifier"); setMessage(""); }} className="text-sm font-bold text-white/60 underline">Use a different phone</button></form> : <form onSubmit={submitIdentifier} className="mt-6 grid gap-4"><label className="text-sm font-bold">{method === "email" ? "Email address" : "Phone number"}{method === "email" ? <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className={inputClass} /> : <span className="mt-2 flex gap-2"><select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} aria-label="Country calling code" className="w-28 rounded-2xl border border-white/15 bg-[#292929] px-3 py-4 text-white outline-none focus:border-[#525252]">{countryCodes.map(([country, code]) => <option key={`${country}-${code}`} value={code}>{country} {code}</option>)}</select><input type="tel" required value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="555 555 2671" autoComplete="tel-national" className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-[#525252]" /></span>}</label>{method === "email" && <><label className="text-sm font-bold">Password<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={emailMode === "signup" ? "new-password" : "current-password"} className={inputClass} /></label>{emailMode === "signup" && <label className="text-sm font-bold">Confirm password<input type="password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Type it again" autoComplete="new-password" className={inputClass} /></label>}</>}{termsRequired() && <label className="flex items-start gap-3 text-xs leading-relaxed text-white/70"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#ffb3a5]" required /><span>I agree to the <Link href="/terms" target="_blank" className="text-[#ffb3a5] underline">Terms of Service</Link> and understand the safety rules for using Daily Dare.</span></label>}<button disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#525252] px-5 py-4 font-bold text-white disabled:opacity-50">{busy ? "working..." : method === "email" ? emailMode === "signup" ? "create my account" : "sign in" : <>Send confirmation code <KeyRound size={17} /></>}</button></form>}{message && <p role="status" className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-[#ffb3a5]">{message}</p>}<p className="mt-8 text-xs leading-relaxed text-white/40">By continuing, you agree to show up with kindness. Read the <Link href="/guidelines" className="text-[#ffb3a5] underline">community guidelines</Link>.</p></div></div></main>;
}
