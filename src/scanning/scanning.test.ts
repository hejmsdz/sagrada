import { describe, it, expect, beforeAll, vi } from "vitest";
import { loadModel, scan } from "./scanning";
import sharp from "sharp";
import { R, G, B, Y, P, checkBoard } from "@/game/test-utils";
import { fileURLToPath } from "url";

describe("scanning", () => {
  beforeAll(async () => {
    vi.mock(import("@tensorflow/tfjs"));
    await loadModel();
  });

  async function loadImageData(path: string) {
    const image = await sharp(fileURLToPath(import.meta.resolve(path)));

    const {
      data: rgbData,
      info: { width, height },
    } = await image.removeAlpha().raw().toBuffer({ resolveWithObject: true });

    const data = new Uint32Array(width * height);

    for (let i = 0; i < width * height; i++) {
      const r = rgbData[i * 3];
      const g = rgbData[i * 3 + 1];
      const b = rgbData[i * 3 + 2];
      data[i] = (255 << 24) | (b << 16) | (g << 8) | r;
    }

    return { data, width, height };
  }

  it.each([
    [
      "./fixtures/board1.jpg",
      [
        [B(4), Y(3), G(6), R(3), B(6)],
        [G(2), P(5), B(1), G(4), R(1)],
        [B(3), G(6), Y(2), P(6), Y(2)],
        [Y(1), B(4), R(1), G(5), P(3)],
      ],
    ],
    [
      "./fixtures/board2.jpg",
      [
        [Y(5), null, R(4), Y(5), B(1)],
        [P(2), B(4), Y(6), G(2), R(3)],
        [R(6), G(3), R(4), B(5), P(2)],
        [G(1), Y(4), P(2), R(3), Y(5)],
      ],
    ],
  ])("should scan an image %s", async (path, expectedBoard) => {
    const imageData = await loadImageData(path);
    const scanResult = await scan(
      // @ts-expect-error - browser/node differences
      imageData,
    );
    expect(scanResult).toBeDefined();
    checkBoard(scanResult.board, expectedBoard);
    expect(scanResult.confidence).toBeGreaterThan(0.98);
    expect(scanResult.isEmpty).toBe(false);
  });
});
