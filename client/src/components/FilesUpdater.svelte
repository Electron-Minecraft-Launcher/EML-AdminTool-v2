<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'
  import type { File as File_ } from '../../../shared/models/features/filesupdater.model'
  import type { PageData } from '../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../services/api/api-filesupdater.service'
  import { l } from '../services/store'
  import LoadingSplash from './layouts/LoadingSplash.svelte'
  import RenameFileModal from './modals/RenameFileModal.svelte'
  import { slide } from 'svelte/transition'
  import CreateFolderModal from './modals/CreateFolderModal.svelte'
  import AddEditFileModal from './modals/AddEditFileModal.svelte'

  export let currentPath: string
  export let data: PageData
  export let ready: boolean

  let showRenameModal = false
  let showCreateFolderModal = false
  let showAddEditFileModal = false
  let addEditFileAction: { action: 'add' } | { action: 'edit'; file: File_ } = { action: 'add' }

  let addElementDropdownOpen = false

  let filesUpload: HTMLInputElement
  let folderUpload: HTMLInputElement
  let currentFilesAndFolders: File_[] = []
  let selectedItems: File_[] = []

  afterUpdate(() => {
    currentFiles = currentFilesAndFolders.filter((file) => file.type !== 'FOLDER')
    currentFolders = currentFilesAndFolders.filter((file) => file.type === 'FOLDER')
    currentFilesAndFoldersSorted = [...currentFolders, ...currentFiles]
  })

  onMount(() => {
    folderUpload.setAttribute('directory', '')
    folderUpload.setAttribute('webkitdirectory', '')
    folderUpload.setAttribute('mozdirectory', '')
  })

  $: if (data.files || currentPath) {
    currentFilesAndFolders = data.files.filter((file) => file.path === currentPath)
  }

  $: currentFiles = currentFilesAndFolders.filter((file) => file.type !== 'FOLDER')
  $: currentFolders = currentFilesAndFolders.filter((file) => file.type === 'FOLDER')
  $: currentFilesAndFoldersSorted = [...currentFolders, ...currentFiles]

  async function uploadFolder() {
    folderUpload.click()

    await new Promise((resolve) => {
      folderUpload.addEventListener('change', resolve, { once: true })
    })

    if (!folderUpload.files) return
    let files: File[] = []

    ready = false

    for (let i = 0; i < folderUpload.files.length; i++) {
      files.push(folderUpload.files.item(i)!)
    }

    ;(await apiFilesUpdaterService.uploadFiles(currentPath, files)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        ready = true
      }
    })

    folderUpload.value = ''
  }

  async function uploadFiles() {
    filesUpload.click()

    await new Promise((resolve) => {
      filesUpload.addEventListener('change', resolve, { once: true })
    })

    if (!filesUpload.files) return
    let files: File[] = []

    ready = false

    for (let i = 0; i < filesUpload.files.length; i++) {
      files.push(filesUpload.files.item(i)!)
    }

    ;(await apiFilesUpdaterService.uploadFiles(currentPath, files)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        ready = true
      }
    })

    filesUpload.value = ''
  }

  async function open(file: File_) {
    const readable = ['txt', 'md', 'json', 'yaml', 'yml', 'xml', 'html', 'css', 'js', 'ts', 'sql', 'sh', 'py', 'config', 'ini', 'properties']

    if (file.type === 'FOLDER') {
      currentPath = `${file.path}${file.name}/`
    } else if (file.name.split('.').length > 1 && readable.includes(file.name.split('.').slice(-1)[0])) {
      addEditFileAction = { action: 'edit', file }
      showAddEditFileModal = true
    } else {
      download()
    }
  }

  async function download() {
    if (selectedItems.length !== 1) return
    try {
      const file = selectedItems[0]
      const response = await fetch(file.url)
      if (!response.ok) throw new Error('Réponse réseau non ok.')

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
      selectedItems = [file]
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error)
    }
  }

  async function deleteItems() {
    if (confirm('Are you sure you want to delete these files/folders? Folders may contains subfolders.') === false) return
    ready = false
    const paths = selectedItems.map((file) => `${file.path}${file.name}`)
    ;(await apiFilesUpdaterService.deleteFiles(paths)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        selectedItems = []
        currentFilesAndFolders = data.files.filter((file) => file.path === currentPath)
        ready = true
      }
    })
  }

  function select(e: MouseEvent, i: number) {
    if (e.ctrlKey) {
      if (selectedItems.includes(currentFilesAndFoldersSorted[i])) {
        selectedItems = selectedItems.filter((file) => file !== currentFilesAndFoldersSorted[i])
      } else {
        selectedItems = [...selectedItems, currentFilesAndFoldersSorted[i]]
      }
    } else if (e.shiftKey) {
      let start = currentFilesAndFoldersSorted.indexOf(selectedItems[0])
      let end = i
      if (start > end) {
        let temp = start
        start = end
        end = temp
      }
      selectedItems = currentFilesAndFoldersSorted.slice(start, end + 1)
    } else {
      selectedItems = [currentFilesAndFoldersSorted[i]]
    }
  }

  function icon(file: File_) {
    if (file.type === 'FOLDER') return 'fa-solid fa-folder'
    switch (file.name.split('.').slice(-1)[0]) {
      case 'pdf':
        return 'fa-solid fa-file-pdf'
      case 'txt':
        return 'fa-solid fa-file-lines'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return 'fa-solid fa-image'
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'ogg':
      case 'm4a':
        return 'fa-solid fa-music'
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
      case 'wmv':
      case 'flv':
        return 'fa-regular fa-film'
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return 'fa-solid fa-file-zipper'
      case 'html':
      case 'xml':
      case 'json':
      case 'yaml':
      case 'yml':
      case 'properties':
      case 'config':
        return 'fa-solid fa-code'
      case 'jar':
        return 'fa-brands fa-java'
      case 'py':
        return 'fa-brands fa-python'
      case 'md':
        return 'fa-brands fa-markdown'
      case 'doc':
      case 'docx':
      case 'odt':
      case 'rtf':
        return 'fa-solid fa-file-word'
      case 'xls':
      case 'xlsx':
      case 'ods':
      case 'csv':
        return 'fa-solid fa-file-excel'
      case 'ppt':
      case 'pptx':
      case 'odp':
        return 'fa-solid fa-file-powerpoint'
      case 'exe':
      case 'msi':
      case 'ssh':
      case 'sh':
      case 'bat':
      case 'cmd':
      case 'ps1':
        return 'fa-solid fa-terminal'
      default:
        return 'fa-solid fa-file'
    }
  }

  function size(file: File_) {
    if (file.type === 'FOLDER') return ''
    const b = $l.dashboard.filesUpdater.b
    file.size = file.size || 0
    if (file.size < 1000) {
      return `${file.size} ${b}`
    } else if (file.size < 1000000) {
      return `${(file.size / 1000).toFixed(2)} K${b}`
    } else if (file.size < 2000000000) {
      return `${(file.size / 1000000).toFixed(2)} M${b}`
    } else {
      return `${(file.size / 1000000000).toFixed(2)} G${b}`
    }
  }
