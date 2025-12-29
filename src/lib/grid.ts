import { NUM_COLUMNS, NUM_ROWS } from "@/game/types";

export type GridCoordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  cellSize: number;
  width: number;
  height: number;
};

export const getGridCoordinates = (
  videoWidth: number,
  videoHeight: number,
): GridCoordinates => {
  const margin = Math.round(0.1 * videoWidth);
  const left = margin;
  const width = videoWidth - 2 * margin;
  const right = left + width;
  const cellSize = Math.round(width / NUM_COLUMNS);
  const height = cellSize * NUM_ROWS;
  const top = (videoHeight - height) / 2;
  const bottom = top + height;

  return { left, right, top, bottom, cellSize, width, height };
};
