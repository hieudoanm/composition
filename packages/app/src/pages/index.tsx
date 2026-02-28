'use client';

import { NextPage } from 'next';
import { FC, useEffect, useRef, useState } from 'react';

/* ============================= */
/* Types & Constants */
/* ============================= */

type OverlayMode = 'none' | 'thirds' | 'symmetry';

type RatioOption = {
  label: string;
  value: number;
};

const RATIOS: RatioOption[] = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
];

/* ============================= */
/* Small Components */
/* ============================= */

const PageTitle: FC = () => (
  <div className="w-full max-w-sm text-center">
    <h1 className="text-2xl font-bold tracking-tight">Camera Playground</h1>
    <p className="text-base-content/60 text-sm">
      Explore ratios & composition guides
    </p>
  </div>
);

const GridOverlay: FC<{ overlay: OverlayMode }> = ({ overlay }) => {
  if (overlay === 'none') return null;

  if (overlay === 'thirds') {
    return (
      <>
        <div className="absolute top-0 left-1/3 h-full w-px bg-white/40" />
        <div className="absolute top-0 left-2/3 h-full w-px bg-white/40" />
        <div className="absolute top-1/3 left-0 h-px w-full bg-white/40" />
        <div className="absolute top-2/3 left-0 h-px w-full bg-white/40" />
      </>
    );
  }

  return (
    <>
      <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white/60" />
      <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/60" />
    </>
  );
};

const RatioFrame: FC<{ ratio: number; overlay: OverlayMode }> = ({
  ratio,
  overlay,
}) => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div
      className="relative w-full"
      style={{
        aspectRatio: ratio,
        maxHeight: '100%',
      }}>
      <div className="absolute inset-0 rounded-3xl border border-white/20" />
      <GridOverlay overlay={overlay} />
    </div>
  </div>
);

const CaptureButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="btn btn-circle border-base-content flex h-20 w-20 items-center justify-center border-4 p-1 shadow-xl transition active:scale-95">
    <div className="bg-primary border-base-200 h-full w-full rounded-full border-4" />
  </button>
);

const MainControls: FC<{
  ratioLabel: string;
  onRatio: () => void;
  onCapture: () => void;
  onSwitchCamera: () => void;
}> = ({ ratioLabel, onRatio, onCapture, onSwitchCamera }) => (
  <div className="grid w-full max-w-sm grid-cols-3 items-center">
    <div className="flex justify-center">
      <button onClick={onRatio} className="btn btn-sm btn-primary">
        {ratioLabel}
      </button>
    </div>

    <div className="flex justify-center">
      <CaptureButton onClick={onCapture} />
    </div>

    <div className="flex justify-center">
      <button onClick={onSwitchCamera} className="btn btn-sm btn-primary">
        🔄
      </button>
    </div>
  </div>
);

const GridButton: FC<{ overlay: OverlayMode; onSwitch: () => void }> = ({
  overlay,
  onSwitch,
}) => (
  <div className="flex w-full max-w-sm justify-center">
    <button onClick={onSwitch} className="btn btn-sm btn-primary">
      {overlay === 'none'
        ? 'No Grid'
        : overlay === 'thirds'
          ? 'Rule of Thirds'
          : 'Symmetry'}
    </button>
  </div>
);

/* ============================= */
/* Main Page */
/* ============================= */

export const HomePage: NextPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [overlay, setOverlay] = useState<OverlayMode>('none');
  const [ratioIndex, setRatioIndex] = useState(0);

  const currentRatio = RATIOS[ratioIndex];

  useEffect(() => {
    const initCamera = async () => {
      try {
        stream?.getTracks().forEach((track) => track.stop());

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error(err);
      }
    };

    initCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  const switchCamera = () =>
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));

  const switchOverlay = () =>
    setOverlay((prev) =>
      prev === 'none' ? 'thirds' : prev === 'thirds' ? 'symmetry' : 'none',
    );

  const switchRatio = () => setRatioIndex((prev) => (prev + 1) % RATIOS.length);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const targetRatio = currentRatio.value;
    const videoRatio = videoWidth / videoHeight;

    let cropWidth = videoWidth;
    let cropHeight = videoHeight;

    if (videoRatio > targetRatio) {
      cropWidth = videoHeight * targetRatio;
    } else {
      cropHeight = videoWidth / targetRatio;
    }

    const sx = (videoWidth - cropWidth) / 2;
    const sy = (videoHeight - cropHeight) / 2;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset transform before drawing
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (facingMode === 'user') {
      ctx.translate(cropWidth, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      video,
      sx,
      sy,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    // Convert to Blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `photo-${currentRatio.label}-${timestamp}.png`;
      link.href = url;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="bg-base-200 flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <PageTitle />

      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl bg-black shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`absolute inset-0 h-full w-full object-cover ${
            facingMode === 'user' ? 'scale-x-[-1]' : ''
          }`}
        />
        <RatioFrame ratio={currentRatio.value} overlay={overlay} />
      </div>

      <MainControls
        ratioLabel={currentRatio.label}
        onRatio={switchRatio}
        onCapture={handleCapture}
        onSwitchCamera={switchCamera}
      />

      <GridButton overlay={overlay} onSwitch={switchOverlay} />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default HomePage;
