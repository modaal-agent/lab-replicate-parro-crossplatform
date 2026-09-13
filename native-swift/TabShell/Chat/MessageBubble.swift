import SwiftUI
import UIKit

/// A message's bubble (spec 001 §12.1): the parent's on the accent colour, everyone else's on grey.
struct MessageBubble: View {
  let message: ChatMessage
  let hasTail: Bool

  var body: some View {
    switch message.content {
    case .text(let text):
      textBubble(text)
    case .photo(let caption):
      VStack(alignment: message.isOutgoing ? .trailing : .leading, spacing: 3) {
        SunflowerDrawing()
          .frame(width: 220, height: 165)
          .clipShape(.rect(cornerRadius: 18, style: .continuous))
          .overlay {
            RoundedRectangle(cornerRadius: 18, style: .continuous)
              .strokeBorder(.separator, lineWidth: 0.5)
          }
          .accessibilityLabel("Photo")
        textBubble(caption)
      }
    }
  }

  private func textBubble(_ text: String) -> some View {
    Text(text)
      .foregroundStyle(message.isOutgoing ? Color.white : Color.primary)
      .padding(.horizontal, 12)
      .padding(.vertical, 8)
      .background(
        message.isOutgoing ? Color.accentColor : Color(uiColor: .systemGray5),
        in: BubbleShape(tail: hasTail ? (message.isOutgoing ? .trailing : .leading) : .none))
  }
}

/// A rounded bubble with an optional tail at the bottom corner on the sender's side.
struct BubbleShape: Shape {
  enum Tail {
    case none, leading, trailing
  }

  var tail: Tail

  func path(in rect: CGRect) -> Path {
    let bubble = Path(roundedRect: rect, cornerRadius: min(18, rect.height / 2), style: .continuous)
    guard tail != .none else { return bubble }

    // Drawn at the bottom trailing corner, then mirrored for a leading tail. The horn fills the
    // rounded corner square, curves out to a tip 4 pt outside the bubble, and curves back up and
    // down into the bottom edge, which leaves the notch Messages draws beside its tail.
    let x = rect.maxX
    let y = rect.maxY
    var horn = Path()
    horn.move(to: CGPoint(x: x, y: y - 24))
    horn.addLine(to: CGPoint(x: x, y: y - 11))
    horn.addCurve(
      to: CGPoint(x: x + 4, y: y),
      control1: CGPoint(x: x, y: y - 1),
      control2: CGPoint(x: x + 4, y: y))
    horn.addCurve(
      to: CGPoint(x: x - 7, y: y - 4),
      control1: CGPoint(x: x - 0.1, y: y + 0.4),
      control2: CGPoint(x: x - 4.2, y: y - 1.1))
    horn.addCurve(
      to: CGPoint(x: x - 16, y: y),
      control1: CGPoint(x: x - 12, y: y),
      control2: CGPoint(x: x - 16, y: y))
    horn.addLine(to: CGPoint(x: x - 24, y: y))
    horn.addLine(to: CGPoint(x: x - 24, y: y - 24))
    horn.closeSubpath()

    if tail == .leading {
      horn = horn.applying(CGAffineTransform(a: -1, b: 0, c: 0, d: 1, tx: 2 * rect.midX, ty: 0))
    }
    return bubble.union(horn)
  }
}

/// The photo in the child chat's fixture: a child's drawing of sunflowers, drawn in code so the
/// fixture needs no image asset.
struct SunflowerDrawing: View {
  var body: some View {
    Canvas { context, size in
      context.fill(
        Path(CGRect(origin: .zero, size: size)), with: .color(Color(red: 0.99, green: 0.97, blue: 0.90)))

      let sun = CGPoint(x: size.width * 0.82, y: size.height * 0.22)
      for index in 0..<10 {
        let angle = Double(index) / 10 * 2 * .pi
        var ray = Path()
        ray.move(to: CGPoint(x: sun.x + cos(angle) * 22, y: sun.y + sin(angle) * 22))
        ray.addLine(to: CGPoint(x: sun.x + cos(angle) * 31, y: sun.y + sin(angle) * 31))
        context.stroke(ray, with: .color(.orange), style: StrokeStyle(lineWidth: 3, lineCap: .round))
      }
      context.fill(Path(ellipseIn: CGRect(x: sun.x - 16, y: sun.y - 16, width: 32, height: 32)), with: .color(.yellow))

      let groundY = size.height * 0.84
      var grass = Path()
      grass.move(to: CGPoint(x: 0, y: groundY))
      grass.addQuadCurve(
        to: CGPoint(x: size.width, y: groundY - 6), control: CGPoint(x: size.width * 0.5, y: groundY + 10))
      grass.addLine(to: CGPoint(x: size.width, y: size.height))
      grass.addLine(to: CGPoint(x: 0, y: size.height))
      grass.closeSubpath()
      context.fill(grass, with: .color(Color(red: 0.55, green: 0.78, blue: 0.40)))

      for (x, y, radius) in [(0.2, 0.44, 22.0), (0.47, 0.3, 27.0), (0.7, 0.56, 19.0)] {
        Self.drawSunflower(
          in: context, center: CGPoint(x: size.width * x, y: size.height * y), radius: radius, groundY: groundY)
      }
    }
  }

  nonisolated private static func drawSunflower(
    in context: GraphicsContext, center: CGPoint, radius: CGFloat, groundY: CGFloat
  ) {
    var stem = Path()
    stem.move(to: CGPoint(x: center.x, y: groundY + 4))
    stem.addQuadCurve(to: center, control: CGPoint(x: center.x - radius * 0.5, y: (groundY + center.y) / 2))
    context.stroke(
      stem, with: .color(Color(red: 0.30, green: 0.58, blue: 0.24)),
      style: StrokeStyle(lineWidth: 4, lineCap: .round))

    var leaf = context
    leaf.translateBy(x: center.x - radius * 0.2, y: (groundY + center.y) / 2 + 6)
    leaf.rotate(by: .degrees(-30))
    leaf.fill(
      Path(ellipseIn: CGRect(x: 0, y: -5, width: radius * 1.1, height: 10)),
      with: .color(Color(red: 0.36, green: 0.66, blue: 0.28)))

    for index in 0..<12 {
      var petal = context
      petal.translateBy(x: center.x, y: center.y)
      petal.rotate(by: .degrees(Double(index) * 30))
      petal.fill(
        Path(ellipseIn: CGRect(x: radius * 0.3, y: -radius * 0.17, width: radius * 0.75, height: radius * 0.34)),
        with: .color(Color(red: 1.0, green: 0.76, blue: 0.10)))
    }
    context.fill(
      Path(ellipseIn: CGRect(x: center.x - radius * 0.42, y: center.y - radius * 0.42, width: radius * 0.84, height: radius * 0.84)),
      with: .color(Color(red: 0.45, green: 0.28, blue: 0.12)))
  }
}
