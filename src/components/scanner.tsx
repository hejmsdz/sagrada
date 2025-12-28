import {
  scan,
  loadModels,
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
} from "@/scanning/scanning";
import { useRef, useState, useCallback } from "react";
import { BoardView } from "./board-view";
import { Board, NUM_COLUMNS, NUM_ROWS } from "@/game/types";
import { GridOverlay } from "./grid-overlay";
import { Button } from "./ui/button";

const models = loadModels();

const getGridCoordinates = (
  containerWidth: number,
  containerHeight: number,
) => {
  const margin = Math.round(0.05 * containerWidth);
  const left = margin;
  const width = containerWidth - 2 * margin;
  const right = left + width;
  const cellSize = Math.round(width / NUM_COLUMNS);
  const height = cellSize * NUM_ROWS;
  const top = (containerHeight - height) / 2;
  const bottom = top + height;

  return { left, right, top, bottom, cellSize };
};

export function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [gridCoordinates, setGridCoordinates] = useState<
    | (ReturnType<typeof getGridCoordinates> & {
        width: number;
        height: number;
      })
    | null
  >(null);
  const [info, setInfo] = useState<string>("");

  const startDetection = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !gridCoordinates) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    const t0 = performance.now();

    context.drawImage(
      videoRef.current,
      gridCoordinates.left,
      gridCoordinates.top,
      gridCoordinates.right - gridCoordinates.left,
      gridCoordinates.bottom - gridCoordinates.top,
      0,
      0,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    );

    const result = await scan(canvasRef.current, await models);

    const t1 = performance.now();
    const duration = t1 - t0;
    const fps = 1000 / duration;
    setBoard(result.board);
    setInfo(
      `Time taken: ${duration.toFixed(0)} ms, FPS: ${fps.toFixed(2)}, Confidence: ${result.confidence}`,
    );

    setConfidence(result.confidence);

    if (result.confidence < 0.99 || result.isEmpty) {
      requestAnimationFrame(startDetection);
    }
  }, [videoRef, canvasRef, gridCoordinates]);

  return (
    <div>
      <div className="relative w-full aspect-video">
        <video
          className="w-full h-auto"
          ref={videoRef}
          onCanPlay={() => {
            const video = videoRef.current;
            if (!video) return;

            const width = video.videoWidth;
            const height = video.videoHeight;
            const gridCoordinates = getGridCoordinates(width, height);
            setGridCoordinates({ ...gridCoordinates, width, height });
          }}
        />
        {gridCoordinates && (
          <GridOverlay
            className="absolute inset-0 w-full h-full"
            {...gridCoordinates}
          />
        )}
      </div>
      <meter value={confidence} max={1} className="w-full" />
      <canvas ref={canvasRef} width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />
      <Button
        type="button"
        onClick={async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
            },
            audio: false,
          });

          if (!videoRef.current) return;
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }}
      >
        start camera
      </Button>
      <Button
        onClick={async () => {
          requestAnimationFrame(startDetection);
        }}
      >
        Scan
      </Button>
      {info}
      {board && <BoardView board={board} />}
    </div>
  );
}
