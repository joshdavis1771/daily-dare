"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

import { PackPicker } from "@/components/pack-picker";
import { PACKS, type PackId } from "@/lib/plus";
import { PACK_PREFERENCES_KEY, validPackSelection } from "@/lib/pack-preferences";

type AuthMethod = "email" | "phone";
type EmailMode = "signup" | "signin";
const TERMS_VERSION = "2026-09-26";
const countryCodes = [["US", "+1"], ["CA", "+1"], ["GB", "+44"], ["AU", "+61"], ["NZ", "+64"], ["IE", "+353"], ["IN", "+91"], ["DE", "+49"], ["FR", "+33"], ["ES", "+34"], ["BR", "+55"], ["MX", "+52"], ["JP", "+81"], ["SG", "+65"], ["ZA", "+27"]] as const;

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailVerified = searchParams.get("verified") === "1";
  const verificationError = searchParams.get("verification_error") === "1";
  const [selectedPacks, setSelectedPacks] = useState<PackId[]>([]);
  const [packsConfirmed, setPacksConfirmed] = useState(false);
  const [method, setMethod] = useState<AuthMethod>("email");
  const [emailMode, setEmailMode] = useState<EmailMode>(emailVerified || verificationError ? "signin" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState<"identifier" | "code">("identifier");
  const [message, setMessage] = useState(verificationError ? "That verification link could not be confirmed. Request a new email and try again." : "");
  const [busy, setBusy] = useState(false);
  const [emailSignupPending, setEmailSignupPending] = useState(false);

  function resetForm() {
    setEmail(""); setPassword(""); setConfirmPassword(""); setPhoneNumber(""); setVerificationCode(""); setTermsAccepted(false); setStep("identifier"); setMessage(""); setEmailSignupPending(false);
  }
  function changeMethod(nextMethod: AuthMethod) { setMethod(nextMethod); if (nextMethod === "phone") setEmailMode("signup"); resetForm(); }
  function changeEmailMode(nextMode: EmailMode) { setEmailMode(nextMode); setPassword(""); setConfirmPassword(""); setTermsAccepted(false); setMessage(""); setEmailSignupPending(false); }
  function fullPhoneNumber() { return `${countryCode}${phoneNumber.replace(/\D/g, "")}`; }
  function termsRequired() { return method === "phone" || emailMode === "signup"; }
  function confirmationRedirectUrl() { return new URL("/auth/callback", window.location.origin).toString(); }

  async function submitIdentifier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (termsRequired() && (!packsConfirmed || !validPackSelection(selectedPacks))) { setMessage("Choose and confirm your three packs first."); return; }
    if (termsRequired() && !termsAccepted) { setMessage("Please read and accept the Terms of Service before creating an account."); return; }
    if (!isSupabaseConfigured || !supabase) { setMessage("Demo mode is ready. Add Supabase variables to enable accounts."); return; }
    setBusy(true); setMessage("");
    const termsData = { termsAcceptedAt: new Date().toISOString(), termsVersion: TERMS_VERSION, selected_packs: selectedPacks };
    if (method === "email") {
      if (password.length < 8) { setMessage("Your password must be at least 8 characters."); setBusy(false); return; }
      if (emailMode === "signup" && password !== confirmPassword) { setMessage("Passwords do not match."); setBusy(false); return; }
      const result = emailMode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: confirmationRedirectUrl(), data: termsData } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) setMessage(result.error.message);
      else if (emailMode === "signup" && !result.data.session) setEmailSignupPending(true);
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

  async function resendVerificationEmail() {
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: confirmationRedirectUrl() },
    });
    setMessage(error ? error.message : "A new verification email is on its way.");
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
  return (
    <main className="min-h-screen bg-[#171717] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-white/60"><ArrowLeft size={16} /> back to today</Link>
        <div className="mt-10">
          {emailVerified ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-7 text-center" aria-live="polite">
              <CheckCircle2 size={48} className="mx-auto text-[#ffb3a5]" />
              <h1 className="font-display mt-6 text-3xl font-black leading-none tracking-[-0.07em]">Email verified!</h1>
              <p className="mt-4 leading-relaxed text-white/60">You’re all set. Your Daily Dare account is ready.</p>
              <button type="button" onClick={() => router.push("/")} className="mt-7 w-full rounded-2xl bg-[#525252] px-5 py-4 font-bold text-white">Continue to Daily Dare</button>
            </section>
          ) : emailSignupPending ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-7" aria-live="polite">
              <Mail size={42} className="text-[#ffb3a5]" />
              <h1 className="font-display mt-6 text-3xl font-black leading-none tracking-[-0.07em]">Check your inbox.</h1>
              <p className="mt-4 leading-relaxed text-white/70">We sent a verification link to <strong className="break-all text-white">{email}</strong>. Open it to verify your email and finish creating your account.</p>
              <button type="button" onClick={resendVerificationEmail} disabled={busy} className="mt-7 w-full rounded-2xl bg-[#525252] px-5 py-4 font-bold text-white disabled:opacity-50">{busy ? "sending..." : "Resend verification email"}</button>
              <button type="button" onClick={() => changeEmailMode("signup")} className="mt-4 w-full text-sm font-bold text-white/60 underline">Use a different email</button>
              {message && <p role="status" className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-[#ffb3a5]">{message}</p>}
            </section>
          ) : emailMode === "signup" && !packsConfirmed ? (
            <><PackPicker selected={selectedPacks} onChange={setSelectedPacks} onConfirm={() => { setPacksConfirmed(true); if (!isSupabaseConfigured) localStorage.setItem(PACK_PREFERENCES_KEY, JSON.stringify(selectedPacks)); }} /><button type="button" onClick={() => changeEmailMode("signin")} className="mt-2 w-full text-sm text-white/60 underline">Already have an account? Sign in</button></>
          ) : (
            <>
              {packsConfirmed && termsRequired() && <p className="mb-4 text-xs font-bold uppercase tracking-widest text-teal-300">Step 2 of 2 · Your account</p>}
              {packsConfirmed && termsRequired() && <div className="mb-7 rounded-2xl border border-teal-300/25 bg-teal-300/10 p-4"><p className="text-xs font-bold uppercase tracking-widest text-teal-200">Your daily mix · 3 packs confirmed</p><p className="mt-2 text-sm">{PACKS.filter(pack => selectedPacks.includes(pack.id)).map(pack => `${pack.emoji} ${pack.title}`).join(" · ")}</p><button type="button" onClick={() => setPacksConfirmed(false)} className="mt-3 text-xs text-teal-200 underline">Change my packs</button>{!isSupabaseConfigured && <Link href="/" className="ml-5 text-xs text-teal-200 underline">Preview my daily dare</Link>}</div>}
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#525252] text-white">{method === "email" ? <Mail /> : <Phone />}</div>
              <h1 className="font-display mt-8 text-3xl font-black leading-none tracking-[-0.07em]">Come on in.</h1>
              <p className="mt-4 text-white/60">{method === "email" ? "Use your email and password to access Daily Dare." : "Use your phone number and a confirmation code."}</p>
              <div className="mt-8 grid grid-cols-2 rounded-2xl border border-white/15 p-1">
                <button type="button" onClick={() => changeMethod("email")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${method === "email" ? "bg-white text-[#171717]" : "text-white/60"}`}><Mail size={16} /> Email</button>
                <button type="button" onClick={() => changeMethod("phone")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${method === "phone" ? "bg-white text-[#171717]" : "text-white/60"}`}><Phone size={16} /> Phone</button>
              </div>
              {method === "email" && <div className="mt-4 grid grid-cols-2 rounded-2xl border border-white/15 p-1">
                <button type="button" onClick={() => changeEmailMode("signup")} className={`rounded-xl px-3 py-2.5 text-sm font-bold ${emailMode === "signup" ? "bg-white/15 text-white" : "text-white/50"}`}>Create account</button>
                <button type="button" onClick={() => changeEmailMode("signin")} className={`rounded-xl px-3 py-2.5 text-sm font-bold ${emailMode === "signin" ? "bg-white/15 text-white" : "text-white/50"}`}>Sign in</button>
              </div>}
              {method === "phone" && step === "code" ? (
                <form onSubmit={verifyPhoneCode} className="mt-6 grid gap-4">
                  <label className="text-sm font-bold">Confirmation code<input type="text" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))} placeholder="123456" className={`${inputClass} text-center text-2xl tracking-[0.3em]`} /></label>
                  <button disabled={busy} className="w-full rounded-2xl bg-[#525252] px-5 py-4 font-bold text-white disabled:opacity-50">{busy ? "checking..." : "confirm code"}</button>
                  <button type="button" onClick={() => { setStep("identifier"); setMessage(""); }} className="text-sm font-bold text-white/60 underline">Use a different phone</button>
                </form>
              ) : (
                <form onSubmit={submitIdentifier} className="mt-6 grid gap-4">
                  <label className="text-sm font-bold">{method === "email" ? "Email address" : "Phone number"}
                    {method === "email" ? <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className={inputClass} /> : <span className="mt-2 flex gap-2">
                      <select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} aria-label="Country calling code" className="w-28 rounded-2xl border border-white/15 bg-[#292929] px-3 py-4 text-white outline-none focus:border-[#525252]">{countryCodes.map(([country, code]) => <option key={`${country}-${code}`} value={code}>{country} {code}</option>)}</select>
                      <input type="tel" required value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="555 555 2671" autoComplete="tel-national" className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-[#525252]" />
                    </span>}
                  </label>
                  {method === "email" && <>
                    <label className="text-sm font-bold">Password<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={emailMode === "signup" ? "new-password" : "current-password"} className={inputClass} /></label>
                    {emailMode === "signup" && <label className="text-sm font-bold">Confirm password<input type="password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Type it again" autoComplete="new-password" className={inputClass} /></label>}
                  </>}
                  {termsRequired() && <label className="flex items-start gap-3 text-xs leading-relaxed text-white/70"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#ffb3a5]" required /><span>I agree to the <Link href="/terms" target="_blank" className="text-[#ffb3a5] underline">Terms of Service</Link> and understand the safety rules for using Daily Dare.</span></label>}
                  <button disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#525252] px-5 py-4 font-bold text-white disabled:opacity-50">{busy ? "working..." : method === "email" ? emailMode === "signup" ? "create my account" : "sign in" : <>Send confirmation code <KeyRound size={17} /></>}</button>
                </form>
              )}
              {message && <p role="status" className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-[#ffb3a5]">{message}</p>}
              <p className="mt-8 text-xs leading-relaxed text-white/40">By continuing, you agree to show up with kindness. Read the <Link href="/guidelines" className="text-[#ffb3a5] underline">community guidelines</Link>.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#171717] px-5 py-8 text-white" />}>
      <AuthContent />
    </Suspense>
  );
}
