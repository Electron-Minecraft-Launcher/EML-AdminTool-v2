class Utils {
  /**
   * @param duration Sleep duration in ms.
   */
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

  markdownToHtml(
    string: string,
    br: boolean = true,
    sizes: { h1?: number; h2?: number; h3?: number; h4?: number; p?: number } = { h1: 22, h2: 20, h3: 18, h4: 16, p: 14 }
  ): string {
    return (
      `<style>
        div.md > b:first-child {
          margin-top: 0 !important;
        }
      </style>
      <div class="md" style="font-size: ${sizes.p}px">` +
      string
        .replaceAll(/^#( |&nbsp;|\xa0)(.+)/gm, `<b style="display: block; font-size: ${sizes.h1}px; margin: ${sizes.h1}px 0">$2</b>`)
        .replaceAll(/^##( |&nbsp;|\xa0)(.+)/gm, `<b style="display: block; font-size: ${sizes.h2}px; margin: ${sizes.h1}px 0">$2</b>`)
        .replaceAll(
          /^###( |&nbsp;|\xa0)(.+)/gm,
          `<b style="display: block; font-size: ${sizes.h3}px; font-weight: 600; margin: ${sizes.h1}px 0">$2</b>`
        )
        .replaceAll(
          /^####( |&nbsp;|\xa0)(.+)/gm,
          `<b style="display: block; font-size: ${sizes.h4}px; font-weight: 600; margin: ${sizes.h1}px 0">$2</b>`
        )
        .replaceAll(/\r/gm, '')
        .replaceAll(/^\n+|\n+$/g, '')
        .replaceAll(br ? '\n' : '<br>', '<br>\n')
        .replaceAll(/^\s+|\s+$/g, '')
        .replaceAll(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replaceAll(/\*(.+?)\*/g, '<i>$1</i>')
        .replaceAll(/__(.+?)__/g, '<u>$1</u>')
        .replaceAll(/~~(.+?)~~/g, '<s>$1</s>')
        .replaceAll(/\[(.+)\]\[(.+)\]\((.+)\)/g, '<figure><img src="$3" alt="$1" /><figcaption>$1<p><em>Source : $2</em></p></figcaption></figure>')
        .replaceAll(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="blank_">$1</a>')
        .replaceAll(/^> ((.|\n)+) <$/gm, '<blockquote>$1</blockquote>')
        // .replaceAll(/(\* (|&nbsp;|\xa0)(.+))+/gm, '<ul>$3</ul>')
        .replaceAll(/^\* (.+)$/gm, '<li_dot>$1</li_dot>')
        .replaceAll(/((?:\s*<li_dot>.*?<\/li_dot>)+)/gm, '<ul>$1</ul>')
        .replaceAll(/^(\d+)\. (.+)$/gm, '<li_num>$2</li_num>')
        .replaceAll(/((?:\s*<li_num>.*?<\/li_num>)+)/gm, '<ol>$1</ol>')
        .replaceAll('<li_dot>', '<li>')
        .replaceAll('</li_dot>', '</li>')
        .replaceAll('<li_num>', '<li>')
        .replaceAll('</li_num>', '</li>')
        .replaceAll(' !', '&nbsp;!')
        .replaceAll(' ?', '&nbsp;?')
        .replaceAll(' :', '&nbsp;:')
        .replaceAll(' ;', '&nbsp;;')
        // replace <br>\n repeating 3 times or more by one single <br>\n only
        .replaceAll(/(<br>\n){3,}/g, '<br>\n<br>\n') +
      '</div>'
    )
  }
}

export default new Utils()
















