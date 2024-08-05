<script lang="ts">
  import Skeleton from '../../../../components/layouts/Skeleton.svelte'
  import type { User } from '../../../../../../shared/models/features/user.model'
  import { env, user, l } from '../../../../services/store'
  import EditAdminToolModal from '../../../../components/modals/EditAdminToolModal.svelte'
  import UserManagement from '../../../../components/UserManagement.svelte'
  import LoadingSplash from '../../../../components/layouts/LoadingSplash.svelte'
  import apiConfigureService from '../../../../services/api/api-configure.service'
  import type { PageData } from './$types'

  export let data: PageData

  data.users = data.users.sort((a, b) => {
    return a.id! - b.id!
  })

  let splash = false

  let showEditAdminToolModal = false
  let selectedAccount: User = data.users[0]

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
        ;(await apiConfigureService.deleteReset()).subscribe({
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
  <title>{$l.dashboard.emlatSettings.emlatSettings} • {$env.name} AdminTool</title>
</svelte:head>

{#if splash}
  <LoadingSplash transparent={true} />
{/if}

<h2>{$l.dashboard.emlatSettings.emlatSettings}</h2>

<section class="section">
  <button class="secondary right" on:click={editAdminToolModal}><i class="fa-solid fa-pen" /></button>
  <h3>{$l.dashboard.information}</h3>

  <div class="container">
    <div>
      <p class="label">{$l.main.name}</p>
      <p>{data.emlat.name}</p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.language}</p>
      <p>{$l.language}</p>
    </div>

    <div>
      <p class="label">{$l.main.pin}</p>
      <p><span class="pin">{data.emlat.pin}</span></p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.nbUsers}</p>
      <p>{data.emlat.nbUsers}</p>
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.users}</h3>

  <div class="list-container">
    <div class="list">
      <p class="label">Users</p>
      {#each data.users as account}
        {#if account.status == 1}
          <button class="list" class:active={selectedAccount == account} on:click={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">Waiting users</p>
      {#each data.users as account}
        {#if account.status == 0}
          <button class="list" class:active={selectedAccount == account} on:click={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">Wrong PIN users</p>
      {#each data.users as account}
        {#if account.status == -1}
          <button class="list" class:active={selectedAccount == account} on:click={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">Deleted users</p>
      {#each data.users as account}
        {#if account.status == -2}
          <button class="list" class:active={selectedAccount == account} on:click={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}
    </div>

    <div class="content-list">
      <UserManagement bind:selectedAccount />
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.vpsAndDocker}</h3>

  <div class="container">
    <div>
      <p class="label">{$l.dashboard.emlatSettings.dockerInfo}</p>
      <p>{data.vps.os}</p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.storage}</p>
      <span class="storage">
        <span class="storage-progress" style={'width: ' + (data.vps.storage[0] / data.vps.storage[1]) * 200 + 'px'} />
      </span>
      {Math.round((data.vps.storage[0] / data.vps.storage[1]) * 100)} %
    </div>
  </div>
</section>

<section class="section">
  <h3>Danger zone</h3>

  <div class="container">
    <div>
      <button class="primary danger" on:click={reset}>Reset</button>
    </div>
  </div>
</section>

<EditAdminToolModal bind:show={showEditAdminToolModal} />

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';
  @import '../../../../assets/scss/list.scss';

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
