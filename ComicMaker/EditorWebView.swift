import SwiftUI
import WebKit
import Photos
import UIKit

/// Hosts the shared offline HTML editor (WebEditor/dist, bundled as the "Web" folder).
/// The editor talks to the app through window.webkit.messageHandlers.native.postMessage({cmd, data}).
struct EditorWebView: UIViewRepresentable {
    func makeCoordinator() -> Bridge { Bridge() }

    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.websiteDataStore = .default()                 // localStorage keeps the user's comics
        cfg.userContentController.add(WeakHandler(context.coordinator), name: "native")
        cfg.preferences.javaScriptCanOpenWindowsAutomatically = false
        let wv = WKWebView(frame: .zero, configuration: cfg)
        wv.isOpaque = false
        wv.backgroundColor = UIColor(red: 1.0, green: 0.992, blue: 0.965, alpha: 1)
        wv.scrollView.bounces = false
        wv.scrollView.contentInsetAdjustmentBehavior = .never
        wv.allowsLinkPreview = false
        if #available(iOS 16.4, *) { wv.isInspectable = false }
        context.coordinator.webView = wv
        if let index = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") {
            wv.loadFileURL(index, allowingReadAccessTo: index.deletingLastPathComponent())
        }
        return wv
    }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

/// Avoids a retain cycle between WKUserContentController and the coordinator.
final class WeakHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ t: WKScriptMessageHandler) { target = t }
    func userContentController(_ c: WKUserContentController, didReceive m: WKScriptMessage) { target?.userContentController(c, didReceive: m) }
}

final class Bridge: NSObject, WKScriptMessageHandler {
    weak var webView: WKWebView?
    static let site = URL(string: "https://aresti-labs.web.app")!

    func userContentController(_ c: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any], let cmd = body["cmd"] as? String else { return }
        let data = body["data"] as? String ?? ""
        switch cmd {
        case "showInterstitial": AdManager.maybeInterstitial()
        case "saveFile": handleFile(data, share: false)
        case "shareFile": handleFile(data, share: true)
        case "openSite": UIApplication.shared.open(Bridge.site)
        case "setOrientation": Orientation.apply(data)
        default: break   // openStore / exitApp are Android-only
        }
    }

    private struct FilePayload: Decodable { let b64: String; let mime: String; let name: String; let text: String? }

    private func handleFile(_ json: String, share: Bool) {
        guard let d = json.data(using: .utf8), let p = try? JSONDecoder().decode(FilePayload.self, from: d),
              let bytes = Data(base64Encoded: p.b64) else { return }
        if !share && p.mime.hasPrefix("image/") {
            saveToPhotos(bytes) { ok in if !ok { self.presentShare(bytes, name: p.name, text: nil) } }
        } else {
            presentShare(bytes, name: p.name, text: share ? p.text : nil)   // PDF → «Сохранить в Файлы»
        }
    }

    private func saveToPhotos(_ bytes: Data, done: @escaping (Bool) -> Void) {
        PHPhotoLibrary.requestAuthorization(for: .addOnly) { status in
            guard status == .authorized || status == .limited else { DispatchQueue.main.async { done(false) }; return }
            PHPhotoLibrary.shared().performChanges({
                PHAssetCreationRequest.forAsset().addResource(with: .photo, data: bytes, options: nil)
            }) { ok, _ in DispatchQueue.main.async { done(ok) } }
        }
    }

    private func presentShare(_ bytes: Data, name: String, text: String?) {
        let safe = name.replacingOccurrences(of: "/", with: "_")
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(safe.isEmpty ? "comic" : safe)
        try? bytes.write(to: url)
        var items: [Any] = [url]
        if let t = text, !t.isEmpty { items.append(t) }
        DispatchQueue.main.async {
            guard let vc = AdManager.topVC() else { return }
            let av = UIActivityViewController(activityItems: items, applicationActivities: nil)
            if let pop = av.popoverPresentationController { pop.sourceView = vc.view; pop.sourceRect = CGRect(x: vc.view.bounds.midX, y: vc.view.bounds.maxY - 80, width: 1, height: 1) }
            vc.present(av, animated: true)
        }
    }
}
