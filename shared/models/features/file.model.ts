export interface File {
  /**
   * The name of the file
   */
  name: string
  /**
   * The path of the file, without the name and the leading slash, but with the trailing slash (e.g. `'path/to/file/'`)
   */
  path: string
  /**
   * The size of the file in bytes
   */
  size?: number
  /**
   * The SHA1 hash of the file
   */
  sha1?: string
  /**
   * The URL to download the file
   */
  url: string
  /**
   * The type of the file
   * 
   * `'JAVA'`: Java files
   * 
   * `'ASSETS'`: Minecraft assets
   * 
   * `'LIBRARIES'`: Minecraft libraries
   * 
   * `'NATIVES'`: Minecraft natives
   * 
   * `'MODS'`: Mods from the modpack (hosted on the EML AdminTool)
   * 
   * `'CONFIG'`: Configuration files
   * 
   * `'OTHER'`: Other files
   */
  type: 'JAVA' | 'ASSETS' | 'LIBRARIES' | 'NATIVES' | 'MODS' | 'CONFIG' | 'BOOTSTRAP' | 'BACKGROUND' | 'FOLDER' | 'OTHER'
}