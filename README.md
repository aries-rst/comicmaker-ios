# Comics Maker — iOS

SwiftUI shell (WKWebView) around the shared offline editor `ComicsApp\WebEditor\dist`, bundled here as `Web/`.
Same editor as the Android app (com.comicmaker.app). Bundle ID `com.aries-rst.comicmaker.app`, iPhone only.

* Editor update: copy `WebEditor\dist\*` → `Web/` and push — CI builds and uploads to TestFlight.
* Bridge (`window.webkit.messageHandlers.native`): showInterstitial, saveFile (Photos / Files), shareFile, openSite, setOrientation.
* Ads: AdMob banner + interstitial (`AdManager.ADS_ENABLED`, off until App Store approval).
* Repo secrets: BUILD_CERTIFICATE_BASE64, P12_PASSWORD, APP_STORE_CONNECT_PRIVATE_KEY (the provisioning profile is created/fetched via the API automatically; optional fallback secret BUILD_PROVISION_PROFILE_BASE64).
