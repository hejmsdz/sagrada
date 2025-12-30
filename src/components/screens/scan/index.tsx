// import { useStore } from "@/lib/store";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { CameraIcon, PencilIcon, ScanIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { CameraPreview } from "./camera-preview";
import { useRef, useState, useEffect } from "react";
import type { GridCoordinates } from "@/lib/grid";
import {
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  loadModels,
  scan,
} from "@/scanning/scanning";
import { useStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { HelpText } from "@/components/help-text";
import { Actions } from "@/components/layout/actions";

const models = loadModels();

export function Scan({ playerId }: { playerId: string }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();
  const setPlayerBoard = useStore((state) => state.setPlayerBoard);

  const requestCamera = async () => {
    setIsDisabled(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });
      setStream(stream);
    } finally {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    (async () => {
      const permissions = await navigator.permissions?.query?.({
        name: "camera",
      });

      if (permissions?.state === "granted") {
        requestCamera();
      }
    })();
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gridCoordinatesRef = useRef<GridCoordinates | null>(null);

  const onCameraReady = (
    video: HTMLVideoElement,
    gridCoordinates: GridCoordinates,
  ) => {
    canvasRef.current = document.createElement("canvas");
    canvasRef.current.width = IMAGE_WIDTH;
    canvasRef.current.height = IMAGE_HEIGHT;

    contextRef.current = canvasRef.current.getContext("2d");
    videoRef.current = video;
    gridCoordinatesRef.current = gridCoordinates;

    requestAnimationFrame(scanContinuously);
  };

  const scanCurrentFrame = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !contextRef.current ||
      !gridCoordinatesRef.current
    ) {
      return;
    }

    const { left, top, width, height } = gridCoordinatesRef.current;

    contextRef.current.drawImage(
      videoRef.current,
      left,
      top,
      width,
      height,
      0,
      0,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    );

    return scan(canvasRef.current, await models);
  };

  const scanContinuously = async () => {
    const result = await scanCurrentFrame();

    if (!result) {
      return;
    }

    if (result.confidence >= 0.98 && !result.isEmpty) {
      setPlayerBoard(Number(playerId), result.board);
      navigate({ to: "/player/$id/review", params: { id: playerId } });
    } else {
      requestAnimationFrame(scanContinuously);
    }
  };

  const manualCapture = async () => {
    const result = await scanCurrentFrame();

    if (!result) {
      return;
    }

    setPlayerBoard(Number(playerId), result.board);
    navigate({ to: "/player/$id/review", params: { id: playerId } });
  };

  useEffect(
    () => () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    },
    [stream],
  );

  const { t } = useTranslation();

  return (
    <Page>
      <Header>{t("scanYourWindowFrame")}</Header>
      <CameraPreview
        stream={stream}
        onPlay={onCameraReady}
        onEnded={() => setStream(null)}
      />
      <HelpText>{t("photoFramingTip")}</HelpText>
      <Actions>
        {stream ? (
          <Button variant="default" className="w-full" onClick={manualCapture}>
            <CameraIcon className="w-4 h-4" />
            {t("capture")}
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={requestCamera}
            disabled={isDisabled}
          >
            <ScanIcon className="w-4 h-4" />
            {t("startScanning")}
          </Button>
        )}
        <Button variant="outline" className="w-full" asChild>
          <Link to="/player/$id/review" params={{ id: playerId }}>
            <PencilIcon className="w-4 h-4" />
            {t("enterManually")}
          </Link>
        </Button>
      </Actions>
    </Page>
  );
}
