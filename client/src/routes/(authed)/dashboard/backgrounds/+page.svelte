<script lang="ts">
  import type { BackgroundsRes } from '../../../../../../shared/models/features/background.model'
  import ChangeMaintenanceStatusModal from '../../../../components/modals/ChangeMaintenanceStatusModal.svelte'
  import UploadEditBackgroundModal from '../../../../components/modals/UploadEditBackgroundModal.svelte'
  import UploadEditBackgroundModalcopy from '../../../../components/modals/UploadEditBackgroundModal.svelte'
  import apiBackgroundsService from '../../../../services/api/api-backgrounds.service'
  import apiMaintenanceService from '../../../../services/api/api-maintenance.service'
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'

  export let data: PageData

  let showUploadEditBackgroundModal = false
  let uploadEditBackgroundAction: { action: 'upload' } | { action: 'edit'; background: BackgroundsRes } = { action: 'upload' }

  async function activate(background: BackgroundsRes) {
    ;(await apiBackgroundsService.putActiveBackground(background.id!)).subscribe({
      next: (res) => {
        data.backgrounds = res.body.data!
      }
    })
  }

  async function deleteBackground(background: BackgroundsRes) {
    if (!confirm('Are you sure you want to delete this image? It will not be available in the news anymore.')) return
    ;(await apiBackgroundsService.deleteBackground(background.id!)).subscribe({
      next: (res) => {
        data.backgrounds = res.body.data!
      }
    })
  }
</script>

<svelte:head>
  <title>Backgrounds • {$env.name} AdminTool</title>
</svelte:head>

<h2>Backgrounds</h2>

<section class="section">
  <button
    class="secondary right"
    on:click={() => {
      uploadEditBackgroundAction = { action: 'upload' }
      showUploadEditBackgroundModal = true
    }}><i class="fa-solid fa-file-arrow-up"></i></button
  >

  <h3>Backgrounds list</h3>

  <div class="container">
    {#each data.backgrounds as background}
      <div style="background-image: url('{background.url}'" class="img" class:active={background.status == 1}>
        <div>
          {#if background.status != 1}
            <button on:click={() => activate(background)}><i class="fa-solid fa-bolt"></i>&nbsp;&nbsp;Activate</button><br />
          {/if}
          <button
            on:click={() => {
              uploadEditBackgroundAction = { action: 'edit', background: background }
              showUploadEditBackgroundModal = true
            }}><i class="fa-solid fa-ellipsis"></i></button
          >
          <button
            disabled={background.status == 1}
            title={background.status == 1 ? 'You cannot delete the active background.' : ''}
            class="remove"
            on:click={() => deleteBackground(background)}><i class="fa-solid fa-trash"></i></button
          >
        </div>
        <p class="title">{background.title}</p>
      </div>
    {:else}
      <p class="nothing">No background</p>
    {/each}
  </div>
</section>

<UploadEditBackgroundModal bind:data bind:action={uploadEditBackgroundAction} bind:show={showUploadEditBackgroundModal}></UploadEditBackgroundModal>

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  div.container {
    margin-top: 30px;
  }

  p.no-link {
    margin: 0px;
    display: inline-block;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }

  div.img {
    width: 280px;
    aspect-ratio: 4 / 3;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 5px;
    position: relative;
    margin-bottom: 30px;
    transition: all 0.1s;

    &.active {
      outline: 4px solid var(--primary-color);
    }

    p.title {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0;
      padding: 5px;
      background: #353535a1;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      color: white;
      font-weight: 500;
      font-size: 16px;
      text-align: center;
      z-index: 0;
    }

    div {
      position: absolute;
      display: flex;
      gap: 5px;
      width: 100%;
      height: 100%;
      align-items: center;
      vertical-align: middle;
      justify-content: center;
      background: #dfdfdfa1;
      border-radius: 5px;
      transition: opacity 0.3s;
      opacity: 0;
      z-index: 10;

      &:hover {
        opacity: 1;
      }
    }
  }

  button:not(.secondary) {
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
      background: #eeeeeeb7;
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
        background: #faeeeeb7;
      }
    }
  }
</style>
