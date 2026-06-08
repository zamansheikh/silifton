"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

export type UploadResult = {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
};

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  aspectRatio = "16/10",
  accept = "image/*",
  helperText,
}: {
  value?: string;
  onChange: (url: string, meta?: UploadResult) => void;
  label?: string;
  aspectRatio?: string;
  accept?: string;
  helperText?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    void upload(file);
  };

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      // Use XHR so we get progress events (fetch doesn't expose upload progress).
      const url = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        fd.append("file", file);
        xhr.open("POST", "/api/proxy/admin/uploads");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try { resolve(JSON.parse(xhr.responseText)); }
            catch { reject(new Error("Bad response from server")); }
          } else {
            let msg = `Upload failed (${xhr.status})`;
            try {
              const body = JSON.parse(xhr.responseText);
              if (body?.message) msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
            } catch { /* ignore */ }
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(fd);
      });
      onChange(url.url, url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          padding: 12,
          border: "1px dashed var(--border-strong)",
          borderRadius: 10,
          background: "var(--surface-0)",
        }}
      >
        <div
          style={{
            width: 120,
            aspectRatio,
            borderRadius: 8,
            background: value ? `url(${value}) center/cover` : "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            color: "var(--fg-faint)",
          }}
          aria-hidden
        >
          {!value && <Icon name="layers" size={20} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="btn btn-ghost btn-sm"
              disabled={uploading}
            >
              <Icon name="download" size={13} />
              {uploading ? `Uploading… ${progress}%` : value ? "Replace" : "Choose file"}
            </button>
            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="btn btn-ghost btn-sm"
              >
                <Icon name="trash" size={13} /> Remove
              </button>
            )}
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 8, letterSpacing: "0.06em" }}>
            {helperText ?? "Drag & drop or click. PNG / JPG / WebP. Max 10 MB."}
          </div>
          {value && (
            <div style={{ fontSize: 11, color: "var(--fg-mute)", marginTop: 6, wordBreak: "break-all" }}>
              {value}
            </div>
          )}
          {uploading && (
            <div style={{ marginTop: 10, height: 4, background: "var(--surface-2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "var(--accent)", transition: "width 120ms ease" }} />
            </div>
          )}
          {error && (
            <div style={{ marginTop: 8, color: "var(--danger)", fontSize: 12.5 }}>
              {error}
            </div>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
