<script lang="ts">
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'
  import { afterUpdate, onMount } from 'svelte'
  import apiFilesUpdaterService from '../../../../services/api/api-filesupdater.service'
  import FilesUpdater from '../../../../components/FilesUpdater.svelte'

  export let data: PageData

  let filesUpload: HTMLInputElement
  let directoryUpload: HTMLInputElement
  let path: HTMLHeadingElement
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
    directoryUpload.setAttribute('directory', '')
    directoryUpload.setAttribute('webkitdirectory', '')
    directoryUpload.setAttribute('mozdirectory', '')

    oldPath = path.innerHTML

    path.addEventListener('scroll', () => {
      sL = path.scrollLeft > 0
      sR = path.scrollLeft < path.scrollWidth - path.clientWidth
    })
  })

  async function submit() {
    if (!filesUpload.files && !directoryUpload.files) return
    let files: File[] = []

    if (filesUpload.files) {
      for (let i = 0; i < filesUpload.files.length; i++) {
        files.push(filesUpload.files.item(i)!)
      }
    }
    if (directoryUpload.files) {
      for (let i = 0; i < directoryUpload.files.length; i++) {
        files.push(directoryUpload.files.item(i)!)
      }
    }
    ;(await apiFilesUpdaterService.uploadFiles('test456', files)).subscribe({
      next: (res) => {
        data.files = res.body.data!
      }
    })
  }
</script>

<svelte:head>
  <title>Files Updater • {$env.name} AdminTool</title>
</svelte:head>

<h2>Files Updater</h2>

<section class="section" style="position: relative;">
  <button class="primary right"><i class="fa-solid fa-plus" /></button>

  <h3 bind:this={path} class:scrolled-left={sL} class:scrolled-right={sR}>
    <button on:click={() => (currentPath = '')}>Files Updater</button>
    {#each currentPathSplit as dir, i}
      {#if dir !== ''}
        <i class="fa-solid fa-caret-right"></i>
        <button on:click={() => (currentPath = currentPathSplit.slice(0, i + 1).join('/') + '/')}>{dir}</button>
      {/if}
    {/each}
  </h3>

  <FilesUpdater bind:data bind:currentPath />
</section>

<input type="file" name="files[]" multiple bind:this={filesUpload} style="display: none" />
<input type="file" name="files[]" multiple bind:this={directoryUpload} style="display: none" />

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  i.fa-solid.fa-caret-right {
    margin: 0 2px;
  }

  button.right {
    width: 43.34px;
    opacity: 1 !important;
  }

  section.section {
    min-height: 200px;
  }

  h3 {
    max-width: 720px;
    overflow-x: auto;
    overflow-y: hidden;
    height: 53px;
    white-space: nowrap;

    button {
      display: inline;
      border-bottom: none;
      color: black;
      border-radius: 5px;
      padding: 10px 15px;
      font-size: 1.17em;
      font-weight: bold;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      font-family: 'Poppins';
      background: none;

      &:hover {
        color: var(--primary-color-hover);
        background: #eeeeee;
        color: black;
      }

      &.active {
        background: #f5f5f5;
      }
    }

    &.scrolled-left::before {
      content: '';
      position: absolute;
      top: 50px;
      left: 50px;
      width: 60px;
      height: 53px;
      background: linear-gradient(to right, white, transparent);
      z-index: 10;
    }

    &.scrolled-right::after {
      content: '';
      position: absolute;
      top: 50px;
      left: 710px;
      width: 60px;
      height: 53px;
      background: linear-gradient(to right, transparent, white);
      z-index: 10;
    }
  }
</style>
