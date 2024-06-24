<script lang="ts">
  import { onMount } from 'svelte'
  import type { File } from '../../../../shared/models/features/filesupdater.model'
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../../services/api/api-filesupdater.service'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'
  import monaco from '../../services/monaco.service'

  export let data: PageData
  export let show: boolean
  export let action: { action: 'add' } | { action: 'edit'; file: File }
  export let currentPath: string

  let container: HTMLDivElement

  $: path = '' as string
  $: name = '' as string
  $: newName = '' as string
  $: content = '' as string

  $: if (show) update()

  onMount(async () => {})

  $: if (container) {
    monaco.editor.create(container, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: 'plaintext',
      minimap: { enabled: false },
    })
  }

  async function update() {
    if (action.action === 'edit') {
      path = action.file.path
      name = action.file.name
      newName = action.file.name
      content = await fetch(action.file.path + action.file.name).then((res) => res.text())
    } else {
      path = currentPath
      name = ''
      newName = ''
      content = ''
    }
  }

  async function submit() {
    ;(await apiFilesUpdaterService.renameFile(`${path}${name}`, `${path}${newName}`)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        show = false
      }
    })
  }
</script>

<ModalTemplate size={'l'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>{action.action === 'add' ? 'Create a new file' : 'Edit file'}</h2>

    <button class="secondary small right">
      <i class="fa-solid fa-download"></i>&nbsp;&nbsp;Download file
    </button>

    <label for="name" class="name">Files Updater/{path}</label>
    <input type="text" id="name" class="name" placeholder="File name" bind:value={newName} />

    <div bind:this={container} class="container-editor"></div>

    <div class="actions">
      <button class="secondary" on:click={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={newName.replaceAll(' ', '') === ''}>{$l.main.save}</button>
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
  }
</style>
