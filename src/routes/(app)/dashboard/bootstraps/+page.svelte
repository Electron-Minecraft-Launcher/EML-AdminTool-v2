<script lang="ts">
  import getEnv from '$lib/utils/env'
  import type { File as File_ } from '$lib/utils/types'
  import type { PageProps } from './$types'
  import ChangeBootstrapsFilesModal from '../../../../components/modals/ChangeBootstrapsFilesModal.svelte'
  import LoadingSplash from '../../../../components/layouts/LoadingSplash.svelte'
  import { l } from '$lib/stores/language'
  import { callAction } from '$lib/utils/call'
  import { invalidateAll } from '$app/navigation'

  let { data }: PageProps = $props()

  const env = getEnv()

  // let bootstraps = $state(data.bootstraps)
  let showLoader = $state(false)
  let showChangeBootstrapFileModal: boolean = $state(false)

  async function download(platform: 'win' | 'mac' | 'lin') {
    if (!data.bootstraps[`${platform}File`]) return
    const file = data.bootstraps[`${platform}File`] as File_
    try {
      const response = await fetch(file.url)
      if (!response.ok) throw new Error('Failed to download file')

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = file.name
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      // TODO
    }
  }

  async function deleteFile(platform: 'win' | 'mac' | 'lin') {
    const loaderPlatformName = { win: 'Windows', mac: 'macOS', lin: 'Linux' }[platform]
    if (!confirm(`Are you sure you want to delete ${loaderPlatformName} Bootstrap?`)) return

    showLoader = true
    const formData = new FormData()
    formData.append('platform', platform)

    await callAction({ url: '/dashboard/bootstraps', action: 'deleteBootstrap', formData }, $l)
    invalidateAll()
    showLoader = false
  }
</script>

<svelte:head>
  <title>Bootstraps • {env.name} AdminTool</title>
</svelte:head>

{#if showChangeBootstrapFileModal}
  <ChangeBootstrapsFilesModal bind:show={showChangeBootstrapFileModal} bootstraps={data.bootstraps} />
{/if}

<h2>Bootstraps</h2>

<section class="section" style="position: relative;">
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}
  <button class="secondary right" onclick={() => (showChangeBootstrapFileModal = true)} aria-label="Change Bootstrap Files">
    <i class="fa-solid fa-ellipsis"></i>
  </button>

  <h3>Bootstraps and Launcher version</h3>

  <div class="container">
    <div>
      <p class="label">Version</p>
      <p class="no-link">{data.bootstraps.version || '-'}</p>
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-microsoft"></i>&nbsp;&nbsp;Windows Bootstrap</p>
      <div class="buttons">
        {#if data.bootstraps.winFile}
          <button onclick={() => download('win')}>
            <i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{(data.bootstraps.winFile as File_).name}
          </button>
          <button class="remove" onclick={() => deleteFile('win')} aria-label="Delete Windows Bootstrap"><i class="fa-solid fa-trash"></i></button>
        {:else}
          <p class="no-link">-</p>
        {/if}
      </div>
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-apple"></i>&nbsp;&nbsp;macOS Bootstrap</p>
      <div class="buttons">
        {#if data.bootstraps.macFile}
          <button onclick={() => download('mac')}>
            <i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{(data.bootstraps.macFile as File_).name}
          </button>
          <button class="remove" onclick={() => deleteFile('mac')} aria-label="Delete macOS Bootstrap"><i class="fa-solid fa-trash"></i></button>
        {:else}
          <p class="no-link">-</p>
        {/if}
      </div>
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-linux"></i>&nbsp;&nbsp;Linux Bootstrap</p>
      <div class="buttons">
        {#if data.bootstraps.linFile}
          <button onclick={() => download('lin')}>
            <i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{(data.bootstraps.linFile as File_).name}
          </button>
          <button class="remove" onclick={() => deleteFile('lin')} aria-label="Delete Linux Bootstrap"><i class="fa-solid fa-trash"></i></button>
        {:else}
          <p class="no-link">-</p>
        {/if}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../../../static/scss/dashboard.scss';

  div.container {
    div.buttons {
      display: flex;
    }

    button {
      display: inline-block;
      margin-top: 0;
      border-bottom: none;
      color: #1e1e1e;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 230px;
      vertical-align: bottom;
      font-family: 'Poppins';
      background: none;
      line-height: 15px;

      &:hover {
        background: #eeeeee;
      }

      &.remove {
        display: inline-block;
        border-bottom: none;
        position: relative;
        background: none;
        color: var(--red-color);
        vertical-align: middle;

        &:hover {
          background: #faeeee;
        }
      }
    }
  }
</style>
