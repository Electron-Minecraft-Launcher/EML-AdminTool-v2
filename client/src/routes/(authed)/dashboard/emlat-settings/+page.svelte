<script lang="ts">
  import type { User } from '../../../../../../shared/types/features/user'
  import { env, l } from '../../../../services/store'
  import EditAdminToolModal from '../../../../components/modals/EditAdminToolModal.svelte'
  import UserManagement from '../../../../components/UserManagement.svelte'
  import LoadingSplash from '../../../../components/layouts/LoadingSplash.svelte'
  import apiConfigureService from '../../../../services/api/api-configure.service'
  import type { PageData } from './$types'
  import utils from '../../../../services/utils'
  import { io } from 'socket.io-client'
  import cookiesService from '../../../../services/cookies.service'
  import { fade } from 'svelte/transition'
  import notificationsService from '../../../../services/notifications.service'
  import apiEnvService from '../../../../services/api/api-env.service'
  import { onMount } from 'svelte'

  interface Props {
    data: PageData
  }

  let { data = $bindable() }: Props = $props()

  let data_: PageData = $state(data)
  data_.users = data_.users.sort((a, b) => {
    return a.id! - b.id!
  })

  let splash: boolean = $state(false)

  let showEditAdminToolModal = $state(false)
  let selectedAccount: User = $state(data_.users[0])
  let updateMessage: undefined | string = $state(undefined)

  onMount(() => {
    if (window.location.search.includes('updated=true')) {
      notificationsService.update({ type: 'SUCCESS', code: `updating_success` })
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  })

  async function editAdminToolModal() {
    showEditAdminToolModal = true
  }

  async function update() {
    if (
      confirm(`Are you sure you want to update EML AdminTool?
Please note that EML AdminTool, and therefore the Launchers too, will be unavailable during the update (about 1 minutes downtime).`)
    ) {
      const socket = io({ auth: { token: cookiesService.get('JWT') } })
      socket.emit('update')
      splash = true
      document.body.style.overflow = 'hidden'

      socket.on('updating', (message: string) => {
        if (message == 'fetching' || message == 'downloading') {
          updateMessage = 'Downloading the update...'
        } else if (message == 'extracting' || message == 'script' || message == 'docker_load') {
          updateMessage = 'Installing the update...'
        } else if (message == 'docker_run') {
          updateMessage = 'Installing the update...'
          checkUpdateEnded()
        }
      })

      socket.on('updating_success', (message: string, args: any) => {
        if (message == 'up-to-date') {
          splash = false
          notificationsService.update({ type: 'SUCCESS', code: `updating_up-to-date` })
          document.body.style.overflow = 'auto'
        }
      })

      socket.on('updating_error', (message: string, args: any) => {
        updateMessage = undefined
        splash = false
        notificationsService.update({ type: 'ERROR', code: `updating_${message}` })
        document.body.style.overflow = 'auto'
      })
    }
  }

  async function reset() {
    if (
      confirm(`Are you sure you want to reset EML AdminTool? All the data will be lost and EML AdminTool will be reset to its initial state. This action is irreversible.
Moreover, be sure that nobody can access EML AdminTool during the reset: EML AdminTool is not protected during the setup!`)
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

  async function checkUpdateEnded() {
    ;(await apiEnvService.getEnv()).subscribe({
      next: async (resp) => {
        if (resp.body.data.version != data.update.latestVersion) {
          await utils.sleep(5000)
          checkUpdateEnded()
        } else {
          window.location.href = '/dashboard/emlat-settings?updated=true'
        }
      }
    })
  }
</script>

<svelte:head>
  <title>{$l.dashboard.emlatSettings.emlatSettings} • {$env.name} AdminTool</title>
</svelte:head>

{#if splash}
  <div class="splash" transition:fade>
    <div>
      <LoadingSplash transparent={false} />
    </div>
    {#if updateMessage}
      <p transition:fade>{updateMessage}</p>
    {/if}
  </div>
{/if}

<h2>{$l.dashboard.emlatSettings.emlatSettings}</h2>

<section class="section">
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="secondary right" onclick={editAdminToolModal}><i class="fa-solid fa-pen"></i></button>
  <h3>{$l.dashboard.information}</h3>

  <div class="container">
    <div>
      <p class="label">{$l.main.name}</p>
      <p>{data_.emlat.name}</p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.language}</p>
      <p>{$l.language}</p>
    </div>

    <div>
      <p class="label">{$l.main.pin}</p>
      <p><span class="pin">{data_.emlat.pin}</span></p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.nbUsers}</p>
      <p>{data_.emlat.nbUsers}</p>
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.users}</h3>

  <div class="list-container">
    <div class="list">
      <p class="label">{$l.dashboard.emlatSettings.users}</p>
      {#each data_.users as account}
        {#if account.status == 1}
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">{$l.dashboard.emlatSettings.waitingUsers}</p>
      {#each data_.users as account}
        {#if account.status == 0}
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">{$l.dashboard.emlatSettings.wrongPinUsers}</p>
      {#each data_.users as account}
        {#if account.status == -1}
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}

      <p class="label">{$l.dashboard.emlatSettings.deletedUsers}</p>
      {#each data_.users as account}
        {#if account.status == -2}
          <button class="list" class:active={selectedAccount.id == account.id} onclick={() => (selectedAccount = account)}>
            {account.name}
          </button>
        {/if}
      {/each}
    </div>

    <div class="content-list">
      <UserManagement bind:selectedAccount accounts={data_.users} />
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.update}</h3>

  <!-- TODO Uncomment this for stable release -->
  <!-- {#if data_.update.currentVersion.includes('beta') || data_.update.latestVersion.includes('alpha')}
    <div class="no-update">
      <p><i class="fa-solid fa-times-circle"></i></p>
      <p>
        You are using a alpha/beta version of EML AdminTool. This version is not linked to the update system, so you have to update manually.
        <br /> Please see <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/" target="_blank">GitHub</a> to get the latest version.
      </p>
    </div>
  {:else} -->
    <div class="container">
      <div>
        <p class="label">{$l.dashboard.emlatSettings.currentVersion}</p>
        <p>EML AdminTool {data_.update.currentVersion}</p>
      </div>

      <div>
        <p class="label">{$l.dashboard.emlatSettings.latestVersion}</p>
        <p>EML AdminTool {data_.update.latestVersion}</p>
      </div>
    </div>

    {#if data_.update.currentVersion != data_.update.latestVersion}
      <div class="updater">
        <div style="line-height: 1;">
          <img src={data_.update.logoUrl} alt="Version logo" />
        </div>
        <div>
          <p class="release-name"><b>EML AdminTool {data_.update.latestVersion}</b></p>
          <p class="release-date">{$l.dashboard.emlatSettings.releasedOn} {new Date(data_.update.releaseDate).toLocaleDateString()}</p>
        </div>
        <div class="actions">
          <button class="secondary" onclick={update}>{$l.dashboard.emlatSettings.runUpdate}</button>
          <p>
            <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/tag/v{data_.update.latestVersion}" target="_blank">
              {$l.dashboard.emlatSettings.seeOnGithub}&nbsp;&nbsp;<i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </p>
        </div>
      </div>
      <div class="changelogs">
        <div class="changelogs-in">
          {@html utils.markdownToHtml(data_.update.changelogs, { h1: 18, h2: 16.5, h3: 15.5, p: 14 })}
        </div>
      </div>
    {/if}
  <!-- {/if} -->
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.vpsAndDocker}</h3>

  <div class="container">
    <div>
      <p class="label">{$l.dashboard.emlatSettings.dockerInfo}</p>
      <p>{data_.vps.os}</p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.storage}</p>
      <span class="storage">
        <span class="storage-progress" style={'width: ' + (data_.vps.storage[0] / data_.vps.storage[1]) * 200 + 'px'}></span>
      </span>
      {Math.round((data_.vps.storage[0] / data_.vps.storage[1]) * 100)} %
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.dangerZone}</h3>

  <div class="container">
    <div>
      <button class="primary danger" onclick={reset}>{$l.dashboard.emlatSettings.reset}</button>
    </div>
  </div>
</section>

<EditAdminToolModal bind:show={showEditAdminToolModal} />

<style lang="scss">
  @use '../../../../assets/scss/dashboard.scss';
  @use '../../../../assets/scss/list.scss';

  div.splash {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    background-color: white;

    div {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 100px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      background-color: white;
    }

    p {
      padding-top: 20px;
      z-index: 1100;
    }
  }

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
    // justify-content: center;
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
      border-radius: 12px;
    }
  }

  div.changelogs {
    margin-top: 20px;
    padding: 20px;
    border-radius: 5px;
    background: rgb(253, 253, 253);
    border: 1px solid rgb(240, 240, 240);
    height: 400px;
    overflow-y: auto;

    div.changelogs-in {
      max-width: 900px;
      margin: 0 auto;
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
