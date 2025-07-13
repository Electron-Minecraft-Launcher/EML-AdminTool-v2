<script lang="ts">
  import { onMount } from 'svelte'
  import type { File as File_ } from '$lib/utils/types'
  import { l } from '$lib/stores/language'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import { slide } from 'svelte/transition'
  import { getFileIcon } from '$lib/utils/utils'
  import { readableFiles } from '$lib/utils/files'
  import RenameFileModal from '../modals/RenameFileModal.svelte'

  interface Props {
    currentPath: string
    files: File_[]
    ready: boolean
  }

  let { currentPath = $bindable(), files = $bindable(), ready = $bindable() }: Props = $props()

  let showRenameModal = $state(false)
  let showCreateFolderModal = $state(false)
  let showAddEditFileModal = $state(false)
  let addEditFileAction: { action: 'add' } | { action: 'edit'; file: File_ } = $state({ action: 'add' })

  let addElementDropdownOpen = $state(false)

  let filesUpload: HTMLInputElement
  let folderUpload: HTMLInputElement
  let selectedItems: File_[] = $state([])

  let currentFilesAndFolders: File_[] = $derived(files.filter((file) => file.path === currentPath))
  let currentFolders = $derived(currentFilesAndFolders.filter((file) => file.type === 'FOLDER'))
  let currentFiles = $derived(currentFilesAndFolders.filter((file) => file.type !== 'FOLDER'))
  let currentFilesAndFoldersSorted = $derived([...currentFolders, ...currentFiles])

  onMount(() => {
    folderUpload.setAttribute('directory', '')
    folderUpload.setAttribute('webkitdirectory', '')
    folderUpload.setAttribute('mozdirectory', '')
  })

  async function uploadItems(e: Event) {
    ready = false
    const target = e.target as HTMLInputElement
    if (!target.files || target.files.length === 0) return

    const formData = new FormData()
    formData.append('current-path', currentPath)
    for (const file of target.files || []) {
      formData.append('files', file)
    }

    try {
      const response = await fetch('/api/files-updater', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Failed to upload files')
      files = (await response.json()).files as File_[]
    } catch (err) {
      // TODO
    }

    folderUpload.value = ''
    folderUpload.files = null
    filesUpload.value = ''
    filesUpload.files = null
    ready = true
  }

  async function openItem(file: File_) {
    if (!file) return

    if (file.type === 'FOLDER') {
      currentPath = `${file.path}${file.name}/`
      selectedItems = []
    } else if (file.name.split('.').length > 1 && readableFiles.includes(file.name.split('.').slice(-1)[0])) {
      addEditFileAction = { action: 'edit', file }
      showAddEditFileModal = true
    } else {
      downloadItem()
    }
  }

  async function downloadItem() {
    if (selectedItems.length !== 1) return
    try {
      const file = selectedItems[0]
      const response = await fetch(file.url)
      if (!response.ok) throw new Error('Failed to download file')

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
      // TODO
      // getData()
    }
  }

  async function deleteItems() {
    if (selectedItems.length === 0) return
    if (!confirm('Are you sure you want to delete these files/folders? Folders may contains subfolders.')) return
    ready = false

    const formData = new FormData()
    for (const file of selectedItems) {
      formData.append('paths', `${file.path}${file.name}`)
    }

    try {
      const response = await fetch('/api/files-updater', { method: 'DELETE', body: formData })
      if (!response.ok) throw new Error('Failed to delete files')
      files = (await response.json()).files as File_[]
    } catch (err) {
      // TODO
    }

    selectedItems = []
    ready = true
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

  function size(file: File_) {
    if (file.type === 'FOLDER') return ''
    const b = $l.dashboard.filesUpdater.b
    const fileSize = file.size || 0
    if (fileSize < 1000) {
      return `${file.size} ${b}`
    } else if (fileSize < 1000000) {
      return `${(fileSize / 1000).toFixed(2)} K${b}`
    } else if (fileSize < 2000000000) {
      return `${(fileSize / 1000000).toFixed(2)} M${b}`
    } else {
      return `${(fileSize / 1000000000).toFixed(2)} G${b}`
    }
  }
</script>

<svelte:body
  onclick={(e) => {
    if (
      selectedItems &&
      e.target &&
      // @ts-ignore
      !e.target.closest('.explorer tbody tr') &&
      // @ts-ignore
      !e.target.closest('button.small') &&
      !showAddEditFileModal &&
      !showRenameModal &&
      !showCreateFolderModal
    ) {
      selectedItems = []
    }
    // @ts-ignore
    if (addElementDropdownOpen && e.target && !e.target.closest('button.add')) {
      addElementDropdownOpen = false
    }
  }}
  onkeydown={(e) => {
    if (e.key === 'Escape' && (showAddEditFileModal || showRenameModal || showCreateFolderModal)) {
      selectedItems = []
    }
    if (e.key === 'Delete' && !showAddEditFileModal && !showRenameModal && !showCreateFolderModal) {
      deleteItems()
    }
    if (e.key === 'Enter' && !showAddEditFileModal && !showRenameModal && !showCreateFolderModal) {
      openItem(selectedItems[0])
    }
  }}
/>

{#if showRenameModal}
  <RenameFileModal bind:files bind:selectedItems bind:show={showRenameModal} />
{/if}

<div class="explorer">
  {#if !ready}
    <LoadingSplash transparent />
  {/if}

  <button class="primary small add" style="margin-right: 30px" onclick={() => (addElementDropdownOpen = !addElementDropdownOpen)}>
    <i class="fa-solid fa-plus"></i>&nbsp;&nbsp;New items
  </button>

  <button
    class="secondary small"
    disabled={selectedItems.length !== 1 || (selectedItems[0] && selectedItems[0].type === 'FOLDER')}
    onclick={downloadItem}
  >
    <i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;Download
  </button>
  <button
    class="secondary small"
    disabled={selectedItems.length !== 1}
    onclick={() => {
      showRenameModal = true
    }}
  >
    <i class="fa-solid fa-i-cursor"></i>&nbsp;&nbsp;Rename
  </button>
  <button class="secondary small" disabled={selectedItems.length === 0} onclick={deleteItems}>
    <i class="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete
  </button>

  {#if addElementDropdownOpen}
    <div class="add-element-dropdown" transition:slide={{ duration: 200 }}>
      <button onclick={() => folderUpload.click()}><i class="fap-fix fa-solid fap-folder-arrow-up"></i>&nbsp;&nbsp;Upload folder</button>
      <button onclick={() => filesUpload.click()}><i class="fap-fix fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Upload files</button>
      <hr />
      <button onclick={() => (showCreateFolderModal = true)}><i class="fap-fix fa-solid fa-folder-plus"></i>&nbsp;&nbsp;Create folder</button>
      <button
        onclick={() => {
          addEditFileAction = { action: 'add' }
          showAddEditFileModal = true
        }}
      >
        <i class="fap-fix fa-solid fap-file-plus"></i>&nbsp;&nbsp;Create file
      </button>
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
        <tr class:focused={selectedItems.includes(file)} onclick={(e) => select(e, i)} ondblclick={() => openItem(file)}>
          <td class="icon"><i class={getFileIcon(file)}></i></td>
          <td class="name">{file.name}</td>
          <td class="size">{size(file)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if currentFilesAndFolders.length === 0}
    <p class="nothing">No files or folders</p>
  {/if}

  <div class="info">
    <p>
      {currentFilesAndFolders.length}
      {currentFilesAndFolders.length > 1 ? 'items' : 'item'}
      ({currentFilesAndFolders.filter((item) => item.type === 'FOLDER').length}
      {currentFilesAndFolders.filter((item) => item.type === 'FOLDER').length > 1 ? 'folders' : 'folder'},
      {currentFilesAndFolders.filter((item) => item.type !== 'FOLDER').length}
      {currentFilesAndFolders.filter((item) => item.type !== 'FOLDER').length > 1 ? 'files' : 'file'})
    </p>
    {#if selectedItems.length === 1}
      <p>1 item selected</p>
    {:else if selectedItems.length > 1}
      <p>{selectedItems.length} items selected</p>
    {/if}
  </div>
</div>

<input type="file" name="files" multiple bind:this={filesUpload} style="display: none" onchange={uploadItems} />
<input type="file" name="files" multiple bind:this={folderUpload} style="display: none" onchange={uploadItems} />

<!-- 
<CreateFolderModal bind:data bind:currentPath bind:show={showCreateFolderModal}></CreateFolderModal>
<AddEditFileModal bind:data bind:currentPath bind:action={addEditFileAction} bind:show={showAddEditFileModal}></AddEditFileModal> -->

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
      top: 12.5px;
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
      top: 12px;
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
      line-height: 15px;

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
    padding-bottom: 40px;

    p.nothing {
      text-align: center;
      margin-top: 20px;
      color: #606060;
    }

    div.info {
      position: absolute;
      bottom: 0;

      p {
        margin: 0 30px 0 0;
        font-size: 14px;
        color: var(--text-dark-color);
        display: inline-block;
      }
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
        max-width: 600px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &.size {
        text-align: right;
        color: #606060;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        min-width: 90px;
      }
    }
  }
</style>
