import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import type { LoaderVersion } from '$lib/utils/types'
import { LoaderFormat, LoaderType, type Loader } from '.prisma/client'
import { db } from './db'
import { getOrSet } from './cache'

export async function getVanillaVersions() {
  return getOrSet('vanilla-versions', async () => {
    let response = await fetchVanillaVersions()

    let versions = [
      { minecraftVersion: 'Latest', loaderVersion: 'latest_release', type: ['release'] },
      { minecraftVersion: 'Latest', loaderVersion: 'latest_snapshot', type: ['snapshot'] }
    ]

    let release = 'Latest'
    for (const version of response.versions) {
      if (version.id.startsWith('1.')) release = version.id.split('-')[0].split(' ')[0].split('.').slice(0, 2).join('.')
      if (release.startsWith('1.RV')) continue
      versions.push({
        minecraftVersion: release,
        loaderVersion: version.id,
        type: [version.type]
      })
    }

    return versions as LoaderVersion[]
  })
}

export async function getForgeVersions() {
  return getOrSet('forge-versions', async () => {
    let res1 = await fetchForgeVersions()
    let res2 = await fetchForgePromos()

    let versions = []
    for (const [version, data] of Object.entries(res1)) {
      versions.push(
        ...(data as any).map((v: any) => ({
          minecraftVersion: version.split('.').slice(0, 2).join('.'),
          loaderVersion: v,
          type: ['default' as const]
        }))
      )
    }

    for (const [version, data] of Object.entries(res2.promos)) {
      const minecraftVersion = version.split('-')[0]
      const type = version.split('-')[1] as 'recommended' | 'latest'
      const i = versions.findIndex((v) => v.loaderVersion.startsWith(`${minecraftVersion}-${data}`))
      versions[i].type =
        (versions[i].type.includes('recommended') || versions[i].type.includes('latest')) && !versions[i].type.includes(type)
          ? ['latest', 'recommended']
          : [type]
    }

    versions = versions.reverse()

    return versions as LoaderVersion[]
  })
}

export async function checkVanillaLoader(minecraftVersion: string, loaderVersion: string) {
  if (loaderVersion !== minecraftVersion) {
    console.warn('Loader version and Minecraft version mismatch:', loaderVersion, minecraftVersion)
    throw new BusinessError('Loader version and Minecraft version mismatch', NotificationCode.FILESUPDATER_VERSIONS_MISMATCH, 400)
  }

  if (minecraftVersion !== 'latest_release' && minecraftVersion !== 'latest_snapshot') {
    const vanillaVersions = (await fetchVanillaVersions()) as { versions: { id: string; type: string }[] }

    if (!vanillaVersions.versions.find((v) => v.id === minecraftVersion)) {
      console.warn('Invalid Minecraft version:', minecraftVersion)
      throw new BusinessError('Invalid Minecraft version', NotificationCode.FILESUPDATER_MINECRAFT_VERSION_NOT_FOUND, 400)
    }
  }
}

export async function checkForgeLoader(minecraftVersion: string, loaderVersion: string) {
  if (loaderVersion.split('-')[0].replace('_', '-') !== minecraftVersion) {
    console.warn('Loader version and Minecraft version mismatch:', loaderVersion, minecraftVersion)
    throw new BusinessError('Loader version and Minecraft version mismatch', NotificationCode.FILESUPDATER_VERSIONS_MISMATCH, 400)
  }

  const forgeVersions = await fetchForgeVersions()

  if (
    !Object.keys(forgeVersions).includes(minecraftVersion.replace('-', '_')) ||
    !forgeVersions[minecraftVersion.replace('-', '_')].includes(loaderVersion)
  ) {
    console.warn('Invalid Forge version:', loaderVersion, minecraftVersion)
    throw new BusinessError('Invalid Forge version', NotificationCode.FILESUPDATER_FORGE_VERSION_NOT_FOUND, 400)
  }
}

export async function getForgeFile(loaderVersion: string) {
  const forgeMeta = (await getForgeMeta(loaderVersion)).classifiers

  const format = getFormat(forgeMeta)
  const ext = Object.keys(forgeMeta[format])[0]

  return {
    format: getTypedFormat(format),
    file: {
      name: `forge-${loaderVersion}.jar`,
      path: `versions/forge-${loaderVersion}/`,
      url: `https://maven.minecraftforge.net/net/minecraftforge/forge/${loaderVersion}/forge-${loaderVersion}-${format.toLowerCase()}.${ext}`,
      size: await getForgeArtifactSize(loaderVersion, format, ext),
      sha1: await getForgeArtifactSha1(loaderVersion, format, ext),
      type: 'OTHER' as const
    }
  }
}

