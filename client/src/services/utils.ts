class Utils {
  sleep(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  toFirstLetterUppercase(string: string): string {
    let strs: string[] = string.toLocaleLowerCase().split(' ')
    let strs_: string[] = []

    for (let value of strs) {
      let f = value.charAt(0).toUpperCase()
      let s = value.slice(1)
      strs_.push(f + '' + s)
    }

    string = strs_.join(' ')
    strs_ = []

    strs = string.split('-')

    for (let value of strs) {
      let f = value.charAt(0).toUpperCase()
      let s = value.slice(1)
      strs_.push(f + '' + s)
    }

    return strs_.join('-')
  }

  removeUnwantedFilenameChars(string: string): string {
    console.log('removeUnwantedFilenameChars')
    return string
      .replaceAll('/', '')
      .replaceAll('\\', '')
      .replaceAll(':', '')
      .replaceAll('*', '')
      .replaceAll('?', '')
      .replaceAll('"', '')
      .replaceAll('<', '')
      .replaceAll('>', '')
      .replaceAll('|', '')
  }
}

export default new Utils()
