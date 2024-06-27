<script lang="ts">
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'
  import { afterUpdate, onMount } from 'svelte'
  import apiFilesUpdaterService from '../../../../services/api/api-filesupdater.service'
  import FilesUpdater from '../../../../components/FilesUpdater.svelte'

  export let data: PageData

  let ready = false

  let isDragOver = false

  let path: HTMLSpanElement
  let oldPath: string

  let currentPath = ''

  $: currentPathSplit = currentPath.split('/')

  let sL = false
  let sR = false

  afterUpdate(() => {
    if (oldPath !== path.innerHTML) {
      oldPath = path.innerHTML
      path.scrollLeft = path.scrollWidth
    }
  })

  onMount(() => {
    oldPath = path.innerHTML

    path.addEventListener('scroll', () => {
      sL = path.scrollLeft > 0
      sR = path.scrollLeft < path.scrollWidth - path.clientWidth - 1
    })
  })

  const getData = async () => {
    ready = false
    ;(await apiFilesUpdaterService.getFilesUpdater()).subscribe({
      next: (res) => {
        data.files = res.body.data!
        ready = true
      }
    })
    if (!data.files.find((file) => `${file.path}${file.name}/` === currentPath)) {
      currentPath = ''
    }
  }
  getData()

  function handleLeave(e: any) {
    if (!e.currentTarget!.contains(e.relatedTarget)) {
      isDragOver = false
    }
  }

  async function handleDrop(e: DragEvent) {
    isDragOver = false
    ready = false
    if (!e.dataTransfer || e.dataTransfer.items.length === 0) return
    const items = await getAllEntries(e.dataTransfer.items)

    let files: File[] = []
    let filePromises: Promise<void>[] = []

    for (let i = 0; i < items.length; i++) {
      const filePromise = new Promise<void>((resolve) => {
        items[i].file((file) => {
          let newFile = new File([file.slice(0, file.size)], items[i].fullPath, { type: file.type })

          files.push(newFile)
          console.log('hello')
          resolve()
        })
      })

      filePromises.push(filePromise)
    }

    await Promise.all(filePromises)
    ;(await apiFilesUpdaterService.uploadFiles(currentPath, files)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        ready = true
      }
    })
  }

  async function getAllEntries(items: DataTransferItemList) {
    let entries: FileSystemFileEntry[] = []
    let queue: FileSystemEntry[] = []

    for (let i = 0; i < items.length; i++) {
      if (items[i]) queue.push(items[i].webkitGetAsEntry()!)
    }

    while (queue.length > 0) {
      const entry = queue.shift()
      if (entry) {
        if (entry.isFile) {
          entries.push(entry as FileSystemFileEntry)
        } else if (entry.isDirectory) {
          const reader = (entry as FileSystemDirectoryEntry).createReader()
          queue.push(...(await readAllDirectoryEntries(reader)))
        }
      }
    }

    return entries
  }

  async function readAllDirectoryEntries(reader: FileSystemDirectoryReader) {
    let entries = []
    let readEntries = await readDirectoryEntries(reader)

    while (readEntries.length > 0) {
      entries.push(...readEntries)
      readEntries = await readDirectoryEntries(reader)
    }

    return entries
  }

  async function readDirectoryEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
    try {
      return await new Promise((resolve, reject) => reader.readEntries(resolve, reject))
    } catch (error) {
      console.error(error)
      return []
    }
  }
</script>

<svelte:head>
  <title>Files Updater • {$env.name} AdminTool</title>
</svelte:head>

<h2>Files Updater</h2>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
  class="section"
  style="position: relative;"
  class:drag={isDragOver}
  on:dragover|preventDefault={() => (isDragOver = true)}
  on:dragenter|preventDefault={() => (isDragOver = true)}
  on:dragleave|preventDefault={handleLeave}
  on:drop|preventDefault={handleDrop}
>
  <h3>
    <button style="margin-right: 5px" on:click={getData}><i class="fa-solid fa-rotate-right"></i></button><span
      bind:this={path}
      class:scrolled-left={sL}
      class:scrolled-right={sR}
      ><button on:click={() => (currentPath = '')}>Files Updater</button>{#each currentPathSplit as dir, i}{#if dir !== ''}<i
            class="fa-solid fa-caret-right"
          ></i><button on:click={() => (currentPath = currentPathSplit.slice(0, i + 1).join('/') + '/')}>{dir}</button>
        {/if}
      {/each}
    </span>
  </h3>

  <FilesUpdater bind:data bind:currentPath bind:ready {getData} />
</section>

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  section.section {
    &.drag::after {
      content: '\e09a';
      font-family: 'FontAwesome';
      font-size: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgb(194, 81, 5);
      position: absolute;
      top: 10px;
      left: 10px;
      width: calc(100% - 26px);
      height: calc(100% - 26px);
      background: rgba(194, 81, 5, 0.25);
      border-radius: 7px;
      border: 3px dashed rgba(194, 81, 5, 0.75);
      z-index: 1000;
    }
  }

  h3 {
    span {
      display: inline-block;
      max-width: 730px;
      overflow-x: auto;
      overflow-y: hidden;
      height: 53px;
      white-space: nowrap;
      vertical-align: top;

      i.fa-solid.fa-caret-right {
        margin: 0 5px;
        display: inline-block;
        line-height: 29px;
        padding: 10px 0;
      }

      &.scrolled-left::before {
        content: '';
        position: absolute;
        top: 50px;
        left: 103px;
        width: 60px;
        height: 53px;
        background: linear-gradient(to right, white, transparent);
        z-index: 10;
      }

      &.scrolled-right::after {
        content: '';
        position: absolute;
        top: 50px;
        left: 774px;
        width: 60px;
        height: 53px;
        background: linear-gradient(to right, transparent, white);
        z-index: 10;
      }
    }

    button {
      display: inline;
      border-bottom: none;
      color: black;
      font-size: 18.72px;
      border-radius: 5px;
      padding: 10px 15px;
      font-weight: bold;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      font-family: 'Poppins';
      background: none;
      vertical-align: top;

      &:hover {
        color: var(--primary-color-hover);
        background: #eeeeee;
        color: black;
      }

      &.active {
        background: #f5f5f5;
      }
    }
  }
</style>
