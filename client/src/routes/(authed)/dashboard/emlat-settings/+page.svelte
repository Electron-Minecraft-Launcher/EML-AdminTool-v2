<script lang="ts">
  import type { PageData } from './$types'
  import Skeleton from '$components/Skeleton.svelte'
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$, user$ } from '$services/store'
  import EditAdminToolModal from '$components/modals/EditAdminToolModal.svelte'
  import UserManagement from '$components/UserManagement.svelte'
  import LoadingSplash from '$components/LoadingSplash.svelte'
  import ApiConfigureService from '$services/api/api-configure.service'

  export let data: PageData

  const apiConfigure = new ApiConfigureService()

  data.users = data.users.sort((a, b) => {
    return a.id! - b.id!
  })

  let env!: Env
  let l: typeof en | typeof fr
  let user: User
  let splash = false

  env$.subscribe((value) => {
    env = value
    l = value.language
  })

  user$.subscribe((value) => {
    user = value
  })

  let showEditAdminToolModal = false
  let selectedUser: User = data.users[0]

  async function editAdminToolModal() {
    showEditAdminToolModal = true
  }

  async function reset() {
    if (
      confirm(`Are you sure you want to reset the EML AdminTool? All the data will be lost and the EML AdminTool will be reset to its initial state. This action is irreversible.
Moreover, be sure that nobody can access the EML AdminTool during the reset: the EML AdminTool is not protected during the setup!`)
    ) {
      if (confirm('Are you really sure?')) {
        splash = true
        ;(await apiConfigure.deleteReset()).subscribe({
          finally: () => {
            splash = false
            window.location.href = '/'
          }
        })
      }
    }
  }
</script>

<svelte:head>
  <title>{l.dashboard.emlatSettings.emlatSettings} • {env.name} AdminTool</title>
</svelte:head>

{#if splash}
  <LoadingSplash transparent={true} />
{/if}

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

  <div class="list-container">
    <div class="list">
      <p class="label">Users</p>
      {#each data.users as user}
        {#if user.status == 1}
          <button
            class="list"
            class:active={selectedUser.id == user.id}
            on:click={() => {
              selectedUser = user
            }}
          >
            {user.name}
          </button>
        {/if}
      {/each}

      <p class="label">Waiting users</p>
      {#each data.users as user}
        {#if user.status == 0}
          <button
            class="list"
            class:active={selectedUser == user.id}
            on:click={() => {
              selectedUser = user
            }}
          >
            {user.name}
          </button>
        {/if}
      {/each}

      <p class="label">Wrong PIN users</p>
      {#each data.users as user}
        {#if user.status == -1}
          <button
            class="list"
            class:active={selectedUser == user.id}
            on:click={() => {
              selectedUser
            }}
          >
            {user.name}
          </button>
        {/if}
      {/each}

      <p class="label">Deleted users</p>
      {#each data.users as user}
        {#if user.status == -2}
          <button
            class="list"
            class:active={selectedUser == user.id}
            on:click={() => {
              selectedUser
            }}
          >
            {user.name}
          </button>
        {/if}
      {/each}
    </div>

    <div class="perms">
      <UserManagement user={selectedUser} />
    </div>
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
          <span class="storage-progress" style={'width: ' + (data.vps.storage[0] / data.vps.storage[1]) * 200 + 'px'} />
        </span>
        {Math.round((data.vps.storage[0] / data.vps.storage[1]) * 100)} %
      {/if}
    </div>
  </div>
</section>

<section class="section">
  <h3>Danger zone</h3>
  <!-- ! Translation -->

  <div class="container">
    <div>
      <button class="primary danger" on:click={reset}>Reset</button>
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

  div.list-container {
    display: flex;
    flex: auto;
    flex-wrap: nowrap;
    gap: 0 50px;
    // margin-top: 30px;

    div.list {
      display: block;
      flex: 1;
      width: 175px;
      overflow-x: hidden;
      min-height: 400px;
      max-height: 600px;
      overflow-y: auto;

      button.list {
        overflow-x: hidden;
        background: none;
        display: block;
        width: 175px;
        text-align: left;
        margin-top: 5px;

        &.active {
          background: #f5f5f5;
        }

        &:hover {
          background: #eeeeee;
        }
      }
    }

    div.perms {
      flex: calc(100% - 400px);
      position: relative;
    }
  }

  button.danger {
    margin-top: 30px;
    background: var(--red-color);
    box-shadow: 0 2px 0 rgb(107, 12, 12);
    color: var(--text-light-color);
    width: 120px;

    &:hover:not(:disabled) {
      background: rgb(216, 43, 43);
      box-shadow: 0 2px 0 rgb(184, 28, 28);
    }

    &:hover:active:not(:disabled) {
      box-shadow: 0 0 rgb(184, 28, 28);
      outline: 6px solid rgba(194, 5, 5, 0.2);
    }
  }
</style>