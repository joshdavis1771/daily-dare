"use client";

import { Capacitor } from "@capacitor/core";
import type { CustomerInfo, PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { supabase } from "@/lib/supabase";

const plusEntitlementId = "plus";
type PurchasesClient = typeof import("@revenuecat/purchases-capacitor").Purchases;

let purchasesClient: Promise<PurchasesClient> | null = null;

function getApiKey() {
  switch (Capacitor.getPlatform()) {
    case "ios": return process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY;
    case "android": return process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY;
    default: return undefined;
  }
}

async function getPurchasesClient() {
  if (!Capacitor.isNativePlatform()) {
    throw new Error("Store purchases are available in the iOS and Android apps.");
  }
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("In-app purchases are not configured for this app yet.");
  if (!purchasesClient) {
    purchasesClient = import("@revenuecat/purchases-capacitor").then(async ({ Purchases }) => {
      await Purchases.configure({ apiKey, diagnosticsEnabled: false });
      return Purchases;
    });
  }
  try {
    return await purchasesClient;
  } catch (error) {
    purchasesClient = null;
    throw error;
  }
}

async function syncCustomerIdentity(purchases: PurchasesClient) {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  const { appUserID } = await purchases.getAppUserID();
  if (session?.user.id && session.user.id !== appUserID) {
    await purchases.logIn({ appUserID: session.user.id });
  } else if (!session) {
    const { isAnonymous } = await purchases.isAnonymous();
    if (!isAnonymous) await purchases.logOut();
  }
}

export async function loadPlusStore() {
  const purchases = await getPurchasesClient();
  await syncCustomerIdentity(purchases);
  const [offerings, result] = await Promise.all([
    purchases.getOfferings(),
    purchases.getCustomerInfo(),
  ]);
  return {
    packages: offerings.current?.availablePackages ?? [],
    customerInfo: result.customerInfo,
    isPlus: Boolean(result.customerInfo.entitlements.active[plusEntitlementId]),
    managementURL: result.customerInfo.managementURL,
  };
}

export async function purchasePlusPackage(aPackage: PurchasesPackage): Promise<CustomerInfo> {
  const purchases = await getPurchasesClient();
  await syncCustomerIdentity(purchases);
  const result = await purchases.purchasePackage({ aPackage });
  return result.customerInfo;
}

export async function restorePlusPurchases(): Promise<CustomerInfo> {
  const purchases = await getPurchasesClient();
  await syncCustomerIdentity(purchases);
  const result = await purchases.restorePurchases();
  return result.customerInfo;
}

export function hasPlusEntitlement(customerInfo: CustomerInfo) {
  return Boolean(customerInfo.entitlements.active[plusEntitlementId]);
}