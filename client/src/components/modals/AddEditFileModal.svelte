<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import type { File } from '../../../../shared/types/features/file'
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../../services/api/api-filesupdater.service'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'
  import monaco from '../../services/monaco.service'
  import utils from '../../services/utils'
  import MonacoEditor from '../MonacoEditor.svelte'

  interface Props {
    data: PageData
    dataFiles: PageData['files']
    show: boolean
    action: { action: 'add' } | { action: 'edit'; file: File }
    currentPath: string
  }

  let { data = $bindable(), dataFiles = $bindable(), show = $bindable(), action = $bindable(), currentPath = $bindable() }: Props = $props()

  let path: string = $state('')
  let name: string = $state('')
  let newName: string = $state('')
  let content: string = $state('')
  let language: string = $state('plaintext')

  // let container: HTMLDivElement | undefined = $state()
  // let editor: monaco.editor.IStandaloneCodeEditor | undefined = $state()
  // let model: monaco.editor.ITextModel | undefined = $state()

  // onDestroy(() => {
  //   console.log('destroy')
  //   monaco?.editor.getModels().forEach((model) => model.dispose())
  //   editor?.dispose()
  //   model?.dispose()
  //   editor = undefined
  // })

  async function update() {
    if (action.action === 'edit') {
      path = action.file.path
      name = action.file.name
      newName = action.file.name
      content = await fetch(action.file.url).then((res) => res.text())
    } else {
      path = currentPath
      name = ''
      newName = ''
      content = ''
    }

    // if (!editor && !container) {
    //   container = document.getElementById('container-editor') as HTMLDivElement
    //   editor = monaco.editor.create(container!, { minimap: { enabled: false } })
    //   model = monaco.editor.createModel(content, 'plaintext')
    //   editor.setModel(model!)
    // } else {
    //   model!.setValue(content)
    // }
  }

  async function download() {
    try {
      newName = utils.removeUnwantedFilenameChars(newName)
      // content = editor!.getValue()
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

  async function submit(e: Event | null, close: boolean = true) {
    e?.preventDefault()
    if (action.action === 'edit') {
      newName = utils.removeUnwantedFilenameChars(newName)
      ;(await apiFilesUpdaterService.renameFile(`${path}${name}`, `${path}${newName}`)).subscribe({})
      name = newName
    }
    // let finalContent = editor!.getValue()
    const blob = new Blob([content], { type: 'text/plain' })
    const file = new File([blob], newName, { type: 'text/plain' })
    ;(await apiFilesUpdaterService.uploadFiles(`${path}`, [file])).subscribe({
      next: (res) => {
        data.files = res.body.data!
        dataFiles = res.body.data!
        if (close) show = false
      }
    })
  }

  $effect(() => {
    if (show) update()
  })

  $effect(() => {
    if (newName) {
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
    }
  })
</script>

<svelte:body
  onkeydown={(e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      submit(null, false)
    }
  }}
/>

<ModalTemplate size={'l'} bind:show>
  <form>
    <h2>{action.action === 'add' ? 'Create a new file' : 'Edit the file'}</h2>

    <button class="secondary small right" type="button" onclick={download}>
      <i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;Download file
    </button>

    <label for="name" class="name">Files Updater/{path}</label>
    <input
      type="text"
      id="name"
      class="name"
      placeholder="File name"
      bind:value={newName}
      onkeyup={() => (newName = utils.removeUnwantedFilenameChars(newName))}
    />

    <!-- <div ></div> -->
    <MonacoEditor bind:content {language} height="calc(100vh - 177px - 106px - 51px - 63px)" {submit} {newName} bind:show></MonacoEditor>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

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

  // div.container-editor {
  //   height: calc(100vh - 177px - 106px - 30px - 63px);
  //   margin-top: 20px;
  //   border: 1px solid var(--border-color2);
  //   border-radius: 5px;
  // }
</style>
