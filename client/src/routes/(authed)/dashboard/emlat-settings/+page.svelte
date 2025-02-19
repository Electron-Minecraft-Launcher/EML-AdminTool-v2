<script lang="ts">
  import type { User } from '../../../../../../shared/types/features/user'
  import { env, l } from '../../../../services/store'
  import EditAdminToolModal from '../../../../components/modals/EditAdminToolModal.svelte'
  import UserManagement from '../../../../components/UserManagement.svelte'
  import LoadingSplash from '../../../../components/layouts/LoadingSplash.svelte'
  import apiConfigureService from '../../../../services/api/api-configure.service'
  import type { PageData } from './$types'
  import utils from '../../../../services/utils'

  interface Props {
    data: PageData
  }

  let { data = $bindable() }: Props = $props()

  data.users = data.users.sort((a, b) => {
    return a.id! - b.id!
  })

  let splash: boolean = $state(false)

  let showEditAdminToolModal = $state(false)
  let selectedAccount: User = $state(data.users[0])

  async function editAdminToolModal() {
    showEditAdminToolModal = true
  }

  async function update() {
    if (
      confirm(`Are you sure you want to update the EML AdminTool?
Please note that the EML AdminTool, and therefore the Launchers too, will be unavailable during the update (about 2 minutes).`)
    ) {
      //...
    }
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
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="secondary right" onclick={editAdminToolModal}><i class="fa-solid fa-pen"></i></button>
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
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">Waiting users</p>
      {#each data.users as account}
        {#if account.status == 0}
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">Wrong-PIN users</p>
      {#each data.users as account}
        {#if account.status == -1}
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">Deleted users</p>
      {#each data.users as account}
        {#if account.status == -2}
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}
    </div>

    <div class="content-list">
      <UserManagement bind:selectedAccount accounts={data.users} />
    </div>
  </div>
</section>

<section class="section">
  <h3>Update</h3>

  <!-- {#if data.update.currentVersion.includes('beta') || data.update.latestVersion.includes('alpha')} -->
  <!-- <div class="no-update">
      <p><i class="fa-solid fa-times-circle"></i></p>
      <p>
        You are using a alpha/beta version of the EML AdminTool. This version is not linked to the update system, so you have to update manually.
        Please see <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/" target="_blank">GitHub</a> to get the latest version.
      </p>
    </div> -->
  <!-- {:else} -->
  <div class="container">
    <div>
      <p class="label">Current version</p>
      <p>EML AdminTool {data.update.currentVersion}</p>
    </div>

    <div>
      <p class="label">Latest version</p>
      <p>EML AdminTool {data.update.latestVersion}</p>
    </div>
  </div>

  {#if data.update.currentVersion != data.update.latestVersion}
    <div class="updater">
      <div style="line-height: 1;">
        <img src={data.update.logoUrl} alt="Version logo" />
      </div>
      <div>
        <p class="release-name"><b>EML AdminTool {data.update.latestVersion}</b></p>
        <p class="release-date">Released on {new Date(data.update.releaseDate).toLocaleDateString()}</p>
      </div>
      <div class="actions">
        <button class="secondary" onclick={update}>Update</button>
        <p>
          <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/tag/v{data.update.latestVersion}" target="_blank">
            See on GitHub...&nbsp;&nbsp;<i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </p>
      </div>
    </div>
    <div class="changelogs">
      {@html utils.markdownToHtml(data.update.changelogs, false, { h1: 18, h2: 16, h3: 15, p: 14 })}
    </div>
  {/if}
  <!-- {/if} -->
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
        <span class="storage-progress" style={'width: ' + (data.vps.storage[0] / data.vps.storage[1]) * 200 + 'px'}></span>
      </span>
      {Math.round((data.vps.storage[0] / data.vps.storage[1]) * 100)} %
    </div>
  </div>
</section>

<section class="section">
  <h3>Danger zone</h3>

  <div class="container">
    <div>
      <button class="primary danger" onclick={reset}>Reset</button>
    </div>
  </div>
</section>

<EditAdminToolModal bind:show={showEditAdminToolModal} />

<style lang="scss">
  @use '../../../../assets/scss/dashboard.scss';
  @use '../../../../assets/scss/list.scss';

  span.pin {
    filter: blur(5px);
    transition: filter 0.3s;

    &:hover {
      filter: blur(0px);
    }
  }

  div.no-update {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;

    p {
      margin: 0;

      i {
        font-size: 20px;
        color: var(--red-color);
      }
    }
  }

  div.updater {
    width: 100%;
    margin-top: 30px;
    display: flex;
    align-items: center;
    gap: 20px;

    p.release-name {
      font-size: 17px;
      margin-bottom: 3px;
    }

    p.release-date {
      font-size: 14px;
      color: var(--text-dark-color);
    }

    div.actions {
      display: flex;
      align-items: center;
      margin-left: auto;
      gap: 20px;

      button.secondary {
        margin-top: 0;
        display: inline-block;
      }

      p {
        margin: 0;
      }
    }

    img {
      width: 55px;
      height: 55px;
      border-radius: 15px;
    }
  }
  div.changelogs {
    margin-top: 20px;
    padding: 20px;
    border-radius: 5px;
    background: rgb(252, 252, 252);
    border: 1px solid rgb(240, 240, 240);
    height: 200px;
    overflow-y: auto;
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
