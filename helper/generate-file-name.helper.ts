import { extname } from 'path';

export function generateFileName(
  modelId: number,
  originalName?: string,
): string {
  const extension = extname(originalName ?? '');

  const now = new Date();

  const timestamp =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, '0')}-` +
    `${String(now.getDate()).padStart(2, '0')}_` +
    `${String(now.getHours()).padStart(2, '0')}-` +
    `${String(now.getMinutes()).padStart(2, '0')}-` +
    `${String(now.getSeconds()).padStart(2, '0')}`;

  return `${modelId}-${timestamp}${extension}`;
}
