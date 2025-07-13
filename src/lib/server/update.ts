import pkg from '../../../package.json'

export async function getUpdate() {
  let data

  try {
    const response = await fetch('https://api.github.com/repos/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/latest')
    data = (await response.json()) as { tag_name: string; published_at: string; body: string }
    //! DEV ONLY: Uncomment the next two lines and comment the previous two lines to prevent rate limiting during development
    // const response = new Response() //! DEV ONLY: Prevent rate limit
    // response.ok = false //! DEV ONLY: Prevent rate limit
  } catch (err) {
    console.error(err)
    data = { tag_name: pkg.version, published_at: Date.now().toString().split('T')[0], body: '' }
  }

  const currentVersion = pkg.version
  const latestVersion = data.tag_name.replace('v', '') ?? currentVersion
  const releaseDate = data.published_at.split('T')[0] ?? Date.now().toString().split('T')[0]
  const shortLastVersion = latestVersion.split('.').slice(0, 2).join('.')
  const logoUrl = `https://raw.githubusercontent.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/refs/heads/main/.changelogs/v${shortLastVersion}.png`
  const changelogs = data.body

  return { currentVersion, latestVersion, releaseDate, logoUrl, changelogs }
}
