import { UPLOAD_DIR } from '@/constants'
import sharp from 'sharp'

export async function storeImage(cover: Blob) {
  if (!cover) return
  const arrayBuffer = await cover.arrayBuffer()
  const filename = `${crypto.randomUUID()}.webp`
  await sharp(arrayBuffer).webp().toFile(`${UPLOAD_DIR}/${filename}`)
  return filename
}
