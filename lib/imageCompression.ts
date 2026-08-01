// Shared client-side image compression — originally built to keep uploaded photos
// under Vercel's ~4.5MB serverless body limit (see InputSection.tsx history), reused
// here for per-card image uploads in the Phase 4 editor.

export const MAX_PAYLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 1800;

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image'));
    img.src = dataUrl;
  });
}

// Downscales and re-compresses an image client-side, stepping quality down
// until the base64 payload fits under maxBytes (or gives up gracefully).
export async function compressImage(file: File, maxBytes: number = MAX_PAYLOAD_BYTES): Promise<string> {
  const original = await readAsDataUrl(file);
  if (original.length <= maxBytes) return original;

  const img = await loadImage(original);
  let { width, height } = img;
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const scale = MAX_IMAGE_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.85;
  let compressed = canvas.toDataURL('image/jpeg', quality);
  while (compressed.length > maxBytes && quality > 0.4) {
    quality -= 0.15;
    compressed = canvas.toDataURL('image/jpeg', quality);
  }

  // Only use the compressed version if it actually helped.
  return compressed.length < original.length ? compressed : original;
}

// Converts a data: URL (as produced above) back into a Blob for multipart upload.
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/data:(.*?);base64/)?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
