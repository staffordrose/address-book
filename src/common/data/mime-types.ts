import {
  FileType,
  ImageFileType,
  ImageMimeType,
  MimeType,
} from "@/common/types"

const imageMimeTypes: { [key in ImageFileType]: ImageMimeType } = {
  apng: "image/apng",
  avif: "image/avif",
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
}

export const mimeTypes: { [key in FileType]: MimeType } = {
  ...imageMimeTypes,
}
