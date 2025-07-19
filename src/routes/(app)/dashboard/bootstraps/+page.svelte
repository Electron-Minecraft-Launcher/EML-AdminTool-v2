<script lang="ts">
  import getEnv from '$lib/utils/env'
  import type { File as File_ } from '$lib/utils/types'
  import type { PageProps } from './$types'
  import ChangeBootstrapsFilesModal from '../../../../components/modals/ChangeBootstrapsFilesModal.svelte'

  let { data }: PageProps = $props()

  const env = getEnv()

  let showChangeBootstrapFileModal: boolean = $state(false)

  async function download(platform: 'win' | 'mac' | 'lin') {
    if (!(data.bootstraps[`${platform}File`] instanceof Error)) return
    const file = data.bootstraps[`${platform}File`] as File_
    try {
      const response = await fetch(file.url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = file.name
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error)
    }
  }

  async function deleteFile(platform: 'win' | 'mac' | 'lin') {
    // if (!data.bootstraps[platform]) return
    // if (!confirm('Are you sure you want to delete the bootstrap? It may cause issues with the Launcher.')) return
    // ;(await apiBootstrapsService.deleteBootstrap(platform)).subscribe({
    //   next: (res) => {
    //     data.bootstraps = res.body.data!
    //   }
    // })
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
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="secondary right" onclick={() => (showChangeBootstrapFileModal = true)}><i class="fa-solid fa-ellipsis"></i></button>

  <h3>Bootstraps and Launcher version</h3>

  <div class="container">
    <div>
      <p class="label">Version</p>
      <p class="no-link">{data.bootstraps.version || '-'}</p>
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-microsoft"></i>&nbsp;&nbsp;Windows Bootstrap</p>
      {#if data.bootstraps.winFile}
        <button onclick={() => download('win')}
          ><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{(data.bootstraps.winFile as File_).name}</button
        >
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="remove" onclick={() => deleteFile('win')}><i class="fa-solid fa-trash"></i></button>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-apple"></i>&nbsp;&nbsp;macOS Bootstrap</p>
      {#if data.bootstraps.macFile}
        <button onclick={() => download('mac')}
          ><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{(data.bootstraps.macFile as File_).name}</button
        >
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="remove" onclick={() => deleteFile('mac')}><i class="fa-solid fa-trash"></i></button>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>

    <div>
      <p class="label"><i class="fa-brands fa-linux"></i>&nbsp;&nbsp;Linux Bootstrap</p>
      {#if data.bootstraps.linFile}
        <button onclick={() => download('lin')}
          ><i class="fa-solid fa-cloud-arrow-down"></i>&nbsp;&nbsp;{(data.bootstraps.linFile as File_).name}</button
        >
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="remove" onclick={() => deleteFile('lin')}><i class="fa-solid fa-trash"></i></button>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../../../static/scss/dashboard.scss';

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
