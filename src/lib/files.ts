import { unlink } from 'node:fs/promises'
import { UPLOAD_DIR } from '@/constants'
import { createId } from '@paralleldrive/cuid2'
import sharp from 'sharp'

export async function storeImage(file: Blob) {
  if (!file) return
  const arrayBuffer = await file.arrayBuffer()
  const filename = `${createId()}.webp`
  await sharp(arrayBuffer).webp().toFile(`${UPLOAD_DIR}/${filename}`)
  return filename
}

export async function deleteImage(filename: string | null) {
  if (!filename) return
  const cover = `${UPLOAD_DIR}/${filename}`
  if (await Bun.file(cover).exists()) {
    unlink(`${UPLOAD_DIR}/${filename}`)
  }
}
