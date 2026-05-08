import { useRef } from "react";
import { layoutTemplates } from "../lib/layouts";
import type { DividerDef, Layer } from "../lib/types";

type Props = {
  layer: Layer;
  layerIdx: number;
  editable?: boolean;
  onSectionClick?: (layerIdx: number, sectionIdx: number) => void;
  onLayerChange?: (layerIdx: number, nextLayer: Layer) => void;
};

const CELL_COLORS = ["#e8f0ec", "#f5ede6", "#f0e8f5", "#e8eef5", "#f0ece3", "#e3eceb", "#ede3ec", "#e3e9f0"];

function applyDivider(layer: Layer, divDef: DividerDef, np: number): Layer {
  const next = structuredClone(layer) as Layer;
  if (divDef.type === "v") {
    const left = Array.isArray(divDef.between[0]) ? divDef.between[0] : [divDef.between[0]];
    const right = Array.isArray(divDef.between[1]) ? divDef.between[1] : [divDef.between[1]];
    left.forEach((i) => {
      const s = next.sections[i];
      s.w = np - s.x;
    });
    right.forEach((i) => {
      const s = next.sections[i];
      const r = s.x + s.w;
      s.x = np;
      s.w = r - np;
    });
  } else {
    const top = Array.isArray(divDef.between[0]) ? divDef.between[0] : [divDef.between[0]];
    const bottom = Array.isArray(divDef.between[1]) ? divDef.between[1] : [divDef.between[1]];
    top.forEach((i) => {
      const s = next.sections[i];
      s.h = np - s.y;
    });
    bottom.forEach((i) => {
      const s = next.sections[i];
      const b = s.y + s.h;
      s.y = np;
      s.h = b - np;
    });
  }
  return next;
}

export default function BentoSvg({ layer, layerIdx, editable, onSectionClick, onLayerChange }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const W = 600;
  const H = 280;
  const PAD = 6;
  const tmpl = layoutTemplates[layer.templateIdx];

  const startDrag = (e: React.PointerEvent<SVGRectElement>, divDef: DividerDef) => {
    if (!editable || !onLayerChange || !svgRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    const sp = { x: e.clientX, y: e.clientY };
    const startPos = (() => {
      if (divDef.type === "v") {
        const i = Array.isArray(divDef.between[0]) ? divDef.between[0][0] : divDef.between[0];
        return layer.sections[i].x + layer.sections[i].w;
      }
      const i = Array.isArray(divDef.between[0]) ? divDef.between[0][0] : divDef.between[0];
      return layer.sections[i].y + layer.sections[i].h;
    })();
    const move = (ev: PointerEvent) => {
      let np =
        divDef.type === "v"
          ? startPos + (ev.clientX - sp.x) / rect.width
          : startPos + (ev.clientY - sp.y) / rect.height;
      np = Math.max(0.15, Math.min(0.85, np));
      onLayerChange(layerIdx, applyDivider(layer, divDef, np));
    };
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block w-full">
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={14} fill="#f7f4ef" stroke="#d8d0c4" strokeWidth={1} />
      {layer.sections.map((s, si) => {
        const x = s.x * W + PAD;
        const y = s.y * H + PAD;
        const w = s.w * W - PAD * 2;
        const h = s.h * H - PAD * 2;
        const dish = layer.dishes[String(si)];
        const maxChars = Math.floor(w / (s.round ? 6 : 8));
        return (
          <g key={si}>
            {s.round ? (
              <circle
                cx={x + w / 2}
                cy={y + h / 2}
                r={Math.min(w, h) / 2}
                fill={dish ? CELL_COLORS[si % CELL_COLORS.length] : "#fafaf6"}
                stroke={dish ? "#b8d0c5" : "#e0d8c8"}
                strokeWidth={1}
                strokeDasharray={dish ? "0" : "4,3"}
                className={editable ? "cursor-pointer" : ""}
                onClick={() => editable && onSectionClick?.(layerIdx, si)}
              />
            ) : (
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={10}
                fill={dish ? CELL_COLORS[si % CELL_COLORS.length] : "#fafaf6"}
                stroke={dish ? "#b8d0c5" : "#e0d8c8"}
                strokeWidth={1}
                strokeDasharray={dish ? "0" : "4,3"}
                className={editable ? "cursor-pointer" : ""}
                onClick={() => editable && onSectionClick?.(layerIdx, si)}
              />
            )}
            <text
              x={s.round ? x + w / 2 : x + 8}
              y={s.round ? y + h / 2 - h / 5 : y + 16}
              textAnchor={s.round ? "middle" : undefined}
              fontSize={10}
              fill="#9a9890"
              letterSpacing={0.5}
              className="pointer-events-none"
            >
              {(dish?.section || s.label).toUpperCase()}
            </text>
            {dish ? (
              <text
                x={x + w / 2}
                y={y + h / 2 + (s.round ? 6 : 5)}
                textAnchor="middle"
                fontSize={s.round ? 11 : 14}
                fill="#2a2a28"
                fontWeight={500}
                className="pointer-events-none"
              >
                {dish.name.length > maxChars ? `${dish.name.slice(0, maxChars - 1)}…` : dish.name}
              </text>
            ) : (
              editable && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 8}
                  textAnchor="middle"
                  fontSize={22}
                  fill="#b8d0c5"
                  fontWeight={300}
                  className="pointer-events-none"
                >
                  +
                </text>
              )
            )}
          </g>
        );
      })}
      {editable &&
        tmpl.dividers.map((d, i) => {
          const getPos = () => {
            if (d.type === "v") {
              const idx = Array.isArray(d.between[0]) ? d.between[0][0] : d.between[0];
              return layer.sections[idx].x + layer.sections[idx].w;
            }
            const idx = Array.isArray(d.between[0]) ? d.between[0][0] : d.between[0];
            return layer.sections[idx].y + layer.sections[idx].h;
          };
          if (d.type === "v") {
            const x = getPos() * W;
            const yMin = (d.yMin ?? 0) * H;
            const yMax = (d.yMax ?? 1) * H;
            return (
              <rect
                key={`div-${i}`}
                x={x - 4}
                y={yMin + (yMax - yMin) / 2 - 16}
                width={8}
                height={32}
                rx={3}
                fill="#b8d0c5"
                stroke="#7a9e8e"
                strokeWidth={0.5}
                className="cursor-col-resize hover:fill-[#7a9e8e]"
                onPointerDown={(e) => startDrag(e, d)}
              />
            );
          }
          const y = getPos() * H;
          const xMin = (d.xMin ?? 0) * W;
          const xMax = (d.xMax ?? 1) * W;
          return (
            <rect
              key={`div-${i}`}
              x={xMin + (xMax - xMin) / 2 - 16}
              y={y - 4}
              width={32}
              height={8}
              rx={3}
              fill="#b8d0c5"
              stroke="#7a9e8e"
              strokeWidth={0.5}
              className="cursor-row-resize hover:fill-[#7a9e8e]"
              onPointerDown={(e) => startDrag(e, d)}
            />
          );
        })}
    </svg>
  );
}
