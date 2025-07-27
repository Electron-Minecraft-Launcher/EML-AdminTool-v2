import { goto } from '$app/navigation'
import type { File as File_ } from '$lib/utils/types'

/**
 * @param duration Sleep duration in ms.
 */
export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * @param retrying Number of times to retry pinging the server. Default is `5`.
 */
export async function pingServerAndReload(retrying: number = 5) {
  await sleep(2000)
  for (let i = 0; i < retrying; i++) {
    try {
      const response = await fetch('/api/ping')
      if (response.ok) {
        goto('/')
        return
      } else {
        console.error('Ping failed:', response.statusText)
      }
    } catch (err) {
      console.error('Ping failed, retrying...', err)
    }
  }
  throw new Error('Failed to ping server after multiple attempts.')
}

export function getFileIcon(file: File_) {
  if (file.type === 'FOLDER') return 'fa-solid fa-folder'
  switch (file.name.split('.').slice(-1)[0]) {
    case 'pdf':
      return 'fa-solid fa-file-pdf'
    case 'txt':
      return 'fa-solid fa-file-lines'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return 'fa-solid fa-image'
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'ogg':
    case 'm4a':
      return 'fa-solid fa-music'
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
    case 'wmv':
    case 'flv':
      return 'fa-solid fa-film'
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return 'fa-solid fa-file-zipper'
    case 'html':
    case 'xml':
    case 'json':
    case 'yaml':
    case 'yml':
    case 'properties':
    case 'config':
      return 'fa-solid fa-code'
    case 'jar':
      return 'fa-brands fa-java'
    case 'py':
      return 'fa-brands fa-python'
    case 'md':
      return 'fa-brands fa-markdown'
    case 'doc':
    case 'docx':
    case 'odt':
    case 'rtf':
      return 'fa-solid fa-file-word'
    case 'xls':
    case 'xlsx':
    case 'ods':
    case 'csv':
      return 'fa-solid fa-file-excel'
    case 'ppt':
    case 'pptx':
    case 'odp':
      return 'fa-solid fa-file-powerpoint'
    case 'exe':
    case 'msi':
    case 'ssh':
    case 'sh':
    case 'bat':
    case 'cmd':
    case 'ps1':
      return 'fa-solid fa-terminal'
    default:
      return 'fa-solid fa-file'
  }
}
