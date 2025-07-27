<script lang="ts">
  import type { PageProps, SubmitFunction } from './$types'
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  import getEnv from '$lib/utils/env'
  import getUser from '$lib/utils/user'
  import { addNotification, notifications } from '$lib/stores/notifications'
  import { NotificationCode } from '$lib/utils/notifications'
  import { l } from '$lib/stores/language'
  import LoadingSplash from '../../../../components/layouts/LoadingSplash.svelte'
  import { UserStatus } from '@prisma/client'
  import UserManagement from '../../../../components/contents/UserManagement.svelte'
  import EditEMLAdminToolModal from '../../../../components/modals/EditEMLAdminToolModal.svelte'
  import { applyAction, enhance } from '$app/forms'
  import { pingServerAndReload, sleep } from '$lib/utils/utils'
  import { goto } from '$app/navigation'
  import { callAction } from '$lib/utils/call'

  let { data = $bindable() }: PageProps = $props()

  const env = getEnv()

  const updateWarning = `Are you sure you want to update EML AdminTool?
Please note that EML AdminTool, and therefore the Launchers too, will be unavailable during the update (about 1 minutes downtime).`

  let showLoader = $state(false)
  let showEditAdminToolModal = $state(false)

  let selectedUserId = $state(data.users[0].id)
  let updateMessage: undefined | string = $state(undefined)

  onMount(() => {
    if (window.location.search.includes('updated=true')) {
      const message = $l.notifications.EMLAT_UPDATED
      addNotification('INFO', message)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  })

  async function editAdminToolModal() {
    showEditAdminToolModal = true
  }

  async function update() {
    if (!confirm(updateWarning)) return
    showLoader = true
    document.body.style.overflow = 'hidden'
    const eventSource = new EventSource('/api/update')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.status === 'in-progress' || data.status === 'success') {
        if (data.event === 'up-to-date') {
          showLoader = false
          document.body.style.overflow = 'auto'
          const message = $l.notifications.EMLAT_UP_TO_DATE
          addNotification('INFO', message)
        } else if (data.event === 'fetching' || data.event === 'downloading') {
          updateMessage = 'Downloading update...'
        } else if (data.event === 'extracting' || data.event === 'script' || data.event === 'docker-load' || data.event === 'docker-volume') {
          updateMessage = 'Installing update...'
        } else if (data.event === 'docker-run') {
          updateMessage = 'Installing update'
          checkUpdateEnded()
        }
      } else if (data.status === 'error') {
        updateMessage = undefined
        showLoader = false
        const message = $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
        document.body.style.overflow = 'auto'
      }
    }

    return () => eventSource.close()
  }

  async function reset() {
    if (!confirm($l.dashboard.emlatSettings.resetEMLATWarning)) return
    if (!confirm($l.dashboard.emlatSettings.areYouSure)) return

    try {
      await callAction({ url: '/dashboard/emlat-settings', action: 'resetEMLAT', formData: new FormData() }, $l)
      showLoader = true
      pingServerAndReload()
    } catch (err) {
      console.error('Failed to reset:', err)
      // TODO
    }
  }

  async function checkUpdateEnded() {
    await sleep(5000)
    for (let i = 0; i < 12; i++) {
      try {
        const response = await fetch('/api/ping')
        if (response.ok) {
          window.location.href = '/dashboard/emlat-settings?updated=true'
          return
        } else {
          console.error('Ping failed:', response.statusText)
        }
      } catch (err) {
        console.error('Ping failed, retrying...', err)
      }
    }
  }
</script>

<svelte:head>
  <title>{$l.dashboard.emlatSettings.emlatSettings} • {env.name} AdminTool</title>
</svelte:head>

{#if showLoader}
  <div class="splash" transition:fade>
    <div>
      <LoadingSplash />
    </div>
    {#if updateMessage}
      <p transition:fade>{updateMessage}</p>
    {/if}
  </div>
{/if}

{#if showEditAdminToolModal}
  <EditEMLAdminToolModal bind:show={showEditAdminToolModal} />
{/if}

<h2>{$l.dashboard.emlatSettings.emlatSettings}</h2>

<section class="section">
  <button class="secondary right" onclick={editAdminToolModal} aria-label="Edit EML AdminTool"><i class="fa-solid fa-pen"></i></button>
  <h3>{$l.dashboard.information}</h3>

  <div class="container">
    <div>
      <p class="label">{$l.main.name}</p>
      <p>{data.environment.name}</p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.language}</p>
      <p>{$l.language}</p>
    </div>

    <div>
      <p class="label">{$l.main.pin}</p>
      <p><span class="pin">{data.environment.pin}</span></p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.nbUsers}</p>
      <p>{data.users.length}</p>
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.users}</h3>

  <div class="list-container">
    <div class="list">
      <p class="label">{$l.dashboard.emlatSettings.users}</p>
      {#each data.users as u}
        {#if u.status === UserStatus.ACTIVE}
          <button class="list" class:active={selectedUserId === u.id} onclick={() => (selectedUserId = u.id)}>
            {u.username}
          </button>
        {/if}
      {/each}

      <p class="label">{$l.dashboard.emlatSettings.pendingUsers}</p>
      {#each data.users as u}
        {#if u.status === UserStatus.PENDING}
          <button class="list" class:active={selectedUserId === u.id} onclick={() => (selectedUserId = u.id)}>
            {u.username}
          </button>
        {/if}
      {/each}

      <p class="label">{$l.dashboard.emlatSettings.wrongPinUsers}</p>
      {#each data.users as u}
        {#if u.status === UserStatus.SPAM}
          <button class="list" class:active={selectedUserId === u.id} onclick={() => (selectedUserId = u.id)}>
            {u.username}
          </button>
        {/if}
      {/each}

      <p class="label">{$l.dashboard.emlatSettings.deletedUsers}</p>
      {#each data.users as u}
        {#if u.status === UserStatus.DELETED}
          <button class="list" class:active={selectedUserId === u.id} onclick={() => (selectedUserId = u.id)}>
            {u.username}
          </button>
        {/if}
      {/each}
    </div>

    <div class="content-list">
      <UserManagement bind:selectedUserId {data} />
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.emlatSettings.update}</h3>

  <!-- TODO Uncomment this for stable release -->
  <!-- {#if data.update.currentVersion.includes('beta') || data.update.latestVersion.includes('alpha')}
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
      <p>EML AdminTool {data.update.currentVersion}</p>
    </div>

    <div>
      <p class="label">{$l.dashboard.emlatSettings.latestVersion}</p>
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
        <p class="release-date">
          {$l.dashboard.emlatSettings.releasedOn}
          {new Date(data.update.releaseDate).toLocaleDateString()} –
          <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/tag/v{data.update.latestVersion}" target="_blank">
            {$l.dashboard.emlatSettings.openGithub}&nbsp;&nbsp;<i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 12px"></i>
          </a>
        </p>
      </div>
      <div class="actions">
        <button class="secondary" onclick={update}>{$l.dashboard.emlatSettings.runUpdate}</button>
      </div>
    </div>
    <div class="changelogs">
      <div class="changelogs-in">
        {@html data.update.changelogs.markdownToHTML({ h1: 18, h2: 16.5, h3: 15.5, p: 14 })}
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
  <h3>{$l.dashboard.emlatSettings.dangerZone}</h3>

  <div class="container">
    <div>
      <button class="primary danger" onclick={reset}>{$l.dashboard.emlatSettings.reset}</button>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../../../static/scss/dashboard.scss';
  @use '../../../../../static/scss/list.scss';

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
