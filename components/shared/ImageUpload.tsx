"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  currentUrl: string | null;
  uploadAction: (formData: FormData) => Promise<{ error?: string; url?: string }>;
  label: string;
}

export function ImageUpload({ currentUrl, uploadAction, label }: ImageUploadProps) {
  const [url, setUrl] = useState(currentUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAction(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setUrl(result.url);
    }

    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {url ? (
        <div className="mb-3">
          <img
            src={url}
            alt={label}
            className="max-h-96 max-w-full rounded-lg border border-gray-200 object-contain"
          />
        </div>
      ) : (
        <div className="mb-3 rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
          Nessuna immagine
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="text-sm text-gray-500 underline hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Caricamento…" : url ? "Cambia immagine" : `Carica ${label}`}
      </button>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
