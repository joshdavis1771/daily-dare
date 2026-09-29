# Mobile apps

Daily Dare now includes Capacitor shells in `ios/` and `android/`. The shells load the deployed HTTPS app at `https://daily-dear.vercel.app` and include native camera, preferences, and push-notification plugins.

## Local workflow

```bash
npm install
npm run build
mkdir -p out
npx cap sync ios
npx cap sync android
npm run cap:open:ios
npm run cap:open:android
```

Install the full Xcode application and select it with `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer` before building iOS. Install Android Studio and its SDK, platform tools, and an emulator before building Android.

## Store setup

- Set the iOS bundle identifier to `com.dailydare.app` in Xcode and configure an Apple Developer team, signing, push capability, and App Store Connect record.
- In Android Studio, confirm the package id `com.dailydare.app`, create a release keystore, configure Play App Signing, and create the Google Play Console record.
- Add store screenshots, privacy policy, support URL, age rating, and production version numbers before submission.

### Plus purchases

- Create a RevenueCat project for `com.dailydare.app`, add the App Store Connect and Google Play apps, and configure the `plus` entitlement.
- Create a current offering with RevenueCat Monthly, Annual, and Lifetime packages mapped to the corresponding store products.
- Set `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY` and `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY` in the build/deployment environment. These are public SDK keys, not service credentials; never put App Store Connect or Google service credentials in the client app.
- Test purchases, cancellations, restores, renewals, and expired entitlements using each store's sandbox/test account before submission.
- Configure RevenueCat with a `plus` entitlement and a current offering containing monthly, annual, and lifetime packages. Add the matching products in App Store Connect and Play Console, then set the public platform SDK keys in the deployment environment. Store prices should come from the offering rather than hard-coded localized amounts.

## Native push delivery

The app requests native notification permission and receives an APNs/FCM device token. The current web API stores browser VAPID subscriptions, so native delivery still needs a server-side `native_push_tokens` table and APNs/FCM provider integration. Do not treat a device token as a browser Web Push endpoint or expose provider credentials in the app.

## Account security

Accounts use Supabase OTP over HTTPS. Native shells keep the Supabase session inside the platform web view; production builds must use the deployed HTTPS URL, never a local HTTP URL. Keep service-role, APNs, and FCM credentials server-side.