<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import type { File } from '../../../../shared/models/features/filesupdater.model'
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../../services/api/api-filesupdater.service'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'
  import monaco from '../../services/monaco.service'
  import utils from '../../services/utils'

  export let data: PageData
  export let show: boolean
  export let action: { action: 'add' } | { action: 'edit'; file: File }
  export let currentPath: string

  let container: HTMLDivElement
  let editor: monaco.editor.IStandaloneCodeEditor
  let model: monaco.editor.ITextModel

  $: path = '' as string
  $: name = '' as string
  $: newName = '' as string
  $: content = '' as string

  $: if (show) update()

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose())
    editor?.dispose()
  })

  $: if (container) {
    if (editor) {
      editor.dispose()
      model?.dispose()
    }

    editor = monaco.editor.create(container, { minimap: { enabled: false } })
    model = monaco.editor.createModel(content, 'plaintext')
    editor.setModel(model)
  }

  $: if (container && editor && newName) {
    let language = ''
    const ext = newName.split('.').pop()
    switch (ext) {
      case 'js':
      case 'jsx':
        language = 'javascript'
        break
      case 'ts':
      case 'tsx':
        language = 'typescript'
        break
      case 'html':
        language = 'html'
        break
      case 'css':
        language = 'css'
        break
      case 'xml':
        language = 'xml'
        break
      case 'json':
        language = 'json'
        break
      case 'yaml':
      case 'yml':
        language = 'yaml'
        break
      case 'md':
        language = 'markdown'
        break
      case 'sql':
        language = 'sql'
        break
      case 'sh':
        language = 'shell'
        break
      case 'py':
        language = 'python'
        break
      default:
        language = 'plaintext'
        break
    }
    monaco.editor.setModelLanguage(model, language)
  }

  async function update() {
    if (action.action === 'edit') {
      path = action.file.path
      name = action.file.name
      newName = action.file.name
      content = ''
      content = await fetch(action.file.url).then((res) => res.text())
    } else {
      path = currentPath
      name = ''
      newName = ''
      content = ''
    }
  }

  async function download() {
    try {
      newName = utils.removeUnwantedFilenameChars(newName)
      content = editor.getValue()
      const blob = new Blob([content], { type: 'text/plain' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = newName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error)
    }
  }

  async function submit(e: SubmitEvent | null, close: boolean = true) {
    if (action.action === 'edit') {
      newName = utils.removeUnwantedFilenameChars(newName)
      ;(await apiFilesUpdaterService.renameFile(`${path}${name}`, `${path}${newName}`)).subscribe({})
      name = newName
    }
    let content = editor.getValue()
    const blob = new Blob([content], { type: 'text/plain' })
    const file = new File([blob], newName, { type: 'text/plain' })
    ;(await apiFilesUpdaterService.uploadFiles(`${path}`, [file])).subscribe({
      next: (res) => {
        data.files = res.body.data!
        if (close) show = false
      }
    })
  }
</script>

<svelte:body
  on:keydown={(e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      submit(null, false)
    }
  }}
/>

<ModalTemplate size={'l'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>{action.action === 'add' ? 'Create a new file' : 'Edit the file'}</h2>

    <button class="secondary small right" type="button"  on:click={download}>
      <i class="fa-solid fa-download"></i>&nbsp;&nbsp;Download file
    </button>

    <label for="name" class="name">Files Updater/{path}</label>
    <input
      type="text"
      id="name"
      class="name"
      placeholder="File name"
      bind:value={newName}
      on:keyup={() => (newName = utils.removeUnwantedFilenameChars(newName))}
    />

    <div bind:this={container} class="container-editor"></div>

    <div class="actions">
      <button class="secondary" on:click={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={newName.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  button.right {
    opacity: 1;
  }

  label.name {
    margin-top: 5px;
    margin-right: 5px;
    display: inline-block !important;
  }

  input.name {
    display: inline-block !important;
    width: 300px;
    margin-top: 0;
  }

  div.container-editor {
    height: calc(100vh - 177px - 106px - 30px - 69px);
    margin-top: 30px;
    border: 1px solid var(--border-color2);
    border-radius: 5px;
  }
</style>
