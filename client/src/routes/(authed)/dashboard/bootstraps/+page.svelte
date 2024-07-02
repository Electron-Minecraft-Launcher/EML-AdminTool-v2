<script lang="ts">
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'
  import { afterUpdate, onMount } from 'svelte'
  import apiBootstrapsService from '../../../../services/api/api-bootstraps.service'
  import ChangeBootstrapFilesModal from '../../../../components/modals/ChangeBootstrapFilesModal.svelte'

  export let data: PageData

  let showChangeBootstrapFileModal = false

  async function download(platform: 'win' | 'mac' | 'lin') {
    if (!data.bootstraps[platform]) return
    const file = data.bootstraps[platform]
    try {
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
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error)
    }
  }

  async function deleteFile(platform: 'win' | 'mac' | 'lin') {
    if (!data.bootstraps[platform]) return
    if (!confirm('Are you sure you want to delete the bootstrap? It may cause issues with the Launcher.')) return
    ;(await apiBootstrapsService.deleteBootstrap(platform)).subscribe({
      next: (res) => {
        data.bootstraps = res.body.data!
      }
    })
  }
</script>

<svelte:head>
  <title>Bootstraps • {$env.name} AdminTool</title>
</svelte:head>

<h2>Bootstraps</h2>

<section class="section" style="position: relative;">
  <button class="secondary right" on:click={() => (showChangeBootstrapFileModal = true)}><i class="fa-solid fa-ellipsis"></i></button>

  <h3>Bootstraps and Launcher version</h3>

  <div class="container">
    <div>
      <p class="label">Version</p>
      <p class="no-link">{data.bootstraps.version || '-'}</p>
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-microsoft"></i>&nbsp;&nbsp;Windows Bootstrap</p>
      {#if data.bootstraps.win}
        <button on:click={() => download('win')}><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{data.bootstraps.win.name}</button>
        <button class="remove" on:click={() => deleteFile('win')}><i class="fa-solid fa-trash"></i></button>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-apple"></i>&nbsp;&nbsp;macOS Bootstrap</p>
      {#if data.bootstraps.mac}
        <button on:click={() => download('mac')}><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{data.bootstraps.mac.name}</button>
        <button class="remove" on:click={() => deleteFile('mac')}><i class="fa-solid fa-trash"></i></button>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-linux"></i>&nbsp;&nbsp;Linux Bootstrap</p>
      {#if data.bootstraps.lin}
        <button on:click={() => download('lin')}><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{data.bootstraps.lin.name}</button>
        <button class="remove" on:click={() => deleteFile('lin')}><i class="fa-solid fa-trash"></i></button>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>
  </div>
</section>

<ChangeBootstrapFilesModal bind:data bind:show={showChangeBootstrapFileModal} />

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  div.container button {
    display: inline-block;
    margin-top: 0;
    border-bottom: none;
    color: #1e1e1e;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 250px;
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
      margin-left: 5px;
      position: relative;
      background: none;
      color: var(--red-color);
      vertical-align: middle;

      &:hover {
        background: #faeeee;
      }
    }
  }
</style>
