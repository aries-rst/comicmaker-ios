import SwiftUI
import UIKit
import AppTrackingTransparency
import GoogleMobileAds
import UserMessagingPlatform

/// Same scheme as Android: banner under the editor + interstitial on save/share (not more often than every 90 s).
/// Ads stay OFF until App Store approval (portfolio rule). To enable: ADS_ENABLED = true, add NSUserTrackingUsageDescription
/// back to project.yml (ATT prompt), update the App Privacy answers in App Store Connect, rebuild.
enum AdManager {
    static let ADS_ENABLED = false
    static let BANNER_ID = "ca-app-pub-9638598348702189/6532851735"
    static let INTERSTITIAL_ID = "ca-app-pub-9638598348702189/9957091426"
    static let MIN_INTERVAL: TimeInterval = 90
    private static var started = false
    private static var inter: InterstitialAd?
    private static var lastShown = Date.distantPast
    private static let delegate = FSDelegate()

    static func topVC() -> UIViewController? {
        guard var vc = UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }).first?.windows.first?.rootViewController else { return nil }
        while let p = vc.presentedViewController { vc = p }
        return vc
    }

    /// Consent (UMP) → ATT → SDK
    static func initialize() {
        if !ADS_ENABLED { return }
        Task { @MainActor in
            do {
                try await ConsentInformation.shared.requestConsentInfoUpdate(with: RequestParameters())
                if let vc = topVC() { try await ConsentForm.loadAndPresentIfRequired(from: vc) }
            } catch {}
            if ATTrackingManager.trackingAuthorizationStatus == .notDetermined { _ = await ATTrackingManager.requestTrackingAuthorization() }
            AdState.shared.privacyRequired = ConsentInformation.shared.privacyOptionsRequirementStatus == .required
            if ConsentInformation.shared.canRequestAds { start() }
        }
    }
    private static func start() {
        if started { return }
        started = true
        MobileAds.shared.start(completionHandler: nil)
        loadInter()
        AdState.shared.bannerVisible = true
    }
    private static func loadInter() {
        InterstitialAd.load(with: INTERSTITIAL_ID, request: Request()) { ad, _ in inter = ad }
    }
    static func maybeInterstitial() {
        guard ADS_ENABLED && started else { return }
        DispatchQueue.main.async {
            guard let ad = inter, let vc = topVC() else { loadInter(); return }
            if Date().timeIntervalSince(lastShown) < MIN_INTERVAL { return }
            delegate.onDismiss = { inter = nil; loadInter() }
            ad.fullScreenContentDelegate = delegate
            lastShown = Date()
            ad.present(from: vc)
        }
    }
    static func showPrivacy() {
        guard let vc = topVC() else { return }
        Task { @MainActor in try? await ConsentForm.presentPrivacyOptionsForm(from: vc) }
    }
}

final class AdState: ObservableObject {
    static let shared = AdState()
    @Published var bannerVisible = false
    @Published var privacyRequired = false
}

final class FSDelegate: NSObject, FullScreenContentDelegate {
    var onDismiss: () -> Void = {}
    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) { onDismiss() }
    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) { onDismiss() }
}

struct AdBannerView: UIViewRepresentable {
    func makeUIView(context: Context) -> BannerView {
        let v = BannerView(adSize: currentOrientationAnchoredAdaptiveBanner(width: UIScreen.main.bounds.width))
        v.adUnitID = AdManager.BANNER_ID
        v.rootViewController = AdManager.topVC()
        v.load(Request())
        return v
    }
    func updateUIView(_ v: BannerView, context: Context) {}
}
struct AdBanner: View {
    var body: some View { AdBannerView().frame(height: 60) }
}
