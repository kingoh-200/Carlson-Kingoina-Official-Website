"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Move, X } from "lucide-react";

const PREVIEW_SIZE = 288;

export default function ProfileCropper({ file, onCancel, onCrop }: { file: File; onCancel: () => void; onCrop: (file: File) => Promise<void> }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [cropping, setCropping] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const baseScale = imageSize.width && imageSize.height
    ? Math.max(PREVIEW_SIZE / imageSize.width, PREVIEW_SIZE / imageSize.height)
    : 1;
  const width = imageSize.width * baseScale * zoom;
  const height = imageSize.height * baseScale * zoom;
  const limitX = Math.max(0, (width - PREVIEW_SIZE) / 2);
  const limitY = Math.max(0, (height - PREVIEW_SIZE) / 2);

  function clampOffset(next: { x: number; y: number }) {
    return {
      x: Math.max(-limitX, Math.min(limitX, next.x)),
      y: Math.max(-limitY, Math.min(limitY, next.y)),
    };
  }

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const delta = { x: event.clientX - dragRef.current.x, y: event.clientY - dragRef.current.y };
    dragRef.current = { x: event.clientX, y: event.clientY };
    setOffset((current) => clampOffset({ x: current.x + delta.x, y: current.y + delta.y }));
  }

  async function createCrop() {
    const image = imageRef.current;
    if (!image || !imageSize.width) return;
    setCropping(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable.");
      const ratio = canvas.width / PREVIEW_SIZE;
      context.drawImage(
        image,
        ((PREVIEW_SIZE - width) / 2 + offset.x) * ratio,
        ((PREVIEW_SIZE - height) / 2 + offset.y) * ratio,
        width * ratio,
        height * ratio
      );
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.94));
      if (!blob) throw new Error("Could not create the cropped photo.");
      await onCrop(new File([blob], "profile-photo.jpg", { type: "image/jpeg" }));
    } finally {
      setCropping(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Crop profile photo">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="text-lg font-semibold">Crop profile photo</h2><p className="mt-1 text-sm text-text-muted">Drag to reposition, then use the slider to zoom.</p></div>
          <button type="button" onClick={onCancel} disabled={cropping} className="rounded-lg p-2 text-text-muted hover:bg-surface-alt hover:text-text" aria-label="Cancel crop"><X size={18} /></button>
        </div>
        <div
          className="relative mx-auto mt-5 h-72 w-72 touch-none overflow-hidden rounded-2xl bg-surface-alt ring-1 ring-border"
          onPointerDown={(event) => { dragRef.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={move}
          onPointerUp={() => { dragRef.current = null; }}
          onPointerCancel={() => { dragRef.current = null; }}
        >
          {previewUrl && <img ref={imageRef} src={previewUrl} alt="Crop preview" draggable={false} onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} className="absolute max-w-none select-none" style={{ width, height, left: (PREVIEW_SIZE - width) / 2 + offset.x, top: (PREVIEW_SIZE - height) / 2 + offset.y }} />}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-white/80" />
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"><span className="rounded-full bg-black/55 px-3 py-1 text-xs text-white"><Move size={12} className="mr-1 inline" />Drag to position</span></div>
        </div>
        <label className="mt-5 block text-sm font-medium">Zoom <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => { setZoom(Number(event.target.value)); setOffset((current) => clampOffset(current)); }} className="mt-2 w-full accent-primary" /></label>
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} disabled={cropping} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-alt">Cancel</button><button type="button" onClick={createCrop} disabled={cropping || !imageSize.width} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">{cropping && <Loader2 size={15} className="animate-spin" />}Crop & upload</button></div>
      </div>
    </div>
  );
}
