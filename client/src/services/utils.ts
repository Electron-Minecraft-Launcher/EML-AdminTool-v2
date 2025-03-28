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

  // markdownToHtml(
  //   string: string,
  //   br: boolean = true,
  //   sizes: { h1?: number; h2?: number; h3?: number; h4?: number; p?: number } = { h1: 22, h2: 20, h3: 18, h4: 16, p: 14 }
  // ): string {
  //   return (
  //     `<style>
  //       div.md > b:first-child {
  //         margin-top: 0 !important;
  //       }

  //       code {
  //         background-color: #f4f4f4;
  //         border-radius: 5px;
  //         padding: 0 5px;
  //         font-family: 'Consolas', monospace;
  //       }

  //       b.title {
  //         display: block;
  //       }

  //       b.title.h1 {
  //         font-size: ${sizes.h1}px;
  //         margin: ${sizes.h1}px 0;
  //       }

  //       b.title.h2 {
  //         font-size: ${sizes.h2}px;
  //         margin: ${sizes.h2}px 0;
  //       }

  //       b.title.h3 {
  //         font-size: ${sizes.h3}px;
  //         font-weight: 600;
  //         margin: ${sizes.h3}px 0;
  //       }

  //       b.title.h4 {
  //         font-size: ${sizes.h4}px;
  //         font-weight: 600;
  //         margin: ${sizes.h4}px 0;
  //       }
  //     </style>
  //     <div class="md" style="font-size: ${sizes.p}px">` +
  //     string
  //       .replaceAll(/^#( |&nbsp;|\xa0)(.+)/gm, `<b class="title h1">$2</b>`)
  //       .replaceAll(/^##( |&nbsp;|\xa0)(.+)/gm, `<b class="title h2">$2</b>`)
  //       .replaceAll(/^###( |&nbsp;|\xa0)(.+)/gm, `<b class="title h3">$2</b>`)
  //       .replaceAll(/^####( |&nbsp;|\xa0)(.+)/gm, `<b class="title h4">$2</b>`)
  //       .replaceAll(/\r/gm, '')
  //       .replaceAll(/^\n+|\n+$/g, '')
  //       .replaceAll(br ? '\n' : '<br>', '<br>\n')
  //       .replaceAll(/^\s+|\s+$/g, '')
  //       .replaceAll(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  //       .replaceAll(/\*(.+?)\*/g, '<i>$1</i>')
  //       .replaceAll(/__(.+?)__/g, '<u>$1</u>')
  //       .replaceAll(/~~(.+?)~~/g, '<s>$1</s>')
  //       .replaceAll(/`(.+?)`/g, '<code>$1</code>')
  //       .replaceAll(/\[(.+)\]\[(.+)\]\((.+)\)/g, '<figure><img src="$3" alt="$1" /><figcaption>$1<p><em>Source : $2</em></p></figcaption></figure>')
  //       .replaceAll(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="blank_">$1</a>')
  //       .replaceAll(/^> ((.|\n)+) <$/gm, '<blockquote>$1</blockquote>')

  //       .replaceAll(/^\* (.+)$/gm, '<li_dot>$1</li_dot>')
  //       .replaceAll(/((?:\s*<li_dot>.*?<\/li_dot>)+)/gm, '<ul>$1</ul>')

  //       .replaceAll(/^(\d+)\. (.+)$/gm, '<li_num>$2</li_num>')
  //       .replaceAll(/((?:\s*<li_num>.*?<\/li_num>)+)/gm, '<ol>$1</ol>')

  //       .replaceAll('<li_dot>', '<li>')
  //       .replaceAll('</li_dot>', '</li>')
  //       .replaceAll('<li_num>', '<li>')
  //       .replaceAll('</li_num>', '</li>')

  //       .replaceAll(' !', '&nbsp;!')
  //       .replaceAll(' ?', '&nbsp;?')
  //       .replaceAll(' :', '&nbsp;:')
  //       .replaceAll(' ;', '&nbsp;;')
  //       .replaceAll(/(\n){2,}/g, '<br>\n<br>\n')
  //       .replace(/(^|<br\/?>)([^<]+?)(?=<br\/?>|$)/g, (match, before, text) => {
  //         return before + '<p>' + text.trim() + '</p>'
  //       })
  //       .replaceAll(/<br>(\n)*<p><\/p>(\n)*<br>/gm, '')
  //     + '</div>'
  //   )
  // }

  markdownToHtml(
    md: string,
    sizes: { h1?: number; h2?: number; h3?: number; h4?: number; p?: number } = { h1: 22, h2: 20, h3: 18, h4: 16, p: 14 }
  ): string {
    const css = `<style>
      div.md p {
        font-size: ${sizes.p}px;
        margin: ${sizes.p}px 0;
      }

      div.md > *:first-child {
        margin-top: 0 !important;
      }

      div.md > *:last-child {
        margin-bottom: 0 !important;
      }

      div.md p.md-title-h1 {
        font-size: ${sizes.h1}px;
        margin: ${sizes.h1}px 0;
        font-weight: 800;
        }
        
      div.md p.md-title-h2 {
        font-size: ${sizes.h2}px;
        margin: ${sizes.h2}px 0;
        font-weight: 800;
      }

      div.md p.md-title-h3 {
        font-size: ${sizes.h3}px;
        margin: ${sizes.h3}px 0;
        font-weight: 600;
      }

      div.md p.md-title-h4 {
        font-size: ${sizes.h4}px;
        margin: ${sizes.h4}px 0;
        font-weight: 600;
      }

      div.md b {
        font-weight: 600;
      }

      div.md code {
        background-color: #f4f4f4;
        border-radius: 5px;
        padding: 0 5px;
        font-family: 'Consolas', monospace;
      }

      div.md blockquote {
        font-size: ${sizes.p}px;
        margin: ${sizes.p}px 0;
        padding-left: 20px;
        border-left: 5px solid #ccc;
        color: #444;
      }

      div.md blockquote.note {
        border-left: 5px solid #0969da;
        color: black;
      }

      div.md blockquote.note b {
        color: #0969da;
        display: block;
        margin-bottom: 5px;
      }

      div.md blockquote.tip {
        border-left: 5px solid #178131;
        color: black;
      }

      div.md blockquote.tip b {
        color: #178131;
        display: block;
        margin-bottom: 5px;
      }

      div.md blockquote.important {
        border-left: 5px solid #7e4dde;
        color: black;
      }

      div.md blockquote.important b {
        color: #7e4dde;
        display: block;
        margin-bottom: 5px;
      }

      div.md blockquote.warning {
        border-left: 5px solid #9d6500;
        color: black;
      }

      div.md blockquote.warning b {
        color: #9d6500;
        display: block;
        margin-bottom: 5px;
      }

      div.md blockquote.caution {
        border-left: 5px solid #cd202e;
        color: black;
      }

      div.md blockquote.caution b {
        color: #cd202e;
        display: block;
        margin-bottom: 5px;
      }

      div.md pre {
        font-size: ${sizes.p}px;
        margin: ${sizes.p}px 0;
        background-color: #f4f4f4;
        border-radius: 5px;
        padding: 10px;
        font-family: 'Consolas', monospace;
      }

      div.md figure {
        margin: ${sizes.p}px 0;
        max-width: 100%;
        line-height: 0;
      }

      div.md figure img {
        max-width: 100%;
        border-radius: 5px;
      }

      div.md ul, div.md ol {
        margin: ${sizes.p}px 10px;
        padding-left: 20px;
      }

      div.md li {
        font-size: ${sizes.p}px;
        margin: 0;
        padding-left: 5px;
      }
    </style>`
    let html = md

    html = html.trim()
    html = html.replaceAll(/\r/gm, '')
    html = html
      .split(/\n{2,}/gm)
      .map((p) => `<p>${p}</p>`)
      .map((p) => p.replaceAll(/<p># (.+)<\/p>/gm, '<p class="md-title-h1">$1</p>'))
      .map((p) => p.replaceAll(/<p>## (.+)<\/p>/gm, '<p class="md-title-h2">$1</p>'))
      .map((p) => p.replaceAll(/<p>### (.+)<\/p>/gm, '<p class="md-title-h3">$1</p>'))
      .map((p) => p.replaceAll(/<p>#### (.+)<\/p>/gm, '<p class="md-title-h4">$1</p>'))
      .map((p) => p.replaceAll(/\*\*(.+?)\*\*/g, '<b>$1</b>'))
      .map((p) => p.replaceAll(/\*(.+?)\*/g, '<i>$1</i>'))
      .map((p) => p.replaceAll(/_(.+?)_/g, '<i>$1</i>'))
      .map((p) => p.replaceAll(/__(.+?)__/g, '<u>$1</u>'))
      .map((p) => p.replaceAll(/~~(.+?)~~/g, '<s>$1</s>'))
      .map((p) => p.replaceAll(/<p>```([a-zA-Z1-9])*((.|\n)*)```<\/p>$/gm, '<pre>$2</pre>'))
      .map((p) => p.replaceAll(/`(.+?)`/g, '<code>$1</code>'))
      .map((p) => p.replaceAll(/\!\[(.+?)\]\((.+?)\)/g, '<figure><img src="$2" alt="$1" /></figure>'))
      .map((p) => p.replaceAll(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="blank_">$1</a>'))
      .map((p) => p.replaceAll(/^<p><figure(.*?|\n*)/gm, '<figure$1'))
      .map((p) => p.replaceAll(/<\/figure><\/p>$/gm, '</figure>'))
      .map((p) =>
        p.replaceAll(
          /<p>> \[\!NOTE\]\n> (.*)<\/p>/gm,
          '<blockquote class="note"><b><i class="fa-solid fa-circle-info"></i>&nbsp;&nbsp;Note</b>$1</blockquote>'
        )
      )
      .map((p) =>
        p.replaceAll(
          /<p>> \[\!TIP\]\n> (.*)<\/p>/gm,
          '<blockquote class="tip"><b><i class="fa-solid fa-lightbulb"></i>&nbsp;&nbsp;Tip</b>$1</blockquote>'
        )
      )
      .map((p) =>
        p.replaceAll(
          /<p>> \[\!IMPORTANT\]\n> (.*)<\/p>/gm,
          '<blockquote class="important"><b><i class="fa-solid fa-bolt"></i>&nbsp;&nbsp;Important</b>$1</blockquote>'
        )
      )
      .map((p) =>
        p.replaceAll(
          /<p>> \[\!WARNING\]\n> (.*)<\/p>/gm,
          '<blockquote class="warning"><b><i class="fa-solid fa-triangle-exclamation"></i>&nbsp;&nbsp;Warning</b>$1</blockquote>'
        )
      )
      .map((p) =>
        p.replaceAll(
          /<p>> \[\!CAUTION\]\n> (.*)<\/p>/gm,
          '<blockquote class="caution"><b><i class="fa-solid fa-circle-exclamation"></i></i>&nbsp;&nbsp;Caution</b>$1</blockquote>'
        )
      )
      .map((p) => p.replaceAll(/<p>> ((.|\n)+)<\/p>$/gm, '<blockquote>$1</blockquote>').replaceAll('\n>', ''))
      .map((p) =>
        p
          .replaceAll(/<p>\* (.+)$/gm, '<p><li_dot>$1</li_dot>')
          .replaceAll(/\* (.+)/gm, '<li_dot>$1</li_dot>')
          .replaceAll(/((?:\s*<li_dot>.*?<\/li_dot>)+)/gm, '<ul>$1</ul>')
      )
      .map((p) =>
        p
          .replaceAll(/<p>(\d+)\. (.+)$/gm, '<p><li_num>$2</li_num>')
          .replaceAll(/^(\d+)\. (.+)$/gm, '<li_num>$2</li_num>')
          .replaceAll(/((?:\s*<li_num>.*?<\/li_num>)+)/gm, '<ol>$1</ol>')
      )
      .map((p) => p.replaceAll('<li_dot>', '<li>').replaceAll('</li_dot>', '</li>').replaceAll('<li_num>', '<li>').replaceAll('</li_num>', '</li>'))
      .join('\n')

    return css + '<div class="md">' + html + '</div>'
  }
}

export default new Utils()
