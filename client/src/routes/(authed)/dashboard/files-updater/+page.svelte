<script lang="ts">
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'
  import { afterUpdate, onMount } from 'svelte'
  import apiFilesUpdaterService from '../../../../services/api/api-filesupdater.service'
  import FilesUpdater from '../../../../components/FilesUpdater.svelte'

  export let data: PageData
  let ready = false

  getData()
  async function getData() {
    ;(await apiFilesUpdaterService.getFilesUpdater()).subscribe({
      next: (res) => {
        data.files = res.body.data!
        ready = true
      }
    })
  }

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
    oldPath = path.innerHTML

    path.addEventListener('scroll', () => {
      sL = path.scrollLeft > 0
      sR = path.scrollLeft < path.scrollWidth - path.clientWidth
    })
  })
</script>

<svelte:head>
  <title>Files Updater • {$env.name} AdminTool</title>
</svelte:head>

<h2>Files Updater</h2>

<section class="section" style="position: relative;">
  <h3 bind:this={path} class:scrolled-left={sL} class:scrolled-right={sR}>
    <button on:click={() => (currentPath = '')}>Files Updater</button>
    {#each currentPathSplit as dir, i}
      {#if dir !== ''}
        <i class="fa-solid fa-caret-right"></i>
        <button on:click={() => (currentPath = currentPathSplit.slice(0, i + 1).join('/') + '/')}>{dir}</button>
      {/if}
    {/each}
  </h3>

  <FilesUpdater bind:data bind:currentPath bind:ready />
</section>

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  i.fa-solid.fa-caret-right {
    margin: 0 2px;
  }

  h3 {
    max-width: 750px;
    overflow-x: auto;
    overflow-y: hidden;
    height: 53px;
    white-space: nowrap;

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
      left: 740px;
      width: 60px;
      height: 53px;
      background: linear-gradient(to right, transparent, white);
      z-index: 10;
    }
  }
</style>
