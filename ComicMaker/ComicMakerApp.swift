import SwiftUI
import UIKit

@main
struct ComicMakerApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    var body: some Scene {
        WindowGroup {
            RootView().onAppear { AdManager.initialize() }
        }
    }
}

/// Orientation lock driven by the editor's «Экран: книжный / альбомный / авто» setting (same as Android).
final class AppDelegate: NSObject, UIApplicationDelegate {
    static var mask: UIInterfaceOrientationMask = Orientation.mask(for: UserDefaults.standard.string(forKey: "orient") ?? "portrait")
    func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        AppDelegate.mask
    }
}

enum Orientation {
    static func mask(for mode: String) -> UIInterfaceOrientationMask {
        switch mode {
        case "landscape": return .landscape
        case "auto": return .allButUpsideDown
        default: return .portrait
        }
    }
    static func apply(_ mode: String) {
        UserDefaults.standard.set(mode, forKey: "orient")
        AppDelegate.mask = mask(for: mode)
        guard let scene = UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }).first else { return }
        scene.windows.first?.rootViewController?.setNeedsUpdateOfSupportedInterfaceOrientations()
        scene.requestGeometryUpdate(.iOS(interfaceOrientations: AppDelegate.mask)) { _ in }
    }
}

struct RootView: View {
    @ObservedObject private var ads = AdState.shared
    var body: some View {
        VStack(spacing: 0) {
            EditorWebView()
            if ads.bannerVisible { AdBanner() }
        }
        .background(Color(red: 1.0, green: 0.957, blue: 0.788).ignoresSafeArea())
        .overlay(alignment: .bottomLeading) {
            if ads.privacyRequired {
                Button { AdManager.showPrivacy() } label: {
                    Text("🔒").font(.system(size: 18))
                        .frame(width: 40, height: 40)
                        .background(Circle().fill(Color.black.opacity(0.8)))
                }
                .opacity(0.55)
                .padding(.leading, 10)
                .padding(.bottom, ads.bannerVisible ? 70 : 10)
            }
        }
    }
}
