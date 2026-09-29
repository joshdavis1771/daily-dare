"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Crown, LoaderCircle, RotateCcw, ShieldCheck } from "lucide-react";
import type { PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { updatePlus, usePlus } from "@/lib/plus-store";
import type { PlusPlan } from "@/lib/plus";
import { hasPlusEntitlement, loadPlusStore, purchasePlusPackage, restorePlusPurchases } from "@/lib/revenuecat";

function planName(item: PurchasesPackage): PlusPlan | null {
  switch (String(item.packageType)) {
    case "MONTHLY": return "Monthly";
    case "ANNUAL": return "Yearly";
    case "LIFETIME": return "Founding";
    default: return null;
  }
}

function billingDescription(item: PurchasesPackage) {
  switch (String(item.packageType)) {
    case "MONTHLY": return "Billed monthly · renews until cancelled";
    case "ANNUAL": return "Billed annually · renews until cancelled";
    case "LIFETIME": return "One-time purchase · no renewal";
    default: return item.product.description;
  }
}

export function NativePlusHub() {
  const plus = usePlus();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [active, setActive] = useState(false);
  const [managementURL, setManagementURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    void loadPlusStore().then(store => {
      if (!mounted) return;
      const available = store.packages.filter(item => planName(item));
      const activeProduct = store.customerInfo.entitlements.active.plus?.productIdentifier;
      const activePackage = available.find(item => item.product.identifier === activeProduct);
      const preferred = activePackage ?? available.find(item => planName(item) === "Yearly") ?? available[0];
      setPackages(available);
      setSelectedPackageId(preferred?.identifier ?? "");
      setActive(store.isPlus);
      setManagementURL(store.managementURL);
      updatePlus(current => {
        const plan = activePackage ? planName(activePackage) : current.plan;
        return current.enabled === store.isPlus && current.plan === plan
          ? current
          : { ...current, enabled: store.isPlus, plan: plan ?? current.plan };
      });
    }).catch(cause => {
      if (mounted) setError(cause instanceof Error ? cause.message : "Store purchases could not be loaded.");
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const selectedPackage = packages.find(item => item.identifier === selectedPackageId);

  async function buyPlus() {
    if (!selectedPackage) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const customerInfo = await purchasePlusPackage(selectedPackage);
      if (!hasPlusEntitlement(customerInfo)) {
        setError("The store did not confirm Plus access. Please try restoring purchases or contact support.");
        return;
      }
      const plan = planName(selectedPackage);
      updatePlus(current => ({ ...current, enabled: true, plan: plan ?? current.plan }));
      setActive(true);
      setManagementURL(customerInfo.managementURL);
      setMessage("Plus is active on this store account.");
    } catch (cause) {
      if (typeof cause === "object" && cause !== null && "userCancelled" in cause && cause.userCancelled) {
        setMessage("Purchase cancelled.");
      } else {
        setError("The purchase could not be completed. Check your store account and try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const customerInfo = await restorePlusPurchases();
      const restored = hasPlusEntitlement(customerInfo);
      setActive(restored);
      setManagementURL(customerInfo.managementURL);
      updatePlus(current => ({ ...current, enabled: restored }));
      setMessage(restored ? "Your Plus purchase has been restored." : "No active Plus purchase was found for this store account.");
    } catch {
      setError("Purchases could not be restored. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="mx-auto max-w-xl px-5 pb-32 pt-7">
    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-700 dark:text-amber-300"><Crown size={16} /> DAILY DARE PLUS</div>
    <h1 className="mt-5 text-3xl font-bold leading-tight">More moments.<br />More you.</h1>
    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">A personal archive, private dares and groups, weekly skips, and tailored suggestions. Your daily feed stays free.</p>
    <section aria-label="Plus plans" className="mt-7 grid gap-3">
      {packages.map(item => {
        const plan = planName(item);
        const selected = item.identifier === selectedPackageId;
        return <button key={item.identifier} type="button" aria-pressed={selected} onClick={() => setSelectedPackageId(item.identifier)} className={`rounded-xl border p-4 text-left transition-colors ${selected ? "border-teal-700 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40" : "border-neutral-200 dark:border-neutral-700"}`}>
          <span className="flex items-center justify-between gap-3"><strong>{plan}</strong><strong>{item.product.priceString}</strong></span>
          <span className="mt-2 block text-xs text-neutral-500 dark:text-neutral-400">{billingDescription(item)}</span>
        </button>;
      })}
      {loading && <p role="status" className="flex items-center gap-2 text-sm text-neutral-500"><LoaderCircle size={16} className="animate-spin" /> Loading store plans…</p>}
      {!loading && !packages.length && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">Plus purchases are not configured for this app yet. You can still use the free daily dare.</p>}
    </section>
    <button type="button" disabled={busy || loading || !selectedPackage || active} onClick={() => void buyPlus()} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
      {busy ? <LoaderCircle size={17} className="animate-spin" /> : <Check size={17} />}
      {active ? "Plus active" : busy ? "Contacting store…" : selectedPackage ? `Continue with ${selectedPackage.product.priceString}` : "Plans unavailable"}
    </button>
    <div className="mt-3 flex items-center justify-center gap-3 text-xs">
      <button type="button" disabled={busy} onClick={() => void restore()} className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-teal-700 underline disabled:opacity-50 dark:text-teal-300"><RotateCcw size={14} /> Restore purchases</button>
      {active && managementURL && <button type="button" onClick={() => window.open(managementURL, "_blank", "noopener,noreferrer")} className="min-h-10 font-semibold text-teal-700 underline dark:text-teal-300">Manage subscription</button>}
    </div>
    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400"><ShieldCheck size={15} className="mt-0.5 shrink-0" />Subscriptions renew through your Apple or Google account until cancelled. Lifetime access is a one-time purchase. Manage renewals in your store account.</p>
    {message && <p role="status" className="mt-4 text-sm text-teal-700 dark:text-teal-300">{message}</p>}
    {error && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
    <div className="mt-6 flex gap-4 text-xs"><Link href="/terms" className="text-neutral-500 underline dark:text-neutral-400">Terms</Link><span className="text-neutral-500 dark:text-neutral-400">App Store billing terms apply</span></div>
    {active && <p className="mt-5 text-xs text-neutral-500 dark:text-neutral-400">{plus.enabled ? "Your Plus features are unlocked on this device." : "Refreshing your Plus access…"}</p>}
  </main>;
}