import { useRef, useEffect, useState, useMemo } from "react";
import { CameraIcon } from "lucide-react";
import { getGridCoordinates, type GridCoordinates } from "@/lib/grid";
import { GridOverlay } from "./grid-overlay";
import { cn } from "@/lib/utils";

export function CameraPreview({
  stream,
  onPlay,
  onEnded,
}: {
  stream: MediaStream | null;
  onPlay: (video: HTMLVideoElement, gridCoordinates: GridCoordinates) => void;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSize, setVideoSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const gridCoordinates = useMemo(
    () =>
      videoSize ? getGridCoordinates(videoSize.width, videoSize.height) : null,
    [videoSize],
  );

  useEffect(() => {
    if (isPlaying && videoRef.current && gridCoordinates) {
      onPlay(videoRef.current, gridCoordinates);
    }
  }, [onPlay, isPlaying, gridCoordinates]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  return (
    <div className="text-sm text-muted-foreground mb-4 bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center gap-2 aspect-5/4 max-w-sm mx-auto overflow-hidden relative">
      <video
        className={cn("absolute inset-0 w-full h-full object-cover", {
          hidden: !isPlaying,
        })}
        ref={videoRef}
        onCanPlay={() => {
          const video = videoRef.current;
          if (!video) return;

          setVideoSize({ width: video.videoWidth, height: video.videoHeight });
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setVideoSize(null);
          onEnded();
        }}
      />
      {videoSize && gridCoordinates && (
        <GridOverlay
          className="absolute inset-0 w-full h-full object-cover"
          videoWidth={videoSize.width}
          videoHeight={videoSize.height}
          gridCoordinates={gridCoordinates}
        />
      )}
      {!stream && <CameraIcon className="w-32 h-32 opacity-25" />}
    </div>
  );
}
