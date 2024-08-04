export interface File {
  /**
   * The name of the file.
   */
  name: string
  /**
   * The path of the file, without the name and the leading slash, but with the trailing slash (e.g. `'path/to/file/'`).
   */
  path: string
  /**
   * The size of the file in bytes.
   */
  size?: number
  /**
   * The SHA1 hash of the file.
   */
  sha1?: string
  /**
   * The MD5 hash of the file.
   */
  md5?: string
  /**
   * The URL to download the file.
   */
  url: string
  /**
   * The type of the file.
   * 
   * `'JAVA'`: Java files
   * 
   * `'ASSET'`: Minecraft asset
   * 
   * `'LIBRARY'`: Minecraft library
   * 
   * `'NATIVE'`: Minecraft native
   * 
   * `'MOD'`: Mod from the modpack (hosted on the EML AdminTool)
   * 
   * `'CONFIG'`: Configuration file
   * 
   * `'OTHER'`: Other files
   */
  type: 'JAVA' | 'ASSET' | 'LIBRARY' | 'NATIVE' | 'MOD' | 'CONFIG' | 'BOOTSTRAP' | 'BACKGROUND' | 'FOLDER' | 'IMAGE' | 'OTHER'
}

export interface Loader {
  id?: number
  loader: 'vanilla' | 'forge'
  minecraft_version: string
  loader_version: string | null
  type: 'installer' | 'universal' | 'client'
}