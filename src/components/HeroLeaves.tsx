// Tres ramitas de hojas que salen de la esquina inferior izquierda del inicio.
// Son solo adorno: aria-hidden y sin interacción. Las hojas se calculan sobre
// cada curva para que queden prolijas al cambiar una rama.

type Point = { x: number; y: number };
type Branch = {
  name: string;
  curve: [Point, Point, Point, Point]; // curva de Bézier cúbica
  leaves: number; // hojas a lo largo de la rama (más una en la punta)
  size: number;
};

const VIEW = 320;
const LEAF_PATH = "M0 0 C18 -19 50 -21 70 0 C50 21 18 19 0 0 Z";

const branches: Branch[] = [
  // de atrás: casi vertical
  { name: "a", curve: [{ x: 0, y: 322 }, { x: 18, y: 262 }, { x: 34, y: 196 }, { x: 46, y: 116 }], leaves: 6, size: 0.62 },
  // del medio: en diagonal
  { name: "b", curve: [{ x: 0, y: 322 }, { x: 70, y: 268 }, { x: 150, y: 196 }, { x: 236, y: 120 }], leaves: 8, size: 0.82 },
  // de abajo: casi acostada
  { name: "c", curve: [{ x: 0, y: 322 }, { x: 80, y: 304 }, { x: 168, y: 284 }, { x: 262, y: 270 }], leaves: 6, size: 0.68 },
];

function pointAt([p0, p1, p2, p3]: Branch["curve"], t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function angleAt([p0, p1, p2, p3]: Branch["curve"], t: number): number {
  const u = 1 - t;
  const dx = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function BranchShape({ branch }: { branch: Branch }) {
  const [p0, p1, p2, p3] = branch.curve;
  const leaves = Array.from({ length: branch.leaves }, (_, i) => {
    const t = 0.2 + (0.72 * i) / (branch.leaves - 1);
    const side = i % 2 === 0 ? -1 : 1;
    return { t, angle: angleAt(branch.curve, t) + side * 52, size: branch.size * (1 - t * 0.35), tone: i % 3 === 1 ? "mid" : "light" };
  });
  leaves.push({ t: 1, angle: angleAt(branch.curve, 1), size: branch.size * 0.62, tone: "mid" });

  return (
    <g className={`hero-leaves__branch hero-leaves__branch--${branch.name}`}>
      <path d={`M${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`} className="hero-leaves__stem" />
      {leaves.map((l) => {
        const p = pointAt(branch.curve, l.t);
        return (
          <g key={l.t} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${l.angle.toFixed(1)}) scale(${l.size.toFixed(3)})`}>
            <path d={LEAF_PATH} className={`hero-leaves__leaf hero-leaves__leaf--${l.tone}`} />
            <path d="M4 0 L62 0" className="hero-leaves__vein" />
          </g>
        );
      })}
    </g>
  );
}

export function HeroLeaves() {
  return (
    <div className="hero-leaves" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} preserveAspectRatio="xMinYMax meet" focusable="false">
        {branches.map((b) => (
          <BranchShape key={b.name} branch={b} />
        ))}
      </svg>
    </div>
  );
}
