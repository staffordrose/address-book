import {
  FileType,
  ImageFileType,
  ImageMimeType,
  MimeType,
} from "@/common/types"

const imageFileTypes: { [key in ImageMimeType]: ImageFileType } = {
  "image/apng": "apng",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
}

export const fileTypes: { [key in MimeType]: FileType } = {
  ...imageFileTypes,
}
