import fs from "fs/promises";
import path from "path";
import { safeFileName } from "./utils";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./data/uploads";

/** 确保上传根目录存在 */
export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/** 保存上传的二进制文件，返回 {fileName, filePath} */
export async function saveUpload(file: File): Promise<{ fileName: string; filePath: string }> {
  await ensureUploadDir();
  const fileName = safeFileName(file.name);
  const filePath = path.join(UPLOAD_DIR, fileName);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buf);
  return { fileName, filePath };
}

/** 通过文件系统路径删除文件（不抛错） */
export async function removeUpload(filePath?: string | null) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // 忽略不存在的文件
  }
}

/** 提取文件扩展名 */
export function extOf(fileName: string): string {
  const e = path.extname(fileName).toLowerCase().replace(".", "");
  return e || "file";
}