</script>

<svelte:body
  on:click={(e) => {
    // @ts-ignore
    if (selectedItems && e.target && !e.target.closest('.explorer tbody tr') && !e.target.closest('button.small')) {
      selectedItems = []
    }
    // @ts-ignore
    if (addElementDropdownOpen && e.target && !e.target.closest('button.add')) {
      addElementDropdownOpen = false
    }
  }}
/>

<div class="explorer">
  {#if !ready}
    <LoadingSplash transparent></LoadingSplash>
  {/if}

  <button class="primary small add" style="margin-right: 30px" on:click={() => (addElementDropdownOpen = !addElementDropdownOpen)}>
    <i class="fa-solid fa-plus" />&nbsp;&nbsp;New elements
  </button>

  <button
    class="secondary small"
    disabled={selectedItems.length !== 1 || (selectedItems[0] && selectedItems[0].type === 'FOLDER')}
    on:click={download}
  >
    <i class="fa-solid fa-download"></i>&nbsp;&nbsp;Download
  </button>
  <button class="secondary small" disabled={selectedItems.length !== 1} on:click={() => (showRenameModal = true)}>
    <i class="fa-solid fa-i-cursor"></i>&nbsp;&nbsp;Rename
  </button>
  <button class="secondary small" disabled={selectedItems.length === 0} on:click={deleteItems}>
    <i class="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete
  </button>

  {#if addElementDropdownOpen}
    <div class="add-element-dropdown" transition:slide={{ duration: 200 }}>
      <button on:click={uploadFolder}><i class="fap-fix fa-solid fap-folder-arrow-up"></i>&nbsp;&nbsp;Upload folder</button>
      <button on:click={uploadFiles}><i class="fap-fix fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Upload files</button>
      <hr />
      <button on:click={() => (showCreateFolderModal = true)}><i class="fap-fix fa-solid fa-folder-plus"></i>&nbsp;&nbsp;Create folder</button>
      <button
        on:click={() => {
          addEditFileAction = { action: 'add' }
          showAddEditFileModal = true
        }}><i class="fap-fix fa-solid fap-file-plus"></i>&nbsp;&nbsp;Create file</button
      >
    </div>
  {/if}

  <table>
    <thead>
      <tr>
        <th class="icon"></th>
        <th class="name">{$l.main.name}</th>
        <th class="size">{$l.dashboard.filesUpdater.size}</th>
      </tr>
    </thead>
    <tbody>
      {#each currentFilesAndFoldersSorted as file, i}
        <tr class:focused={selectedItems.includes(file)} on:click={(e) => select(e, i)} on:dblclick={() => open(file)}>
          <td class="icon"><i class={icon(file)}></i></td>
          <td class="name">{file.name}</td>
          <td class="size">{size(file)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if currentFilesAndFolders.length === 0}
    <p class="nothing">No files or folders</p>
  {/if}
</div>

<input type="file" name="files[]" multiple bind:this={filesUpload} style="display: none" />
<input type="file" name="files[]" multiple bind:this={folderUpload} style="display: none" />

<RenameFileModal bind:data bind:selectedItems bind:show={showRenameModal}></RenameFileModal>
<CreateFolderModal bind:data bind:currentPath bind:show={showCreateFolderModal}></CreateFolderModal>
<AddEditFileModal bind:data bind:currentPath bind:action={addEditFileAction} bind:show={showAddEditFileModal}></AddEditFileModal>

<style lang="scss">
  .fap-fix {
    width: 14px;
    text-align: center;
  }

  .fap-folder-arrow-up {
    width: 16px;

    &::before {
      content: url('../assets/images/fa-solid fa-folder-arrow-up.svg');
      position: absolute;
      top: 15px;
      left: 15px;
      width: 13.34px;
      height: 14px;
    }
  }

  .fap-file-plus {
    width: 16px;

    &::before {
      content: url('../assets/images/fa-solid fa-file-plus.svg');
      position: absolute;
      top: 14px;
      left: 16px;
      width: 10px;
      height: 13.2;
    }
  }

  div.add-element-dropdown {
    overflow-y: hidden;
    border-radius: 5px;
    transition:
      opacity 0.2s,
      height 0.2s ease,
      display 0s;
    background: white;
    padding: 10px;
    border: 1px solid var(--border-color);
    z-index: 100;
    position: absolute;
    width: 178px;
    top: 60px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

    hr {
      margin: 10px 0;
      border: 0;
      border-top: 1px solid var(--border-color);
    }

    button {
      width: 100%;
      position: relative;
      text-align: left;
      font-family: 'Poppins';
      background: none;

      &:nth-of-type(1) {
        margin-top: 0;
      }

      &:hover {
        background: #eeeeee;
      }
    }
  }

  div.explorer {
    min-height: 270px;
    position: relative;
    margin-top: 0;

    p.nothing {
      text-align: center;
      margin-top: 20px;
      color: #606060;
    }
  }

  button.small {
    width: auto;
    margin-top: 10px;
    display: inline-block;
    margin-right: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    user-select: none;
    margin-top: 30px;

    th {
      text-align: left;
      font-weight: 600;
      padding: 10px;

      &.icon {
        padding-left: 10px;
        width: 25px;
        text-align: center;
      }

      &.name {
        padding-left: 10px;
        width: calc(87% - 25px);
      }

      &.size {
        padding-right: 10px;
        width: calc(13%);
      }
    }

    tbody tr {
      transition: background-color 0.2s;
      cursor: pointer;

      &:hover {
        background-color: #eeeeee;
      }

      &.focused {
        background-color: #f5f5f5;

        &:hover {
          background-color: #eeeeee;
        }
      }
    }

    td {
      padding: 7px 10px;

      &.icon {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        text-align: center;
        width: 25px;
      }

      &.name {
        padding-left: 10px;
        padding-left: 10px;
        width: calc(87% - 25px);
      }

      &.size {
        text-align: right;
        color: #606060;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }
</style>