export async function updateLoader(loader: Partial<Loader>) {
  let existingLoader
  try {
    existingLoader = await db.loader.findUnique({ where: { id: '1' } })
  } catch (err) {
    console.error('Failed to fetch existing loader:', err)
    throw new ServerError('Failed to fetch existing loader', err, NotificationCode.DATABASE_ERROR, 500)
  }

  const formattedLoader = {
    id: '1',
    type: loader.type ?? LoaderType.VANILLA,
    minecraftVersion: loader.minecraftVersion ?? 'latest_release',
    loaderVersion: loader.loaderVersion ?? 'latest_release',
    format: loader.format ?? LoaderFormat.UNIVERSAL,
    file: loader.file ? { update: loader.file } : undefined
  }

  try {
    if (existingLoader) {
      await db.loader.update({ where: { id: '1' }, data: formattedLoader })
    } else {
      await db.loader.create({ data: formattedLoader })
    }
  } catch (err) {
    console.error('Failed to update loader:', err)
    throw new ServerError('Failed to update loader', err, NotificationCode.DATABASE_ERROR, 500)
  }
}

// TODO catch HTTP errors in ALL files, including .svelte files

async function fetchVanillaVersions() {
  try {
    const response = await fetch(`https://launchermeta.mojang.com/mc/game/version_manifest.json`, { headers: { Connection: 'close' } })
    if (!response.ok) {
      console.error('Failed to fetch Minecraft versions:', response.statusText)
      throw new ServerError('Failed to fetch Minecraft versions', null, NotificationCode.EXTERNAL_API_ERROR, response.status)
    }
    return await response.json()
  } catch (err) {
    console.error('Failed to fetch Minecraft versions:', err)
    throw new ServerError('Failed to fetch Minecraft versions', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }
}

async function fetchForgeVersions() {
  try {
    const response = await fetch(`https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json`, {
      headers: { Connection: 'close' }
    })
    if (!response.ok) {
      console.error('Failed to fetch Forge versions:', response.statusText)
      throw new ServerError('Failed to fetch Forge versions', null, NotificationCode.EXTERNAL_API_ERROR, response.status)
    }
    return await response.json()
  } catch (err) {
    console.error('Failed to fetch Forge versions:', err)
    throw new ServerError('Failed to fetch Forge versions', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }
}

async function fetchForgePromos() {
  try {
    const response = await fetch(`https://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions_slim.json`, {
      headers: { Connection: 'close' }
    })
    if (!response.ok) {
      console.error('Failed to fetch Forge promotions:', response.statusText)
      throw new ServerError('Failed to fetch Forge promotions', null, NotificationCode.EXTERNAL_API_ERROR, response.status)
    }
    return await response.json()
  } catch (err) {
    console.error('Failed to fetch Forge promotions:', err)
    throw new ServerError('Failed to fetch Forge promotions', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }
}

async function getForgeMeta(version: string) {
  try {
    const response = await fetch(`https://files.minecraftforge.net/net/minecraftforge/forge/${version}/meta.json`, {
      headers: { Connection: 'close' }
    })
    if (!response.ok) {
      console.error('Failed to fetch Forge meta:', response.statusText)
      throw new ServerError('Failed to fetch Forge meta', null, NotificationCode.EXTERNAL_API_ERROR, response.status)
    }
    return await response.json()
  } catch (err) {
    console.error('Failed to fetch Forge meta:', err)
    throw new ServerError('Failed to fetch Forge meta', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }
}

async function getForgeArtifactSize(version: string, format: string, ext: string) {
  try {
    const response = await fetch(`https://maven.minecraftforge.net/net/minecraftforge/forge/${version}/forge-${version}-${format}.${ext}`, {
      headers: { Connection: 'close' }
    })
    if (!response.ok) {
      console.error('Failed to fetch Forge artifact size:', response.statusText)
      throw new ServerError('Failed to fetch Forge artifact size', null, NotificationCode.EXTERNAL_API_ERROR, response.status)
    }
    return Number(response.headers.get('Content-Length') ?? 0)
  } catch (err) {
    console.error('Failed to fetch Forge artifact size:', err)
    throw new ServerError('Failed to fetch Forge artifact size', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }
}

async function getForgeArtifactSha1(version: string, format: string, ext: string) {
  try {
    const response = await fetch(
      `https://maven.minecraftforge.net/net/minecraftforge/forge/${version}/forge-${version}-${format}.${ext}.sha1`,
      { headers: { Connection: 'close' } }
    )
    if (!response.ok) {
      console.error('Failed to fetch Forge artifact SHA1:', response.statusText)
      throw new ServerError('Failed to fetch Forge artifact SHA1', null, NotificationCode.EXTERNAL_API_ERROR, response.status)
    }
    return await response.text().then((text) => text.trim())
  } catch (err) {
    console.error('Failed to fetch Forge artifact SHA1:', err)
    throw new ServerError('Failed to fetch Forge artifact SHA1', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }
}

function getFormat(forgeMeta: any) {
  if (forgeMeta.installer) return 'installer'
  else if (forgeMeta.client) return 'client'
  return 'universal'
}

function getTypedFormat(format: string) {
  switch (format) {
    case 'installer':
      return LoaderFormat.INSTALLER
    case 'client':
      return LoaderFormat.CLIENT
    default:
      return LoaderFormat.UNIVERSAL
  }
}

