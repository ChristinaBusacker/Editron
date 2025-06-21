import { User } from './user.model';

export interface AssetVariant {
  webp: string;
  fallback: string;
}

export interface Asset {
  id: string;
  originalFilename: string;
  storedFilename: string;
  mimeType: string;
  blurhash?: string;
  size: number;
  width?: number;
  height?: number;
  hash?: string;
  variants: Record<string, AssetVariant>;
  uploadedBy: User;
  uploadedAt: string;
}

export interface UploadAssetFromDataPayload {
  filename: string;
  mimeType: string;
  data?: string;
  url?: string;
  source?: string;
  tags?: string[];
}

export interface UploadAssetResponse {
  id: string;
  filename: string;
  variants?: Record<string, AssetVariant>;
  note?: string;
}
