<script lang="ts">
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'
  import { afterUpdate, onMount } from 'svelte'
  import apiBootstraps from '../../../../services/api/api-bootstraps.service'

  export let data: PageData

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
</script>

<svelte:head>
  <title>Bootstraps • {$env.name} AdminTool</title>
</svelte:head>

<h2>Bootstraps</h2>

<section class="section" style="position: relative;">
  <button class="secondary right"><i class="fa-solid fa-file-arrow-up"></i></button>

  <h3>Bootstraps and Launcher version</h3>

  <div class="container">
    <div>
      <p class="label">Version</p>
      <p>{data.bootstraps.version}</p>
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-microsoft"></i>&nbsp;&nbsp;Windows Bootstrap</p>
      {#if data.bootstraps.win}
        <a on:click={() => download('win')}><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{data.bootstraps.win.name}</a>
      {:else}
        <p class="no-link">Not uploaded</p>
      {/if}
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-apple"></i>&nbsp;&nbsp;macOS Bootstrap</p>
      {#if data.bootstraps.mac}
        <a on:click={() => download('mac')}><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{data.bootstraps.mac.name}</a>
      {:else}
        <p class="no-link">Not uploaded</p>
      {/if}
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-linux"></i>&nbsp;&nbsp;Linux Bootstrap</p>
      {#if data.bootstraps.linux}
        <a on:click={() => download('lin')}><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{data.bootstraps.linux.name}</a>
      {:else}
        <p class="no-link">Not uploaded</p>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  div.container a {
    display: inline-block;
    margin-top: 5px;
    border-bottom: none;
    color: #1e1e1e;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    &:hover {
      color: var(--primary-color-hover);
      background: #eeeeee;
    }
  }

  p.no-link {
    padding: 10px 0;
  }
</style>
