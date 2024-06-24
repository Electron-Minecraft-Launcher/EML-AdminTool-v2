<script lang="ts">
  import { afterUpdate } from 'svelte'
  import type { File } from '../../../shared/models/features/filesupdater.model'
  import type { PageData } from '../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../services/api/api-filesupdater.service'
  import { l } from '../services/store'
  import LoadingSplash from './layouts/LoadingSplash.svelte'

  export let currentPath: string
  export let data: PageData
  export let ready: boolean

  let currentFilesAndFolders: File[] = []
  let selectedItems: File[] = []

  afterUpdate(() => {
    currentFiles = currentFilesAndFolders.filter((file) => file.type !== 'FOLDER')
    currentFolders = currentFilesAndFolders.filter((file) => file.type === 'FOLDER')
    currentFilesAndFoldersSorted = [...currentFolders, ...currentFiles]
  })
  
  $: if (data.files || currentPath) {
    currentFilesAndFolders = data.files.filter((file) => file.path === currentPath)
  }

  $: currentFiles = currentFilesAndFolders.filter((file) => file.type !== 'FOLDER')
  $: currentFolders = currentFilesAndFolders.filter((file) => file.type === 'FOLDER')
  $: currentFilesAndFoldersSorted = [...currentFolders, ...currentFiles]

  async function deleteItems() {
    if (confirm('Are you sure you want to delete these files/folders? Folders may contains subfolders.') === false) return
    const paths = selectedItems.map((file) => `${file.path}${file.name}`)
    ;(await apiFilesUpdaterService.deleteFiles(paths)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        selectedItems = []
        currentFilesAndFolders = data.files.filter((file) => file.path === currentPath)
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

  async function open(file: File) {
    if (file.type === 'FOLDER') {
      currentPath = `${file.path}${file.name}/`
    } else {
      // TODO: Embedded file editor
      const a = document.createElement('a')
      a.href = file.url
      a.download = file.name
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  function icon(file: File) {
    if (file.type === 'FOLDER') return 'fa-solid fa-folder'
    switch (file.name.split('.').slice(-1)[0]) {
      case 'pdf':
        return 'fa-regular fa-file-pdf'
      case 'txt':
        return 'fa-regular fa-file-line'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return 'fa-regular fa-image'
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
        return 'fa-regular fa-file-zipper'
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
        return 'fa-regular fa-file-word'
      case 'xls':
      case 'xlsx':
      case 'ods':
      case 'csv':
        return 'fa-regular fa-file-excel'
      case 'ppt':
      case 'pptx':
      case 'odp':
        return 'fa-regular fa-file-powerpoint'
      case 'exe':
      case 'msi':
      case 'ssh':
      case 'sh':
      case 'bat':
      case 'cmd':
      case 'ps1':
        return 'fa-regular fa-file-terminal'
      default:
        return 'fa-regular fa-file'
    }
  }

  function size(file: File) {
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
    if (selectedItems && e.target && !e.target.closest('.explorer tbody tr')) {
      selectedItems = []
    }
  }}
/>

<button class="primary small" style="margin-right: 30px"><i class="fa-solid fa-plus" />&nbsp;&nbsp;Upload elements</button>

<button class="secondary small" disabled={selectedItems.length !== 1}><i class="fa-solid fa-download"></i>&nbsp;&nbsp;Download</button>
<button class="secondary small" disabled={selectedItems.length !== 1}><i class="fa-solid fa-i-cursor"></i>&nbsp;&nbsp;Rename</button>
<button class="secondary small" disabled={selectedItems.length === 0} on:click={deleteItems}
  ><i class="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete</button
>

<div class="explorer">
  {#if !ready}
    <LoadingSplash></LoadingSplash>
  {:else}
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
      <p>No files or folders</p>
    {/if}
  {/if}
</div>

<style lang="scss">
  div.explorer {
    min-height: 130px;
    position: relative;
    margin-top: 30px;
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
