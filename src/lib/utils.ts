export const MAX_VIDEO_SIZE = 80 * 1024 * 1024;
export const MAX_PHOTO_SIZE = 20 * 1024 * 1024;
export const MEDIA_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
};
export const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";
export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";
export function validateMediaFile(file: File) {
  if (!Object.hasOwn(MEDIA_EXTENSIONS, file.type)) return "Choose a JPG, PNG, or WebP photo, or an MP4, WebM, or MOV video.";
  if (file.size === 0) return "This file is empty. Choose another photo or video.";
  if (file.type.startsWith("image/") && file.size > MAX_PHOTO_SIZE) return "Photos must be 20 MB or smaller.";
  if (file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE) return "Videos must be 80 MB or smaller.";
  return null;
}
export const MAX_CAPTION_LENGTH = 180;
const INAPPROPRIATE_CONTENT_PATTERNS = [/\bnsfw\b/i, /\bporn(?:ography)?\b/i, /\bonlyfans\b/i, /\bgoatse\b/i];

export function validateUserText(value: string) {
  if (INAPPROPRIATE_CONTENT_PATTERNS.some(pattern => pattern.test(value))) return "Please remove inappropriate language before continuing.";
  return null;
}

export function parseCaption(caption: string) {
  return caption.split(/(#[\w-]+|@[\w.-]+)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("#")) return { text: part, kind: "hashtag" as const, key: `${part}-${index}` };
    if (part.startsWith("@")) return { text: part, kind: "mention" as const, key: `${part}-${index}` };
    return { text: part, kind: "text" as const, key: `${part}-${index}` };
  });
}

export function validateVideoFile(file: File) {
  const validType = ["video/mp4", "video/webm", "video/quicktime"].includes(file.type);
  if (!validType) return "Choose an MP4, WebM, or MOV video.";
  if (file.size > MAX_VIDEO_SIZE) return "Videos must be 80 MB or smaller.";
  return null;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
