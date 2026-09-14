/**
 * The photo in the child chat's fixture: a child's drawing of sunflowers, drawn in code so the
 * fixture needs no image asset. The same drawing as `SunflowerDrawing` in
 * `native-swift/TabShell/Chat/MessageBubble.swift`, at 220 × 165.
 */
const width = 220;
const height = 165;
const groundY = height * 0.84;
const sun = { x: width * 0.82, y: height * 0.22 };
const flowers = [
  { x: width * 0.2, y: height * 0.44, radius: 22 },
  { x: width * 0.47, y: height * 0.3, radius: 27 },
  { x: width * 0.7, y: height * 0.56, radius: 19 },
];

export default function SunflowerDrawing() {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Photo">
      <rect width={width} height={height} fill="#fdf7e6" />

      {Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * 2 * Math.PI;
        return (
          <line
            key={index}
            x1={sun.x + Math.cos(angle) * 22}
            y1={sun.y + Math.sin(angle) * 22}
            x2={sun.x + Math.cos(angle) * 31}
            y2={sun.y + Math.sin(angle) * 31}
            stroke="#ff8d28"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={sun.x} cy={sun.y} r={16} fill="#ffcc00" />

      <path
        d={`M0 ${groundY} Q${width * 0.5} ${groundY + 10} ${width} ${groundY - 6} L${width} ${height} L0 ${height} Z`}
        fill="#8cc766"
      />

      {flowers.map(({ x, y, radius }) => {
        const stemMiddle = (groundY + y) / 2;
        return (
          <g key={x}>
            <path
              d={`M${x} ${groundY + 4} Q${x - radius * 0.5} ${stemMiddle} ${x} ${y}`}
              fill="none"
              stroke="#4d943d"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <ellipse
              cx={radius * 0.55}
              cy={0}
              rx={radius * 0.55}
              ry={5}
              fill="#5ca847"
              transform={`translate(${x - radius * 0.2} ${stemMiddle + 6}) rotate(-30)`}
            />
            {Array.from({ length: 12 }, (_, index) => (
              <ellipse
                key={index}
                cx={radius * 0.675}
                cy={0}
                rx={radius * 0.375}
                ry={radius * 0.17}
                fill="#ffc21a"
                transform={`translate(${x} ${y}) rotate(${index * 30})`}
              />
            ))}
            <circle cx={x} cy={y} r={radius * 0.42} fill="#73471f" />
          </g>
        );
      })}
    </svg>
  );
}
