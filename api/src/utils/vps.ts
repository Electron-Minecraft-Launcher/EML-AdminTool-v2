import os, { platform, release } from 'os'
import { execSync } from 'child_process'

class VPS {
  getOS() {
    return os.version()
  }

  getStorage() {
    let totalSpaceCommand: string
    let freeSpaceCommand: string
    let unit: 'GB' | 'KB' | 'B'

    if (platform() === 'linux') {
      totalSpaceCommand = "df -k --output=size / | sed '1d'"
      freeSpaceCommand = "df -k --output=avail / | sed '1d'"
      unit = 'GB'
    } else if (platform() === 'win32') {
      totalSpaceCommand = 'wmic logicaldisk get Size /value | findstr /r /c:"[0-9]"'
      freeSpaceCommand = 'wmic logicaldisk get FreeSpace /value | findstr /r /c:"[0-9]"'
      unit = 'B'
    } else if (platform() === 'darwin') {
      totalSpaceCommand = "df -k / | awk 'NR==2{print $2}'"
      freeSpaceCommand = "df -k / | awk 'NR==2{print $4}'"
      unit = 'KB'
    } else {
      return [0, 0]
    }

    const totalSpaceOutput = execSync(totalSpaceCommand).toString().trim()
    const freeSpaceOutput = execSync(freeSpaceCommand).toString().trim()

    const totalSpace = this.parseSizeOutput(totalSpaceOutput, unit)
    const freeSpace = this.parseSizeOutput(freeSpaceOutput, unit)
    const usedSpace = totalSpace - freeSpace

    return [usedSpace, totalSpace]
  }

  private parseSizeOutput(output: string, unit: 'GB' | 'KB' | 'B') {
    const sizeString = output.replace(/\D/g, '')
    const size = parseInt(sizeString)

    if (unit === 'KB') {
      return size * 1024
    } else {
      return size
    }
  }
}

export default new VPS()
