<script lang="ts">
  import type { PageData } from './$types'
  import Skeleton from '$components/Skeleton.svelte'
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$, user$ } from '$services/store'
  import EditAdminToolModal from '$components/modals/EditAdminToolModal.svelte'

  export let data: PageData

  let env!: Env
  let l: typeof en | typeof fr
  let user: User

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  user$.subscribe((value) => {
    if (value) {
      user = value
    }
  })

  let showEditAdminToolModal = false

  async function editAdminToolModal() {
    showEditAdminToolModal = true
  }
</script>

<svelte:head>
  <title>{l.dashboard.emlatSettings.emlatSettings} • {env.name} AdminTool</title>
</svelte:head>

<h2>{l.dashboard.emlatSettings.emlatSettings}</h2>

<section class="section">
  <button class="secondary right" on:click={editAdminToolModal}><i class="fa-solid fa-pen" /></button>
  <h3>{l.dashboard.information}</h3>

  <div class="container">
    <div>
      <p class="label">{l.main.name}</p>
      {#if !data}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p>{data.emlat.name}</p>
      {/if}
    </div>

    <div>
      <p class="label">{l.dashboard.emlatSettings.language}</p>
      {#if !data}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p>{l.language}</p>
      {/if}
    </div>

    <div>
      <p class="label">{l.main.pin}</p>
      {#if !data}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p><span class="pin">{data.emlat.pin}</span></p>
      {/if}
    </div>

    <div>
      <p class="label">{l.dashboard.emlatSettings.nbUsers}</p>
      {#if !data}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p>{data.emlat.nbUsers}</p>
      {/if}
    </div>
  </div>
</section>

<section class="section">
  <h3>{l.dashboard.emlatSettings.users}</h3>

  <div class="container">
    
  </div>
</section>

<section class="section">
  <h3>{l.dashboard.emlatSettings.vps}</h3>

  <div class="container">
    <div>
      <p class="label">{l.dashboard.emlatSettings.os}</p>
      {#if !data}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p>{data.vps.os}</p>
      {/if}
    </div>

    <div>
      <p class="label">{l.dashboard.emlatSettings.storage}</p>
      {#if !data}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <span class="storage">
          <span class="storage-progress" style={'width: ' + data.vps.storage[0] / data.vps.storage[1] * 200 + 'px'}></span>
        </span>
        {Math.round(data.vps.storage[0] / data.vps.storage[1] * 100)} %
      {/if}
    </div>
  </div>
</section>

<EditAdminToolModal bind:show={showEditAdminToolModal} />

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  span.pin {
    filter: blur(5px);
    transition: filter 0.3s;

    &:hover {
      filter: blur(0px);
    }
  }

  span.storage {
    display: inline-block;
    width: 200px;
    height: 1px;
    margin-bottom: 5px;
    background: var(--border-color2);
    position: relative;
    margin-right: 10px;
    
    span.storage-progress {
      display: block;
      position: relative;
      height: 3px;
      top: -1px;
      background: var(--primary-color);
      border-radius: 3px;
    }
  }
</style>
