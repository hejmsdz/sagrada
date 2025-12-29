import { NUM_COLUMNS, NUM_ROWS } from "@/game/types";
import type { GridCoordinates } from "@/lib/grid";

export function GridOverlay({
  className,
  videoWidth: width,
  videoHeight: height,
  gridCoordinates,
}: {
  className?: string;
  videoWidth: number;
  videoHeight: number;
  gridCoordinates: GridCoordinates;
}) {
  const lineProps = {
    stroke: "rgba(255, 255, 255, 0.7)",
    strokeWidth: 2,
  };

  const rectProps = {
    fill: "rgba(0, 0, 0, 0.7)",
  };

  const { left, right, top, bottom, cellSize } = gridCoordinates;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <g>
        <rect x={0} y={0} width={width} height={top} {...rectProps} />
        <rect
          x={0}
          y={bottom}
          width={width}
          height={height - bottom}
          {...rectProps}
        />
        <rect x={0} y={top} width={left} height={bottom - top} {...rectProps} />
        <rect
          x={right}
          y={top}
          width={width - right}
          height={bottom - top}
          {...rectProps}
        />
      </g>
      <g>
        {Array.from({ length: NUM_ROWS + 1 }, (_, row) => (
          <line
            key={`row-${row}`}
            x1={left}
            y1={top + row * cellSize}
            x2={right}
            y2={top + row * cellSize}
            {...lineProps}
          />
        ))}
        {Array.from({ length: NUM_COLUMNS + 1 }, (_, column) => (
          <line
            key={`column-${column}`}
            x1={left + column * cellSize}
            y1={top}
            x2={left + column * cellSize}
            y2={bottom}
            {...lineProps}
          />
        ))}
      </g>
    </svg>
  );
}
