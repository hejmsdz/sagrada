import { useRef, useEffect, useState, useMemo } from "react";
import { CameraIcon } from "lucide-react";
import { getGridCoordinates, type GridCoordinates } from "@/lib/grid";
import { GridOverlay } from "./grid-overlay";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function CameraPreview({
  stream,
  onPlay,
  onEnded,
}: {
  stream: MediaStream | null;
  onPlay: (video: HTMLVideoElement, gridCoordinates: GridCoordinates) => void;
  onEnded: () => void;
}) {
  const { t } = useTranslation();
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
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
    }
  }, [stream]);

  return (
    <div className="text-sm text-muted-foreground mb-4 bg-muted p-4 rounded-lg flex flex-col items-center justify-center gap-2 aspect-5/4 max-w-sm mx-auto overflow-hidden relative">
      <video
        aria-label={t("cameraPreview")}
        className={cn("absolute inset-0 w-full h-full object-cover", {
          hidden: !isPlaying,
        })}
        ref={videoRef}
        onCanPlay={() => {
          const video = videoRef.current;
          if (!video) return;

          setVideoSize({
            width: video.videoWidth,
            height: video.videoHeight,
          });
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setVideoSize(null);
          onEnded();
        }}
        disablePictureInPicture
        tabIndex={-1}
      />
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {videoSize && gridCoordinates && (
          <GridOverlay
            key={`${videoSize.width}-${videoSize.height}`}
            className="w-full h-full object-cover"
            videoWidth={videoSize.width}
            videoHeight={videoSize.height}
            gridCoordinates={gridCoordinates}
          />
        )}
      </div>
      {!isPlaying && <CameraIcon className="w-32 h-32 opacity-25" />}
    </div>
  );
}
