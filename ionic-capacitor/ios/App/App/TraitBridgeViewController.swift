import Capacitor
import UIKit
import WebKit

/// The bridge view controller, which also tells the web view the traits the layout follows (spec 001 §21.5, D18):
/// classes on the root element for the idiom (`idiom-phone`, `idiom-pad`), the horizontal size class (`size-regular`,
/// `size-compact`) and, from iOS 27.1, the edge of the vertical bars (`vbar-leading`, `vbar-trailing`). A user script
/// sets them before the page's scripts run; after a trait change, and after each page load, they are set again and a
/// `nativetraits` event is sent.
final class TraitBridgeViewController: CAPBridgeViewController {
    /// The classes the web view has, so that an unchanged trait collection sends nothing.
    private var sentClasses: [String] = []
    private var loadingObservation: NSKeyValueObservation?

    override func webViewConfiguration(for instanceConfiguration: InstanceConfiguration) -> WKWebViewConfiguration {
        let configuration = super.webViewConfiguration(for: instanceConfiguration)
        sentClasses = traitClasses()
        let script = WKUserScript(
            source: Self.script(classes: sentClasses, notify: false),
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        configuration.userContentController.addUserScript(script)
        return configuration
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // The user script holds the classes read in `loadView`; a page load replaces what `sendTraits` set before it.
        loadingObservation = webView?.observe(\.isLoading, options: [.new]) { [weak self] webView, _ in
            guard !webView.isLoading else {
                return
            }
            DispatchQueue.main.async {
                self?.sendTraits(force: true)
            }
        }
        if #available(iOS 17.0, *) {
            var traits: [UITrait] = [UITraitHorizontalSizeClass.self, UITraitUserInterfaceIdiom.self]
            if #available(iOS 27.1, *) {
                traits += UITraitCollection.systemTraitsAffectingVerticalBarEdge
            }
            registerForTraitChanges(traits) { (controller: Self, _: UITraitCollection) in
                controller.sendTraits()
            }
        }
    }

    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        if #unavailable(iOS 17.0) {
            sendTraits()
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // The trait collection the configuration read in `loadView` may predate the window's.
        sendTraits()
    }

    private func sendTraits(force: Bool = false) {
        let classes = traitClasses()
        guard force || classes != sentClasses else {
            return
        }
        sentClasses = classes
        webView?.evaluateJavaScript(Self.script(classes: classes, notify: true))
    }

    private func traitClasses() -> [String] {
        var classes: [String] = []
        switch traitCollection.userInterfaceIdiom {
        case .phone: classes.append("idiom-phone")
        case .pad: classes.append("idiom-pad")
        default: break
        }
        switch traitCollection.horizontalSizeClass {
        case .regular: classes.append("size-regular")
        case .compact: classes.append("size-compact")
        default: break
        }
        if #available(iOS 27.1, *) {
            switch traitCollection.verticalBarEdge {
            case .leading: classes.append("vbar-leading")
            case .trailing: classes.append("vbar-trailing")
            default: break
            }
        }
        return classes
    }

    /// Replaces the root element's trait classes with `classes`, and sends `nativetraits` when `notify` is set.
    private static func script(classes: [String], notify: Bool) -> String {
        let list = classes.map { "'\($0)'" }.joined(separator: ",")
        // At document start `document.documentElement` can be null; the classes then go on the root element as soon as
        // the parser inserts it, before the page's scripts run.
        return """
        (function () {
          function apply(root) {
            root.classList.remove('idiom-phone', 'idiom-pad', 'size-regular', 'size-compact', 'vbar-leading', 'vbar-trailing');
            root.classList.add(\(list));
            \(notify ? "window.dispatchEvent(new Event('nativetraits'));" : "")
          }
          if (document.documentElement) {
            apply(document.documentElement);
            return;
          }
          var observer = new MutationObserver(function () {
            if (document.documentElement) {
              observer.disconnect();
              apply(document.documentElement);
            }
          });
          observer.observe(document, { childList: true });
        })();
        """
    }
}
